'use strict';

/* ==========================================================================
   NEET PLANNER 2027 — AI FEATURES MODULE (gemini-2.0-flash BYOK)
   ========================================================================== */

// --------------------------------------------------------------------------
// SECTION 1: CORE GEMINI API (BRING YOUR OWN KEY MODEL)
// --------------------------------------------------------------------------

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Retrieves saved Gemini API key from localStorage.
 */
function getGeminiApiKey() {
  try {
    const key = localStorage.getItem('gemini_api_key');
    return key ? key.trim() : null;
  } catch (e) {
    return null;
  }
}

/**
 * Saves Gemini API key to localStorage.
 */
function setGeminiApiKey(key) {
  try {
    if (!key || typeof key !== 'string') return false;
    localStorage.setItem('gemini_api_key', key.trim());
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Removes Gemini API key from localStorage.
 */
function removeGeminiApiKey() {
  try {
    localStorage.removeItem('gemini_api_key');
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Checks if Gemini API key is configured.
 */
function checkAiReady() {
  const key = getGeminiApiKey();
  return Boolean(key && key.length > 5);
}

/**
 * Retrieves user AI preferences with sensible defaults.
 */
function getAiPreferences() {
  try {
    return {
      language: localStorage.getItem('ai_language') || 'English',
      detailLevel: localStorage.getItem('ai_detail_level') || 'Exam-focused',
      autoSuggest: localStorage.getItem('ai_auto_suggest') !== 'false'
    };
  } catch (e) {
    return { language: 'English', detailLevel: 'Exam-focused', autoSuggest: true };
  }
}

/**
 * Updates individual AI preference.
 */
function setAiPreference(key, value) {
  try {
    localStorage.setItem(key, value);
    if (typeof showToast === 'function') {
      showToast(`Preference updated: ${value}`);
    }
  } catch (e) {}
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function debounce(func, delay = 800) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Core Gemini API Caller using gemini-2.0-flash with exponential backoff on HTTP 429.
 * Retries on 429 with 2s -> 4s -> 8s -> 16s delays up to 4 retries.
 */
async function callGeminiAPI(userPrompt, systemPrompt = '', options = {}) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('SETUP_REQUIRED: Please configure your free Gemini API key in Settings tab first.');
  }

  const prefs = getAiPreferences();
  let fullSystemPrompt = systemPrompt;
  if (prefs.language === 'Hinglish') {
    fullSystemPrompt += '\n\nNote: Explain concepts in Hinglish (Hindi words written in Roman script mixed with clear English technical terms), maintaining high pedagogical accuracy.';
  }
  if (prefs.detailLevel === 'Concise') {
    fullSystemPrompt += '\n\nNote: Keep explanation crisp, bulleted, and under 250 words.';
  } else if (prefs.detailLevel === 'Detailed') {
    fullSystemPrompt += '\n\nNote: Provide exhaustive step-by-step breakdown with edge cases and derivations.';
  }

  const contents = [];
  if (options.conversationHistory && Array.isArray(options.conversationHistory)) {
    options.conversationHistory.forEach(msg => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });
  }
  contents.push({
    role: 'user',
    parts: [{ text: userPrompt }]
  });

  const payload = { contents };

  if (fullSystemPrompt) {
    payload.system_instruction = {
      parts: [{ text: fullSystemPrompt }]
    };
  }

  const generationConfig = {
    temperature: options.temperature !== undefined ? options.temperature : 0.7,
    maxOutputTokens: options.maxOutputTokens || 8192
  };

  if (options.jsonSchema) {
    generationConfig.responseMimeType = 'application/json';
  }

  payload.generationConfig = generationConfig;

  // Exponential backoff configuration for 429 rate limits
  const maxRetries = 4;
  const backoffDelays = [2000, 4000, 8000, 16000];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const msg = errJson.error?.message || response.statusText;

        if (response.status === 429) {
          if (attempt < maxRetries) {
            const delaySec = backoffDelays[attempt] / 1000;
            const statusMsg = `Google Free Tier rate limit reached. Retrying in ${delaySec}s... (Attempt ${attempt + 1}/${maxRetries})`;
            console.warn(`[Gemini API 429 Rate Limit] ${statusMsg}`);
            if (typeof showToast === 'function') {
              showToast(`⏳ ${statusMsg}`);
            }
            await sleep(backoffDelays[attempt]);
            continue; // Retry loop
          } else {
            throw new Error(`Rate Limit Exceeded (429): Google AI Studio quota exceeded after ${maxRetries} retries. Please wait a minute before retrying.`);
          }
        } else if (response.status === 401 || response.status === 403) {
          throw new Error(`Authentication Error (${response.status}): Invalid API Key. Please verify your key in Settings tab. Details: ${msg}`);
        } else {
          throw new Error(`Gemini API Error (${response.status}): ${msg}`);
        }
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      if (!candidate || !candidate.content?.parts?.[0]?.text) {
        throw new Error('Invalid response structure received from Gemini API.');
      }

      return candidate.content.parts[0].text;
    } catch (err) {
      if (attempt === maxRetries || !err.message.includes('429')) {
        console.error('Gemini Call Failure:', err);
        throw err;
      }
    }
  }
}

/**
 * Tests Gemini API connection with a lightweight prompt.
 */
async function testGeminiConnection() {
  const statusEl = document.getElementById('ai-connection-status');
  if (statusEl) {
    statusEl.className = 'ai-connection-status ai-status-testing';
    statusEl.innerHTML = '<span>🟡</span> Testing connection with Google Gemini 2.0 Flash...';
  }

  try {
    const reply = await callGeminiAPI('Respond with exactly two words: "NEET Ready"', 'You are a test ping agent.', { maxOutputTokens: 10 });
    if (statusEl) {
      statusEl.className = 'ai-connection-status ai-status-connected';
      statusEl.innerHTML = `<span>🟢</span> Connected successfully! (Response: "${reply.trim()}")`;
    }
    if (typeof showToast === 'function') showToast('✅ Gemini API Connected Successfully!');
    return { success: true, message: reply };
  } catch (err) {
    if (statusEl) {
      statusEl.className = 'ai-connection-status ai-status-disconnected';
      statusEl.innerHTML = `<span>🔴</span> Connection Failed: ${err.message}`;
    }
    return { success: false, message: err.message };
  }
}

/**
 * Renders a glass card urging API key setup in containers.
 */
function renderSetupRequired(containerId) {
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  container.innerHTML = `
    <div class="setup-required-card">
      <div class="setup-icon">🔑</div>
      <h3>Gemini API Setup Required</h3>
      <p>All AI features in NEET Planner run 100% client-side using Google's Gemini 2.0 Flash model. To unlock AI Tutor, CBT Generator, and PDF Extraction, please add your free API key.</p>
      <button class="btn btn-primary" onclick="showTab('settings')">
        <span>⚙️</span> Go to Settings to Add Key
      </button>
      <div style="margin-top:14px; font-size:12px; color:var(--text-muted);">
        Takes less than 1 minute • Free from Google AI Studio
      </div>
    </div>
  `;
}

/**
 * Synchronizes UI components in Settings tab with API key status.
 */
function renderApiKeySetup() {
  const input = document.getElementById('ai-api-key-input');
  const statusEl = document.getElementById('ai-connection-status');
  const key = getGeminiApiKey();

  if (input && key) {
    input.value = key;
  }

  if (statusEl) {
    if (key) {
      statusEl.className = 'ai-connection-status ai-status-connected';
      statusEl.innerHTML = '<span>🟢</span> API Key Configured (Click "Test Connection" to verify active quota)';
    } else {
      statusEl.className = 'ai-connection-status ai-status-disconnected';
      statusEl.innerHTML = '<span>🔴</span> No API Key Saved — AI features currently inactive';
    }
  }

  const prefs = getAiPreferences();
  const langRadios = document.querySelectorAll('input[name="ai-language"]');
  langRadios.forEach(r => { r.checked = (r.value === prefs.language); });

  const detailRadios = document.querySelectorAll('input[name="ai-detail"]');
  detailRadios.forEach(r => { r.checked = (r.value === prefs.detailLevel); });

  const autoSuggestCheck = document.getElementById('ai-autosuggest-toggle');
  if (autoSuggestCheck) autoSuggestCheck.checked = prefs.autoSuggest;
}

function toggleApiKeyVisibility() {
  const input = document.getElementById('ai-api-key-input');
  const btn = document.getElementById('ai-key-toggle-btn');
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (btn) btn.textContent = '🙈';
  } else {
    input.type = 'password';
    if (btn) btn.textContent = '👁️';
  }
}

function saveApiKeyFromInput() {
  const input = document.getElementById('ai-api-key-input');
  if (!input || !input.value.trim()) {
    alert('Please enter a valid Gemini API key.');
    return;
  }
  const saved = setGeminiApiKey(input.value.trim());
  if (saved) {
    testGeminiConnection();
  } else {
    alert('Failed to save API key to local storage.');
  }
}

function clearApiKey() {
  if (confirm('Are you sure you want to remove your Gemini API key? AI features will be disabled.')) {
    removeGeminiApiKey();
    const input = document.getElementById('ai-api-key-input');
    if (input) input.value = '';
    renderApiKeySetup();
    if (typeof showToast === 'function') showToast('API Key Removed');
  }
}


// --------------------------------------------------------------------------
// SECTION 2: MARKDOWN & KATEX RENDERING
// --------------------------------------------------------------------------

/**
 * Converts Markdown text into clean HTML while preserving LaTeX math blocks ($...$ and $$...$$).
 */
function renderMarkdown(text) {
  if (!text) return '';

  // Preserve KaTeX math blocks with placeholders
  const mathBlocks = [];
  let placeholderIndex = 0;

  // Preserve display math $$...$$
  let processedText = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
    const key = `___MATH_BLOCK_${placeholderIndex++}___`;
    mathBlocks.push({ key, content: math, display: true });
    return key;
  });

  // Preserve inline math $...$
  processedText = processedText.replace(/\$([^\$\n]+?)\$/g, (match, math) => {
    const key = `___MATH_BLOCK_${placeholderIndex++}___`;
    mathBlocks.push({ key, content: math, display: false });
    return key;
  });

  // Basic Markdown processing
  let html = processedText
    // Escaping HTML entities for safety
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Restore placeholders from entity conversion
    .replace(/___MATH_BLOCK_(\d+)___/g, (match) => match)
    // Code blocks
    .replace(/```([a-z]*)\n([\s\S]*?)```/gi, (match, lang, code) => {
      return `<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`;
    })
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headings
    .replace(/^### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^## (.*$)/gim, '<h3>$1</h3>')
    .replace(/^# (.*$)/gim, '<h3>$1</h3>')
    // Bold & Italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Blockquotes
    .replace(/^\&gt; (.*$)/gim, '<blockquote>$1</blockquote>')
    // Lists
    .replace(/^\s*[\-\*] (.*$)/gim, '<li>$1</li>')
    .replace(/^\s*\d+\. (.*$)/gim, '<li>$1</li>')
    // Paragraph breaks
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');

  // Wrap loose <li> items in <ul>
  html = html.replace(/(<li>[\s\S]*?<\/li>)/gi, '<ul>$1</ul>');
  // Clean redundant nested <ul>
  html = html.replace(/<\/ul>\s*<ul>/gi, '');

  // Re-insert math blocks
  mathBlocks.forEach(block => {
    const mathTag = block.display 
      ? `$$${block.content}$$` 
      : `$${block.content}$`;
    html = html.replace(block.key, mathTag);
  });

  return html;
}

/**
 * Triggers KaTeX rendering on a given DOM element.
 */
function renderKaTeX(element) {
  if (!element || typeof window.katex === 'undefined') return;

  try {
    const rawHTML = element.innerHTML;
    // Replace display math $$...$$
    let formattedHTML = rawHTML.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
      try {
        return window.katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
      } catch (e) {
        return match;
      }
    });

    // Replace inline math $...$
    formattedHTML = formattedHTML.replace(/\$([^\$\n]+?)\$/g, (match, math) => {
      try {
        return window.katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
      } catch (e) {
        return match;
      }
    });

    element.innerHTML = formattedHTML;
  } catch (err) {
    console.warn('KaTeX rendering notice:', err);
  }
}


// --------------------------------------------------------------------------
// SECTION 3: AI TUTOR CHAT ENGINE
// --------------------------------------------------------------------------

const AI_TUTOR_SYSTEM_PROMPTS = {
  general: `You are an expert NEET (National Eligibility cum Entrance Test) tutor for Indian medical entrance exam preparation. You specialize in Physics, Chemistry, and Biology at the Class 11-12 NCERT level.

Rules:
1. Always give step-by-step explanations
2. Reference NCERT chapters and page numbers when possible
3. Use LaTeX (wrapped in $ for inline, $$ for display) for all formulas and equations
4. For Physics: Draw conceptual descriptions, use Free-Body Diagrams (FBDs), and show unit analysis
5. For Chemistry: Show reaction mechanisms, balance equations, explain with electron concepts
6. For Biology: Use classification hierarchies, compare-contrast tables, and mnemonic aids
7. Keep language simple and motivating — remember the student is a NEET aspirant
8. If a question is outside NEET syllabus, mention that politely
9. End complex answers with a "Quick Recall Point" summary
10. Use examples from previous NEET papers when relevant`,

  physics: `You are an expert NEET Physics Specialist. Focus heavily on vector components, free-body diagrams (FBDs), step-by-step mathematical derivations, dimensional analysis, and practical problem-solving shortcuts (like conservation laws, work-energy theorem, nodal analysis). Always provide SI units and highlight standard tricks used in NEET MCQs. Wrap all math in $...$ or $$...$$.`,

  chemistry: `You are an expert NEET Chemistry Specialist. Cover Physical, Organic, and Inorganic Chemistry strictly aligned with NCERT. For Organic, detail reaction mechanisms (SN1, SN2, electrophilic addition), reagents, and intermediate stability. For Physical, give exact formulas with unit conversions (e.g. R values, gas law units). For Inorganic, cite NCERT trends, exceptions, and coordination compound isomerism. Wrap all formulas and equations in $...$ or $$...$$.`,

  biology: `You are an expert NEET Biology Specialist. Cite exact NCERT Class 11 & 12 textbook references. Structure answers with bullet points, comparison tables, biological classification hierarchies, process flowcharts (e.g. Krebs cycle, Glycolysis), and memorable mnemonics for examples. Highlight keywords that commonly appear as options in NEET NTA papers.`
};

let aiTutorMessages = [];
let aiTutorSubject = 'general';
let aiTutorLoading = false;

function initAiTutor() {
  const setupEl = document.getElementById('ai-tutor-setup');
  const chatEl = document.getElementById('ai-tutor-chat-area');

  if (!checkAiReady()) {
    if (setupEl) {
      setupEl.style.display = 'block';
      renderSetupRequired('ai-tutor-setup');
    }
    if (chatEl) chatEl.style.display = 'none';
    return;
  }

  if (setupEl) setupEl.style.display = 'none';
  if (chatEl) chatEl.style.display = 'flex';

  // Attach keyboard listener for Ctrl+Enter
  const inputTx = document.getElementById('ai-tutor-input');
  if (inputTx && !inputTx.dataset.listenerAttached) {
    inputTx.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        sendAiTutorMessage();
      }
    });
    inputTx.dataset.listenerAttached = 'true';
  }
}

function setAiTutorSubject(subject) {
  aiTutorSubject = subject || 'general';
  document.querySelectorAll('.subject-toggle').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.subject === aiTutorSubject);
  });
  if (typeof showToast === 'function') {
    const nameMap = { general: 'General NEET', physics: 'Physics ⚡', chemistry: 'Chemistry 🧪', biology: 'Biology 🧬' };
    showToast(`Switched to ${nameMap[aiTutorSubject] || subject} mode`);
  }
}

async function sendAiTutorMessage() {
  if (aiTutorLoading) return;
  const inputEl = document.getElementById('ai-tutor-input');
  if (!inputEl) return;
  const userText = inputEl.value.trim();
  if (!userText) return;

  if (!checkAiReady()) {
    showTab('settings');
    return;
  }

  // Render User Message
  renderChatMessage('user', userText);
  aiTutorMessages.push({ role: 'user', content: userText });
  inputEl.value = '';
  updateCharCount();

  aiTutorLoading = true;
  showTypingIndicator();

  try {
    const systemPrompt = AI_TUTOR_SYSTEM_PROMPTS[aiTutorSubject] || AI_TUTOR_SYSTEM_PROMPTS.general;
    // Context history (last 8 turns)
    const contextHistory = aiTutorMessages.slice(-8);

    const aiReplyText = await callGeminiAPI(userText, systemPrompt, {
      conversationHistory: contextHistory
    });

    hideTypingIndicator();
    renderChatMessage('ai', aiReplyText);
    aiTutorMessages.push({ role: 'ai', content: aiReplyText });
  } catch (err) {
    hideTypingIndicator();
    renderChatMessage('ai', `⚠️ **Error**: ${err.message}`);
  } finally {
    aiTutorLoading = false;
  }
}

function renderChatMessage(role, content) {
  const container = document.getElementById('ai-chat-messages');
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${role === 'user' ? 'chat-msg-user' : 'chat-msg-ai'}`;

  if (role === 'ai') {
    const htmlContent = renderMarkdown(content);
    msgDiv.innerHTML = `
      <button class="msg-copy-btn" onclick="copyAiResponse(this)">📋 Copy</button>
      <div class="msg-content">${htmlContent}</div>
    `;
  } else {
    msgDiv.textContent = content;
  }

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;

  if (role === 'ai') {
    renderKaTeX(msgDiv);
  }
}

function showTypingIndicator() {
  const container = document.getElementById('ai-chat-messages');
  if (!container) return;
  let indicator = document.getElementById('ai-typing-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'ai-typing-indicator';
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <span style="font-size:12px; color:var(--text-muted); margin-left:6px;">Gemini is thinking...</span>
    `;
  }
  container.appendChild(indicator);
  container.scrollTop = container.scrollHeight;
}

function hideTypingIndicator() {
  const indicator = document.getElementById('ai-typing-indicator');
  if (indicator && indicator.parentNode) {
    indicator.parentNode.removeChild(indicator);
  }
}

function clearAiTutorChat() {
  aiTutorMessages = [];
  const container = document.getElementById('ai-chat-messages');
  if (container) container.innerHTML = '';
  if (typeof showToast === 'function') showToast('Chat history cleared');
}

function copyAiResponse(btn) {
  const parent = btn.closest('.chat-msg-ai');
  if (!parent) return;
  const text = parent.querySelector('.msg-content')?.innerText || parent.innerText;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '✅ Copied!';
    setTimeout(() => { btn.textContent = '📋 Copy'; }, 2000);
  });
}

function insertQuickAction(promptText) {
  const inputEl = document.getElementById('ai-tutor-input');
  if (!inputEl) return;
  inputEl.value = promptText + ' ';
  inputEl.focus();
  updateCharCount();
}

function updateCharCount() {
  const inputEl = document.getElementById('ai-tutor-input');
  const countEl = document.getElementById('ai-char-count');
  if (inputEl && countEl) {
    countEl.textContent = `${inputEl.value.length}/2000`;
  }
}


// --------------------------------------------------------------------------
// SECTION 4: AI CBT MOCK TEST GENERATOR (NTA-STYLE INTERFACE)
// --------------------------------------------------------------------------

let mockTestQuestions = [];
let mockTestAnswers = {};
let mockTestMarked = new Set();
let mockTestVisited = new Set();
let mockTestCurrentIdx = 0;
let mockTestTimer = null;
let mockTestTimeRemaining = 0;
let mockTestStartTime = null;

function initMockTestTab() {
  const setupEl = document.getElementById('mocktest-setup-required');
  const contentEl = document.getElementById('mocktest-main-content');

  if (!checkAiReady()) {
    if (setupEl) {
      setupEl.style.display = 'block';
      renderSetupRequired('mocktest-setup-required');
    }
    if (contentEl) contentEl.style.display = 'none';
    return;
  }

  if (setupEl) setupEl.style.display = 'none';
  if (contentEl) contentEl.style.display = 'block';

  populateChapterSelect();
}

/**
 * Reads chapters from global CHAPS / window.CHAPTERS to populate multi-select.
 */
function populateChapterSelect() {
  const container = document.getElementById('mocktest-chapter-select');
  if (!container) return;

  const chapsObj = window.CHAPS || {};
  let html = '';

  const subjects = [
    { key: 'phy', name: 'Physics', color: '#378ADD' },
    { key: 'chem', name: 'Chemistry', color: '#639922' },
    { key: 'bio', name: 'Biology', color: '#E24B4A' }
  ];

  subjects.forEach(sub => {
    const list = chapsObj[sub.key] || [];
    if (list.length > 0) {
      html += `<div class="chapter-subject-header" style="color:${sub.color}">${sub.name}</div>`;
      list.forEach(item => {
        const chapName = Array.isArray(item) ? item[0] : item;
        html += `
          <label>
            <input type="checkbox" class="mocktest-chap-cb" data-subject="${sub.name}" value="${chapName}">
            <span>${chapName}</span>
          </label>
        `;
      });
    }
  });

  if (!html) {
    html = '<div style="padding:10px; color:var(--text-muted);">Standard NEET Syllabus Chapters (All Selected)</div>';
  }

  container.innerHTML = html;
}

function updateChapterSelectBySubject() {
  const checkedSubjects = Array.from(document.querySelectorAll('.mocktest-sub-cb:checked')).map(c => c.value);
  document.querySelectorAll('.mocktest-chap-cb').forEach(cb => {
    const parentLabel = cb.closest('label');
    if (parentLabel) {
      const subName = cb.dataset.subject;
      if (checkedSubjects.length === 0 || checkedSubjects.includes(subName)) {
        parentLabel.style.display = 'flex';
      } else {
        parentLabel.style.display = 'none';
        cb.checked = false;
      }
    }
  });
}

async function generateMockTest() {
  if (!checkAiReady()) {
    showTab('settings');
    return;
  }

  const selectedSubjects = Array.from(document.querySelectorAll('.mocktest-sub-cb:checked')).map(cb => cb.value);
  const subjectsToUse = selectedSubjects.length > 0 ? selectedSubjects.join(', ') : 'Physics, Chemistry, Biology';

  const selectedChaps = Array.from(document.querySelectorAll('.mocktest-chap-cb:checked')).map(cb => cb.value);
  const chaptersText = selectedChaps.length > 0 ? selectedChaps.slice(0, 15).join(', ') : 'Full Syllabus NCERT';

  const diffEl = document.querySelector('input[name="mock-diff"]:checked');
  const difficulty = diffEl ? diffEl.value : 'Mixed';

  const countEl = document.querySelector('input[name="mock-count"]:checked');
  const questionCount = countEl ? parseInt(countEl.value, 10) : 20;

  const customTimeInput = document.getElementById('mocktest-custom-time');
  const durationMinutes = (customTimeInput && customTimeInput.value) 
    ? parseInt(customTimeInput.value, 10) 
    : Math.ceil(questionCount * 1.5);

  // Switch to loading view
  document.getElementById('mocktest-config').style.display = 'none';
  document.getElementById('mocktest-loading').style.display = 'flex';
  document.getElementById('mocktest-exam').style.display = 'none';
  document.getElementById('mocktest-results').style.display = 'none';

  const systemPrompt = `You are a Senior National Testing Agency (NTA) Question Paper Setter for the NEET UG Examination.
Generate exactly ${questionCount} high-yield, NTA-pattern Multiple Choice Questions (MCQs) for NEET aspirants.

Target Subjects: ${subjectsToUse}
Chapters Covered: ${chaptersText}
Difficulty Profile: ${difficulty}

CRITICAL RULES:
1. Each question must have exactly 4 options labeled (a), (b), (c), (d).
2. Follow NTA NEET marking standard: +4 for correct, -1 for wrong.
3. Include LaTeX math expressions wrapped in $ or $$ for any physical quantities, reactions, or formulas.
4. Output MUST BE valid JSON adhering to the required schema. No conversational preamble.`;

  const userPrompt = `Generate a test of ${questionCount} questions in JSON format:
[
  {
    "question": "Question text here with $LaTeX$",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "2-3 line NCERT explanation",
    "reference": "NCERT Chapter Name",
    "difficulty": "Easy|Medium|Hard",
    "subject": "Physics|Chemistry|Biology"
  }
]`;

  try {
    const rawJson = await callGeminiAPI(userPrompt, systemPrompt, {
      jsonSchema: true,
      temperature: 0.5
    });

    let parsed = JSON.parse(rawJson);
    if (!Array.isArray(parsed)) {
      if (parsed.questions && Array.isArray(parsed.questions)) {
        parsed = parsed.questions;
      } else {
        throw new Error('Parsed output is not an array of questions');
      }
    }

    mockTestQuestions = parsed.map((q, idx) => ({
      id: idx + 1,
      question: q.question || `Question ${idx + 1}`,
      options: Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
      correct: typeof q.correct === 'number' ? q.correct : 0,
      explanation: q.explanation || 'Refer to NCERT textbook.',
      reference: q.reference || 'NCERT Class 11/12',
      difficulty: q.difficulty || 'Medium',
      subject: q.subject || 'Biology'
    }));

    initMockTestExam(mockTestQuestions, durationMinutes);
  } catch (err) {
    alert(`Failed to generate test: ${err.message}`);
    document.getElementById('mocktest-config').style.display = 'block';
    document.getElementById('mocktest-loading').style.display = 'none';
  }
}

function initMockTestExam(questions, durationMinutes) {
  mockTestQuestions = questions;
  mockTestAnswers = {};
  mockTestMarked = new Set();
  mockTestVisited = new Set([0]);
  mockTestCurrentIdx = 0;
  mockTestTimeRemaining = durationMinutes * 60;
  mockTestStartTime = Date.now();

  document.getElementById('mocktest-config').style.display = 'none';
  document.getElementById('mocktest-loading').style.display = 'none';
  document.getElementById('mocktest-exam').style.display = 'flex';
  document.getElementById('mocktest-results').style.display = 'none';

  renderMockTestQuestion(0);
  updateMockTestPalette();
  startMockTestTimer(mockTestTimeRemaining);
}

function renderMockTestQuestion(index) {
  if (index < 0 || index >= mockTestQuestions.length) return;
  mockTestCurrentIdx = index;
  mockTestVisited.add(index);

  const q = mockTestQuestions[index];
  const qArea = document.getElementById('mocktest-question-area');
  const optsArea = document.getElementById('mocktest-options');

  if (qArea) {
    qArea.innerHTML = `
      <div class="exam-question-number">Question ${index + 1} of ${mockTestQuestions.length} • <span class="subject-badge subject-badge-${q.subject.toLowerCase()}">${q.subject}</span> • <span style="color:var(--text-muted); font-size:11px;">[${q.difficulty}]</span></div>
      <div class="exam-question-text">${renderMarkdown(q.question)}</div>
    `;
    renderKaTeX(qArea);
  }

  if (optsArea) {
    let optsHtml = '';
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((optText, optIdx) => {
      const isSelected = mockTestAnswers[index] === optIdx;
      optsHtml += `
        <div class="exam-option-card ${isSelected ? 'selected' : ''}" onclick="selectMockTestOption(${index}, ${optIdx})">
          <div class="option-label">${letters[optIdx]}</div>
          <div class="option-text">${renderMarkdown(optText)}</div>
        </div>
      `;
    });
    optsArea.innerHTML = optsHtml;
    renderKaTeX(optsArea);
  }

  // Update Review Checkbox
  const markCb = document.getElementById('mocktest-mark-review-cb');
  if (markCb) {
    markCb.checked = mockTestMarked.has(index);
  }

  updateMockTestPalette();
}

function selectMockTestOption(questionIdx, optionIdx) {
  mockTestAnswers[questionIdx] = optionIdx;
  renderMockTestQuestion(questionIdx);
}

function toggleMockTestMark(questionIdx) {
  const target = questionIdx !== undefined ? questionIdx : mockTestCurrentIdx;
  if (mockTestMarked.has(target)) {
    mockTestMarked.delete(target);
  } else {
    mockTestMarked.add(target);
  }
  updateMockTestPalette();
}

function clearMockTestResponse() {
  delete mockTestAnswers[mockTestCurrentIdx];
  renderMockTestQuestion(mockTestCurrentIdx);
}

function navigateMockTestQuestion(direction) {
  if (direction === 'prev' && mockTestCurrentIdx > 0) {
    renderMockTestQuestion(mockTestCurrentIdx - 1);
  } else if (direction === 'next' && mockTestCurrentIdx < mockTestQuestions.length - 1) {
    renderMockTestQuestion(mockTestCurrentIdx + 1);
  }
}

function jumpToMockTestQuestion(index) {
  renderMockTestQuestion(index);
}

function updateMockTestPalette() {
  const grid = document.getElementById('mocktest-palette');
  if (!grid) return;

  let html = '';
  mockTestQuestions.forEach((q, idx) => {
    const isAnswered = mockTestAnswers[idx] !== undefined;
    const isMarked = mockTestMarked.has(idx);
    const isVisited = mockTestVisited.has(idx);
    const isCurrent = idx === mockTestCurrentIdx;

    let colorClass = 'palette-not-visited';
    if (isAnswered && isMarked) {
      colorClass = 'palette-answered-marked';
    } else if (isAnswered) {
      colorClass = 'palette-answered';
    } else if (isMarked) {
      colorClass = 'palette-marked';
    } else if (isVisited) {
      colorClass = 'palette-not-answered';
    }

    html += `
      <div class="palette-item ${colorClass} ${isCurrent ? 'current' : ''}" onclick="jumpToMockTestQuestion(${idx})">
        ${idx + 1}
      </div>
    `;
  });

  grid.innerHTML = html;
}

function startMockTestTimer(seconds) {
  if (mockTestTimer) clearInterval(mockTestTimer);
  mockTestTimeRemaining = seconds;

  const timerEl = document.getElementById('mocktest-timer');

  mockTestTimer = setInterval(() => {
    mockTestTimeRemaining--;
    if (timerEl) {
      const mins = Math.floor(mockTestTimeRemaining / 60);
      const secs = mockTestTimeRemaining % 60;
      timerEl.textContent = `⏱️ ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      if (mockTestTimeRemaining <= 300) {
        timerEl.classList.add('warning');
      } else {
        timerEl.classList.remove('warning');
      }
    }

    if (mockTestTimeRemaining <= 0) {
      clearInterval(mockTestTimer);
      alert('⏰ Time limit reached! Submitting test automatically.');
      submitMockTest(true);
    }
  }, 1000);
}

function submitMockTest(skipConfirm = false) {
  if (!skipConfirm && !confirm('Are you sure you want to submit the test?')) {
    return;
  }

  if (mockTestTimer) clearInterval(mockTestTimer);

  let totalScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const subjectStats = {
    Physics: { correct: 0, incorrect: 0, unanswered: 0, score: 0 },
    Chemistry: { correct: 0, incorrect: 0, unanswered: 0, score: 0 },
    Biology: { correct: 0, incorrect: 0, unanswered: 0, score: 0 }
  };

  mockTestQuestions.forEach((q, idx) => {
    const userAns = mockTestAnswers[idx];
    const sub = subjectStats[q.subject] ? q.subject : 'Biology';

    if (userAns === undefined) {
      unansweredCount++;
      subjectStats[sub].unanswered++;
    } else if (userAns === q.correct) {
      correctCount++;
      totalScore += 4;
      subjectStats[sub].correct++;
      subjectStats[sub].score += 4;
    } else {
      incorrectCount++;
      totalScore -= 1;
      subjectStats[sub].incorrect++;
      subjectStats[sub].score -= 1;
    }
  });

  const maxPossible = mockTestQuestions.length * 4;
  const accuracy = (correctCount + incorrectCount) > 0 
    ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) 
    : 0;

  const resultObj = {
    date: new Date().toLocaleDateString('en-IN'),
    totalScore,
    maxPossible,
    accuracy,
    correctCount,
    incorrectCount,
    unansweredCount,
    subjectStats,
    timeTakenSeconds: Math.round((Date.now() - mockTestStartTime) / 1000)
  };

  renderMockTestResults(resultObj);
}

/**
 * Compiles a comprehensive snapshot of all user website progress data:
 * - 309-day study plan progress & today's assigned chapters
 * - Completed vs pending chapters per subject
 * - Error Book logged mistakes & weak categories
 * - Past mock test scores & trend
 * - Study timer & daily tracker stats
 */
function getCompleteWebsiteContext() {
  try {
    const planStartStr = localStorage.getItem('planStart') || '2026-06-29';
    const planStart = new Date(planStartStr);
    const today = new Date();
    const currentDayNum = Math.max(1, Math.floor((today - planStart) / (1000 * 60 * 60 * 24)) + 1);

    // Completed days
    const doneDays = JSON.parse(localStorage.getItem('neet_v3_done') || '[]');

    // Chapter progress
    const chapProgress = JSON.parse(localStorage.getItem('neet_v3_chapter_progress') || '{}');
    let completedChapsCount = 0;
    Object.values(chapProgress).forEach(status => {
      if (status === true || status === 'completed') completedChapsCount++;
    });

    // Error book
    const errorItems = JSON.parse(localStorage.getItem('neet_v3_errorbook_items') || '[]');
    const errorsBySubject = {};
    const errorsByChapter = {};
    errorItems.forEach(item => {
      const sub = item.subject || 'General';
      const chap = item.chapter || 'General';
      errorsBySubject[sub] = (errorsBySubject[sub] || 0) + 1;
      errorsByChapter[chap] = (errorsByChapter[chap] || 0) + 1;
    });

    // Top weak chapters from error book
    const weakChaps = Object.entries(errorsByChapter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([c, count]) => `${c} (${count} errors)`)
      .join(', ');

    // Mock tests history
    const mockTests = JSON.parse(localStorage.getItem('neet_v3_mock_tests') || '[]');
    const pastScores = mockTests.slice(0, 5).map(m => `${m.date}: ${m.total || m.totalScore || 0} pts`).join(', ');

    // Today's plan from window.PLAN
    let todaysPlan = `Day ${currentDayNum}`;
    if (window.PLAN && Array.isArray(window.PLAN) && window.PLAN[currentDayNum - 1]) {
      const dayData = window.PLAN[currentDayNum - 1];
      todaysPlan = `Day ${currentDayNum} — Physics: ${dayData.phyChap || dayData.phy || 'N/A'} | Chemistry: ${dayData.cheChap || dayData.che || 'N/A'} | Biology: ${dayData.bioChap || dayData.bio || 'N/A'}`;
    }

    return `
=== NEET PLANNER 2027 WEBSITE CONTEXT ===
• Current Study Plan Progress: Day ${currentDayNum} of 309 (${doneDays.length} days marked complete)
• Today's Scheduled Assignment: ${todaysPlan}
• Chapter Coverage: ${completedChapsCount} chapters completed in tracker
• Error Book Log: ${errorItems.length} total mistakes logged (Subject Breakdown: ${JSON.stringify(errorsBySubject)})
• Top Weak Chapters: ${weakChaps || 'None logged yet'}
• Past Mock Tests History (${mockTests.length} tests): ${pastScores || 'No previous tests'}
==========================================`;
  } catch (e) {
    return 'Website Context: 309-Day NEET 2027 Study Plan Active.';
  }
}

function renderMockTestResults(results) {
  lastMockTestResults = results;
  document.getElementById('mocktest-exam').style.display = 'none';
  document.getElementById('mocktest-results').style.display = 'block';

  // Populate main metrics in index.html
  const totalScoreEl = document.getElementById('result-total-score');
  const maxScoreEl = document.getElementById('result-max-score');
  const accuracyEl = document.getElementById('result-accuracy');
  const timeTakenEl = document.getElementById('result-time-taken');
  const avgPaceEl = document.getElementById('result-avg-pace');
  const correctEl = document.getElementById('result-correct-count');
  const incorrectEl = document.getElementById('result-incorrect-count');
  const unansweredEl = document.getElementById('result-unanswered-count');

  if (totalScoreEl) totalScoreEl.textContent = results.totalScore;
  if (maxScoreEl) maxScoreEl.textContent = results.maxPossible;
  if (accuracyEl) accuracyEl.textContent = results.accuracy;

  const totalSecs = results.timeTakenSeconds || 0;
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  if (timeTakenEl) timeTakenEl.textContent = `${mins}m ${secs}s`;

  const totalQ = mockTestQuestions.length || 1;
  const avgSecs = Math.round(totalSecs / totalQ);
  if (avgPaceEl) avgPaceEl.textContent = `${avgSecs}s / question`;

  if (correctEl) correctEl.textContent = results.correctCount;
  if (incorrectEl) incorrectEl.textContent = results.incorrectCount;
  if (unansweredEl) unansweredEl.textContent = results.unansweredCount;

  // Render subject breakdown
  const subContainer = document.getElementById('result-subject-breakdown');
  if (subContainer) {
    let subHtml = '';
    Object.entries(results.subjectStats).forEach(([name, data]) => {
      subHtml += `
        <div class="results-subject-card" style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:10px; padding:16px; text-align:center;">
          <div class="subject-name" style="font-size:13px; font-weight:700; text-transform:uppercase; margin-bottom:6px;">${name}</div>
          <div class="subject-score" style="font-size:28px; font-weight:800; font-family:var(--font-mono); color:var(--primary);">${data.score} pts</div>
          <div class="subject-accuracy" style="font-size:12px; color:var(--text-secondary); margin-top:6px;">
            <span style="color:var(--accent-success);">✅ ${data.correct} Right (+${data.correct * 4})</span> • 
            <span style="color:var(--accent-danger);">❌ ${data.incorrect} Wrong (-${data.incorrect})</span> • 
            <span style="color:var(--text-muted);">⚪ ${data.unanswered} Left</span>
          </div>
        </div>
      `;
    });
    subContainer.innerHTML = subHtml;
  }

  // Render Review List
  const reviewContainer = document.getElementById('mocktest-review-list');
  if (reviewContainer) {
    let revHtml = '';
    const letters = ['A', 'B', 'C', 'D'];
    mockTestQuestions.forEach((q, idx) => {
      const userAns = mockTestAnswers[idx];
      const isRight = userAns === q.correct;
      const isUnanswered = userAns === undefined;

      revHtml += `
        <div class="review-question-card">
          <div class="review-qnum">
            Question ${idx + 1} (${q.subject}) — 
            <span style="color:${isRight ? 'var(--accent-success)' : isUnanswered ? 'var(--text-muted)' : 'var(--accent-danger)'}">
              ${isRight ? '+4 (Correct)' : isUnanswered ? '0 (Unanswered)' : '-1 (Incorrect)'}
            </span>
          </div>
          <div style="font-size:14px; margin-bottom:8px;">${renderMarkdown(q.question)}</div>
          <div style="font-size:13px; margin-bottom:4px;"><strong>Your Choice:</strong> ${userAns !== undefined ? `${letters[userAns]}: ${q.options[userAns]}` : '<em>None</em>'}</div>
          <div style="font-size:13px; color:var(--accent-success); margin-bottom:8px;"><strong>Correct Choice:</strong> ${letters[q.correct]}: ${q.options[q.correct]}</div>
          <div class="review-explanation"><strong>Explanation:</strong> ${renderMarkdown(q.explanation)} <br><em>[Ref: ${q.reference}]</em></div>
        </div>
      `;
    });
    reviewContainer.innerHTML = revHtml;
    renderKaTeX(reviewContainer);
  }

  // Request AI Feedback with Full Website Context
  generateMockTestAiFeedback(results);
}

async function generateMockTestAiFeedback(results) {
  const fbContainer = document.getElementById('mocktest-ai-feedback');
  if (!fbContainer) return;

  fbContainer.innerHTML = '<div style="color:var(--text-muted); font-size:13px;">🤖 Analyzing performance with Gemini & Full Website Context...</div>';

  try {
    const siteContext = getCompleteWebsiteContext();
    const prompt = `Analyze this NEET mock test performance in relation to the student's complete 309-day study plan progress:

${siteContext}

RECENT MOCK TEST PERFORMANCE:
- Total Score: ${results.totalScore} / ${results.maxPossible} (Accuracy: ${results.accuracy}%)
- Total Time Taken: ${Math.floor((results.timeTakenSeconds || 0)/60)}m ${(results.timeTakenSeconds || 0)%60}s (Avg Pace: ${Math.round((results.timeTakenSeconds || 0)/mockTestQuestions.length)}s/question)
- Correct Answers (+4): ${results.correctCount}
- Incorrect Answers (-1): ${results.incorrectCount}
- Unattempted (0): ${results.unansweredCount}

Subject Breakdown:
- Physics: ${results.subjectStats.Physics.score} pts (✅ ${results.subjectStats.Physics.correct} right, ❌ ${results.subjectStats.Physics.incorrect} wrong, ⚪ ${results.subjectStats.Physics.unanswered} left)
- Chemistry: ${results.subjectStats.Chemistry.score} pts (✅ ${results.subjectStats.Chemistry.correct} right, ❌ ${results.subjectStats.Chemistry.incorrect} wrong, ⚪ ${results.subjectStats.Chemistry.unanswered} left)
- Biology: ${results.subjectStats.Biology.score} pts (✅ ${results.subjectStats.Biology.correct} right, ❌ ${results.subjectStats.Biology.incorrect} wrong, ⚪ ${results.subjectStats.Biology.unanswered} left)

Provide:
1. 📈 Comprehensive Performance & Time Management Evaluation (is the student rushing or over-analyzing?)
2. 🎯 Subject-by-Subject Deep Dive
3. 🗓️ Strategic Alignment with 309-Day Plan & Immediate 7-Day Action Plan`;

    const feedbackText = await callGeminiAPI(prompt, 'You are an elite NEET performance analyst with access to the student\'s complete study planner data.', { temperature: 0.6 });
    fbContainer.innerHTML = `
      <div class="glass-card" style="border-color:var(--primary)">
        <h4 style="color:var(--primary); margin-bottom:8px;">🤖 AI Performance Coach Analysis (Full Planner Context)</h4>
        <div style="font-size:13px; line-height:1.6;">${renderMarkdown(feedbackText)}</div>
      </div>
    `;
    renderKaTeX(fbContainer);
  } catch (err) {
    fbContainer.innerHTML = `<div style="color:var(--accent-danger); font-size:12px;">Could not load AI analysis: ${err.message}</div>`;
  }
}

let lastMockTestResults = null;

function saveMockTestToTracker() {
  try {
    const existing = JSON.parse(localStorage.getItem('neet_v3_mock_tests') || '[]');
    let record;
    if (lastMockTestResults) {
      record = {
        id: `ai_mock_${Date.now()}`,
        name: `AI CBT Test (${new Date().toLocaleDateString('en-IN')})`,
        date: new Date().toISOString().split('T')[0],
        total: lastMockTestResults.totalScore || 0,
        phy: lastMockTestResults.subjectStats?.Physics?.score || 0,
        che: lastMockTestResults.subjectStats?.Chemistry?.score || 0,
        bio: lastMockTestResults.subjectStats?.Biology?.score || 0
      };
    } else {
      const latestScore = document.getElementById('result-total-score')?.textContent || '0';
      record = {
        id: `ai_mock_${Date.now()}`,
        name: `AI CBT Test (${new Date().toLocaleDateString('en-IN')})`,
        date: new Date().toISOString().split('T')[0],
        total: parseInt(latestScore, 10) || 0,
        phy: 0, che: 0, bio: 0
      };
    }
    existing.unshift(record);
    localStorage.setItem('neet_v3_mock_tests', JSON.stringify(existing));
    if (typeof renderTestList === 'function') renderTestList();
    if (typeof renderMockTestsDashboard === 'function') renderMockTestsDashboard();
    if (typeof showToast === 'function') showToast('✅ Saved to Mock Test Tracker!');
    else alert('✅ Saved to Mock Test Tracker!');
  } catch (e) {
    console.error("Error saving mock test to tracker:", e);
    alert('Failed to save result to tracker.');
  }
}

function exitMockTest() {
  document.getElementById('mocktest-config').style.display = 'block';
  document.getElementById('mocktest-loading').style.display = 'none';
  document.getElementById('mocktest-exam').style.display = 'none';
  document.getElementById('mocktest-results').style.display = 'none';
}

function retakeMockTest() {
  if (mockTestQuestions.length > 0) {
    initMockTestExam(mockTestQuestions, 30);
  }
}


// --------------------------------------------------------------------------
// SECTION 5: PDF QUESTION EXTRACTOR & TEST MAKER (PDF.JS + INDEXEDDB)
// --------------------------------------------------------------------------

let pdfExtractedQuestions = [];
let questionBanksDB = null;

function initPdfToTest() {
  const setupEl = document.getElementById('pdf-setup-required');
  const mainEl = document.getElementById('pdf-main-content');

  if (!checkAiReady()) {
    if (setupEl) {
      setupEl.style.display = 'block';
      renderSetupRequired('pdf-setup-required');
    }
    if (mainEl) mainEl.style.display = 'none';
    return;
  }

  if (setupEl) setupEl.style.display = 'none';
  if (mainEl) mainEl.style.display = 'block';

  setupPdfDropZone();
  openQuestionBankDB().then(loadQuestionBanks).catch(err => console.warn('IDB Notice:', err));
}

function setupPdfDropZone() {
  const dropzone = document.getElementById('pdf-dropzone');
  const fileInput = document.getElementById('pdf-file-input');

  if (!dropzone || dropzone.dataset.initialized) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) handlePdfFileSelect(files[0]);
  });

  dropzone.addEventListener('click', () => {
    if (fileInput) fileInput.click();
  });

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) handlePdfFileSelect(e.target.files[0]);
    });
  }

  dropzone.dataset.initialized = 'true';
}

async function handlePdfFileSelect(file) {
  if (!file || file.type !== 'application/pdf') {
    alert('Please select a valid PDF file.');
    return;
  }

  if (file.size > 20 * 1024 * 1024) {
    alert('File size exceeds maximum limit of 20MB.');
    return;
  }

  document.getElementById('pdf-upload-view').style.display = 'none';
  document.getElementById('pdf-processing-view').style.display = 'block';

  try {
    const extractedText = await extractTextFromPdf(file);
    const questions = await parseQuestionsFromText(extractedText);
    pdfExtractedQuestions = questions;
    renderExtractedQuestions(questions);
  } catch (err) {
    alert(`PDF Extraction Error: ${err.message}`);
    document.getElementById('pdf-upload-view').style.display = 'block';
    document.getElementById('pdf-processing-view').style.display = 'none';
  }
}

async function extractTextFromPdf(file) {
  if (typeof window.pdfjsLib === 'undefined') {
    throw new Error('PDF.js library is loading or unavailable. Please check your internet connection.');
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  const progressBar = document.getElementById('pdf-progress-fill');
  const statusText = document.getElementById('pdf-status-text');

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageStrings = content.items.map(item => item.str);
    fullText += pageStrings.join(' ') + '\n';

    const percent = Math.round((i / pdf.numPages) * 100);
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (statusText) statusText.textContent = `Extracting text from page ${i} of ${pdf.numPages}...`;
  }

  return fullText;
}

async function parseQuestionsFromText(text) {
  const statusText = document.getElementById('pdf-status-text');
  if (statusText) statusText.textContent = 'Parsing MCQs with Gemini 2.0 Flash...';

  const systemPrompt = `You are a NEET Exam PDF Parser. Extract all multiple-choice questions (MCQs) from raw PDF text.
Convert all math formulas into LaTeX $...$. Ensure each question has 4 options.`;

  const userPrompt = `Extract MCQs from this text into a JSON array:
[
  {
    "question": "Question text with $LaTeX$",
    "options": ["Opt A", "Opt B", "Opt C", "Opt D"],
    "correct": 0,
    "topic": "Chapter Name",
    "subject": "Physics|Chemistry|Biology"
  }
]

PDF Text snippet:
${text.substring(0, 12000)}`;

  const rawJson = await callGeminiAPI(userPrompt, systemPrompt, { jsonSchema: true });
  let parsed = JSON.parse(rawJson);
  if (!Array.isArray(parsed) && parsed.questions) parsed = parsed.questions;

  return (parsed || []).map((q, idx) => ({
    id: idx + 1,
    include: true,
    question: q.question || `Question ${idx + 1}`,
    options: Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
    correct: typeof q.correct === 'number' ? q.correct : 0,
    topic: q.topic || 'General',
    subject: q.subject || 'Biology'
  }));
}

function renderExtractedQuestions(questions) {
  document.getElementById('pdf-processing-view').style.display = 'none';
  document.getElementById('pdf-preview-view').style.display = 'block';

  const container = document.getElementById('pdf-questions-list');
  if (!container) return;

  let html = '';
  questions.forEach((q, idx) => {
    html += `
      <div class="extracted-question-card ${q.include ? '' : 'excluded'}" id="eq-card-${idx}">
        <div class="eq-header">
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
            <input type="checkbox" ${q.include ? 'checked' : ''} onchange="toggleQuestionInclude(${idx})">
            <span class="subject-badge subject-badge-${q.subject.toLowerCase()}">${q.subject}</span>
            <span style="font-size:12px; color:var(--text-muted);">${q.topic}</span>
          </label>
          <button class="btn btn-secondary" style="padding:2px 8px; font-size:11px; color:var(--accent-danger);" onclick="deleteExtractedQuestion(${idx})">🗑️ Delete</button>
        </div>
        <div style="font-size:14px; margin-bottom:8px;">${renderMarkdown(q.question)}</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:12px; color:var(--text-secondary);">
          ${q.options.map((opt, oIdx) => `<div>${String.fromCharCode(65 + oIdx)}: ${renderMarkdown(opt)}</div>`).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html || '<div style="padding:20px; text-align:center;">No questions found.</div>';
  renderKaTeX(container);
}

function toggleQuestionInclude(index) {
  if (pdfExtractedQuestions[index]) {
    pdfExtractedQuestions[index].include = !pdfExtractedQuestions[index].include;
    const card = document.getElementById(`eq-card-${index}`);
    if (card) card.classList.toggle('excluded', !pdfExtractedQuestions[index].include);
  }
}

function deleteExtractedQuestion(index) {
  pdfExtractedQuestions.splice(index, 1);
  renderExtractedQuestions(pdfExtractedQuestions);
}

function selectAllQuestions() {
  pdfExtractedQuestions.forEach(q => q.include = true);
  renderExtractedQuestions(pdfExtractedQuestions);
}

function deselectAllQuestions() {
  pdfExtractedQuestions.forEach(q => q.include = false);
  renderExtractedQuestions(pdfExtractedQuestions);
}

function filterQuestionsBySubject(sub) {
  pdfExtractedQuestions.forEach(q => {
    if (sub === 'All' || q.subject.toLowerCase() === sub.toLowerCase()) {
      q.include = true;
    } else {
      q.include = false;
    }
  });
  renderExtractedQuestions(pdfExtractedQuestions);
}

function createTestFromPdf() {
  const activeQuestions = pdfExtractedQuestions.filter(q => q.include);
  if (activeQuestions.length === 0) {
    alert('Please select at least one question to generate a test.');
    return;
  }

  const formattedQuestions = activeQuestions.map((q, idx) => ({
    id: idx + 1,
    question: q.question,
    options: q.options,
    correct: q.correct,
    explanation: `Extracted from PDF. Topic: ${q.topic}`,
    reference: q.topic,
    difficulty: 'Medium',
    subject: q.subject
  }));

  showTab('ai-mocktest');
  initMockTestExam(formattedQuestions, Math.ceil(formattedQuestions.length * 1.5));
}

// --- INDEXEDDB FOR SAVED QUESTION BANKS ---

function openQuestionBankDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) return reject(new Error('IndexedDB not supported'));
    const req = window.indexedDB.open('NeetQuestionBanksDB', 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('banks')) {
        db.createObjectStore('banks', { keyPath: 'id' });
      }
    };
    req.onsuccess = (e) => {
      questionBanksDB = e.target.result;
      resolve(questionBanksDB);
    };
    req.onerror = (e) => reject(e.target.error);
  });
}

async function saveQuestionBank() {
  const activeQuestions = pdfExtractedQuestions.filter(q => q.include);
  if (activeQuestions.length === 0) {
    alert('No active questions selected to save.');
    return;
  }

  const bankName = prompt('Enter a name for this Question Bank:', `PDF Bank ${new Date().toLocaleDateString('en-IN')}`);
  if (!bankName) return;

  const bankObj = {
    id: `qbank_${Date.now()}`,
    name: bankName,
    date: new Date().toLocaleDateString('en-IN'),
    count: activeQuestions.length,
    questions: activeQuestions
  };

  try {
    if (!questionBanksDB) await openQuestionBankDB();
    const tx = questionBanksDB.transaction('banks', 'readwrite');
    tx.objectStore('banks').put(bankObj);
    tx.oncomplete = () => {
      if (typeof showToast === 'function') showToast('✅ Question Bank Saved!');
      loadQuestionBanks();
    };
  } catch (err) {
    alert(`Failed to save question bank: ${err.message}`);
  }
}

async function loadQuestionBanks() {
  const container = document.getElementById('qbank-list');
  if (!container) return;

  try {
    if (!questionBanksDB) await openQuestionBankDB();
    const tx = questionBanksDB.transaction('banks', 'readonly');
    const req = tx.objectStore('banks').getAll();

    req.onsuccess = () => {
      const banks = req.result || [];
      if (banks.length === 0) {
        container.innerHTML = '<div style="color:var(--text-muted); font-size:12px;">No saved question banks found.</div>';
        return;
      }
      let html = '';
      banks.forEach(b => {
        html += `
          <div class="qbank-item">
            <div>
              <div class="qbank-name">${b.name}</div>
              <div class="qbank-meta">${b.count} Questions • Created ${b.date}</div>
            </div>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-secondary" style="padding:4px 10px; font-size:12px;" onclick="loadQuestionBank('${b.id}')">Load 📥</button>
              <button class="btn btn-secondary" style="padding:4px 10px; font-size:12px; color:var(--accent-danger);" onclick="deleteQuestionBank('${b.id}')">🗑️</button>
            </div>
          </div>
        `;
      });
      container.innerHTML = html;
    };
  } catch (err) {
    container.innerHTML = `<div style="color:var(--text-muted); font-size:12px;">Could not load banks: ${err.message}</div>`;
  }
}

async function loadQuestionBank(id) {
  if (!questionBanksDB) await openQuestionBankDB();
  const tx = questionBanksDB.transaction('banks', 'readonly');
  const req = tx.objectStore('banks').get(id);

  req.onsuccess = () => {
    const bank = req.result;
    if (bank && bank.questions) {
      pdfExtractedQuestions = bank.questions;
      renderExtractedQuestions(pdfExtractedQuestions);
      if (typeof showToast === 'function') showToast(`Loaded "${bank.name}"`);
    }
  };
}

async function deleteQuestionBank(id) {
  if (!confirm('Delete this question bank permanently?')) return;
  if (!questionBanksDB) await openQuestionBankDB();
  const tx = questionBanksDB.transaction('banks', 'readwrite');
  tx.objectStore('banks').delete(id);
  tx.oncomplete = () => {
    loadQuestionBanks();
    if (typeof showToast === 'function') showToast('Bank deleted');
  };
}


// --------------------------------------------------------------------------
// SECTION 6: AI STUDY OPTIMIZER (OVERVIEW TAB WIDGET)
// --------------------------------------------------------------------------

function initStudyOptimizer() {
  // Silent initialize for overview widget
}

async function generateStudyRecommendation() {
  const contentEl = document.getElementById('study-optimizer-content');
  const loadingEl = document.getElementById('study-optimizer-loading');

  if (!checkAiReady()) {
    showTab('settings');
    return;
  }

  if (loadingEl) loadingEl.style.display = 'block';
  if (contentEl) contentEl.style.display = 'none';

  try {
    // Gather contextual metrics
    const planStartStr = localStorage.getItem('planStart') || '2026-06-29';
    const planStart = new Date(planStartStr);
    const today = new Date();
    const diffDays = Math.max(1, Math.floor((today - planStart) / (1000 * 60 * 60 * 24)) + 1);

    const errorItems = JSON.parse(localStorage.getItem('neet_v3_errorbook_items') || '[]');
    const mockTests = JSON.parse(localStorage.getItem('neet_v3_mock_tests') || '[]');

    const prompt = `Act as an elite NEET 2027 Strategy Advisor. Provide a targeted study plan for today:
Current Day in 309-day plan: Day ${diffDays}
Total Logged Mistakes: ${errorItems.length}
Latest Mock Score: ${mockTests[0]?.totalScore || 'Not attempted'}

Give me:
1. 🎯 Top 2 Priority Focus Chapters for today
2. ⏱️ Recommended time split (Physics vs Chemistry vs Biology)
3. 💡 High-Yield Action Item to maximize score improvement`;

    const recommendation = await callGeminiAPI(prompt, 'You are an expert NEET planner advisor.', { temperature: 0.6 });

    if (contentEl) {
      contentEl.innerHTML = renderMarkdown(recommendation);
      renderKaTeX(contentEl);
    }
  } catch (err) {
    if (contentEl) contentEl.innerHTML = `<div style="color:var(--accent-danger); font-size:13px;">Failed: ${err.message}</div>`;
  } finally {
    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';
  }
}


// --------------------------------------------------------------------------
// SECTION 7: AI ERROR PATTERN ANALYZER (MISTAKE DNA)
// --------------------------------------------------------------------------

function initErrorAnalyzer() {
  // Silent initialize for Error Book tab
}

async function analyzeErrorPatterns() {
  const container = document.getElementById('mistake-dna-results');
  if (!container) return;

  if (!checkAiReady()) {
    showTab('settings');
    return;
  }

  const items = JSON.parse(localStorage.getItem('neet_v3_errorbook_items') || '[]');
  if (items.length === 0) {
    container.style.display = 'block';
    container.innerHTML = '<div style="color:var(--text-muted); font-size:13px; padding:12px;">Add at least 1 mistake to your Error Book to generate AI Mistake DNA analysis.</div>';
    return;
  }

  container.style.display = 'block';
  container.innerHTML = '<div style="color:var(--text-muted); font-size:13px; padding:12px;">🤖 Analyzing mistake patterns with Gemini 2.0 Flash...</div>';

  try {
    const summaryList = items.slice(0, 30).map(i => `[${i.subject}] ${i.chapter}: ${i.description || i.category}`).join('\n');

    const prompt = `Analyze these student error log entries:
${summaryList}

Return JSON with structure:
{
  "categories": [
    { "name": "Calculation Errors", "count": 5, "percent": 40, "color": "#f87171" },
    { "name": "Conceptual Gap", "count": 4, "percent": 30, "color": "#fbbf24" }
  ],
  "insights": "2-3 sentences of advice on how to stop repeating these mistakes."
}`;

    const rawJson = await callGeminiAPI(prompt, 'You are an error log diagnostics specialist.', { jsonSchema: true });
    const data = JSON.parse(rawJson);

    let barsHtml = '';
    (data.categories || []).forEach(cat => {
      barsHtml += `
        <div class="mistake-bar-container">
          <div class="mistake-bar-label">
            <span class="bar-name">${cat.name}</span>
            <span class="bar-count">${cat.count} items (${cat.percent}%)</span>
          </div>
          <div class="mistake-bar">
            <div class="mistake-bar-fill" style="width:${cat.percent}%; background:${cat.color || 'var(--primary)'}"></div>
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div style="margin-top:14px;">
        ${barsHtml}
        <div class="ai-insights-text"><strong>💡 Diagnostic Insight:</strong> ${renderMarkdown(data.insights || '')}</div>
        <button class="btn btn-primary" style="margin-top:16px;" onclick="generateRecoveryQuiz()">
          <span>💪</span> Generate Targeted 10-Q Recovery Quiz
        </button>
      </div>
    `;
    renderKaTeX(container);
  } catch (err) {
    container.innerHTML = `<div style="color:var(--accent-danger); font-size:13px; padding:12px;">Analysis failed: ${err.message}</div>`;
  }
}

async function generateRecoveryQuiz() {
  const items = JSON.parse(localStorage.getItem('neet_v3_errorbook_items') || '[]');
  const chapters = Array.from(new Set(items.map(i => i.chapter))).slice(0, 5).join(', ') || 'High Yield NEET';

  showTab('ai-mocktest');
  document.getElementById('mocktest-config').style.display = 'none';
  document.getElementById('mocktest-loading').style.display = 'flex';

  const prompt = `Generate a targeted 10-question Recovery Quiz focusing on chapters where student made errors: ${chapters}.
Return JSON array format with question, options (4), correct (0-3), explanation, reference, difficulty, subject.`;

  try {
    const rawJson = await callGeminiAPI(prompt, 'Generate a recovery test based on weak topics.', { jsonSchema: true });
    let parsed = JSON.parse(rawJson);
    if (!Array.isArray(parsed) && parsed.questions) parsed = parsed.questions;

    const formatted = parsed.map((q, idx) => ({
      id: idx + 1,
      question: q.question,
      options: q.options,
      correct: q.correct,
      explanation: q.explanation,
      reference: q.reference || 'Error Recovery',
      difficulty: 'Medium',
      subject: q.subject || 'Biology'
    }));

    initMockTestExam(formatted, 15);
  } catch (err) {
    alert(`Failed to create recovery quiz: ${err.message}`);
    showTab('errorbook');
  }
}


// --------------------------------------------------------------------------
// SECTION 8: WINDOW EXPORTS & GLOBAL INTEGRATION
// --------------------------------------------------------------------------

function handleAiTabSwitch(tabId) {
  if (tabId === 'ai-tutor') initAiTutor();
  if (tabId === 'ai-mocktest') initMockTestTab();
  if (tabId === 'pdf-to-test') initPdfToTest();
}

// Export functions for global HTML access
window.getGeminiApiKey = getGeminiApiKey;
window.setGeminiApiKey = setGeminiApiKey;
window.removeGeminiApiKey = removeGeminiApiKey;
window.checkAiReady = checkAiReady;
window.setAiPreference = setAiPreference;
window.callGeminiAPI = callGeminiAPI;
window.testGeminiConnection = testGeminiConnection;
window.renderSetupRequired = renderSetupRequired;
/* ==========================================
   SECTION 8: NTA & GOVT NEET NEWS HUB
   ========================================== */

const NEET_NEWS_DATA = [
  {
    id: 'news_1',
    category: 'nta',
    badgeText: '🔴 NTA Alert',
    badgeClass: 'badge-nta',
    date: 'Official NTA Release',
    title: 'NTA Exam Advisory: Biometric Verification & Mandatory Dress Code Regulations',
    desc: 'National Testing Agency (NTA) mandates biometric attendance, strict dress code guidelines (light clothes, short sleeves, no large buttons), and mandatory government ID verification at exam centers.',
    link: 'https://neet.nta.nic.in'
  },
  {
    id: 'news_2',
    category: 'syllabus',
    badgeText: '🔵 Syllabus & Pattern',
    badgeClass: 'badge-syllabus',
    date: 'Ministry of Health / NMC',
    title: 'NMC Revises NEET UG Eligibility & Additional Biology Guidelines',
    desc: 'National Medical Commission confirms candidates with Physics, Chemistry, Biology/Biotechnology as core/additional subjects in 10+2 are eligible for NEET-UG examination.',
    link: 'https://nmc.org.in'
  },
  {
    id: 'news_3',
    category: 'syllabus',
    badgeText: '🔵 Syllabus & Pattern',
    badgeClass: 'badge-syllabus',
    date: 'NCERT & NTA Framework',
    title: 'NEET UG Rationalized NCERT Syllabus Alignment',
    desc: 'NTA aligns the NEET UG question paper with rationalized NCERT Class 11 & 12 textbooks. Reduced units in Chemistry and Biology excluded from examination weightage.',
    link: 'https://neet.nta.nic.in'
  },
  {
    id: 'news_4',
    category: 'nta',
    badgeText: '🔴 NTA Alert',
    badgeClass: 'badge-nta',
    date: 'NTA Public Notice',
    title: 'NEET Tie-Breaking Ranking Criteria Standardized',
    desc: 'NTA updates tie-breaking order for NEET UG ranking: 1. Higher marks in Biology, 2. Higher marks in Chemistry, 3. Higher marks in Physics, 4. Lower proportion of incorrect answers.',
    link: 'https://neet.nta.nic.in'
  },
  {
    id: 'news_5',
    category: 'mcc',
    badgeText: '🟢 MCC Counseling',
    badgeClass: 'badge-mcc',
    date: 'MCC Govt Portal',
    title: 'MCC All-India Quota (AIQ) 15% Seat Matrix & Reservation Guidelines',
    desc: 'Medical Counselling Committee (MCC) releases guidelines for 15% AIQ MBBS/BDS seats, 85% state quota rules, and OBC-NCL / EWS category certificate issue date cutoffs.',
    link: 'https://mcc.nic.in'
  },
  {
    id: 'news_6',
    category: 'strategy',
    badgeText: '🟣 Strategy',
    badgeClass: 'badge-strategy',
    date: 'NMC & NTA Advisory',
    title: 'Anti-Malpractice & High-Yield Revision Strategy Framework',
    desc: 'Official advisory on maintaining academic integrity, avoiding misleading social media rumors, and adopting NCERT line-by-line active recall testing strategies.',
    link: 'https://nmc.org.in'
  }
];

let activeNewsCategory = 'all';

function initNeetNewsTab() {
  renderNeetNewsFeed(NEET_NEWS_DATA);
}

function renderNeetNewsFeed(items) {
  const feedContainer = document.getElementById('neet-news-feed');
  if (!feedContainer) return;

  if (!items || items.length === 0) {
    feedContainer.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-muted);">No official notices found matching your filter.</div>';
    return;
  }

  let html = '';
  items.forEach(item => {
    html += `
      <div class="news-card">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:6px;">
            <span class="news-card-badge ${item.badgeClass}">${item.badgeText}</span>
            <span class="news-card-date">${item.date}</span>
          </div>
          <h3 class="news-card-title">${item.title}</h3>
          <p class="news-card-desc" style="margin-top:8px;">${item.desc}</p>
          <div id="news-summary-${item.id}" style="display:none; margin-top:12px; background:rgba(251, 191, 36, 0.08); border:1px solid rgba(251, 191, 36, 0.2); border-radius:8px; padding:12px; font-size:12px; line-height:1.5;"></div>
        </div>
        <div style="margin-top:14px; border-top:1px solid var(--border-color); padding-top:12px; display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-secondary" onclick="summarizeNewsItem('${item.id}')" style="font-size:11px; padding:4px 10px;">⚡ Summarize with AI</button>
          <a href="${item.link}" target="_blank" class="btn btn-secondary" style="font-size:11px; padding:4px 10px; text-decoration:none;">Read Official Notice 🔗</a>
        </div>
      </div>
    `;
  });

  feedContainer.innerHTML = html;
}

async function summarizeNewsItem(newsId) {
  const summaryBox = document.getElementById(`news-summary-${newsId}`);
  if (!summaryBox) return;

  const item = NEET_NEWS_DATA.find(n => n.id === newsId);
  if (!item) return;

  summaryBox.style.display = 'block';
  summaryBox.innerHTML = '<div style="color:var(--text-muted);">⚡ Gemini is analyzing & summarizing this official notice...</div>';

  try {
    const prompt = `Synthesize a clear 3-bullet point executive summary of this official NEET notification for an aspirant:
Title: ${item.title}
Details: ${item.desc}
Category: ${item.badgeText}`;

    const summaryText = await callGeminiAPI(prompt, 'You are an expert NEET exam and regulatory analyst.', { temperature: 0.5 });
    summaryBox.innerHTML = `
      <div style="color:var(--primary); font-weight:700; margin-bottom:6px; display:flex; align-items:center; gap:4px;">
        <span>⚡</span> AI 3-Bullet Executive Summary:
      </div>
      <div style="color:var(--text-secondary); line-height:1.5;">${renderMarkdown(summaryText)}</div>
    `;
  } catch (err) {
    summaryBox.innerHTML = `<div style="color:var(--accent-danger);">Could not generate summary: ${err.message}</div>`;
  }
}

function filterNeetNews(category) {
  activeNewsCategory = category;

  const buttons = document.querySelectorAll('.news-filter-btn');
  buttons.forEach(btn => {
    if (btn.dataset.cat === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (category === 'all') {
    renderNeetNewsFeed(NEET_NEWS_DATA);
  } else {
    const filtered = NEET_NEWS_DATA.filter(item => item.category === category);
    renderNeetNewsFeed(filtered);
  }
}

function searchNeetNews(query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    filterNeetNews(activeNewsCategory);
    return;
  }

  const matches = NEET_NEWS_DATA.filter(item => {
    const matchesCat = activeNewsCategory === 'all' || item.category === activeNewsCategory;
    const matchesQuery = item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  renderNeetNewsFeed(matches);
}

async function fetchAiNeetNewsAnalysis() {
  const briefingContainer = document.getElementById('ai-news-briefing-content');
  if (!briefingContainer) return;

  briefingContainer.style.display = 'block';
  briefingContainer.innerHTML = '<div style="color:var(--text-muted);">🤖 Gemini is analyzing latest NTA & Government NEET regulations...</div>';

  try {
    const prompt = `Synthesize a comprehensive official NEET UG exam briefing for a student. Include:
1. 🏛️ Key NTA Official Guidelines (Biometrics, Admit Card, Dress Code, Exam Hall Rules)
2. 🩺 NMC & Govt Policy Updates (Syllabus rationalization, subject eligibility, tie-breaking criteria)
3. 🎓 MCC Counselling & Document Cutoffs (Category certificates, NRI/EWS rules)
4. 💡 Strategic Advisory for NEET 2027 Aspirants`;

    const aiBriefing = await callGeminiAPI(prompt, 'You are an official NTA and Ministry of Health NEET UG Regulatory Consultant.', { temperature: 0.5 });
    briefingContainer.innerHTML = `
      <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:8px; padding:16px; margin-top:8px;">
        <h4 style="color:var(--primary); margin:0 0 10px 0;">📋 Gemini Official NTA & Govt Regulatory Briefing</h4>
        <div>${renderMarkdown(aiBriefing)}</div>
      </div>
    `;
    renderKaTeX(briefingContainer);
  } catch (err) {
    briefingContainer.innerHTML = `<div style="color:var(--accent-danger);">Could not generate briefing: ${err.message}</div>`;
  }
}

// Window Exports
window.initNeetNewsTab = initNeetNewsTab;
window.filterNeetNews = filterNeetNews;
window.searchNeetNews = searchNeetNews;
window.summarizeNewsItem = summarizeNewsItem;
window.fetchAiNeetNewsAnalysis = fetchAiNeetNewsAnalysis;

window.renderApiKeySetup = renderApiKeySetup;
window.toggleApiKeyVisibility = toggleApiKeyVisibility;
window.saveApiKeyFromInput = saveApiKeyFromInput;
window.clearApiKey = clearApiKey;

window.renderMarkdown = renderMarkdown;
window.renderKaTeX = renderKaTeX;

window.initAiTutor = initAiTutor;
window.setAiTutorSubject = setAiTutorSubject;
window.sendAiTutorMessage = sendAiTutorMessage;
window.clearAiTutorChat = clearAiTutorChat;
window.copyAiResponse = copyAiResponse;
window.insertQuickAction = insertQuickAction;
window.updateCharCount = updateCharCount;

window.initMockTestTab = initMockTestTab;
window.populateChapterSelect = populateChapterSelect;
window.updateChapterSelectBySubject = updateChapterSelectBySubject;
window.generateMockTest = generateMockTest;
window.initMockTestExam = initMockTestExam;
window.renderMockTestQuestion = renderMockTestQuestion;
window.selectMockTestOption = selectMockTestOption;
window.toggleMockTestMark = toggleMockTestMark;
window.clearMockTestResponse = clearMockTestResponse;
window.navigateMockTestQuestion = navigateMockTestQuestion;
window.jumpToMockTestQuestion = jumpToMockTestQuestion;
window.submitMockTest = submitMockTest;
window.saveMockTestToTracker = saveMockTestToTracker;
window.exitMockTest = exitMockTest;
window.retakeMockTest = retakeMockTest;

window.initPdfToTest = initPdfToTest;
window.handlePdfFileSelect = handlePdfFileSelect;
window.toggleQuestionInclude = toggleQuestionInclude;
window.deleteExtractedQuestion = deleteExtractedQuestion;
window.selectAllQuestions = selectAllQuestions;
window.deselectAllQuestions = deselectAllQuestions;
window.filterQuestionsBySubject = filterQuestionsBySubject;
window.createTestFromPdf = createTestFromPdf;
window.saveQuestionBank = saveQuestionBank;
window.loadQuestionBank = loadQuestionBank;
window.deleteQuestionBank = deleteQuestionBank;

window.generateStudyRecommendation = generateStudyRecommendation;
window.analyzeErrorPatterns = analyzeErrorPatterns;
window.generateRecoveryQuiz = generateRecoveryQuiz;
window.getCompleteWebsiteContext = getCompleteWebsiteContext;

// Global compatibility aliases
window.toggleMarkForReview = function() {
  if (typeof mockTestCurrentIdx !== 'undefined') toggleMockTestMark(mockTestCurrentIdx);
};
window.clearCurrentResponse = function() {
  if (typeof mockTestCurrentIdx !== 'undefined') clearMockTestResponse();
};
window.prevMockQuestion = function() {
  navigateMockTestQuestion('prev');
};
window.saveAndNextMockQuestion = function() {
  navigateMockTestQuestion('next');
};
window.startMockExam = function() {
  retakeMockTest();
};
window.pdfSelectAll = selectAllQuestions;
window.pdfDeselectAll = deselectAllQuestions;
window.filterPdfQuestions = function() {
  const select = document.getElementById('pdf-subject-filter');
  filterQuestionsBySubject(select ? select.value : 'all');
};
window.savePdfToQuestionBank = function() {
  const name = prompt("Enter Question Bank Name:", "Extracted Bank " + new Date().toLocaleDateString());
  if (name && typeof pdfExtractedQuestions !== 'undefined' && pdfExtractedQuestions.length > 0) {
    saveQuestionBank(name, pdfExtractedQuestions);
  }
};

function handleAiTabSwitch(tabId) {
  if (tabId === 'ai-tutor') initAiTutor();
  if (tabId === 'ai-mocktest') initMockTestTab();
  if (tabId === 'pdf-to-test') initPdfToTest();
  if (tabId === 'neet-news') initNeetNewsTab();
}
window.handleAiTabSwitch = handleAiTabSwitch;

// Hook showTab safely with bulletproof try-catch error guards
const originalShowTab = window.showTab;
window.showTab = function(tabId) {
  if (typeof originalShowTab === 'function') {
    try {
      originalShowTab(tabId);
    } catch (e) {
      console.error(`Error in core showTab for "${tabId}":`, e);
    }
  }
  try {
    handleAiTabSwitch(tabId);
    if (tabId === 'overview' && typeof initStudyOptimizer === 'function') initStudyOptimizer();
    if (tabId === 'errorbook' && typeof initErrorAnalyzer === 'function') initErrorAnalyzer();
    if (tabId === 'settings' && typeof renderApiKeySetup === 'function') renderApiKeySetup();
  } catch (e) {
    console.error(`Error in AI tab switch for "${tabId}":`, e);
  }
};

console.log('✅ NEET Planner AI Features Module Loaded Successfully (Gemini 2.0 Flash BYOK)');
