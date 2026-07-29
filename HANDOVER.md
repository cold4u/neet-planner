# 🤝 PROJECT HANDOVER REPORT: NEET UG 309-Day Master Planner & AI Exam Suite

**Date**: July 29, 2026  
**Target Agent**: Claude CLI / Anthropic Agent  
**Live Site**: [https://cold4u.github.io/neet-planner/](https://cold4u.github.io/neet-planner/)  
**Git Remote**: `https://github.com/cold4u/neet-planner.git` (Pre-authenticated in local git remote)

---

## 1. Project Background & Vision
The **NEET UG 309-Day Master Planner & AI Exam Suite** is a full-featured, single-page web application (SPA) built for NEET aspirants. It includes a structured 309-day preparation schedule, NTA CBT mock exam simulator, PDF-to-Direct-CBT question extractor, open AI doubt solver, error book tracker, flashcards, formula bank, and an emotional support companion.

---

## 2. Core Modules & Files

1. **`index.html`** (UI Markup & Layout):
   - Sidebar navigation & mobile drawer menu.
   - Tab sections: `overview`, `calendar`, `timing`, `chapters`, `tests`, `strategy`, `tracker`, `study-timer`, `analytics`, `ai-tutor`, `ai-research`, `ai-mocktest`, `pdf-to-test`, `neet-news`, `settings`, `errorbook`, `flashcards`, `emotional-support`, `studyhub`, `formulas`.
   - *Note*: Legacy `💛 Support` (donation card) section has been completely removed as requested by user.

2. **`style.css`** (Design System & Styling):
   - Modern glassmorphic theme with CSS variables (`--primary`, `--bg-dark`, `--glass-border`, etc.).
   - Micro-animations, responsive flex/grid cards, progress bars, and modal overlays.

3. **`app.js`** (Core Logic & Data Management):
   - Handles target tracking, daily milestone calculations, LocalStorage persistence (`neet_planner_data_v1`), chart rendering, error book entries, flashcards review algorithm, and formula search filters.

4. **`ai-features.js`** (AI Suite & API Integrations):
   - Integrated with **Google Gemini API** (Primary) & **Groq Cloud API** (Llama-3.3 70B Backup).
   - Features:
     - `callGeminiAPI` & `callGroqAPI`: API fetchers with model fallback rings, cooldown management, and token tracking.
     - `robustParseJSON`: Progressive truncation repair parser that salvages partial JSON objects when output token limits cut off responses.
     - `handlePdfDrop`: Extracts text from PDF files and converts up to 50 questions into live CBT tests.
     - `sendMindsetChatMessage`: 24/7 AI Emotional Companion with 7-second timeout race condition to a built-in counselor engine.
     - `sendTutorMessage`: AI Doubt Solver with open scope.

5. **`bundle.py`** (Production Bundler):
   - Inlines `style.css`, `app.js`, `ai-features.js`, and `pyq_bank.json` into `neet_plan_v3.html`.
   - Automatically deployed to root and home directory for GitHub Pages.

---

## 3. Recent Technical Enhancements & Fixes
- **PDF-to-Direct-CBT Generator**:
  - Direct launch into CBT test engine without intermediate text steps.
  - Increased token capacity to 8192 with compact JSON formatting (`q`, `o`, `c`, `e`, `s`) and `jsonMode: true` to support up to 50 questions per PDF.
  - Upgraded `robustParseJSON` to handle root arrays `[...]` and object wrappers `{"questions": [...]}` seamlessly.
- **AI Tutor (Doubt Solver)**:
  - Removed strict NEET scope restriction (`STRICT_NEET_SCOPE_PROMPT`). AI Tutor now answers any question/doubt.
- **AI Emotional & Mindset Companion**:
  - Handed over to **Google Gemini API (100% Primary Priority)** with **Groq AI Failover**.
  - Implemented 7-second timeout race condition and built-in counselor fallback to prevent hanging.
- **Formula & Symbol Formatting**:
  - Chemical and physical formulas use plain unicode or KaTeX rendering (e.g. `F = m × a`, `C₆H₁₂O₆`, `m/s²`).

---

## 4. Standard Developer Commands for Claude

```bash
# Check git status and current branch
git status

# Build production bundle
python3 bundle.py

# Verify JavaScript bundle syntax
python3 -c '
import subprocess, re
with open("neet_plan_v3.html", "r") as f: html = f.read()
for i, s in enumerate(re.findall(r"<script>(.*?)</script>", html, re.DOTALL)):
    with open(f"/tmp/s_{i}.js", "w") as sf: sf.write(s)
    res = subprocess.run(["node", "--check", f"/tmp/s_{i}.js"], capture_output=True, text=True)
    if res.returncode != 0: print(f"ERROR in script {i}:", res.stderr)
'

# Push updates to GitHub Pages
git add .
git commit -m "Commit description"
git push origin main
```

---

## 5. Next Steps & Summary
The project is fully stable, clean, and tested. Claude can immediately execute commands, modify files, run `bundle.py`, and push changes to GitHub Pages.
