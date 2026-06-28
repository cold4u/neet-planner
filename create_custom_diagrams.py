import os

base_dir = "/home/shubhamkumarpatel9911/.gemini/antigravity/scratch/neet-server"
images_dir = os.path.join(base_dir, "images")
os.makedirs(images_dir, exist_ok=True)

# 1. Define custom SVG strings for the 16 remaining diagrams
svgs = {}

# Q4: LCR Circuit
svgs[4] = """<svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; display:block; margin:0 auto;">
  <rect x="25" y="30" width="170" height="70" fill="none" stroke="#475569" stroke-width="2" stroke-linejoin="round"/>
  <!-- Resistor R -->
  <rect x="50" y="22" width="20" height="16" fill="#f8fafc" stroke="#3b82f6" stroke-width="2"/>
  <text x="60" y="15" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#1e3a8a" text-anchor="middle" font-weight="bold">R</text>
  
  <!-- Inductor L -->
  <rect x="90" y="29" width="30" height="2" fill="#ffffff" stroke="#ffffff" stroke-width="2"/>
  <path d="M90,30 C92,20 96,20 98,30 C100,20 104,20 106,30 C108,20 112,20 114,30 C116,20 120,20 120,30" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
  <text x="105" y="15" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#065f46" text-anchor="middle" font-weight="bold">L</text>
  
  <!-- Capacitor C -->
  <rect x="145" y="29" width="10" height="2" fill="#ffffff" stroke="#ffffff" stroke-width="2"/>
  <line x1="148" y1="20" x2="148" y2="40" stroke="#f43f5e" stroke-width="2.5"/>
  <line x1="153" y1="20" x2="153" y2="40" stroke="#f43f5e" stroke-width="2.5"/>
  <text x="151" y="15" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#9f1239" text-anchor="middle" font-weight="bold">C</text>
  
  <!-- AC Source -->
  <circle cx="110" cy="100" r="12" fill="#f8fafc" stroke="#4f46e5" stroke-width="2"/>
  <path d="M104,100 Q107,95 110,100 T116,100" fill="none" stroke="#4f46e5" stroke-width="2"/>
  <text x="110" y="124" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#4338ca" text-anchor="middle" font-weight="bold">V = V₀ sin(ωt)</text>
</svg>"""

# Q5: Block on Floor Friction
svgs[5] = """<svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; display:block; margin:0 auto;">
  <defs>
    <pattern id="hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="8" stroke="#cbd5e1" stroke-width="1.5" />
    </pattern>
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#475569"/>
    </marker>
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#3b82f6"/>
    </marker>
    <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#ef4444"/>
    </marker>
  </defs>
  
  <!-- Floor -->
  <line x1="20" y1="95" x2="200" y2="95" stroke="#475569" stroke-width="2.5"/>
  <rect x="20" y="95" width="180" height="8" fill="url(#hatch)"/>
  
  <!-- Block -->
  <rect x="75" y="45" width="60" height="50" fill="#f1f5f9" stroke="#334155" stroke-width="2" rx="4"/>
  <text x="105" y="74" font-family="Inter, system-ui, sans-serif" font-size="11" fill="#1e293b" text-anchor="middle" font-weight="bold">2 kg</text>
  
  <!-- Applied Force F -->
  <line x1="135" y1="70" x2="190" y2="70" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrow-blue)"/>
  <text x="180" y="60" font-family="Inter, system-ui, sans-serif" font-size="10" fill="#2563eb" font-weight="bold">F = 5 N</text>
  
  <!-- Friction Force f -->
  <line x1="75" y1="85" x2="30" y2="85" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow-red)"/>
  <text x="35" y="78" font-family="Inter, system-ui, sans-serif" font-size="10" fill="#dc2626" font-weight="bold">f</text>
  
  <!-- Static friction coefficient -->
  <text x="105" y="125" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#64748b" text-anchor="middle">μ_s = 0.4</text>
</svg>"""

# Q8: Capacitor with Dielectric
svgs[8] = """<svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; display:block; margin:0 auto;">
  <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0.3"/>
    </linearGradient>
    <linearGradient id="g2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.3"/>
    </linearGradient>
  </defs>
  
  <!-- Capacitor Plates -->
  <line x1="60" y1="20" x2="60" y2="120" stroke="#1e293b" stroke-width="4"/>
  <line x1="160" y1="20" x2="160" y2="120" stroke="#1e293b" stroke-width="4"/>
  
  <!-- Dielectrics split vertically -->
  <rect x="62" y="20" width="48" height="100" fill="url(#g1)" stroke="#10b981" stroke-dasharray="2,2"/>
  <rect x="110" y="20" width="48" height="100" fill="url(#g2)" stroke="#3b82f6" stroke-dasharray="2,2"/>
  
  <text x="84" y="73" font-family="Inter, system-ui, sans-serif" font-size="12" fill="#047857" text-anchor="middle" font-weight="bold">K₁</text>
  <text x="134" y="73" font-family="Inter, system-ui, sans-serif" font-size="12" fill="#1d4ed8" text-anchor="middle" font-weight="bold">K₂</text>
  
  <!-- Connecting leads -->
  <line x1="25" y1="70" x2="58" y2="70" stroke="#475569" stroke-width="2"/>
  <line x1="162" y1="70" x2="195" y2="70" stroke="#475569" stroke-width="2"/>
  
  <!-- Dimension indicators -->
  <line x1="60" y1="130" x2="160" y2="130" stroke="#64748b" stroke-width="1" stroke-dasharray="2,2"/>
  <text x="110" y="128" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#64748b" text-anchor="middle">Separation (d), Area (A)</text>
</svg>"""

# Q10: Inclined Plane with Pulley
svgs[10] = """<svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; display:block; margin:0 auto;">
  <defs>
    <pattern id="hatch2" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="6" stroke="#cbd5e1" stroke-width="1" />
    </pattern>
  </defs>
  
  <!-- Incline Plane Triangle -->
  <polygon points="30,110 170,110 170,35" fill="#f8fafc" stroke="#334155" stroke-width="2" stroke-linejoin="round"/>
  <rect x="30" y="110" width="140" height="6" fill="url(#hatch2)"/>
  
  <!-- Angle θ -->
  <path d="M 60 110 A 30 30 0 0 0 54 97" fill="none" stroke="#64748b" stroke-width="1.5"/>
  <text x="68" y="105" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#475569" font-weight="bold">30°</text>
  
  <!-- Block m on incline -->
  <g transform="translate(100, 72.8) rotate(-28.2)">
    <rect x="-16" y="-12" width="32" height="24" fill="#eff6ff" stroke="#2563eb" stroke-width="2" rx="2"/>
    <text x="0" y="4" font-family="Inter, system-ui, sans-serif" font-size="10" fill="#1e40af" text-anchor="middle" font-weight="bold">m</text>
    <!-- String from block -->
    <line x1="16" y1="0" x2="90" y2="0" stroke="#475569" stroke-width="1.5"/>
  </g>
  
  <!-- Pulley -->
  <circle cx="178" cy="30" r="10" fill="#f1f5f9" stroke="#334155" stroke-width="2"/>
  <circle cx="178" cy="30" r="3" fill="#334155"/>
  
  <!-- Hanging Mass M -->
  <line x1="188" y1="30" x2="188" y2="65" stroke="#475569" stroke-width="1.5"/>
  <rect x="176" y="65" width="24" height="24" fill="#fff1f2" stroke="#e11d48" stroke-width="2" rx="2"/>
  <text x="188" y="80" font-family="Inter, system-ui, sans-serif" font-size="10" fill="#9f1239" text-anchor="middle" font-weight="bold">M</text>
</svg>"""

# Q11: Nucleosome
svgs[11] = """<svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; display:block; margin:0 auto;">
  <defs>
    <radialGradient id="rgrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ddd6fe"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </radialGradient>
    <linearGradient id="lgrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fed7aa"/>
      <stop offset="100%" stop-color="#f97316"/>
    </linearGradient>
  </defs>
  
  <!-- Histone Octamer (Core) -->
  <circle cx="100" cy="70" r="35" fill="url(#rgrad)" stroke="#7c3aed" stroke-width="2"/>
  <text x="100" y="74" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#ffffff" text-anchor="middle" font-weight="bold">Histone Octamer</text>
  
  <!-- DNA wrapping threads -->
  <!-- Back loop -->
  <path d="M 68,54 C 65,30, 135,30, 132,54" fill="none" stroke="#10b981" stroke-width="4.5" stroke-linecap="round" opacity="0.6"/>
  <!-- Front loop -->
  <path d="M 68,54 C 65,95, 135,95, 132,54" fill="none" stroke="#10b981" stroke-width="4.5" stroke-linecap="round"/>
  <!-- Second loop front -->
  <path d="M 66,74 C 65,115, 135,115, 133,74" fill="none" stroke="#10b981" stroke-width="4.5" stroke-linecap="round"/>
  
  <!-- H1 Histone -->
  <rect x="135" y="45" width="20" height="40" rx="6" fill="url(#lgrad)" stroke="#ea580c" stroke-width="2"/>
  <text x="145" y="68" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#7c2d12" text-anchor="middle" font-weight="bold" transform="rotate(90,145,68)">H1</text>
  
  <!-- Label lines pointing to components -->
  <!-- DNA label -->
  <line x1="90" y1="102" x2="70" y2="122" stroke="#475569" stroke-width="1"/>
  <circle cx="90" cy="102" r="2" fill="#475569"/>
  <text x="50" y="125" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#475569" font-weight="bold">DNA Thread</text>
</svg>"""

# Q12: Block on Incline
svgs[12] = """<svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; display:block; margin:0 auto;">
  <defs>
    <marker id="arrow-g" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#3b82f6"/>
    </marker>
    <marker id="arrow-n" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#ef4444"/>
    </marker>
  </defs>
  
  <!-- Incline Plane Triangle -->
  <polygon points="25,110 185,110 185,40" fill="#f8fafc" stroke="#475569" stroke-width="2"/>
  <text x="55" y="105" font-family="Inter, system-ui, sans-serif" font-size="10" fill="#333" font-weight="bold">θ</text>
  
  <!-- Block -->
  <g transform="translate(110, 72.8) rotate(-23.6)">
    <rect x="-18" y="-12" width="36" height="24" fill="#f1f5f9" stroke="#1e293b" stroke-width="2" rx="2"/>
    <text x="0" y="4" font-family="Inter, system-ui, sans-serif" font-size="10" fill="#1e293b" text-anchor="middle" font-weight="bold">m</text>
    
    <!-- Normal Force Vector (points perpendicular up) -->
    <line x1="0" y1="-12" x2="0" y2="-45" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow-n)"/>
    <text x="5" y="-36" font-family="Inter, system-ui, sans-serif" font-size="10" fill="#dc2626" font-weight="bold">N</text>
  </g>
  
  <!-- Gravity Force Vector (points straight down) -->
  <line x1="110" y1="72.8" x2="110" y2="120" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrow-g)"/>
  <text x="115" y="118" font-family="Inter, system-ui, sans-serif" font-size="10" fill="#2563eb" font-weight="bold">mg</text>
</svg>"""

# Q14: Projectile Motion
svgs[14] = """<svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; display:block; margin:0 auto;">
  <defs>
    <marker id="arrow-v" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#3b82f6"/>
    </marker>
  </defs>
  
  <!-- Axes -->
  <line x1="20" y1="110" x2="200" y2="110" stroke="#475569" stroke-width="1.5"/>
  <line x1="20" y1="20" x2="20" y2="110" stroke="#475569" stroke-width="1.5"/>
  <text x="202" y="113" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#475569">X</text>
  <text x="16" y="15" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#475569">Y</text>
  
  <!-- Launch velocity vector -->
  <line x1="20" y1="110" x2="55" y2="70" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#arrow-v)"/>
  <text x="56" y="65" font-family="Inter, system-ui, sans-serif" font-size="10" fill="#1d4ed8" font-weight="bold">u</text>
  
  <!-- Angle theta -->
  <path d="M 40 110 A 20 20 0 0 0 35 97" fill="none" stroke="#64748b" stroke-width="1.5"/>
  <text x="42" y="105" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#475569">θ</text>
  
  <!-- Parabolic Path -->
  <path d="M 20,110 Q 100,20 180,110" fill="none" stroke="#6366f1" stroke-dasharray="3,3" stroke-width="2"/>
  
  <!-- Peak Height H_max -->
  <line x1="100" y1="65" x2="100" y2="110" stroke="#10b981" stroke-width="1" stroke-dasharray="2,2"/>
  <circle cx="100" cy="65" r="3.5" fill="#10b981"/>
  <text x="100" y="55" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#047857" text-anchor="middle" font-weight="bold">H_max</text>
</svg>"""

# Q15: Reaction PE Diagram
svgs[15] = """<svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; display:block; margin:0 auto;">
  <defs>
    <marker id="darrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 5 0 L 10 5 L 5 10 M 5 0 L 0 5 L 5 10" fill="none" stroke="#f43f5e" stroke-width="1.5"/>
    </marker>
  </defs>
  
  <!-- Axes -->
  <line x1="30" y1="120" x2="200" y2="120" stroke="#334155" stroke-width="1.5"/>
  <line x1="30" y1="15" x2="30" y2="120" stroke="#334155" stroke-width="1.5"/>
  <text x="200" y="132" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#475569" text-anchor="end">Reaction Coordinate</text>
  <text x="12" y="15" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#475569" transform="rotate(-90,12,15)" text-anchor="end">Potential Energy</text>
  
  <!-- PE Profile Path -->
  <path d="M 30,85 C 60,85 75,30 95,30 C 115,30 135,100 185,100" fill="none" stroke="#4f46e5" stroke-width="2.5"/>
  
  <!-- Reactants and Products labels -->
  <text x="45" y="80" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#1e293b" font-weight="bold">Reactants (A)</text>
  <text x="180" y="94" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#1e293b" font-weight="bold" text-anchor="end">Products (B)</text>
  
  <!-- Activation Energy E_act -->
  <line x1="95" y1="30" x2="95" y2="85" stroke="#f43f5e" stroke-width="1" stroke-dasharray="2,2"/>
  <line x1="45" y1="85" x2="110" y2="85" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2,2"/>
  
  <!-- E_act double-headed arrow -->
  <line x1="95" y1="33" x2="95" y2="82" stroke="#ef4444" stroke-width="1.5" marker-start="url(#darrow)" marker-end="url(#darrow)"/>
  <text x="103" y="60" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#b91c1c" font-weight="bold">E_act (forward)</text>
</svg>"""

# Q16: Logic Gate Circuit 1
svgs[16] = """<svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; display:block; margin:0 auto;">
  <!-- Inputs -->
  <text x="20" y="45" font-family="Inter, system-ui, sans-serif" font-size="11" fill="#333" font-weight="bold">A</text>
  <text x="20" y="95" font-family="Inter, system-ui, sans-serif" font-size="11" fill="#333" font-weight="bold">B</text>
  
  <!-- NAND Gate -->
  <g transform="translate(60, 25)">
    <!-- Body -->
    <path d="M 10 10 L 30 10 A 15 15 0 0 1 30 40 L 10 40 Z" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <circle cx="48" cy="25" r="3" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
    <text x="22" y="29" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#1e40af" font-weight="bold">NAND</text>
  </g>
  
  <!-- OR Gate -->
  <g transform="translate(60, 75)">
    <!-- Body -->
    <path d="M 10 10 Q 20 25 10 40 L 22 40 Q 38 25 22 10 Z" fill="#ecfdf5" stroke="#059669" stroke-width="2"/>
    <text x="20" y="29" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#065f46" font-weight="bold">OR</text>
  </g>
  
  <!-- Connection lines -->
  <line x1="30" y1="42" x2="70" y2="42" stroke="#333" stroke-width="1.5"/>
  <line x1="30" y1="92" x2="70" y2="92" stroke="#333" stroke-width="1.5"/>
  
  <line x1="30" y1="42" x2="45" y2="42" stroke="#333" stroke-width="1.5"/>
  <line x1="45" y1="42" x2="45" y2="85" stroke="#333" stroke-width="1.5"/>
  <line x1="45" y1="85" x2="70" y2="85" stroke="#333" stroke-width="1.5"/>
  
  <line x1="30" y1="92" x2="40" y2="92" stroke="#333" stroke-width="1.5"/>
  <line x1="40" y1="92" x2="40" y2="50" stroke="#333" stroke-width="1.5"/>
  <line x1="40" y1="50" x2="70" y2="50" stroke="#333" stroke-width="1.5"/>
  
  <!-- Final AND gate -->
  <g transform="translate(130, 50)">
    <path d="M 10 10 L 25 10 A 15 15 0 0 1 25 40 L 10 40 Z" fill="#fffbeb" stroke="#d97706" stroke-width="2"/>
    <text x="18" y="29" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#78350f" font-weight="bold">AND</text>
  </g>
  
  <!-- Connection from NAND/OR to AND -->
  <line x1="111" y1="50" x2="120" y2="50" stroke="#333" stroke-width="1.5"/>
  <line x1="120" y1="50" x2="120" y2="60" stroke="#333" stroke-width="1.5"/>
  <line x1="120" y1="60" x2="140" y2="60" stroke="#333" stroke-width="1.5"/>
  
  <line x1="88" y1="100" x2="120" y2="100" stroke="#333" stroke-width="1.5"/>
  <line x1="120" y1="100" x2="120" y2="80" stroke="#333" stroke-width="1.5"/>
  <line x1="120" y1="80" x2="140" y2="80" stroke="#333" stroke-width="1.5"/>
  
  <!-- Output -->
  <line x1="170" y1="75" x2="195" y2="75" stroke="#333" stroke-width="1.5"/>
  <text x="200" y="79" font-family="Inter, system-ui, sans-serif" font-size="11" fill="#333" font-weight="bold">Y</text>
</svg>"""

# Q18: Wheatstone Bridge
svgs[18] = """<svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; display:block; margin:0 auto;">
  <!-- Bridge diamond -->
  <polygon points="110,15 160,65 110,115 60,65" fill="none" stroke="#475569" stroke-width="2"/>
  
  <!-- Terminal Nodes -->
  <circle cx="110" cy="15" r="4" fill="#334155"/>
  <circle cx="160" cy="65" r="4" fill="#334155"/>
  <circle cx="110" cy="115" r="4" fill="#334155"/>
  <circle cx="60" cy="65" r="4" fill="#334155"/>
  
  <!-- Node labels -->
  <text x="110" y="10" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#475569" text-anchor="middle" font-weight="bold">A</text>
  <text x="168" y="68" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#475569" font-weight="bold">B</text>
  <text x="110" y="125" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#475569" text-anchor="middle" font-weight="bold">C</text>
  <text x="50" y="68" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#475569" font-weight="bold">D</text>
  
  <!-- Galvanometer in the middle -->
  <line x1="60" y1="65" x2="160" y2="65" stroke="#f43f5e" stroke-width="2"/>
  <circle cx="110" cy="65" r="12" fill="#ffffff" stroke="#f43f5e" stroke-width="2"/>
  <text x="110" y="69" font-family="Inter, system-ui, sans-serif" font-size="11" fill="#e11d48" text-anchor="middle" font-weight="bold">G</text>
  
  <!-- Resistor Labels -->
  <text x="80" y="36" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#1e3a8a" font-weight="bold">10 Ω</text>
  <text x="128" y="36" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#1e3a8a" font-weight="bold">10 Ω</text>
  <text x="80" y="98" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#1e3a8a" font-weight="bold">10 Ω</text>
  <text x="130" y="98" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#1e3a8a" font-weight="bold">X</text>
</svg>"""

# Q19: Nephron
svgs[19] = """<svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; display:block; margin:0 auto;">
  <defs>
    <linearGradient id="glom" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fca5a5"/>
      <stop offset="100%" stop-color="#ef4444"/>
    </linearGradient>
  </defs>
  
  <!-- Glomerulus & Bowman Capsule -->
  <circle cx="50" cy="40" r="14" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <circle cx="50" cy="40" r="8" fill="url(#glom)"/>
  
  <!-- PCT -->
  <path d="M 64,40 C 70,30, 85,25, 95,35 C 105,45, 90,55, 100,60" fill="none" stroke="#fbbf24" stroke-width="4.5" stroke-linecap="round"/>
  
  <!-- Loop of Henle -->
  <!-- Descending limb -->
  <line x1="100" y1="60" x2="100" y2="120" stroke="#60a5fa" stroke-width="3" stroke-linecap="round"/>
  <!-- Hairpin bend -->
  <path d="M 100,120 A 10 10 0 0 0 120,120" fill="none" stroke="#60a5fa" stroke-width="3"/>
  <!-- Ascending limb -->
  <line x1="120" y1="120" x2="120" y2="60" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
  
  <!-- DCT -->
  <path d="M 120,60 C 130,50, 140,40, 155,45 C 170,50, 160,65, 175,60" fill="none" stroke="#a7f3d0" stroke-width="4.5" stroke-linecap="round"/>
  
  <!-- Collecting Duct -->
  <line x1="175" y1="60" x2="175" y2="130" stroke="#34d399" stroke-width="5" stroke-linecap="round"/>
  
  <!-- Label pointers -->
  <!-- Bowman / Glomerulus (A) -->
  <line x1="38" y1="28" x2="25" y2="15" stroke="#333" stroke-width="1"/>
  <text x="22" y="12" font-family="Inter, system-ui, sans-serif" font-size="10" font-weight="bold" fill="#dc2626">A</text>
  
  <!-- PCT (B) -->
  <line x1="88" y1="30" x2="88" y2="12" stroke="#333" stroke-width="1"/>
  <circle cx="88" cy="30" r="1.5" fill="#333"/>
  <text x="88" y="10" font-family="Inter, system-ui, sans-serif" font-size="10" font-weight="bold" fill="#d97706" text-anchor="middle">B</text>
  
  <!-- Loop of Henle (C) -->
  <line x1="110" y1="100" x2="140" y2="100" stroke="#333" stroke-width="1"/>
  <circle cx="110" cy="100" r="1.5" fill="#333"/>
  <text x="145" y="104" font-family="Inter, system-ui, sans-serif" font-size="10" font-weight="bold" fill="#2563eb">C</text>
  
  <!-- DCT / Collecting Duct (D) -->
  <line x1="175" y1="90" x2="195" y2="90" stroke="#333" stroke-width="1"/>
  <circle cx="175" cy="90" r="1.5" fill="#333"/>
  <text x="200" y="94" font-family="Inter, system-ui, sans-serif" font-size="10" font-weight="bold" fill="#059669">D</text>
</svg>"""

# Q20: Atwood Machine (Pulley)
svgs[20] = """<svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; display:block; margin:0 auto;">
  <!-- Support ceiling -->
  <line x1="70" y1="15" x2="150" y2="15" stroke="#334155" stroke-width="3"/>
  <line x1="110" y1="15" x2="110" y2="30" stroke="#475569" stroke-width="2"/>
  
  <!-- Pulley -->
  <circle cx="110" cy="35" r="15" fill="#f8fafc" stroke="#334155" stroke-width="2.5"/>
  <circle cx="110" cy="35" r="3" fill="#334155"/>
  
  <!-- Strings -->
  <line x1="95" y1="35" x2="95" y2="80" stroke="#475569" stroke-width="1.5"/>
  <line x1="125" y1="35" x2="125" y2="70" stroke="#475569" stroke-width="1.5"/>
  
  <!-- Mass 10 kg -->
  <rect x="83" y="80" width="24" height="24" fill="#eff6ff" stroke="#2563eb" stroke-width="2" rx="2"/>
  <text x="95" y="95" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#1e40af" text-anchor="middle" font-weight="bold">10 kg</text>
  
  <!-- Mass 6 kg -->
  <rect x="113" y="70" width="24" height="20" fill="#fff1f2" stroke="#e11d48" stroke-width="2" rx="2"/>
  <text x="125" y="83" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#9f1239" text-anchor="middle" font-weight="bold">6 kg</text>
</svg>"""

# Q21: Galvanic Cell
svgs[21] = """<svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; display:block; margin:0 auto;">
  <!-- Left Beaker (Anode) -->
  <rect x="25" y="60" width="50" height="60" rx="3" fill="none" stroke="#475569" stroke-width="2"/>
  <rect x="26" y="80" width="48" height="39" fill="#93c5fd" opacity="0.4"/>
  <!-- Zinc strip -->
  <rect x="42" y="45" width="10" height="50" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>
  <text x="47" y="38" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#333" text-anchor="middle" font-weight="bold">Zn</text>
  
  <!-- Right Beaker (Cathode) -->
  <rect x="145" y="60" width="50" height="60" rx="3" fill="none" stroke="#475569" stroke-width="2"/>
  <rect x="146" y="80" width="48" height="39" fill="#93c5fd" opacity="0.6"/>
  <!-- Copper strip -->
  <rect x="165" y="45" width="10" height="50" fill="#fdba74" stroke="#c2410c" stroke-width="1.5"/>
  <text x="170" y="38" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#c2410c" text-anchor="middle" font-weight="bold">Cu</text>
  
  <!-- Salt Bridge -->
  <path d="M 60,75 L 60,50 C 60,45 160,45 160,50 L 160,75" fill="none" stroke="#10b981" stroke-width="6" stroke-linecap="square"/>
  <text x="110" y="34" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#047857" text-anchor="middle" font-weight="bold">Salt Bridge</text>
  
  <!-- Connecting Wire -->
  <path d="M 47,45 L 47,20 L 170,20 L 170,45" fill="none" stroke="#ef4444" stroke-width="1.5"/>
  <circle cx="108" cy="20" r="10" fill="#ffffff" stroke="#ef4444" stroke-width="1.5"/>
  <text x="108" y="23" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#ef4444" text-anchor="middle" font-weight="bold">V</text>
</svg>"""

# Q22: Logic Gate Circuit 2
svgs[22] = """<svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; display:block; margin:0 auto;">
  <!-- Inputs -->
  <text x="20" y="45" font-family="Inter, system-ui, sans-serif" font-size="11" fill="#333" font-weight="bold">A</text>
  <text x="20" y="95" font-family="Inter, system-ui, sans-serif" font-size="11" fill="#333" font-weight="bold">B</text>
  
  <!-- AND Gate -->
  <g transform="translate(60, 25)">
    <path d="M 10 10 L 30 10 A 15 15 0 0 1 30 40 L 10 40 Z" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <text x="22" y="29" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#1e40af" font-weight="bold">AND</text>
  </g>
  
  <!-- OR Gate -->
  <g transform="translate(60, 75)">
    <path d="M 10 10 Q 20 25 10 40 L 22 40 Q 38 25 22 10 Z" fill="#ecfdf5" stroke="#059669" stroke-width="2"/>
    <text x="20" y="29" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#065f46" font-weight="bold">OR</text>
  </g>
  
  <!-- Connections -->
  <line x1="30" y1="42" x2="70" y2="42" stroke="#333" stroke-width="1.5"/>
  <line x1="30" y1="92" x2="70" y2="92" stroke="#333" stroke-width="1.5"/>
  
  <!-- Final NAND Gate -->
  <g transform="translate(130, 50)">
    <path d="M 10 10 L 25 10 A 15 15 0 0 1 25 40 L 10 40 Z" fill="#fffbeb" stroke="#d97706" stroke-width="2"/>
    <circle cx="43" cy="25" r="3" fill="#ffffff" stroke="#d97706" stroke-width="2"/>
    <text x="18" y="29" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#78350f" font-weight="bold">NAND</text>
  </g>
  
  <line x1="105" y1="50" x2="140" y2="50" stroke="#333" stroke-width="1.5"/>
  <line x1="105" y1="100" x2="120" y2="100" stroke="#333" stroke-width="1.5"/>
  <line x1="120" y1="100" x2="120" y2="80" stroke="#333" stroke-width="1.5"/>
  <line x1="120" y1="80" x2="140" y2="80" stroke="#333" stroke-width="1.5"/>
  
  <!-- Output -->
  <line x1="176" y1="75" x2="195" y2="75" stroke="#333" stroke-width="1.5"/>
  <text x="200" y="79" font-family="Inter, system-ui, sans-serif" font-size="11" fill="#333" font-weight="bold">Y</text>
</svg>"""

# Q24: Equilateral Prism Refraction
svgs[24] = """<svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; display:block; margin:0 auto;">
  <defs>
    <linearGradient id="prism-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#eff6ff"/>
      <stop offset="100%" stop-color="#dbeafe"/>
    </linearGradient>
    <marker id="ray-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#ef4444"/>
    </marker>
  </defs>
  
  <!-- Equilateral Prism Triangle -->
  <polygon points="110,20 50,110 170,110" fill="url(#prism-grad)" stroke="#2563eb" stroke-width="2" stroke-linejoin="round"/>
  <text x="110" y="65" font-family="Inter, system-ui, sans-serif" font-size="10" fill="#1e40af" text-anchor="middle" font-weight="bold">μ = √2</text>
  <text x="110" y="15" font-family="Inter, system-ui, sans-serif" font-size="10" fill="#333" text-anchor="middle" font-weight="bold">A</text>
  
  <!-- Light Ray Path -->
  <!-- Incident ray -->
  <line x1="15" y1="95" x2="70" y2="80" stroke="#ef4444" stroke-width="2" marker-end="url(#ray-arrow)"/>
  <!-- Refracted ray -->
  <line x1="70" y1="80" x2="140" y2="72" stroke="#ef4444" stroke-width="2"/>
  <!-- Emergent ray -->
  <line x1="140" y1="72" x2="195" y2="92" stroke="#ef4444" stroke-width="2" marker-end="url(#ray-arrow)"/>
  
  <!-- Normal lines -->
  <line x1="45" y1="65" x2="95" y2="95" stroke="#475569" stroke-dasharray="2,2" stroke-width="1"/>
  <line x1="165" y1="58" x2="115" y2="90" stroke="#475569" stroke-dasharray="2,2" stroke-width="1"/>
  
  <!-- Labels -->
  <text x="25" y="85" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#ef4444" font-weight="bold">45°</text>
</svg>"""

# Q25: Meiosis Anaphase I
svgs[25] = """<svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; display:block; margin:0 auto;">
  <!-- Cell Boundary -->
  <rect x="25" y="20" width="170" height="100" rx="50" fill="none" stroke="#475569" stroke-width="2"/>
  
  <!-- Centrioles / Poles -->
  <circle cx="30" cy="70" r="4" fill="#334155"/>
  <circle cx="190" cy="70" r="4" fill="#334155"/>
  
  <!-- Spindle fibers and separating chromosomes -->
  <!-- Left Pole Fibers & Chromosomes -->
  <line x1="30" y1="70" x2="80" y2="45" stroke="#94a3b8" stroke-dasharray="2,2" stroke-width="1"/>
  <line x1="30" y1="70" x2="80" y2="95" stroke="#94a3b8" stroke-dasharray="2,2" stroke-width="1"/>
  <!-- Chromosome pair 1 left (2 chromatids pointing back to pole) -->
  <path d="M 80,45 L 68,35 M 80,45 L 68,55" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
  <!-- Chromosome pair 2 left -->
  <path d="M 80,95 L 68,85 M 80,95 L 68,105" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
  
  <!-- Right Pole Fibers & Chromosomes -->
  <line x1="190" y1="70" x2="140" y2="45" stroke="#94a3b8" stroke-dasharray="2,2" stroke-width="1"/>
  <line x1="190" y1="70" x2="140" y2="95" stroke="#94a3b8" stroke-dasharray="2,2" stroke-width="1"/>
  <!-- Chromosome pair 1 right -->
  <path d="M 140,45 L 152,35 M 140,45 L 152,55" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
  <!-- Chromosome pair 2 right -->
  <path d="M 140,95 L 152,85 M 140,95 L 152,105" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
  
  <text x="110" y="115" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#475569" text-anchor="middle">Homologous chromosomes separating</text>
</svg>"""

# Write all custom SVGs to the images folder
for idx, svg_content in svgs.items():
    dest_path = os.path.join(images_dir, f"q{idx}.svg")
    with open(dest_path, "w", encoding="utf-8") as f:
        f.write(svg_content)
    print(f"Created custom diagram for question [{idx}] -> 'q{idx}.svg'")
