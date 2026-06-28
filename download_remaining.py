import os
import json
import time
import urllib.request
import urllib.parse
import urllib.error

base_dir = "/home/shubhamkumarpatel9911/.gemini/antigravity/scratch/neet-server"
images_dir = os.path.join(base_dir, "images")
os.makedirs(images_dir, exist_ok=True)

remaining_manifest = {
    3: {
        "name": "Young's Double Slit",
        "queries": ["Young double slit experiment filetype:svg", "Double slit interference filetype:svg", "Young's slits filetype:svg"]
    },
    4: {
        "name": "LCR Circuit",
        "queries": ["LCR circuit diagram filetype:svg", "RLC circuit diagram filetype:svg", "AC circuit LCR filetype:svg"]
    },
    5: {
        "name": "Block on Floor Friction",
        "queries": ["friction block force diagram filetype:svg", "friction force diagram filetype:svg", "block on table friction filetype:svg"]
    },
    8: {
        "name": "Capacitor with Dielectric",
        "queries": ["capacitor dielectric filetype:svg", "parallel plate capacitor filetype:svg", "dielectric capacitor filetype:svg"]
    },
    10: {
        "name": "Inclined Plane with Pulley",
        "queries": ["inclined plane pulley filetype:svg", "pulley mass inclined plane filetype:svg", "inclined plane mass pulley filetype:svg"]
    },
    11: {
        "name": "Nucleosome",
        "queries": ["nucleosome DNA histone filetype:svg", "nucleosome structure filetype:svg", "chromatin fiber nucleosome filetype:svg"]
    },
    12: {
        "name": "Block on Incline",
        "queries": ["inclined plane force diagram filetype:svg", "block on inclined plane filetype:svg", "inclined plane physics filetype:svg"]
    },
    14: {
        "name": "Projectile Motion",
        "queries": ["projectile motion trajectory filetype:svg", "projectile trajectory filetype:svg", "projectile physics filetype:svg"]
    },
    15: {
        "name": "Reaction PE Diagram",
        "queries": ["potential energy reaction coordinate filetype:svg", "activation energy profile filetype:svg", "reaction energy diagram filetype:svg"]
    },
    16: {
        "name": "Logic Gate Circuit 1",
        "queries": ["logic gates combination circuit filetype:svg", "NAND gate logic combination filetype:svg", "logic circuit gates filetype:svg"]
    },
    18: {
        "name": "Wheatstone Bridge",
        "queries": ["Wheatstone bridge circuit diagram filetype:svg", "Wheatstone bridge schematic filetype:svg", "Wheatstone bridge filetype:svg"]
    },
    19: {
        "name": "Nephron",
        "queries": ["nephron diagram renal filetype:svg", "kidney nephron structure filetype:svg", "renal tubule nephron filetype:svg"]
    },
    20: {
        "name": "Atwood Machine",
        "queries": ["Atwood machine diagram filetype:svg", "Atwood pulley system filetype:svg", "pulley mass Atwood filetype:svg"]
    },
    21: {
        "name": "Galvanic Cell",
        "queries": ["galvanic cell zinc copper filetype:svg", "electrochemical cell diagram filetype:svg", "daniell cell labeled filetype:svg"]
    },
    22: {
        "name": "Logic Gate Circuit 2",
        "queries": ["logic circuit gate combination filetype:svg", "combination of logic gates filetype:svg", "logic gate circuit example filetype:svg"]
    },
    24: {
        "name": "Equilateral Prism Refraction",
        "queries": ["prism ray tracing refraction filetype:svg", "light refraction prism filetype:svg", "dispersion prism light filetype:svg"]
    },
    25: {
        "name": "Meiosis Anaphase I",
        "queries": ["Anaphase meiosis division diagram filetype:svg", "meiosis anaphase chromosome separation filetype:svg", "anaphase cell division filetype:svg"]
    }
}

# Standard browser user agent
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def make_request(url):
    retries = 3
    delay = 6.0
    for r in range(retries):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as resp:
                return resp.read()
        except urllib.error.HTTPError as e:
            if e.code == 429:
                print(f"    Rate limit (429) hit. Waiting {delay}s...")
                time.sleep(delay)
                delay *= 2
            else:
                print(f"    HTTP Error: {e.code}")
                return None
        except Exception as e:
            print(f"    Error: {e}")
            return None
    return None

def get_wikimedia_file_url(search_query):
    params = {
        'action': 'query',
        'list': 'search',
        'srsearch': search_query,
        'srnamespace': 6,
        'format': 'json'
    }
    query_str = urllib.parse.urlencode(params)
    search_url = f'https://commons.wikimedia.org/w/api.php?{query_str}'
    
    resp_bytes = make_request(search_url)
    if not resp_bytes:
        return None
        
    try:
        data = json.loads(resp_bytes.decode('utf-8'))
    except Exception:
        return None
        
    search_results = data.get('query', {}).get('search', [])
    if not search_results:
        return None
        
    first_file = search_results[0]['title']
    print(f"  Found file: {first_file}")
    
    info_params = {
        'action': 'query',
        'titles': first_file,
        'prop': 'imageinfo',
        'iiprop': 'url',
        'format': 'json'
    }
    info_query = urllib.parse.urlencode(info_params)
    info_url = f'https://commons.wikimedia.org/w/api.php?{info_query}'
    
    info_bytes = make_request(info_url)
    if not info_bytes:
        return None
        
    try:
        info_data = json.loads(info_bytes.decode('utf-8'))
    except Exception:
        return None
        
    pages = info_data.get('query', {}).get('pages', {})
    for page_id, page_info in pages.items():
        image_info = page_info.get('imageinfo', [])
        if image_info:
            return image_info[0]['url']
    return None

downloaded_mapping = {}
if os.path.exists(os.path.join(base_dir, "downloaded_diagrams.json")):
    with open(os.path.join(base_dir, "downloaded_diagrams.json"), "r") as f:
        downloaded_mapping = json.load(f)

for idx, data in remaining_manifest.items():
    if str(idx) in downloaded_mapping or idx in downloaded_mapping:
        print(f"[{idx}] {data['name']}: Already downloaded.")
        continue
        
    print(f"[{idx}] {data['name']}: Searching...")
    url = None
    for q in data["queries"]:
        time.sleep(5.0)  # Politeness sleep between searches
        url = get_wikimedia_file_url(q)
        if url:
            break
            
    if url:
        parsed_url = urllib.parse.urlparse(url)
        _, ext = os.path.splitext(parsed_url.path)
        ext = ext.lower()
        if not ext:
            ext = ".svg"
            
        dest_filename = f"q{idx}{ext}"
        dest_path = os.path.join(images_dir, dest_filename)
        
        time.sleep(3.0)  # Politeness sleep before download
        content = make_request(url)
        if content:
            with open(dest_path, "wb") as f:
                f.write(content)
            print(f"  Successfully downloaded -> '{dest_filename}' ({len(content)} bytes)")
            downloaded_mapping[str(idx)] = dest_filename
        else:
            print(f"  Failed to download from {url}")
    else:
        print(f"  FAILED to find any matching file on Wikimedia.")

with open(os.path.join(base_dir, "downloaded_diagrams.json"), "w") as f:
    json.dump(downloaded_mapping, f, indent=2)

print("\nUpdated Summary:")
print(f"Total downloaded: {len(downloaded_mapping)} of 25 diagrams.")
