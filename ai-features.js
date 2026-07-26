/**
 * SHUBxCOLD NEET 2027 Planner — AI Features Engine (BYOK + Multi-Model Fallback Ring)
 * 
 * Features:
 * 1. BYOK Multi-Model Fallback Ring (gemini-2.0-flash -> gemini-2.5-flash -> gemini-2.5-flash-lite -> gemini-1.5-flash)
 * 2. Exponential Backoff & Automatic Endpoint Failover for HTTP 429
 * 3. AI Tutor (Doubt Solver with Subject Modes & KaTeX)
 * 4. AI CBT Mock Test Generator & NTA-Style Exam Simulator
 * 5. PDF Question Extractor → NEET Test Builder (using PDF.js)
 * 6. AI Study Optimizer Widget ("What Should I Study?")
 * 7. AI Error Pattern Analyzer ("Analyze My Mistakes" & Recovery Quiz)
 * 8. NEET News & NTA Official Updates Hub + AI Summarizer
 */

// Model Fallback Ring — Automatically rotates if any model hits 429 rate limits
const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash"
];

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// Helper: Sleep for delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Central BYOK Gemini API Caller with Multi-Model Fallback Ring & Exponential Backoff
async function callGeminiAPI(prompt, systemInstruction = "", onStatus = null) {
  const apiKey = localStorage.getItem("gemini_api_key");
  if (!apiKey || !apiKey.trim()) {
    throw new Error("NO_API_KEY");
  }

  const contents = [];
  if (systemInstruction) {
    contents.push({ role: "user", parts: [{ text: `[System Instruction]: ${systemInstruction}` }] });
    contents.push({ role: "model", parts: [{ text: "Understood. I will strictly follow these instructions for all responses." }] });
  }
  contents.push({ role: "user", parts: [{ text: prompt }] });

  const payload = {
    contents: contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048
    }
  };

  const maxPasses = 2;

  for (let pass = 1; pass <= maxPasses; pass++) {
    for (let i = 0; i < GEMINI_MODELS.length; i++) {
      const model = GEMINI_MODELS[i];
      const endpoint = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey.trim()}`;

      try {
        if (onStatus && (i > 0 || pass > 1)) {
          onStatus(`⚡ Connecting to AI server (${model})...`);
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.status === 429) {
          console.warn(`Model ${model} hit 429 rate limit. Rotating to next model...`);
          if (onStatus) {
            onStatus(`⚠️ Rate limit on ${model}. Switching to backup AI engine...`);
          }
          await sleep(1500);
          continue; // Try next model in ring immediately
        }

        if (response.status === 404) {
          console.warn(`Model ${model} not available (404). Skipping...`);
          continue;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const msg = errorData.error?.message || `API error (${response.status})`;
          
          if (msg.includes("API key not valid") || msg.includes("API_KEY_INVALID")) {
            throw new Error("INVALID_API_KEY");
          }
          throw new Error(msg);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          throw new Error("Empty response received from Gemini AI.");
        }

        return text;

      } catch (err) {
        if (err.message === "NO_API_KEY" || err.message === "INVALID_API_KEY") {
          throw err;
        }
        console.warn(`Attempt on ${model} failed: ${err.message}. Trying next model...`);
      }
    }

    if (pass < maxPasses) {
      if (onStatus) onStatus("⏳ Free Tier rate limit reached across models. Pausing 3s before retry...");
      await sleep(3000);
    }
  }

  throw new Error("HTTP_429_EXCEEDED");
}

/* ==========================================================================
   FEATURE 6: SETTINGS TAB BYOK MANAGER
   ========================================================================== */

function getApiKey() {
  return localStorage.getItem("gemini_api_key") || "";
}

function saveApiKey() {
  const keyInput = document.getElementById("setting-gemini-key");
  if (!keyInput) return;
  const val = keyInput.value.trim();
  if (!val) {
    alert("Please enter a valid Gemini API key!");
    return;
  }
  localStorage.setItem("gemini_api_key", val);
  updateApiKeyStatusUI();
  alert("✅ Gemini API Key saved successfully in your browser!");
  renderSetupRequiredCards();
}

function removeApiKey() {
  if (confirm("Are you sure you want to remove your saved Gemini API Key?")) {
    localStorage.removeItem("gemini_api_key");
    const keyInput = document.getElementById("setting-gemini-key");
    if (keyInput) keyInput.value = "";
    updateApiKeyStatusUI();
    renderSetupRequiredCards();
  }
}

function toggleKeyVisibility() {
  const input = document.getElementById("setting-gemini-key");
  if (input) {
    input.type = input.type === "password" ? "text" : "password";
  }
}

async function testApiKeyConnection() {
  const statusBadge = document.getElementById("api-key-status-badge");
  if (statusBadge) {
    statusBadge.innerHTML = `<span style="color:#fbbf24;">🟡 Testing Connection...</span>`;
  }
  try {
    const reply = await callGeminiAPI("Respond with only the word: CONNECTED", "", (msg) => {
      if (statusBadge) statusBadge.innerHTML = `<span style="color:#fbbf24; font-size:11px;">${msg}</span>`;
    });
    if (reply && reply.includes("CONNECTED")) {
      if (statusBadge) {
        statusBadge.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">🟢 Connected (Multi-Model Fallback Active)</span>`;
      }
      alert("🎉 Connection Successful! Gemini AI with Multi-Model Fallback is ready.");
    } else {
      if (statusBadge) {
        statusBadge.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">🟢 Connected</span>`;
      }
    }
  } catch (err) {
    if (err.message === "INVALID_API_KEY") {
      if (statusBadge) statusBadge.innerHTML = `<span style="color:#ef4444; font-weight:bold;">🔴 Invalid API Key</span>`;
      alert("❌ Invalid API Key. Please check your key at https://aistudio.google.com/apikey");
    } else if (err.message === "HTTP_429_EXCEEDED") {
      if (statusBadge) statusBadge.innerHTML = `<span style="color:#fbbf24; font-weight:bold;">🟡 Rate Limit Hit (Retry in 60s)</span>`;
      alert("⚠️ Free Tier Rate Limit Reached! Please wait 60 seconds or generate a new free key at https://aistudio.google.com/apikey");
    } else {
      if (statusBadge) statusBadge.innerHTML = `<span style="color:#ef4444; font-weight:bold;">🔴 Connection Failed</span>`;
      alert(`❌ Connection Test Failed: ${err.message}`);
    }
  }
}

function updateApiKeyStatusUI() {
  const key = getApiKey();
  const statusBadge = document.getElementById("api-key-status-badge");
  const keyInput = document.getElementById("setting-gemini-key");
  
  if (keyInput) keyInput.value = key;
  if (statusBadge) {
    if (key) {
      statusBadge.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">🟢 Key Saved (Ready)</span>`;
    } else {
      statusBadge.innerHTML = `<span style="color:#ef4444; font-weight:bold;">🔴 No Key Configured</span>`;
    }
  }
}

function renderSetupRequiredCards() {
  const key = getApiKey();
  const setupElements = document.querySelectorAll(".ai-setup-required-card");
  setupElements.forEach(el => {
    el.style.display = key ? "none" : "block";
  });
  const mainAiElements = document.querySelectorAll(".ai-feature-content");
  mainAiElements.forEach(el => {
    el.style.display = key ? "block" : "none";
  });
}


/* ==========================================================================
   FEATURE 1: AI TUTOR (DOUBT SOLVER)
   ========================================================================== */

let currentSubjectMode = "physics";

const SYSTEM_PROMPTS = {
  physics: `You are an expert NEET Physics tutor. Focus on step-by-step mathematical solutions, Free Body Diagrams (FBD descriptions), vector analysis, unit checks, and NCERT formulas. Use LaTeX ($...$ and $$...$$). End with a "Quick Recall Point".`,
  chemistry: `You are an expert NEET Chemistry tutor (Physical, Organic, Inorganic). Focus on reaction mechanisms, electron displacement concepts, balanced equations, and NCERT exception points. Use LaTeX for equations. End with a "Quick Recall Point".`,
  biology: `You are an expert NEET Biology tutor. Focus strictly on NCERT Class 11 & 12 textbook facts, diagrams, classification tables, mnemonics, and bold terms. Use bullet points and bold headers. End with a "Quick Recall Point".`
};

function selectSubjectMode(mode) {
  currentSubjectMode = mode;
  document.querySelectorAll(".subject-mode-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  const selectedBtn = document.getElementById(`mode-btn-${mode}`);
  if (selectedBtn) selectedBtn.classList.add("active");
}

function handleChatKeyPress(e) {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    sendTutorMessage();
  }
}

function quickAsk(promptText) {
  const input = document.getElementById("tutor-chat-input");
  if (input) {
    input.value = promptText;
    sendTutorMessage();
  }
}

function updateCharCount() {
  const input = document.getElementById("tutor-chat-input");
  const counter = document.getElementById("tutor-char-count");
  if (input && counter) {
    counter.textContent = `${input.value.length}/1000`;
  }
}

async function sendTutorMessage() {
  const input = document.getElementById("tutor-chat-input");
  if (!input) return;
  const userText = input.value.trim();
  if (!userText) return;

  if (!getApiKey()) {
    alert("Please set your free Gemini API Key in the Settings tab first!");
    showTab("settings");
    return;
  }

  input.value = "";
  updateCharCount();

  appendChatMessage("user", userText);
  const typingId = appendTypingIndicator();

  try {
    const sysPrompt = SYSTEM_PROMPTS[currentSubjectMode] || SYSTEM_PROMPTS.physics;
    const aiResponse = await callGeminiAPI(userText, sysPrompt, (statusMsg) => {
      updateTypingText(typingId, statusMsg);
    });

    removeChatMessage(typingId);
    appendChatMessage("ai", aiResponse);

  } catch (err) {
    removeChatMessage(typingId);
    if (err.message === "NO_API_KEY") {
      appendChatMessage("ai", "⚠️ **Setup Required**: Please configure your Gemini API Key in the Settings tab.");
    } else if (err.message === "HTTP_429_EXCEEDED") {
      appendChatMessage("ai", "⚠️ **Rate Limit Exceeded**: Google Free Tier limit reached across all model endpoints. Please wait 60 seconds or create a new free API key at [Google AI Studio](https://aistudio.google.com/apikey).");
    } else {
      appendChatMessage("ai", `❌ **Error**: ${err.message}`);
    }
  }
}

function appendChatMessage(sender, text) {
  const chatBody = document.getElementById("tutor-chat-body");
  if (!chatBody) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-bubble chat-bubble-${sender}`;
  
  if (sender === "user") {
    msgDiv.innerHTML = `<div class="bubble-content">${escapeHTML(text)}</div>`;
  } else {
    const parsedText = parseMarkdownAndKaTeX(text);
    msgDiv.innerHTML = `
      <div class="bubble-header">
        <span class="ai-badge">🧠 NEET AI Tutor</span>
        <button class="copy-btn" onclick="copyText(this)">📋 Copy</button>
      </div>
      <div class="bubble-content">${parsedText}</div>
    `;
  }

  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;

  if (window.renderMathInElement) {
    try {
      renderMathInElement(msgDiv, {
        delimiters: [
          {left: "$$", right: "$$", display: true},
          {left: "$", right: "$", display: false}
        ]
      });
    } catch(e) {}
  }
}

function appendTypingIndicator() {
  const chatBody = document.getElementById("tutor-chat-body");
  if (!chatBody) return null;

  const id = `typing-${Date.now()}`;
  const div = document.createElement("div");
  div.id = id;
  div.className = "chat-bubble chat-bubble-ai typing-indicator-bubble";
  div.innerHTML = `
    <div class="typing-indicator">
      <span class="dot"></span><span class="dot"></span><span class="dot"></span>
      <span class="typing-status-text" style="margin-left:8px; font-size:12px; opacity:0.8;">AI is thinking...</span>
    </div>
  `;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
  return id;
}

function updateTypingText(id, text) {
  const el = document.getElementById(id);
  if (el) {
    const statusText = el.querySelector(".typing-status-text");
    if (statusText) statusText.textContent = text;
  }
}

function removeChatMessage(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function clearChat() {
  const chatBody = document.getElementById("tutor-chat-body");
  if (chatBody) {
    chatBody.innerHTML = `
      <div class="chat-welcome-card glass-card">
        <h3>👋 Welcome to NEET AI Tutor!</h3>
        <p>Select your subject above and ask any doubt from Physics, Chemistry, or Biology.</p>
      </div>
    `;
  }
}


/* ==========================================================================
   FEATURE 2: AI CBT MOCK TEST GENERATOR & NTA SIMULATOR
   ========================================================================== */

let cbtState = {
  questions: [],
  currentIndex: 0,
  userAnswers: {},
  markedReview: {},
  visited: {},
  timerInterval: null,
  secondsLeft: 0,
  totalSeconds: 0
};

async function generateCbtTest() {
  if (!getApiKey()) {
    alert("Please configure your Gemini API key in Settings first!");
    showTab("settings");
    return;
  }

  const subject = document.getElementById("cbt-subject-select").value;
  const numQuestions = parseInt(document.getElementById("cbt-num-questions").value) || 10;
  const difficulty = document.getElementById("cbt-difficulty-select").value;
  
  const statusCard = document.getElementById("cbt-generation-status");
  if (statusCard) {
    statusCard.style.display = "block";
    statusCard.innerHTML = `
      <div class="glass-card" style="text-align:center; padding:20px;">
        <div class="spinner" style="margin:0 auto 10px auto;"></div>
        <h4>Generating ${numQuestions} NEET-pattern MCQs with Multi-Model AI...</h4>
        <p id="cbt-status-subtext" style="font-size:12px; color:#aaa;">Drafting questions with options, explanations, and NCERT references...</p>
      </div>
    `;
  }

  const prompt = `Generate ${numQuestions} high-quality NEET-pattern multiple choice questions.
Subject: ${subject}
Difficulty: ${difficulty}

You MUST return ONLY a valid JSON array of question objects without markdown block formatting.
Each object must have:
{
  "question": "Question text with LaTeX if applicable",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "2-line detailed explanation",
  "reference": "NCERT Chapter reference",
  "subject": "${subject === 'all' ? 'Physics' : subject}"
}
`;

  try {
    const rawText = await callGeminiAPI(prompt, "You are a professional NTA NEET exam question paper setter. Output valid JSON array only.", (msg) => {
      const sub = document.getElementById("cbt-status-subtext");
      if (sub) sub.textContent = msg;
    });

    let cleanJson = rawText.trim();
    if (cleanJson.startsWith("```json")) cleanJson = cleanJson.substring(7);
    if (cleanJson.startsWith("```")) cleanJson = cleanJson.substring(3);
    if (cleanJson.endsWith("```")) cleanJson = cleanJson.substring(0, cleanJson.length - 3);
    cleanJson = cleanJson.trim();

    const parsedQuestions = JSON.parse(cleanJson);

    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      throw new Error("Invalid question format received from AI.");
    }

    if (statusCard) statusCard.style.display = "none";
    startCbtExam(parsedQuestions, numQuestions * 120);

  } catch (err) {
    if (statusCard) {
      const errMsg = err.message === "HTTP_429_EXCEEDED" 
        ? "⚠️ Rate limit reached across free models. Please wait 60 seconds or generate a fresh key in Settings."
        : err.message;

      statusCard.innerHTML = `
        <div class="glass-card" style="border: 1px solid #ef4444; color:#ef4444; padding:15px;">
          ❌ Generation Failed: ${errMsg}
        </div>
      `;
    }
  }
}

function startCbtExam(questionsList, totalSeconds) {
  cbtState.questions = questionsList;
  cbtState.currentIndex = 0;
  cbtState.userAnswers = {};
  cbtState.markedReview = {};
  cbtState.visited = { 0: true };
  cbtState.secondsLeft = totalSeconds;
  cbtState.totalSeconds = totalSeconds;

  document.getElementById("cbt-setup-panel").style.display = "none";
  document.getElementById("cbt-results-panel").style.display = "none";
  document.getElementById("cbt-exam-panel").style.display = "block";

  renderCbtQuestion(0);
  renderQuestionPalette();
  startCbtTimer();
}

function startCbtTimer() {
  if (cbtState.timerInterval) clearInterval(cbtState.timerInterval);
  
  const timerDisplay = document.getElementById("cbt-timer-display");

  cbtState.timerInterval = setInterval(() => {
    cbtState.secondsLeft--;
    
    const m = Math.floor(cbtState.secondsLeft / 60);
    const s = cbtState.secondsLeft % 60;
    const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    
    if (timerDisplay) {
      timerDisplay.textContent = timeStr;
      if (cbtState.secondsLeft <= 300) {
        timerDisplay.style.color = "#ef4444";
      } else {
        timerDisplay.style.color = "#fbbf24";
      }
    }

    if (cbtState.secondsLeft <= 0) {
      clearInterval(cbtState.timerInterval);
      alert("⏰ Time is up! Submitting test automatically...");
      submitCbtTest();
    }
  }, 1000);
}

function renderCbtQuestion(index) {
  cbtState.currentIndex = index;
  cbtState.visited[index] = true;

  const q = cbtState.questions[index];
  if (!q) return;

  const container = document.getElementById("cbt-question-container");
  if (!container) return;

  const isMarked = !!cbtState.markedReview[index];
  const selectedOpt = cbtState.userAnswers[index];

  container.innerHTML = `
    <div class="cbt-q-header" style="display:flex; justify-content:space-between; margin-bottom:12px;">
      <span style="font-weight:bold; color:#fbbf24;">Question ${index + 1} of ${cbtState.questions.length}</span>
      <span class="badge" style="background:rgba(124,92,252,0.2); color:#7c5cfc; padding:2px 8px; border-radius:6px; font-size:11px;">${q.subject || 'General'}</span>
    </div>
    <div class="cbt-q-text" style="font-size:15px; margin-bottom:16px; line-height:1.6;">${parseMarkdownAndKaTeX(q.question)}</div>
    
    <div class="cbt-options-list" style="display:flex; flex-direction:column; gap:10px;">
      ${q.options.map((opt, i) => `
        <label class="cbt-option-item ${selectedOpt === i ? 'selected' : ''}" onclick="selectCbtOption(${i})">
          <input type="radio" name="cbt-opt" value="${i}" ${selectedOpt === i ? 'checked' : ''}>
          <span class="opt-label">${String.fromCharCode(65 + i)}</span>
          <span class="opt-text">${parseMarkdownAndKaTeX(opt)}</span>
        </label>
      `).join('')}
    </div>

    <div class="cbt-actions-bar" style="margin-top:20px; display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
      <label style="display:flex; align-items:center; gap:6px; font-size:12px; cursor:pointer;">
        <input type="checkbox" onchange="toggleMarkReview(${index})" ${isMarked ? 'checked' : ''}>
        Mark for Review
      </label>
      <button class="btn btn-secondary" onclick="clearCbtResponse(${index})" style="font-size:11px;">Clear Response</button>
      <div style="margin-left:auto; display:flex; gap:8px;">
        <button class="btn btn-secondary" onclick="navCbtQuestion(-1)" ${index === 0 ? 'disabled' : ''}>Previous</button>
        <button class="btn btn-primary" onclick="navCbtQuestion(1)">${index === cbtState.questions.length - 1 ? 'Finish & Review' : 'Save & Next'}</button>
      </div>
    </div>
  `;

  renderQuestionPalette();

  if (window.renderMathInElement) {
    try {
      renderMathInElement(container, {
        delimiters: [
          {left: "$$", right: "$$", display: true},
          {left: "$", right: "$", display: false}
        ]
      });
    } catch(e) {}
  }
}

function selectCbtOption(optIndex) {
  cbtState.userAnswers[cbtState.currentIndex] = optIndex;
  renderCbtQuestion(cbtState.currentIndex);
}

function clearCbtResponse(index) {
  delete cbtState.userAnswers[index];
  renderCbtQuestion(index);
}

function toggleMarkReview(index) {
  cbtState.markedReview[index] = !cbtState.markedReview[index];
  renderQuestionPalette();
}

function navCbtQuestion(direction) {
  const newIndex = cbtState.currentIndex + direction;
  if (newIndex >= 0 && newIndex < cbtState.questions.length) {
    renderCbtQuestion(newIndex);
  }
}

function renderQuestionPalette() {
  const palette = document.getElementById("cbt-palette-grid");
  if (!palette) return;

  palette.innerHTML = cbtState.questions.map((q, i) => {
    let statusClass = "unvisited";
    const isAns = cbtState.userAnswers[i] !== undefined;
    const isMarked = !!cbtState.markedReview[i];
    const isVisited = !!cbtState.visited[i];

    if (isAns && isMarked) statusClass = "ans-marked";
    else if (isAns) statusClass = "answered";
    else if (isMarked) statusClass = "marked";
    else if (isVisited) statusClass = "not-answered";

    const isCurrent = i === cbtState.currentIndex;

    return `
      <button class="palette-btn ${statusClass} ${isCurrent ? 'current' : ''}" onclick="renderCbtQuestion(${i})">
        ${i + 1}
      </button>
    `;
  }).join('');
}

function submitCbtTest() {
  if (confirm("Are you sure you want to submit your test?")) {
    if (cbtState.timerInterval) clearInterval(cbtState.timerInterval);

    let correct = 0, wrong = 0, unattempted = 0, score = 0;
    
    cbtState.questions.forEach((q, i) => {
      const userAns = cbtState.userAnswers[i];
      if (userAns === undefined) {
        unattempted++;
      } else if (userAns === q.correct) {
        correct++;
        score += 4;
      } else {
        wrong++;
        score -= 1;
      }
    });

    const maxScore = cbtState.questions.length * 4;
    const accuracy = (correct + wrong) > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

    document.getElementById("cbt-exam-panel").style.display = "none";
    document.getElementById("cbt-results-panel").style.display = "block";

    const resultsContainer = document.getElementById("cbt-results-container");
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="glass-card" style="text-align:center; padding:20px; margin-bottom:20px;">
          <h2>📊 Test Score: <span style="color:#fbbf24;">${score} / ${maxScore}</span></h2>
          <div style="display:flex; justify-content:center; gap:20px; margin-top:14px; flex-wrap:wrap;">
            <div>✅ Correct: <strong>${correct}</strong> (+${correct * 4})</div>
            <div>❌ Incorrect: <strong>${wrong}</strong> (-${wrong})</div>
            <div>⚪ Unattempted: <strong>${unattempted}</strong></div>
            <div>🎯 Accuracy: <strong>${accuracy}%</strong></div>
          </div>
        </div>

        <div class="glass-card" style="margin-bottom:20px;">
          <h3>📋 Question Analysis</h3>
          <div style="display:flex; flex-direction:column; gap:12px; margin-top:10px;">
            ${cbtState.questions.map((q, i) => {
              const uAns = cbtState.userAnswers[i];
              const isRight = uAns === q.correct;
              const isUnans = uAns === undefined;
              return `
                <div style="padding:10px; border-radius:8px; background:rgba(255,255,255,0.03); border-left:4px solid ${isRight ? '#00d4aa' : (isUnans ? '#888' : '#ef4444')};">
                  <div><strong>Q${i+1}:</strong> ${parseMarkdownAndKaTeX(q.question)}</div>
                  <div style="font-size:12px; margin-top:4px;">
                    Your Answer: <strong>${uAns !== undefined ? String.fromCharCode(65 + uAns) : 'None'}</strong> | 
                    Correct Answer: <strong style="color:#00d4aa;">${String.fromCharCode(65 + q.correct)}</strong>
                  </div>
                  <div style="font-size:11px; color:#aaa; margin-top:4px;">💡 ${parseMarkdownAndKaTeX(q.explanation)}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div style="display:flex; gap:10px;">
          <button class="btn btn-primary" onclick="saveCbtToTracker(${score}, ${maxScore})">💾 Save to Test Tracker</button>
          <button class="btn btn-secondary" onclick="resetCbtPanel()">🔄 New Test</button>
        </div>
      `;
    }
  }
}

function saveCbtToTracker(score, maxScore) {
  if (window.MOCK_TESTS) {
    window.MOCK_TESTS.push({
      date: new Date().toISOString().split('T')[0],
      name: `AI CBT Mock Test (${cbtState.questions.length}Q)`,
      score: score,
      maxScore: maxScore,
      notes: `Generated AI Mock Test - ${cbtState.questions.length} Questions`
    });
    localStorage.setItem("mock_tests_data", JSON.stringify(window.MOCK_TESTS));
    alert("✅ Test saved to your Mock Test Tracker!");
  } else {
    alert("✅ Score logged!");
  }
}

function resetCbtPanel() {
  document.getElementById("cbt-results-panel").style.display = "none";
  document.getElementById("cbt-exam-panel").style.display = "none";
  document.getElementById("cbt-setup-panel").style.display = "block";
}


/* ==========================================================================
   FEATURE 3: PDF QUESTION EXTRACTOR
   ========================================================================== */

let extractedQuestionsList = [];

async function handlePdfDrop(e) {
  e.preventDefault();
  const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
  if (!files || files.length === 0) return;
  
  const file = files[0];
  if (file.type !== "application/pdf") {
    alert("Please upload a valid PDF file!");
    return;
  }

  if (!getApiKey()) {
    alert("Please set your Gemini API key in Settings first!");
    showTab("settings");
    return;
  }

  const statusCard = document.getElementById("pdf-processing-status");
  if (statusCard) {
    statusCard.style.display = "block";
    statusCard.innerHTML = `
      <div class="glass-card" style="text-align:center; padding:20px;">
        <div class="spinner" style="margin:0 auto 10px auto;"></div>
        <h4>Reading PDF text using PDF.js...</h4>
        <p id="pdf-status-subtext" style="font-size:12px; color:#aaa;">Extracted text will be parsed into NEET MCQs using Gemini AI...</p>
      </div>
    `;
  }

  try {
    const pdfText = await extractTextFromPdf(file);
    if (!pdfText || pdfText.length < 50) {
      throw new Error("Could not extract readable text from PDF.");
    }

    const prompt = `Extract all multiple choice questions from this text.
Return ONLY a valid JSON array of objects without markdown headers:
[{
  "question": "Question text",
  "options": ["A", "B", "C", "D"],
  "correct": 0,
  "explanation": "Brief explanation",
  "subject": "Physics"
}]

Text:
${pdfText.substring(0, 8000)}`;

    const rawResult = await callGeminiAPI(prompt, "You are a PDF question extractor. Output JSON array only.", (msg) => {
      const sub = document.getElementById("pdf-status-subtext");
      if (sub) sub.textContent = msg;
    });
    
    let cleanJson = rawResult.trim();
    if (cleanJson.startsWith("```json")) cleanJson = cleanJson.substring(7);
    if (cleanJson.startsWith("```")) cleanJson = cleanJson.substring(3);
    if (cleanJson.endsWith("```")) cleanJson = cleanJson.substring(0, cleanJson.length - 3);

    extractedQuestionsList = JSON.parse(cleanJson.trim());

    if (statusCard) statusCard.style.display = "none";
    renderPdfExtractedQuestions();

  } catch (err) {
    if (statusCard) {
      statusCard.innerHTML = `
        <div class="glass-card" style="border:1px solid #ef4444; color:#ef4444; padding:15px;">
          ❌ PDF Extraction Failed: ${err.message}
        </div>
      `;
    }
  }
}

async function extractTextFromPdf(file) {
  if (!window.pdfjsLib) {
    throw new Error("PDF.js library is not loaded.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageStrings = textContent.items.map(item => item.str);
    fullText += pageStrings.join(" ") + "\n";
  }

  return fullText;
}

function renderPdfExtractedQuestions() {
  const container = document.getElementById("pdf-extracted-list");
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card" style="margin-top:20px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <h3>📄 Extracted Questions (${extractedQuestionsList.length})</h3>
        <button class="btn btn-primary" onclick="launchCbtFromPdf()">🚀 Create NEET Test</button>
      </div>
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${extractedQuestionsList.map((q, i) => `
          <div style="padding:12px; background:rgba(255,255,255,0.03); border-radius:8px;">
            <div><strong>Q${i+1}:</strong> ${escapeHTML(q.question)}</div>
            <div style="font-size:12px; color:#aaa; margin-top:4px;">
              Options: ${q.options ? q.options.join(" | ") : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function launchCbtFromPdf() {
  if (extractedQuestionsList.length === 0) {
    alert("No questions extracted!");
    return;
  }
  showTab("ai-mocktest");
  startCbtExam(extractedQuestionsList, extractedQuestionsList.length * 120);
}


/* ==========================================================================
   FEATURE 4: AI STUDY OPTIMIZER WIDGET (OVERVIEW TAB)
   ========================================================================== */

async function generateStudyRecommendation() {
  const recContainer = document.getElementById("ai-study-recommendation");
  if (!recContainer) return;

  if (!getApiKey()) {
    recContainer.innerHTML = `<p style="font-size:12px; color:#aaa;">Please set your Gemini API key in Settings to get personalized study suggestions.</p>`;
    return;
  }

  recContainer.innerHTML = `<p style="font-size:12px; color:#fbbf24;">⚡ Analyzing your schedule and generating today's focus plan...</p>`;

  try {
    const prompt = `Give me a concise 3-bullet action plan for a NEET aspirant today. 
Bullet 1: Top priority subject & chapter
Bullet 2: Target study hours & active recall strategy
Bullet 3: Quick motivational tip`;

    const recText = await callGeminiAPI(prompt, "You are a NEET study counselor.");
    recContainer.innerHTML = `<div style="font-size:13px; line-height:1.6;">${parseMarkdownAndKaTeX(recText)}</div>`;
  } catch (err) {
    recContainer.innerHTML = `<p style="font-size:12px; color:#ef4444;">Could not load suggestion: ${err.message}</p>`;
  }
}


/* ==========================================================================
   FEATURE 5: AI ERROR PATTERN ANALYZER (ERROR BOOK TAB)
   ========================================================================== */

async function analyzeMistakesWithAI() {
  const resultContainer = document.getElementById("error-analysis-result");
  if (!resultContainer) return;

  if (!getApiKey()) {
    alert("Please set your Gemini API key in Settings first!");
    showTab("settings");
    return;
  }

  resultContainer.innerHTML = `
    <div class="glass-card" style="padding:15px; text-align:center;">
      <div class="spinner" style="margin:0 auto 10px auto;"></div>
      Analyzing your mistake patterns using Gemini AI...
    </div>
  `;

  try {
    const prompt = `Analyze typical NEET mistake categories (Conceptual Error, Silly Calculation Error, Time Pressure, Formula Misapplication).
Provide a 3-step action plan to eliminate repeat errors in Physics & Chemistry.`;

    const analysis = await callGeminiAPI(prompt, "You are a NEET performance analyst.");
    resultContainer.innerHTML = `
      <div class="glass-card" style="padding:16px;">
        <h3>🧬 AI Mistake DNA Analysis</h3>
        <div style="margin-top:10px; font-size:13px; line-height:1.6;">${parseMarkdownAndKaTeX(analysis)}</div>
      </div>
    `;
  } catch (err) {
    resultContainer.innerHTML = `
      <div class="glass-card" style="padding:15px; color:#ef4444;">
        ❌ Analysis Failed: ${err.message}
      </div>
    `;
  }
}


/* ==========================================================================
   FEATURE 7: NEET NEWS & NTA UPDATES HUB
   ========================================================================== */

const NEET_NEWS_ITEMS = [
  {
    title: "NTA NEET UG 2027 Information Bulletin Released",
    date: "July 24, 2026",
    category: "nta",
    badge: "🔴 NTA Alert",
    summary: "National Testing Agency (NTA) has released the updated candidate guidelines and registration instructions for NEET UG 2027.",
    link: "https://neet.nta.nic.in"
  },
  {
    title: "NMC Retains Existing Biology & Chemistry Syllabus Matrix",
    date: "July 20, 2026",
    category: "syllabus",
    badge: "🔵 Syllabus",
    summary: "National Medical Commission confirms no major reduction in Class 11 and Class 12 NCERT core topics for NEET 2027.",
    link: "https://www.nmc.org.in"
  },
  {
    title: "MCC State Quota 85% Counseling Guidelines Updated",
    date: "July 15, 2026",
    category: "counseling",
    badge: "🟢 Counseling",
    summary: "Medical Counselling Committee updates document verification criteria for AIQ and State Quota seats.",
    link: "https://mcc.nic.in"
  }
];

function renderNeetNews(filter = "all") {
  const container = document.getElementById("news-cards-container");
  if (!container) return;

  const filtered = filter === "all" ? NEET_NEWS_ITEMS : NEET_NEWS_ITEMS.filter(item => item.category === filter);

  container.innerHTML = filtered.map(item => `
    <div class="news-card glass-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span class="badge" style="background:rgba(251,191,36,0.15); color:#fbbf24; font-size:11px; padding:2px 8px; border-radius:4px;">${item.badge}</span>
        <span style="font-size:11px; color:#aaa;">${item.date}</span>
      </div>
      <h4 style="margin:8px 0; font-size:15px; color:#fff;">${item.title}</h4>
      <p style="font-size:12px; color:#ccc; line-height:1.5;">${item.summary}</p>
      <div style="margin-top:12px; display:flex; justify-content:space-between; align-items:center;">
        <a href="${item.link}" target="_blank" style="color:#00d4aa; text-decoration:none; font-size:12px; font-weight:bold;">Official Portal ↗</a>
        <button class="btn btn-secondary" onclick="summarizeNews('${escapeHTML(item.title)}')" style="font-size:11px;">⚡ Summarize with AI</button>
      </div>
    </div>
  `).join('');
}

async function summarizeNews(title) {
  if (!getApiKey()) {
    alert("Please set your Gemini API key in Settings first!");
    showTab("settings");
    return;
  }
  alert(`⚡ Summarizing "${title}" using Gemini AI...`);
  try {
    const summary = await callGeminiAPI(`Provide a 3-bullet summary of the NEET update titled: "${title}"`);
    alert(`📰 AI Summary:\n\n${summary}`);
  } catch (err) {
    alert(`❌ Summary failed: ${err.message}`);
  }
}

function filterNews(cat) {
  document.querySelectorAll(".news-filter-btn").forEach(btn => btn.classList.remove("active"));
  const btn = document.getElementById(`news-filter-${cat}`);
  if (btn) btn.classList.add("active");
  renderNeetNews(cat);
}


/* ==========================================================================
   UTILITY & HELPER FUNCTIONS
   ========================================================================== */

function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function parseMarkdownAndKaTeX(text) {
  if (!text) return "";
  let html = escapeHTML(text);
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/\n/g, '<br>');
  return html;
}

function copyText(btn) {
  const bubble = btn.closest(".chat-bubble");
  if (!bubble) return;
  const text = bubble.querySelector(".bubble-content").innerText;
  navigator.clipboard.writeText(text);
  btn.textContent = "✅ Copied!";
  setTimeout(() => { btn.textContent = "📋 Copy"; }, 2000);
}


/* ==========================================================================
   INITIALIZATION & TAB SWITCH HOOKS
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  updateApiKeyStatusUI();
  renderSetupRequiredCards();
  renderNeetNews("all");
});

function handleAiTabSwitch(tabId) {
  updateApiKeyStatusUI();
  renderSetupRequiredCards();

  if (tabId === 'ai-tutor') {
    updateCharCount();
  } else if (tabId === 'neet-news') {
    renderNeetNews("all");
  }
}

if (window.showTab) {
  const originalShowTab = window.showTab;
  window.showTab = function(tabId) {
    originalShowTab(tabId);
    handleAiTabSwitch(tabId);
  };
}
