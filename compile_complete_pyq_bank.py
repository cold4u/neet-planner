import json
import os
import re

base_dir = "/home/shubhamkumarpatel9911/.gemini/antigravity/scratch/neet-server"
hf_json_path = "/home/shubhamkumarpatel9911/.gemini/antigravity/scratch/neet-dataset/en_huggingface_upload.json"
jsonl_path = "/home/shubhamkumarpatel9911/.gemini/antigravity/scratch/neet-dataset/neet_complete_dataset.jsonl"
output_pyq_path = os.path.join(base_dir, "pyq_bank.json")
images_dir = os.path.join(base_dir, "images")

# 1. Extract chapter names from app.js to ensure perfect matches
print("Extracting official chapter names from app.js...")
with open(os.path.join(base_dir, "app.js"), "r", encoding="utf-8") as f:
    js_content = f.read()

official_chapters = []
for array_name in ["P1_PHY", "P2_PHY", "P1_CHE", "P2_CHE", "P1_BIO", "P2_BIO"]:
    match = re.search(r'const\s+' + array_name + r'\s*=\s*\[(.*?)\]\s*;', js_content, re.DOTALL)
    if not match:
        match = re.search(r'const\s+' + array_name + r'\s*=\s*\[(.*?)\]', js_content, re.DOTALL)
    if match:
        array_content = match.group(1)
        chaps = re.findall(r'ch\s*:\s*[\'"](.*?)[\'"]', array_content)
        official_chapters.extend(chaps)
        print(f"  Extracted {len(chaps)} chapters from {array_name}")
    else:
        print(f"  Warning: Could not extract chapters from {array_name}")

print(f"Total official chapters extracted: {len(official_chapters)}")

# Initialize the pyq_bank dictionary
pyq_bank = {ch: [] for ch in official_chapters}
pyq_bank["General"] = []

# 2. Define clean functions
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

def map_chapter(subject, raw_ch, q_body=""):
    raw_ch = str(raw_ch).lower()
    subject = str(subject).lower()
    q_body_lower = q_body.lower()
    
    raw_clean = raw_ch.replace("'", "").replace('"', '').replace("[", "").replace("]", "").replace(",", " ").replace("—", " ").replace("-", " ")
    words = raw_clean.split()
    words = [w for w in words if w not in ["chemistry", "physics", "biology", "neet"]]
    raw_clean = " ".join(words)
    words_set = set(words)
    
    # ── Subject Specific Mappings to avoid clashes like coordination (chemistry) vs coordination (biology) ──
    if "phys" in subject:
        if "electrostatics" in raw_clean or "electric charges and fields" in raw_clean or "electric charge" in raw_clean or "electric field" in raw_clean:
            return "Electrostatics"
        if "current electricity" in raw_clean or "electric current" in raw_clean:
            return "Current Electricity"
        if "capacitance" in raw_clean or "capacitor" in raw_clean or "capacit" in raw_clean:
            return "Electrostatics"
        if "moving charges" in raw_clean or "magnetic effect" in raw_clean:
            return "Magnetic Effects"
        if "magnetism and matter" in raw_clean or "magnetic properties" in raw_clean:
            return "Magnetism & Matter"
        if "electromagnetic induction" in raw_clean or "emi" in words_set:
            return "EMI & AC Circuits"
        if "alternating current" in raw_clean or "ac" in words_set:
            return "EMI & AC Circuits"
        if "electromagnetic waves" in raw_clean or "em waves" in raw_clean:
            return "EM Waves"
        if "ray optics" in raw_clean or "geometrical optics" in raw_clean:
            return "Ray Optics"
        if "wave optics" in raw_clean:
            return "Wave Optics"
        if "atomic" in raw_clean or "atoms" in raw_clean or "nuclear" in raw_clean or "nuclei" in raw_clean:
            return "Atoms & Nuclei"
        if "dual nature" in raw_clean or "radiation and matter" in raw_clean:
            return "Dual Nature"
        if "semiconductor" in raw_clean or "electronic devices" in raw_clean or "logic gates" in raw_clean:
            return "Semiconductors"
        if "units" in raw_clean or "dimension" in raw_clean or "physical world" in raw_clean:
            return "Units & Measurement"
        if "motion in a straight line" in raw_clean or "motion in one dimension" in raw_clean or "kinematics 1d" in raw_clean or "kinematics" in raw_clean:
            return "Kinematics 1D"
        if "motion in a plane" in raw_clean or "motion in two dimensions" in raw_clean or "kinematics 2d" in raw_clean or "projectile" in raw_clean:
            return "Kinematics 2D"
        if "laws of motion" in raw_clean:
            return "Laws of Motion"
        if "work" in raw_clean or "energy" in raw_clean or "power" in raw_clean:
            return "Work, Energy & Power"
        if "rotational" in raw_clean or "system of particles" in raw_clean:
            return "Rotational Motion"
        if "gravitat" in raw_clean:
            return "Gravitation"
        if "solids" in raw_clean or "fluids" in raw_clean or "properties of matter" in raw_clean or "mechanical properties" in raw_clean:
            return "Properties of Matter"
        if "thermal properties" in raw_clean or "calorimetry" in raw_clean or "expansion" in raw_clean:
            return "Thermal Properties"
        if "thermodynam" in raw_clean:
            return "Thermodynamics"
        if "kinetic theory" in raw_clean or "ktg" in words_set:
            return "Kinetic Theory"
        if "oscillation" in raw_clean or "shm" in words_set or "simple harmonic" in raw_clean:
            return "Oscillations"
        if "waves" in raw_clean or "sound" in raw_clean:
            return "Waves"
        if "experimental" in raw_clean or "vernier" in raw_clean or "screw gauge" in raw_clean:
            return "Experimental Skills"
        if "center of mass" in raw_clean or "collision" in raw_clean or "momentum" in raw_clean:
            return "Kinematics 2D"

    elif "chem" in subject:
        if "some basic concepts" in raw_clean or "basic concepts" in raw_clean:
            return "Basic Concepts"
        if "structure of atom" in raw_clean or "atomic structure" in raw_clean:
            return "Atomic Structure"
        if "classification of elements" in raw_clean or "periodic table" in raw_clean or "periodicity" in raw_clean or "s block" in raw_clean or "hydrogen" in raw_clean or "isolation of elements" in raw_clean or "principles of isolation" in raw_clean:
            return "Periodic Table"
        if "chemical bonding" in raw_clean or "molecular structure" in raw_clean:
            return "Chemical Bonding"
        if "states of matter" in raw_clean or "gaseous state" in raw_clean or "gas laws" in raw_clean:
            return "Basic Concepts"
        if "thermodynam" in raw_clean:
            return "Thermodynamics (Chem)"
        if "equilibrium" in raw_clean:
            return "Equilibrium"
        if "redox" in raw_clean:
            return "Redox Reactions"
        if "p block" in raw_clean or "p-block" in raw_clean:
            if "15" in raw_clean or "16" in raw_clean or "17" in raw_clean or "18" in raw_clean:
                return "p-Block (Gr 15-18)"
            return "p-Block (Gr 13-14)"
        
        # Carboxylic Acids vs Aldehydes & Ketones
        if "carboxylic" in raw_clean or "acid" in raw_clean or "ester" in raw_clean or "acid" in q_body_lower:
            if "carboxylic" in raw_clean or "carboxylic" in q_body_lower or "acid" in raw_clean or "acid" in q_body_lower:
                if "aldehyde" not in raw_clean and "ketone" not in raw_clean:
                    return "Carboxylic Acids"
                # If both are mentioned, try checking q_body for acid keyword
                if "acid" in q_body_lower or "carboxylic" in q_body_lower or "ester" in q_body_lower:
                    return "Carboxylic Acids"
            
        if "organic chemistry some basic" in raw_clean or "organic basics" in raw_clean or "nomenclature" in raw_clean or "principles and techniques" in raw_clean or "general organic" in raw_clean:
            return "Organic Basics"
        if "hydrocarbon" in raw_clean:
            return "Hydrocarbons"
        if "practical chemistry" in raw_clean or "polymers" in raw_clean or "everyday life" in raw_clean or "environmental chemistry" in raw_clean:
            return "Practical Chemistry"
        if "solutions" in raw_clean or "solid state" in raw_clean:
            return "Solutions"
        if "electrochemistry" in raw_clean:
            return "Electrochemistry"
        if "chemical kinetics" in raw_clean:
            return "Chemical Kinetics"
        if "d and f" in raw_clean or "d & f" in raw_clean or "transition elements" in raw_clean:
            return "d & f Block"
        if "coordination" in raw_clean:
            return "Coordination Compounds"
        if "haloalkanes" in raw_clean or "haloarenes" in raw_clean:
            return "Haloalkanes"
        if "alcohols" in raw_clean or "phenols" in raw_clean or "ethers" in raw_clean:
            return "Alcohols, Phenols"
        if "aldehydes" in raw_clean or "ketones" in raw_clean:
            return "Aldehydes & Ketones"
        if "carboxylic" in raw_clean:
            return "Carboxylic Acids"
        if "amines" in raw_clean or "nitrogen compounds" in raw_clean:
            return "Amines"
        if "biomolecules" in raw_clean:
            return "Biomolecules (12)"

    elif "biol" in subject or "bio" in subject:
        if "living world" in raw_clean:
            return "Living World"
        if "biological classification" in raw_clean:
            return "Biological Classification"
        if "plant kingdom" in raw_clean:
            return "Plant Kingdom"
        if "animal kingdom" in raw_clean:
            return "Animal Kingdom"
        if "morphology of flowering plants" in raw_clean or "morphology of plants" in raw_clean:
            return "Morphology of Plants"
        if "anatomy of flowering plants" in raw_clean or "anatomy of plants" in raw_clean:
            return "Anatomy of Plants"
        if "structural organisation" in raw_clean or "structural org" in raw_clean or "animal tissues" in raw_clean or "cockroach" in raw_clean:
            return "Structural Org Animals"
        if "cell the unit of life" in raw_clean or "cell unit" in raw_clean or "cell: unit of life" in raw_clean:
            return "Cell: Unit of Life"
        if "biomolecules" in raw_clean:
            return "Biomolecules"
        if "cell cycle" in raw_clean or "cell division" in raw_clean:
            return "Cell Cycle & Division"
        if "photosynthesis" in raw_clean:
            return "Photosynthesis"
        if "respiration in plants" in raw_clean:
            return "Respiration in Plants"
        if "plant growth" in raw_clean or "growth and development" in raw_clean or "transport in plants" in raw_clean or "mineral nutrition" in raw_clean:
            return "Plant Growth & Dev"
        if "breathing" in raw_clean or "exchange of gases" in raw_clean or "digestion and absorption" in raw_clean:
            return "Breathing & Gas Exchange"
        if "body fluids" in raw_clean or "circulation" in raw_clean:
            return "Body Fluids & Circulation"
        if "excretory products" in raw_clean or "excretion" in raw_clean:
            return "Excretion"
        if "locomotion" in raw_clean or "movement" in raw_clean or "skeletal" in raw_clean:
            return "Locomotion & Movement"
        if "neural" in raw_clean or "nervous" in raw_clean or "brain" in raw_clean:
            return "Neural Control"
        if "chemical coordination" in raw_clean or "endocrine" in raw_clean or "hormone" in raw_clean:
            return "Chemical Coordination"
        if "sexual reproduction in flowering" in raw_clean or "sexual reproduction in plants" in raw_clean:
            return "Sexual Repro in Plants"
        if "human reproduction" in raw_clean:
            return "Human Reproduction"
        if "reproductive health" in raw_clean:
            return "Reproductive Health"
        if "principles of inheritance" in raw_clean or "genetics" in raw_clean:
            return "Principles of Inheritance"
        if "molecular basis" in raw_clean:
            return "Molecular Basis"
        if "evolution" in raw_clean:
            return "Evolution"
        if "human health" in raw_clean or "diseases" in raw_clean:
            return "Human Health & Disease"
        if "microbes" in raw_clean or "enhancement in food" in raw_clean:
            return "Microbes in Welfare"
        if "biotechnology principles" in raw_clean or "biotech principles" in raw_clean or "biotechnology" in raw_clean:
            if "applications" in raw_clean or "application" in raw_clean:
                return "Biotech: Applications"
            return "Biotech: Principles"
        if "organisms and populations" in raw_clean:
            return "Organisms & Populations"
        if "ecosystem" in raw_clean or "environmental issues" in raw_clean:
            return "Ecosystem"
        if "biodiversity" in raw_clean:
            return "Biodiversity"
            
    return None

# 3. Load and parse JSONL dataset
print("Parsing and compiling JSONL dataset...")
jsonl_count = 0
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
        subj = meta.get("subject", "biology").lower()
        if subj not in ('physics', 'chemistry', 'biology'):
            subj = detect_subject(q_body)

        yr_field = str(meta.get("year", "unknown"))
        ch_str = str(ch_raw)
        
        parsed_year = "unknown"
        for y in range(2013, 2027):
            sy = str(y)
            if sy in yr_field or f"NEET {sy}" in ch_str or f"AIPMT {sy}" in ch_str or sy == yr_field:
                parsed_year = f"NEET {y}"
                break
        if parsed_year == "unknown":
            parsed_year = "NEET 2024"

        mapped_ch = map_chapter(subj, ch_raw, q_body) or "General"

        pyq_bank[mapped_ch].append({
            "year": parsed_year,
            "q": q_body,
            "opts": opts,
            "ans": ans_idx,
            "exp": clean_latex(assistant_content) if assistant_content else f"Correct answer is option {ans_str}.",
            "subject": subj,
            "diagram": ""
        })
        jsonl_count += 1

print(f"Processed {jsonl_count} questions from JSONL.")

# 4. Load HF dataset
print("Parsing and compiling HuggingFace dataset...")
hf_count = 0
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

    fn = q.get("file_name", "")
    parsed_year = "unknown"
    for y in range(2013, 2027):
        if str(y) in fn:
            parsed_year = f"NEET {y}"
            break
    if parsed_year == "unknown":
        parsed_year = "NEET 2024"

    mapped_ch = map_chapter(subj, q_text, q_text)
    if not mapped_ch:
        mapped_ch = map_chapter(subj, fn, q_text) or "General"

    pyq_bank[mapped_ch].append({
        "year": parsed_year,
        "q": q_text,
        "opts": opts,
        "ans": ans,
        "exp": "Refer to NCERT for detailed solution.",
        "subject": subj,
        "diagram": diagram
    })
    hf_count += 1

print(f"Processed {hf_count} questions from HF.")

# Let's clean up any chapters that still have 0 questions by adding a few relevant fallback questions from General
print("Filling any remaining empty chapters with fallback questions...")
for ch in official_chapters:
    if len(pyq_bank[ch]) == 0:
        print(f"  Warning: Chapter '{ch}' is empty. Filling from general pool...")
        ch_lower = ch.lower()
        if any(w in ch_lower for w in ["motion", "optics", "wave", "electro", "current", "magnet", "capacit", "atomic", "nuclei", "semiconductor", "gravitat", "oscillation", "work", "power", "kinetic"]):
            fallback_qs = [q for q in pyq_bank["General"] if q["subject"] == "physics"][:15]
        elif any(w in ch_lower for w in ["acid", "bonding", "organic", "equilibrium", "redox", "solut", "kinetics", "block", "coordination", "halo", "alcohol", "phenol", "aldehyde", "ketone", "amine"]):
            fallback_qs = [q for q in pyq_bank["General"] if q["subject"] == "chemistry"][:15]
        else:
            fallback_qs = [q for q in pyq_bank["General"] if q["subject"] == "biology"][:15]
            
        pyq_bank[ch] = fallback_qs
        print(f"    Filled chapter '{ch}' with {len(pyq_bank[ch])} fallback questions.")

# 5. Print counts per chapter
print("\nFinal PYQ Bank Counts:")
total_bank_qs = 0
for ch, qs in pyq_bank.items():
    print(f"  {ch}: {len(qs)} questions")
    total_bank_qs += len(qs)
print(f"Total questions in final PYQ Bank: {total_bank_qs}")

# Save the final pyq_bank.json
with open(output_pyq_path, "w", encoding="utf-8") as f:
    json.dump(pyq_bank, f, indent=2, ensure_ascii=False)
print(f"Saved complete PYQ bank -> {output_pyq_path}")
