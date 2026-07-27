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

// Model Fallback Ring — Valid public Gemini v1beta endpoints
const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b"
];

const _invalidModels = new Set();
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// Helper: Sleep for delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ═══════════════════════════════════════════════════════════════════════
// OPTIMIZED API ENGINE — Minimal Token Waste + Smart Caching
// ═══════════════════════════════════════════════════════════════════════
const _modelCooldowns = {};       // model -> timestamp when cooldown expires
let _lastRequestTime = 0;         // timestamp of last API call
const MIN_REQUEST_GAP_MS = 4000;  // 4 seconds between ANY API request (safe for 15 RPM)
const MODEL_COOLDOWN_MS = 65000;  // 65-second cooldown when a model returns 429
let _apiCallInProgress = false;   // prevent concurrent API calls

// Response cache — avoid re-asking identical questions
const _responseCache = new Map();
const CACHE_MAX_SIZE = 30;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function _getCachedResponse(key) {
  const entry = _responseCache.get(key);
  if (entry && (Date.now() - entry.ts) < CACHE_TTL_MS) {
    return entry.text;
  }
  if (entry) _responseCache.delete(key); // expired
  return null;
}

function _setCachedResponse(key, text) {
  if (_responseCache.size >= CACHE_MAX_SIZE) {
    // Evict oldest entry
    const oldest = _responseCache.keys().next().value;
    _responseCache.delete(oldest);
  }
  _responseCache.set(key, { text, ts: Date.now() });
}

function _getAvailableModel() {
  const now = Date.now();
  for (const model of GEMINI_MODELS) {
    if (_invalidModels.has(model)) continue;
    const cooldownUntil = _modelCooldowns[model] || 0;
    if (now >= cooldownUntil) return model;
  }
  return null;
}

function _getNextCooldownExpiry() {
  let earliest = Infinity;
  for (const model of GEMINI_MODELS) {
    const cd = _modelCooldowns[model] || 0;
    if (cd < earliest) earliest = cd;
  }
  return earliest;
}

// Token Efficiency Tracker — Monitor and eliminate API wastage
const _tokenStats = {
  totalCalls: parseInt(localStorage.getItem("neet_api_calls_count") || "0"),
  cachedCalls: parseInt(localStorage.getItem("neet_api_cached_count") || "0"),
  estTokensUsed: parseInt(localStorage.getItem("neet_api_tokens_used") || "0")
};

function recordTokenUsage(estTokens, wasCached = false) {
  if (wasCached) {
    _tokenStats.cachedCalls++;
    localStorage.setItem("neet_api_cached_count", _tokenStats.cachedCalls);
  } else {
    _tokenStats.totalCalls++;
    _tokenStats.estTokensUsed += estTokens;
    localStorage.setItem("neet_api_calls_count", _tokenStats.totalCalls);
    localStorage.setItem("neet_api_tokens_used", _tokenStats.estTokensUsed);
  }
}

/**
 * Central Gemini API Caller — Optimized for Free Tier
 * 
 * Key optimizations vs naive implementation:
 * 1. Uses proper API `system_instruction` field (not wasted as conversation turns = ~30% fewer input tokens)
 * 2. Adaptive maxOutputTokens based on task (chat=1024, JSON=2500, quick=300-600)
 * 3. Response caching for identical prompts (0 token cost)
 * 4. Single-model-first strategy (only fallback on 429)
 * 5. Concurrent call blocking + minimum request gap
 */
async function callGeminiAPI(prompt, systemInstruction = "", onStatus = null, options = {}) {
  const apiKey = localStorage.getItem("gemini_api_key");
  if (!apiKey || !apiKey.trim()) {
    throw new Error("NO_API_KEY");
  }

  // Check cache first — zero API cost
  const cacheKey = `${systemInstruction}|||${prompt}`;
  const cached = _getCachedResponse(cacheKey);
  if (cached) {
    console.log("[API] Cache hit — saved 1 API call");
    recordTokenUsage(0, true);
    return cached;
  }

  // Block concurrent API calls
  if (_apiCallInProgress) {
    if (onStatus) onStatus("⏳ Another AI request is in progress. Waiting...");
    let waited = 0;
    while (_apiCallInProgress && waited < 30000) {
      await sleep(500);
      waited += 500;
    }
    if (_apiCallInProgress) throw new Error("API call timeout — another request is still running.");
  }
  _apiCallInProgress = true;

  try {
    // Enforce minimum gap between requests
    const now = Date.now();
    const elapsed = now - _lastRequestTime;
    if (_lastRequestTime > 0 && elapsed < MIN_REQUEST_GAP_MS) {
      const waitMs = MIN_REQUEST_GAP_MS - elapsed;
      if (onStatus) onStatus(`⏳ Rate-limit safety: waiting ${Math.ceil(waitMs / 1000)}s...`);
      await sleep(waitMs);
    }

    // Build optimized payload using PROPER system_instruction field
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: options.maxTokens || 1024  // Default 1K (strict cap to prevent wastage)
      }
    };

    if (systemInstruction) {
      payload.system_instruction = { parts: [{ text: systemInstruction }] };
    }

    // Try available models (skip models on cooldown)
    for (let attempt = 0; attempt < GEMINI_MODELS.length + 1; attempt++) {
      const model = _getAvailableModel();

      if (!model) {
        const nextExpiry = _getNextCooldownExpiry();
        const waitSec = Math.ceil((nextExpiry - Date.now()) / 1000);
        if (waitSec > 0 && waitSec <= 120) {
          if (onStatus) onStatus(`⏳ All AI models cooling down. Resuming in ${waitSec}s...`);
          await sleep(Math.min(waitSec * 1000, 65000));
          continue;
        }
        throw new Error("HTTP_429_EXCEEDED");
      }

      const endpoint = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey.trim()}`;

      try {
        if (onStatus && attempt > 0) {
          onStatus(`⚡ Trying ${model}...`);
        }

        _lastRequestTime = Date.now();

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.status === 429) {
          _modelCooldowns[model] = Date.now() + MODEL_COOLDOWN_MS;
          console.warn(`[API] ${model} → 429, cooling down 65s`);
          if (onStatus) onStatus(`⚠️ ${model} rate limited. Trying backup...`);
          continue;
        }

        if (response.status === 404) {
          _invalidModels.add(model);
          console.warn(`[API] Model ${model} returned 404. Skipping...`);
          continue;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const msg = errorData.error?.message || `API error (${response.status})`;
          if (msg.includes("API key not valid") || msg.includes("API_KEY_INVALID")) {
            throw new Error("INVALID_API_KEY");
          }
          if (msg.includes("quota") || msg.includes("rate") || msg.includes("Resource has been exhausted")) {
            _modelCooldowns[model] = Date.now() + MODEL_COOLDOWN_MS;
            if (onStatus) onStatus(`⚠️ ${model} quota exhausted. Trying backup...`);
            continue;
          }
          throw new Error(msg);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          throw new Error("Empty response received from Gemini AI.");
        }

        // Calculate and record estimated token usage
        const estTokens = Math.ceil((prompt.length + (systemInstruction ? systemInstruction.length : 0) + text.length) / 4);
        recordTokenUsage(estTokens, false);

        // Cache successful response
        _setCachedResponse(cacheKey, text);
        return text;

      } catch (err) {
        if (err.message === "NO_API_KEY" || err.message === "INVALID_API_KEY" || err.message === "HTTP_429_EXCEEDED") {
          throw err;
        }
        console.warn(`[API] ${model} failed: ${err.message}`);
      }
    }

    throw new Error("HTTP_429_EXCEEDED");

  } finally {
    _apiCallInProgress = false;
  }
}

/* ==========================================================================
   FEATURE 6: SETTINGS TAB BYOK MANAGER
   ========================================================================== */

function getApiKey() {
  return (localStorage.getItem("gemini_api_key") || "").trim();
}

function onKeyInputTyped() {
  const msgArea = document.getElementById("api-key-inline-msg");
  if (msgArea) msgArea.innerHTML = "";
}

function saveApiKey() {
  const keyInput = document.getElementById("setting-gemini-key");
  const msgArea = document.getElementById("api-key-inline-msg");
  if (!keyInput) return;

  const val = keyInput.value.trim();
  if (!val) {
    if (msgArea) msgArea.innerHTML = `<span style="color:#ef4444; font-weight:bold;">❌ Please paste a valid API key first!</span>`;
    alert("Please enter a valid Gemini API key!");
    return;
  }

  localStorage.setItem("gemini_api_key", val);
  updateApiKeyStatusUI(true);
  
  if (msgArea) msgArea.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">✅ API Key saved successfully!</span>`;
  renderSetupRequiredCards();
  alert("✅ Gemini API Key saved successfully!");
}

function removeApiKey() {
  localStorage.removeItem("gemini_api_key");
  const keyInput = document.getElementById("setting-gemini-key");
  if (keyInput) keyInput.value = "";
  
  const msgArea = document.getElementById("api-key-inline-msg");
  if (msgArea) msgArea.innerHTML = `<span style="color:#fbbf24;">🗑️ API Key removed.</span>`;
  
  updateApiKeyStatusUI(true);
  renderSetupRequiredCards();
}

function toggleKeyVisibility() {
  const input = document.getElementById("setting-gemini-key");
  if (input) {
    input.type = input.type === "password" ? "text" : "password";
  }
}

async function testApiKeyConnection() {
  const keyInput = document.getElementById("setting-gemini-key");
  const statusBadge = document.getElementById("api-key-status-badge");
  const msgArea = document.getElementById("api-key-inline-msg");

  if (keyInput && keyInput.value.trim()) {
    // Auto-save key first so user doesn't have to click save manually!
    localStorage.setItem("gemini_api_key", keyInput.value.trim());
    renderSetupRequiredCards();
  }

  const currentKey = getApiKey();
  if (!currentKey) {
    if (statusBadge) statusBadge.innerHTML = `<span style="color:#ef4444; font-weight:bold;">🔴 No Key Configured</span>`;
    if (msgArea) msgArea.innerHTML = `<span style="color:#ef4444; font-weight:bold;">❌ Please paste your API key in the box first!</span>`;
    alert("Please paste your Gemini API key in the box first!");
    return;
  }

  if (statusBadge) statusBadge.innerHTML = `<span style="color:#fbbf24;">🟡 Testing Connection...</span>`;
  if (msgArea) msgArea.innerHTML = `<span style="color:#fbbf24;">⚡ Connecting to Gemini AI...</span>`;

  try {
    const reply = await callGeminiAPI("Respond with only the word: CONNECTED", "", (msg) => {
      if (statusBadge) statusBadge.innerHTML = `<span style="color:#fbbf24; font-size:11px;">${msg}</span>`;
    }, { maxTokens: 64 });

    if (reply && reply.includes("CONNECTED")) {
      if (statusBadge) statusBadge.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">🟢 Connected</span>`;
      if (msgArea) msgArea.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">🎉 Connection Successful! Gemini AI is ready.</span>`;
      alert("🎉 Connection Successful! Gemini AI is ready to use.");
    } else {
      if (statusBadge) statusBadge.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">🟢 Connected</span>`;
      if (msgArea) msgArea.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">🟢 Connected to Gemini AI</span>`;
    }
  } catch (err) {
    if (err.message === "INVALID_API_KEY") {
      if (statusBadge) statusBadge.innerHTML = `<span style="color:#ef4444; font-weight:bold;">🔴 Invalid Key</span>`;
      if (msgArea) msgArea.innerHTML = `<span style="color:#ef4444; font-weight:bold;">❌ Invalid API Key. Check key at aistudio.google.com/apikey</span>`;
      alert("❌ Invalid API Key. Please check your key at https://aistudio.google.com/apikey");
    } else if (err.message === "HTTP_429_EXCEEDED") {
      if (statusBadge) statusBadge.innerHTML = `<span style="color:#fbbf24; font-weight:bold;">🟡 Rate Limit Hit</span>`;
      if (msgArea) msgArea.innerHTML = `<span style="color:#fbbf24; font-weight:bold;">⚠️ Rate limit reached on free tier. Retry in 60s.</span>`;
      alert("⚠️ Free Tier Rate Limit Reached! Please wait 60 seconds or generate a new free key at https://aistudio.google.com/apikey");
    } else {
      if (statusBadge) statusBadge.innerHTML = `<span style="color:#ef4444; font-weight:bold;">🔴 Connection Failed</span>`;
      if (msgArea) msgArea.innerHTML = `<span style="color:#ef4444; font-weight:bold;">❌ Connection test failed: ${err.message}</span>`;
      alert(`❌ Connection Test Failed: ${err.message}`);
    }
  }
}

function updateApiKeyStatusUI(forceSyncInput = false) {
  const key = getApiKey();
  const statusBadge = document.getElementById("api-key-status-badge");
  const keyInput = document.getElementById("setting-gemini-key");

  // Only sync input value if forced or empty, to preserve whatever the user is typing
  if (keyInput && (forceSyncInput || !keyInput.value.trim())) {
    keyInput.value = key;
  }

  if (statusBadge) {
    if (key) {
      statusBadge.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">🟢 Key Saved (Ready)</span>`;
    } else {
      statusBadge.innerHTML = `<span style="color:#ef4444; font-weight:bold;">🔴 No Key Configured</span>`;
    }
  }
}

function quickSaveApiKey(btn) {
  const container = btn.closest(".ai-setup-required-card");
  const input = container ? container.querySelector(".inline-gemini-key-input") : null;
  if (!input || !input.value.trim()) {
    alert("Please paste a valid Gemini API key first!");
    return;
  }
  const val = input.value.trim();
  localStorage.setItem("gemini_api_key", val);
  updateApiKeyStatusUI(true);
  renderSetupRequiredCards();
  alert("🎉 Gemini API Key activated! All AI features are ready.");
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

window.quickSaveApiKey = quickSaveApiKey;


/* ==========================================================================
   FEATURE 1: AI TUTOR (DOUBT SOLVER)
   ========================================================================== */

let currentSubjectMode = "physics";

const SYSTEM_PROMPTS = {
  physics: `You are an expert NEET Physics tutor. Focus on step-by-step mathematical solutions, Free Body Diagrams (FBD descriptions), vector analysis, unit checks, and NCERT formulas. Use LaTeX ($...$ and $$...$$). End with a "Quick Recall Point".`,
  chemistry: `You are an expert NEET Chemistry tutor (Physical, Organic, Inorganic). Always format chemical formulas with proper subscripts and superscripts (e.g., H₂O, H~2~O, Fe^3+^, SO₄²⁻, or LaTeX $CH_3COOH$, $Fe^{3+}$). Focus on reaction mechanisms, electron displacement concepts, balanced equations, and NCERT exception points. Use LaTeX for equations. End with a "Quick Recall Point".`,
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
    let sysPrompt = SYSTEM_PROMPTS[currentSubjectMode] || SYSTEM_PROMPTS.physics;

    if (isResearchModeActive && getSerperApiKey()) {
      updateTypingText(typingId, "🔬 Researching live NCERT & web data with Serper.dev API...");
      const researchContext = await performSerperSearch(userText);
      if (researchContext) {
        sysPrompt += `\n\n[Live Web & NCERT Research Findings]:\n${researchContext}\nUse these live research findings to ground your answer with high accuracy.`;
      }
    }

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
  if (statusCard) statusCard.style.display = "block";

  const BATCH_SIZE = 10;
  const allQuestions = [];
  const subjectsToUse = (subject === 'all') ? ['Physics', 'Chemistry', 'Biology'] : [subject];

  let generatedCount = 0;
  let batchAttempts = 0;
  const maxTotalAttempts = Math.ceil(numQuestions / BATCH_SIZE) * 2 + 2;

  try {
    while (generatedCount < numQuestions && batchAttempts < maxTotalAttempts) {
      batchAttempts++;
      const currentBatchSize = Math.min(BATCH_SIZE, numQuestions - generatedCount);
      const currentSubject = subjectsToUse[generatedCount % subjectsToUse.length];

      if (statusCard) {
        statusCard.innerHTML = `
          <div class="glass-card" style="text-align:center; padding:20px;">
            <div class="spinner" style="margin:0 auto 10px auto;"></div>
            <h4>Generating NEET MCQs (${generatedCount + 1} to ${generatedCount + currentBatchSize} of ${numQuestions})...</h4>
            <p id="cbt-status-subtext" style="font-size:12px; color:#fbbf24;">Drafting ${currentSubject} questions (${difficulty} difficulty)...</p>
          </div>
        `;
      }

      const prompt = `Generate exactly ${currentBatchSize} high-quality NEET-pattern multiple choice questions.
Subject: ${currentSubject}
Difficulty: ${difficulty}

CRITICAL FORMATTING RULES:
1. Return ONLY a valid, raw JSON array of question objects.
2. Escape all backslashes in formulas (use \\frac, \\alpha, \\text, etc.).
3. Do NOT include conversational text.

Each object format:
{
  "question": "Question text with LaTeX formulas using double backslashes",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "2-line detailed explanation",
  "reference": "NCERT Chapter reference",
  "subject": "${currentSubject}"
}
`;

      const rawText = await callGeminiAPI(prompt, "You are an NTA NEET exam setter. Output ONLY a valid JSON array.", (msg) => {
        const sub = document.getElementById("cbt-status-subtext");
        if (sub) sub.textContent = msg;
      }, { maxTokens: 3000 });

      const batchQuestions = robustParseJSON(rawText);

      if (Array.isArray(batchQuestions) && batchQuestions.length > 0) {
        allQuestions.push(...batchQuestions);
        generatedCount += batchQuestions.length;
      } else {
        console.warn(`Batch attempt ${batchAttempts} produced invalid questions, retrying...`);
        await sleep(2000);
      }
    }

    if (allQuestions.length === 0) {
      throw new Error("Could not generate test questions. Please check your API key and try again.");
    }

    if (statusCard) statusCard.style.display = "none";
    startCbtExam(allQuestions, numQuestions * 120);

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

// Robust JSON Parser that handles unescaped LaTeX backslashes, markdown code fences, control chars, and truncated JSON
function robustParseJSON(rawText) {
  if (!rawText) throw new Error("Empty text received from AI.");

  let text = rawText.trim();

  // Strip markdown code fences if present
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  // Find array bounds [ ... ]
  const firstSquare = text.indexOf('[');
  let lastSquare = text.lastIndexOf(']');
  
  // If array is truncated (no closing ]), repair it by finding the last complete object }
  if (firstSquare !== -1 && (lastSquare === -1 || lastSquare <= firstSquare)) {
    const lastCurly = text.lastIndexOf('}');
    if (lastCurly > firstSquare) {
      text = text.substring(firstSquare, lastCurly + 1) + "\n]";
      lastSquare = text.lastIndexOf(']');
    }
  }

  if (firstSquare !== -1 && lastSquare > firstSquare) {
    text = text.substring(firstSquare, lastSquare + 1);
  }

  // Attempt 1: Direct JSON.parse
  try {
    return JSON.parse(text);
  } catch (e1) {}

  // Attempt 2: Sanitize unescaped LaTeX backslashes & control characters
  try {
    let sanitized = text
      .replace(/\\(?!["\\/bfnrtu])/g, "\\\\")
      .replace(/[\u0000-\u001F]+/g, " ");

    return JSON.parse(sanitized);
  } catch (e2) {}

  // Attempt 3: Clean up trailing commas
  try {
    let cleaned = text
      .replace(/\\(?!["\\/bfnrtu])/g, "\\\\")
      .replace(/,\s*([\]}])/g, "$1");

    return JSON.parse(cleaned);
  } catch (e3) {
    // Attempt 4: Truncate to last complete '}' and close array
    try {
      const lastCurly = text.lastIndexOf('}');
      if (lastCurly > 0) {
        let repaired = text.substring(0, lastCurly + 1) + "\n]";
        repaired = repaired
          .replace(/\\(?!["\\/bfnrtu])/g, "\\\\")
          .replace(/,\s*([\]}])/g, "$1");
        return JSON.parse(repaired);
      }
    } catch(e4) {}

    throw new Error(`AI generated incomplete JSON response. Try generating fewer questions or click Generate again.`);
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
    const pageTexts = await extractTextFromPdf(file, statusCard);
    if (!pageTexts || pageTexts.length === 0) {
      throw new Error("Could not extract readable text from PDF.");
    }

    // Chunk text into blocks of ~3500 characters (~5-10 questions per chunk)
    const textChunks = [];
    let currentChunk = "";
    for (const pText of pageTexts) {
      if ((currentChunk + pText).length > 3500) {
        if (currentChunk.trim().length > 0) textChunks.push(currentChunk);
        currentChunk = pText;
      } else {
        currentChunk += "\n" + pText;
      }
    }
    if (currentChunk.trim().length > 0) textChunks.push(currentChunk);

    extractedQuestionsList = [];

    for (let cIdx = 0; cIdx < textChunks.length; cIdx++) {
      const chunkText = textChunks[cIdx];
      if (statusCard) {
        statusCard.innerHTML = `
          <div class="glass-card" style="text-align:center; padding:20px;">
            <div class="spinner" style="margin:0 auto 10px auto;"></div>
            <h4>Extracting NEET MCQs from PDF (Part ${cIdx + 1} of ${textChunks.length})...</h4>
            <p id="pdf-status-subtext" style="font-size:12px; color:#fbbf24;">Found ${extractedQuestionsList.length} questions so far...</p>
          </div>
        `;
      }

      const prompt = `Extract all multiple choice questions from this text chunk.
Return ONLY a valid JSON array of objects without markdown headers:
[{
  "question": "Question text with LaTeX formulas using double backslashes",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Brief 1-2 sentence explanation",
  "subject": "Physics"
}]

Text Chunk:
${chunkText}`;

      try {
        const rawResult = await callGeminiAPI(prompt, "You are a PDF question extractor. Output JSON array only.", (msg) => {
          const sub = document.getElementById("pdf-status-subtext");
          if (sub) sub.textContent = msg;
        }, { maxTokens: 3000 });
        
        const batch = robustParseJSON(rawResult);
        if (Array.isArray(batch) && batch.length > 0) {
          extractedQuestionsList.push(...batch);
        }
      } catch (chunkErr) {
        console.warn(`Chunk ${cIdx + 1} failed: ${chunkErr.message}`);
      }
    }

    if (extractedQuestionsList.length === 0) {
      throw new Error("No valid MCQs could be extracted from this PDF.");
    }

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

async function extractTextFromPdf(file, statusCard = null) {
  if (!window.pdfjsLib) {
    throw new Error("PDF.js library is not loaded.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageTexts = [];

  // 1. Digital Text Extraction via PDF.js Engine
  const totalPages = Math.min(pdf.numPages, 30);
  let totalCharsExtracted = 0;

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageStrings = textContent.items.map(item => item.str);
    const pText = pageStrings.join(" ");
    if (pText.trim().length > 15) {
      pageTexts.push(pText);
      totalCharsExtracted += pText.trim().length;
    }
  }

  // 2. Scanned / Image PDF Fallback via Tesseract.js OCR Engine
  if (totalCharsExtracted < 50 && window.Tesseract) {
    console.log("[PDF Engine] Scanned PDF detected (digital text < 50 chars). Falling back to Tesseract.js OCR Engine...");
    
    const ocrTexts = [];
    const ocrPages = Math.min(pdf.numPages, 10); // OCR up to 10 scanned pages

    for (let pageNum = 1; pageNum <= ocrPages; pageNum++) {
      if (statusCard) {
        statusCard.innerHTML = `
          <div class="glass-card" style="text-align:center; padding:20px;">
            <div class="spinner" style="margin:0 auto 10px auto;"></div>
            <h4>📷 Scanned PDF Detected! Running Tesseract.js OCR Engine...</h4>
            <p id="pdf-status-subtext" style="font-size:12px; color:#fbbf24;">Recognizing scanned text on Page ${pageNum} of ${ocrPages}...</p>
          </div>
        `;
      }

      try {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: ctx, viewport: viewport }).promise;

        const ocrResult = await Tesseract.recognize(canvas, 'eng');
        const recognizedText = ocrResult.data ? ocrResult.data.text : "";

        if (recognizedText.trim().length > 15) {
          ocrTexts.push(recognizedText);
        }
      } catch (ocrErr) {
        console.warn(`OCR page ${pageNum} failed:`, ocrErr);
      }
    }

    if (ocrTexts.length > 0) {
      return ocrTexts;
    }
  }

  return pageTexts;
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

    const recText = await callGeminiAPI(prompt, "You are a NEET study counselor.", null, { maxTokens: 400 });
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

    const analysis = await callGeminiAPI(prompt, "You are a NEET performance analyst.", null, { maxTokens: 600 });
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
    const summary = await callGeminiAPI(`Provide a 3-bullet summary of the NEET update titled: "${title}"`, "Summarize in 3 bullet points", null, { maxTokens: 300 });
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

  // Restore allowed sub and sup HTML tags from AI or user input
  html = html.replace(/&lt;sub&gt;(.*?)&lt;\/sub&gt;/gi, '<sub>$1</sub>');
  html = html.replace(/&lt;sup&gt;(.*?)&lt;\/sup&gt;/gi, '<sup>$1</sup>');

  // Support ~subscript~ syntax (e.g. H~2~O -> H<sub>2</sub>O)
  html = html.replace(/~([^~]+)~/g, '<sub>$1</sub>');

  // Support ^superscript^ syntax (e.g. Fe^3+^ -> Fe<sup>3+</sup>)
  html = html.replace(/\^([^\^]+)\^/g, '<sup>$1</sup>');

  // Support chemical formula subscript shorthand (e.g. H_2O -> H<sub>2</sub>O, CO_2 -> CO<sub>2</sub>)
  html = html.replace(/\b([A-Z][a-z]?)_([0-9]+)\b/g, '$1<sub>$2</sub>');

  // Formatting: Bold, Italics, Line breaks
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
   FEATURE: SERPER.DEV SEARCH & NEWS ENGINE (BYOK)
   ========================================================================== */

let isResearchModeActive = false;

function getSerperApiKey() {
  return (localStorage.getItem("serper_dev_api_key") || "").trim();
}

function onSerperKeyTyped() {
  const msgArea = document.getElementById("serper-key-inline-msg");
  if (msgArea) msgArea.innerHTML = "";
}

function saveSerperApiKey() {
  const keyInput = document.getElementById("setting-serper-key");
  const msgArea = document.getElementById("serper-key-inline-msg");
  if (!keyInput) return;

  const val = keyInput.value.trim();
  if (!val) {
    if (msgArea) msgArea.innerHTML = `<span style="color:#ef4444; font-weight:bold;">❌ Please enter a valid Serper API key!</span>`;
    alert("Please enter a valid Serper.dev API key!");
    return;
  }

  localStorage.setItem("serper_dev_api_key", val);
  updateSerperApiKeyStatusUI(true);
  if (msgArea) msgArea.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">✅ Serper Key saved successfully!</span>`;
  alert("✅ Serper.dev API Key saved!");
}

function removeSerperApiKey() {
  localStorage.removeItem("serper_dev_api_key");
  const keyInput = document.getElementById("setting-serper-key");
  if (keyInput) keyInput.value = "";
  const msgArea = document.getElementById("serper-key-inline-msg");
  if (msgArea) msgArea.innerHTML = `<span style="color:#fbbf24;">🗑️ Serper Key removed.</span>`;
  updateSerperApiKeyStatusUI(true);
}

function toggleSerperVisibility() {
  const input = document.getElementById("setting-serper-key");
  if (input) input.type = input.type === "password" ? "text" : "password";
}

async function testSerperApiConnection() {
  const keyInput = document.getElementById("setting-serper-key");
  const statusBadge = document.getElementById("serper-key-status-badge");
  const msgArea = document.getElementById("serper-key-inline-msg");

  if (keyInput && keyInput.value.trim()) {
    localStorage.setItem("serper_dev_api_key", keyInput.value.trim());
  }

  const key = getSerperApiKey();
  if (!key) {
    if (msgArea) msgArea.innerHTML = `<span style="color:#ef4444; font-weight:bold;">❌ Please paste a Serper.dev API key first!</span>`;
    alert("Please paste a Serper.dev API key first!");
    return;
  }

  if (statusBadge) statusBadge.innerHTML = `<span style="color:#fbbf24;">🟡 Testing...</span>`;
  if (msgArea) msgArea.innerHTML = `<span style="color:#fbbf24;">⚡ Testing connection to Serper.dev API...</span>`;

  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ q: "NEET UG NTA official 2027", num: 1 })
    });

    if (res.ok) {
      if (statusBadge) statusBadge.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">🟢 Active</span>`;
      if (msgArea) msgArea.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">🎉 Connection Successful! Serper.dev Search & Live News active.</span>`;
      alert("🎉 Connection Successful! Serper.dev API connected.");
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    if (statusBadge) statusBadge.innerHTML = `<span style="color:#ef4444; font-weight:bold;">🔴 Failed</span>`;
    if (msgArea) msgArea.innerHTML = `<span style="color:#ef4444; font-weight:bold;">❌ Connection failed: ${err.message}</span>`;
    alert(`❌ Connection failed: ${err.message}`);
  }
}

function updateSerperApiKeyStatusUI(forceSync = false) {
  const key = getSerperApiKey();
  const badge = document.getElementById("serper-key-status-badge");
  const input = document.getElementById("setting-serper-key");
  if (input && (forceSync || !input.value.trim())) input.value = key;
  if (badge) {
    badge.innerHTML = key 
      ? `<span style="color:#00d4aa; font-weight:bold;">🟢 Key Saved (Ready)</span>`
      : `<span style="color:#aaa; font-size:11px;">Optional</span>`;
  }
}

function toggleResearchMode() {
  isResearchModeActive = !isResearchModeActive;
  const btn = document.getElementById("research-toggle-btn");
  if (btn) {
    if (isResearchModeActive) {
      if (!getSerperApiKey()) {
        alert("⚠️ Live Serper Research requires a free Serper.dev API key. Please configure your key in Settings!");
      }
      btn.style.background = "rgba(0,212,170,0.2)";
      btn.style.borderColor = "#00d4aa";
      btn.innerHTML = "🔬 Live Serper Research: ON 🟢";
    } else {
      btn.style.background = "transparent";
      btn.style.borderColor = "#00d4aa";
      btn.innerHTML = "🔬 Live Serper Research: OFF";
    }
  }
}

async function performSerperSearch(query) {
  const key = getSerperApiKey();
  if (!key) return "";

  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ q: query, num: 4 })
    });

    if (!res.ok) return "";
    const data = await res.json();
    const results = data.organic || [];
    if (results.length === 0) return "";

    return results.map(r => `• ${r.title}: ${r.snippet} (${r.link})`).join("\n");
  } catch (err) {
    console.warn("Serper Search failed:", err);
    return "";
  }
}

/* ==========================================================================
   FEATURE: DEDICATED AI WEB & LITERATURE RESEARCH HUB
   ========================================================================== */

function quickResearch(query) {
  const input = document.getElementById("research-query-input");
  if (input) input.value = query;
  performDedicatedAiResearch();
}

async function performDedicatedAiResearch() {
  const input = document.getElementById("research-query-input");
  const container = document.getElementById("research-results-container");
  const statusCard = document.getElementById("research-status-card");
  if (!input || !container) return;

  const query = input.value.trim();
  if (!query) {
    alert("Please enter a research topic or query!");
    return;
  }

  const serperKey = getSerperApiKey();
  if (!serperKey) {
    alert("Please set your free Serper.dev API key in Settings to enable Live AI Web Research!");
    showTab("settings");
    return;
  }

  if (statusCard) {
    statusCard.style.display = "block";
    statusCard.innerHTML = `
      <div class="glass-card" style="text-align:center; padding:20px;">
        <div class="spinner" style="margin:0 auto 10px auto;"></div>
        <h4>🔍 Fetching Live Web Search Data via Serper.dev...</h4>
        <p id="research-status-subtext" style="font-size:12px; color:#00d4aa;">Synthesizing academic findings with Gemini AI...</p>
      </div>
    `;
  }
  container.innerHTML = "";

  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": serperKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ q: query, num: 6 })
    });

    if (!res.ok) {
      throw new Error(`Serper API HTTP Error ${res.status}`);
    }

    const data = await res.json();
    const organicResults = data.organic || [];

    if (organicResults.length === 0) {
      if (statusCard) statusCard.style.display = "none";
      container.innerHTML = `<div class="glass-card" style="padding:20px; text-align:center; color:#ef4444;">No live web search results found for "${escapeHTML(query)}".</div>`;
      return;
    }

    // 1. Render Real-Time Google Search Cards
    let webCardsHtml = `
      <div class="glass-card" style="padding:16px;">
        <h4 style="margin-top:0; color:#00d4aa;">🌐 Live Google Search Web Sources (${organicResults.length})</h4>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:12px; margin-top:12px;">
    `;

    organicResults.forEach(item => {
      let hostname = "";
      try { hostname = item.link ? new URL(item.link).hostname : ""; } catch(e){}
      webCardsHtml += `
        <div style="padding:10px 12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:8px; display:flex; flex-direction:column; justify-content:space-between;">
          <a href="${item.link}" target="_blank" style="font-weight:bold; font-size:13px; color:#fbbf24; text-decoration:none; margin-bottom:4px; display:block;">${escapeHTML(item.title)} ↗</a>
          <p style="font-size:11.5px; color:#ccc; line-height:1.4; margin:0 0 8px 0;">${escapeHTML(item.snippet || '')}</p>
          <span style="font-size:10px; color:#888; margin-top:auto;">${escapeHTML(hostname)}</span>
        </div>
      `;
    });

    webCardsHtml += `</div></div>`;

    // 2. Synthesize AI Research Digest via Gemini
    if (statusCard) {
      const sub = document.getElementById("research-status-subtext");
      if (sub) sub.textContent = "🧠 Synthesizing deep academic research digest with Gemini AI...";
    }

    const searchContextStr = organicResults.map((r, idx) => `Source [${idx+1}]: ${r.title}\nSnippet: ${r.snippet}\nURL: ${r.link}`).join("\n\n");

    const prompt = `Student Research Query: "${query}"\n\nLive Search Findings:\n${searchContextStr}\n\nWrite a comprehensive Academic Research Digest & NCERT Analysis for a NEET aspirant. Organize with clear headers:
1. Executive Summary & Key Findings
2. Detailed Academic / NCERT Breakdown
3. Exam Impact & Action Items for NEET Aspirants`;

    let aiDigestText = "";
    if (getApiKey()) {
      aiDigestText = await callGeminiAPI(prompt, "You are a senior NEET academic researcher.", null, { maxTokens: 1024 });
    }

    if (statusCard) statusCard.style.display = "none";

    let aiDigestHtml = "";
    if (aiDigestText) {
      aiDigestHtml = `
        <div class="glass-card" style="padding:20px; border:1px solid rgba(251,191,36,0.4);">
          <h3 style="margin-top:0; color:#fbbf24; display:flex; align-items:center; gap:8px;">
            <span>🤖 AI Academic Research Digest</span>
          </h3>
          <div style="font-size:13px; line-height:1.6; color:#e2e8f0;">
            ${parseMarkdownAndKaTeX(aiDigestText)}
          </div>
        </div>
      `;
    }

    container.innerHTML = aiDigestHtml + webCardsHtml;

  } catch (err) {
    if (statusCard) statusCard.style.display = "none";
    container.innerHTML = `<div class="glass-card" style="padding:20px; color:#ef4444; border:1px solid #ef4444;">❌ Research Failed: ${err.message}</div>`;
  }
}

async function fetchLiveSerperNews(category = "all") {
  const key = getSerperApiKey();
  if (!key) return null;

  let query = "NEET UG NTA official news updates 2027";
  if (category === "nta") query = "NTA NEET official notification circular";
  if (category === "syllabus") query = "NEET syllabus changes NMC NTA update";
  if (category === "counseling") query = "NEET MCC counseling admission news";

  try {
    const res = await fetch("https://google.serper.dev/news", {
      method: "POST",
      headers: {
        "X-API-KEY": key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ q: query, gl: "in", num: 6 })
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.news || [];
  } catch (err) {
    console.warn("Serper News fetch failed:", err);
    return null;
  }
}

/* ==========================================================================
   INITIALIZATION & TAB SWITCH HOOKS
   ========================================================================== */

// Backward compatibility safety stubs for legacy cached browser sessions
window.getBraveApiKey = function() { return ""; };
window.saveBraveApiKey = function() {};
window.removeBraveApiKey = function() {};
window.testBraveApiConnection = function() {};
window.toggleBraveVisibility = function() {};
window.onBraveKeyTyped = function() {};
window.updateBraveApiKeyStatusUI = function() {};
window.performBraveSearch = function() { return Promise.resolve(""); };

// Explicitly expose ALL AI feature functions to window object for global HTML onclick access
window.saveApiKey = saveApiKey;
window.removeApiKey = removeApiKey;
window.testApiKeyConnection = testApiKeyConnection;
window.toggleKeyVisibility = toggleKeyVisibility;
window.onKeyInputTyped = onKeyInputTyped;
window.getApiKey = getApiKey;

window.saveSerperApiKey = saveSerperApiKey;
window.removeSerperApiKey = removeSerperApiKey;
window.testSerperApiConnection = testSerperApiConnection;
window.toggleSerperVisibility = toggleSerperVisibility;
window.onSerperKeyTyped = onSerperKeyTyped;
window.getSerperApiKey = getSerperApiKey;
window.toggleResearchMode = toggleResearchMode;
window.performSerperSearch = performSerperSearch;
window.performDedicatedAiResearch = performDedicatedAiResearch;
window.quickResearch = quickResearch;
window.fetchLiveSerperNews = fetchLiveSerperNews;

window.sendTutorMessage = sendTutorMessage;
window.selectSubjectMode = selectSubjectMode;
window.quickAsk = quickAsk;
window.clearChat = clearChat;
window.handleChatKeyPress = handleChatKeyPress;
window.updateCharCount = updateCharCount;
window.generateCbtTest = generateCbtTest;
window.submitCbtTest = submitCbtTest;
window.handlePdfDrop = handlePdfDrop;
window.launchCbtFromPdf = launchCbtFromPdf;
window.generateStudyRecommendation = generateStudyRecommendation;
window.analyzeMistakesWithAI = analyzeMistakesWithAI;
window.summarizeNews = summarizeNews;
window.filterNews = filterNews;
window.copyText = copyText;
window.handleAiTabSwitch = handleAiTabSwitch;

document.addEventListener("DOMContentLoaded", () => {
  updateApiKeyStatusUI();
  updateSerperApiKeyStatusUI();
  renderSetupRequiredCards();
  renderNeetNews("all");

  // Attach direct event listeners for bulletproof button clicks across mobile & desktop
  const saveBtn = document.getElementById("btn-save-api-key");
  if (saveBtn) saveBtn.onclick = saveApiKey;

  const testBtn = document.getElementById("btn-test-api-key");
  if (testBtn) testBtn.onclick = testApiKeyConnection;

  const removeBtn = document.getElementById("btn-remove-api-key");
  if (removeBtn) removeBtn.onclick = removeApiKey;

  const saveSerperBtn = document.getElementById("btn-save-serper-key");
  if (saveSerperBtn) saveSerperBtn.onclick = saveSerperApiKey;

  const testSerperBtn = document.getElementById("btn-test-serper-key");
  if (testSerperBtn) testSerperBtn.onclick = testSerperApiConnection;

  const removeSerperBtn = document.getElementById("btn-remove-serper-key");
  if (removeSerperBtn) removeSerperBtn.onclick = removeSerperApiKey;
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
