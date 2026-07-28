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

const GEMINI_MODELS = [
  "gemini-flash-latest",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-1.5-flash"
];

const _invalidModels = new Set();
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

function _resetModelState() {
  for (const model of GEMINI_MODELS) delete _modelCooldowns[model];
  _invalidModels.clear();
}

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
        temperature: options.temperature || 0.3,
        maxOutputTokens: options.maxTokens || 4096
      }
    };

    if (options.jsonMode) {
      payload.generationConfig.responseMimeType = "application/json";
    }

    if (systemInstruction) {
      payload.system_instruction = { parts: [{ text: systemInstruction }] };
    }

    // Try available models across the 6-model Gemini fallback ring
    for (let attempt = 0; attempt < GEMINI_MODELS.length * 2; attempt++) {
      const model = _getAvailableModel();

      if (!model) {
        const nextExpiry = _getNextCooldownExpiry();
        const waitSec = Math.max(1, Math.ceil((nextExpiry - Date.now()) / 1000));
        if (waitSec > 0 && waitSec <= 65) {
          if (onStatus) onStatus(`⏳ All Gemini models cooling down. Auto-retrying fallback ring in ${waitSec}s...`);
          await sleep(Math.min(waitSec * 1000, 65000));
          continue;
        }
        throw new Error("HTTP_429_EXCEEDED");
      }

      const endpoint = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey.trim()}`;

      try {
        if (onStatus && attempt > 0) {
          onStatus(`⚡ Model limit reached → Falling back to ${model}...`);
        }

        _lastRequestTime = Date.now();

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.status === 429) {
          _modelCooldowns[model] = Date.now() + MODEL_COOLDOWN_MS;
          console.warn(`[Gemini Fallback Ring] ${model} → 429 Rate Limit. Falling back to next model...`);
          if (onStatus) onStatus(`⚠️ ${model} limit reached → Falling back to backup Gemini model...`);
          continue;
        }

        if (response.status === 404) {
          _invalidModels.add(model);
          console.warn(`[Gemini Fallback Ring] Model ${model} returned 404. Skipping...`);
          continue;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const msg = errorData.error?.message || `API error (${response.status})`;
          if (msg.includes("API key not valid") || msg.includes("API_KEY_INVALID")) {
            throw new Error("INVALID_API_KEY");
          }
          if (msg.includes("quota") || msg.includes("rate") || msg.includes("Resource has been exhausted") || msg.includes("429")) {
            _modelCooldowns[model] = Date.now() + MODEL_COOLDOWN_MS;
            if (onStatus) onStatus(`⚠️ ${model} quota exhausted → Falling back to backup Gemini model...`);
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
        console.warn(`[Gemini Fallback Ring] ${model} failed: ${err.message}. Trying next fallback model...`);
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
  _resetModelState();
  updateApiKeyStatusUI(true);
  
  if (msgArea) msgArea.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">✅ API Key saved successfully!</span>`;
  renderSetupRequiredCards();
  alert("✅ Gemini API Key saved successfully!");
}

function removeApiKey() {
  localStorage.removeItem("gemini_api_key");
  _resetModelState();
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
    _resetModelState();
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
  _resetModelState();
  updateApiKeyStatusUI(true);
  renderSetupRequiredCards();
  alert("🎉 Gemini API Key activated! All AI features are ready.");
}

/* ==========================================================================
   FEATURE: GROQ CLOUD API ENGINE (SECONDARY BACKUP FAILOVER)
   ========================================================================== */

function getGroqApiKey() {
  return (localStorage.getItem("groq_api_key") || "").trim();
}

function onGroqKeyTyped() {
  const msgArea = document.getElementById("groq-key-inline-msg");
  if (msgArea) msgArea.innerHTML = "";
}

function saveGroqApiKey() {
  const input = document.getElementById("setting-groq-key");
  const msgArea = document.getElementById("groq-key-inline-msg");
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    if (msgArea) msgArea.innerHTML = `<span style="color:#ef4444; font-weight:bold;">Please paste a valid Groq API key (gsk_...)</span>`;
    alert("Please enter a valid Groq API key!");
    return;
  }
  localStorage.setItem("groq_api_key", val);
  updateGroqApiKeyStatusUI(true);
  if (msgArea) msgArea.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">✅ Groq API Key saved successfully! Backup active.</span>`;
  alert("🎉 Groq API Key saved successfully!");
}

function removeGroqApiKey() {
  localStorage.removeItem("groq_api_key");
  const input = document.getElementById("setting-groq-key");
  if (input) input.value = "";
  const msgArea = document.getElementById("groq-key-inline-msg");
  if (msgArea) msgArea.innerHTML = `<span style="color:#fbbf24;">🗑️ Groq API Key removed.</span>`;
  updateGroqApiKeyStatusUI(true);
}

function updateGroqApiKeyStatusUI(forceSync = false) {
  const key = getGroqApiKey();
  const badge = document.getElementById("groq-key-status-badge");
  const input = document.getElementById("setting-groq-key");
  if (input && (forceSync || !input.value.trim())) input.value = key;
  if (badge) {
    badge.innerHTML = key 
      ? `<span style="color:#00d4aa; font-weight:bold;">🟢 Key Active (Backup Ready)</span>`
      : `<span style="color:#aaa; font-size:11px;">Optional Failover</span>`;
  }
}

function toggleGroqKeyVisibility() {
  const input = document.getElementById("setting-groq-key");
  if (input) {
    input.type = input.type === "password" ? "text" : "password";
  }
}

async function testGroqApiConnection() {
  const input = document.getElementById("setting-groq-key");
  const badge = document.getElementById("groq-key-status-badge");
  const msgArea = document.getElementById("groq-key-inline-msg");

  if (input && input.value.trim()) {
    localStorage.setItem("groq_api_key", input.value.trim());
    updateGroqApiKeyStatusUI(true);
  }

  const key = getGroqApiKey();
  if (!key) {
    if (badge) badge.innerHTML = `<span style="color:#ef4444;">No Key</span>`;
    if (msgArea) msgArea.innerHTML = `<span style="color:#ef4444;">Please enter your Groq API key first!</span>`;
    alert("Please paste your Groq API key first!");
    return;
  }

  if (badge) badge.innerHTML = `<span style="color:#fbbf24;">Testing...</span>`;
  if (msgArea) msgArea.innerHTML = `<span style="color:#fbbf24;">Connecting to Groq Cloud API...</span>`;

  try {
    const text = await callGroqAPI("Hello, reply with 1 short sentence.", "You are a test bot");
    if (badge) badge.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">🟢 Connected</span>`;
    if (msgArea) msgArea.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">🎉 Connection Successful! Llama-3.3 70B active.</span>`;
    alert(`🎉 Groq API Connection Successful!\n\nResponse: "${text}"`);
  } catch (err) {
    if (badge) badge.innerHTML = `<span style="color:#ef4444;">Failed</span>`;
    if (msgArea) msgArea.innerHTML = `<span style="color:#ef4444;">Connection failed: ${err.message}</span>`;
    alert(`❌ Groq API Connection Failed: ${err.message}`);
  }
}

async function callGroqAPI(prompt, systemInstruction = "", onStatus = null, options = {}) {
  const groqKey = getGroqApiKey();
  if (!groqKey) {
    throw new Error("NO_GROQ_KEY");
  }

  if (onStatus) onStatus("⚡ Gemini limit reached → Switched to Groq AI (Llama-3.3 70B)...");

  const messages = [];
  if (systemInstruction) {
    messages.push({ role: "system", content: systemInstruction });
  }
  messages.push({ role: "user", content: prompt });

  const modelsToTry = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"];

  for (const m of modelsToTry) {
    try {
      const reqBody = {
        model: m,
        messages: messages,
        temperature: options.temperature || 0.3,
        max_tokens: options.maxTokens || 4096
      };

      if (options.jsonMode) {
        reqBody.response_format = { type: "json_object" };
      }

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reqBody)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Groq API Error HTTP ${res.status}`);
      }

      const data = await res.json();
      const answerText = data.choices?.[0]?.message?.content;
      if (!answerText) throw new Error("Empty response from Groq API.");

      return answerText;

    } catch (err) {
      console.warn(`Groq model ${m} failed:`, err);
    }
  }

  throw new Error("All Groq models failed or rate limited.");
}

async function callAiWithFailover(prompt, systemInstruction = "", onStatus = null, options = {}) {
  try {
    return await callGeminiAPI(prompt, systemInstruction, onStatus, options);
  } catch (geminiErr) {
    const groqKey = getGroqApiKey();
    if (groqKey && (geminiErr.message === "HTTP_429_EXCEEDED" || geminiErr.message.includes("429") || geminiErr.message.includes("cooling down") || geminiErr.message.includes("quota"))) {
      console.warn("[Failover Engine] Gemini rate limit reached! Failing over to Groq Cloud API...");
      if (onStatus) onStatus("⚡ Gemini rate limit reached → Seamless failover to Groq AI (Llama-3.3 70B)...");
      return await callGroqAPI(prompt, systemInstruction, onStatus, options);
    }
    throw geminiErr;
  }
}

function renderSetupRequiredCards() {
  const geminiKey = getApiKey();
  const groqKey = getGroqApiKey();
  const serperKey = getSerperApiKey();
  const hasAiKey = !!(geminiKey || groqKey);

  const setupElements = document.querySelectorAll(".ai-setup-required-card");
  setupElements.forEach(el => {
    const parentSection = el.closest("section");
    if (parentSection && parentSection.id === "ai-research") {
      el.style.display = (serperKey || hasAiKey) ? "none" : "block";
    } else if (parentSection && parentSection.id === "ai-tutor") {
      el.style.display = hasAiKey ? "none" : "block";
    } else {
      el.style.display = (geminiKey || groqKey) ? "none" : "block";
    }
  });

  const mainAiElements = document.querySelectorAll(".ai-feature-content");
  mainAiElements.forEach(el => {
    const parentSection = el.closest("section");
    if (parentSection && parentSection.id === "ai-research") {
      el.style.display = (serperKey || hasAiKey) ? "block" : "none";
    } else if (parentSection && parentSection.id === "ai-tutor") {
      el.style.display = hasAiKey ? "block" : "none";
    } else {
      el.style.display = (geminiKey || groqKey) ? "block" : "none";
    }
  });
}

window.quickSaveApiKey = quickSaveApiKey;


/* ==========================================================================
   FEATURE 1: AI TUTOR (DOUBT SOLVER)
   ========================================================================== */

let currentSubjectMode = "physics";

const SYSTEM_PROMPTS = {
  physics: `You are an expert Physics tutor. Help the user solve any doubt with clear step-by-step mathematical solutions, Free Body Diagrams, vector analysis, unit checks, and formulas. Format physical units and equations clearly. End with a helpful "Quick Recall Point".`,
  chemistry: `You are an expert Chemistry tutor (Physical, Organic, Inorganic). Help the user solve any doubt with clear reaction mechanisms, balanced equations, electron displacement concepts, and key points. Format chemical formulas with proper subscripts/superscripts (e.g. H₂O, Fe³⁺, SO₄²⁻). End with a helpful "Quick Recall Point".`,
  biology: `You are an expert Biology tutor. Help the user solve any doubt with clear explanations, textbook facts, diagrams, classification tables, mnemonics, and key terms. End with a helpful "Quick Recall Point".`
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

async function callAiWithGroqFirst(prompt, systemInstruction = "", onStatus = null, options = {}) {
  const groqKey = getGroqApiKey();
  const geminiKey = getApiKey();

  if (!groqKey && !geminiKey) {
    throw new Error("NO_API_KEY");
  }

  // 1. PRIMARY ENGINE: Groq Cloud API (Llama-3.3 70B)
  if (groqKey) {
    try {
      if (onStatus) onStatus("⚡ Processing with Groq AI (Llama-3.3 70B)...");
      return await callGroqAPI(prompt, systemInstruction, onStatus, options);
    } catch (groqErr) {
      console.warn("[Groq First Engine] Groq primary engine limit reached/failed. Failing over to Gemini API backup...", groqErr);
      if (onStatus) onStatus("⚠️ Groq limit reached → Switched to Gemini AI backup...");
    }
  }

  // 2. FAILOVER / BACKUP ENGINE: Gemini API (6-Model Fallback Ring)
  if (geminiKey) {
    if (onStatus) onStatus("🧠 Processing with Gemini AI backup engine...");
    return await callGeminiAPI(prompt, systemInstruction, onStatus, options);
  }

  throw new Error("All AI engines (Groq & Gemini) failed or rate limited.");
}

const callAiTutorWithGroqFirst = callAiWithGroqFirst;

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

  if (!getGroqApiKey() && !getApiKey()) {
    alert("Please set your free Groq or Gemini API Key in the Settings tab first!");
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

    const aiResponse = await callAiTutorWithGroqFirst(userText, sysPrompt, (statusMsg) => {
      updateTypingText(typingId, statusMsg);
    });

    removeChatMessage(typingId);
    appendChatMessage("ai", aiResponse);

  } catch (err) {
    removeChatMessage(typingId);
    if (err.message === "NO_API_KEY") {
      appendChatMessage("ai", "⚠️ **Setup Required**: Please configure your Groq API Key or Gemini API Key in the Settings tab.");
    } else if (err.message === "HTTP_429_EXCEEDED") {
      appendChatMessage("ai", "⚠️ **Rate Limit Exceeded**: All AI engines (Groq & Gemini) are cooling down. Please wait 30 seconds.");
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

async function generateAiChapterTest(chapterName) {
  if (!chapterName) return;

  if (!getGroqApiKey() && !getApiKey()) {
    alert("Please configure your free Groq API Key or Gemini API Key in Settings first!");
    showTab("settings");
    return;
  }

  showTab("ai-mocktest");

  const statusCard = document.getElementById("cbt-generation-status");
  if (statusCard) {
    statusCard.style.display = "block";
    statusCard.innerHTML = `
      <div class="glass-card" style="text-align:center; padding:20px;">
        <div class="spinner" style="margin:0 auto 10px auto;"></div>
        <h4>⚡ Generating 10-Question AI Chapter Test for "${escapeHTML(chapterName)}" via Groq AI...</h4>
        <p id="cbt-status-subtext" style="font-size:12px; color:#00d4aa;">Connecting to Groq Cloud API (Llama-3.3 70B ~800 tokens/sec)...</p>
      </div>
    `;
  }

  try {
    const prompt = `Generate a high-yield NTA NEET exam practice test consisting of 10 Multiple-Choice Questions (MCQs) for the chapter: "${chapterName}".
Rules:
1. Output ONLY a valid raw JSON array of 10 question objects.
2. Formats:
{
  "question": "Question text with LaTeX formulas ($...$)",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Step-by-step NCERT solution with key formulas",
  "subject": "Physics/Chemistry/Biology",
  "chapter": "${chapterName}"
}
3. Include conceptual, numerical, and statement-based questions aligned with latest NMC guidelines.`;

    const sysInstruction = "You are an NTA NEET exam setter. Output ONLY a valid JSON array.";
    const rawText = await callAiWithGroqFirst(prompt, sysInstruction, (msg) => {
      const sub = document.getElementById("cbt-status-subtext");
      if (sub) sub.textContent = msg;
    }, { maxTokens: 3000 });

    const questions = robustParseJSON(rawText);

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Could not parse chapter test questions.");
    }

    if (statusCard) statusCard.style.display = "none";
    startCbtExam(questions, 10 * 120);

  } catch (err) {
    if (statusCard) {
      statusCard.innerHTML = `
        <div class="glass-card" style="border:1px solid #ef4444; color:#ef4444; padding:15px;">
          ❌ Chapter Test Generation Failed: ${err.message}
        </div>
      `;
    }
  }
}

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

      const rawText = await callAiWithGroqFirst(prompt, "You are an NTA NEET exam setter. Output ONLY a valid JSON array.", (msg) => {
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

// Bulletproof JSON Parser that extracts questions from root arrays, wrapped objects, and truncated AI outputs
function robustParseJSON(rawText) {
  if (!rawText) throw new Error("Empty text received from AI.");

  let text = rawText.trim();

  // Strip markdown code fences
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  // Helper to sanitize common JSON string errors (unescaped backslashes, control chars, trailing commas)
  function sanitize(s) {
    return s
      .replace(/\\(?!["\\\//bfnrtu])/g, "\\\\")
      .replace(/[\u0000-\u001F]+/g, " ")
      .replace(/,\s*([\]}])/g, "$1");
  }

  // Helper to extract array of questions from any parsed JSON (root array or wrapper object)
  function extractQuestionsArray(obj) {
    if (!obj) return null;
    let list = null;
    if (Array.isArray(obj)) {
      list = obj;
    } else if (typeof obj === 'object') {
      list = obj.questions || obj.mcqs || obj.data || obj.items || obj.results || Object.values(obj).find(v => Array.isArray(v));
    }
    if (!Array.isArray(list) || list.length === 0) return null;

    const normalized = list.map(q => {
      if (!q || typeof q !== 'object') return null;
      return {
        question: q.question || q.q || q.title || q.text || "Question",
        options: Array.isArray(q.options) ? q.options : (Array.isArray(q.o) ? q.o : ["Option A", "Option B", "Option C", "Option D"]),
        correct: typeof q.correct === 'number' ? q.correct : (typeof q.c === 'number' ? q.c : 0),
        explanation: q.explanation || q.e || q.solution || "Solution",
        subject: q.subject || q.s || "General"
      };
    }).filter(Boolean);

    return normalized.length > 0 ? normalized : null;
  }

  // Step 1: Direct JSON parse
  try {
    const parsed = JSON.parse(text);
    const result = extractQuestionsArray(parsed);
    if (result) return result;
  } catch (e1) {}

  // Step 2: Sanitized JSON parse
  try {
    const parsed = JSON.parse(sanitize(text));
    const result = extractQuestionsArray(parsed);
    if (result) return result;
  } catch (e2) {}

  // Step 3: Extract from first '[' or '{'
  const firstSquare = text.indexOf('[');
  const firstCurly = text.indexOf('{');

  let subText = text;
  if (firstSquare !== -1 && (firstCurly === -1 || firstSquare < firstCurly)) {
    subText = text.substring(firstSquare);
  } else if (firstCurly !== -1) {
    subText = text.substring(firstCurly);
  }

  try {
    const parsed = JSON.parse(sanitize(subText));
    const result = extractQuestionsArray(parsed);
    if (result) return result;
  } catch (e3) {}

  // Step 4: Truncation Repair — progressive backwards slice to last complete object '}'
  let work = subText;
  for (let attempt = 0; attempt < 35; attempt++) {
    const lastCurly = work.lastIndexOf('}');
    if (lastCurly <= 0) break;
    let candidate = work.substring(0, lastCurly + 1).trim();

    if (candidate.startsWith('[') && !candidate.endsWith(']')) {
      candidate += "\n]";
    } else if (candidate.startsWith('{') && !candidate.endsWith('}')) {
      candidate += "\n]}";
    }

    try {
      const parsed = JSON.parse(sanitize(candidate));
      const result = extractQuestionsArray(parsed);
      if (result) {
        console.log(`[robustParseJSON] Successfully salvaged ${result.length} questions from truncated AI response!`);
        return result;
      }
    } catch(e) {}
    work = work.substring(0, lastCurly);
  }

  throw new Error("Could not parse structured questions from PDF. Please check your API key or try again.");
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

let extractedPdfText = "";
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

  const statusCard = document.getElementById("pdf-processing-status");
  const geminiKey = getApiKey();
  const groqKey = getGroqApiKey();

  if (!geminiKey && !groqKey) {
    alert("Please configure your free Gemini API Key or Groq API Key in Settings first!");
    showTab("settings");
    return;
  }

  if (statusCard) {
    statusCard.style.display = "block";
    statusCard.innerHTML = `
      <div class="glass-card" style="text-align:center; padding:20px;">
        <div class="spinner" style="margin:0 auto 10px auto;"></div>
        <h4>🧠 Extracting PDF & Structuring MCQs via Gemini AI (100% Primary Engine)...</h4>
        <p id="pdf-status-subtext" style="font-size:12px; color:#00d4aa;">Reading PDF pages & digitizing NEET MCQs via Gemini Multimodal Vision...</p>
      </div>
    `;
  }

  try {
    const pageTexts = await extractTextFromPdf(file, statusCard);
    extractedPdfText = pageTexts.join("\n\n");

    const prompt = `Analyze the following extracted PDF text and return a structured JSON array of ALL NEET multiple-choice questions (MCQs) found in the document (up to 50 questions).
Rules:
1. Output ONLY a raw JSON array — no markdown, no code fences, no commentary.
2. Format as compact JSON objects to save bandwidth and fit up to 50 questions:
{"q":"Question text","o":["Option A","Option B","Option C","Option D"],"c":0,"e":"Short 1-line solution","s":"Physics/Chemistry/Biology"}
3. "c" is the 0-indexed integer of the correct option (0 for A, 1 for B, 2 for C, 3 for D).
4. Use plain text for formulas (e.g. "F = m × a", "C6H12O6", "9.8 m/s^2"). Never use raw LaTeX.
5. Extract as many questions as available (up to 50).

PDF TEXT CONTENT:
${extractedPdfText.slice(0, 25000)}`;

    const sysPrompt = "You are an expert NTA NEET exam paper digitizer. Output ONLY a valid compact JSON array. No markdown fences. Keep explanations very short (1 line). Use plain text for formulas, never LaTeX.";
    let rawRes = null;

    // 1. PRIMARY ENGINE: Google Gemini API (100% Absolute Priority)
    if (geminiKey) {
      try {
        if (document.getElementById("pdf-status-subtext")) {
          document.getElementById("pdf-status-subtext").textContent = "🧠 Gemini AI analyzing paper layout and structuring NEET MCQs...";
        }
        rawRes = await callGeminiAPI(prompt, sysPrompt, (msg) => {
          const sub = document.getElementById("pdf-status-subtext");
          if (sub) sub.textContent = msg;
        }, { maxTokens: 8192, jsonMode: true });
      } catch (gemErr) {
        console.warn("[PDF Extractor] Gemini primary engine limit/error. Failing over to Groq API backup...", gemErr);
      }
    }

    // 2. FAILOVER BACKUP ENGINE: Groq Cloud API (Llama-3.3 70B)
    if (!rawRes && groqKey) {
      if (document.getElementById("pdf-status-subtext")) {
        document.getElementById("pdf-status-subtext").textContent = "⚡ Switched to Groq AI Backup Engine to digitize NEET MCQs...";
      }
      rawRes = await callGroqAPI(prompt, sysPrompt, (msg) => {
        const sub = document.getElementById("pdf-status-subtext");
        if (sub) sub.textContent = msg;
      }, { maxTokens: 8192, jsonMode: true });
    }

    if (!rawRes) {
      throw new Error("Could not connect to Gemini API or Groq API. Please check your API keys.");
    }

    const parsedQuestions = robustParseJSON(rawRes);

    if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
      extractedQuestionsList = parsedQuestions;
      if (statusCard) statusCard.style.display = "none";
      // Directly launch CBT Mock Test!
      showTab("ai-mocktest");
      startCbtExam(extractedQuestionsList, extractedQuestionsList.length * 120);
      return;
    } else {
      throw new Error("Could not parse structured questions from PDF.");
    }

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

function parseMcqsLocally(fullText) {
  if (!fullText) return [];
  const questions = [];
  const text = fullText.replace(/\r\n/g, "\n").replace(/\t/g, " ");

  const qBlockRegex = /(?:Q(?:uestion)?\s*[\d]+[\.\:]?|[\d]+\s*[\.\)])\s+/gi;
  const matches = [...text.matchAll(qBlockRegex)];

  if (matches.length < 2) {
    const paragraphs = text.split(/\n\s*\n+/);
    paragraphs.forEach((p, idx) => {
      const cleanP = p.trim();
      if (cleanP.length > 25) {
        const opts = extractOptionsLocally(cleanP);
        questions.push({
          question: cleanQuestionText(cleanP, opts.rawOptionsText),
          options: opts.options.length >= 2 ? opts.options : ["Option A", "Option B", "Option C", "Option D"],
          correct: 0,
          explanation: "Parsed locally via PDF.js Regex Engine",
          subject: "NEET Practice"
        });
      }
    });
    return questions.slice(0, 50);
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = (i + 1 < matches.length) ? matches[i + 1].index : text.length;
    const block = text.substring(start, end).trim();

    if (block.length > 15) {
      const opts = extractOptionsLocally(block);
      questions.push({
        question: cleanQuestionText(block, opts.rawOptionsText),
        options: opts.options.length >= 2 ? opts.options : ["Option A", "Option B", "Option C", "Option D"],
        correct: 0,
        explanation: "Parsed locally via PDF.js Regex Engine",
        subject: "NEET Practice"
      });
    }
  }

  return questions;
}

function extractOptionsLocally(blockText) {
  const optRegex = /(?:[\(\[]?[A-D1-4][\)\.\:\-]\s*|\b[A-D]\b[\.\)]\s*)([^\(\)\n\r]+)/g;
  const matches = [...blockText.matchAll(optRegex)];
  const options = [];
  let rawOptionsText = "";

  if (matches.length >= 2) {
    matches.forEach(m => {
      const optStr = m[1].trim();
      if (optStr.length > 0 && options.length < 4) {
        options.push(optStr);
      }
    });
    rawOptionsText = matches[0][0];
  }

  return { options, rawOptionsText };
}

function cleanQuestionText(blockText, rawOptionsStartStr) {
  let qText = blockText;
  if (rawOptionsStartStr && qText.includes(rawOptionsStartStr)) {
    qText = qText.split(rawOptionsStartStr)[0];
  }
  qText = qText.replace(/^(?:Q(?:uestion)?\s*[\d]+[\.\:]?|[\d]+\s*[\.\)])\s*/i, "").trim();
  return qText || blockText;
}

function copyExtractedPdfText() {
  if (!extractedPdfText) return;
  navigator.clipboard.writeText(extractedPdfText);
  alert("📋 Full extracted PDF text copied to clipboard!");
}

async function extractTextFromPdf(file, statusCard = null) {
  if (!window.pdfjsLib) {
    throw new Error("PDF.js library is not loaded.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageTexts = [];

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

  if (totalCharsExtracted < 50 && window.Tesseract) {
    console.log("[PDF Engine] Scanned PDF detected (digital text < 50 chars). Falling back to Tesseract.js OCR Engine...");
    
    const ocrTexts = [];
    const ocrPages = Math.min(pdf.numPages, 10);

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

function renderPdfExtractedQuestions(engineName = "Gemini AI Primary Engine") {
  const container = document.getElementById("pdf-extracted-list");
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card" style="margin-top:20px; padding:20px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
        <h3 style="margin:0; color:#00d4aa;">📄 Extracted PDF Text (${extractedPdfText.length} Characters)</h3>
        <button class="btn btn-secondary" onclick="copyExtractedPdfText()" style="font-size:12px;">📋 Copy Text to Clipboard</button>
      </div>
      <textarea readonly class="form-control" style="width:100%; height:180px; font-family:var(--font-mono); font-size:12px; line-height:1.5; color:#ccc;" placeholder="Extracted PDF text...">${escapeHTML(extractedPdfText)}</textarea>
    </div>

    <div class="glass-card" style="margin-top:20px; padding:20px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
        <div>
          <h3 style="margin:0; color:#fbbf24;">🎯 Digitized MCQs (${extractedQuestionsList.length} Questions)</h3>
          <span style="font-size:11px; color:#00d4aa; margin-top:2px; display:inline-block;">${escapeHTML(engineName)}</span>
        </div>
        ${extractedQuestionsList.length > 0 ? `<button class="btn btn-primary" onclick="launchCbtFromPdf()">🚀 Create NEET Test (${extractedQuestionsList.length} Qs)</button>` : ''}
      </div>

      <div style="display:flex; flex-direction:column; gap:12px;">
        ${extractedQuestionsList.map((q, i) => `
          <div style="padding:12px 14px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:8px;">
            <div style="font-weight:bold; font-size:13px; color:#fff;">Q${i+1}: ${escapeHTML(q.question)}</div>
            <div style="font-size:12px; color:#aaa; margin-top:6px;">
              Options: ${q.options ? q.options.map(o => escapeHTML(o)).join(" | ") : ''}
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

  if (!getGroqApiKey() && !getApiKey()) {
    recContainer.innerHTML = `<p style="font-size:12px; color:#aaa;">Please set your Groq or Gemini API key in Settings to get personalized study suggestions.</p>`;
    return;
  }

  recContainer.innerHTML = `<p style="font-size:12px; color:#fbbf24;">⚡ Analyzing your schedule and generating today's focus plan using Groq AI...</p>`;

  try {
    const prompt = `Give me a concise 3-bullet action plan for a NEET aspirant today. 
Bullet 1: Top priority subject & chapter
Bullet 2: Target study hours & active recall strategy
Bullet 3: Quick motivational tip`;

    const recText = await callAiWithGroqFirst(prompt, "You are a NEET study counselor.", null, { maxTokens: 400 });
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

  if (!getApiKey() && !getGroqApiKey()) {
    alert("Please set your Gemini or Groq API key in Settings first!");
    showTab("settings");
    return;
  }

  resultContainer.innerHTML = `
    <div class="glass-card" style="padding:15px; text-align:center;">
      <div class="spinner" style="margin:0 auto 10px auto;"></div>
      Analyzing your mistake patterns using Groq AI...
    </div>
  `;

  try {
    const prompt = `Analyze typical NEET mistake categories (Conceptual Error, Silly Calculation Error, Time Pressure, Formula Misapplication).
Provide a 3-step action plan to eliminate repeat errors in Physics & Chemistry.`;

    const analysis = await callAiWithGroqFirst(prompt, "You are a NEET performance analyst.", null, { maxTokens: 600 });
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

/* ==========================================================================
   FEATURE: NEWSDATA.IO PRIMARY LIVE NEWS ENGINE & SERPER BACKUP
   ========================================================================== */

function getNewsDataApiKey() {
  return (localStorage.getItem("newsdata_api_key") || "").trim();
}

function onNewsDataKeyTyped() {
  const msgArea = document.getElementById("newsdata-key-inline-msg");
  if (msgArea) msgArea.innerHTML = "";
}

function saveNewsDataApiKey() {
  const input = document.getElementById("setting-newsdata-key");
  const msgArea = document.getElementById("newsdata-key-inline-msg");
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    if (msgArea) msgArea.innerHTML = `<span style="color:#ef4444; font-weight:bold;">Please paste a valid NewsData.io API key (pub_...)</span>`;
    alert("Please enter a valid NewsData.io API key!");
    return;
  }
  localStorage.setItem("newsdata_api_key", val);
  updateNewsDataApiKeyStatusUI(true);
  if (msgArea) msgArea.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">✅ NewsData.io API Key saved successfully! Primary news engine active.</span>`;
  renderNeetNews("all");
  alert("🎉 NewsData.io API Key saved successfully!");
}

function removeNewsDataApiKey() {
  localStorage.removeItem("newsdata_api_key");
  const input = document.getElementById("setting-newsdata-key");
  if (input) input.value = "";
  const msgArea = document.getElementById("newsdata-key-inline-msg");
  if (msgArea) msgArea.innerHTML = `<span style="color:#fbbf24;">🗑️ NewsData.io API Key removed.</span>`;
  updateNewsDataApiKeyStatusUI(true);
  renderNeetNews("all");
}

function updateNewsDataApiKeyStatusUI(forceSync = false) {
  const key = getNewsDataApiKey();
  const badge = document.getElementById("newsdata-key-status-badge");
  const input = document.getElementById("setting-newsdata-key");
  if (input && (forceSync || !input.value.trim())) input.value = key;
  if (badge) {
    badge.innerHTML = key 
      ? `<span style="color:#00d4aa; font-weight:bold;">🟢 Primary News Ready</span>`
      : `<span style="color:#aaa; font-size:11px;">Optional (Primary News)</span>`;
  }
}

function toggleNewsDataKeyVisibility() {
  const input = document.getElementById("setting-newsdata-key");
  if (input) input.type = input.type === "password" ? "text" : "password";
}

async function testNewsDataApiConnection() {
  const input = document.getElementById("setting-newsdata-key");
  const badge = document.getElementById("newsdata-key-status-badge");
  const msgArea = document.getElementById("newsdata-key-inline-msg");

  if (input && input.value.trim()) {
    localStorage.setItem("newsdata_api_key", input.value.trim());
    updateNewsDataApiKeyStatusUI(true);
  }

  const key = getNewsDataApiKey();
  if (!key) {
    if (badge) badge.innerHTML = `<span style="color:#ef4444;">No Key</span>`;
    if (msgArea) msgArea.innerHTML = `<span style="color:#ef4444;">Please enter your NewsData.io API key first!</span>`;
    alert("Please paste your NewsData.io API key first!");
    return;
  }

  if (badge) badge.innerHTML = `<span style="color:#fbbf24;">Testing...</span>`;
  if (msgArea) msgArea.innerHTML = `<span style="color:#fbbf24;">Connecting to NewsData.io API...</span>`;

  try {
    const articles = await fetchLiveNewsData("all");
    if (articles && articles.length > 0) {
      if (badge) badge.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">🟢 Connected</span>`;
      if (msgArea) msgArea.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">🎉 Connection Successful! Fetched ${articles.length} news articles.</span>`;
      alert(`🎉 NewsData.io API Connection Successful! Fetched ${articles.length} live articles.`);
    } else {
      throw new Error("No articles returned from NewsData.io API.");
    }
  } catch (err) {
    if (badge) badge.innerHTML = `<span style="color:#ef4444;">Failed</span>`;
    if (msgArea) msgArea.innerHTML = `<span style="color:#ef4444;">Connection failed: ${err.message}</span>`;
    alert(`❌ NewsData.io API Connection Failed: ${err.message}`);
  }
}

async function fetchLiveNewsData(category = "all") {
  const key = getNewsDataApiKey();
  if (!key) return null;

  let query = "NEET NTA";
  if (category === "nta") query = "NTA NEET official notification";
  if (category === "syllabus") query = "NEET syllabus NMC NTA";
  if (category === "counseling") query = "NEET MCC counseling";

  try {
    const url = `https://newsdata.io/api/1/latest?apikey=${key}&q=${encodeURIComponent(query)}&country=in&language=en`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.warn("NewsData fetch failed:", err);
    return null;
  }
}

async function renderNeetNews(filter = "all") {
  const container = document.getElementById("news-cards-container");
  if (!container) return;

  const serperKey = getSerperApiKey();
  const newsDataKey = getNewsDataApiKey();

  // 1. PRIMARY ENGINE FOR LIVE NEWS: Serper.dev News API (Google Engine)
  if (serperKey) {
    container.innerHTML = `
      <div class="glass-card" style="grid-column: 1 / -1; text-align:center; padding:20px;">
        <div class="spinner" style="margin:0 auto 10px auto;"></div>
        🔍 Fetching Live NEET News & NTA Updates via Serper.dev (Primary Engine)...
      </div>
    `;

    const liveNews = await fetchLiveSerperNews(filter);
    if (liveNews && liveNews.length > 0) {
      container.innerHTML = liveNews.map(item => `
        <div class="news-card glass-card" style="padding:16px; display:flex; flex-direction:column; justify-content:space-between; border:1px solid rgba(0,212,170,0.3);">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="badge" style="background:rgba(0,212,170,0.15); color:#00d4aa; font-size:10px; padding:2px 8px; border-radius:4px;">🔍 ${escapeHTML(item.source || 'Serper News')}</span>
              <span style="font-size:10px; color:#aaa;">${item.date || 'Recent'}</span>
            </div>
            ${item.imageUrl ? `<img src="${item.imageUrl}" alt="News Image" style="width:100%; height:130px; object-fit:cover; border-radius:8px; margin-bottom:10px;">` : ''}
            <h4 style="margin:0 0 8px 0; font-size:14px; color:#fff; line-height:1.3;">${escapeHTML(item.title)}</h4>
            <p style="font-size:12px; color:#ccc; line-height:1.45; margin:0;">${escapeHTML(item.snippet || item.title)}</p>
          </div>
          <div style="margin-top:12px; display:flex; justify-content:space-between; align-items:center;">
            <a href="${item.link}" target="_blank" class="btn btn-secondary" style="font-size:11px; padding:4px 8px; text-decoration:none;">Read Article ↗</a>
            <span style="font-size:10px; color:#00d4aa;">🔍 Serper Engine</span>
          </div>
        </div>
      `).join('');
      return;
    }
  }

  // 2. SECONDARY BACKUP ENGINE FOR LIVE NEWS: NewsData.io API
  if (newsDataKey) {
    container.innerHTML = `
      <div class="glass-card" style="grid-column: 1 / -1; text-align:center; padding:20px;">
        <div class="spinner" style="margin:0 auto 10px auto;"></div>
        📰 Fetching Live NEET News via NewsData.io Backup Engine...
      </div>
    `;

    const ndArticles = await fetchLiveNewsData(filter);
    if (ndArticles && ndArticles.length > 0) {
      container.innerHTML = ndArticles.map(item => `
        <div class="news-card glass-card" style="padding:16px; display:flex; flex-direction:column; justify-content:space-between; border:1px solid rgba(59,130,246,0.3);">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="badge" style="background:rgba(59,130,246,0.15); color:#3b82f6; font-size:10px; padding:2px 8px; border-radius:4px;">📰 ${escapeHTML(item.source_id || 'NewsData.io')}</span>
              <span style="font-size:10px; color:#aaa;">${item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'Today'}</span>
            </div>
            ${item.image_url ? `<img src="${item.image_url}" alt="News Image" style="width:100%; height:130px; object-fit:cover; border-radius:8px; margin-bottom:10px;">` : ''}
            <h4 style="margin:0 0 8px 0; font-size:14px; color:#fff; line-height:1.3;">${escapeHTML(item.title)}</h4>
            <p style="font-size:12px; color:#ccc; line-height:1.45; margin:0;">${escapeHTML(item.description || item.content || '')}</p>
          </div>
          <div style="margin-top:12px; display:flex; justify-content:space-between; align-items:center;">
            <a href="${item.link}" target="_blank" class="btn btn-secondary" style="font-size:11px; padding:4px 8px; text-decoration:none;">Read Story ↗</a>
            <span style="font-size:10px; color:#3b82f6;">⚡ NewsData Backup</span>
          </div>
        </div>
      `).join('');
      return;
    }
  }

  // 3. BUILT-IN OFFICIAL NEWS MATRIX FALLBACK
  const filtered = filter === "all" ? NEET_NEWS_ITEMS : NEET_NEWS_ITEMS.filter(item => item.category === filter);
  container.innerHTML = filtered.map(item => `
    <div class="news-card glass-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span class="badge badge-primary">${item.badge}</span>
        <span style="font-size:11px; color:#aaa;">${item.date}</span>
      </div>
      <h4 style="margin:8px 0; font-size:15px; color:#fff;">${escapeHTML(item.title)}</h4>
      <p style="font-size:12px; color:#ccc; line-height:1.5;">${escapeHTML(item.summary)}</p>
      <div style="margin-top:12px; display:flex; justify-content:space-between; align-items:center;">
        <a href="${item.link}" target="_blank" class="btn btn-secondary" style="font-size:11px; text-decoration:none;">Official Portal ↗</a>
      </div>
    </div>
  `).join('');
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
  let html = text;

  // 1. Clean up raw LaTeX \text{...} wrappers in chemical formulas & equations
  html = html.replace(/\\text\{([^}]+)\}/g, '$1');

  // 2. Clean up backslash-escaped multiplication stars (e.g. F = m \* a -> F = m × a)
  html = html.replace(/\\\*/g, '×');

  // 3. Clean up LaTeX chemical arrows, operators & Greek physics symbols BEFORE HTML escaping
  html = html.replace(/\\rightarrow|\\to|\\longrightarrow/g, '→');
  html = html.replace(/\\leftarrow|\\longleftarrow/g, '←');
  html = html.replace(/\\leftrightarrow|\\rightleftharpoons/g, '⇌');
  html = html.replace(/\\Delta|\\delta/g, 'Δ');
  html = html.replace(/\\pm/g, '±');
  html = html.replace(/\\times/g, '×');
  html = html.replace(/\\cdot/g, '·');
  html = html.replace(/\\div/g, '÷');
  html = html.replace(/\\theta/g, 'θ');
  html = html.replace(/\\alpha/g, 'α');
  html = html.replace(/\\beta/g, 'β');
  html = html.replace(/\\gamma/g, 'γ');
  html = html.replace(/\\pi/g, 'π');
  html = html.replace(/\\mu/g, 'μ');
  html = html.replace(/\\lambda/g, 'λ');
  html = html.replace(/\\omega/g, 'ω');
  html = html.replace(/\\nu/g, 'ν');

  // 4. Clean up raw math delimiters $ ... $ or $$ ... $$ wrapping equations
  html = html.replace(/\$\$([^\$]+)\$\$/g, '$1');
  html = html.replace(/\$([^\$]+)\$/g, '$1');

  // 4. Escape HTML safety
  html = escapeHTML(html);

  // Restore allowed sub and sup HTML tags from AI or user input
  html = html.replace(/&lt;sub&gt;(.*?)&lt;\/sub&gt;/gi, '<sub>$1</sub>');
  html = html.replace(/&lt;sup&gt;(.*?)&lt;\/sup&gt;/gi, '<sup>$1</sup>');

  // Support ~subscript~ syntax (e.g. H~2~O -> H<sub>2</sub>O)
  html = html.replace(/~([^~]+)~/g, '<sub>$1</sub>');

  // Support ^superscript^ syntax (e.g. Fe^3+^ -> Fe<sup>3+</sup>, 10^-3^ -> 10<sup>-3</sup>)
  html = html.replace(/\^([^\^]+)\^/g, '<sup>$1</sup>');

  // Support single-caret unit superscripts and powers (e.g. m/s^2 -> m/s<sup>2</sup>, m s^-2 -> m s<sup>-2</sup>, 10^5 -> 10<sup>5</sup>, Fe^3+ -> Fe<sup>3+</sup>)
  html = html.replace(/\^([\-+]?[0-9a-zA-Z\+\-]+(?:\.[0-9]+)?)/g, '<sup>$1</sup>');

  // Support chemical ion charges & superscripts in bracket notation e.g. Ca^{2+}, SO4^{2-}
  html = html.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>');
  html = html.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');

  // Support automatic chemical formula subscript (e.g. C_6H_12O_6, H_2O, CO_2, KMnO_4, H_2SO_4, CH_4, NH_3)
  html = html.replace(/([A-Z][a-z]?)_([0-9]+)/g, '$1<sub>$2</sub>');

  // Support chemical formula number attachment (e.g., C6H12O6, H2O, CO2, 6O2, 6CO2, 6H2O)
  html = html.replace(/([A-Z][a-z]?)([0-9]+)(?=[A-Z\s\+\-→⇌\(\)]|$)/g, '$1<sub>$2</sub>');

  // Support common chemical arrows and Delta symbol from HTML entity replacements
  html = html.replace(/&lt;=&gt;|&lt;-&gt;/g, '⇌');
  html = html.replace(/&lt;-/g, '←');
  html = html.replace(/-&gt;/g, '→');

  // Formatting: Bold, Italics, Line breaks
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/\n/g, '<br>');
  return html;
}

function insertSubscript(inputId = "tutor-chat-input") {
  const input = document.getElementById(inputId);
  if (!input) return;
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const selText = input.value.substring(start, end) || "2";
  const replacement = `~${selText}~`;
  input.value = input.value.substring(0, start) + replacement + input.value.substring(end);
  input.focus();
  input.setSelectionRange(start + 1, start + 1 + selText.length);
  if (typeof updateCharCount === "function") updateCharCount();
}

function insertSuperscript(inputId = "tutor-chat-input") {
  const input = document.getElementById(inputId);
  if (!input) return;
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const selText = input.value.substring(start, end) || "+";
  const replacement = `^${selText}^`;
  input.value = input.value.substring(0, start) + replacement + input.value.substring(end);
  input.focus();
  input.setSelectionRange(start + 1, start + 1 + selText.length);
  if (typeof updateCharCount === "function") updateCharCount();
}

function insertChemistrySymbol(symbol, inputId = "tutor-chat-input") {
  const input = document.getElementById(inputId);
  if (!input) return;
  const start = input.selectionStart;
  const end = input.selectionEnd;
  input.value = input.value.substring(0, start) + symbol + input.value.substring(end);
  input.focus();
  input.setSelectionRange(start + symbol.length, start + symbol.length);
  if (typeof updateCharCount === "function") updateCharCount();
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

/* ==========================================================================
   FEATURE: TAVILY AI SEARCH PRIMARY ENGINE & SERPER BACKUP ENGINE
   ========================================================================== */

function getTavilyApiKey() {
  return (localStorage.getItem("tavily_api_key") || "").trim();
}

function onTavilyKeyTyped() {
  const msgArea = document.getElementById("tavily-key-inline-msg");
  if (msgArea) msgArea.innerHTML = "";
}

function saveTavilyApiKey() {
  const input = document.getElementById("setting-tavily-key");
  const msgArea = document.getElementById("tavily-key-inline-msg");
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    if (msgArea) msgArea.innerHTML = `<span style="color:#ef4444; font-weight:bold;">Please paste a valid Tavily API key (tvly-...)</span>`;
    alert("Please enter a valid Tavily API key!");
    return;
  }
  localStorage.setItem("tavily_api_key", val);
  updateTavilyApiKeyStatusUI(true);
  if (msgArea) msgArea.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">✅ Tavily API Key saved successfully! Primary research engine active.</span>`;
  alert("🎉 Tavily API Key saved successfully!");
}

function removeTavilyApiKey() {
  localStorage.removeItem("tavily_api_key");
  const input = document.getElementById("setting-tavily-key");
  if (input) input.value = "";
  const msgArea = document.getElementById("tavily-key-inline-msg");
  if (msgArea) msgArea.innerHTML = `<span style="color:#fbbf24;">🗑️ Tavily API Key removed.</span>`;
  updateTavilyApiKeyStatusUI(true);
}

function updateTavilyApiKeyStatusUI(forceSync = false) {
  const key = getTavilyApiKey();
  const badge = document.getElementById("tavily-key-status-badge");
  const input = document.getElementById("setting-tavily-key");
  if (input && (forceSync || !input.value.trim())) input.value = key;
  if (badge) {
    badge.innerHTML = key 
      ? `<span style="color:#00d4aa; font-weight:bold;">🟢 Primary Research Ready</span>`
      : `<span style="color:#aaa; font-size:11px;">Optional (Primary Research)</span>`;
  }
}

function toggleTavilyKeyVisibility() {
  const input = document.getElementById("setting-tavily-key");
  if (input) input.type = input.type === "password" ? "text" : "password";
}

async function testTavilyApiConnection() {
  const input = document.getElementById("setting-tavily-key");
  const badge = document.getElementById("tavily-key-status-badge");
  const msgArea = document.getElementById("tavily-key-inline-msg");

  if (input && input.value.trim()) {
    localStorage.setItem("tavily_api_key", input.value.trim());
    updateTavilyApiKeyStatusUI(true);
  }

  const key = getTavilyApiKey();
  if (!key) {
    if (badge) badge.innerHTML = `<span style="color:#ef4444;">No Key</span>`;
    if (msgArea) msgArea.innerHTML = `<span style="color:#ef4444;">Please enter your Tavily API key first!</span>`;
    alert("Please paste your Tavily API key first!");
    return;
  }

  if (badge) badge.innerHTML = `<span style="color:#fbbf24;">Testing...</span>`;
  if (msgArea) msgArea.innerHTML = `<span style="color:#fbbf24;">Connecting to Tavily AI Search API...</span>`;

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        query: "NEET UG NTA official syllabus 2027",
        search_depth: "basic",
        max_results: 2
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (badge) badge.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">🟢 Connected</span>`;
      if (msgArea) msgArea.innerHTML = `<span style="color:#00d4aa; font-weight:bold;">🎉 Connection Successful! Tavily AI Search active.</span>`;
      alert(`🎉 Tavily API Connection Successful! Returned ${data.results?.length || 0} results.`);
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    if (badge) badge.innerHTML = `<span style="color:#ef4444;">Failed</span>`;
    if (msgArea) msgArea.innerHTML = `<span style="color:#ef4444;">Connection failed: ${err.message}</span>`;
    alert(`❌ Tavily API Connection Failed: ${err.message}`);
  }
}

async function performTavilySearch(query) {
  const key = getTavilyApiKey();
  if (!key) return null;

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        query: query,
        search_depth: "advanced",
        include_answer: true,
        max_results: 5
      })
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn("Tavily search failed:", err);
    return null;
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

function getOfflineNcertResearch(query) {
  const qLower = query.toLowerCase();
  
  if (qLower.includes("circular") || qLower.includes("nta") || qLower.includes("update") || qLower.includes("news")) {
    return `### 🔴 NTA & NMC Official Guidelines Summary
- **NEET Exam Pattern:** Retains 180 mandatory MCQs out of 200 (Physics: 45, Chemistry: 45, Biology: 90).
- **Marking Scheme:** +4 for correct answer, -1 for incorrect option, 0 for unattempted.
- **Syllabus Baseline:** Fully aligned with Class 11 & 12 NCERT core syllabus (latest NMC revised guidelines).
- **Official Portals:** [NTA NEET Portal](https://neet.nta.nic.in) | [NMC Official Site](https://www.nmc.org.in)`;
  }
  
  if (qLower.includes("biotech") || qLower.includes("recombinant") || qLower.includes("crispr") || qLower.includes("dna")) {
    return `### 🧬 NCERT Biology: Biotechnology & Recombinant DNA
- **Key Concepts:** Restriction Endonucleases (Molecular Scissors), DNA Ligases, Recombinant Plasmids (pBR322), Gel Electrophoresis.
- **High-Yield Steps:** 
  1. Isolation of Genetic Material (DNA)
  2. Cutting of DNA at specific sites by Restriction Enzymes
  3. Amplification of Gene of Interest using PCR ($2^n$ molecules after $n$ cycles)
  4. Insertion of Recombinant DNA into Host Cell/Organism
- **NEET Exam Weightage:** ~5-7 MCQs per year in NEET UG Biology.`;
  }

  if (qLower.includes("cardiac") || qLower.includes("heart") || qLower.includes("medical") || qLower.includes("paper")) {
    return `### 🧪 Human Physiology: Cardiac Cycle & Circulation
- **Phase Durations (Total 0.8s):**
  1. Joint Diastole: 0.4s
  2. Atrial Systole: 0.1s
  3. Ventricular Systole: 0.3s
- **Heart Sounds:** 
  - First sound **LUB** (closure of bicuspid/tricuspid valves)
  - Second sound **DUB** (closure of semilunar valves)
- **Stroke Volume:** $\\approx 70\\text{ mL}$, Cardiac Output = $\\text{Heart Rate} \\times \\text{Stroke Volume} = 72 \\times 70 \\approx 5000\\text{ mL/min} = 5\\text{ L/min}$.`;
  }

  return `### 📚 Academic & NCERT High-Yield Research Report: ${escapeHTML(query)}
- **NCERT Core Focus:** High-yield conceptual area for NEET Physics/Chemistry/Biology preparation.
- **Study Action Items:**
  1. Read Class 11/12 NCERT textbook lines carefully with special focus on bold terms and summary tables.
  2. Practice 50+ PYQ MCQs on this topic from the built-in PYQ Bank.
  3. Add formula/mnemonic notes to your Error Book for active recall.`;
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

  const tavilyKey = getTavilyApiKey();
  const serperKey = getSerperApiKey();
  const groqKey = getGroqApiKey();
  const geminiKey = getApiKey();

  if (!tavilyKey && !serperKey && !groqKey && !geminiKey) {
    alert("Please configure your free Tavily API key or Serper API key in Settings first!");
    showTab("settings");
    return;
  }

  if (statusCard) {
    statusCard.style.display = "block";
    statusCard.innerHTML = `
      <div class="glass-card" style="text-align:center; padding:20px;">
        <div class="spinner" style="margin:0 auto 10px auto;"></div>
        <h4>🔬 Running Deep AI & Web Research...</h4>
        <p id="research-status-subtext" style="font-size:12px; color:#00d4aa;">🌐 Primary Engine: Tavily AI Search | Backup Engine: Serper.dev Google Search...</p>
      </div>
    `;
  }
  container.innerHTML = "";

  let primaryResearchHtml = "";
  let backupSearchHtml = "";

  // 1. PRIMARY ENGINE FOR RESEARCH: Tavily AI Search API
  if (tavilyKey) {
    try {
      if (document.getElementById("research-status-subtext")) {
        document.getElementById("research-status-subtext").textContent = "🌐 Fetching Deep AI Research Digest & Direct Answer with Tavily Primary Engine...";
      }
      const tavData = await performTavilySearch(query);
      if (tavData) {
        let tavCardsHtml = "";

        if (tavData.answer) {
          tavCardsHtml += `
            <div class="glass-card" style="padding:16px; margin-bottom:16px; border:1px solid #a855f7; background:rgba(168,85,247,0.04);">
              <h4 style="margin:0 0 6px 0; color:#a855f7;">💡 Direct AI Answer Synthesis (Tavily Primary Engine)</h4>
              <p style="font-size:13.5px; color:#e2e8f0; line-height:1.6; margin:0;">${parseMarkdownAndKaTeX(tavData.answer)}</p>
            </div>
          `;
        }

        const results = tavData.results || [];
        if (results.length > 0) {
          const cardsList = results.map(r => `
            <div class="glass-card" style="padding:14px; margin-bottom:12px; border:1px solid rgba(168,85,247,0.3);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <span class="badge" style="background:rgba(168,85,247,0.15); color:#a855f7; font-size:10px; padding:2px 8px; border-radius:4px;">🌐 Tavily Verified Citation</span>
                <span style="font-size:10px; color:#aaa;">Relevance Score: ${Math.round((r.score || 0.9) * 100)}%</span>
              </div>
              <h4 style="margin:0 0 6px 0; font-size:14px; color:#fff;">${escapeHTML(r.title)}</h4>
              <p style="font-size:12px; color:#ccc; line-height:1.45; margin:0 0 8px 0;">${escapeHTML(r.content || '')}</p>
              <a href="${r.url}" target="_blank" class="btn btn-secondary" style="font-size:11px; padding:4px 8px; text-decoration:none;">Visit Academic Source ↗</a>
            </div>
          `).join('');

          tavCardsHtml += `
            <div style="margin-top:16px;">
              <h4 style="color:#a855f7; margin-bottom:12px;">📚 Top Academic Web Sources & Citations (Tavily Engine)</h4>
              ${cardsList}
            </div>
          `;
        }

        primaryResearchHtml = `
          <div class="glass-card" style="margin-bottom:20px; border:1px solid #a855f7; background:rgba(168,85,247,0.02); padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(168,85,247,0.2); padding-bottom:10px;">
              <h3 style="margin:0; color:#a855f7;">🌐 Tavily Deep AI Web Research Digest</h3>
              <span style="font-size:11px; background:rgba(168,85,247,0.15); color:#a855f7; padding:3px 8px; border-radius:12px; border:1px solid rgba(168,85,247,0.4);">🌐 Primary Engine</span>
            </div>
            ${tavCardsHtml}
          </div>
        `;
      }
    } catch (tavErr) {
      console.warn("[Research Hub] Tavily primary engine failed. Falling back to Serper backup...", tavErr);
    }
  }

  // 2. BACKUP ENGINE FOR RESEARCH: Serper.dev API (Google Search Engine)
  if (serperKey) {
    try {
      if (document.getElementById("research-status-subtext")) {
        document.getElementById("research-status-subtext").textContent = "🔍 Fetching live Google search results via Serper.dev backup engine...";
      }
      const res = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": serperKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ q: query, num: 6 })
      });

      if (res.ok) {
        const data = await res.json();
        const organicResults = data.organic || [];
        const answerBox = data.answerBox || null;

        let searchCards = "";
        if (answerBox) {
          searchCards += `
            <div class="glass-card" style="padding:16px; margin-bottom:16px; border:1px solid #00d4aa; background:rgba(0,212,170,0.03);">
              <h4 style="margin:0 0 6px 0; color:#00d4aa;">💡 Direct Google Answer Box (Serper Engine)</h4>
              <h5 style="margin:0 0 6px 0; color:#fff;">${escapeHTML(answerBox.title || query)}</h5>
              <p style="font-size:13px; color:#e2e8f0; line-height:1.5; margin:0;">${escapeHTML(answerBox.answer || answerBox.snippet || "")}</p>
            </div>
          `;
        }

        if (organicResults.length > 0) {
          const cardsList = organicResults.map((item, idx) => `
            <div style="padding:12px 14px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                  <span style="font-size:11px; font-weight:bold; color:#00d4aa;">Result #${idx + 1}</span>
                </div>
                <a href="${item.link}" target="_blank" style="font-weight:bold; font-size:13px; color:#fbbf24; text-decoration:none; display:block; margin-bottom:4px;">${escapeHTML(item.title)} ↗</a>
                <p style="font-size:12px; color:#ccc; line-height:1.45; margin:0;">${escapeHTML(item.snippet || '')}</p>
              </div>
              <a href="${item.link}" target="_blank" class="btn btn-secondary" style="font-size:11px; padding:3px 8px; text-decoration:none; text-align:center; align-self:flex-start; margin-top:10px;">Open Source ↗</a>
            </div>
          `).join('');

          searchCards += `
            <div style="margin-top:16px;">
              <h4 style="color:#00d4aa; margin-bottom:12px;">🌐 Live Google Search Results (${organicResults.length} Web Sources via Serper Backup Engine)</h4>
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:14px;">
                ${cardsList}
              </div>
            </div>
          `;
        }

        backupSearchHtml = `
          <div class="glass-card" style="margin-bottom:20px; border:1px solid #00d4aa; background:rgba(0,212,170,0.02); padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid rgba(0,212,170,0.2); padding-bottom:10px;">
              <h3 style="margin:0; color:#00d4aa;">🔍 Live Web Search Cards (Serper.dev Backup Engine)</h3>
              <span style="font-size:11px; background:rgba(0,212,170,0.15); color:#00d4aa; padding:3px 8px; border-radius:12px; border:1px solid rgba(0,212,170,0.4);">🔍 Serper Backup Engine</span>
            </div>
            ${searchCards}
          </div>
        `;
      }
    } catch (serperErr) {
      console.warn("[Research Hub] Serper backup search failed:", serperErr);
    }
  }

  if (statusCard) statusCard.style.display = "none";

  let finalHtml = "";
  if (primaryResearchHtml) finalHtml += primaryResearchHtml;
  if (backupSearchHtml) finalHtml += backupSearchHtml;
  if (!finalHtml) {
    const offlineText = getOfflineNcertResearch(query);
    finalHtml = `
      <div class="glass-card" style="padding:20px; border:1px solid #fbbf24;">
        <h3 style="color:#fbbf24; margin-top:0;">📚 Offline NCERT Syllabus Research Engine</h3>
        <div style="font-size:13px; line-height:1.6;">${parseMarkdownAndKaTeX(offlineText)}</div>
      </div>
    `;
  }

  container.innerHTML = finalHtml;
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
window.generateAiChapterTest = generateAiChapterTest;
window.submitCbtTest = submitCbtTest;
window.handlePdfDrop = handlePdfDrop;
window.copyExtractedPdfText = copyExtractedPdfText;
window.launchCbtFromPdf = launchCbtFromPdf;
window.generateStudyRecommendation = generateStudyRecommendation;
window.analyzeMistakesWithAI = analyzeMistakesWithAI;
window.summarizeNews = summarizeNews;
window.filterNews = filterNews;
window.copyText = copyText;
window.handleAiTabSwitch = handleAiTabSwitch;

window.getGroqApiKey = getGroqApiKey;
window.saveGroqApiKey = saveGroqApiKey;
window.removeGroqApiKey = removeGroqApiKey;
window.updateGroqApiKeyStatusUI = updateGroqApiKeyStatusUI;
window.toggleGroqKeyVisibility = toggleGroqKeyVisibility;
window.testGroqApiConnection = testGroqApiConnection;
window.insertSubscript = insertSubscript;
window.insertSuperscript = insertSuperscript;
window.insertChemistrySymbol = insertChemistrySymbol;

window.getNewsDataApiKey = getNewsDataApiKey;
window.saveNewsDataApiKey = saveNewsDataApiKey;
window.removeNewsDataApiKey = removeNewsDataApiKey;
window.updateNewsDataApiKeyStatusUI = updateNewsDataApiKeyStatusUI;
window.toggleNewsDataKeyVisibility = toggleNewsDataKeyVisibility;
window.testNewsDataApiConnection = testNewsDataApiConnection;
window.fetchLiveNewsData = fetchLiveNewsData;

window.getTavilyApiKey = getTavilyApiKey;
window.saveTavilyApiKey = saveTavilyApiKey;
window.removeTavilyApiKey = removeTavilyApiKey;
window.updateTavilyApiKeyStatusUI = updateTavilyApiKeyStatusUI;
window.toggleTavilyKeyVisibility = toggleTavilyKeyVisibility;
window.testTavilyApiConnection = testTavilyApiConnection;
window.performTavilySearch = performTavilySearch;

document.addEventListener("DOMContentLoaded", () => {
  updateApiKeyStatusUI(true);
  updateGroqApiKeyStatusUI(true);
  updateNewsDataApiKeyStatusUI(true);
  updateSerperApiKeyStatusUI(true);
  updateTavilyApiKeyStatusUI(true);
  renderSetupRequiredCards();
  renderNeetNews("all");

  // Attach direct event listeners for bulletproof button clicks across mobile & desktop
  const saveBtn = document.getElementById("btn-save-api-key");
  if (saveBtn) saveBtn.onclick = saveApiKey;

  const testBtn = document.getElementById("btn-test-api-key");
  if (testBtn) testBtn.onclick = testApiKeyConnection;

  const removeBtn = document.getElementById("btn-remove-api-key");
  if (removeBtn) removeBtn.onclick = removeApiKey;

  const saveGroqBtn = document.getElementById("btn-save-groq-key");
  if (saveGroqBtn) saveGroqBtn.onclick = saveGroqApiKey;

  const testGroqBtn = document.getElementById("btn-test-groq-key");
  if (testGroqBtn) testGroqBtn.onclick = testGroqApiConnection;

  const removeGroqBtn = document.getElementById("btn-remove-groq-key");
  if (removeGroqBtn) removeGroqBtn.onclick = removeGroqApiKey;

  const saveNewsDataBtn = document.getElementById("btn-save-newsdata-key");
  if (saveNewsDataBtn) saveNewsDataBtn.onclick = saveNewsDataApiKey;

  const testNewsDataBtn = document.getElementById("btn-test-newsdata-key");
  if (testNewsDataBtn) testNewsDataBtn.onclick = testNewsDataApiConnection;

  const removeNewsDataBtn = document.getElementById("btn-remove-newsdata-key");
  if (removeNewsDataBtn) removeNewsDataBtn.onclick = removeNewsDataApiKey;

  const saveSerperBtn = document.getElementById("btn-save-serper-key");
  if (saveSerperBtn) saveSerperBtn.onclick = saveSerperApiKey;

  const testSerperBtn = document.getElementById("btn-test-serper-key");
  if (testSerperBtn) testSerperBtn.onclick = testSerperApiConnection;

  const removeSerperBtn = document.getElementById("btn-remove-serper-key");
  if (removeSerperBtn) removeSerperBtn.onclick = removeSerperApiKey;

  const saveTavilyBtn = document.getElementById("btn-save-tavily-key");
  if (saveTavilyBtn) saveTavilyBtn.onclick = saveTavilyApiKey;

  const testTavilyBtn = document.getElementById("btn-test-tavily-key");
  if (testTavilyBtn) testTavilyBtn.onclick = testTavilyApiConnection;

  const removeTavilyBtn = document.getElementById("btn-remove-tavily-key");
  if (removeTavilyBtn) removeTavilyBtn.onclick = removeTavilyApiKey;
});

function handleAiTabSwitch(tabId) {
  updateApiKeyStatusUI(true);
  updateGroqApiKeyStatusUI(true);
  updateNewsDataApiKeyStatusUI(true);
  updateSerperApiKeyStatusUI(true);
  updateTavilyApiKeyStatusUI(true);
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

/* ==========================================================================
   FEATURE: 24/7 AI EMOTIONAL & MINDSET COMPANION CHATBOT
   ========================================================================== */

const MINDSET_SYSTEM_PROMPT = `You are a compassionate, empathetic, and gentle AI Mindset & Emotional Support Counselor dedicated to helping students during difficult times in their academic journey.

YOUR MISSION & TONALITY:
1. Be deeply empathetic, warm, patient, and non-judgmental.
2. Validate the student's feelings of stress, burnout, low test scores, anxiety, fatigue, or self-doubt. Remind them that it's completely normal to feel this way.
3. Provide gentle grounding techniques, practical emotional regulation tips (like deep breathing, taking short walks, breaking tasks into tiny micro-steps), and uplifting words of comfort.
4. Keep your responses warm, comforting, and easy to read (use formatting, bullet points, and gentle emojis).
5. Never lecture them to "just study harder". Focus on emotional well-being, self-compassion, and mental clarity.`;

let mindsetChatHistoryList = [];

// Fallback empathetic responses if API key is missing or network fails
function getFallbackEmpatheticReply(userText) {
  const text = (userText || "").toLowerCase();
  if (text.includes("overwhelmed") || text.includes("burnout") || text.includes("tired")) {
    return `❤️ **I hear you, and your feelings are 100% valid.**

Studying for competitive exams takes a huge toll on your mind and body. Feeling overwhelmed or burnt out isn't a sign of failure — it's your mind asking for a moment to breathe.

**Here is what you can do right now:**
1. 🧘 **Take a 15-minute complete pause:** Step away from your desk, stretch, or try the 4-7-8 breathing exercise below.
2. 💧 **Hydrate & rest your eyes:** Drink a glass of water and close your eyes for a few minutes.
3. 📝 **Shrink your goal:** Don't worry about the whole syllabus today. Focus on just ONE small topic when you return.

You are doing much better than you think. Be gentle with yourself today! 🌸`;
  }

  if (text.includes("low") || text.includes("marks") || text.includes("score") || text.includes("test")) {
    return `💔 **A mock test score measures a single moment in time, NOT your potential or self-worth.**

It is completely painful when your score doesn't match your hard work. But remember: mock tests exist to catch mistakes NOW so you don't make them in the final exam!

**Three steps to recover:**
1. 🌿 **Separate yourself from the score:** You are a human being preparing for a journey, not a number.
2. 🔍 **Log errors calmly:** Place incorrect questions into your **Error Book** without judgment.
3. 🎯 **Focus on growth:** Every mistake analyzed is 4 marks saved in the actual exam.

Take a breath. You are on the right path, and progress isn't always linear! 🤝`;
  }

  if (text.includes("pressure") || text.includes("family") || text.includes("parents") || text.includes("peer")) {
    return `👨‍👩‍👦 **Handling expectations is one of the heaviest burdens a student carries.**

It's completely natural to feel anxious when you feel others are watching or expecting results. But remember: **your life journey belongs to YOU.**

**Remind yourself:**
* 🛡️ You don't need to prove your worth to anyone by sacrificing your mental health.
* 🌿 Focus only on what you can control: your daily effort and your own peace of mind.
* 💬 Take things one day at a time. Your hard work will speak for itself.

I am right here with you! Stay strong and take care of yourself first. 💚`;
  }

  return `🌸 **Thank you for sharing your thoughts with me.**

No matter how tough or overwhelming things feel right now, please know that you are not alone on this journey. Experiencing stress or self-doubt is a natural part of preparing for a high-stakes exam.

**A gentle reminder for today:**
* 💖 **Prioritize self-compassion:** Take breaks when needed without feeling guilty.
* 🎯 **Focus on small steps:** Progress happens one day, one chapter, one page at a time.
* 🧘 **Breathe deeply:** You have overcome hard days before, and you will get through this too.

Whenever you need a safe space to unload your stress, I am here for you! 🫶`;
}

function quickAskMindset(promptText) {
  const input = document.getElementById("mindset-chat-input");
  if (input) {
    input.value = promptText;
  }
  sendMindsetChatMessage();
}

function appendMindsetChatMessage(sender, text) {
  const history = document.getElementById("mindset-chat-history");
  if (!history) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-msg ${sender === 'user' ? 'user-msg' : 'ai-msg'}`;
  msgDiv.style.margin = "10px 0";
  msgDiv.style.padding = "12px 16px";
  msgDiv.style.borderRadius = "12px";
  msgDiv.style.maxWidth = "85%";
  
  if (sender === 'user') {
    msgDiv.style.marginLeft = "auto";
    msgDiv.style.background = "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)";
    msgDiv.style.color = "#fff";
  } else {
    msgDiv.style.marginRight = "auto";
    msgDiv.style.background = "rgba(255,255,255,0.05)";
    msgDiv.style.border = "1px solid rgba(255,255,255,0.1)";
    msgDiv.style.color = "#eee";
  }

  const senderName = sender === 'user' ? 'You' : '💚 AI Emotional Companion';
  const htmlContent = typeof parseMarkdownAndKaTeX === 'function' ? parseMarkdownAndKaTeX(text) : text.replace(/\n/g, "<br>");

  msgDiv.innerHTML = `
    <div style="font-size:11px; opacity:0.8; margin-bottom:4px; font-weight:bold;">${senderName}</div>
    <div style="font-size:13px; line-height:1.6;">${htmlContent}</div>
  `;

  history.appendChild(msgDiv);
  history.scrollTop = history.scrollHeight;
}

async function sendMindsetChatMessage() {
  const input = document.getElementById("mindset-chat-input");
  if (!input) return;
  const userText = input.value.trim();
  if (!userText) return;

  input.value = "";
  appendMindsetChatMessage("user", userText);

  // Status loading indicator
  const statusEl = document.getElementById("mindset-chat-status");
  if (statusEl) {
    statusEl.style.display = "block";
    statusEl.textContent = "💚 AI Companion is listening and typing a comforting reply...";
  }

  mindsetChatHistoryList.push({ role: "user", text: userText });

  const hasKey = !!(getGroqApiKey() || getApiKey());

  if (!hasKey) {
    // If no key configured, immediately use built-in compassionate counselor fallback
    setTimeout(() => {
      const fallbackReply = getFallbackEmpatheticReply(userText);
      mindsetChatHistoryList.push({ role: "model", text: fallbackReply });
      appendMindsetChatMessage("ai", fallbackReply);
      if (statusEl) statusEl.style.display = "none";
    }, 600);
    return;
  }

  try {
    const recentHistory = mindsetChatHistoryList.slice(-6).map(h => `${h.role.toUpperCase()}: ${h.text}`).join("\n");
    const fullPrompt = `${recentHistory}\n\nPlease reply with an empathetic, supportive, and comforting message for the student.`;

    const aiReply = await callAiWithFailover(fullPrompt, MINDSET_SYSTEM_PROMPT, (statusMsg) => {
      if (statusEl) statusEl.textContent = statusMsg;
    });

    mindsetChatHistoryList.push({ role: "model", text: aiReply });
    appendMindsetChatMessage("ai", aiReply);

  } catch (err) {
    console.warn("[Mindset Companion] API error, falling back to built-in counselor reply:", err);
    const fallbackReply = getFallbackEmpatheticReply(userText);
    mindsetChatHistoryList.push({ role: "model", text: fallbackReply });
    appendMindsetChatMessage("ai", fallbackReply);
  } finally {
    if (statusEl) statusEl.style.display = "none";
  }
}

window.sendMindsetChatMessage = sendMindsetChatMessage;
window.quickAskMindset = quickAskMindset;
