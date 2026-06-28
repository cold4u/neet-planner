import os
import json
import hashlib
import urllib.request
import urllib.error

base_dir = "/home/shubhamkumarpatel9911/.gemini/antigravity/scratch/neet-server"
images_dir = os.path.join(base_dir, "images")
os.makedirs(images_dir, exist_ok=True)

# List of 25 diagrams and their filenames on Wikimedia Commons
diagrams_manifest = {
    1: {
        "name": "Vernier Caliper",
        "primary": "Vernier scale work.svg",
        "alternatives": ["Vernier caliper.svg", "Vernier scale.svg", "Vernier scale reading.svg"]
    },
    2: {
        "name": "Mitosis Metaphase",
        "primary": "Metaphase eukaryotic mitosis.svg",
        "alternatives": ["Mitosis Stages.svg", "Mitosis metaphase.svg", "Metaphase.svg"]
    },
    3: {
        "name": "Young's Double Slit",
        "primary": "Double slit interference.svg",
        "alternatives": ["Young's slits.svg", "Double slit.svg", "Double-slit experiment.svg"]
    },
    4: {
        "name": "LCR Circuit",
        "primary": "LCR series circuit.svg",
        "alternatives": ["LCR circuit.svg", "RLC series circuit.svg", "RLC circuit.svg"]
    },
    5: {
        "name": "Block on Floor Friction",
        "primary": "Freebodydiagram imbalance friction.svg",
        "alternatives": ["Block friction force.svg", "Friction block.svg", "Friction diagram.svg"]
    },
    6: {
        "name": "Cell Cycle",
        "primary": "Cell cycle diagram.svg",
        "alternatives": ["Cell cycle.svg", "The Cell Cycle.svg", "Animal cell cycle-en.svg"]
    },
    7: {
        "name": "Nereis (Animal Kingdom)",
        "primary": "Nereis pelagica.jpg",
        "alternatives": ["Nereis.svg", "Nereis pelagica.svg", "Annelida.svg"]
    },
    8: {
        "name": "Capacitor with Dielectric",
        "primary": "Capacitor with dielectric.svg",
        "alternatives": ["Capacitor split.svg", "Parallel plate capacitor.svg"]
    },
    9: {
        "name": "Mitochondria Cross-section",
        "primary": "Mitochondrion (standalone version)-en.svg",
        "alternatives": ["Animal mitochondrion diagram en.svg", "Mitochondrion structure.svg", "Mitochondrion diagram.svg"]
    },
    10: {
        "name": "Inclined Plane with Pulley",
        "primary": "Inclined plane with pulley.svg",
        "alternatives": ["Pulley inclined plane.svg", "Inclined plane pulley.svg"]
    },
    11: {
        "name": "Nucleosome",
        "primary": "Nucleosome organization.svg",
        "alternatives": ["Nucleosome.svg", "Nucleosome structure.svg"]
    },
    12: {
        "name": "Block on Incline",
        "primary": "Free body diagram inclined plane.svg",
        "alternatives": ["Inclined plane forces.svg", "Inclined plane.svg"]
    },
    13: {
        "name": "Chloroplast",
        "primary": "Chloroplast diagram.svg",
        "alternatives": ["Chloroplast structure.svg", "Chloroplast.svg"]
    },
    14: {
        "name": "Projectile Motion",
        "primary": "Ideal projectile motion.svg",
        "alternatives": ["Projectile trajectory.svg", "Projectile motion.svg"]
    },
    15: {
        "name": "Reaction PE Diagram",
        "primary": "Activation energy.svg",
        "alternatives": ["Potential energy reaction coordinate.svg", "Reaction profile.svg"]
    },
    16: {
        "name": "Logic Gate Circuit 1",
        "primary": "Logic gate circuit.svg",
        "alternatives": ["NAND gate logic.svg", "Logic circuit.svg"]
    },
    17: {
        "name": "Antibody Molecule",
        "primary": "Immunoglobulin basic unit.svg",
        "alternatives": ["Antibody basic unit.svg", "Antibody structure.svg", "Antibody.svg"]
    },
    18: {
        "name": "Wheatstone Bridge",
        "primary": "Wheatstone Bridge.svg",
        "alternatives": ["Wheatstone bridge.svg", "Wheatstone bridge circuit.svg"]
    },
    19: {
        "name": "Nephron",
        "primary": "Kidney nephron molar transport diagram.svg",
        "alternatives": ["Nephron diagram.svg", "Nephron structure.svg"]
    },
    20: {
        "name": "Atwood Machine",
        "primary": "Atwood-machine-2.svg",
        "alternatives": ["Atwood machine.svg", "Atwood machine diagram.svg"]
    },
    21: {
        "name": "Galvanic Cell",
        "primary": "Galvanic cell labeled.svg",
        "alternatives": ["Galvanic cell.svg", "Electrochemical cell.svg"]
    },
    22: {
        "name": "Logic Gate Circuit 2",
        "primary": "Logic circuit example.svg",
        "alternatives": ["Logic circuit.svg", "Logic gate combination.svg"]
    },
    23: {
        "name": "DNA Replication Fork",
        "primary": "DNA replication en.svg",
        "alternatives": ["DNA replication fork.svg", "DNA replication.svg"]
    },
    24: {
        "name": "Equilateral Prism Refraction",
        "primary": "Prism refraction.svg",
        "alternatives": ["Prism ray tracing.svg", "Light refraction prism.svg"]
    },
    25: {
        "name": "Meiosis Anaphase I",
        "primary": "Anaphase I meiosis.svg",
        "alternatives": ["Meiosis anaphase.svg", "Anaphase I.svg"]
    }
}

def get_wikimedia_url(filename):
    filename = filename.replace(' ', '_')
    # Standard capitalization for first char
    if len(filename) > 0:
        filename = filename[0].upper() + filename[1:]
    m = hashlib.md5(filename.encode('utf-8')).hexdigest()
    return f"https://upload.wikimedia.org/wikipedia/commons/{m[0]}/{m[:2]}/{filename}"

def try_download(idx, name, filenames):
    headers = {'User-Agent': 'Mozilla/5.0'}
    for fn in filenames:
        url = get_wikimedia_url(fn)
        _, ext = os.path.splitext(fn)
        ext = ext.lower()
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as response:
                content = response.read()
            if len(content) > 100:  # Validate downloaded content
                dest_filename = f"q{idx}{ext}"
                dest_path = os.path.join(images_dir, dest_filename)
                with open(dest_path, "wb") as f:
                    f.write(content)
                print(f"[{idx}] {name}: Successfully downloaded '{fn}' -> '{dest_filename}' ({len(content)} bytes)")
                return dest_filename
        except urllib.error.HTTPError as e:
            pass
        except Exception as e:
            print(f"[{idx}] {name}: Error trying '{fn}': {e}")
    print(f"[{idx}] {name}: FAILED to download any of the options: {filenames}")
    return None

results = {}
for idx, data in diagrams_manifest.items():
    all_names = [data["primary"]] + data["alternatives"]
    filename = try_download(idx, data["name"], all_names)
    if filename:
        results[idx] = filename

print("\nSummary:")
print(f"Downloaded {len(results)} of {len(diagrams_manifest)} diagrams.")
with open(os.path.join(base_dir, "downloaded_diagrams.json"), "w") as f:
    json.dump(results, f, indent=2)
