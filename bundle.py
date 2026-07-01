import os
import json
import re
import base64

base_dir = "/home/shubhamkumarpatel9911/.gemini/antigravity/scratch/neet-server"
output_path_home = "/home/shubhamkumarpatel9911/neet_plan_v3.html"
output_path_local = os.path.join(base_dir, "neet_plan_v3.html")

print("Starting bundling process...")

# 1. Read files
with open(os.path.join(base_dir, "style.css"), "r", encoding="utf-8") as f:
    css_content = f.read()

with open(os.path.join(base_dir, "app.js"), "r", encoding="utf-8") as f:
    js_content = f.read()

with open(os.path.join(base_dir, "pyq_bank.json"), "r", encoding="utf-8") as f:
    pyq_bank_data = json.load(f)

yearly_papers_data = {}

with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
    html_content = f.read()

# Helper function to inline diagrams
def inline_diagrams(data, base_dir):
    if isinstance(data, dict):
        for k, v in data.items():
            if isinstance(v, (dict, list)):
                inline_diagrams(v, base_dir)
    elif isinstance(data, list):
        for item in data:
            if isinstance(item, dict):
                diag = item.get("diagram", "")
                if diag and diag.startswith("images/"):
                    file_path = os.path.join(base_dir, diag)
                    if os.path.exists(file_path):
                        _, ext = os.path.splitext(file_path)
                        ext = ext.lower()
                        if ext == ".svg":
                            with open(file_path, "r", encoding="utf-8") as img_f:
                                svg_content = img_f.read().strip()
                            if svg_content.startswith("<?xml"):
                                idx = svg_content.find(">")
                                if idx != -1:
                                    svg_content = svg_content[idx+1:].strip()
                            item["diagram"] = svg_content
                        elif ext in (".png", ".jpg", ".jpeg", ".webp"):
                            with open(file_path, "rb") as img_f:
                                binary_data = img_f.read()
                            base64_data = base64.b64encode(binary_data).decode("utf-8")
                            mime_type = "image/png" if ext == ".png" else "image/jpeg"
                            item["diagram"] = f"data:{mime_type};base64,{base64_data}"
                        print(f"Inlined diagram image: {diag}")
                    else:
                        print(f"Warning: local diagram file not found: {file_path}")
            elif isinstance(item, (dict, list)):
                inline_diagrams(item, base_dir)

# Inline the diagrams into the database objects
print("Inlining diagrams into PYQ Bank...")
inline_diagrams(pyq_bank_data, base_dir)

# 2. Inline databases in JS content
inlined_databases_js = f"""
    PYQ_BANK = {json.dumps(pyq_bank_data, ensure_ascii=False)};
    REAL_YEARLY_PAPERS = {{}};
    console.log('Successfully loaded inlined PYQ database.');
"""

# Replace the Promise.all fetch block in app.js
fetch_block_start = "    // Asynchronously fetch databases for faster page load"
fetch_block_end = "      });"

start_idx = js_content.find(fetch_block_start)
if start_idx != -1:
    end_idx = js_content.find(fetch_block_end, start_idx)
    if end_idx != -1:
        end_idx += len(fetch_block_end)
        js_content = js_content[:start_idx] + inlined_databases_js + js_content[end_idx:]
        print("Successfully replaced fetch block with inlined databases in JS.")
    else:
        print("Warning: Could not find fetch block end in JS.")
else:
    print("Warning: Could not find fetch block start in JS.")

# 3. Inline CSS in HTML content
html_content = re.sub(r'<link rel="stylesheet" href="style\.css[^"]*">', f"<style>\n{css_content}\n</style>", html_content)
print("Successfully inlined CSS.")

# 4. Inline JS in HTML content
html_content = re.sub(r'<script defer src="app.js[^"]*"></script>', f"<script>\n{js_content}\n</script>", html_content)
print("Successfully inlined JS.")

# 5. Save bundled HTML to both paths
for out_path in [output_path_home, output_path_local]:
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Successfully saved bundled HTML to: {out_path}")
print("Bundling process completed successfully!")
