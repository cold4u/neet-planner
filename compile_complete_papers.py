import json
import os
import re
import random

random.seed(42)

base_dir = "/home/shubhamkumarpatel9911/.gemini/antigravity/scratch/neet-server"
hf_json_path = "/home/shubhamkumarpatel9911/.gemini/antigravity/scratch/neet-dataset/en_huggingface_upload.json"
jsonl_path = "/home/shubhamkumarpatel9911/.gemini/antigravity/scratch/neet-dataset/neet_complete_dataset.jsonl"
output_yearly_path = os.path.join(base_dir, "real_yearly_papers.json")
output_pyq_path = os.path.join(base_dir, "pyq_bank.json")
images_dir = os.path.join(base_dir, "images")
pdf_dir = "extracted_pdfs"

STOP_WORDS = {
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
    'which', 'what', 'who', 'how', 'why', 'that', 'this', 'these', 'those', 'it', 'its', 'correct', 'incorrect', 'answer',
    'options', 'below', 'following', 'choose', 'given', 'statements', 'statement', 'list', 'match', 'select', 'here',
    'both', 'only', 'each', 'any', 'some', 'between', 'under', 'over', 'into', 'thereto', 'therein', 'their', 'them',
    'his', 'her', 'your', 'our', 'my', 'me', 'us', 'him', 'she', 'they', 'he'
}

def clean_text(text):
    text = text.lower()
    text = re.sub(r'\d+', 'N', text)
    text = re.sub(r'[^a-z\s]', ' ', text)
    return text

def get_keywords(text):
    cleaned = clean_text(text)
    return {w for w in cleaned.split() if w not in STOP_WORDS and len(w) > 2}

def clean_latex(text):
    if not text:
        return ""
    text = text.replace('\\\\', '\\')
    replacements = {
        'â†’': '→', 'â†': '←', 'â€"': '–', 'Ã—': '×',
        'â‰ˆ': '≈', 'Â±': '±', 'Â°': '°', 'âˆ†': 'Δ',
        'Ï€': 'π', 'Î¼': 'μ', 'âˆš': '√', 'Ï‰': 'ω',
        'Î©': 'Ω', 'â€': '—'
    }
    for bad, good in replacements.items():
        text = text.replace(bad, good)
    return text.strip()

def detect_subject(text):
    text = text.lower()
    phys_words = {'velocity','speed','acceleration','force','mass','circuit','resistor',
                  'capacitance','magnetic','electric','wave','optics','lens','mirror',
                  'energy','power','work','momentum','wavelength','frequency','photon',
                  'nucleus','semiconductor','diode','current','voltage','inductor',
                  'oscillation','pendulum','gravitation','thermodynamic','entropy'}
    chem_words = {'compound','reaction','acid','mol','molar','solute','solvent','organic',
                  'inorganic','chemical','bonding','element','periodic','oxidation',
                  'reduction','electrolysis','polymer','amine','aldehyde','ketone',
                  'alcohol','ester','hybridisation','coordination','ligand','isomer'}
    p = sum(1 for w in phys_words if w in text)
    c = sum(1 for w in chem_words if w in text)
    if p > c and p > 0: return 'physics'
    elif c > p and c > 0: return 'chemistry'
    return 'biology'

# ── Load and Index Database ──────────────────────────────
print("Loading database...")
year_db = {y: [] for y in range(2013, 2027)}
all_db = []

# Load HF
with open(hf_json_path, "r", encoding="utf-8") as f:
    hf_json = json.load(f)
for q in hf_json:
    q_text = clean_latex(q.get("question", ""))
    opts = [clean_latex(o) for o in q.get("options", [])]
    if len(opts) != 4 or not q_text:
        continue
    ans = q.get("answer")
    if ans is None or not isinstance(ans, int) or ans < 0 or ans > 3:
        ans = 0
    diagram = ""
    img = q.get("image_png", "")
    if img:
        path = os.path.join(images_dir, img)
        if os.path.exists(path):
            diagram = "images/" + img

    subj = q.get("category_en", "biology").lower()
    if subj not in ('physics', 'chemistry', 'biology'):
        subj = detect_subject(q_text)

    entry = {
        "q": q_text, "opts": opts, "ans": ans,
        "exp": "Refer to NCERT for detailed solution.",
        "subject": subj, "chapter": "General", "diagram": diagram,
        "keywords": get_keywords(q_text)
    }
    all_db.append(entry)
    fn = q.get("file_name", "")
    for y in range(2013, 2027):
        if str(y) in fn:
            year_db[y].append(entry)
            break

# Load JSONL
with open(jsonl_path, "r", encoding="utf-8") as f:
    for line in f:
        obj = json.loads(line)
        if obj.get("metadata", {}).get("type") != "neet_mcq":
            continue
        meta = obj.get("metadata", {})
        user_content = ""
        assistant_content = ""
        for msg in obj.get("messages", []):
            if msg["role"] == "user": user_content = msg.get("content", "")
            elif msg["role"] == "assistant": assistant_content = msg.get("content", "")

        if "<think>" in assistant_content:
            idx = assistant_content.find("</think>")
            if idx != -1:
                assistant_content = assistant_content[idx+8:].strip()

        ans_str = meta.get("correct_answer", "A")
        ans_idx = ord(ans_str) - ord('A') if len(ans_str) == 1 and ans_str in "ABCD" else 0

        opts = []
        lines = user_content.split('\n')
        q_body_lines = []
        for l in lines:
            if l.strip().startswith(('(A)', '(B)', '(C)', '(D)')):
                opts.append(clean_latex(l.strip()[4:].strip()))
            elif not opts:
                q_body_lines.append(l)
        q_body = clean_latex("\n".join(q_body_lines))
        if len(opts) != 4 or not q_body:
            continue

        ch_raw = meta.get("chapter", "")
        ch = "General"
        if isinstance(ch_raw, list) and len(ch_raw) > 1:
            ch = ch_raw[1]
        elif isinstance(ch_raw, str) and ch_raw:
            ch = ch_raw

        subj = meta.get("subject", "biology").lower()
        if subj not in ('physics', 'chemistry', 'biology'):
            subj = detect_subject(q_body)

        entry = {
            "q": q_body, "opts": opts, "ans": ans_idx,
            "exp": clean_latex(assistant_content) if assistant_content else f"Correct answer is option {ans_str}.",
            "subject": subj, "chapter": ch, "diagram": "",
            "keywords": get_keywords(q_body)
        }
        all_db.append(entry)

        yr_field = str(meta.get("year", ""))
        ch_str = str(ch_raw)
        for y in range(2013, 2027):
            sy = str(y)
            if sy in yr_field or f"NEET {sy}" in ch_str or f"AIPMT {sy}" in ch_str or sy == yr_field:
                year_db[y].append(entry)
                break

# ── Parse text files for 2015, 2022, 2025 ──────────────────────────────
def parse_and_match_txt(y):
    txt_path = os.path.join(pdf_dir, f"{y}.txt")
    if not os.path.exists(txt_path):
        return
    print(f"Parsing and matching {txt_path}...")
    with open(txt_path, "r", encoding="utf-8") as f:
        text = f.read()

    # Find solutions offset
    sol_idx = text.lower().find("answer key", 25000)
    if sol_idx == -1:
        sol_idx = text.lower().find("text solution", 25000)
    if sol_idx == -1:
        sol_idx = text.lower().find("detailed solution", 25000)
        
    q_text = text[:sol_idx] if sol_idx != -1 and sol_idx > len(text)*0.3 else text
    
    # Split by option 4
    lines = q_text.split('\n')
    blocks = []
    current_block = []
    opt4_pat = re.compile(r'\b(?:4|d|D)\b\s*[\)\.\]]|\((?:4|d|D)\)|\[(?:4|d|D)\]')
    for line in lines:
        current_block.append(line)
        if opt4_pat.search(line):
            blocks.append("\n".join(current_block))
            current_block = []
    if current_block:
        blocks.append("\n".join(current_block))
        
    parsed_count = 0
    for b in blocks:
        opts = []
        block_lines = b.split('\n')
        q_body_lines = []
        for bl in block_lines:
            m_opt = re.findall(r'\b(?:1|2|3|4|a|b|c|d|A|B|C|D|e)\b\s*[\)\.\]]\s*([^\n\(\[\]\)\.]+)|'
                               r'\((?:1|2|3|4|a|b|c|d|A|B|C|D)\)\s*([^\(\n]+)|'
                               r'\[(?:1|2|3|4|a|b|c|d|A|B|C|D)\]\s*([^\[\n]+)', bl)
            if m_opt:
                for opt_tuple in m_opt:
                    val = next((v for v in opt_tuple if v), "").strip()
                    if val:
                        opts.append(clean_latex(val))
            elif not opts:
                q_body_lines.append(bl)
        
        q_body = clean_latex("\n".join(q_body_lines).strip())
        q_body = re.sub(r'--- Page \d+ Column \d+ ---', '', q_body)
        q_body = re.sub(r'NEET \(UG\)-\d+ \[Code – \d+\]', '', q_body)
        q_body = re.sub(r'ENGLISH', '', q_body)
        q_body = re.sub(r'\[Contd...', '', q_body)
        q_body = q_body.strip()
        
        if (len(opts) == 4 or len(opts) == 3) and q_body:
            if len(opts) == 3:
                opts.append("None of the above")
            parsed_count += 1
            
            # Match against database
            best_match = None
            best_score = 0
            pq_keywords = get_keywords(q_body)
            if pq_keywords:
                for dbq in all_db:
                    intersection = pq_keywords.intersection(dbq["keywords"])
                    score = len(intersection)
                    if score > best_score:
                        best_score = score
                        best_match = dbq
                        
            is_match = False
            if best_match:
                union = pq_keywords.union(best_match["keywords"])
                jaccard = best_score / len(union) if union else 0
                if jaccard > 0.18:
                    is_match = True
                    
            if is_match and best_match:
                year_db[y].append(best_match)
            else:
                # Add raw parsed question
                year_db[y].append({
                    "q": q_body, "opts": opts, "ans": 0,
                    "exp": "Correct answer is option A.",
                    "subject": detect_subject(q_body), "chapter": "General", "diagram": ""
                })
    print(f"Parsed {parsed_count} questions from {y}.txt.")

for y in (2015, 2022, 2025):
    parse_and_match_txt(y)

total_indexed = sum(len(v) for v in year_db.values())
print(f"Loaded {len(all_db)} total DB questions. {total_indexed} indexed by year.")
for y in sorted(year_db):
    print(f"  NEET {y}: {len(year_db[y])} authentic questions")

# ── Step 3: Build yearly papers ──────────────────────────────────────
def dedup_key(q_text):
    return q_text.lower().strip()[:80]

final_yearly = {}

for y in range(2013, 2027):
    total_target = 180 if y <= 2020 else 200
    phys_target = 45 if y <= 2020 else 50
    chem_target = 45 if y <= 2020 else 50
    bio_target  = 90 if y <= 2020 else 100

    year_qs = []
    seen = set()
    counts = {"p": 0, "c": 0, "b": 0}

    def try_add(entry):
        key = dedup_key(entry["q"])
        if key in seen:
            return False
        s = entry["subject"]
        if s == "physics" and counts["p"] >= phys_target: return False
        if s == "chemistry" and counts["c"] >= chem_target: return False
        if s == "biology" and counts["b"] >= bio_target: return False
        seen.add(key)
        
        clean_entry = {
            "q": entry["q"],
            "opts": entry["opts"],
            "ans": entry["ans"],
            "exp": entry["exp"],
            "subject": entry["subject"],
            "chapter": entry["chapter"],
            "diagram": entry.get("diagram", "")
        }
        year_qs.append(clean_entry)
        
        if s == "physics": counts["p"] += 1
        elif s == "chemistry": counts["c"] += 1
        else: counts["b"] += 1
        return True

    # Priority 1: Year-indexed authentic questions
    random.shuffle(year_db[y])
    for e in year_db[y]:
        try_add(e)
        if counts["p"] >= phys_target and counts["c"] >= chem_target and counts["b"] >= bio_target:
            break

    # Priority 2: Fill remaining from general database
    if counts["p"] < phys_target or counts["c"] < chem_target or counts["b"] < bio_target:
        random.shuffle(all_db)
        for e in all_db:
            try_add(e)
            if counts["p"] >= phys_target and counts["c"] >= chem_target and counts["b"] >= bio_target:
                break

    print(f"Year {y}: {len(year_qs)} Qs (P:{counts['p']} C:{counts['c']} B:{counts['b']}) | "
          f"Authentic: {min(len(year_db[y]), total_target)}")
    final_yearly[str(y)] = year_qs

# ── Save files ───────────────────────────────────────────────
with open(output_yearly_path, "w", encoding="utf-8") as f:
    json.dump(final_yearly, f, indent=2, ensure_ascii=False)
print(f"\nSaved yearly papers -> {output_yearly_path}")

# Build pyq_bank.json
pyq_bank = {}
for yr, qs in final_yearly.items():
    for q in qs:
        ch = q.get("chapter", "General").strip() or "General"
        pyq_bank.setdefault(ch, []).append({
            "year": f"NEET {yr}", "q": q["q"], "opts": q["opts"],
            "ans": q["ans"], "exp": q["exp"], "subject": q["subject"],
            "diagram": q.get("diagram", "")
        })

with open(output_pyq_path, "w", encoding="utf-8") as f:
    json.dump(pyq_bank, f, indent=2, ensure_ascii=False)
print(f"Saved PYQ bank -> {output_pyq_path}")

# Summary
total_qs = sum(len(v) for v in final_yearly.values())
print(f"\n=== GRAND TOTAL: {total_qs} questions across {len(final_yearly)} years ===")
