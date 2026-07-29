# CLAUDE.md - NEET Planner Project Instructions & Context

Welcome, Claude! This file provides essential guidelines, architecture details, build workflows, and project status for **NEET UG 309-Day Master Planner & AI Exam Suite**.

---

## 🚀 Live Site & Repository Details
* **Live Web App**: [https://cold4u.github.io/neet-planner/](https://cold4u.github.io/neet-planner/)
* **Git Repository**: `https://github.com/cold4u/neet-planner.git`
* **Default Branch**: `main`
* **Git Authentication**: Configured in local git remote configuration.

---

## 🛠️ Build & Deployment Instructions (CRITICAL)

The project uses a modular development structure (`index.html`, `style.css`, `app.js`, `ai-features.js`) which is compiled into a single-file production bundle `neet_plan_v3.html` for GitHub Pages.

**Whenever you make edits to `index.html`, `style.css`, `app.js`, or `ai-features.js`, ALWAYS run:**

```bash
# 1. Re-bundle production file
python3 bundle.py

# 2. Verify JS syntax (must output zero errors)
python3 -c '
import subprocess, re
with open("neet_plan_v3.html", "r") as f: html = f.read()
for i, s in enumerate(re.findall(r"<script>(.*?)</script>", html, re.DOTALL)):
    with open(f"/tmp/s_{i}.js", "w") as sf: sf.write(s)
    res = subprocess.run(["node", "--check", f"/tmp/s_{i}.js"], capture_output=True, text=True)
    if res.returncode != 0: print(f"ERROR in script {i}:", res.stderr)
'

# 3. Commit and Push to GitHub Pages
git add .
git commit -m "Description of changes"
git push origin main
```

---

## 📁 Key File Structure & Architecture

| File Path | Description |
| :--- | :--- |
| `index.html` | Core HTML5 layout, sidebar navigation, tab containers, modals, and drawers. |
| `style.css` | Glassmorphic UI design system, CSS variables, dark mode styling, animation rules. |
| `app.js` | Core application engine: 309-day schedule, LocalStorage state, progress charts, error book, flashcards, study timer, formula book. |
| `ai-features.js` | AI Suite engine (Gemini API 100% Primary + Groq Llama-3.3 70B Backup). |
| `pyq_bank.json` | Complete NTA NEET Past Year Questions bank with embedded base64/SVG diagrams. |
| `bundle.py` | Python build script that inlines CSS, JS, and JSON into `neet_plan_v3.html`. |
| `neet_plan_v3.html` | Bundled single-file production app deployed to GitHub Pages. |

---

## 🧠 AI Features Architecture (`ai-features.js`)

1. **AI Primary vs Failover Hierarchy**:
   * **Primary Engine**: Google Gemini API (`gemini-2.0-flash`, `gemini-1.5-flash`, etc.) — **100% Primary Priority**.
   * **Failover Backup**: Groq Cloud API (`llama-3.3-70b-versatile`).
2. **AI Tutor (Doubt Solver)**:
   * **Open Scope**: Users can ask ANY doubt across Physics, Chemistry, Biology, math, or general concepts. Do NOT reinstate strict scope boundary limits.
3. **PDF to Direct CBT Test Generator**:
   * Extracts up to **50 MCQs** from uploaded PDFs directly into live CBT Mock Exams.
   * Uses ultra-compact JSON schema (`q`, `o`, `c`, `e`, `s`) with native `jsonMode: true`.
   * Powered by `robustParseJSON`: Progressive truncation salvage algorithm that recovers all completed questions even if cut off by output token limits.
4. **24/7 AI Emotional & Mindset Companion**:
   * Dedicated counseling chatbot in `#emotional-support` section.
   * Uses Gemini API (100% Primary) + Groq Backup + 7-second timeout race to a **Built-in Counselor Engine** so it NEVER hangs or crashes.
5. **Formatting Rules**:
   * Always format chemical and physical formulas using plain readable symbols or KaTeX (e.g. `F = m × a`, `C₆H₁₂O₆`, `9.8 m/s²`). Never leave raw LaTeX math syntax like `\rightarrow` or `\*` unrendered.

---

## 📋 Coding & Behavioral Directives

1. **Documentation & Integrity**: Preserve existing comments, docstrings, and LocalStorage keys (`neet_planner_data_v1`).
2. **No Symptom Masking**: Trace underlying causes before modifying JSON parsing or API fallback logic.
3. **Verification**: Always run `python3 bundle.py` and `node --check` before declaring victory.
4. **Git Operations**: Always push changes to `origin main` to keep GitHub Pages updated.
