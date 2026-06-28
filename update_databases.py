import os
import json

base_dir = "/home/shubhamkumarpatel9911/.gemini/antigravity/scratch/neet-server"

# Load mapping
with open(os.path.join(base_dir, "downloaded_diagrams.json"), "r") as f:
    mapping = json.load(f)

# Load databases
with open(os.path.join(base_dir, "real_yearly_papers.json"), "r") as f:
    yearly = json.load(f)

with open(os.path.join(base_dir, "pyq_bank.json"), "r") as f:
    pyq = json.load(f)

# 1. Update real_yearly_papers.json and build a text-to-image path lookup
text_to_path = {}
diag_counter = 0

years = sorted(list(yearly.keys()), key=int)
for yr in years:
    for idx, q in enumerate(yearly[yr]):
        orig_diag = q.get("diagram", "")
        if orig_diag and orig_diag.strip():
            diag_counter += 1
            key = str(diag_counter)
            if key in mapping:
                img_path = f"images/{mapping[key]}"
                q["diagram"] = img_path
                # Store lookup (first 30 characters for robust matching)
                norm_q = q["q"].strip().lower()[:30]
                text_to_path[norm_q] = img_path
                print(f"[{diag_counter}] Updated Yearly {yr} idx {idx} -> {img_path}")
            else:
                print(f"Warning: No mapping found for diagram counter {diag_counter}")

# 2. Update pyq_bank.json using text lookup matching
pyq_updated = 0
for ch, qlist in pyq.items():
    for q in qlist:
        orig_diag = q.get("diagram", "")
        if orig_diag and orig_diag.strip():
            norm_q = q["q"].strip().lower()[:30]
            if norm_q in text_to_path:
                q["diagram"] = text_to_path[norm_q]
                pyq_updated += 1
            else:
                # Fallback: check full text substring
                matched = False
                for k, path in text_to_path.items():
                    if k in norm_q or norm_q in k:
                        q["diagram"] = path
                        pyq_updated += 1
                        matched = True
                        break
                if not matched:
                    print(f"Warning: No match found for PYQ question in chapter '{ch}': {q['q'][:60]}...")

# 3. Save updated databases
with open(os.path.join(base_dir, "real_yearly_papers.json"), "w") as f:
    json.dump(yearly, f, indent=2)

with open(os.path.join(base_dir, "pyq_bank.json"), "w") as f:
    json.dump(pyq, f, indent=2)

print(f"\nCompleted Database Update:")
print(f"Updated {diag_counter} questions in real_yearly_papers.json")
print(f"Updated {pyq_updated} questions in pyq_bank.json")
