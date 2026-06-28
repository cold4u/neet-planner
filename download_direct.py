import os
import json
import hashlib
import time
import urllib.request
import urllib.error

base_dir = "/home/shubhamkumarpatel9911/.gemini/antigravity/scratch/neet-server"
images_dir = os.path.join(base_dir, "images")
os.makedirs(images_dir, exist_ok=True)

candidates = {
    3: ["Double-slit_experiment.svg", "Double_slit_interference.svg", "Backtrack_Young_maxima.svg", "Young's_slits.svg", "Double-slit.svg"],
    4: ["LCR_series_circuit.svg", "LCR_circuit.svg", "RLC_series_circuit.svg", "RLC_circuit.svg", "L_series_RC_parallel.svg"],
    5: ["Friction_diagram.svg", "Freebodydiagram_imbalance_friction.svg", "Friction_block.svg", "Block_friction_force.svg"],
    8: ["Capacitor_schematic_with_dielectric_mk.svg", "Capacitor_with_dielectric.svg", "Capacitor_split.svg", "Parallel_plate_capacitor.svg"],
    10: ["Block_on_inclined_plane_with_pulley_and_suspended_weight.svg", "Inclined_plane_with_pulley.svg", "Pulley_inclined_plane.svg", "Inclined_plane_pulley.svg"],
    11: ["Nucleosome.svg", "Nucleosome_organization.svg", "Nucleosome_structure.svg"],
    12: ["Free_body_diagram_inclined_plane.svg", "Inclined_plane_forces.svg", "Inclined_plane.svg"],
    14: ["Ideal_projectile_motion.svg", "Projectile_trajectory.svg", "Projectile_motion.svg"],
    15: ["Activation_energy.svg", "Reaktionskoordinate_der_SN2-Reaktion.svg", "Potential_energy_reaction_coordinate.svg", "Reaction_profile.svg"],
    16: ["Combinational_circuit_NAND_gates.svg", "Logic_gate_circuit.svg", "NAND_gate_logic.svg", "Logic_circuit.svg"],
    18: ["Wheatstone_Bridge.svg", "Wheatstone_bridge.svg", "Wheatstone_bridge_circuit.svg"],
    19: ["Kidney_nephron_molar_transport_diagram.svg", "Nephron_diagram.svg", "Nephron_structure.svg"],
    20: ["Atwood-machine-2.svg", "Atwood_machine.svg", "Atwood_machine_diagram.svg"],
    21: ["Galvanic_cell_labeled-el.svg", "Galvanic_cell_labeled.svg", "Galvanic_cell.svg", "Electrochemical_cell.svg"],
    22: ["Logic_circuit_example.svg", "Logic_circuit.svg", "Logic_gate_combination.svg", "Pulse_Step_Modulator_simplified_block_diagram.svg"],
    24: ["Light-refraction-glass-prism.svg", "Prism_refraction.svg", "Prism_ray_tracing.svg", "Light_refraction_prism.svg"],
    25: ["Anaphase_I_meiosis.svg", "Meiosis_anaphase.svg", "Anaphase_I.svg"]
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def get_wikimedia_url(filename):
    filename = filename.replace(' ', '_')
    if len(filename) > 0:
        filename = filename[0].upper() + filename[1:]
    m = hashlib.md5(filename.encode('utf-8')).hexdigest()
    return f"https://upload.wikimedia.org/wikipedia/commons/{m[0]}/{m[:2]}/{filename}"

downloaded_mapping = {}
if os.path.exists(os.path.join(base_dir, "downloaded_diagrams.json")):
    with open(os.path.join(base_dir, "downloaded_diagrams.json"), "r") as f:
        downloaded_mapping = json.load(f)

print("Starting direct downloads...")

for idx, fnames in candidates.items():
    if str(idx) in downloaded_mapping:
        print(f"[{idx}] Already downloaded: {downloaded_mapping[str(idx)]}")
        continue
        
    print(f"[{idx}] Trying candidates...")
    success = False
    for fn in fnames:
        url = get_wikimedia_url(fn)
        _, ext = os.path.splitext(fn)
        ext = ext.lower()
        
        try:
            time.sleep(1.0)  # Moderate sleep
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=12) as response:
                content = response.read()
            if len(content) > 100:
                dest_filename = f"q{idx}{ext}"
                dest_path = os.path.join(images_dir, dest_filename)
                with open(dest_path, "wb") as f:
                    f.write(content)
                print(f"  SUCCESS: '{fn}' -> '{dest_filename}' ({len(content)} bytes)")
                downloaded_mapping[str(idx)] = dest_filename
                success = True
                break
        except urllib.error.HTTPError as e:
            if e.code == 404:
                # Normal 404, candidate doesn't exist
                pass
            elif e.code == 429:
                print(f"  429 rate limit hit for '{fn}'. Sleeping 10s...")
                time.sleep(10.0)
            else:
                print(f"  HTTP error {e.code} for '{fn}'")
        except Exception as e:
            print(f"  Error for '{fn}': {e}")
            
    if not success:
        print(f"  FAILED for all candidates of question [{idx}]")

with open(os.path.join(base_dir, "downloaded_diagrams.json"), "w") as f:
    json.dump(downloaded_mapping, f, indent=2)

print("\nFinal Summary:")
print(f"Total downloaded: {len(downloaded_mapping)} of 25 diagrams.")
