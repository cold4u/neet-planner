function renderMath(element) {
  if (typeof renderMathInElement === 'function' && element) {
    renderMathInElement(element, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true }
      ],
      throwOnError: false
    });
  }
}

function safeGetLocalStorage(key, fallback = null) {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? val : fallback;
  } catch (e) {
    return fallback;
  }
}

function safeSetLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
}

function safeRemoveLocalStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}

function safeGetSessionStorage(key, fallback = null) {
  try {
    const val = sessionStorage.getItem(key);
    return val !== null ? val : fallback;
  } catch (e) {
    return fallback;
  }
}

function safeSetSessionStorage(key, value) {
  try {
    sessionStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
}





    // Chapter Lists
    const P1_PHY = [
  {ch:'Units & Measurement',task:'Dimensions,SI units,errors. 30 MCQs.',wt:'m'},
  {ch:'Kinematics 1D',task:'Graphs, equations of motion. 40 MCQs.',wt:'h'},
  {ch:'Kinematics 2D',task:'Projectile, relative motion. 40 MCQs.',wt:'h'},
  {ch:'Laws of Motion',task:'FBD, friction, Atwood. 50 MCQs.',wt:'h'},
  {ch:'Work, Energy & Power',task:'Conservation, elastic/inelastic. 40 MCQs.',wt:'m'},
  {ch:'Rotational Motion',task:'MOI, torque, rolling. 50 MCQs.',wt:'h'},
  {ch:'Gravitation',task:'Kepler, orbital, satellites. 30 MCQs.',wt:'m'},
  {ch:'Properties of Matter',task:'Elasticity, viscosity, surface tension. 30 MCQs.',wt:'m'},
  {ch:'Thermal Properties',task:'Expansion, calorimetry. 30 MCQs.',wt:'m'},
  {ch:'Thermodynamics',task:'Laws, Carnot cycle. 40 MCQs.',wt:'h'},
  {ch:'Kinetic Theory',task:'KE, RMS speed, degrees. 30 MCQs.',wt:'m'},
  {ch:'Oscillations',task:'SHM, spring-mass, pendulum. 40 MCQs.',wt:'h'},
  {ch:'Waves',task:'Standing waves, Doppler. 40 MCQs.',wt:'h'},
  {ch:'Experimental Skills',task:'Vernier, screw gauge, experiments. 20 MCQs.',wt:'l'},
];
    const P1_CHE = [
  {ch:'Basic Concepts',task:'Mole concept, stoichiometry. 30 MCQs.',wt:'h'},
  {ch:'Atomic Structure',task:'Bohr model, quantum numbers, orbitals. 50 MCQs.',wt:'h'},
  {ch:'Periodic Table',task:'IE, EA, electronegativity trends. 40 MCQs.',wt:'h'},
  {ch:'Chemical Bonding',task:'VSEPR, hybridisation, MO theory. 50 MCQs.',wt:'h'},
  {ch:'Thermodynamics (Chem)',task:'Hess law, entropy, Gibbs. 40 MCQs.',wt:'h'},
  {ch:'Equilibrium',task:'Kp, Kc, Le Chatelier, buffer. 50 MCQs.',wt:'h'},
  {ch:'Redox Reactions',task:'Oxidation numbers, balancing. 30 MCQs.',wt:'m'},
  {ch:'p-Block (Gr 13-14)',task:'B, Al, C, Si chemistry. 30 MCQs.',wt:'m'},
  {ch:'Organic Basics',task:'IUPAC, isomerism, intermediates. 50 MCQs.',wt:'h'},
  {ch:'Hydrocarbons',task:'Alkane/alkene/alkyne reactions. 50 MCQs.',wt:'h'},
  {ch:'Practical Chemistry',task:'Lab techniques, titrations. 20 MCQs.',wt:'l'},
];
    const P1_BIO = [
  {ch:'Living World',task:'Taxonomy, NCERT line-by-line. 30 MCQs.',wt:'m'},
  {ch:'Biological Classification',task:'5 kingdoms, examples. 40 MCQs.',wt:'h'},
  {ch:'Plant Kingdom',task:'Alternation of generations. 40 MCQs.',wt:'h'},
  {ch:'Animal Kingdom',task:'All phyla, examples. 50 MCQs.',wt:'h'},
  {ch:'Morphology of Plants',task:'Root, stem, leaf, flower types. 40 MCQs.',wt:'h'},
  {ch:'Anatomy of Plants',task:'Tissues, meristems. 30 MCQs.',wt:'m'},
  {ch:'Structural Org Animals',task:'Tissues, earthworm, cockroach. 40 MCQs.',wt:'h'},
  {ch:'Cell: Unit of Life',task:'Cell organelles, diagrams. 50 MCQs.',wt:'h'},
  {ch:'Biomolecules',task:'Enzyme names, carbohydrates, vitamins. 50 MCQs.',wt:'h'},
  {ch:'Cell Cycle & Division',task:'Mitosis/meiosis stages diagrams. 50 MCQs.',wt:'h'},
  {ch:'Photosynthesis',task:'Z-scheme, Calvin cycle — must diagram. 50 MCQs.',wt:'h'},
  {ch:'Respiration in Plants',task:'Glycolysis, Krebs, ETC. 40 MCQs.',wt:'h'},
  {ch:'Plant Growth & Dev',task:'Phytohormones, photoperiodism. 30 MCQs.',wt:'m'},
  {ch:'Breathing & Gas Exchange',task:'Lung volumes, breathing mechanics. 40 MCQs.',wt:'h'},
  {ch:'Body Fluids & Circulation',task:'Heart anatomy, ECG, blood groups. 50 MCQs.',wt:'h'},
  {ch:'Excretion',task:'Nephron, osmoregulation, dialysis. 40 MCQs.',wt:'h'},
  {ch:'Locomotion & Movement',task:'Joint types, muscles, disorders. 30 MCQs.',wt:'m'},
  {ch:'Neural Control',task:'Neuron, AP, brain parts, reflexes. 50 MCQs.',wt:'h'},
  {ch:'Chemical Coordination',task:'All hormones, glands, disorders. 50 MCQs.',wt:'h'},
];
    const P2_PHY = [
  {ch:'Electrostatics',task:'Coulomb, Gauss, potential, capacitors. 50 MCQs.',wt:'h',conn:true},
  {ch:'Current Electricity',task:'Ohm, Kirchhoff, Wheatstone. 50 MCQs.',wt:'h',conn:true},
  {ch:'Magnetic Effects',task:'Biot-Savart, Ampere, force. 40 MCQs.',wt:'h',conn:true},
  {ch:'Magnetism & Matter',task:'Dia/para/ferro, magnetic moment. 30 MCQs.',wt:'m'},
  {ch:'EMI & AC Circuits',task:'Faraday, Lenz, resonance, transformer. 50 MCQs.',wt:'h',conn:true},
  {ch:'EM Waves',task:'Types, spectrum, properties. 20 MCQs.',wt:'l'},
  {ch:'Ray Optics',task:'Mirrors, lenses, prism, TIR. 50 MCQs.',wt:'h',conn:true},
  {ch:'Wave Optics',task:'YDSE, diffraction, polarisation. 40 MCQs.',wt:'m',conn:true},
  {ch:'Dual Nature',task:'Photoelectric, de Broglie, Davisson. 40 MCQs.',wt:'h',conn:true},
  {ch:'Atoms & Nuclei',task:'Bohr model, radioactivity, Q value. 40 MCQs.',wt:'h'},
  {ch:'Semiconductors',task:'Diode, transistor, logic gates. 40 MCQs.',wt:'m'},
];
    const P2_CHE = [
  {ch:'Solutions',task:'Colligative properties, osmosis. 40 MCQs.',wt:'h',conn:true},
  {ch:'Electrochemistry',task:'Nernst, EMF, corrosion, electrolysis. 50 MCQs.',wt:'h',conn:true},
  {ch:'Chemical Kinetics',task:'Rate law, order, Arrhenius, mechanisms. 50 MCQs.',wt:'h',conn:true},
  {ch:'p-Block (Gr 15-18)',task:'Group 15/16/17/18 reactions. 50 MCQs.',wt:'h',conn:true},
  {ch:'d & f Block',task:'Transition metals, lanthanoids, oxidation states. 40 MCQs.',wt:'m'},
  {ch:'Coordination Compounds',task:'Werner, isomerism, CFSE, naming. 50 MCQs.',wt:'h',conn:true},
  {ch:'Haloalkanes',task:'SN1, SN2, E1, E2 mechanisms. 50 MCQs.',wt:'h',conn:true},
  {ch:'Alcohols, Phenols',task:'Acidity order, Lucas test, reactions. 40 MCQs.',wt:'h',conn:true},
  {ch:'Aldehydes & Ketones',task:'Nucleophilic add, Aldol, Cannizzaro. 50 MCQs.',wt:'h',conn:true},
  {ch:'Carboxylic Acids',task:'Acidity, reactions, derivatives. 30 MCQs.',wt:'m',conn:true},
  {ch:'Amines',task:'Basicity order, diazonium reactions. 40 MCQs.',wt:'h',conn:true},
  {ch:'Biomolecules (12)',task:'Carbohydrates, amino acids, nucleic acids. 30 MCQs.',wt:'m',conn:true},
];
    const P2_BIO = [
  {ch:'Sexual Repro in Plants',task:'Double fertilisation, embryo, endosperm. 50 MCQs.',wt:'h',conn:true},
  {ch:'Human Reproduction',task:'Spermatogenesis, oogenesis, diagrams. 50 MCQs.',wt:'h',conn:true},
  {ch:'Reproductive Health',task:'Contraceptives, STDs, MTP. 30 MCQs.',wt:'m'},
  {ch:'Principles of Inheritance',task:'Mendel, blood groups, linkage, exceptions. 50 MCQs.',wt:'h',conn:true},
  {ch:'Molecular Basis',task:'DNA replication, transcription, translation — 8-10 Qs. 50 MCQs.',wt:'h',conn:true},
  {ch:'Evolution',task:'Hardy-Weinberg, Darwin, human evolution. 40 MCQs.',wt:'m',conn:true},
  {ch:'Human Health & Disease',task:'Pathogens, immunity, cancer, drugs. 50 MCQs.',wt:'h',conn:true},
  {ch:'Microbes in Welfare',task:'Biogas, sewage, antibiotics. 30 MCQs.',wt:'m'},
  {ch:'Biotech: Principles',task:'rDNA, restriction enzymes, PCR, vectors. 50 MCQs.',wt:'h',conn:true},
  {ch:'Biotech: Applications',task:'Bt cotton, gene therapy, GMO, ELISA. 40 MCQs.',wt:'h'},
  {ch:'Organisms & Populations',task:'Interspecific, intraspecific, logistic, age pyramid. 40 MCQs.',wt:'m',conn:true},
  {ch:'Ecosystem',task:'Productivity, energy flow, succession, nutrient cycles. 40 MCQs.',wt:'m'},
  {ch:'Biodiversity',task:'Types of diversity, hotspots, conservation. 30 MCQs.',wt:'m'},
];
    
    // Connections, Chapter metadata, Hourly schedules
    const CONNS = {
  // Physics
  'Electrostatics':'← Laws of Motion / Forces (Ch11)',
  'Current Electricity':'← Units & Measurement (Ch11)',
  'Magnetic Effects':'← Mechanics fundamentals (Ch11)',
  'EMI & AC Circuits':'← Oscillations & Waves (Ch11)',
  'Ray Optics':'← Waves (Ch11)',
  'Wave Optics':'← Oscillations (Ch11)',
  'Dual Nature':'← Kinetic Theory (Ch11)',
  'Atoms & Nuclei':'← Atomic Structure Chem (Ch11)',
  'Semiconductors':'← Modern Physics (Ch12 self)',
  // Chemistry
  'Solutions':'← Basic Concepts (Ch11)',
  'Electrochemistry':'← Redox Reactions (Ch11)',
  'Chemical Kinetics':'← Equilibrium (Ch11)',
  'p-Block (Gr 15-18)':'← p-Block Gr13-14 (Ch11)',
  'Coordination Compounds':'← Chemical Bonding (Ch11)',
  'Haloalkanes':'← Hydrocarbons (Ch11)',
  'Alcohols, Phenols':'← Organic Basics (Ch11)',
  'Aldehydes & Ketones':'← Organic Basics (Ch11)',
  'Carboxylic Acids':'← Organic Basics (Ch11)',
  'Amines':'← Organic Basics (Ch11)',
  'Biomolecules (12)':'← Biomolecules Intro (Ch11)',
  // Biology
  'Sexual Repro in Plants':'← Plant Morphology (Ch11)',
  'Human Reproduction':'← Struct Org Animals (Ch11)',
  'Principles of Inheritance':'← Cell Cycle (Ch11)',
  'Molecular Basis':'← Biomolecules (Ch11)',
  'Evolution':'← Living World / Classification (Ch11)',
  'Human Health & Disease':'← Body Fluids & Circulation (Ch11)',
  'Biotech: Principles':'← Molecular Basis (Ch11)',
  'Organisms & Populations':'← Animal Kingdom (Ch11)',
};
    const CHAPS = {
  bio:[
    ['Cell: Unit of Life','11','Day 15–18','h','—','Organelles,membrane,comparison diagram',],
    ['Biomolecules','11','Day 19–22','h','—','Enzyme kinetics,Vitamins,carb structures',],
    ['Cell Cycle & Division','11','Day 23–25','h','→ Reproduction Ch12','Mitosis/meiosis stages — draw all',],
    ['Photosynthesis','11','Day 26–29','h','—','Z-scheme,Calvin,Blackman — must know',],
    ['Respiration in Plants','11','Day 30–33','m','—','Glycolysis → Krebs → ETC steps',],
    ['Animal Kingdom','11','Day 34–40','h','→ Organisms & Populations Ch12','All phyla + examples + classification',],
    ['Plant Kingdom','11','Day 41–45','m','—','Alternation of generations diagram',],
    ['Morphology of Plants','11','Day 46–49','h','→ Sexual Repro Plants Ch12','Floral formula, placentation, venation',],
    ['Anatomy of Plants','11','Day 50–52','m','—','Tissue types, meristems',],
    ['Structural Org Animals','11','Day 53–56','h','→ Human Reproduction Ch12','Tissues, cockroach, frog anatomy',],
    ['Plant Growth & Dev','11','Day 57–59','m','→ Reproduction Ch12','Phytohormones, photoperiodism',],
    ['Breathing & Gas Exchange','11','Day 60–62','h','→ Human Health Ch12','Lung volumes, breathing mechanics',],
    ['Body Fluids & Circulation','11','Day 63–66','h','→ Human Repro Ch12','ECG, heart anatomy, blood groups',],
    ['Excretion','11','Day 67–69','h','—','Nephron diagram, osmoregulation',],
    ['Locomotion & Movement','11','Day 70–72','m','—','Joint types, muscle anatomy, disorders',],
    ['Neural Control','11','Day 73–76','h','→ Chemical Coord Ch11','Neuron diagram, AP, brain parts',],
    ['Chemical Coordination','11','Day 77–80','h','→ Human Health Ch12','All hormones + glands + disorders',],
    ['Living World','11','Day 1–3','m','→ Evolution Ch12','Taxonomy, ICZN, ICBN rules',],
    ['Biological Classification','11','Day 4–6','h','→ Evolution Ch12','5 kingdoms + examples',],
    ['Plant Kingdom','11','Day 7–9','m','—','Alt. of generations, rep methods',],
    ['Sexual Repro in Plants','12','Day 96–100','h','← Plant Morphology Ch11','Double fert, embryo, endosperm',],
    ['Human Reproduction','12','Day 101–106','h','← Struct Org Animals Ch11','Spermatogenesis, oogenesis, placenta',],
    ['Reproductive Health','12','Day 107–109','m','—','Contraceptives, STDs, MTP',],
    ['Principles of Inheritance','12','Day 110–118','h','← Cell Cycle Ch11','Mendel laws, blood groups, linkage, exceptions',],
    ['Molecular Basis','12','Day 119–128','h','← Biomolecules Ch11','DNA replication, transcription, translation',],
    ['Evolution','12','Day 129–134','m','← Living World/Class Ch11','Hardy-Weinberg, Darwin, human evolution',],
    ['Human Health & Disease','12','Day 135–141','h','← Digestion/Circ Ch11','Pathogens, immunity, cancer, drugs',],
    ['Microbes in Welfare','12','Day 142–145','m','—','Biogas, sewage treatment, antibiotics',],
    ['Biotech: Principles','12','Day 146–151','h','← Molecular Basis Ch11','rDNA, restriction enzymes, PCR, vectors',],
    ['Biotech: Applications','12','Day 152–156','h','—','Bt cotton, gene therapy, GMO, ELISA',],
    ['Organisms & Populations','12','Day 157–161','m','← Animal Kingdom Ch11','Population interactions, logistic growth',],
    ['Ecosystem','12','Day 162–166','m','—','Energy flow, succession, nutrient cycles',],
    ['Biodiversity','12','Day 167–170','m','—','Types, hotspots, conservation strategies',],
  ],
  chem:[
    ['Basic Concepts','11','Day 1–2','h','—','Mole, stoichiometry, limiting reagent',],
    ['Atomic Structure','11','Day 5–9','h','→ Dual Nature Ch12','Bohr model, quantum numbers, orbitals',],
    ['Periodic Table','11','Day 10–14','h','—','IE, EA, electronegativity trends',],
    ['Chemical Bonding','11','Day 15–20','h','→ Coordination Cpds Ch12','VSEPR, hybridisation, MO theory',],
    ['Thermodynamics (Chem)','11','Day 21–25','h','→ Chemical Kinetics Ch12','Hess law, entropy, Gibbs energy',],
    ['Equilibrium','11','Day 26–31','h','→ Electrochemistry Ch12','Kp, Kc, Le Chatelier, buffer solutions',],
    ['Redox Reactions','11','Day 32–34','m','→ Electrochemistry Ch12','Oxidation numbers, balancing methods',],
    ['p-Block (Gr 13-14)','11','Day 35–37','m','→ p-Block Gr15-18 Ch12','B, Al, C, Si chemistry',],
    ['Organic Basics','11','Day 38–43','h','→ All Organic Ch12','IUPAC, isomerism, intermediates, inductive/resonance',],
    ['Hydrocarbons','11','Day 44–49','h','→ Haloalkanes Ch12','Alkane, alkene, alkyne reactions + arenes',],
    ['Practical Chemistry','11','Day 50–51','l','—','Lab techniques, titrations, qualitative analysis',],
    ['Solutions','12','Day 91–95','h','← Basic Concepts Ch11','Colligative properties, osmosis, vant Hoff',],
    ['Electrochemistry','12','Day 96–101','h','← Redox Ch11','Nernst, EMF, SHE, corrosion, electrolysis',],
    ['Chemical Kinetics','12','Day 102–106','h','← Equilibrium Ch11','Rate law, order, Arrhenius, integrated rate',],
    ['p-Block (Gr 15-18)','12','Day 107–113','h','← p-Block Gr13-14 Ch11','Groups 15/16/17/18 reactions',],
    ['d & f Block','12','Day 114–118','m','—','Transition metals, lanthanoids, oxidation states',],
    ['Coordination Compounds','12','Day 119–124','h','← Chemical Bonding Ch11','Werner theory, isomerism, CFSE, naming',],
    ['Haloalkanes','12','Day 125–130','h','← Hydrocarbons Ch11','SN1, SN2, E1, E2 mechanisms',],
    ['Alcohols, Phenols','12','Day 131–135','h','← Organic Basics Ch11','Acidity order, Lucas test, oxidation reactions',],
    ['Aldehydes & Ketones','12','Day 136–141','h','← Organic Basics Ch11','Nucleophilic addition, Aldol, Cannizzaro',],
    ['Carboxylic Acids','12','Day 142–145','m','← Organic Basics Ch11','Acidity, Fischer esterification, amide',],
    ['Amines','12','Day 146–149','h','← Organic Basics Ch11','Basicity order, diazonium coupling',],
    ['Biomolecules (12)','12','Day 150–153','m','← Biomolecules Bio Ch11','Carbohydrates, amino acids, nucleic acids, enzymes',],
  ],
  phy:[
    ['Units & Measurement','11','Day 1–3','m','—','Dimensional analysis, errors, sig figs',],
    ['Kinematics 1D','11','Day 4–7','h','—','v-t graphs, equations, free fall',],
    ['Kinematics 2D','11','Day 8–11','h','—','Projectile, relative motion, circular',],
    ['Laws of Motion','11','Day 12–16','h','→ EMI/Current Ch12','FBD, friction, Atwood, banking',],
    ['Work, Energy & Power','11','Day 17–20','m','—','Conservation laws, elastic/inelastic',],
    ['Rotational Motion','11','Day 21–26','h','—','MOI table, torque, rolling, angular momentum',],
    ['Gravitation','11','Day 27–30','m','—','Kepler, orbital, escape, satellites',],
    ['Properties of Matter','11','Day 31–33','m','—','Elasticity, viscosity, surface tension, capillary',],
    ['Thermal Properties','11','Day 34–36','m','—','Expansion, specific heat, calorimetry',],
    ['Thermodynamics','11','Day 37–41','h','—','Laws, work done, Carnot cycle, entropy',],
    ['Kinetic Theory','11','Day 42–44','m','—','KE, RMS speed, degrees of freedom',],
    ['Oscillations','11','Day 45–49','h','→ Wave Optics Ch12','SHM, spring-mass, pendulum, resonance',],
    ['Waves','11','Day 50–55','h','→ Ray Optics Ch12','Standing waves, Doppler, organ pipes',],
    ['Experimental Skills','11','Day 56–57','l','—','Vernier, screw gauge, experiments',],
    ['Electrostatics','12','Day 91–97','h','← Laws of Motion Ch11','Coulomb, Gauss law, potential, capacitors',],
    ['Current Electricity','12','Day 98–104','h','← Units/Meas Ch11','Ohm, Kirchhoff, Wheatstone, potentiometer',],
    ['Magnetic Effects','12','Day 105–109','h','← Laws of Motion Ch11','Biot-Savart, Ampere, force on charge/wire',],
    ['Magnetism & Matter','12','Day 110–112','m','—','Magnetic moment, dia/para/ferro',],
    ['EMI & AC Circuits','12','Day 113–119','h','← Oscillations Ch11','Faraday, Lenz, LC circuit, resonance, transformer',],
    ['EM Waves','12','Day 120–121','l','—','Types, spectrum, properties',],
    ['Ray Optics','12','Day 122–128','h','← Waves Ch11','Mirrors, lenses, prism, TIR, optical instruments',],
    ['Wave Optics','12','Day 129–133','m','← Oscillations Ch11','YDSE, diffraction, polarisation',],
    ['Dual Nature','12','Day 134–138','h','← Kinetic Theory Ch11','Photoelectric, de Broglie, Davisson-Germer',],
    ['Atoms & Nuclei','12','Day 139–145','h','← Atomic Struct Chem Ch11','Bohr model, radioactivity, half life, Q value',],
    ['Semiconductors','12','Day 146–152','m','—','Diode, transistor, logic gates, rectifier',],
  ],
};;
    const DEFAULT_SCHEDS = {
  p1:[
    {t:'5:00 AM',a:'Wake up · freshen up · light stretch / breathing',d:'20 min',cat:'break'},
    {t:'5:20 AM',a:'Revise yesterday\'s Biology notes (NCERT scan)',d:'20 min',cat:'bio'},
    {t:'5:40 AM',a:'🌿 BIOLOGY — New chapter: read NCERT slowly, make notes, diagrams',d:'2 hr',cat:'bio'},
    {t:'7:40 AM',a:'🌿 Biology MCQs for today\'s chapter (40–50 Qs) · Update error notebook',d:'45 min',cat:'bio'},
    {t:'8:25 AM',a:'Breakfast + walk outside',d:'30 min',cat:'break'},
    {t:'8:55 AM',a:'🧪 CHEMISTRY — New chapter: NCERT + formula notes',d:'1.5 hr',cat:'che'},
    {t:'10:25 AM',a:'🧪 Chemistry MCQs for today\'s chapter (30 Qs)',d:'35 min',cat:'che'},
    {t:'11:00 AM',a:'Short break',d:'15 min',cat:'break'},
    {t:'11:15 AM',a:'⚡ PHYSICS — New chapter: concepts + derivations',d:'1.5 hr',cat:'phy'},
    {t:'12:45 PM',a:'⚡ Physics MCQs for today\'s chapter (30 Qs)',d:'35 min',cat:'phy'},
    {t:'1:20 PM',a:'Lunch',d:'30 min',cat:'break'},
    {t:'1:50 PM',a:'Mandatory rest / nap',d:'30 min',cat:'break'},
    {t:'2:20 PM',a:'Formula revision · Chemistry reaction sheet · Physics formula cards',d:'1 hr',cat:'rev'},
    {t:'3:20 PM',a:'Weak chapter re-reading (rotating — pick the chapter you struggled with)',d:'50 min',cat:'rev'},
    {t:'4:10 PM',a:'Walk / exercise / sport (non-negotiable)',d:'30 min',cat:'break'},
    {t:'4:40 PM',a:'Mixed MCQ drill (any subject, 50 Qs timed)',d:'1 hr',cat:'test'},
    {t:'5:40 PM',a:'Analyse wrong answers · Update error notebook',d:'20 min',cat:'rev'},
    {t:'6:00 PM',a:'Dinner + short break',d:'45 min',cat:'break'},
    {t:'6:45 PM',a:'Make mindmaps / revision notes for all 3 today\'s chapters',d:'1.25 hr',cat:'rev'},
    {t:'8:00 PM',a:'NCERT Biology — read like a story (2 chapters at light pace)',d:'45 min',cat:'bio'},
    {t:'8:45 PM',a:'Plan tomorrow\'s chapters · Wind down · No screens',d:'15 min',cat:'break'},
    {t:'9:00 PM',a:'Sleep (7.5–8 hrs — non-negotiable)',d:'8 hr',cat:'break'},
  ],
  sunday:[
    {t:'6:00 AM',a:'Wake up · light breakfast · calm mindset',d:'30 min',cat:'break'},
    {t:'6:30 AM',a:'📝 WEEKLY TEST — Physics (this week\'s chapters, 30 Qs, 25 min timed)',d:'25 min',cat:'test'},
    {t:'6:55 AM',a:'📝 WEEKLY TEST — Chemistry (this week\'s chapters, 30 Qs, 25 min timed)',d:'25 min',cat:'test'},
    {t:'7:20 AM',a:'📝 WEEKLY TEST — Biology (this week\'s chapters, 40 Qs, 30 min timed)',d:'30 min',cat:'test'},
    {t:'7:50 AM',a:'Breakfast + walk',d:'30 min',cat:'break'},
    {t:'8:20 AM',a:'Analyse test answers · Mark red-star chapters (got wrong)',d:'45 min',cat:'rev'},
    {t:'9:05 AM',a:'Re-study red-star chapters from this week (all 3 subjects)',d:'2 hr',cat:'rev'},
    {t:'11:05 AM',a:'Short break',d:'20 min',cat:'break'},
    {t:'11:25 AM',a:'NCERT Biology full chapter revision (weakest chapter this week)',d:'1 hr',cat:'bio'},
    {t:'12:25 PM',a:'Lunch + rest',d:'1 hr',cat:'break'},
    {t:'1:25 PM',a:'Update error notebook from this week\'s tests',d:'30 min',cat:'rev'},
    {t:'2:00 PM',a:'Formula + reaction sheet: revise all formulas learned this week',d:'45 min',cat:'rev'},
    {t:'2:45 PM',a:'PYQ practice: 30 questions from previous NEET papers (mixed)',d:'40 min',cat:'test'},
    {t:'3:25 PM',a:'Walk / sport / rest',d:'1 hr',cat:'break'},
    {t:'4:25 PM',a:'Plan next week\'s chapters · Preview upcoming topics',d:'30 min',cat:'break'},
    {t:'4:55 PM',a:'Light reading: any bio chapter you enjoy',d:'30 min',cat:'bio'},
    {t:'5:25 PM',a:'Dinner + family time',d:'1 hr',cat:'break'},
    {t:'6:25 PM',a:'Error notebook review (whole week)',d:'30 min',cat:'rev'},
    {t:'7:00 PM',a:'Relax · no intense studying tonight',d:'–',cat:'break'},
    {t:'9:00 PM',a:'Sleep (earlier than weekdays)',d:'8.5 hr',cat:'break'},
  ],
  p3:[
    {t:'5:00 AM',a:'Wake up · flashcard scan (10 random cards)',d:'15 min',cat:'rev'},
    {t:'5:15 AM',a:'🌿 BIOLOGY — Rapid revision: 2 chapters (NCERT line-by-line, skip nothing)',d:'1.5 hr',cat:'bio'},
    {t:'6:45 AM',a:'🌿 Biology MCQs on those 2 chapters (60 Qs, timed)',d:'1 hr',cat:'test'},
    {t:'7:45 AM',a:'Analyse wrong bio answers · Error notebook',d:'15 min',cat:'rev'},
    {t:'8:00 AM',a:'Breakfast + walk',d:'30 min',cat:'break'},
    {t:'8:30 AM',a:'🧪 CHEMISTRY — Rapid revision: 2 chapters',d:'1 hr',cat:'che'},
    {t:'9:30 AM',a:'🧪 Chemistry MCQs (60 Qs, timed)',d:'1 hr',cat:'test'},
    {t:'10:30 AM',a:'Analyse wrong chem answers · Error notebook',d:'15 min',cat:'rev'},
    {t:'10:45 AM',a:'⚡ PHYSICS — Rapid revision: 2 chapters + derivations',d:'1 hr',cat:'phy'},
    {t:'11:45 AM',a:'⚡ Physics MCQs (40 Qs, timed)',d:'40 min',cat:'test'},
    {t:'12:25 PM',a:'Lunch + rest',d:'45 min',cat:'break'},
    {t:'1:10 PM',a:'Mixed 100Q Timed Test (all 3 subjects · 90 min) — every day from Day 231',d:'90 min',cat:'test'},
    {t:'2:40 PM',a:'Deep answer analysis · Re-study 2 weak topics identified',d:'1 hr',cat:'rev'},
    {t:'3:40 PM',a:'Nap (mandatory)',d:'20 min',cat:'break'},
    {t:'4:00 PM',a:'NCERT Biology — 3 chapters (read carefully, not speed reading)',d:'1 hr',cat:'bio'},
    {t:'5:00 PM',a:'Walk / exercise',d:'30 min',cat:'break'},
    {t:'5:30 PM',a:'Chemistry formula / reaction sheet review (organic reactions)',d:'1 hr',cat:'che'},
    {t:'6:30 PM',a:'Dinner',d:'30 min',cat:'break'},
    {t:'7:00 PM',a:'Error notebook review (past 2 weeks) · Weak chapter targeted revision',d:'1.5 hr',cat:'rev'},
    {t:'8:30 PM',a:'Light easy MCQs (30 Qs — confidence booster, easy set)',d:'30 min',cat:'test'},
    {t:'9:00 PM',a:'Plan tomorrow · Wind down',d:'30 min',cat:'break'},
    {t:'9:30 PM',a:'Sleep',d:'7.5 hr',cat:'break'},
  ],
  p3test:[
    {t:'5:00 AM',a:'Wake up · quick flashcard review',d:'20 min',cat:'rev'},
    {t:'5:20 AM',a:'Bio revision: 3 chapters rapid scan',d:'1 hr',cat:'bio'},
    {t:'6:20 AM',a:'Che revision: 2 chapters rapid scan',d:'45 min',cat:'che'},
    {t:'7:05 AM',a:'Phy revision: 2 chapters + formula',d:'45 min',cat:'phy'},
    {t:'7:50 AM',a:'Breakfast + walk',d:'30 min',cat:'break'},
    {t:'8:20 AM',a:'⚡ MIXED 200Q FULL MOCK (3 subjects, 3h 20min timed)',d:'200 min',cat:'test'},
    {t:'11:40 AM',a:'Break + lunch',d:'30 min',cat:'break'},
    {t:'12:10 PM',a:'Physics section analysis (every wrong answer — why?)',d:'1 hr',cat:'rev'},
    {t:'1:10 PM',a:'Chemistry section analysis',d:'1 hr',cat:'rev'},
    {t:'2:10 PM',a:'Biology section analysis',d:'1 hr',cat:'rev'},
    {t:'3:10 PM',a:'Mandatory nap',d:'30 min',cat:'break'},
    {t:'3:40 PM',a:'Re-study top 3 weak chapters from today\'s mock',d:'1.5 hr',cat:'rev'},
    {t:'5:10 PM',a:'Walk',d:'30 min',cat:'break'},
    {t:'5:40 PM',a:'Error notebook: add today\'s mistakes',d:'30 min',cat:'rev'},
    {t:'6:10 PM',a:'Dinner',d:'30 min',cat:'break'},
    {t:'6:40 PM',a:'Review error notebook from past week',d:'45 min',cat:'rev'},
    {t:'7:25 PM',a:'NCERT Bio: 2 chapters light reading',d:'45 min',cat:'bio'},
    {t:'8:10 PM',a:'Plan tomorrow · Relax',d:'30 min',cat:'break'},
    {t:'8:40 PM',a:'Sleep',d:'8 hr',cat:'break'},
  ],
  p4:[
    {t:'5:00 AM',a:'Wake up · light breakfast · mental warm-up (no heavy reading)',d:'30 min',cat:'break'},
    {t:'5:30 AM',a:'🔴 FULL NEET MOCK TEST — 200 Qs (Physics 45 + Chemistry 45 + Biology 90) · 3h 20min',d:'200 min',cat:'test'},
    {t:'9:10 AM',a:'Break + food + walk (reset mentally)',d:'25 min',cat:'break'},
    {t:'9:35 AM',a:'Deep analysis — Physics section: every wrong answer. Write reason in error notebook.',d:'50 min',cat:'rev'},
    {t:'10:25 AM',a:'Deep analysis — Chemistry section: every wrong answer. Note the concept missed.',d:'50 min',cat:'rev'},
    {t:'11:15 AM',a:'Deep analysis — Biology section: every wrong answer. Map to NCERT line.',d:'50 min',cat:'rev'},
    {t:'12:05 PM',a:'Lunch + mandatory rest',d:'45 min',cat:'break'},
    {t:'12:50 PM',a:'Re-study 2–3 weak chapters identified from today\'s mock',d:'1.5 hr',cat:'rev'},
    {t:'2:20 PM',a:'Nap',d:'30 min',cat:'break'},
    {t:'2:50 PM',a:'PYQ Practice: 50 questions from NEET 2013–2026 (mixed)',d:'50 min',cat:'test'},
    {t:'3:40 PM',a:'Analyse PYQ answers',d:'20 min',cat:'rev'},
    {t:'4:00 PM',a:'Walk / exercise (non-negotiable for mental health)',d:'30 min',cat:'break'},
    {t:'4:30 PM',a:'NCERT Biology: 2–3 chapters careful reading',d:'1 hr',cat:'bio'},
    {t:'5:30 PM',a:'Chemistry reaction summary / formula sheet revision',d:'45 min',cat:'che'},
    {t:'6:15 PM',a:'Dinner + break',d:'45 min',cat:'break'},
    {t:'7:00 PM',a:'Error notebook: review this week\'s mistakes (pattern analysis)',d:'45 min',cat:'rev'},
    {t:'7:45 PM',a:'Light revision of 1 weak chapter (the hardest one for you)',d:'45 min',cat:'rev'},
    {t:'8:30 PM',a:'Plan tomorrow\'s mock strategy (which sections to improve)',d:'15 min',cat:'break'},
    {t:'8:45 PM',a:'Relax · no screens after 9 PM',d:'15 min',cat:'break'},
    {t:'9:00 PM',a:'Sleep (8 hours — non-negotiable in Phase 4)',d:'8 hr',cat:'break'},
  ],
  lastweek:[
    {t:'6:00 AM',a:'Wake up (later than usual — rest matters now)',d:'30 min',cat:'break'},
    {t:'6:30 AM',a:'Light NCERT Biology — 3 chapters at relaxed pace',d:'1 hr',cat:'bio'},
    {t:'7:30 AM',a:'Chemistry formula sheet — read once slowly',d:'30 min',cat:'che'},
    {t:'8:00 AM',a:'Breakfast + walk',d:'45 min',cat:'break'},
    {t:'8:45 AM',a:'Error notebook review — only patterns, not re-learning',d:'45 min',cat:'rev'},
    {t:'9:30 AM',a:'Physics formula cards — read, don\'t solve',d:'30 min',cat:'phy'},
    {t:'10:00 AM',a:'Short 50Q mixed MCQ (familiar topics, confidence boost only)',d:'45 min',cat:'test'},
    {t:'10:45 AM',a:'Break + snack + fresh air',d:'30 min',cat:'break'},
    {t:'11:15 AM',a:'NCERT Biology 2 more chapters (diagrams + bold terms)',d:'1 hr',cat:'bio'},
    {t:'12:15 PM',a:'Lunch',d:'30 min',cat:'break'},
    {t:'12:45 PM',a:'Rest / nap (important — brain consolidates memories during sleep)',d:'1 hr',cat:'break'},
    {t:'1:45 PM',a:'Mindmap revision: draw out 5 complex topics from memory',d:'1 hr',cat:'rev'},
    {t:'2:45 PM',a:'Walk / any physical activity',d:'45 min',cat:'break'},
    {t:'3:30 PM',a:'High-weightage chapter quick revision (Genetics + Molecular Bio)',d:'1 hr',cat:'bio'},
    {t:'4:30 PM',a:'Organic chemistry reactions — one final scan',d:'30 min',cat:'che'},
    {t:'5:00 PM',a:'Dinner early · family time · no studying after 7 PM',d:'2 hr',cat:'break'},
    {t:'7:00 PM',a:'Light reading: favourite bio topic (enjoyment only)',d:'30 min',cat:'bio'},
    {t:'7:30 PM',a:'Sleep early (9 hrs sleep the night before exam)',d:'9 hr',cat:'break'},
  ],
};

    let SCHEDS = {};
    try {
      SCHEDS = JSON.parse(safeGetLocalStorage('neet_v3_custom_scheds') || '{}');
    } catch(e){}
    if (!SCHEDS || typeof SCHEDS !== 'object') {
      SCHEDS = {};
    }
    for (const key in DEFAULT_SCHEDS) {
      if (!SCHEDS[key] || !Array.isArray(SCHEDS[key])) {
        SCHEDS[key] = JSON.parse(JSON.stringify(DEFAULT_SCHEDS[key]));
      }
    }

    // PYQ Bank
    let PYQ_BANK = {};
    
    // Real Yearly Papers (exact questions with diagrams)
    let REAL_YEARLY_PAPERS = {};

    // Global variables for Error Book & Flashcards (declared at top to prevent TDZ errors)
    let errorBookItems = [];
    try {
      errorBookItems = JSON.parse(safeGetLocalStorage('neet_v3_errorbook_items') || '[]');
    } catch(e){}
    let currentDeckKey = 'linked';
    let currentCardIdx = 0;
    const FLASHCARD_DECKS = {
      physics: [
        { q: "What is the value of Rydberg Constant (R)?", a: "1.097 × 10^7 m^-1", cat: "Physics" },
        { q: "Formula for drift velocity of electrons (v_d)?", a: "v_d = I / (n * e * A)", cat: "Physics" },
        { q: "What is the formula for De Broglie Wavelength?", a: "λ = h / p = h / (m * v)", cat: "Physics" },
        { q: "What is the value of permittivity of free space (ε_0)?", a: "8.854 × 10^-12 F/m (or C^2 N^-1 m^-2)", cat: "Physics" },
        { q: "Formula for focal length of a lens in medium (Lens Maker's Formula)?", a: "1/f = (μ_rel - 1) * (1/R_1 - 1/R_2)", cat: "Physics" }
      ],
      chemistry: [
        { q: "Reagent used in Rosenmund Reduction?", a: "H_2 / Pd-BaSO_4 (Palladium on barium sulfate poisoned with quinoline)", cat: "Chemistry" },
        { q: "What organic reaction converts phenol to salicylaldehyde?", a: "Reimer-Tiemann Reaction (using CHCl_3 + aqueous NaOH)", cat: "Chemistry" },
        { q: "Reagent used in Tollens' Test?", a: "Ammoniacal Silver Nitrate solution [Ag(NH_3)_2]+", cat: "Chemistry" },
        { q: "What reaction is used to prepare primary amines from primary amides?", a: "Hoffmann Bromamide Degradation (using Br_2 + NaOH/KOH)", cat: "Chemistry" },
        { q: "What catalyst is used in Ziegler-Natta polymerization?", a: "TiCl_4 + Al(C_2H_5)_3 (Titanium tetrachloride + Triethylaluminium)", cat: "Chemistry" }
      ],
      biology: [
        { q: "Example of a Haplontic Life Cycle?", a: "Volvox, Spirogyra, and some species of Chlamydomonas", cat: "Biology" },
        { q: "Name the non-membranous organelle found in animal cells that helps in cell division.", a: "Centrosome (containing Centrioles)", cat: "Biology" },
        { q: "Example of a hormone-releasing IUD?", a: "Progestasert and LNG-20", cat: "Biology" },
        { q: "Which NCERT example represents an egg-laying mammal (Monotreme)?", a: "Ornithorhynchus (Platypus)", cat: "Biology" },
        { q: "What is the key respiratory pigment in earthworms?", a: "Hemoglobin dissolved in plasma (Earthworms have closed circulatory system)", cat: "Biology" }
      ]
    };

    // Asynchronously fetch databases for faster page load
    fetch('pyq_bank.json?v=3.1')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load pyq_bank.json');
        return res.json();
      })
      .then(pyqData => {
        PYQ_BANK = pyqData;
        REAL_YEARLY_PAPERS = {};
        console.log('Successfully loaded PYQ database.');
        // Re-render components once data is available
        if (typeof renderPlan === 'function') renderPlan();
        if (typeof loadSelectedFlashcardDeck === 'function') loadSelectedFlashcardDeck();
      })
      .catch(err => {
        console.error('Error loading database JSON files:', err);
      });
    
    // Quick subject lookup sets
    window.PHYS_CHAPS_SET = new Set(P1_PHY.concat(P2_PHY).map(c => c.ch.toLowerCase().replace(/[^a-z0-9]/g, '')));
    window.CHEM_CHAPS_SET = new Set(P1_CHE.concat(P2_CHE).map(c => c.ch.toLowerCase().replace(/[^a-z0-9]/g, '')));
    
    // Force plan start date to exactly June 29, 2026 before evaluation
    if (safeGetLocalStorage("planStart") !== "2026-06-29T00:00:00") {
      safeSetLocalStorage("planStart", "2026-06-29T00:00:00");
    }

    // 309-Day Plan Engine
    let parsedStartDate = new Date(safeGetLocalStorage("planStart") || "2026-06-29T00:00:00");
    if (isNaN(parsedStartDate.getTime())) {
      parsedStartDate = new Date(2026, 5, 29, 0, 0, 0); // June 29, 2026
    }
    const START_DATE = parsedStartDate;
    const EXAM_DATE = new Date(2027, 4, 3, 0, 0, 0); // May 3, 2027
    const DIFF = Math.ceil((EXAM_DATE - START_DATE) / (1000 * 60 * 60 * 24)) + 1; // 309 days

    
        // --- Yakeen NEET 2.0 2027 Date-Based Planner Database ---
    const BATCH_LECTURES = {"2026-06-29": {"p": "Basic Maths & Calculus(Mathematical Tools)Trigonometry1", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Some Basic Concept of Chemistry Dalton's Atomic Theory Types of partical and its calculation1", "c_ch": "Basic Concepts", "b": "[Botany] Cell - The Unit of Life What is a Cell ? Discovery of the CellMicroscopyCell Theory (L1)", "b_ch": "Cell: Unit of Life"}, "2026-06-30": {"p": "Basic Maths & Calculus(Mathematical Tools)Trigonometry2", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Some Basic Concept of ChemistryMolar Mass, AMU, Mole2", "c_ch": "Basic Concepts", "b": "[Zoology] Structural Organization in Animals TissuesAnimal Tissues1", "b_ch": "Structural Org Animals"}, "2026-07-01": {"p": "Basic Maths & Calculus(Mathematical Tools)Algebra (L3)", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Some Basic Concept of ChemistryMole concept, Average molar Mass3", "c_ch": "Basic Concepts", "b": "[Zoology] Structural Organization in Animals Epithelium Tissue2", "b_ch": "Structural Org Animals"}, "2026-07-02": {"p": "Basic Maths & Calculus(Mathematical Tools)Binomial (L4)", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Some Basic Concept of ChemistryVD, Mass % Age, Average Molar Mass4", "c_ch": "Basic Concepts", "b": "[Zoology] Structural Organization in Animals Epithelium Tissue3", "b_ch": "Structural Org Animals"}, "2026-07-03": {"p": "Basic Maths & Calculus(Mathematical Tools)APGP (L5)", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Some Basic Concept of ChemistryStoichiometry, Limiting reagent5", "c_ch": "Basic Concepts", "b": "[Botany] Cell - The Unit of Life Overview of CellTypes of cell2", "b_ch": "Cell: Unit of Life"}, "2026-07-04": {"p": "Basic Maths & Calculus(Mathematical Tools)Graphs (L6)", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Some Basic Concept of Chemistry% age yield, Impure sample, Laws of chemical combination6", "c_ch": "Basic Concepts", "b": "[Botany] Cell - The Unit of Life Structure Prokaryotic cellProkaryotic cells (L3)", "b_ch": "Cell: Unit of Life"}, "2026-07-06": {"p": "Basic Maths & Calculus(Mathematical Tools)Logarithms7", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Some Basic Concept of ChemistryEF & EF Concentration Terms7", "c_ch": "Basic Concepts", "b": "[Botany] Cell - The Unit of Life Eukaryotic cells-14", "b_ch": "Cell: Unit of Life"}, "2026-07-07": {"p": "Basic Maths & Calculus(Mathematical Tools)Coordinate Geometry8", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Some Basic Concept of ChemistryConcentration Term Continuous8", "c_ch": "Basic Concepts", "b": "[Botany] Cell - The Unit of Life Eukaryotic cells-25", "b_ch": "Cell: Unit of Life"}, "2026-07-08": {"p": "Basic Maths & Calculus(Mathematical Tools)Coordinate Geometry9", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Some Basic Concept of ChemistryEquivalents Mass, Normality9", "c_ch": "Basic Concepts", "b": "[Zoology] Structural Organization in Animals Cell Junctions4", "b_ch": "Structural Org Animals"}, "2026-07-09": {"p": "Basic Maths & Calculus(Mathematical Tools)Differentiation10", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Some Basic Concept of ChemistryEquivalents Mass, Normality10", "c_ch": "Basic Concepts", "b": "[Zoology] Structural Organization in Animals Connective Tissue5", "b_ch": "Structural Org Animals"}, "2026-07-10": {"p": "Basic Maths & Calculus(Mathematical Tools)Question Practice11", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Some Basic Concept of ChemistryConcentration of mixture11", "c_ch": "Basic Concepts", "b": "[Zoology] Structural Organization in Animals Connective Tissue6", "b_ch": "Structural Org Animals"}, "2026-07-11": {"p": "Vectors Introduction of vector and scalarTypes of vectors1", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Some Basic Concept of Chemistry Law of equivalent12", "c_ch": "Basic Concepts", "b": "[Botany] Cell - The Unit of Life Eukaryotic cells-36", "b_ch": "Cell: Unit of Life"}, "2026-07-13": {"p": "Vectors Vector addition2", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Some Basic Concept of ChemistrySignificant Feature13", "c_ch": "Basic Concepts", "b": "[Botany] Cell - The Unit of Life Endosymbiotic Theory7", "b_ch": "Cell: Unit of Life"}, "2026-07-14": {"p": "Vectors vector subtraction3", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Some Basic Concept of ChemistrySignificant Feature14", "c_ch": "Basic Concepts", "b": "[Botany] Cell - The Unit of Life Difference b/w Prokaryotic Vs Eukaryotic cell (L8)", "b_ch": "Cell: Unit of Life"}, "2026-07-15": {"p": "Vectors Resolution of vectorsMultiplication of a vector by scalar4", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Some Basic Concept of ChemistryQuestion Practice15", "c_ch": "Basic Concepts", "b": "[Zoology] Structural Organization in Animals Muscular Tissue7", "b_ch": "Structural Org Animals"}, "2026-07-16": {"p": "Vectors Scalar productVector productVector Projection5", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Redox ReactionOxidation,Reduction and Oxidation Number Calculation (L1)", "c_ch": "Redox Reactions", "b": "[Zoology] Structural Organization in Animals Nervous TissueFROG (L8)", "b_ch": "Structural Org Animals"}, "2026-07-17": {"p": "Vectors Vector product6", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Redox Reactionn-Factor Calculation2", "c_ch": "Redox Reactions", "b": "[Zoology] Structural Organization in Animals FROG (L9)", "b_ch": "Structural Org Animals"}, "2026-07-18": {"p": "Vectors Question Practice7", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Redox ReactionBalancing of Redox ReactionsRedox Titrations-13", "c_ch": "Redox Reactions", "b": "[Botany] Cell - The Unit of Life Question Practice9", "b_ch": "Cell: Unit of Life"}, "2026-07-20": {"p": "Units and MeasurementsPhysical Quantities and Units1", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Redox ReactionRedox Titrations-24", "c_ch": "Redox Reactions", "b": "[Botany] Cell Cycle and Cell DivisionIntroduction1", "b_ch": "Cell Cycle & Division"}, "2026-07-21": {"p": "Units and MeasurementsDimensions and Dimensions formula2", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Redox ReactionQuestion Practice5", "c_ch": "Redox Reactions", "b": "[Botany] Cell Cycle and Cell DivisionPhases of the Cell Cycle2", "b_ch": "Cell Cycle & Division"}, "2026-07-22": {"p": "Units and MeasurementsDimensions and Dimensions formulaDimensional Analysis3", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Solutions Solution (L1)", "c_ch": "Solutions", "b": "[Zoology] Structural Organization in Animals COCKROACH (L10)", "b_ch": "Structural Org Animals"}, "2026-07-23": {"p": "Units and MeasurementsDimensions and Dimensions formulaDimensional Analysis4", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Solutions Binary Solution and Concentration Terms2", "c_ch": "Solutions", "b": "[Zoology] Structural Organization in Animals COCKROACH (L11)", "b_ch": "Structural Org Animals"}, "2026-07-24": {"p": "Units and MeasurementsDimensions and Dimensions formulaDimensional Analysis5", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Solutions Solubility and Henry Law3", "c_ch": "Solutions", "b": "[Zoology] Structural Organization in Animals COCKROACH (L12)", "b_ch": "Structural Org Animals"}, "2026-07-25": {"p": "Units and MeasurementsSignificant Figures6", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Solutions Raoult’s law & its application4", "c_ch": "Solutions", "b": "[Botany] Cell Cycle and Cell DivisionMitosis (L3)", "b_ch": "Cell Cycle & Division"}, "2026-07-27": {"p": "Units and MeasurementsErrors in Measurement7", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Solutions Ideal & non ideal solutions5", "c_ch": "Solutions", "b": "[Botany] Cell Cycle and Cell DivisionMitotic Inhibitors4", "b_ch": "Cell Cycle & Division"}, "2026-07-28": {"p": "Units and MeasurementsErrors in Measurement8", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Solutions Colligative properties- (L16)", "c_ch": "Solutions", "b": "[Botany] Cell Cycle and Cell DivisionSpecial Type of MitosisMeiosis (L5)", "b_ch": "Cell Cycle & Division"}, "2026-07-29": {"p": "Units and MeasurementsMeasuring Instruments9", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Solutions Colligative properties -27", "c_ch": "Solutions", "b": "[Zoology] Structural Organization in Animals Question Practice13", "b_ch": "Structural Org Animals"}, "2026-07-30": {"p": "Units and MeasurementsQuestion Practice10", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Solutions Abnormal molar mass8", "c_ch": "Solutions", "b": "[Zoology] Breathing and Exchange of GasesIntroduction and Respiratory organs in AnimalsHuman respiratory system : Nostrils, Nasal chamber, Pharynx, Larynx, Trachea1", "b_ch": "Breathing & Gas Exchange"}, "2026-07-31": {"p": "Motion in a straight lineIntroduction of mechanicsframe of referencedistance and displacement1", "p_ch": "Kinematics 1D", "c": "[Physical Chemistry] Solutions Abnormal molar mass9", "c_ch": "Solutions", "b": "[Zoology] Breathing and Exchange of GasesHuman respiratory system : Bronchi, Bronchioles (Conducting part), Lungs and Alveoli (Respiratory part)2", "b_ch": "Breathing & Gas Exchange"}, "2026-08-01": {"p": "Motion in a straight lineAverage speed and average velocity2", "p_ch": "Kinematics 1D", "c": "[Physical Chemistry] Solutions Question Practice10", "c_ch": "Solutions", "b": "[Botany] Cell Cycle and Cell DivisionTypes of MeiosisNondisjunction6", "b_ch": "Cell Cycle & Division"}, "2026-08-03": {"p": "Motion in a straight lineInstantaneous velocity and its speed3", "p_ch": "Kinematics 1D", "c": "[Physical Chemistry] Thermodynamics&ThermochemistryThermodynamics Parameters, Pressure – volume workWork done in various processes1", "c_ch": "Thermodynamics (Chem)", "b": "[Botany] Cell Cycle and Cell DivisionQuestion Practice7", "b_ch": "Cell Cycle & Division"}, "2026-08-04": {"p": "Motion in a straight lineAcceleration4", "p_ch": "Kinematics 1D", "c": "[Physical Chemistry] Thermodynamics&ThermochemistryFirst law of thermodynamics2", "c_ch": "Thermodynamics (Chem)", "b": "[Botany] The Living WorldIntroductionWhat is Living?1", "b_ch": "Living World"}, "2026-08-05": {"p": "Motion in a straight lineUniform motionUniform acceleration5", "p_ch": "Kinematics 1D", "c": "[Physical Chemistry] Thermodynamics&ThermochemistryHeat Capacity3", "c_ch": "Thermodynamics (Chem)", "b": "[Zoology] Breathing and Exchange of GasesMechanism of Breathing : Normal Inspiration and ExpirationForceful Inspiration and Expiration, Pulmonary Volumes (L3)", "b_ch": "Breathing & Gas Exchange"}, "2026-08-06": {"p": "Motion in a straight lineMotion under gravity (Free fall motion)6", "p_ch": "Kinematics 1D", "c": "[Physical Chemistry] Thermodynamics&ThermochemistryAdiabatic work4", "c_ch": "Thermodynamics (Chem)", "b": "[Zoology] Breathing and Exchange of GasesPulmonary Capacities, Exchange of gases (factors affecting the rate of diffusion), Diffusion membranesPartial pressures of Oxygen and Carbon dioxide, exchange of gases between blood and Tissues, Transport of Oxygen4", "b_ch": "Structural Org Animals"}, "2026-08-07": {"p": "Motion in a straight lineMotion under gravity (Free fall motion)7", "p_ch": "Kinematics 1D", "c": "[Physical Chemistry] Thermodynamics&ThermochemistrySpontaneity of processes , Entropy5", "c_ch": "Thermodynamics (Chem)", "b": "[Zoology] Breathing and Exchange of GasesTransport of Carbon dioxide and Factors affecting the Haemoglobin oxygen dissociation (L5)", "b_ch": "Breathing & Gas Exchange"}, "2026-08-08": {"p": "Motion in a straight lineGraph of 1D motion8", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Thermodynamics&ThermochemistryGibbs Free Energy6", "c_ch": "Thermodynamics (Chem)", "b": "[Botany] The Living WorldDiversity in the Living World Taxonomic Categories2", "b_ch": "Living World"}, "2026-08-10": {"p": "Motion in a straight lineGraph of 1D motion9", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Thermodynamics&ThermochemistrySecond law of thermodynamics7", "c_ch": "Thermodynamics (Chem)", "b": "[Botany] The Living WorldQuestion Practice3", "b_ch": "Living World"}, "2026-08-11": {"p": "Motion in a straight linevariable acceleration10", "p_ch": "Kinematics 1D", "c": "[Physical Chemistry] Thermodynamics&Thermochemistrythermodynamics & application8", "c_ch": "Thermodynamics (Chem)", "b": "[Botany] Biological Classification Classification1", "b_ch": "Biological Classification"}, "2026-08-12": {"p": "Motion in a straight linevariable acceleration11", "p_ch": "Kinematics 1D", "c": "[Physical Chemistry] Thermodynamics&ThermochemistryThermochemistry9", "c_ch": "Thermodynamics (Chem)", "b": "[Zoology] Breathing and Exchange of GasesRegulation of Respiration (Nervous and Chemical regulation), Disorders of Respiratory system6", "b_ch": "Breathing & Gas Exchange"}, "2026-08-13": {"p": "Motion in a straight lineGraph of 1D motion12", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Thermodynamics&ThermochemistryQuestion Practice10", "c_ch": "Thermodynamics (Chem)", "b": "[Zoology] Breathing and Exchange of GasesQuestion Practice7", "b_ch": "Breathing & Gas Exchange"}, "2026-08-14": {"p": "Motion in a straight lineGraph of 1D motion13", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] Chemical EquilibriumIntroduction to Chemical Equilibrium1", "c_ch": "Equilibrium", "b": "[Zoology] Body Fluids and CirculationIntroduction to body fluidsBloodBlood - Formed Element (L1)", "b_ch": "Body Fluids & Circulation"}, "2026-08-17": {"p": "Motion in a straight lineQuestion Practice14", "p_ch": "Kinematics 1D", "c": "[Physical Chemistry] Chemical EquilibriumEquilibrium Constant & Characteristics2", "c_ch": "Equilibrium", "b": "[Botany] Biological Classification Kingdom : Monera2", "b_ch": "Biological Classification"}, "2026-08-18": {"p": "Motion in a planeProjectile motion1", "p_ch": "Kinematics 2D", "c": "[Physical Chemistry] Chemical EquilibriumApplications of Equilibrium Constant3", "c_ch": "Equilibrium", "b": "[Botany] Biological Classification Kingdom : ProtistaKingdom : Fungi3", "b_ch": "Biological Classification"}, "2026-08-19": {"p": "Motion in a planeProjectile motion2", "p_ch": "Kinematics 2D", "c": "[Physical Chemistry] Chemical EquilibriumLe Chatelier’s principle4", "c_ch": "Equilibrium", "b": "[Zoology] Body Fluids and CirculationBlood GroupsCoagulation of Blood (L2)", "b_ch": "Body Fluids & Circulation"}, "2026-08-20": {"p": "Motion in a planeProjectile motion3", "p_ch": "Kinematics 2D", "c": "[Physical Chemistry] Chemical EquilibriumQuestion Practice5", "c_ch": "Equilibrium", "b": "[Zoology] Body Fluids and CirculationLymphCirculatory PathwaysDouble Circulation3", "b_ch": "Body Fluids & Circulation"}, "2026-08-21": {"p": "Motion in a planeProjectile motion4", "p_ch": "Kinematics 2D", "c": "[Physical Chemistry] Ionic EquilibriumOstwald’s Dilution law & common ion effect1", "c_ch": "Equilibrium", "b": "[Zoology] Body Fluids and CirculationCoronary CirculationHuman Circulatory System (L4)", "b_ch": "Body Fluids & Circulation"}, "2026-08-22": {"p": "Motion in a planeRelative motion5", "p_ch": "Kinematics 2D", "c": "[Physical Chemistry] Ionic EquilibriumIonic product of water & pH concept2", "c_ch": "Equilibrium", "b": "[Botany] Biological Classification kINGDOM Plantae and animalia Symbiotic Associations4", "b_ch": "Biological Classification"}, "2026-08-24": {"p": "Motion in a planeCircular motion-16", "p_ch": "Kinematics 2D", "c": "[Physical Chemistry] Ionic EquilibriumSalt Hydrolysis3", "c_ch": "Equilibrium", "b": "[Botany] Biological Classification VirusesPrionsViroids (L5)", "b_ch": "Biological Classification"}, "2026-08-25": {"p": "Motion in a planeQuestion Practice7", "p_ch": "Kinematics 2D", "c": "[Physical Chemistry] Ionic EquilibriumpH of salt solutions4", "c_ch": "Equilibrium", "b": "[Botany] Biological Classification Question Practice6", "b_ch": "Biological Classification"}, "2026-08-26": {"p": "Laws of motionForceNewton's first law of motion1", "p_ch": "Laws of Motion", "c": "[Physical Chemistry] Ionic EquilibriumBuffer solution5", "c_ch": "Equilibrium", "b": "[Zoology] Body Fluids and CirculationCardiac CycleHeart Sounds (L5)", "b_ch": "Body Fluids & Circulation"}, "2026-08-27": {"p": "Laws of motionLinear momentum2", "p_ch": "Laws of Motion", "c": "[Physical Chemistry] Ionic EquilibriumSolubility product6", "c_ch": "Equilibrium", "b": "[Zoology] Body Fluids and CirculationBlood VesselsPortal system ECG6", "b_ch": "Body Fluids & Circulation"}, "2026-08-29": {"p": "Laws of motionNewton's second law of motion3", "p_ch": "Laws of Motion", "c": "[Physical Chemistry] Ionic EquilibriumPrecipitation conceptIndicators & titration7", "c_ch": "Equilibrium", "b": "[Botany] Plant KingdomIntroduction (L1)", "b_ch": "Plant Kingdom"}, "2026-08-31": {"p": "Laws of motionNewton's third law of motionFree body diagram4", "p_ch": "Laws of Motion", "c": "[Physical Chemistry] Ionic EquilibriumQuestion Practice8", "c_ch": "Equilibrium", "b": "[Botany] Plant KingdomTypes of Classification Systems2", "b_ch": "Plant Kingdom"}, "2026-09-01": {"p": "Laws of motionWorking with newton's first law5", "p_ch": "Laws of Motion", "c": "[Physical Chemistry] ElectrochemistryIntroduction to Electrolysis & Laws of electrolysis (L1)", "c_ch": "Electrochemistry", "b": "[Botany] Plant Kingdom Algae (L3)", "b_ch": "Plant Kingdom"}, "2026-09-02": {"p": "Laws of motionWorking with newton's second law6", "p_ch": "Laws of Motion", "c": "[Physical Chemistry] ElectrochemistryElectrolytic conductance -12", "c_ch": "Electrochemistry", "b": "[Zoology] Body Fluids and CirculationRegulation of Cardiac ActivityDisorders of Circulatory System7", "b_ch": "Body Fluids & Circulation"}, "2026-09-03": {"p": "Laws of motionCalculation of acceleration7", "p_ch": "Laws of Motion", "c": "[Physical Chemistry] ElectrochemistryElectrolytic conductance - (L23)", "c_ch": "Electrochemistry", "b": "[Zoology] Body Fluids and CirculationQuestion Practice8", "b_ch": "Body Fluids & Circulation"}, "2026-09-04": {"p": "Laws of motionSpring forceFrame of referenceRocket propulsion8", "p_ch": "Laws of Motion", "c": "[Physical Chemistry] ElectrochemistryKohlrausch's LawQualitative and quantitative aspects of Electrolysis (L4)", "c_ch": "Practical Chemistry", "b": "[Zoology] Excretory Products & their Elimination IntroductionExcretory StructuresHuman Excretory SystemLS of kidney NephronMechanism of Urine formation (L1)", "b_ch": "Excretion"}, "2026-09-05": {"p": "Laws of motionFrictionTypes of friction9", "p_ch": "Laws of Motion", "c": "[Physical Chemistry] ElectrochemistryElectrochemical Cell & Galvanic cellsStandard electrode potential & EMF5", "c_ch": "Electrochemistry", "b": "[Botany] Plant Kingdom Bryophytes4", "b_ch": "Plant Kingdom"}, "2026-09-07": {"p": "Laws of motionGraph between applied force and force of friction10", "p_ch": "Units & Measurement", "c": "[Physical Chemistry] ElectrochemistryNernst EquationConcentration cellsTypes of Batteries6", "c_ch": "Electrochemistry", "b": "[Botany] Plant KingdomPteridophytes5", "b_ch": "Plant Kingdom"}, "2026-09-08": {"p": "Laws of motionAngle of friction and angle of repose11", "p_ch": "Laws of Motion", "c": "[Physical Chemistry] ElectrochemistryQuestion Practice7", "c_ch": "Electrochemistry", "b": "[Botany] Plant KingdomGymnosperms6", "b_ch": "Plant Kingdom"}, "2026-09-09": {"p": "Laws of motionAcceleration of body on a rough surface12", "p_ch": "Laws of Motion", "c": "[Physical Chemistry] Chemical KineticsRate of ReactionIntegrated Rate Equations1", "c_ch": "Chemical Kinetics", "b": "[Zoology] Excretory Products & their Elimination Functions of The TubuleMechanism of concentration of filtrateMicturitionUrineRole of Other Organs in Excretion Regulation of Kidney Function - Kidney (L2)", "b_ch": "Excretion"}, "2026-09-10": {"p": "Laws of motionDynamics of circular motion13", "p_ch": "Kinematics 2D", "c": "[Physical Chemistry] Chemical KineticsSimple Methods to determine order of reaction, Order of reaction from mechanismPseudo first order reaction, Zero order reaction- graphs & half life2", "c_ch": "Chemical Kinetics", "b": "[Zoology] Excretory Products & their EliminationRegulation of Kidney Function - Hypothalamus Regulation of Kidney Function - Adrenal cortexCounter current mechanism Regulation of Kidney Function - Adrenal medulla3", "b_ch": "Excretion"}, "2026-09-11": {"p": "Laws of motionDynamics of circular motion14", "p_ch": "Kinematics 2D", "c": "[Physical Chemistry] Chemical KineticsFirst order reaction half life & average life of first order reactionGraphical, half-life etc. based methods to determine order of reaction3", "c_ch": "Chemical Kinetics", "b": "[Zoology] Excretory Products & their EliminationRegulation of Kidney Function - Heart Regulation of GFRDisorders (L4)", "b_ch": "Excretion"}, "2026-09-12": {"p": "Laws of motionDynamics of circular motion15", "p_ch": "Kinematics 2D", "c": "[Physical Chemistry] Chemical Kinetics Collision theory of reaction rates Activated complex theory Activation energy Temperature dependence of reaction rates Effect of catalystProperties of alpha,beta and gamma Rays Types of Nuclear Reactions Group Displacement Law (L4)", "c_ch": "Chemical Kinetics", "b": "[Botany] Plant KingdomQuestion Practice7", "b_ch": "Plant Kingdom"}, "2026-09-15": {"p": "Laws of motionQuestion Practice16", "p_ch": "Laws of Motion", "c": "[Physical Chemistry] Chemical Kinetics Nuclear Stability Rate of Radioactive Decay Nuclear Fission Nuclear Fusion Radio Carbon Dating (L5)", "c_ch": "Chemical Kinetics", "b": "[Botany] Morphology of Flowering PlantsIntroduction (L1)", "b_ch": "Morphology of Plants"}, "2026-09-16": {"p": "Work, energy and powerWork (L1)", "p_ch": "Work, Energy & Power", "c": "[Physical Chemistry] Chemical KineticsQuestion Practice6", "c_ch": "Chemical Kinetics", "b": "[Zoology] Excretory Products & their EliminationDisorders of the Excretory SystemTreatment for renal failure5", "b_ch": "Excretion"}, "2026-09-17": {"p": "Work, energy and powerEnergy (L2)", "p_ch": "Work, Energy & Power", "c": "[Physical Chemistry] Structure of AtomDiscovery of Fundamental Particles1", "c_ch": "Atomic Structure", "b": "[Zoology] Excretory Products & their EliminationQuestion Practice6", "b_ch": "Excretion"}, "2026-09-18": {"p": "Work, energy and powerwork energy theorem3", "p_ch": "Work, Energy & Power", "c": "[Physical Chemistry] Structure of AtomVarious Models of Atom & failureEnergy as a particle or wave2", "c_ch": "Atomic Structure", "b": "[Zoology] Locomotion & MovementIntroductionLocomotory organsTypes of Movement1", "b_ch": "Locomotion & Movement"}, "2026-09-19": {"p": "Work, energy and powerconservative and non-conservative force4", "p_ch": "Work, Energy & Power", "c": "[Physical Chemistry] Structure of AtomPhotoelectric effect & Black Body radiation3", "c_ch": "Atomic Structure", "b": "[Botany] Morphology of Flowering PlantsThe Root (L2)", "b_ch": "Morphology of Plants"}, "2026-09-21": {"p": "Work, energy and powerpotential energy5", "p_ch": "Work, Energy & Power", "c": "[Physical Chemistry] Structure of AtomBohr's Atomic ModelAtomic Spectra4", "c_ch": "Atomic Structure", "b": "[Botany] Morphology of Flowering PlantsThe StemThe Leaf (L3)", "b_ch": "Morphology of Plants"}, "2026-09-22": {"p": "Work, energy and powerpotential energy6", "p_ch": "Work, Energy & Power", "c": "[Physical Chemistry] Structure of AtomDual nature of Matter & Quantum introductionWave mechanical model of atomQuantum numbers5", "c_ch": "Atomic Structure", "b": "[Botany] Morphology of Flowering PlantsThe InflorescenceThe Flower: Parts and TerminologyThe Seed and The Fruit4", "b_ch": "Morphology of Plants"}, "2026-09-23": {"p": "Work, energy and powerequilibrium7", "p_ch": "Work, Energy & Power", "c": "[Physical Chemistry] Structure of AtomQuestion Practice6", "c_ch": "Atomic Structure", "b": "[Zoology] Locomotion & MovementMusclesTypes of MuscleSkeletal musclesStructure of contractile proteins2", "b_ch": "Locomotion & Movement"}, "2026-09-24": {"p": "Work, energy and powerQuestion Practice8", "p_ch": "Work, Energy & Power", "c": "[Inorganic Chemistry] Classification of Elements and Periodicity in PropertiesIntroduction,Need for Classification of Elements (L1)", "c_ch": "Periodic Table", "b": "[Zoology] Locomotion & MovementMechanism of Muscle ContractionMechanism of Muscle RelaxationRed & White Muscles3", "b_ch": "Locomotion & Movement"}, "2026-09-25": {"p": "Centre of mass and System of Particlescentre of mass1", "p_ch": "Rotational Motion", "c": "[Inorganic Chemistry] Classification of Elements and Periodicity in PropertiesStructural part of modern periodic table , electronic configurations2", "c_ch": "Periodic Table", "b": "[Zoology] Locomotion & MovementSkeletal systemAxial skeletonAppendicular skeleton4", "b_ch": "Locomotion & Movement"}, "2026-09-26": {"p": "Centre of mass and System of Particlescentre of mass2", "p_ch": "Rotational Motion", "c": "[Inorganic Chemistry] Classification of Elements and Periodicity in PropertiesStructural part of modern periodic table , electronic configurations3", "c_ch": "Periodic Table", "b": "[Botany] Morphology of Flowering PlantsSemi -Technical Description of a Typical Flowering Plant and Description of Some Important Families5", "b_ch": "Morphology of Plants"}, "2026-09-28": {"p": "Centre of mass and System of Particlescollisionhead-on collision3", "p_ch": "Rotational Motion", "c": "[Inorganic Chemistry] Classification of Elements and Periodicity in PropertiesScreening Effect and effective nuclear charge4", "c_ch": "Periodic Table", "b": "[Botany] Morphology of Flowering PlantsQuestion Practice6", "b_ch": "Morphology of Plants"}, "2026-09-29": {"p": "Centre of mass and System of Particlescollisionhead-on collision4", "p_ch": "Rotational Motion", "c": "[Inorganic Chemistry] Classification of Elements and Periodicity in PropertiesAtomic Radius5", "c_ch": "Periodic Table", "b": "[Botany] Anatomy of Flowering PlantsIntroductionMeristematic Tissues1", "b_ch": "Anatomy of Plants"}, "2026-09-30": {"p": "Centre of mass and System of Particlescollisionhead-on collision5", "p_ch": "Rotational Motion", "c": "[Inorganic Chemistry] Classification of Elements and Periodicity in PropertiesIonisation Enthalpy6", "c_ch": "Periodic Table", "b": "[Zoology] Locomotion & MovementJointsLever systemDisorders related to muscular system5", "b_ch": "Locomotion & Movement"}, "2026-10-01": {"p": "Centre of mass and System of Particlescollisionhead-on collision6", "p_ch": "Rotational Motion", "c": "[Inorganic Chemistry] Classification of Elements and Periodicity in PropertiesElectron affinity7", "c_ch": "Periodic Table", "b": "[Zoology] Locomotion & MovementQuestion Practice6", "b_ch": "Locomotion & Movement"}, "2026-10-03": {"p": "Centre of mass and System of ParticlesQuestion Practice7", "p_ch": "Rotational Motion", "c": "[Inorganic Chemistry] Classification of Elements and Periodicity in PropertiesElectronegativity8", "c_ch": "Periodic Table", "b": "[Botany] Anatomy of Flowering PlantsPermanent TissuesThe Tissue System2", "b_ch": "Anatomy of Plants"}, "2026-10-05": {"p": "Rotational MotionIntroductionrigid body1", "p_ch": "Rotational Motion", "c": "[Inorganic Chemistry] Classification of Elements and Periodicity in PropertiesElectronegativity9", "c_ch": "Periodic Table", "b": "[Botany] Anatomy of Flowering PlantsAnatomy of Dicotyledonous and Monocotyledonous Plants: Roots3", "b_ch": "Anatomy of Plants"}, "2026-10-06": {"p": "Rotational Motionmoment of inertia2", "p_ch": "Rotational Motion", "c": "[Inorganic Chemistry] Classification of Elements and Periodicity in PropertiesNature of Oxides10", "c_ch": "Periodic Table", "b": "[Botany] Anatomy of Flowering PlantsAnatomy of Dicotyledonous and Monocotyledonous Plants : Stem4", "b_ch": "Anatomy of Plants"}, "2026-10-07": {"p": "Rotational Motionmoment of inertia3", "p_ch": "Rotational Motion", "c": "[Inorganic Chemistry] Classification of Elements and Periodicity in PropertiesNature of Oxides11", "c_ch": "Periodic Table", "b": "[Zoology] Neural Control & CoordinationIntroductionNeural systemHuman neural system1", "b_ch": "Neural Control"}, "2026-10-08": {"p": "Rotational Motiontheorems of moment of inertia4", "p_ch": "Rotational Motion", "c": "[Inorganic Chemistry] Classification of Elements and Periodicity in PropertiesHistorical Development of Classification of Elements Question practice session12", "c_ch": "Periodic Table", "b": "[Zoology] Neural Control & CoordinationNeuron (L2)", "b_ch": "Neural Control"}, "2026-10-09": {"p": "Rotational Motionradius of gyrationtorquenewtons laws for rotation5", "p_ch": "Laws of Motion", "c": "[Inorganic Chemistry] Classification of Elements and Periodicity in PropertiesHistorical Development of Classification of Elements Question practice session13", "c_ch": "Periodic Table", "b": "[Zoology] Neural Control & CoordinationGeneration and conduction of nerve impulseTransmission of Impulses3", "b_ch": "Neural Control"}, "2026-10-10": {"p": "Rotational Motionangular momentum6", "p_ch": "Rotational Motion", "c": "[Inorganic Chemistry] Classification of Elements and Periodicity in PropertiesQuestion Practice14", "c_ch": "Periodic Table", "b": "[Botany] Anatomy of Flowering PlantsAnatomy of Dicotyledonous and Monocotyledonous Plants : Leaf5", "b_ch": "Anatomy of Plants"}, "2026-10-12": {"p": "Rotational Motionrotational kinetic energy7", "p_ch": "Work, Energy & Power", "c": "[Inorganic Chemistry] Chemical Bonding and Molecular StructureKössel - Lewis Approach to Chemical Bonding ,Octet Rule1", "c_ch": "Chemical Bonding", "b": "[Botany] Anatomy of Flowering PlantsQuestion Practice6", "b_ch": "Anatomy of Plants"}, "2026-10-13": {"p": "Rotational Motionconservation of total mechanical energy8", "p_ch": "Work, Energy & Power", "c": "[Inorganic Chemistry] Chemical Bonding and Molecular StructureFormal Charge, Covalency, coordinate bond2", "c_ch": "Chemical Bonding", "b": "[Botany] Respiration in PlantsIntroductionGlycolysis or EMP pathway1", "b_ch": "Respiration in Plants"}, "2026-10-14": {"p": "Rotational Motionrolling motionrolling motion on inclined plane9", "p_ch": "Kinematics 2D", "c": "[Inorganic Chemistry] Chemical Bonding and Molecular StructureVSEPR Theory3", "c_ch": "Chemical Bonding", "b": "[Zoology] Neural Control & CoordinationSynapseMechanism of impulse transmission (L4)", "b_ch": "Neural Control"}, "2026-10-15": {"p": "Rotational Motioncomparison between translational and rotational motion (L10)", "p_ch": "Rotational Motion", "c": "[Inorganic Chemistry] Chemical Bonding and Molecular StructureVSEPR Theory4", "c_ch": "Chemical Bonding", "b": "[Zoology] Neural Control & CoordinationNeurotransmittersCentral nervous system(CNS) (L5)", "b_ch": "Neural Control"}, "2026-10-16": {"p": "Rotational Motioncomparison between translational and rotational motion (L11)", "p_ch": "Rotational Motion", "c": "[Inorganic Chemistry] Chemical Bonding and Molecular StructureValence Bond Theory (VBT), hybridisation applications of hybridisation5", "c_ch": "Chemical Bonding", "b": "[Zoology] Neural Control & CoordinationHuman BrainSpinal cord (L6)", "b_ch": "Neural Control"}, "2026-10-17": {"p": "Rotational MotionQuestion Practice12", "p_ch": "Rotational Motion", "c": "[Inorganic Chemistry] Chemical Bonding and Molecular StructureValence Bond Theory (VBT), hybridisation applications of hybridisation6", "c_ch": "Chemical Bonding", "b": "[Botany] Respiration in PlantsFermentation2", "b_ch": "Respiration in Plants"}, "2026-10-19": {"p": "GravitationLaw of Gravitation1", "p_ch": "Gravitation", "c": "[Inorganic Chemistry] Chemical Bonding and Molecular StructureOverlapping (L7)", "c_ch": "Chemical Bonding", "b": "[Botany] Respiration in PlantsAerobic respiration3", "b_ch": "Respiration in Plants"}, "2026-10-21": {"p": "GravitationAcceleration due to gravity2", "p_ch": "Gravitation", "c": "[Inorganic Chemistry] Chemical Bonding and Molecular StructureBond identity, bond strength orders8", "c_ch": "Chemical Bonding", "b": "[Zoology] Neural Control & CoordinationQuestion Practice7", "b_ch": "Neural Control"}, "2026-10-22": {"p": "GravitationGravitational potential energygravitational potential3", "p_ch": "Work, Energy & Power", "c": "[Inorganic Chemistry] Chemical Bonding and Molecular StructureDipole moment9", "c_ch": "Chemical Bonding", "b": "[Zoology] Chemical Coordination & IntegrationIntroductionEndocrine glandsHormones (L1)", "b_ch": "Chemical Coordination"}, "2026-10-23": {"p": "GravitationRelation between field and potentialescape velocitySatellite motion4", "p_ch": "Gravitation", "c": "[Inorganic Chemistry] Chemical Bonding and Molecular StructureIonic bond , gen properties of ionic compounds10", "c_ch": "Chemical Bonding", "b": "[Zoology] Chemical Coordination & IntegrationTypes of hormonesHypothalamusPituitary gland/HypophysisThyroid glandParathyroid gland2", "b_ch": "Chemical Coordination"}, "2026-10-24": {"p": "GravitationKepler's law of planetary motion5", "p_ch": "Kinematics 2D", "c": "[Inorganic Chemistry] Chemical Bonding and Molecular StructureLattice energy ,fajans rule11", "c_ch": "Chemical Bonding", "b": "[Botany] Respiration in PlantsThe Respiratory Balance Sheet and Amphibolic Pathway4", "b_ch": "Respiration in Plants"}, "2026-10-26": {"p": "Gravitation Question Practice6", "p_ch": "Gravitation", "c": "[Inorganic Chemistry] Chemical Bonding and Molecular StructureApplications of fajans rule12", "c_ch": "Chemical Bonding", "b": "[Botany] Respiration in PlantsRespiratory Quotient5", "b_ch": "Respiration in Plants"}, "2026-10-27": {"p": "Mechanical Properties of SolidsElasticitystressstrainhooke's law1", "p_ch": "Properties of Matter", "c": "[Inorganic Chemistry] Chemical Bonding and Molecular StructureMOT (L13)", "c_ch": "Chemical Bonding", "b": "[Botany] Respiration in PlantsQuestion Practice6", "b_ch": "Respiration in Plants"}, "2026-10-28": {"p": "Mechanical Properties of SolidsModulus of elasticityyoung's modulus2", "p_ch": "Properties of Matter", "c": "[Inorganic Chemistry] Chemical Bonding and Molecular StructureHydrogen Bonding14", "c_ch": "Chemical Bonding", "b": "[Zoology] Chemical Coordination & Integration Thymus glandAdrenal glandAdrenal cortexAdrenal medullaPancreasGonads (L3)", "b_ch": "Chemical Coordination"}, "2026-10-29": {"p": "Mechanical Properties of SolidsQuestion Practice3", "p_ch": "Properties of Matter", "c": "[Inorganic Chemistry] Chemical Bonding and Molecular StructureDipole based forces15", "c_ch": "Chemical Bonding", "b": "[Zoology] Chemical Coordination & Integration TestesLeydig cellsDisorders of testesOvariesDisorders of ovaries (L4)", "b_ch": "Chemical Coordination"}, "2026-10-30": {"p": "Mechanical Properties of FluidsIntroduction of hydrostatics1", "p_ch": "Properties of Matter", "c": "[Inorganic Chemistry] Chemical Bonding and Molecular StructureQuestion Practice16", "c_ch": "Chemical Bonding", "b": "[Zoology] Chemical Coordination & IntegrationHormonal actionHormones of Heart, kidney and Gastrointestinal TractHormonal Feedback5", "b_ch": "Chemical Coordination"}, "2026-10-31": {"p": "Mechanical Properties of FluidsPressure (L2)", "p_ch": "Properties of Matter", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(IUPAC Naming) Tetravalency of carbon: Shapes of Simple molecules - hybridization (s and p): Classification of organic compounds based on functional groups: and those containing halogens, oxygen, nitrogen, and sulphur; Homologous series1", "c_ch": "Organic Basics", "b": "[Botany] Photosynthesis in Higher PlantsIntroductionWhat Do we KnowEarly Experiments1", "b_ch": "Photosynthesis"}, "2026-11-02": {"p": "Mechanical Properties of Fluidspascal's law3", "p_ch": "Properties of Matter", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(IUPAC Naming)Degree of Carbon, Hydrogen, Alcohol, Amine, Degree of Unsaturation, Functional Group2", "c_ch": "Organic Basics", "b": "[Botany] Photosynthesis in Higher PlantsSite of Photosynthesis and Pigments involved in Photosynthesis2", "b_ch": "Photosynthesis"}, "2026-11-03": {"p": "Mechanical Properties of FluidsBuoyancybuoyant force4", "p_ch": "Properties of Matter", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(IUPAC Naming) IUPAC of Alkane3", "c_ch": "Organic Basics", "b": "[Botany] Photosynthesis in Higher PlantsWhat Is Light Reaction and Electron Transport Chain (L3)", "b_ch": "Photosynthesis"}, "2026-11-04": {"p": "Mechanical Properties of FluidsHydrodynamicsequation of continuity5", "p_ch": "Properties of Matter", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(IUPAC Naming)IUPAC of Alkene, Cycloalkene4", "c_ch": "Organic Basics", "b": "[Zoology] Chemical Coordination & IntegrationQuestion Practice6", "b_ch": "Chemical Coordination"}, "2026-11-05": {"p": "Mechanical Properties of FluidsBernoulli theorem6", "p_ch": "Properties of Matter", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(IUPAC Naming)IUPAC of Functional Group5", "c_ch": "Organic Basics", "b": "[Zoology] Animal Kingdom IntroductionKingdom-AnimaliaBasis of ClassificationPhylum- PoriferaPhylum- Coelenterata/Cnidaria (L1)", "b_ch": "Animal Kingdom"}, "2026-11-10": {"p": "Mechanical Properties of FluidsViscositySurface tension7", "p_ch": "Properties of Matter", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(IUPAC Naming)Polyfunctional Group6", "c_ch": "Organic Basics", "b": "[Botany] Photosynthesis in Higher PlantsATP and NADPH Use and Calvin CycleHatch and Slack Pathway, Photorespiration4", "b_ch": "Photosynthesis"}, "2026-11-12": {"p": "Mechanical Properties of FluidsQuestion Practice8", "p_ch": "Properties of Matter", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(IUPAC Naming)IUPAC of Aromatic CompoundCommon Naming7", "c_ch": "Organic Basics", "b": "[Zoology] Animal KingdomPhylum- CtenophoraPhylum- PlatyhelminthesPhylum- Aschelminthes/ Nemathelminthes2", "b_ch": "Animal Kingdom"}, "2026-11-13": {"p": "Thermal Properties of matterThermal expansion1", "p_ch": "Properties of Matter", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(IUPAC Naming)Question Practice8", "c_ch": "Organic Basics", "b": "[Zoology] Animal KingdomPhylum-AnnelidaPhylum-ArthropodaPhylum- Mollusca3", "b_ch": "Animal Kingdom"}, "2026-11-14": {"p": "Thermal Properties of matterApplication of thermal expansion2", "p_ch": "Properties of Matter", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(Isomerism)Isomerism & Type of Isomerism Classification and Structural Isomerism1", "c_ch": "Organic Basics", "b": "[Botany] Photosynthesis in Higher PlantsDifference between C3 and C4 pathway, CAM pathway and Factors affecting photosynthesis5", "b_ch": "Photosynthesis"}, "2026-11-17": {"p": "Thermal Properties of matterSpecific heat capacity3", "p_ch": "Properties of Matter", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(Isomerism)Isomerism & Type of Isomerism Classification and Structural Isomerism2", "c_ch": "Organic Basics", "b": "[Botany] Photosynthesis in Higher PlantsQuestion Practice6", "b_ch": "Photosynthesis"}, "2026-11-18": {"p": "Thermal Properties of matterLatent heatcalorimetry4", "p_ch": "Properties of Matter", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(Isomerism) Geometrical isomerism & Exhibition Cis trans Z/E CIP rule3", "c_ch": "Organic Basics", "b": "[Zoology] Animal Kingdom Phylum- EchinodermataPhylum- HemichordataPhylum-ChordataSubphylum- UrochordataSubphylum- CephalochordataSubphylum- VertebrataClass- Cyclostomata (L4)", "b_ch": "Animal Kingdom"}, "2026-11-19": {"p": "Thermal Properties of matterHeat transferconductionconvectionRadiation (L5)", "p_ch": "Properties of Matter", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(Isomerism) Special cases of G.ICalculation of G.I4", "c_ch": "Organic Basics", "b": "[Zoology] Animal KingdomSuperclass- Pisces (Class- Chondrichthyes)Superclass- Pisces (Class- Osteichthyes)Superclass- Tetrapoda (Class – Amphibia)5", "b_ch": "Animal Kingdom"}, "2026-11-20": {"p": "Thermal Properties of matterQuestion Practice6", "p_ch": "Properties of Matter", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(Isomerism) Conformations: Sawhorse and Newman projections (of ethane,butane cyclohexane )5", "c_ch": "Organic Basics", "b": "[Zoology] Animal KingdomSuperclass- Tetrapoda (Class – Reptiles)Superclass- Tetrapoda (Class – Aves)Superclass- Tetrapoda (Class – Mammalia)6", "b_ch": "Animal Kingdom"}, "2026-11-21": {"p": "Kinetic TheoryIdeal gasesreal gas equation1", "p_ch": "Kinetic Theory", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(Isomerism)Optical isomerism: Basics Polarimeter experiment and Chiral Centre,Stereo Centre6", "c_ch": "Organic Basics", "b": "[Botany] Plant Growth and DevelopmentIntroduction and Seed GerminationGrowth (L1)", "b_ch": "Plant Growth & Dev"}, "2026-11-23": {"p": "Kinetic TheoryQuestion Practice2", "p_ch": "Kinetic Theory", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(Isomerism)Optical isomerism, Plane of symmetry and Center of symmetry (L7)", "c_ch": "Organic Basics", "b": "[Botany] Plant Growth and DevelopmentDifferentiation, Dedifferentiation and Redifferentiation and Development (L2)", "b_ch": "Plant Growth & Dev"}, "2026-11-24": {"p": "ThermodynamicsIntroductionthermal equilibrium and zeroth lawfirst law of thermodynamics1", "p_ch": "Thermal Properties", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(Isomerism)Optical isomerism, Fischer Projection & R,S configuration (L8)", "c_ch": "Organic Basics", "b": "[Botany] Plant Growth and DevelopmentPlant Growth Regulators3", "b_ch": "Plant Growth & Dev"}, "2026-11-25": {"p": "ThermodynamicsDifferent type of processes2", "p_ch": "Thermodynamics", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(Isomerism)Optical isomerism, Exhibition of Optical isomerism9", "c_ch": "Organic Basics", "b": "[Zoology] Animal KingdomQuestion Practice7", "b_ch": "Animal Kingdom"}, "2026-11-26": {"p": "ThermodynamicsSecond law of thermodynamicsheat enginecarnot cycle and carnot engineheat pumprefrigerator3", "p_ch": "Thermodynamics", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(Isomerism)Enantiomers, Diastereomers, Racemic Mixture Resolution Meso Compound,10", "c_ch": "Organic Basics", "b": "[Zoology] Biomolecules IntroductionMethod to analyze chemical composition1", "b_ch": "Biomolecules"}, "2026-11-27": {"p": "ThermodynamicsQuestion Practice4", "p_ch": "Thermodynamics", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(Isomerism) Pseudo Chiral Centre, ,D,L Configuration, Erythro, Threo, Epimer, Anomers, Calculating number of optical and stereoisomersPYQ'S (L11)", "c_ch": "Organic Basics", "b": "[Zoology] Biomolecules MetabolitesMacromoleculesCarbohydrates2", "b_ch": "Biomolecules"}, "2026-11-28": {"p": "OscillationsPeriodic motion and oscillatory motion1", "p_ch": "Oscillations", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(Isomerism) Pseudo Chiral Centre, ,D,L Configuration, Erythro, Threo, Epimer, Anomers, Calculating number of optical and stereoisomersPYQ'S (L12)", "c_ch": "Organic Basics", "b": "[Botany] Plant Growth and DevelopmentQuestion Practice4", "b_ch": "Plant Growth & Dev"}, "2026-11-30": {"p": "OscillationsSome basic terms related with oscillatory motion2", "p_ch": "Oscillations", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(Isomerism) Question Practice13", "c_ch": "Organic Basics", "b": "[Botany] Sexual Reproduction in Flowering Plant Flower- A Fascinating Organ of AngiospermsPre-Fertilization - Structures and Events1", "b_ch": "Sexual Repro in Plants"}, "2026-12-01": {"p": "OscillationsSimple harmonic motion(SHM)equations of SHM3", "p_ch": "Oscillations", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(GOC) Covalent bond fission - Homolytic and heterolytic & Inductive Effect1", "c_ch": "Organic Basics", "b": "[Botany] Sexual Reproduction in Flowering Plant Pre-Fertilization - Structures and Events (L2)", "b_ch": "Sexual Repro in Plants"}, "2026-12-02": {"p": "Oscillations Energy in SHM4", "p_ch": "Work, Energy & Power", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(GOC) Hyperconjugation2", "c_ch": "Organic Basics", "b": "[Zoology] Biomolecules Amino acidsProteinsLipids (L3)", "b_ch": "Biomolecules"}, "2026-12-03": {"p": "OscillationsCalculation of time period of spring block system5", "p_ch": "Oscillations", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(GOC) Application of Hyperconjugation3", "c_ch": "Organic Basics", "b": "[Zoology] BiomoleculesSimple lipids Compound lipidsDerived lipidsNucleic acids4", "b_ch": "Biomolecules"}, "2026-12-04": {"p": "OscillationsQuestion Practice6", "p_ch": "Oscillations", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(GOC) Resonance (Part-1)4", "c_ch": "Organic Basics", "b": "[Zoology] Biomolecules RNADNAEnzymes (L5)", "b_ch": "Biomolecules"}, "2026-12-05": {"p": "Waves Wavesequation of waves1", "p_ch": "Waves", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(GOC) Resonance (Part-2), Stability of resonating Structures5", "c_ch": "Organic Basics", "b": "[Botany] Sexual Reproduction in Flowering Plant PollinationIncompatibilityPollen-pistil interaction3", "b_ch": "Sexual Repro in Plants"}, "2026-12-07": {"p": "Waves Characteristic of waves2", "p_ch": "Waves", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(GOC) Resonance (Part-2), Stability of resonating Structures6", "c_ch": "Organic Basics", "b": "[Botany] Sexual Reproduction in Flowering Plant Artificial HybridizationDouble Fertilization4", "b_ch": "Sexual Repro in Plants"}, "2026-12-08": {"p": "Waves Progressive wave on stringvelocity of transverse wave on stringintensity of wavessound wavesspeed of sound wavecharacteristic of sound wave3", "p_ch": "Waves", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(GOC) Aromaticity, Annulene7", "c_ch": "Organic Basics", "b": "[Botany] Sexual Reproduction in Flowering Plant Post-Fertilisation : Structures and Events5", "b_ch": "Sexual Repro in Plants"}, "2026-12-09": {"p": "Waves Principle of superposition of waveReflection and refraction of waves4", "p_ch": "Waves", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(GOC) Mesomeric Effect8", "c_ch": "Organic Basics", "b": "[Zoology] Biomolecules Question Practice6", "b_ch": "Biomolecules"}, "2026-12-10": {"p": "Waves Stationary waves5", "p_ch": "Waves", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(GOC) Stability of Intermediates, Bond Length and Bond Strength9", "c_ch": "Organic Basics", "b": "[Zoology] Human ReproductionHuman reproductive systemMale reproductive system1", "b_ch": "Human Reproduction"}, "2026-12-11": {"p": "Waves Question Practice6", "p_ch": "Waves", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(GOC) Stability of Intermediates, Bond Length and Bond Strength10", "c_ch": "Organic Basics", "b": "[Zoology] Human ReproductionFemale reproductive system2", "b_ch": "Human Reproduction"}, "2026-12-12": {"p": "Electric Charges and FieldsIntroductionCharge (L1)", "p_ch": "Electrostatics", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(GOC) Stability of Intermediates, Bond Length and Bond Strength11", "c_ch": "Organic Basics", "b": "[Botany] Sexual Reproduction in Flowering Plant Post-Fertilisation : Structures and Events6", "b_ch": "Sexual Repro in Plants"}, "2026-12-14": {"p": "Electric Charges and FieldsCoulomb's Law2", "p_ch": "Electrostatics", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(GOC) Acidic Strength (L12)", "c_ch": "Organic Basics", "b": "[Botany] Sexual Reproduction in Flowering Plant SeedFruit (L7)", "b_ch": "Sexual Repro in Plants"}, "2026-12-15": {"p": "Electric Charges and FieldsCoulomb's Law3", "p_ch": "Electrostatics", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(GOC) Basic Strength13", "c_ch": "Organic Basics", "b": "[Botany] Sexual Reproduction in Flowering Plant Question Practice8", "b_ch": "Sexual Repro in Plants"}, "2026-12-16": {"p": "Electric Charges and FieldsElectric FieldConductors and Insulators4", "p_ch": "Electrostatics", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(GOC) Tautomerism ( Enol Content) electrophiles, and nucleophiles & Type of reactions Substitution, addition, elimination, and rearrangement. PYQ'S (L14)", "c_ch": "Organic Basics", "b": "[Zoology] Human ReproductionGametogenesisSpermatogenesis3", "b_ch": "Human Reproduction"}, "2026-12-17": {"p": "Electric Charges and FieldsElectric Field of a Continuous Charge Distribution5", "p_ch": "Electrostatics", "c": "[Organic Chemistry] Organic Chemistry: Some Basic principles and Techniques(GOC) Question Practice15", "c_ch": "Organic Basics", "b": "[Zoology] Human ReproductionSpermStructure of sperm4", "b_ch": "Human Reproduction"}, "2026-12-18": {"p": "Electric Charges and FieldsElectric Field of a Continuous Charge DistributionMotion of a Charged Particle in Uniform Electric Field6", "p_ch": "Electrostatics", "c": "[Organic Chemistry] Hydrocarbon Basic Organic Chemistry1", "c_ch": "Hydrocarbons", "b": "[Zoology] Human ReproductionOogenesisDifferences between spermatogenesis and oogenesisOvumMenstrual cycle5", "b_ch": "Human Reproduction"}, "2026-12-19": {"p": "Electric Charges and FieldsElectric Field LinesElectric Flux7", "p_ch": "Electrostatics", "c": "[Organic Chemistry] HydrocarbonRearrangement of Carbocation, Types of Reaction2", "c_ch": "Hydrocarbons", "b": "[Botany] Molecular Basis of InheritanceIntroductionThe DNA (L1)", "b_ch": "Molecular Basis"}, "2026-12-21": {"p": "Electric Charges and FieldsGauss LawApplication of gauss's law8", "p_ch": "Electrostatics", "c": "[Organic Chemistry] HydrocarbonMethod of Preparation of Alkane (Part-1)Method of Preparation of Alkane (Part-2)3", "c_ch": "Hydrocarbons", "b": "[Botany] Molecular Basis of InheritanceCentral Dogma2", "b_ch": "Molecular Basis"}, "2026-12-22": {"p": "Electric Charges and FieldsElectric DipoleDipole in a Uniform External FieldShort Dipole in Non-Uniform Electric Field9", "p_ch": "Electrostatics", "c": "[Organic Chemistry] HydrocarbonChemical Properties of Alkane : Mechanism of halogenation of alkanes, Physical Properties of Alkane4", "c_ch": "Hydrocarbons", "b": "[Botany] Molecular Basis of InheritancePackaging of DNA HelixThe Search For Genetic Material3", "b_ch": "Molecular Basis"}, "2026-12-23": {"p": "Electric Charges and FieldsQuestion Practice10", "p_ch": "Electrostatics", "c": "[Organic Chemistry] HydrocarbonMethod of Preparation of Alkene (Part-1)Method of Preparation of Alkene (Part-2)5", "c_ch": "Hydrocarbons", "b": "[Zoology] Human ReproductionFertilisation to Implantation6", "b_ch": "Human Reproduction"}, "2026-12-24": {"p": "Electrostatic Potential and CapacitanceRelation between Electric field (E) & Electric potential (V)2", "p_ch": "Electrostatics", "c": "[Organic Chemistry] HydrocarbonMethod of Preparation of Alkene (Part-3), Mechanism of electrophilic addition: addition of hydrogen, halogens6", "c_ch": "Hydrocarbons", "b": "[Zoology] Human ReproductionSex Determination of Foetus7", "b_ch": "Human Reproduction"}, "2026-12-26": {"p": "Electrostatic Potential and CapacitanceEquipotential Surface3", "p_ch": "Electrostatics", "c": "[Organic Chemistry] HydrocarbonMechanism of electrophilic addition: Water, hydrogen halides (Markownikoff's and peroxide effect)7", "c_ch": "Hydrocarbons", "b": "[Botany] Molecular Basis of InheritanceRNA worldDNA ReplicationDNA Repair (L4)", "b_ch": "Molecular Basis"}, "2026-12-28": {"p": "Electrostatic Potential and CapacitanceElectrostatic potential energyElectric potential due to dipole4", "p_ch": "Work, Energy & Power", "c": "[Organic Chemistry] Hydrocarbon Ozonolysis and polymerization.Method of Preparation of Alkyne8", "c_ch": "Hydrocarbons", "b": "[Botany] Molecular Basis of InheritanceTranscriptionPost Transcriptional Process5", "b_ch": "Molecular Basis"}, "2026-12-29": {"p": "Electrostatic Potential and CapacitanceElectrostatics of Conductor5", "p_ch": "Electrostatics", "c": "[Organic Chemistry] HydrocarbonChemical Properties of Alkyne : Acidic character: Addition of hydrogen, halogens, water, and hydrogen halides: Polymerization.9", "c_ch": "Hydrocarbons", "b": "[Botany] Molecular Basis of InheritanceGenetic Code6", "b_ch": "Molecular Basis"}, "2026-12-30": {"p": "Electrostatic Potential and CapacitanceElectrostatics of Conductor6", "p_ch": "Electrostatics", "c": "[Organic Chemistry] Hydrocarbon MOP of benzene - Properties of Benzene Mechanism of electrophilic substitution: halogenation, nitration.Friedel - Crafts alkylation and acylation, directive influence of the functional group in mono substituted benzene.PYQs (L10)", "c_ch": "Hydrocarbons", "b": "[Zoology] Human ReproductionPregnancy & embryonic developmentParturition & Lactation8", "b_ch": "Human Reproduction"}, "2026-12-31": {"p": "Electrostatic Potential and CapacitanceConductor & its capacitance7", "p_ch": "Electrostatics", "c": "[Organic Chemistry] Hydrocarbon Question Practice11", "c_ch": "Hydrocarbons", "b": "[Zoology] Human ReproductionQuestion Practice9", "b_ch": "Human Reproduction"}, "2027-01-02": {"p": "Electrostatic Potential and CapacitanceCapacitor & its capacitance8", "p_ch": "Electrostatics", "c": "[Organic Chemistry] Haloalkanes and HaloarenesMethods of preparation of haloalkanes1", "c_ch": "Hydrocarbons", "b": "[Botany] Molecular Basis of InheritancetRNA The Adaptor MoleculeTranslation (L7)", "b_ch": "Molecular Basis"}, "2027-01-04": {"p": "Electrostatic Potential and CapacitanceCharging of a capacitorCombination of capacitors9", "p_ch": "Electrostatics", "c": "[Organic Chemistry] Haloalkanes and Haloarenes Chemical Properties of Haloalkane: Nature of C-X bond; Mechanisms of substitution reactions2", "c_ch": "Hydrocarbons", "b": "[Botany] Molecular Basis of InheritanceRegulation of Gene Expression8", "b_ch": "Molecular Basis"}, "2027-01-05": {"p": "Electrostatic Potential and CapacitanceQuestion Practice10", "p_ch": "Electrostatics", "c": "[Organic Chemistry] Haloalkanes and HaloarenesChemical Properties of Haloalkane-Elimination Reactions3", "c_ch": "Hydrocarbons", "b": "[Botany] Molecular Basis of InheritanceHuman Genome Project9", "b_ch": "Molecular Basis"}, "2027-01-06": {"p": "Current ElectricityElectric Current1", "p_ch": "Current Electricity", "c": "[Organic Chemistry] Haloalkanes and HaloarenesReaction with metals Uses; Environmental effects of chloroform, iodoform freons, and DDT.4", "c_ch": "Hydrocarbons", "b": "[Zoology] Reproductive HealthReproductive healthPopulationContraceptive methods1", "b_ch": "Reproductive Health"}, "2027-01-07": {"p": "Current ElectricityCurrent in Conductors2", "p_ch": "Current Electricity", "c": "[Organic Chemistry] Haloalkanes and HaloarenesMethods of preparation of haloarenes5", "c_ch": "Hydrocarbons", "b": "[Zoology] Reproductive HealthMedical termination of pregnancySexually transmitted diseases(STDs)2", "b_ch": "Reproductive Health"}, "2027-01-08": {"p": "Current ElectricityCurrent in Conductors3", "p_ch": "Current Electricity", "c": "[Organic Chemistry] Haloalkanes and HaloarenesChemical Properties of Haloarenes: Mechanism of Aromatic nucleophilic substitution reaction & Benzyne mechanism6", "c_ch": "Hydrocarbons", "b": "[Zoology] Reproductive HealthInfertilityAssisted reproductive technologies(ARTs)3", "b_ch": "Reproductive Health"}, "2027-01-09": {"p": "Current ElectricityKirchhoff's Laws and Combination of Resistances4", "p_ch": "Current Electricity", "c": "[Organic Chemistry] Haloalkanes and HaloarenesMethod of Preparation of Grignard reagentChemical Properties of Grignard Reagent7", "c_ch": "Hydrocarbons", "b": "[Botany] Molecular Basis of InheritanceDNA Analysis MethodsDNA Binding MotifBlotting TechniquesDNA Fingerprinting10", "b_ch": "Molecular Basis"}, "2027-01-11": {"p": "Current ElectricityKirchhoff's Laws and Combination of Resistances5", "p_ch": "Current Electricity", "c": "[Organic Chemistry] Haloalkanes and HaloarenesQuestion Practice8", "c_ch": "Hydrocarbons", "b": "[Botany] Molecular Basis of InheritanceQuestion Practice11", "b_ch": "Molecular Basis"}, "2027-01-12": {"p": "Current ElectricityWheatstone Bridge and Symmetric Circuits6", "p_ch": "Current Electricity", "c": "[Organic Chemistry] Alcohols, Ethers and PhenolsIntroduction to alcohols: identification of primary secondary & tertiary alcohols , Preparation of alcohols: mechanism of dehydration1", "c_ch": "Alcohols, Phenols", "b": "[Botany] Principle of Inheritance and Variation IntroductionGenetic Terminology1", "b_ch": "Principles of Inheritance"}, "2027-01-13": {"p": "Current ElectricityElectrical Measuring Instruments7", "p_ch": "Current Electricity", "c": "[Organic Chemistry] Alcohols, Ethers and PhenolsChemical properties of alcohols2", "c_ch": "Alcohols, Phenols", "b": "[Zoology] Reproductive HealthQuestion Practice4", "b_ch": "Reproductive Health"}, "2027-01-14": {"p": "Current ElectricityElectrical Measuring Instruments8", "p_ch": "Current Electricity", "c": "[Organic Chemistry] Alcohols, Ethers and PhenolsPreparation of Phenol: Acidic nature, electrophilic substitution reactions: halogenation. nitration and sulphonation (L3)", "c_ch": "Alcohols, Phenols", "b": "[Zoology] Human Health and DiseasesIntroduction (L1)", "b_ch": "Human Health & Disease"}, "2027-01-16": {"p": "Current ElectricityQuestion Practice9", "p_ch": "Current Electricity", "c": "[Organic Chemistry] Alcohols, Ethers and PhenolsReimer - Tiemann reaction & Kolbe's Reaction4", "c_ch": "Alcohols, Phenols", "b": "[Botany] Principle of Inheritance and VariationMendel's Experiments on Pea PlantInheritance of One Gene2", "b_ch": "Principles of Inheritance"}, "2027-01-18": {"p": "Moving Charges and MagnetismIntroduction1", "p_ch": "Magnetic Effects", "c": "[Organic Chemistry] Alcohols, Ethers and PhenolsPreparation, Structure of Ethers, Chemical properties of ethers, Epoxides (Oxiranes)Physical Properties of Alcohol, Phenol and Ether (L5)", "c_ch": "Alcohols, Phenols", "b": "[Botany] Principle of Inheritance and Variation Mendel's' Laws of Inheritance3", "b_ch": "Principles of Inheritance"}, "2027-01-19": {"p": "Moving Charges and MagnetismBiot-Savart's Law2", "p_ch": "Magnetic Effects", "c": "[Organic Chemistry] Alcohols, Ethers and PhenolsQuestion Practice6", "c_ch": "Alcohols, Phenols", "b": "[Botany] Principle of Inheritance and VariationExceptions to Mendelian Principles4", "b_ch": "Principles of Inheritance"}, "2027-01-20": {"p": "Moving Charges and MagnetismMagnetic-field due to a current carrying Ring and Problems on combination of Ring and Rod3", "p_ch": "Magnetic Effects", "c": "[Organic Chemistry] Aldehydes, Ketones and Carboxylic AcidsMethod of Preparation of Both Aldehyde and Ketone (L1)", "c_ch": "Aldehydes & Ketones", "b": "[Zoology] Human Health and DiseasesProtozoan DiseaseImmunityInnate immunityAcquired immunity2", "b_ch": "Human Health & Disease"}, "2027-01-21": {"p": "Moving Charges and MagnetismMagnetic-field due to a current carrying Ring and Problems on combination of Ring and Rod4", "p_ch": "Magnetic Effects", "c": "[Organic Chemistry] Aldehydes, Ketones and Carboxylic AcidsMethod of Preparation of Aldehyde only and Ketone only (L2)", "c_ch": "Aldehydes & Ketones", "b": "[Zoology] Human Health and DiseasesLymphoid organsImmunisationVaccination (L3)", "b_ch": "Human Health & Disease"}, "2027-01-22": {"p": "Moving Charges and MagnetismAmpere's Law and Its applications5", "p_ch": "Magnetic Effects", "c": "[Organic Chemistry] Aldehydes, Ketones and Carboxylic AcidsNature of carbonyl group;Nucleophilic addition to >C=O group, relative reactivities of aldehydes and ketones;3", "c_ch": "Aldehydes & Ketones", "b": "[Zoology] Human Health and DiseasesTransplantationAllergyAutoimmunity4", "b_ch": "Human Health & Disease"}, "2027-01-23": {"p": "Moving Charges and MagnetismForce on a moving charge in a Magnetic FieldHelical Path,Lorentz Force and Velocity Selector6", "p_ch": "Magnetic Effects", "c": "[Organic Chemistry] Aldehydes, Ketones and Carboxylic Acids Important reactions such as - Cyanohydrin formation , NaSHO3 addition (L4)", "c_ch": "Aldehydes & Ketones", "b": "[Botany] Principle of Inheritance and Variation Inheritance of Two Gene5", "b_ch": "Principles of Inheritance"}, "2027-01-25": {"p": "Moving Charges and MagnetismQuestion Practice7", "p_ch": "Magnetic Effects", "c": "[Organic Chemistry] Aldehydes, Ketones and Carboxylic AcidsReaction of carbonyl compounds with Alcohols and NH2ZAldol condensation and cannizzaro reaction5", "c_ch": "Alcohols, Phenols", "b": "[Botany] Principle of Inheritance and VariationPolygenic Inheritance and Pleiotropy6", "b_ch": "Principles of Inheritance"}, "2027-01-27": {"p": "Magnetism and MatterBar Magnet and its PropertiesCircular coil as magnetic dipoleTangent GalvanometerOscillation Magnetometer1", "p_ch": "Kinematics 2D", "c": "[Organic Chemistry] Aldehydes, Ketones and Carboxylic Acids Haloform reaction & Chemical tests to distinguish between aldehydes and Ketones.Method of Preparation of Carboxylic AcidChemical properties of Carboxylic Acid part 1Chemical properties of Carboxylic Acid part 2, Physical Properties of Carbonyl Compounds and Carboxylic Acid (L6)", "c_ch": "Aldehydes & Ketones", "b": "[Zoology] Human Health and DiseasesImmunodeficiency disordersCancerDrug abuseAlcohol abuse5", "b_ch": "Human Health & Disease"}, "2027-01-28": {"p": "Magnetism and MatterQuestion Practice2", "p_ch": "Magnetism & Matter", "c": "[Organic Chemistry] Aldehydes, Ketones and Carboxylic AcidsQuestion Practice7", "c_ch": "Aldehydes & Ketones", "b": "[Zoology] Human Health and DiseasesAlcohol abuseTobacco abuseAdolescenceAddiction and dependence6", "b_ch": "Human Health & Disease"}, "2027-01-29": {"p": "Electromagnetic InductionMagnetic Flux and Lenz's Law1", "p_ch": "Magnetic Effects", "c": "[Organic Chemistry] Amines Introduction,Structure of AminesClassification Of Amines ,Nomenclature, identification of primary, secondary, and tertiary amines and their basic character. (L1)", "c_ch": "Organic Basics", "b": "[Zoology] Human Health and DiseasesQuestion Practice7", "b_ch": "Human Health & Disease"}, "2027-01-30": {"p": "Electromagnetic InductionFaraday's LawCalculation of Induced EMF2", "p_ch": "Magnetic Effects", "c": "[Organic Chemistry] Amines Preparation of AminesChemical Reactions Of Amines & AnilinesDiazonium Salts,Physical Properties Importance in synthetic organic chemistry.2", "c_ch": "Amines", "b": "[Botany] Principle of Inheritance and Variation Post-Mendelism7", "b_ch": "Principles of Inheritance"}, "2027-02-01": {"p": "Electromagnetic InductionInduced Electric FieldSelf Inductance3", "p_ch": "Magnetic Effects", "c": "[Organic Chemistry] Amines Question Practice3", "c_ch": "Amines", "b": "[Botany] Principle of Inheritance and Variation Sex Determination8", "b_ch": "Principles of Inheritance"}, "2027-02-02": {"p": "Electromagnetic InductionMutual InductanceInductor in Electrical Circuits4", "p_ch": "Magnetic Effects", "c": "[Organic Chemistry] BiomoleculesCarbohydrates CARBOHYDRATES - Classification; aldoses and ketoses: monosaccharides (glucose and fructose) constituent monosaccharides of oligosaccharides (sucrose, lactose, and maltose).1", "c_ch": "Biomolecules (12)", "b": "[Botany] Principle of Inheritance and Variation Mutation (L9)", "b_ch": "Principles of Inheritance"}, "2027-02-03": {"p": "Electromagnetic InductionQuestion Practice5", "p_ch": "Magnetic Effects", "c": "[Organic Chemistry] Biomolecules Amino Acids: Elementary Idea of a-amino acids, peptide bond, polypeptides. Proteins: primary, secondary, tertiary, and quaternary structure (qualitative idea only), denaturation of proteins, enzymesNucleic acid : Chemical constitution of DNA and RNA. Biological functions of nucleic acids.,Vitamins:Classification and functions. and Hormones (General introduction)Question Practice (L2)", "c_ch": "Practical Chemistry", "b": "[Zoology] Biotechnology: Principles & ProcessesIntroductionPrinciples of biotechnologyGenetic engineering/Recombinant DNA technology1", "b_ch": "Molecular Basis"}, "2027-02-04": {"p": "Alternating CurrentIntroduction to Alternating Current, Average and RMS Values (L1)", "p_ch": "EMI & AC Circuits", "c": "[Organic Chemistry] Purification and Qualitative and quantitative analysis Purification of Qualitative and quantitative analysisCrystallization, sublimation, distillation, differential extraction, and chromatography - principles and their applications.Detection of nitrogen, sulphur, phosphorus, and halogens.(basic principles only) - Estimation of carbon, hydrogen, nitrogen, halogens. sulphur, phosphorus.Calculations of empirical formulae and molecular formulae: umerical problems in organic quantitative analysis.Question Practice (L1)", "c_ch": "Practical Chemistry", "b": "[Zoology] Biotechnology: Principles & ProcessesTools of rDNA technologyProcess of rDNAIsolation of DNA2", "b_ch": "Molecular Basis"}, "2027-02-05": {"p": "Alternating CurrentTypes of AC Circuits, Power & Power Factor2", "p_ch": "Work, Energy & Power", "c": "[Inorganic Chemistry] Coordination Compound Definitions of Some Important Terms Pertaining to Coordination Compounds1", "c_ch": "Coordination Compounds", "b": "[Zoology] Biotechnology: Principles & ProcessesSeparation and isolation of DNA fragmentsVector (L3)", "b_ch": "Molecular Basis"}, "2027-02-06": {"p": "Alternating CurrentQuestion Practice3", "p_ch": "EMI & AC Circuits", "c": "[Inorganic Chemistry] Coordination Compound Classification of Ligands2", "c_ch": "Coordination Compounds", "b": "[Botany] Principle of Inheritance and Variation Genetic DisordersGenetic Disorders: Mendelian Disorders10", "b_ch": "Principles of Inheritance"}, "2027-02-08": {"p": "Electromagnetic WavesCharacteristics of Electromagnetic Waves1", "p_ch": "EM Waves", "c": "[Inorganic Chemistry] Coordination Compound Nomenclature of Coordination Compounds3", "c_ch": "Organic Basics", "b": "[Botany] Principle of Inheritance and VariationGenetic Disorders: Chromosomal Disorders (L11)", "b_ch": "Principles of Inheritance"}, "2027-02-09": {"p": "Electromagnetic WavesQuestion Practice2", "p_ch": "EM Waves", "c": "[Inorganic Chemistry] Coordination Compound Nomenclature of Coordination Compounds4", "c_ch": "Organic Basics", "b": "[Botany] Principle of Inheritance and Variation Cytoplasmic InheritanceDosage Compensation12", "b_ch": "Principles of Inheritance"}, "2027-02-10": {"p": "Ray Optics and Optical InstrumentsIntroduction of opticsReflection of light1", "p_ch": "Ray Optics", "c": "[Inorganic Chemistry] Coordination Compound Werner Theory & EAN Rule5", "c_ch": "Coordination Compounds", "b": "[Zoology] Biotechnology: Principles & ProcessesAmplification of gene of interestInsertion of rDNA into host cellObtaining the foreign gene product4", "b_ch": "Molecular Basis"}, "2027-02-11": {"p": "Ray Optics and Optical InstrumentsReflection from a plane mirror2", "p_ch": "Kinematics 2D", "c": "[Inorganic Chemistry] Coordination Compound VBT (L6)", "c_ch": "Coordination Compounds", "b": "[Zoology] Biotechnology: Principles & ProcessesQuestion Practice5", "b_ch": "Biotech: Principles"}, "2027-02-12": {"p": "Ray Optics and Optical InstrumentsReflection from spherical mirror3", "p_ch": "Ray Optics", "c": "[Inorganic Chemistry] Coordination Compound VBT (L7)", "c_ch": "Coordination Compounds", "b": "[Zoology] Biotechnology and its ApplicationsIntroductionBiotechnological applications in agriculture1", "b_ch": "Biotech: Applications"}, "2027-02-13": {"p": "Ray Optics and Optical InstrumentsRefraction of lightrefraction from a plane surface4", "p_ch": "Kinematics 2D", "c": "[Inorganic Chemistry] Coordination Compound CFT (L8)", "c_ch": "Coordination Compounds", "b": "[Botany] Principle of Inheritance and Variation Question Practice13", "b_ch": "Principles of Inheritance"}, "2027-02-15": {"p": "Ray Optics and Optical InstrumentsTotal internal refractionrefraction from curved surfacecombination of lens and power5", "p_ch": "Work, Energy & Power", "c": "[Inorganic Chemistry] Coordination Compound CFT (L9)", "c_ch": "Coordination Compounds", "b": "[Botany] Microbes in Human Welfare IntroductionMicrobes in Household ProductsMicrobes in Sewage TreatmentMicrobes in Production of BiogasMicrobes in Organic FarmingMicrobes as BiofertilizersBiocontrol Agents (L1)", "b_ch": "Microbes in Welfare"}, "2027-02-16": {"p": "Ray Optics and Optical InstrumentsNewton's FormulaCombination of lens and mirror6", "p_ch": "Laws of Motion", "c": "[Inorganic Chemistry] Coordination Compound Isomerism in Coordination Compounds10", "c_ch": "Organic Basics", "b": "[Botany] Microbes in Human WelfareQuestion Practice2", "b_ch": "Microbes in Welfare"}, "2027-02-17": {"p": "Ray Optics and Optical InstrumentsDisplacement method to find the focal length7", "p_ch": "EMI & AC Circuits", "c": "[Inorganic Chemistry] Coordination Compound Bonding in Metal Carbonyls11", "c_ch": "Chemical Bonding", "b": "[Zoology] Biotechnology and its ApplicationsBiotechnological applications in medicineMolecular Diagnostics (L2)", "b_ch": "Biotech: Applications"}, "2027-02-18": {"p": "Ray Optics and Optical Instrumentsrefraction from prism8", "p_ch": "EMI & AC Circuits", "c": "[Inorganic Chemistry] Coordination Compound Applications of complexes12", "c_ch": "Coordination Compounds", "b": "[Zoology] Biotechnology and its ApplicationsTransgenic animalsEthical issues3", "b_ch": "Biotech: Applications"}, "2027-02-19": {"p": "Ray Optics and Optical InstrumentsQuestion Practice9", "p_ch": "EMI & AC Circuits", "c": "[Inorganic Chemistry] Coordination Compound Question Practice13", "c_ch": "Coordination Compounds", "b": "[Zoology] Biotechnology and its ApplicationsQuestion Practice4", "b_ch": "Biotech: Applications"}, "2027-02-20": {"p": "Wave Opticswave nature of light1", "p_ch": "Waves", "c": "[Inorganic Chemistry] The d and f-Block ElementsGeneral Properties of the Transition Elements (d-Block)1", "c_ch": "d & f Block", "b": "[Botany] Organisms and PopulationIntroductionLevels of OrganisationOrganism and its Environment1", "b_ch": "Organisms & Populations"}, "2027-02-22": {"p": "Wave Opticsnature of light2", "p_ch": "Waves", "c": "[Inorganic Chemistry] The d and f-Block ElementsGeneral Properties of the Transition Elements (d-Block)2", "c_ch": "d & f Block", "b": "[Botany] Organisms and PopulationResponses to Abiotic FactorsAdaptationsAdaptations to Environment in PlantsPopulations (L2)", "b_ch": "Organisms & Populations"}, "2027-02-23": {"p": "Wave Opticsinterference of light3", "p_ch": "Waves", "c": "[Inorganic Chemistry] The d and f-Block ElementsPreparation and properties of KMnO4 &K2Cr2O73", "c_ch": "d & f Block", "b": "[Botany] Organisms and Population Populations Growth Models Carrying CapacityEnvironmental ResistanceLife History VariationsPopulation Interactions (L3)", "b_ch": "Principles of Inheritance"}, "2027-02-24": {"p": "Wave OpticsQuestion Practice4", "p_ch": "Waves", "c": "[Inorganic Chemistry] The d and f-Block ElementsThe Lanthanoids and The Actinoids4", "c_ch": "d & f Block", "b": "[Zoology] Evolution Origin of lifeTheory of origin of life1", "b_ch": "Evolution"}, "2027-02-25": {"p": "Dual Nature of Radiation and MatterQuantum theory of light1", "p_ch": "Dual Nature", "c": "[Inorganic Chemistry] The d and f-Block ElementsQuestion Practice5", "c_ch": "d & f Block", "b": "[Zoology] Evolution EvolutionEvidences of evolutionAdaptive radiation2", "b_ch": "Evolution"}, "2027-02-26": {"p": "Dual Nature of Radiation and MatterPhotoelectric effect2", "p_ch": "Dual Nature", "c": "[Inorganic Chemistry] The p-Block Elements Introduction1", "c_ch": "p-Block (Gr 15-18)", "b": "[Zoology] Evolution Theory of organic evolutionHardy-weinberg principle3", "b_ch": "Evolution"}, "2027-02-27": {"p": "Dual Nature of Radiation and MatterQuestion Practice3", "p_ch": "EMI & AC Circuits", "c": "[Inorganic Chemistry] The p-Block Elements Group-13Group-14 (L2)", "c_ch": "p-Block (Gr 15-18)", "b": "[Botany] Organisms and PopulationQuestion Practice4", "b_ch": "Organisms & Populations"}, "2027-03-01": {"p": "Atoms Atomic modelRutherford model1", "p_ch": "Atoms & Nuclei", "c": "[Inorganic Chemistry] The p-Block Elements Group-15Group-16 (L3)", "c_ch": "p-Block (Gr 15-18)", "b": "[Botany] Ecosystem IntroductionMajor EcosystemsEcosystem - Structure and FunctionStructure of Pond EcosystemEcosystem - FunctionFood ChainFood WebEcological Pyramids (L1)", "b_ch": "Ecosystem"}, "2027-03-02": {"p": "Atoms Question Practice2", "p_ch": "EMI & AC Circuits", "c": "[Inorganic Chemistry] The p-Block Elements Group-17Group-18 (L4)", "c_ch": "p-Block (Gr 15-18)", "b": "[Botany] Ecosystem Question Practice2", "b_ch": "Ecosystem"}, "2027-03-03": {"p": "Nuclei NucleiMass energy1", "p_ch": "Work, Energy & Power", "c": "[Inorganic Chemistry] The p-Block Elements Question Practice5", "c_ch": "p-Block (Gr 15-18)", "b": "[Zoology] Evolution Natural selection and artificial selection4", "b_ch": "Evolution"}, "2027-03-04": {"p": "Nuclei Question Practice2", "p_ch": "EMI & AC Circuits", "c": "[Inorganic Chemistry] Salt Analysis Introduction of salt and solubility1", "c_ch": "Practical Chemistry", "b": "[Zoology] Evolution Lederberg's replica plate experimentSpeciationA brief account on evolutionOrigin and evolution of man5", "b_ch": "Evolution"}, "2027-03-05": {"p": "Semiconductor Electronics: Materials, Devices and Simple CircuitsIntroduction to SemiconductorsIntrinsic and Extrinsic Semiconductor1", "p_ch": "EMI & AC Circuits", "c": "[Inorganic Chemistry] Salt Analysis Test of AnionsDry Test of cationsWet Test of cations2", "c_ch": "Practical Chemistry", "b": "[Zoology] Evolution Question Practice6", "b_ch": "Evolution"}, "2027-03-08": {"p": "Semiconductor Electronics: Materials, Devices and Simple CircuitsPN Junction DiodeApplication of P-N Junction Diode2", "p_ch": "EMI & AC Circuits", "c": "[Inorganic Chemistry] Salt Analysis Question Practice3", "c_ch": "Practical Chemistry", "b": "[Botany] Biodiversity and ConservationBiodiversityLoss of Biodiversity1", "b_ch": "Biodiversity"}, "2027-03-09": {"p": "Semiconductor Electronics: Materials, Devices and Simple CircuitsQuestion Practice3", "p_ch": "EMI & AC Circuits", "c": "[Physical Chemistry] Practical Physical ChemistryPractical Physical ChemistryQuestion Practice1", "c_ch": "Basic Concepts", "b": "[Botany] Biodiversity and ConservationQuestion Practice2", "b_ch": "Biodiversity"}};
    const BATCH_TESTS = {"2026-07-19": {"name": "NEET-1 (Part Test)", "syllabus": "Basic Maths & Calculus(Mathematical Tools)(Complete Chapter) Some Basic Concept of Chemistry: Dalton's Atomic Theory Types of partical and its calculationMolar Mass, AMU, MoleMole concept, Average molar MassVD, Mass % Age, Average Molar MassStoichiometry, Limiting reagent% age yield, Impure sample, Laws of chemical combinationEF & EF Concentration TermsConcentration Term ContinuousEquivalents Mass, Normality Cell - The Unit of Life What is a Cell ? Discovery of the CellMicroscopyCell Theory Overview of CellTypes of cellStructure Prokaryotic cellProkaryotic cells Structural Organization in Animals TissuesAnimal TissuesEpithelium Tissue"}, "2026-08-02": {"name": "NEET-2 (Part Test)", "syllabus": "Vectors(Complete Chapter)Units and MeasurementsPhysical Quantities and UnitsDimensions and Dimensions formulaDimensional AnalysisSome Basic Concept of Chemistry(Complete Chapter)Cell - The Unit of Life (Complete Chapter)Structural Organization in Animals Cell JunctionsConnective TissueMuscular TissueNervous TissueFROG"}, "2026-08-16": {"name": "Rank Booster Test-1 (Part Test)", "syllabus": "Basic Maths & Calculus(Mathematical Tools)(Complete Chapter)Vectors(Complete Chapter)Some Basic Concept of Chemistry(Complete Chapter)Cell - The Unit of Life (Complete Chapter)Structural Organization in Animals (Complete Chapter)"}, "2026-08-30": {"name": "NEET-3 (Part Test)", "syllabus": "Units and Measurements(Complete Chapter)Motion in a straight line(Complete Chapter)Motion in a planeProjectile motion Redox Reaction(Complete Chapter)Solutions(Complete Chapter)Thermodynamics&Thermochemistry(Complete Chapter) Cell Cycle and Cell Division(Complete Chapter)The Living World(Complete Chapter)Breathing and Exchange of Gases(Complete Chapter)"}, "2026-09-13": {"name": "NEET-4 (Part Test)", "syllabus": "Motion in a plane(Complete Chapter)Laws of motionForceNewton's first law of motionLinear momentumNewton's second law of motionNewton's third law of motionFree body diagramWorking with newton's first lawWorking with newton's second lawCalculation of accelerationSpring forceFrame of referenceRocket propulsionFrictionTypes of friction Chemical Equilibrium(Complete Chapter)Ionic Equilibrium(Complete Chapter)Biological Classification (Complete Chapter)Body Fluids and Circulation(Complete Chapter)"}, "2026-09-27": {"name": "Rank Booster Test-2 (Part Test)", "syllabus": "Rank Booster Test Basic Maths & Calculus(Mathematical Tools)(Complete Chapter)Vectors(Complete Chapter)Units and Measurements(Complete Chapter)Motion in a straight line(Complete Chapter)Motion in a plane(Complete Chapter) Redox Reaction(Complete Chapter)Solutions(Complete Chapter)Thermodynamics&Thermochemistry(Complete Chapter)Chemical Equilibrium(Complete Chapter)Ionic Equilibrium(Complete Chapter) Cell Cycle and Cell Division(Complete Chapter)The Living World(Complete Chapter)Biological Classification (Complete Chapter) Breathing and Exchange of Gases(Complete Chapter)Body Fluids and Circulation(Complete Chapter)"}, "2026-10-04": {"name": "AITS-1 (Part Test)", "syllabus": "Units and MeasurementsMathematical ToolsMotion in a Straight LineMotion in a PlaneSome Basic Concepts of ChemistryRedox ReactionCell : the unit of lifeStructural Organization in Animals (including Frog & cockroach)"}, "2026-10-18": {"name": "NEET-5 (Part Test)", "syllabus": "Laws of motion(Complete Chapter)Work, energy and power(Complete Chapter)Centre of mass and System of Particles(Complete Chapter)Rotational MotionIntroductionrigid bodymoment of inertiamoment of inertiatheorems of moment of inertiaradius of gyrationtorquenewtons laws for rotationangular momentum Electrochemistry(Complete Chapter)Chemical Kinetics(Complete Chapter)Structure of Atom(Complete Chapter) Plant Kingdom(Complete Chapter)Morphology of Flowering Plants(Complete Chapter) Excretory Products & their Elimination(Complete Chapter)Locomotion & Movement(Complete Chapter)"}, "2026-11-01": {"name": "AITS-2 (Part Test)", "syllabus": "Newton's Laws of MotionWork, Energy & PowerCentre of Mass & System of ParticlesAtomic StructureSolutionsCell Cycle & Cell DivisionBreathing and Exchange of GasesBody Fluids and Circulation"}, "2026-11-22": {"name": "NEET-6 (Part Test)", "syllabus": "Rotational Motion(Complete Chapter)Gravitation (Complete Chapter) Mechanical Properties of Solids(Complete Chapter)Mechanical Properties of Fluids(Complete Chapter) Classification of Elements and Periodicity in Properties(Complete Chapter)Chemical Bonding and Molecular Structure(Complete Chapter) Anatomy of Flowering Plants(Complete Chapter)Respiration in Plants(Complete Chapter) Neural Control & Coordination(Complete Chapter)Chemical Coordination & Integration(Complete Chapter)"}, "2026-12-06": {"name": "Rank Booster Test-3 (Part Test)", "syllabus": "Rank Booster Test Basic Maths & Calculus(Mathematical Tools)(Complete Chapter)Vectors(Complete Chapter)Units and Measurements(Complete Chapter)Motion in a straight line(Complete Chapter)Motion in a plane(Complete Chapter)Laws of motion(Complete Chapter)Work, energy and power(Complete Chapter)Centre of mass and System of Particles(Complete Chapter)Rotational Motion(Complete Chapter)Gravitation (Complete Chapter) Mechanical Properties of Solids(Complete Chapter)Mechanical Properties of Fluids(Complete Chapter) Electrochemistry(Complete Chapter)Chemical Kinetics(Complete Chapter)Structure of Atom(Complete Chapter)Classification of Elements and Periodicity in Properties(Complete Chapter)Chemical Bonding and Molecular Structure(Complete Chapter) Plant Kingdom(Complete Chapter)Morphology of Flowering Plants(Complete Chapter)Anatomy of Flowering Plants(Complete Chapter)Respiration in Plants(Complete Chapter) Excretory Products & their Elimination(Complete Chapter)Locomotion & Movement(Complete Chapter)Neural Control & Coordination(Complete Chapter)Chemical Coordination & Integration(Complete Chapter)"}, "2026-12-13": {"name": "AITS-3 (Part Test)", "syllabus": "Rotational motionGravitationMechanical Properties of SolidsThermodynamics & ThermochemistryOrganic Chemistry: IUPAC NomenclatureThe Living worldBiological ClassificationExcretory Products & their EliminationLocomotion & Movement"}, "2026-12-27": {"name": "NEET-7 (Part Test)", "syllabus": "Thermal Properties of matter(Complete Chapter)Kinetic Theory(Complete Chapter)Thermodynamics(Complete Chapter)Oscillations(Complete Chapter)Waves(Complete Chapter)Electric Charges and FieldsIntroductionChargeCoulomb's LawCoulomb's LawElectric FieldConductors and InsulatorsElectric Field of a Continuous Charge DistributionElectric Field of a Continuous Charge DistributionMotion of a Charged Particle in Uniform Electric Field Organic Chemistry: Some Basic principles and Techniques(IUPAC Naming)(Complete Chapter)Organic Chemistry: Some Basic principles and Techniques(Isomerism)(Complete Chapter) Photosynthesis in Higher Plants(Complete Chapter)Plant Growth and Development(Complete Chapter)Sexual Reproduction in Flowering Plant(Complete Chapter) Animal Kingdom(Complete Chapter)Biomolecules(Complete Chapter)"}, "2027-01-10": {"name": "NEET-8 (Part Test)", "syllabus": "Electric Charges and Fields(Complete Chapter)Electrostatic Potential and CapacitanceRelation between Electric field (E) & Electric potential (V)Equipotential SurfaceElectrostatic potential energyElectric potential due to dipoleElectrostatics of ConductorCapacitor & its capacitance Organic Chemistry: Some Basic principles and Techniques(GOC)(Complete Chapter)Hydrocarbon(Complete Chapter) Molecular Basis of InheritanceIntroductionThe DNACentral DogmaPackaging of DNA HelixThe Search For Genetic MaterialRNA worldDNA ReplicationDNA RepairTranscriptionPost Transcriptional Process Human Reproduction(Complete Chapter)"}, "2027-01-17": {"name": "AITS-4 (Part Test)", "syllabus": "Mechanical Properties of FluidsThermal Properties of MatterKinetic Theory of GasesThermodynamicsEquilibriumElectrochemistryPlant KingdomMorphology of Flowering PlantsNeural Control & CoordinationChemical Coordination & Integration"}, "2027-01-31": {"name": "Rank Booster Test-4 (Part Test)", "syllabus": "Rank Booster Test Basic Maths & Calculus(Mathematical Tools)(Complete Chapter)Vectors(Complete Chapter)Units and Measurements(Complete Chapter)Motion in a straight line(Complete Chapter)Motion in a plane(Complete Chapter)Laws of motion(Complete Chapter)Work, energy and power(Complete Chapter)Centre of mass and System of Particles(Complete Chapter)Rotational Motion(Complete Chapter)Gravitation (Complete Chapter) Mechanical Properties of Solids(Complete Chapter)Mechanical Properties of Fluids(Complete Chapter)Thermal Properties of matter(Complete Chapter)Kinetic Theory(Complete Chapter)Thermodynamics(Complete Chapter)Oscillations(Complete Chapter)Waves(Complete Chapter)Electric Charges and Fields(Complete Chapter) Organic Chemistry: Some Basic principles and Techniques(IUPAC Naming)(Complete Chapter)Organic Chemistry: Some Basic principles and Techniques(Isomerism)(Complete Chapter)Organic Chemistry: Some Basic principles and Techniques(GOC)(Complete Chapter)Hydrocarbon(Complete Chapter) Photosynthesis in Higher Plants(Complete Chapter)Plant Growth and Development(Complete Chapter)Sexual Reproduction in Flowering Plant(Complete Chapter) Animal Kingdom(Complete Chapter)Biomolecules(Complete Chapter)Human Reproduction(Complete Chapter)"}, "2027-02-14": {"name": "NEET-9 (Part Test)", "syllabus": "Electrostatic Potential and Capacitance(Complete Chapter)Current Electricity(Complete Chapter)Moving Charges and Magnetism(Complete Chapter)Magnetism and Matter(Complete Chapter)Electromagnetic Induction(Complete Chapter)Alternating Current(Complete Chapter) Haloalkanes and Haloarenes(Complete Chapter)Alcohols, Ethers and Phenols(Complete Chapter)Aldehydes, Ketones and Carboxylic Acids(Complete Chapter) Molecular Basis of Inheritance(Complete Chapter)Principle of Inheritance and VariationIntroductionGenetic TerminologyMendel's Experiments on Pea PlantInheritance of One GeneMendel's' Laws of InheritanceExceptions to Mendelian PrinciplesInheritance of Two GenePolygenic Inheritance and PleiotropyPost-Mendelism Reproductive Health(Complete Chapter)Human Health and Diseases(Complete Chapter)"}, "2027-02-21": {"name": "AITS-5 (Part Test)", "syllabus": "OscillationsWavesElectric Charges and FieldsElectrostatic Potential and CapacitanceOrganic Chemistry: IsomerismOrganic Chemistry: General Organic ChemistryHydrocarbonChemical KineticsAnatomy of Flowering PlantsSexual Reproduction in Flowering PlantAnimal KingdomHuman ReproductionReproductive Health"}, "2027-02-28": {"name": "NEET-10 (Part Test)", "syllabus": "Electromagnetic Waves(Complete Chapter)Ray Optics and Optical Instruments(Complete Chapter) Amines(Complete Chapter)Biomolecules(Complete Chapter)Purification and Qualitative and quantitative analysis(Complete Chapter)Coordination Compound(Complete Chapter) Principle of Inheritance and Variation(Complete Chapter)Biotechnology: Principles & Processes(Complete Chapter)Biotechnology and its Applications(Complete Chapter)"}, "2027-03-07": {"name": "Rank Booster Test-5 (Part Test)", "syllabus": "Rank Booster Test Basic Maths & Calculus(Mathematical Tools)(Complete Chapter)Vectors(Complete Chapter)Units and Measurements(Complete Chapter)Motion in a straight line(Complete Chapter)Motion in a plane(Complete Chapter)Laws of motion(Complete Chapter)Work, energy and power(Complete Chapter)Centre of mass and System of Particles(Complete Chapter)Rotational Motion(Complete Chapter)Gravitation (Complete Chapter) Mechanical Properties of Solids(Complete Chapter)Mechanical Properties of Fluids(Complete Chapter)Thermal Properties of matter(Complete Chapter)Kinetic Theory(Complete Chapter)Thermodynamics(Complete Chapter)Oscillations(Complete Chapter)Waves(Complete Chapter)Electric Charges and Fields(Complete Chapter)Electrostatic Potential and Capacitance(Complete Chapter)Current Electricity(Complete Chapter)Moving Charges and Magnetism(Complete Chapter)Magnetism and Matter(Complete Chapter)Electromagnetic Induction(Complete Chapter)Alternating Current(Complete Chapter)Electromagnetic Waves(Complete Chapter)Ray Optics and Optical Instruments(Complete Chapter) Haloalkanes and Haloarenes(Complete Chapter)Alcohols, Ethers and Phenols(Complete Chapter)Aldehydes, Ketones and Carboxylic Acids(Complete Chapter)Amines(Complete Chapter)Biomolecules(Complete Chapter)Purification and Qualitative and quantitative analysis(Complete Chapter)Coordination Compound(Complete Chapter) Molecular Basis of Inheritance(Complete Chapter)Principle of Inheritance and Variation(Complete Chapter) Reproductive Health(Complete Chapter)Human Health and Diseases(Complete Chapter)Biotechnology: Principles & Processes(Complete Chapter)Biotechnology and its Applications(Complete Chapter)"}, "2027-03-14": {"name": "AITS-6 (Part Test)", "syllabus": "Current ElectricityHaloalkanes and HaloarenesAlcohols, Ethers and PhenolsMolecular Basis of InheritanceBiomoleculesHuman Health and Disease"}, "2027-03-21": {"name": "AITS-7 (Part Test)", "syllabus": "Moving Charges and MagnetismMagnetism and MatterElectromagnetic InductionAldehydes, Ketones and Carboxylic AcidsAminesBio-moleculesRespiration in PlantsPhotosynthesis in Higher PlantsEvolution"}, "2027-03-28": {"name": "AITS-8 (Part Test)", "syllabus": "Alternating CurrentElectromagnetic WavesRay Optics and Optical InstrumentsWave OpticsDual Nature of Radiation and MatterAtomsNuclei Purification and Analysis of Organic CompoundCoordination CompoundsThe p-Block ElementsThe d- and f- block ElementsPlant Growth and DevelopmentOrganisms and PopulationEcosystemBiotechnology - Principles and Processes"}, "2027-04-04": {"name": "AITS-9 (Full Syllabus)", "syllabus": "Full Syllabus * As per NTAFull Syllabus * As per NTAFull Syllabus * As per NTAFull Syllabus * As per NTA"}, "2027-04-11": {"name": "AITS-10 (Full Syllabus)", "syllabus": "Full Syllabus * As per NTAFull Syllabus * As per NTAFull Syllabus * As per NTAFull Syllabus * As per NTA"}, "2027-04-14": {"name": "AITS-11 (Full Syllabus)", "syllabus": "Full Syllabus * As per NTAFull Syllabus * As per NTAFull Syllabus * As per NTAFull Syllabus * As per NTA"}, "2027-04-18": {"name": "AITS-12 (Full Syllabus)", "syllabus": "Full Syllabus * As per NTAFull Syllabus * As per NTAFull Syllabus * As per NTAFull Syllabus * As per NTA"}, "2027-04-21": {"name": "AITS-13 (Full Syllabus)", "syllabus": "Full Syllabus * As per NTAFull Syllabus * As per NTAFull Syllabus * As per NTAFull Syllabus * As per NTA"}, "2027-04-25": {"name": "AITS-14 (Full Syllabus)", "syllabus": "Full Syllabus * As per NTAFull Syllabus * As per NTAFull Syllabus * As per NTAFull Syllabus * As per NTA"}, "2027-04-28": {"name": "AITS-15 (Full Syllabus)", "syllabus": "Full Syllabus * As per NTAFull Syllabus * As per NTAFull Syllabus * As per NTAFull Syllabus * As per NTA"}};

    function buildPlan() {
      const plan = [];
      const ALL_BIO = P1_BIO.concat(P2_BIO);
      const ALL_CHE = P1_CHE.concat(P2_CHE);
      const ALL_PHY = P1_PHY.concat(P2_PHY);
      
      let rev_phy_idx = 0;
      let rev_che_idx = 0;
      let rev_bio_idx = 0;
      
      for (let d = 0; d < DIFF; d++) {
        const currentDate = new Date(START_DATE);
        currentDate.setDate(START_DATE.getDate() + d);
        const dayNum = d + 1;
        
        const dateStr = currentDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const isSunday = (dayOfWeek === 0);
        
        // Format dateKey as YYYY-MM-DD
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dateVal = String(currentDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${dateVal}`;
        
        let phase = 1;
        let type = 'study';
        let phy = '', che = '', bio = '';
        let phyChap = '', cheChap = '', bioChap = '';
        let phyNote = '', cheNote = '', bioNote = '';
        
        // Special Exam Day handling
        if (dateKey === "2027-05-02") {
          type = 'rest';
          phy = "🔴 NEET UG 2027 EXAM DAY";
          che = "🔴 NEET UG 2027 EXAM DAY";
          bio = "🔴 NEET UG 2027 EXAM DAY";
          phyNote = cheNote = bioNote = "Exam Time: 2:00 PM to 5:20 PM. Stay calm, believe in yourself, and give your best!";
          phase = 4;
        } else if (dateKey === "2027-05-03") {
          type = 'rest';
          phy = "🟢 Post-Exam Review";
          che = "🟢 Post-Exam Review";
          bio = "🟢 Post-Exam Review";
          phyNote = cheNote = bioNote = "Review your response sheet and relax.";
          phase = 4;
        } else if (BATCH_TESTS[dateKey]) {
          const t = BATCH_TESTS[dateKey];
          type = (t.name.indexOf("Part Test") !== -1) ? 'test' : 'mock';
          phy = `📝 Test: ${t.name}`;
          che = `📝 Test: ${t.name}`;
          bio = `📝 Test: ${t.name}`;
          phyNote = cheNote = bioNote = `Syllabus: ${t.syllabus}`;
          phase = (currentDate > new Date(2027, 2, 9)) ? 2 : 1;
        } else if (isSunday) {
          type = 'rest';
          phy = "🟢 Self Study / Backlog Clearance";
          che = "🟢 Self Study / Backlog Clearance";
          bio = "🟢 Self Study / Backlog Clearance";
          phyNote = cheNote = bioNote = "Clear your backlogs, review notes, and get some rest.";
          phase = (currentDate > new Date(2027, 2, 9)) ? 2 : 1;
        } else {
          // Weekdays
          if (currentDate <= new Date(2027, 2, 9)) {
            phase = 1;
            if (BATCH_LECTURES[dateKey]) {
              const l = BATCH_LECTURES[dateKey];
              phy = l.p || "Physics Practice & Revision";
              che = l.c || "Chemistry Practice & Revision";
              bio = l.b || "Biology Practice & Revision";
              
              phyChap = l.p_ch || "";
              cheChap = l.c_ch || "";
              bioChap = l.b_ch || "";
              
              phyNote = l.p ? "Watch lecture, make notes, solve DPP" : "Practice previous topics";
              cheNote = l.c ? "Watch lecture, make notes, solve DPP" : "Practice previous topics";
              bioNote = l.b ? "Watch lecture, make notes, solve DPP" : "Practice previous topics";
            } else {
              phy = "Physics Practice & Revision";
              che = "Chemistry Practice & Revision";
              bio = "Biology Practice & Revision";
              phyNote = cheNote = bioNote = "Solve 20-30 MCQs of previous chapter";
            }
          } else {
            // Revision Phase! (March 10, 2027 to May 1, 2027)
            phase = 3;
            type = 'revision';
            
            // Revision schedule based on upcoming AITS tests
            // AITS-6 Prep: March 10 to March 13 (4 days)
            const d_m10 = new Date(2027, 2, 10);
            const d_m13 = new Date(2027, 2, 13);
            const d_m15 = new Date(2027, 2, 15);
            const d_m20 = new Date(2027, 2, 20);
            const d_m22 = new Date(2027, 2, 22);
            const d_m27 = new Date(2027, 2, 27);
            
            if (currentDate >= d_m10 && currentDate <= d_m13) {
              const phy_list = ['Current Electricity', 'Current Electricity'];
              const che_list = ['Haloalkanes', 'Alcohols, Phenols'];
              const bio_list = ['Molecular Basis', 'Biomolecules', 'Human Health & Disease'];
              
              const day_offset = Math.floor((currentDate - d_m10) / (1000 * 60 * 60 * 24));
              phyChap = phy_list[day_offset % phy_list.length];
              cheChap = che_list[day_offset % che_list.length];
              bioChap = bio_list[day_offset % bio_list.length];
              
              phy = `REV: ${phyChap}`;
              che = `REV: ${cheChap}`;
              bio = `REV: ${bioChap}`;
              phyNote = cheNote = bioNote = "AITS-6 Revision: Solve 30-40 PYQs + NCERT active recall";
            }
            // AITS-7 Prep: March 15 to March 20 (6 days)
            else if (currentDate >= d_m15 && currentDate <= d_m20) {
              const phy_list = ['Magnetic Effects', 'Magnetism & Matter', 'EMI & AC Circuits'];
              const che_list = ['Aldehydes & Ketones', 'Carboxylic Acids', 'Amines'];
              const bio_list = ['Respiration in Plants', 'Photosynthesis', 'Evolution'];
              
              const day_offset = Math.floor((currentDate - d_m15) / (1000 * 60 * 60 * 24));
              phyChap = phy_list[day_offset % phy_list.length];
              cheChap = che_list[day_offset % che_list.length];
              bioChap = bio_list[day_offset % bio_list.length];
              
              phy = `REV: ${phyChap}`;
              che = `REV: ${cheChap}`;
              bio = `REV: ${bioChap}`;
              phyNote = cheNote = bioNote = "AITS-7 Revision: Focus on formulas, reactions, and diagrams";
            }
            // AITS-8 Prep: March 22 to March 27 (6 days)
            else if (currentDate >= d_m22 && currentDate <= d_m27) {
              const phy_list = ['EM Waves', 'Ray Optics', 'Wave Optics', 'Dual Nature', 'Atoms & Nuclei'];
              const che_list = ['Coordination Compounds', 'p-Block (Gr 15-18)', 'd & f Block'];
              const bio_list = ['Plant Growth & Dev', 'Organisms & Populations', 'Ecosystem', 'Biotech: Principles'];
              
              const day_offset = Math.floor((currentDate - d_m22) / (1000 * 60 * 60 * 24));
              phyChap = phy_list[day_offset % phy_list.length];
              cheChap = che_list[day_offset % che_list.length];
              bioChap = bio_list[day_offset % bio_list.length];
              
              phy = `REV: ${phyChap}`;
              che = `REV: ${cheChap}`;
              bio = `REV: ${bioChap}`;
              phyNote = cheNote = bioNote = "AITS-8 Revision: Solve high-yield MCQs + short notes review";
            }
            // Full Syllabus Revision: March 29 to May 1 (34 days)
            else {
              phyChap = ALL_PHY[rev_phy_idx % ALL_PHY.length].ch;
              cheChap = ALL_CHE[rev_che_idx % ALL_CHE.length].ch;
              bioChap = ALL_BIO[rev_bio_idx % ALL_BIO.length].ch;
              
              phy = `REV: ${phyChap}`;
              che = `REV: ${cheChap}`;
              bio = `REV: ${bioChap}`;
              
              rev_phy_idx++;
              rev_che_idx++;
              rev_bio_idx++;
              
              phyNote = cheNote = bioNote = "Full Syllabus revision sprint. Review mistakes from previous tests.";
            }
          }
        }
        
        plan.push({
          day: dayNum,
          date: dateStr,
          dobj: currentDate,
          type: type,
          phy: phy,
          che: che,
          bio: bio,
          phyChap: phyChap,
          cheChap: cheChap,
          bioChap: bioChap,
          phyNote: phyNote,
          cheNote: cheNote,
          bioNote: bioNote,
          phase: phase,
          sun: isSunday
        });
      }
      return plan;
    }
    
    const PLAN = buildPlan();
    
    // LocalStorage states
    let done = {};
    try {
      done = JSON.parse(safeGetLocalStorage('neet_v3_done') || '{}');
    } catch(e){}
    
    let trackerLogs = [];
    try {
      trackerLogs = JSON.parse(safeGetLocalStorage('neet_v3_tracker') || '[]');
    } catch(e){}
    
    let chapterProgress = {};
    try {
      chapterProgress = JSON.parse(safeGetLocalStorage('neet_v3_chapter_progress') || '{}');
    } catch(e){}
    
    let testAnalysisLogs = {};
    try {
      testAnalysisLogs = JSON.parse(safeGetLocalStorage('neet_v3_test_analysis') || '{}');
    } catch(e){}

    let mockTests = [];
    try {
      mockTests = JSON.parse(safeGetLocalStorage('neet_v3_mock_tests') || '[]');
    } catch(e){}
    // --- NEET 2027 Syllabus Audit: Progress Data Migration ---
    (function() {
      try {
        const oldProg = JSON.parse(localStorage.getItem('neet_v3_chapter_progress') || '{}');
        const renames = {
          'Kinematics 2D / Projectile': 'Kinematics 2D',
          'The Living World': 'Living World'
        };
        let changed = false;
        for (const [oldName, newName] of Object.entries(renames)) {
          if (oldProg[oldName] && !oldProg[newName]) {
            oldProg[newName] = oldProg[oldName];
            delete oldProg[oldName];
            changed = true;
          }
        }
        const deleted = [
          'Communication Systems', 'States of Matter', 'Hydrogen', 's-Block Elements',
          'Environmental Chemistry', 'Solid State', 'Surface Chemistry', 'Metallurgy',
          'Polymers', 'Chemistry in Daily Life', 'Transport in Plants', 'Mineral Nutrition',
          'Digestion & Absorption', 'Reproduction: Organisms', 'Food Production', 'Environmental Issues'
        ];
        deleted.forEach(ch => {
          if (oldProg[ch]) {
            delete oldProg[ch];
            changed = true;
          }
        });
        if (changed) {
          localStorage.setItem('neet_v3_chapter_progress', JSON.stringify(oldProg));
          console.log("NEET Planner: Migrated chapter progress data for renamed/deleted chapters.");
        }
      } catch(e) {
        console.error("Migration failed:", e);
      }
    })();

    // --- NEET 2027 Syllabus Audit: Progress Data Migration ---
    (function() {
      try {
        const oldProg = JSON.parse(localStorage.getItem('neet_v3_chapter_progress') || '{}');
        const renames = {
          'Kinematics 2D / Projectile': 'Kinematics 2D',
          'The Living World': 'Living World'
        };
        let changed = false;
        for (const [oldName, newName] of Object.entries(renames)) {
          if (oldProg[oldName] && !oldProg[newName]) {
            oldProg[newName] = oldProg[oldName];
            delete oldProg[oldName];
            changed = true;
          }
        }
        const deleted = [
          'Communication Systems', 'States of Matter', 'Hydrogen', 's-Block Elements',
          'Environmental Chemistry', 'Solid State', 'Surface Chemistry', 'Metallurgy',
          'Polymers', 'Chemistry in Daily Life', 'Transport in Plants', 'Mineral Nutrition',
          'Digestion & Absorption', 'Reproduction: Organisms', 'Food Production', 'Environmental Issues'
        ];
        deleted.forEach(ch => {
          if (oldProg[ch]) {
            delete oldProg[ch];
            changed = true;
          }
        });
        if (changed) {
          localStorage.setItem('neet_v3_chapter_progress', JSON.stringify(oldProg));
          console.log("NEET Planner: Migrated chapter progress data for renamed/deleted chapters.");
        }
      } catch(e) {
        console.error("Migration failed:", e);
      }
    })();

    
    // Pagination & Filters
    const PER_PAGE = 35;
    let calPage = 0;
    
    function saveDone() {
      try {
        safeSetLocalStorage('neet_v3_done', JSON.stringify(done));
      } catch(e){}
    }
    
    function toggleDone(dayNum) {
      done[dayNum] = !done[dayNum];
      saveDone();
      renderPlan();
      updateOverviewStats();
      if (typeof renderTestList === 'function') renderTestList();
    }

    
    function getWeek(dayNum) {
      return Math.ceil(dayNum / 7);
    }
    
    // Calendar rendering
    function renderCal() {
      const q = (document.getElementById('srch') || {value:''}).value.toLowerCase();
      const ph = (document.getElementById('phf') || {value:''}).value;
      const subFilter = (document.getElementById('subf') || {value:''}).value;
      const wk = (document.getElementById('wkf') || {value:''}).value;
      
      const filtered = PLAN.filter(r => {
        if (ph !== "" && r.phase != ph) return false;
        if (wk !== "" && getWeek(r.day) != wk) return false;
        if (subFilter !== "") {
          if (subFilter === 'study' && r.type !== 'study') return false;
          if (subFilter === 'test' && r.type !== 'test') return false;
          if (subFilter === 'revision' && r.type !== 'revision') return false;
          if (subFilter === 'mock' && r.type !== 'mock') return false;
        }
        if (q) {
          const txt = (r.phy + ' ' + r.che + ' ' + r.bio).toLowerCase();
          if (!txt.includes(q)) return false;
        }
        return true;
      });
      
      const totalPages = Math.ceil(filtered.length / PER_PAGE);
      if (calPage >= totalPages) calPage = Math.max(0, totalPages - 1);
      const slice = filtered.slice(calPage * PER_PAGE, (calPage + 1) * PER_PAGE);
      
      const doneCnt = Object.values(done).filter(Boolean).length;
      const pct = PLAN.length ? Math.round((doneCnt / PLAN.length) * 100) : 0;
      
      const pf = document.getElementById('pfill');
      if (pf) pf.style.width = pct + '%';
      
      const cc = document.getElementById('cal-count');
      if (cc) cc.textContent = `${filtered.length} days shown · ${doneCnt}/${PLAN.length} done (${pct}%)`;
      
      function typeBadge(t) {
        if (t === 'study') return '<span class="type-badge tb-study">Study</span>';
        if (t === 'test') return '<span class="type-badge tb-test">Test</span>';
        if (t === 'revision') return '<span class="type-badge tb-rev">Revise</span>';
        if (t === 'mock') return '<span class="type-badge tb-mock">Mock</span>';
        return '<span class="type-badge tb-rest">Rest</span>';
      }
      
      function getChapterWeight(chName) {
        if (!chName) return '';
        const clean = chName.trim();
        const allList = P1_PHY.concat(P2_PHY).concat(P1_CHE).concat(P2_CHE).concat(P1_BIO).concat(P2_BIO);
        const match = allList.find(c => c.ch.trim().toLowerCase() === clean.toLowerCase());
        if (match) {
          if (match.wt === 'h') return '<span style="font-size:9px; padding:1px 3px; border-radius:3px; background:rgba(255,107,107,0.15); color:var(--tertiary); margin-left:6px; font-weight:700;">🔥 High</span>';
          if (match.wt === 'm') return '<span style="font-size:9px; padding:1px 3px; border-radius:3px; background:rgba(0,212,170,0.15); color:var(--primary); margin-left:6px; font-weight:700;">⚡ Med</span>';
          return '<span style="font-size:9px; padding:1px 3px; border-radius:3px; background:rgba(255,255,255,0.05); color:var(--text-muted); margin-left:6px;">Low</span>';
        }
        return '';
      }
      
      function cellHtml(text, note, subject, chapName, dayNum) {
        if (!text) return '<span style="color:var(--text-muted);">—</span>';
        const isRev = text.startsWith('REV: ');
        const ch = isRev ? text.slice(5) : text;
        const isSp = text.startsWith('📝') || text.startsWith('🔴') || text.startsWith('🟢') || text.startsWith('🧪') || text.startsWith('REV: 🟢');
        
        let pyqBtn = '';
        const chName = chapName || ch;
        // If it's a chapter name, add a button to open its PYQ modal
        if (!isSp && chName && PYQ_BANK[chName.trim()]) {
          pyqBtn = `<br><button class="btn btn-secondary" style="font-size:10px; padding:2px 6px; margin-top:6px;" onclick="openPyqModal('${chName.trim().replace(/'/g, "\'")}')">📝 PYQs</button>`;
        }
        
        const wtLabel = (!isSp && chName) ? getChapterWeight(chName) : '';
        
        // Prep subject tag badge
        let subBadge = '';
        if (!isSp) {
          if (subject === 'phy') subBadge = '<span class="subject-badge badge-phy" style="padding:1.5px 5px; font-size:8.5px; margin-bottom:4px; display:inline-flex;">⚡ Physics</span><br>';
          if (subject === 'che') subBadge = '<span class="subject-badge badge-che" style="padding:1.5px 5px; font-size:8.5px; margin-bottom:4px; display:inline-flex;">🧪 Chem</span><br>';
          if (subject === 'bio') subBadge = '<span class="subject-badge badge-bio" style="padding:1.5px 5px; font-size:8.5px; margin-bottom:4px; display:inline-flex;">🧬 Bio</span><br>';
        }

        let backlogHtml = '';
        if (dayNum && typeof getBacklogTasksForDay === 'function') {
          const backlog = getBacklogTasksForDay(dayNum);
          if (backlog && backlog[subject]) {
            backlogHtml = `<div style="margin-top:6px; padding:4px 6px; border-radius:6px; background:rgba(248,113,113,0.06); border:1px dashed rgba(248,113,113,0.3); font-size:11px; color:var(--tertiary); font-weight:600; text-align:left; line-height:1.3;">⚠️ Backlog:<br><span style="font-weight:normal; opacity:0.85; font-size:10px;">${backlog[subject]}</span></div>`;
          }
        }
        
        return `<div class="ch-cell">
          ${isRev ? '<span style="font-size:9.5px; background:var(--primary-glow); color:var(--primary); padding:1px 4px; border-radius:3px; display:inline-block; margin-bottom:2px; font-weight:700;">REV</span><br>' : ''}
          ${subBadge}
          <span class="ch-main">${ch}</span>${wtLabel}
          ${note ? `<div class="ch-sub">${note}</div>` : ''}
          ${pyqBtn}
          ${backlogHtml}
        </div>`;
      }
      
      let html = '';
      slice.forEach(r => {
        const isDone = !!done[r.day];
        const rowCls = r.type === 'test' ? 'test-day' : r.type === 'mock' ? 'mock-day' : r.type === 'revision' ? 'revision-day' : r.sun ? 'sunday' : '';
        html += `<tr class="${rowCls} ${isDone ? 'done-row' : ''}">
          <td><span class="day-num" style="font-weight:700;">${r.day}</span></td>
          <td class="day-date">${r.date}</td>
          <td>${typeBadge(r.type)}</td>
          <td>${cellHtml(r.phy, r.phyNote, 'phy', r.phyChap, r.day)}</td>
          <td>${cellHtml(r.che, r.cheNote, 'che', r.cheChap, r.day)}</td>
          <td>${cellHtml(r.bio, r.bioNote, 'bio', r.bioChap, r.day)}</td>
          <td style="text-align:center;"><input type="checkbox" class="done-cb" ${isDone ? 'checked' : ''} onchange="toggleDone(${r.day})"></td>
        </tr>`;
      });
      
      const cb = document.getElementById('cal-body');
      if (cb) cb.innerHTML = html;
      
      // Pagination buttons
      let pag = '';
      if (calPage > 0) pag += `<button onclick="calGo(${calPage - 1})">‹</button>`;
      const startPage = Math.max(0, calPage - 2);
      const endPage = Math.min(totalPages - 1, calPage + 2);
      for (let i = startPage; i <= endPage; i++) {
        pag += `<button class="${i === calPage ? 'cur' : ''}" onclick="calGo(${i})">${i + 1}</button>`;
      }
      if (calPage < totalPages - 1) pag += `<button onclick="calGo(${calPage + 1})">›</button>`;
      
      const cp = document.getElementById('cal-pages');
      if (cp) cp.innerHTML = pag;
    }
    
    function calGo(p) {
      calPage = p;
      renderPlan();
    }

    function renderPlan() {
      try {
        renderCal();
      } catch (e) {
        console.error("Error rendering plan:", e);
      }
    }

    
    // Tab switching
    function showTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.drawer-item').forEach(el => el.classList.remove('active'));
      
      // Update persistent sidebar active nav item
      document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => el.classList.remove('active'));
      const sidebarNavItem = document.querySelector(`.sidebar-nav .nav-item[data-tab="${tabId}"]`);
      if (sidebarNavItem) {
        sidebarNavItem.classList.add('active');
        
        // Update topbar title
        const topbarTitle = document.getElementById('topbar-page-title');
        if (topbarTitle) {
          const navLabel = sidebarNavItem.querySelector('.nav-label');
          topbarTitle.textContent = navLabel ? navLabel.textContent : tabId;
        }
      }
      
      const activeTabEl = document.getElementById(tabId);
      if (activeTabEl) activeTabEl.classList.add('active');
      
      const sidebarBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
      if (sidebarBtn) sidebarBtn.classList.add('active');
      
      const drawerItem = document.querySelector(`.drawer-item[data-tab="${tabId}"]`);
      if (drawerItem) drawerItem.classList.add('active');
      
      if (tabId === 'calendar') {
        renderPlan();
      } else if (tabId === 'timing') {
        showSched('p1', document.querySelector('.sched-btn'));
      } else if (tabId === 'chapters') {
        renderChapters();
      } else if (tabId === 'papers') {
        renderPapersPicker();
      } else if (tabId === 'tests') {
        renderTestList();
        renderMockTestsDashboard();
        setDefaultMockDate();
      } else if (tabId === 'tracker') {
        renderTrackerTable();
      } else if (tabId === 'analytics') {
        renderAnalytics();
      } else if (tabId === 'overview') {
        renderOverviewStats();
      }
    }

    function toggleMenu() {
      const drawer = document.getElementById('nav-drawer');
      const overlay = document.getElementById('drawer-overlay');
      const btn = document.querySelector('.hamburger-btn');
      drawer.classList.toggle('open');
      overlay.classList.toggle('open');
      if (btn) btn.classList.toggle('open');
    }

    function navigateTab(tabId) {
      showTab(tabId);
      toggleMenu();
    }
    
    // Hourly Schedule
    window.isEditingSched = false;
    window.activeSchedKey = 'p1';

    function showSched(key, btn) {
      if (key) {
        window.activeSchedKey = key;
      }
      const activeKey = window.activeSchedKey;
      
      document.querySelectorAll('.sched-btn').forEach(b => {
        b.classList.remove('active');
        if (b.getAttribute('onclick') && b.getAttribute('onclick').includes(`'${activeKey}'`)) {
          b.classList.add('active');
        }
      });
      
      // Control buttons container in timing tab
      const timingControls = document.getElementById('timing-controls');
      if (timingControls) {
        if (window.isEditingSched) {
          timingControls.innerHTML = `
            <button class="btn btn-primary" onclick="saveEditSched()"><span style="margin-right:4px;">💾</span> Save Changes</button>
            <button class="btn btn-secondary" onclick="cancelEditSched()"><span style="margin-right:4px;">❌</span> Cancel</button>
            <button class="btn btn-secondary" onclick="addNewSchedRow()"><span style="margin-right:4px;">➕</span> Add Row</button>
          `;
        } else {
          timingControls.innerHTML = `
            <button class="btn btn-secondary" onclick="startEditSched()"><span style="margin-right:4px;">✏️</span> Customize Timetable</button>
            <button class="btn btn-secondary" style="border-color:rgba(255,107,107,0.4); color:var(--tertiary);" onclick="resetSchedToDefault()"><span style="margin-right:4px;">🔄</span> Reset Default</button>
          `;
        }
      }

      const data = SCHEDS[activeKey];
      if (!data) return;

      const colors = { 'bio': '#a78bfa', 'che': '#34d399', 'phy': '#60a5fa', 'test': '#ff6b6b', 'rev': '#00d4aa', 'break': '#64748b' };
      const dayNum = typeof getTodayDayNum === 'function' ? getTodayDayNum() : 1;
      const todayPlan = (typeof PLAN !== 'undefined' && Array.isArray(PLAN)) ? (PLAN.find(item => item.day === dayNum) || PLAN[0]) : null;

      let html = '';
      if (window.isEditingSched) {
        // Render editor table
        html = '<table class="sched-table edit-mode"><thead><tr><th style="width:4px; padding:0;"></th><th>Time</th><th>Activity / Subject</th><th>Duration</th><th style="width:120px;">Category</th><th style="width:50px; text-align:center;">Actions</th></tr></thead><tbody>';
        data.forEach((r, idx) => {
          const clr = colors[r.cat] || '#e2e8f0';
          const tVal = String(r.t || '').replace(/"/g, '&quot;');
          const aVal = String(r.a || '').replace(/"/g, '&quot;');
          const dVal = String(r.d || '').replace(/"/g, '&quot;');
          
          html += `<tr>
            <td style="background:${clr}; padding:0;"></td>
            <td><input type="text" class="form-control text-input-sched" style="font-weight:600; font-size:12px; padding:4px 8px;" value="${tVal}" id="sched-time-${idx}"></td>
            <td><input type="text" class="form-control text-input-sched" style="font-size:12px; padding:4px 8px; width:100%;" value="${aVal}" id="sched-act-${idx}"></td>
            <td><input type="text" class="form-control text-input-sched" style="font-size:12px; padding:4px 8px;" value="${dVal}" id="sched-dur-${idx}"></td>
            <td>
              <select class="form-control select-input-sched" style="font-size:11px; padding:4px;" id="sched-cat-${idx}">
                <option value="bio" ${r.cat === 'bio' ? 'selected' : ''}>🌿 Biology</option>
                <option value="che" ${r.cat === 'che' ? 'selected' : ''}>🧪 Chemistry</option>
                <option value="phy" ${r.cat === 'phy' ? 'selected' : ''}>⚡ Physics</option>
                <option value="test" ${r.cat === 'test' ? 'selected' : ''}>📝 Test</option>
                <option value="rev" ${r.cat === 'rev' ? 'selected' : ''}>🔄 Revision</option>
                <option value="break" ${r.cat === 'break' ? 'selected' : ''}>☕ Break / Rest</option>
              </select>
            </td>
            <td style="text-align:center;">
              <button class="btn btn-secondary" style="padding:4px 8px; color:var(--tertiary); border-color:rgba(255,107,107,0.3);" onclick="deleteSchedRow(${idx})">🗑️</button>
            </td>
          </tr>`;
        });
        html += '</tbody></table>';
      } else {
        // Render normal view table
        html = '<table class="sched-table"><thead><tr><th style="width:4px; padding:0;"></th><th>Time</th><th>Activity</th><th>Duration</th></tr></thead><tbody>';
        data.forEach(r => {
          const clr = colors[r.cat] || '#e2e8f0';
          
          let activityText = r.a || '';
          if (todayPlan) {
            if (r.cat === 'bio' && todayPlan.bio) {
              activityText = activityText.replace("Biology — New chapter:", `Biology — <strong>${todayPlan.bio}</strong>:`);
              activityText = activityText.replace("Biology MCQs for today's chapter", `Biology MCQs for <strong>${todayPlan.bio}</strong>`);
              activityText = activityText.replace("Bio revision: 3 chapters rapid scan", `Bio revision: <strong>${todayPlan.bio}</strong>`);
            } else if (r.cat === 'che' && todayPlan.che) {
              activityText = activityText.replace("CHEMISTRY — New chapter:", `CHEMISTRY — <strong>${todayPlan.che}</strong>:`);
              activityText = activityText.replace("Chemistry MCQs for today's chapter", `Chemistry MCQs for <strong>${todayPlan.che}</strong>`);
              activityText = activityText.replace("Che revision: 2 chapters rapid scan", `Che revision: <strong>${todayPlan.che}</strong>`);
            } else if (r.cat === 'phy' && todayPlan.phy) {
              activityText = activityText.replace("PHYSICS — New chapter:", `PHYSICS — <strong>${todayPlan.phy}</strong>:`);
              activityText = activityText.replace("Physics MCQs for today's chapter", `Physics MCQs for <strong>${todayPlan.phy}</strong>`);
              activityText = activityText.replace("Phy revision: 2 chapters + formula", `Phy revision: <strong>${todayPlan.phy}</strong>`);
            } else if (r.cat === 'test') {
              if (todayPlan.type === 'test' || todayPlan.type === 'mock') {
                activityText = activityText.replace("WEEKLY TEST", `<strong>TEST: ${todayPlan.phy}</strong>`);
                activityText = activityText.replace("this week's chapters", "test syllabus");
                activityText = activityText.replace("MIXED 200Q FULL MOCK", `<strong>MOCK TEST: ${todayPlan.phy}</strong>`);
                activityText = activityText.replace("FULL NEET MOCK TEST", `<strong>MOCK TEST: ${todayPlan.phy}</strong>`);
              }
            }
          }
          
          html += `<tr>
            <td style="background:${clr}; padding:0;"></td>
            <td style="font-weight:600; width:100px;">${r.t || ''}</td>
            <td>${activityText}</td>
            <td style="color:var(--text-muted); width:90px;">${r.d || ''}</td>
          </tr>`;
        });
        html += '</tbody></table>';
      }
      
      const so = document.getElementById('sched-out');
      if (so) so.innerHTML = html;
    }

    function startEditSched() {
      window.isEditingSched = true;
      showSched();
    }
    
    function cancelEditSched() {
      window.isEditingSched = false;
      try {
        let loaded = JSON.parse(safeGetLocalStorage('neet_v3_custom_scheds') || 'null');
        if (loaded && typeof loaded === 'object') {
          SCHEDS = loaded;
        } else {
          SCHEDS = JSON.parse(JSON.stringify(DEFAULT_SCHEDS));
        }
      } catch(e){}
      showSched();
    }
    
    function saveEditSched() {
      const activeKey = window.activeSchedKey;
      const data = SCHEDS[activeKey];
      if (!data) return;
      
      const updatedData = [];
      for (let i = 0; i < data.length; i++) {
        const timeEl = document.getElementById(`sched-time-${i}`);
        const actEl = document.getElementById(`sched-act-${i}`);
        const durEl = document.getElementById(`sched-dur-${i}`);
        const catEl = document.getElementById(`sched-cat-${i}`);
        
        if (timeEl && actEl && durEl && catEl) {
          updatedData.push({
            t: timeEl.value,
            a: actEl.value,
            d: durEl.value,
            cat: catEl.value
          });
        }
      }
      
      SCHEDS[activeKey] = updatedData;
      safeSetLocalStorage('neet_v3_custom_scheds', JSON.stringify(SCHEDS));
      window.isEditingSched = false;
      showSched();
      if (typeof showToast === 'function') {
        showToast("Timetable saved successfully!");
      } else {
        alert("Timetable saved successfully!");
      }
    }
    
    function addNewSchedRow() {
      const activeKey = window.activeSchedKey;
      if (!SCHEDS[activeKey]) SCHEDS[activeKey] = [];
      SCHEDS[activeKey].push({
        t: "12:00 PM",
        a: "New activity details",
        d: "30 min",
        cat: "break"
      });
      showSched();
    }
    
    function deleteSchedRow(idx) {
      const activeKey = window.activeSchedKey;
      if (!SCHEDS[activeKey]) return;
      SCHEDS[activeKey].splice(idx, 1);
      showSched();
    }
    
    function resetSchedToDefault() {
      if (confirm("Are you sure you want to reset this timetable to default PW settings?")) {
        const activeKey = window.activeSchedKey;
        SCHEDS[activeKey] = JSON.parse(JSON.stringify(DEFAULT_SCHEDS[activeKey]));
        safeSetLocalStorage('neet_v3_custom_scheds', JSON.stringify(SCHEDS));
        window.isEditingSched = false;
        showSched();
        if (typeof showToast === 'function') {
          showToast("Timetable reset to default!");
        } else {
          alert("Timetable reset to default!");
        }
      }
    }

    function toggleSyllabus(day) {
      const box = document.getElementById(`syllabus-box-${day}`);
      if (box) {
        if (box.style.display === 'none') {
          box.style.display = 'block';
        } else {
          box.style.display = 'none';
        }
      }
    }
    
    function openTestAnalysisModal(day) {
      const r = PLAN.find(item => item.day === day);
      if (!r) return;
      
      const dayEl = document.getElementById('analysis-day');
      const titleEl = document.getElementById('test-analysis-title');
      const marksEl = document.getElementById('analysis-marks');
      const rightEl = document.getElementById('analysis-right');
      const wrongEl = document.getElementById('analysis-wrong');
      const unattemptedEl = document.getElementById('analysis-unattempted');
      const weakEl = document.getElementById('analysis-weak');
      const modal = document.getElementById('test-analysis-modal');
      
      if (!modal) return;
      
      if (dayEl) dayEl.value = day;
      if (titleEl) titleEl.textContent = `Analysis: ${r.phy.replace('📝 Test: ', '').replace('📝 ', '')}`;
      
      const log = (testAnalysisLogs && testAnalysisLogs[day]) ? testAnalysisLogs[day] : { marks: '', right: '', wrong: '', unattempted: '', weak: '' };
      
      if (marksEl) marksEl.value = log.marks || '';
      if (rightEl) rightEl.value = log.right || '';
      if (wrongEl) wrongEl.value = log.wrong || '';
      if (unattemptedEl) unattemptedEl.value = log.unattempted || '';
      if (weakEl) weakEl.value = log.weak || '';
      
      modal.classList.add('active');
    }
    
    function closeTestAnalysisModal() {
      const modal = document.getElementById('test-analysis-modal');
      if (modal) modal.classList.remove('active');
    }
    
    function saveTestAnalysis(e) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      
      const dayEl = document.getElementById('analysis-day');
      if (!dayEl) return;
      const day = parseInt(dayEl.value);
      if (!day) return;
      
      const marksEl = document.getElementById('analysis-marks');
      const rightEl = document.getElementById('analysis-right');
      const wrongEl = document.getElementById('analysis-wrong');
      const unattemptedEl = document.getElementById('analysis-unattempted');
      const weakEl = document.getElementById('analysis-weak');
      
      if (!marksEl || !rightEl || !wrongEl || !weakEl) return;
      
      const marks = parseInt(marksEl.value) || 0;
      const right = parseInt(rightEl.value) || 0;
      const wrong = parseInt(wrongEl.value) || 0;
      const unattempted = parseInt(unattemptedEl.value) || 0;
      const weak = weakEl.value;
      
      if (!testAnalysisLogs) testAnalysisLogs = {};
      testAnalysisLogs[day] = {
        marks,
        right,
        wrong,
        unattempted,
        weak
      };
      
      if (typeof done !== 'undefined') {
        if (!done[day]) {
          done[day] = true;
          safeSetLocalStorage('neet_v3_done', JSON.stringify(done));
        }
      }
      
      safeSetLocalStorage('neet_v3_test_analysis', JSON.stringify(testAnalysisLogs));
      closeTestAnalysisModal();
      
      if (typeof renderTestList === 'function') renderTestList();
      if (typeof renderCal === 'function') renderCal();
      
      if (typeof showToast === 'function') {
        showToast("Test performance logged!");
      } else {
        alert("Test performance logged!");
      }
    }
    
    function openWeakTopicsModal() {
      const container = document.getElementById('weak-topics-list');
      const modal = document.getElementById('weak-topics-modal');
      if (!container || !modal) return;
      
      const logs = Object.entries(testAnalysisLogs || {}).filter(([day, log]) => log && typeof log === 'object' && log.weak && String(log.weak).trim());
      
      if (logs.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:30px 10px; font-size:13.5px;">
          No weak topics logged yet! Log test analyses to compile your revision checklist.
        </div>`;
      } else {
        let html = '';
        logs.forEach(([day, log]) => {
          const r = (typeof PLAN !== 'undefined') ? PLAN.find(item => item.day === parseInt(day)) : null;
          const testName = r ? r.phy.replace('📝 Test: ', '').replace('📝 ', '') : `Day ${day} Test`;
          const topics = String(log.weak || '').split(/[\n,;\r]+/).map(t => t.trim()).filter(Boolean);
          
          let topicsList = '';
          topics.forEach((topic, idx) => {
            topicsList += `
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                <input type="checkbox" style="width:16px; height:16px; accent-color:var(--primary); cursor:pointer;" id="weak-item-${day}-${idx}">
                <label for="weak-item-${day}-${idx}" style="font-size:13px; color:var(--text-primary); cursor:pointer; user-select:none;">${topic}</label>
              </div>
            `;
          });
          
          html += `
            <div class="glass-card" style="padding:14px; border-left:3px solid var(--tertiary); background:rgba(255,255,255,0.02); margin-bottom:10px;">
              <div style="font-weight:800; font-size:12px; color:var(--tertiary); margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                <span>${testName}</span>
                <span style="opacity:0.6; font-size:10px; font-weight:normal;">Score: ${log.marks || 0}/720</span>
              </div>
              <div style="display:flex; flex-direction:column; padding-left:4px;">
                ${topicsList}
              </div>
            </div>
          `;
        });
        container.innerHTML = html;
      }
      
      modal.classList.add('active');
    }
    
    function closeWeakTopicsModal() {
      const modal = document.getElementById('weak-topics-modal');
      if (modal) modal.classList.remove('active');
    }
    
    // Chapter List Progress Table
    function renderChapters() {
      const qEl = document.getElementById('chap-srch');
      const subEl = document.getElementById('chap-subf');
      const q = qEl ? qEl.value.toLowerCase() : '';
      const sub = subEl ? subEl.value : '';
      
      let list11 = [];
      let list12 = [];
      
      if (sub === '' || sub === 'phy') {
        P1_PHY.forEach(c => list11.push({ ...c, sub: 'Physics', cls: '11' }));
        P2_PHY.forEach(c => list12.push({ ...c, sub: 'Physics', cls: '12' }));
      }
      if (sub === '' || sub === 'che') {
        P1_CHE.forEach(c => list11.push({ ...c, sub: 'Chemistry', cls: '11' }));
        P2_CHE.forEach(c => list12.push({ ...c, sub: 'Chemistry', cls: '12' }));
      }
      if (sub === '' || sub === 'bio') {
        P1_BIO.forEach(c => list11.push({ ...c, sub: 'Biology', cls: '11' }));
        P2_BIO.forEach(c => list12.push({ ...c, sub: 'Biology', cls: '12' }));
      }
      
      function makeRows(filtered) {
        if (filtered.length === 0) {
          return '<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:20px;">No chapters match the filters.</td></tr>';
        }
        let html = '';
        filtered.forEach(c => {
          const chName = c.ch.trim();
          const prog = chapterProgress[chName] || { understand: false, practice: false, revise: false };
          
          let subClr = 'var(--phy)';
          let badgeCls = 'badge-phy';
          let rowCls = 'row-phy';
          let prefix = '⚡ ';
          if (c.sub === 'Chemistry') {
            subClr = 'var(--che)';
            badgeCls = 'badge-che';
            rowCls = 'row-che';
            prefix = '🧪 ';
          } else if (c.sub === 'Biology') {
            subClr = 'var(--bio)';
            badgeCls = 'badge-bio';
            rowCls = 'row-bio';
            prefix = '🧬 ';
          }
          
          let wtBadge = '<span class="type-badge" style="background:rgba(255,255,255,0.03); color:var(--text-muted);">L</span>';
          if (c.wt === 'h') wtBadge = '<span class="type-badge" style="background:rgba(255,107,107,0.1); color:var(--tertiary);">High</span>';
          if (c.wt === 'm') wtBadge = '<span class="type-badge" style="background:rgba(0,212,170,0.1); color:var(--primary);">Med</span>';
          
          const connTip = CONNS[chName] ? `<div style="font-size:10px; color:var(--text-muted); margin-top:2px;">${CONNS[chName]}</div>` : '';
          
          html += `<tr class="${rowCls}">
            <td><span class="subject-badge ${badgeCls}" style="font-size: 10px; padding: 2px 8px;">${prefix}${c.sub}</span></td>
            <td>
              <div style="font-weight:600;">${c.ch}</div>
              ${connTip}
            </td>
            <td style="text-align:center;">${wtBadge}</td>
            <td>
              <div class="three-step-grid">
                <label class="step-box">
                  <input type="checkbox" class="done-cb" ${prog.understand ? 'checked' : ''} onchange="toggleChapterStep('${chName.replace(/'/g, "\'")}', 'understand')">
                  <span>Understand</span>
                </label>
                <label class="step-box">
                  <input type="checkbox" class="done-cb" ${prog.practice ? 'checked' : ''} onchange="toggleChapterStep('${chName.replace(/'/g, "\'")}', 'practice')">
                  <span>Practice</span>
                </label>
                <label class="step-box">
                  <input type="checkbox" class="done-cb" ${prog.revise ? 'checked' : ''} onchange="toggleChapterStep('${chName.replace(/'/g, "\'")}', 'revise')">
                  <span>Revise</span>
                </label>
              </div>
            </td>
            <td style="text-align:center;">
              <div style="display:flex; gap:6px; justify-content:center; flex-wrap:wrap;">
                <button class="btn btn-secondary" style="padding:6px 12px; font-size:11px; white-space:nowrap;" onclick="openPyqModal('${chName.replace(/'/g, "\'")}')">📖 Solve PYQs</button>
                <button class="btn btn-primary" style="padding:6px 12px; font-size:11px; white-space:nowrap;" onclick="generateAiChapterTest('${chName.replace(/'/g, "\'")}')">🤖 AI Test</button>
              </div>
            </td>
          </tr>`;
        });
        return html;
      }
      
      const filtered11 = list11.filter(c => !q || c.ch.toLowerCase().includes(q));
      const filtered12 = list12.filter(c => !q || c.ch.toLowerCase().includes(q));
      
      const tb11 = document.getElementById('chaps-body-11');
      if (tb11) tb11.innerHTML = makeRows(filtered11);
      const tb12 = document.getElementById('chaps-body-12');
      if (tb12) tb12.innerHTML = makeRows(filtered12);
    }
    
    function toggleChapterStep(chName, step) {
      if (!chapterProgress[chName]) {
        chapterProgress[chName] = { understand: false, practice: false, revise: false };
      }
      chapterProgress[chName][step] = !chapterProgress[chName][step];
      safeSetLocalStorage('neet_v3_chapter_progress', JSON.stringify(chapterProgress));
      renderChapters();
      updateOverviewStats();
    }
    
    function getProceduralDiagram(chName, qText, qIdx) {
      const sub = getSubjectForChapter(chName).toLowerCase();
      const text = (qText + " " + chName).toLowerCase();
      
      const arrow = `<defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 2 L 10 5 L 0 8 z" fill="#00d4aa"/>
        </marker>
      </defs>`;

      if (sub === 'physics') {
        if (text.includes('prism') || text.includes('refraction') || text.includes('light')) {
          return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
            <polygon points="100,20 40,110 160,110" fill="#e2e8f0" stroke="#333" stroke-width="2"/>
            <path d="M10,85 L70,68 L130,75 L190,105" stroke="#ff6b6b" stroke-width="2.5" fill="none"/>
            <text x="100" y="60" font-family="Inter, sans-serif" font-size="12" fill="#7c5cfc" text-anchor="middle" font-weight="bold">A</text>
            <text x="100" y="100" font-family="Inter, sans-serif" font-size="10" fill="#333" text-anchor="middle">Prism</text>
          </svg>`;
        }
        if (text.includes('slit') || text.includes('interference') || text.includes('diffraction')) {
          return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
            <line x1="40" y1="10" x2="40" y2="50" stroke="#333" stroke-width="3"/>
            <line x1="40" y1="60" x2="40" y2="80" stroke="#333" stroke-width="3"/>
            <line x1="40" y1="90" x2="40" y2="120" stroke="#333" stroke-width="3"/>
            <line x1="170" y1="10" x2="170" y2="120" stroke="#333" stroke-width="2"/>
            <path d="M40,55 L170,30 M40,85 L170,30" stroke="#7c5cfc" stroke-width="1.5" stroke-dasharray="2,2"/>
            <circle cx="170" cy="30" r="4" fill="#ff6b6b"/>
            <text x="135" y="25" font-family="Inter, sans-serif" font-size="9" fill="#ff6b6b" font-weight="bold">P (Max)</text>
            <text x="25" y="68" font-family="Inter, sans-serif" font-size="9" fill="#333" font-weight="bold">S1</text>
            <text x="25" y="98" font-family="Inter, sans-serif" font-size="9" fill="#333" font-weight="bold">S2</text>
            <text x="180" y="65" font-family="Inter, sans-serif" font-size="9" fill="#333" font-weight="bold">Screen</text>
          </svg>`;
        }
        if (text.includes('lens') || text.includes('mirror') || text.includes('optics')) {
          return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
            <line x1="10" y1="65" x2="190" y2="65" stroke="#333" stroke-width="1.5"/>
            <path d="M100,20 Q112,65 100,110 Q88,65 100,20" fill="#e2e8f0" stroke="#333" stroke-width="2"/>
            <line x1="30" y1="65" x2="30" y2="40" stroke="#ff6b6b" stroke-width="2"/>
            <text x="25" y="35" font-family="Inter, sans-serif" font-size="9" fill="#ff6b6b" font-weight="bold">Object</text>
            <path d="M30,40 L100,40 L160,85" stroke="#7c5cfc" stroke-width="1.5" fill="none"/>
            <path d="M30,40 L100,65 L160,85" stroke="#7c5cfc" stroke-width="1.5" fill="none"/>
            <line x1="160" y1="65" x2="160" y2="85" stroke="#00d4aa" stroke-width="2"/>
            <text x="150" y="98" font-family="Inter, sans-serif" font-size="9" fill="#00d4aa" font-weight="bold">Image</text>
          </svg>`;
        }
        if (text.includes('capacitor') || text.includes('dielectric') || text.includes('plate')) {
          return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
            <line x1="70" y1="20" x2="70" y2="110" stroke="#333" stroke-width="4"/>
            <line x1="130" y1="20" x2="130" y2="110" stroke="#333" stroke-width="4"/>
            <rect x="80" y="20" width="40" height="90" fill="#93c5fd" opacity="0.6"/>
            <text x="100" y="70" font-family="Inter, sans-serif" font-size="11" fill="#1e3a8a" text-anchor="middle" font-weight="bold">Dielectric (K)</text>
            <line x1="30" y1="65" x2="70" y2="65" stroke="#333" stroke-width="2"/>
            <line x1="130" y1="65" x2="170" y2="65" stroke="#333" stroke-width="2"/>
            <text x="50" y="55" font-family="Inter, sans-serif" font-size="10" fill="#00d4aa" font-weight="bold">+</text>
            <text x="145" y="55" font-family="Inter, sans-serif" font-size="10" fill="#ff6b6b" font-weight="bold">-</text>
          </svg>`;
        }
        if (text.includes('bridge') || text.includes('wheatstone') || text.includes('galvanometer')) {
          return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
            <polygon points="100,15 150,65 100,115 50,65" fill="none" stroke="#333" stroke-width="2"/>
            <circle cx="100" cy="15" r="4" fill="#333"/>
            <circle cx="150" cy="65" r="4" fill="#333"/>
            <circle cx="100" cy="115" r="4" fill="#333"/>
            <circle cx="50" cy="65" r="4" fill="#333"/>
            <line x1="50" y1="65" x2="150" y2="65" stroke="#ff6b6b" stroke-width="2"/>
            <circle cx="100" cy="65" r="12" fill="#ffffff" stroke="#ff6b6b" stroke-width="2"/>
            <text x="100" y="69" font-family="Inter, sans-serif" font-size="10" fill="#ff6b6b" text-anchor="middle" font-weight="bold">G</text>
            <text x="70" y="35" font-family="Inter, sans-serif" font-size="9" fill="#7c5cfc" font-weight="bold">P</text>
            <text x="125" y="35" font-family="Inter, sans-serif" font-size="9" fill="#7c5cfc" font-weight="bold">Q</text>
            <text x="70" y="98" font-family="Inter, sans-serif" font-size="9" fill="#7c5cfc" font-weight="bold">R</text>
            <text x="125" y="98" font-family="Inter, sans-serif" font-size="9" fill="#7c5cfc" font-weight="bold">S</text>
          </svg>`;
        }
        if (text.includes('circuit') || text.includes('lcr') || text.includes('ac') || text.includes('inductor')) {
          return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
            <rect x="25" y="30" width="150" height="70" fill="none" stroke="#333" stroke-width="2"/>
            <rect x="50" y="20" width="20" height="20" fill="#fff" stroke="#333" stroke-width="2"/>
            <path d="M90,30 C90,20 110,20 110,30" fill="none" stroke="#333" stroke-width="2"/>
            <line x1="140" y1="20" x2="140" y2="40" stroke="#333" stroke-width="3"/>
            <line x1="148" y1="20" x2="148" y2="40" stroke="#333" stroke-width="3"/>
            <circle cx="100" cy="100" r="10" fill="#fff" stroke="#7c5cfc" stroke-width="2"/>
            <path d="M95,100 Q100,95 100,100 T105,100" fill="none" stroke="#7c5cfc" stroke-width="2"/>
            <text x="60" y="15" font-family="Inter, sans-serif" font-size="9" fill="#333" font-weight="bold">R</text>
            <text x="100" y="15" font-family="Inter, sans-serif" font-size="9" fill="#333" font-weight="bold">L</text>
            <text x="144" y="15" font-family="Inter, sans-serif" font-size="9" fill="#333" font-weight="bold">C</text>
            <text x="100" y="122" font-family="Inter, sans-serif" font-size="9" fill="#7c5cfc" text-anchor="middle" font-weight="bold">AC Source</text>
          </svg>`;
        }
        if (text.includes('gate') || text.includes('logic') || text.includes('nand') || text.includes('semiconductor')) {
          return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
            <path d="M50,30 L70,30 C80,30 90,35 90,45 C90,55 80,60 70,60 L50,60 Z" fill="#e2e8f0" stroke="#333" stroke-width="2"/>
            <circle cx="95" cy="45" r="4" fill="none" stroke="#333" stroke-width="2"/>
            <line x1="30" y1="38" x2="50" y2="38" stroke="#333" stroke-width="2"/>
            <line x1="30" y1="52" x2="50" y2="52" stroke="#333" stroke-width="2"/>
            <line x1="99" y1="45" x2="130" y2="45" stroke="#333" stroke-width="2"/>
            <text x="25" y="41" font-family="Inter, sans-serif" font-size="9" fill="#333" font-weight="bold">A</text>
            <text x="25" y="55" font-family="Inter, sans-serif" font-size="9" fill="#333" font-weight="bold">B</text>
            <text x="140" y="49" font-family="Inter, sans-serif" font-size="9" fill="#7c5cfc" font-weight="bold">Y = (AB)'</text>
            <text x="70" y="49" font-family="Inter, sans-serif" font-size="10" fill="#333" font-weight="bold">NAND</text>
          </svg>`;
        }
        if (text.includes('pulley') || text.includes('tension') || text.includes('mass')) {
          return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
            <circle cx="100" cy="40" r="20" stroke="#7c5cfc" stroke-width="3" fill="none"/>
            <circle cx="100" cy="40" r="4" fill="#7c5cfc"/>
            <line x1="80" y1="40" x2="80" y2="90" stroke="#333" stroke-width="2"/>
            <line x1="120" y1="40" x2="120" y2="70" stroke="#333" stroke-width="2"/>
            <rect x="70" y="90" width="20" height="20" rx="2" fill="#00d4aa"/>
            <text x="80" y="102" font-family="Inter, sans-serif" font-size="10" fill="#fff" text-anchor="middle" font-weight="bold">m1</text>
            <rect x="110" y="70" width="20" height="30" rx="2" fill="#ff6b6b"/>
            <text x="120" y="88" font-family="Inter, sans-serif" font-size="10" fill="#fff" text-anchor="middle" font-weight="bold">m2</text>
            <line x1="100" y1="10" x2="100" y2="20" stroke="#333" stroke-width="2"/>
            <line x1="70" y1="10" x2="130" y2="10" stroke="#333" stroke-width="3"/>
          </svg>`;
        }
        if (text.includes('projectile') || text.includes('velocity') || text.includes('angle') || text.includes('trajectory')) {
          return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
            ${arrow}
            <line x1="20" y1="110" x2="180" y2="110" stroke="#333" stroke-width="2"/>
            <line x1="20" y1="20" x2="20" y2="110" stroke="#333" stroke-width="2"/>
            <path d="M20,110 Q100,20 180,110" stroke="#7c5cfc" stroke-width="3" fill="none" stroke-dasharray="4,4"/>
            <circle cx="100" cy="65" r="5" fill="#ff6b6b"/>
            <text x="100" y="55" font-family="Inter, sans-serif" font-size="10" fill="#ff6b6b" text-anchor="middle" font-weight="bold">H_max</text>
            <path d="M20,110 L50,85" stroke="#00d4aa" stroke-width="2" marker-end="url(#arrow)"/>
            <text x="55" y="80" font-family="Inter, sans-serif" font-size="10" fill="#00d4aa" font-weight="bold">u</text>
          </svg>`;
        }
        if (text.includes('incline') || text.includes('friction') || text.includes('plane') || text.includes('force')) {
          return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
            <path d="M20,110 L180,110 L180,30 Z" fill="#e2e8f0" stroke="#333" stroke-width="2"/>
            <g transform="translate(100, 70) rotate(-26.5)">
              <rect x="-15" y="-20" width="30" height="20" fill="#7c5cfc" stroke="#333" stroke-width="2" rx="2"/>
              <text x="0" y="-8" font-family="Inter, sans-serif" font-size="10" fill="#fff" text-anchor="middle" font-weight="bold">m</text>
              <line x1="0" y1="-10" x2="35" y2="-10" stroke="#ff6b6b" stroke-width="2"/>
              <text x="40" y="-7" font-family="Inter, sans-serif" font-size="9" fill="#ff6b6b" font-weight="bold">F</text>
            </g>
            <text x="45" y="105" font-family="Inter, sans-serif" font-size="12" fill="#333" font-weight="bold">θ</text>
          </svg>`;
        }
        if (text.includes('wave') || text.includes('amplitude') || text.includes('harmonic') || text.includes('frequency') || text.includes('pendulum')) {
          return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
            <line x1="10" y1="65" x2="190" y2="65" stroke="#333" stroke-width="1.5"/>
            <line x1="20" y1="15" x2="20" y2="115" stroke="#333" stroke-width="1.5"/>
            <path d="M20,65 Q60,15 100,65 T180,65" stroke="#7c5cfc" stroke-width="3" fill="none"/>
            <line x1="60" y1="65" x2="60" y2="40" stroke="#00d4aa" stroke-width="2"/>
            <text x="65" y="55" font-family="Inter, sans-serif" font-size="10" fill="#00d4aa" font-weight="bold">Amp</text>
          </svg>`;
        }
        return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
          <line x1="30" y1="110" x2="180" y2="110" stroke="#333" stroke-width="2"/>
          <line x1="30" y1="20" x2="30" y2="110" stroke="#333" stroke-width="2"/>
          <path d="M30,95 Q70,90 100,50 T170,30" stroke="#7c5cfc" stroke-width="2.5" fill="none"/>
          <line x1="100" y1="50" x2="100" y2="110" stroke="#ff6b6b" stroke-width="1.5" stroke-dasharray="2,2"/>
          <circle cx="100" cy="50" r="4" fill="#ff6b6b"/>
          <text x="180" y="120" font-family="Inter, sans-serif" font-size="9" fill="#333" text-anchor="end">X</text>
          <text x="25" y="20" font-family="Inter, sans-serif" font-size="9" fill="#333">Y</text>
        </svg>`;
      } 
      
      if (sub === 'chemistry') {
        if (text.includes('benzene') || text.includes('organic') || text.includes('carbon') || text.includes('ring') || text.includes('hydrocarbon') || text.includes('acid') || text.includes('alcohol') || text.includes('amine')) {
          return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
            <polygon points="100,20 140,43 140,88 100,110 60,88 60,43" fill="none" stroke="#333" stroke-width="2"/>
            <polygon points="100,28 132,47 132,84 100,102 68,84 68,47" fill="none" stroke="#333" stroke-dasharray="4,4" stroke-width="1.5"/>
            <circle cx="100" cy="65" r="22" fill="none" stroke="#7c5cfc" stroke-width="2"/>
            <text x="100" y="70" font-family="Inter, sans-serif" font-size="11" fill="#7c5cfc" text-anchor="middle" font-weight="bold">Benzene</text>
          </svg>`;
        }
        if (text.includes('activation') || text.includes('kinetics') || text.includes('energy') || text.includes('profile') || text.includes('reactant') || text.includes('product')) {
          return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
            <line x1="20" y1="110" x2="180" y2="110" stroke="#333" stroke-width="1.5"/>
            <line x1="25" y1="20" x2="25" y2="115" stroke="#333" stroke-width="1.5"/>
            <path d="M25,85 Q65,85 85,30 T165,95" stroke="#7c5cfc" stroke-width="3" fill="none"/>
            <text x="40" y="80" font-family="Inter, sans-serif" font-size="9" fill="#333">Reactants</text>
            <text x="155" y="90" font-family="Inter, sans-serif" font-size="9" fill="#333">Products</text>
            <line x1="85" y1="30" x2="85" y2="85" stroke="#ff6b6b" stroke-width="1.5" stroke-dasharray="2,2"/>
            <text x="90" y="55" font-family="Inter, sans-serif" font-size="9" fill="#ff6b6b" font-weight="bold">E_act</text>
          </svg>`;
        }
        if (text.includes('beaker') || text.includes('solution') || text.includes('concentration') || text.includes('solute') || text.includes('water') || text.includes('equilibrium') || text.includes('liquid')) {
          return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
            <rect x="60" y="30" width="80" height="80" rx="3" fill="none" stroke="#333" stroke-width="3"/>
            <path d="M60,65 L140,65 L140,110 L60,110 Z" fill="#93c5fd" opacity="0.5"/>
            <circle cx="80" cy="80" r="4" fill="#ff6b6b"/>
            <circle cx="120" cy="75" r="4" fill="#ff6b6b"/>
            <circle cx="95" cy="95" r="4" fill="#ff6b6b"/>
            <circle cx="110" cy="85" r="4" fill="#ff6b6b"/>
            <text x="100" y="55" font-family="Inter, sans-serif" font-size="10" fill="#1e3a8a" text-anchor="middle" font-weight="bold">Solution</text>
          </svg>`;
        }
        if (text.includes('cell') || text.includes('galvanic') || text.includes('electrode') || text.includes('salt') || text.includes('redox')) {
          return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
            <rect x="35" y="50" width="45" height="60" rx="2" fill="none" stroke="#333" stroke-width="2"/>
            <rect x="120" y="50" width="45" height="60" rx="2" fill="none" stroke="#333" stroke-width="2"/>
            <path d="M35,70 L80,70 L80,110 L35,110 Z" fill="#93c5fd" opacity="0.5"/>
            <path d="M120,70 L165,70 L165,110 L120,110 Z" fill="#93c5fd" opacity="0.5"/>
            <rect x="50" y="40" width="10" height="50" fill="#94a3b8" stroke="#333"/>
            <rect x="140" y="40" width="10" height="50" fill="#d97706" stroke="#333"/>
            <path d="M70,60 Q100,30 130,60" fill="none" stroke="#ff6b6b" stroke-width="2" stroke-dasharray="3,3"/>
            <text x="100" y="25" font-family="Inter, sans-serif" font-size="9" fill="#ff6b6b" text-anchor="middle" font-weight="bold">Salt Bridge</text>
          </svg>`;
        }
        return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
          <circle cx="100" cy="65" r="14" fill="#7c5cfc" stroke="#333" stroke-width="2"/>
          <text x="100" y="69" font-family="Inter, sans-serif" font-size="10" fill="#fff" text-anchor="middle" font-weight="bold">M</text>
          <line x1="100" y1="65" x2="60" y2="40" stroke="#333" stroke-width="2"/>
          <circle cx="60" cy="40" r="8" fill="#00d4aa" stroke="#333"/>
          <text x="60" y="43" font-family="Inter, sans-serif" font-size="8" fill="#fff" text-anchor="middle">L</text>
          <line x1="100" y1="65" x2="140" y2="40" stroke="#333" stroke-width="2"/>
          <circle cx="140" cy="40" r="8" fill="#00d4aa" stroke="#333"/>
          <text x="140" y="43" font-family="Inter, sans-serif" font-size="8" fill="#fff" text-anchor="middle">L</text>
          <line x1="100" y1="65" x2="100" y2="105" stroke="#333" stroke-width="2"/>
          <circle cx="100" cy="105" r="8" fill="#00d4aa" stroke="#333"/>
          <text x="100" y="108" font-family="Inter, sans-serif" font-size="8" fill="#fff" text-anchor="middle">L</text>
        </svg>`;
      }
      
      if (text.includes('cycle') || text.includes('cell division') || text.includes('mitosis') || text.includes('meiosis') || text.includes('phase')) {
        return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
          <circle cx="100" cy="65" r="40" fill="none" stroke="#333" stroke-width="4"/>
          <circle cx="100" cy="65" r="30" fill="none" stroke="#e2e8f0" stroke-width="2"/>
          <line x1="100" y1="25" x2="100" y2="65" stroke="#333" stroke-width="1.5"/>
          <line x1="140" y1="65" x2="100" y2="65" stroke="#333" stroke-width="1.5"/>
          <line x1="100" y1="105" x2="100" y2="65" stroke="#333" stroke-width="1.5"/>
          <text x="120" y="45" font-family="Inter, sans-serif" font-size="10" fill="#7c5cfc" font-weight="bold">G1</text>
          <text x="120" y="90" font-family="Inter, sans-serif" font-size="10" fill="#ff6b6b" font-weight="bold">S</text>
          <text x="75" y="90" font-family="Inter, sans-serif" font-size="10" fill="#00d4aa" font-weight="bold">G2</text>
          <text x="75" y="45" font-family="Inter, sans-serif" font-size="10" fill="#eab308" font-weight="bold">M</text>
        </svg>`;
      }
      if (text.includes('dna') || text.includes('helix') || text.includes('nucleosome') || text.includes('histone') || text.includes('replication') || text.includes('transcription') || text.includes('genetics') || text.includes('gene')) {
        if (text.includes('replication') || text.includes('fork') || text.includes('lagging') || text.includes('leading')) {
          return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
            <path d="M20,30 L90,65 L180,65" stroke="#333" stroke-width="2" fill="none"/>
            <path d="M20,100 L90,65 L180,65" stroke="#333" stroke-width="2" fill="none"/>
            <path d="M90,65 L160,45" stroke="#7c5cfc" stroke-width="2" fill="none"/>
            <path d="M120,80 L160,80" stroke="#ff6b6b" stroke-width="2" fill="none"/>
            <path d="M95,85 L110,85" stroke="#ff6b6b" stroke-width="2" fill="none"/>
            <text x="135" y="38" font-family="Inter, sans-serif" font-size="8" fill="#7c5cfc" font-weight="bold">Leading</text>
            <text x="135" y="93" font-family="Inter, sans-serif" font-size="8" fill="#ff6b6b" font-weight="bold">Lagging</text>
          </svg>`;
        }
        return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
          <path d="M20,65 Q45,15 70,65 T120,65 T170,65" stroke="#7c5cfc" stroke-width="2.5" fill="none"/>
          <path d="M20,65 Q45,115 70,65 T120,65 T170,65" stroke="#ff6b6b" stroke-width="2.5" fill="none"/>
          <line x1="45" y1="40" x2="45" y2="90" stroke="#333" stroke-dasharray="2,2"/>
          <line x1="95" y1="40" x2="95" y2="90" stroke="#333" stroke-dasharray="2,2"/>
          <line x1="145" y1="40" x2="145" y2="90" stroke="#333" stroke-dasharray="2,2"/>
        </svg>`;
      }
      if (text.includes('nephron') || text.includes('kidney') || text.includes('excretion') || text.includes('tubule') || text.includes('physiology')) {
        return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
          <path d="M30,30 Q50,20 60,40 T90,50 T100,90 T110,90 T120,40 T150,30" fill="none" stroke="#333" stroke-width="2.5"/>
          <path d="M20,40 L40,40" stroke="#ff6b6b" stroke-width="2"/>
          <path d="M20,45 L40,45" stroke="#93c5fd" stroke-width="2"/>
          <text x="20" y="32" font-family="Inter, sans-serif" font-size="8" fill="#333">PCT</text>
          <text x="145" y="25" font-family="Inter, sans-serif" font-size="8" fill="#333">DCT</text>
          <text x="105" y="110" font-family="Inter, sans-serif" font-size="8" fill="#333" text-anchor="middle">Henle</text>
        </svg>`;
      }
      if (text.includes('antibody') || text.includes('immune') || text.includes('antigen') || text.includes('ig')) {
        return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
          <path d="M60,20 L100,70 L100,120 M140,20 L100,70" stroke="#7c5cfc" stroke-width="3" fill="none"/>
          <path d="M70,30 L100,75 M130,30 L100,75" stroke="#ff6b6b" stroke-width="2" fill="none"/>
          <text x="100" y="12" font-family="Inter, sans-serif" font-size="9" fill="#7c5cfc" text-anchor="middle" font-weight="bold">Binding Site</text>
        </svg>`;
      }
      if (text.includes('leaf') || text.includes('plant') || text.includes('photosynthesis') || text.includes('respiration') || text.includes('chloroplast') || text.includes('stroma') || text.includes('botany')) {
        return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
          <ellipse cx="100" cy="65" rx="70" ry="45" fill="#f0fdf4" stroke="#16a34a" stroke-width="2.5"/>
          <ellipse cx="100" cy="65" rx="64" ry="39" fill="none" stroke="#16a34a" stroke-width="1.5"/>
          <rect x="65" y="55" width="20" height="6" fill="#15803d" rx="1"/>
          <rect x="65" y="63" width="20" height="6" fill="#15803d" rx="1"/>
          <rect x="65" y="71" width="20" height="6" fill="#15803d" rx="1"/>
          <rect x="115" y="55" width="20" height="6" fill="#15803d" rx="1"/>
          <rect x="115" y="63" width="20" height="6" fill="#15803d" rx="1"/>
          <rect x="115" y="71" width="20" height="6" fill="#15803d" rx="1"/>
          <line x1="85" y1="63" x2="115" y2="63" stroke="#16a34a" stroke-width="1.5"/>
        </svg>`;
      }
      return `<svg width="200" height="130" viewBox="0 0 200 130" style="background:#ffffff; border:1px solid #ddd; border-radius:8px; display:block; margin:0 auto;">
        <rect x="40" y="20" width="120" height="90" rx="15" fill="#f8fafc" stroke="#333" stroke-width="2"/>
        <circle cx="100" cy="65" r="22" fill="#e2e8f0" stroke="#7c5cfc" stroke-width="1.5"/>
        <circle cx="100" cy="65" r="8" fill="#7c5cfc"/>
        <path d="M60,35 Q65,45 75,40" stroke="#ff6b6b" stroke-width="2" fill="none"/>
        <path d="M130,85 Q135,95 145,90" stroke="#00d4aa" stroke-width="2" fill="none"/>
      </svg>`;
    }

    // PYQ Modal
    let currentChForPyq = '';
    function openPyqModal(chName) {
      currentChForPyq = chName;
      const modal = document.getElementById('pyq-modal');
      const title = document.getElementById('pyq-modal-title');
      const body = document.getElementById('pyq-modal-body');
      
      title.textContent = `PYQ Bank: ${chName}`;
      modal.classList.add('active');
      
      const qs = PYQ_BANK[chName];
      if (!qs || qs.length === 0) {
        body.innerHTML = `
          <div style="text-align:center; padding:40px 20px;">
            <div style="font-size:48px; margin-bottom:16px;">⚠️</div>
            <div style="font-size:16px; font-weight:700; color:var(--tertiary); margin-bottom:8px;">Removed from NEET Syllabus</div>
            <div style="font-size:13px; color:var(--text-muted); line-height:1.6; max-width:400px; margin:0 auto;">
              This chapter has been officially removed from the latest NEET syllabus by NTA/NMC. You do not need to study or practice this chapter for your NEET 2027 preparation.
            </div>
          </div>
        `;
        return;
      }
      
      let html = '';
      qs.forEach((q, qIdx) => {
        let diagHtml = '';
        if (q.diagram) {
          if (q.diagram.startsWith('images/') || q.diagram.startsWith('data:image') || q.diagram.startsWith('http')) {
            diagHtml = `<div class="pyq-diagram" style="margin:16px 0; text-align:center;"><img src="${q.diagram}" style="max-width:100%; max-height:220px; border-radius:8px; border:1px solid #e2e8f0; padding:6px; background:#fff;" alt="Diagram"></div>`;
          } else {
            diagHtml = `<div class="pyq-diagram" style="margin:16px 0; text-align:center;">${q.diagram}</div>`;
          }
        } else {
          diagHtml = '';
        }
        html += `
        <div class="pyq-card" id="q-card-${qIdx}">
          <div class="pyq-header">
            <span class="pyq-badge">${q.year}</span>
            <span class="pyq-num">Question ${qIdx + 1} of ${qs.length}</span>
          </div>
          <div class="pyq-question">${q.q}</div>
          ${diagHtml}
          <div class="pyq-options">
            ${q.opts.map((opt, oIdx) => `
              <button class="pyq-opt-btn" onclick="selectOption(${qIdx}, ${oIdx})">
                <span class="opt-letter">${String.fromCharCode(65 + oIdx)}</span>
                <span class="opt-text">${opt}</span>
              </button>
            `).join('')}
          </div>
          <div class="pyq-explanation" id="exp-${qIdx}" style="display:none;">
            <div class="exp-title">Explanation:</div>
            <div class="exp-text">${q.exp}</div>
          </div>
        </div>
        `;
      });
      body.innerHTML = html;
      renderMath(body);
    }
    
    function selectOption(qIdx, oIdx) {
      const chName = currentChForPyq;
      const q = PYQ_BANK[chName][qIdx];
      const card = document.getElementById(`q-card-${qIdx}`);
      const btns = card.querySelectorAll('.pyq-opt-btn');
      
      btns.forEach(btn => btn.disabled = true);
      
      if (oIdx === q.ans) {
        btns[oIdx].classList.add('correct');
      } else {
        btns[oIdx].classList.add('wrong');
        btns[q.ans].classList.add('correct');
      }
      
      const exp = document.getElementById(`exp-${qIdx}`);
      if (exp) exp.style.display = 'block';
    }
    
    function closePyqModal() {
      document.getElementById('pyq-modal').classList.remove('active');
    }
    
    // Close modal on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closePyqModal();
        if (typeof closeTestAnalysisModal === 'function') closeTestAnalysisModal();
        if (typeof closeWeakTopicsModal === 'function') closeWeakTopicsModal();
      }
    });
    
    // Tests & Mocks list
    function renderTestList() {
      const q = (document.getElementById('test-srch') || {value:''}).value.toLowerCase();
      
      const tests = PLAN.filter(r => (r.type === 'test' || r.type === 'mock') && 
        (!q || r.phy.toLowerCase().includes(q) || r.che.toLowerCase().includes(q) || r.bio.toLowerCase().includes(q) || `day ${r.day}`.includes(q) || r.date.toLowerCase().includes(q) || (r.phyNote && r.phyNote.toLowerCase().includes(q)))
      );
      
      let html = '';
      if (tests.length === 0) {
        html = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding: 30px;">No tests match the filter.</td></tr>';
      } else {
        tests.forEach(r => {
          const isDone = !!done[r.day];
          const analysis = testAnalysisLogs[r.day];
          
          let analysisSummary = '';
          if (analysis) {
            analysisSummary = `
              <div class="analysis-summary-badge" style="display:inline-flex; flex-wrap:wrap; gap:8px; margin-top:8px; font-size:11px; background:rgba(0,212,170,0.08); border:1px solid rgba(0,212,170,0.15); border-radius:4px; padding:4px 8px; color:var(--primary); font-weight:600;">
                <span>Score: ${analysis.marks}/720</span>
                <span style="opacity:0.4;">|</span>
                <span>Correct: ${analysis.right}</span>
                <span style="opacity:0.4;">|</span>
                <span>Incorrect: ${analysis.wrong}</span>
                ${analysis.unattempted ? `<span style="opacity:0.4;">|</span><span>Skipped: ${analysis.unattempted}</span>` : ''}
              </div>
              ${analysis.weak ? `<div style="font-size:11px; margin-top:4px; color:var(--text-muted); font-style:italic;">🔴 Focus Areas: ${analysis.weak.replace(/'/g, "\'")}</div>` : ''}
            `;
          }

          const testDesc = `
            <div style="font-weight:600; font-size:13.5px; display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:4px;">
              <span class="subject-badge badge-phy" style="padding:1.5px 5px; font-size:9px;">⚡ Physics</span>
              <span style="color:var(--text-primary);">${r.phy}</span>
            </div>
            <div style="font-size:11.5px; color:var(--text-muted); display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px;">
              <span style="display:inline-flex; align-items:center; gap:4px;"><span class="subject-badge badge-che" style="padding:1px 4px; font-size:8px;">🧪 Chem</span> ${r.che}</span>
              <span>&middot;</span>
              <span style="display:inline-flex; align-items:center; gap:4px;"><span class="subject-badge badge-bio" style="padding:1px 4px; font-size:8px;">🧬 Bio</span> ${r.bio}</span>
            </div>
            
            <!-- Syllabus and Analysis Actions -->
            <div style="display:flex; align-items:center; gap:8px; margin-top:8px;">
              <button class="btn btn-secondary" style="font-size:10.5px; padding:3px 8px;" onclick="toggleSyllabus(${r.day})">📋 Syllabus</button>
              <button class="btn btn-secondary" style="font-size:10.5px; padding:3px 8px; border-color:rgba(96,165,250,0.4); color:#60a5fa;" onclick="openTestAnalysisModal(${r.day})">📊 Log Analysis</button>
            </div>
            
            <!-- Hidden Syllabus Box -->
            <div id="syllabus-box-${r.day}" style="display:none; margin-top:8px; padding:10px; background:rgba(255,255,255,0.03); border-radius:4px; border-left:3px solid var(--primary); font-size:12px; line-height:1.5; color:#cbd5e1;">
              ${r.phyNote || "Syllabus details not available."}
            </div>
            
            ${analysisSummary}
          `;
          html += `<tr class="${isDone ? 'done-row' : ''}">
            <td style="font-weight:600;">Day ${r.day}</td>
            <td>${r.date}</td>
            <td>${testDesc}</td>
            <td style="text-align:center;"><input type="checkbox" class="done-cb" ${isDone ? 'checked' : ''} onchange="toggleDone(${r.day})"></td>
          </tr>`;
        });
      }
      const tlb = document.getElementById('test-list-body');
      if (tlb) tlb.innerHTML = html;
    }
    
    // Tracker Session Management
    function logStudy(e) {
      e.preventDefault();
      const date = document.getElementById('track-date').value;
      const phy = parseFloat(document.getElementById('track-phy').value) || 0;
      const chem = parseFloat(document.getElementById('track-chem').value) || 0;
      const bio = parseFloat(document.getElementById('track-bio').value) || 0;
      const mcqs = parseInt(document.getElementById('track-mcqs').value) || 0;
      const confidence = parseInt(document.getElementById('track-confidence').value) || 3;
      const notes = document.getElementById('track-notes').value;
      
      if (phy === 0 && chem === 0 && bio === 0) {
        alert('Please log study hours for at least one subject.');
        return;
      }
      
      const newEntry = { date, phyHours: phy, cheHours: chem, bioHours: bio, mcqs, confidence, notes };
      
      const idx = trackerLogs.findIndex(l => l.date === date);
      if (idx !== -1) {
        trackerLogs[idx] = newEntry;
      } else {
        trackerLogs.push(newEntry);
      }
      
      // Sort by date descending
      trackerLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      safeSetLocalStorage('neet_v3_tracker', JSON.stringify(trackerLogs));
      renderTrackerTable();
      updateOverviewStats();
      
      // Reset inputs
      document.getElementById('track-phy').value = '';
      document.getElementById('track-chem').value = '';
      document.getElementById('track-bio').value = '';
      document.getElementById('track-mcqs').value = '';
      document.getElementById('track-notes').value = '';
      
      showToast('Study session saved successfully!');
    }
    
    function deleteTrackerEntry(date) {
      if (confirm(`Delete study entry for ${date}?`)) {
        trackerLogs = trackerLogs.filter(l => l.date !== date);
        safeSetLocalStorage('neet_v3_tracker', JSON.stringify(trackerLogs));
        renderTrackerTable();
        updateOverviewStats();
        showToast('Study session deleted.');
      }
    }
    
    function renderTrackerTable() {
      const tbody = document.getElementById('tracker-table-body');
      if (!tbody) return;
      
      // Render heatmap
      if (typeof renderHeatmap === 'function') {
        renderHeatmap();
      }
      
      if (trackerLogs.length === 0) {
        tbody.innerHTML = `<tr>
          <td colspan="5" style="text-align:center; padding:40px 20px; color:var(--text-muted);">
            <div style="font-size:32px; margin-bottom:12px;">📅</div>
            <div style="font-weight:600; font-size:14px; color:var(--text-primary);">No sessions logged yet</div>
            <p style="margin:4px 0 0 0; font-size:12px; color:var(--text-muted);">Start your first session using the floating "+" button or Daily Tracker form!</p>
          </td>
        </tr>`;
        return;
      }
      
      let html = '';
      const slice = trackerLogs.slice(0, 30);
      slice.forEach(l => {
        const totalH = l.phyHours + l.cheHours + l.bioHours;
        const details = `P: ${l.phyHours}h | C: ${l.cheHours}h | B: ${l.bioHours}h (${totalH}h)`;
        const stars = '⭐'.repeat(l.confidence);
        
        html += `<tr>
          <td style="font-weight:600;">${l.date}</td>
          <td>${details}</td>
          <td style="text-align:center;">${l.mcqs}</td>
          <td style="text-align:center; white-space:nowrap;">${stars}</td>
          <td style="text-align:center;"><button class="btn btn-secondary" style="font-size:10px; padding:2px 6px; border-color:rgba(239,68,68,0.2); color:var(--tertiary);" onclick="deleteTrackerEntry('${l.date}')">✕</button></td>
        </tr>`;
      });
      tbody.innerHTML = html;
    }
    
    function exportLogs() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trackerLogs, null, 2));
      const dlAnchorElem = document.createElement('a');
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", "neet_v3_study_logs.json");
      dlAnchorElem.click();
    }
    
    // Analytics calculations & rendering
    function calculateStreak() {
      if (trackerLogs.length === 0) return 0;
      
      const dates = new Set();
      trackerLogs.forEach(l => {
        const total = l.phyHours + l.cheHours + l.bioHours;
        if (total > 0 && l.date) {
          dates.add(l.date);
        }
      });
      
      if (dates.size === 0) return 0;
      
      let streak = 0;
      let check = new Date();
      let todayStr = check.toISOString().split('T')[0];
      
      check.setDate(check.getDate() - 1);
      let yesterdayStr = check.toISOString().split('T')[0];
      
      let currentCheck = new Date();
      if (dates.has(todayStr)) {
        currentCheck = new Date(todayStr);
      } else if (dates.has(yesterdayStr)) {
        currentCheck = new Date(yesterdayStr);
      } else {
        return 0; // streak broken
      }
      
      while (true) {
        const dStr = currentCheck.toISOString().split('T')[0];
        if (dates.has(dStr)) {
          streak++;
          currentCheck.setDate(currentCheck.getDate() - 1);
        } else {
          break;
        }
      }
      return streak;
    }
    
    function renderAnalytics() {
      // 1. Streak
      const streak = calculateStreak();
      const anStreak = document.getElementById('an-streak');
      if (anStreak) anStreak.textContent = `${streak} Days`;
      
      // 2. Average Hours & Total MCQs
      let totalH = 0;
      let totalMcqs = 0;
      let phyH = 0;
      let chemH = 0;
      let bioH = 0;
      
      trackerLogs.forEach(l => {
        totalH += (l.phyHours + l.cheHours + l.bioHours);
        totalMcqs += l.mcqs;
        phyH += l.phyHours;
        chemH += l.cheHours;
        bioH += l.bioHours;
      });
      
      const avg = trackerLogs.length ? (totalH / trackerLogs.length).toFixed(1) : '0.0';
      const anAvgHours = document.getElementById('an-avg-hours');
      if (anAvgHours) anAvgHours.textContent = `${avg}h`;
      const anTotalMcqs = document.getElementById('an-total-mcqs');
      if (anTotalMcqs) anTotalMcqs.textContent = totalMcqs.toLocaleString();
      
      // 3. Subject Progress Bars (derived from chapter checkboxes progress)
      // count steps
      let phyDone = 0, chemDone = 0, bioDone = 0;
      const phyTot = (P1_PHY.length + P2_PHY.length) * 3;
      const chemTot = (P1_CHE.length + P2_CHE.length) * 3;
      const bioTot = (P1_BIO.length + P2_BIO.length) * 3;
      
      P1_PHY.concat(P2_PHY).forEach(c => {
        const p = chapterProgress[c.ch.trim()];
        if (p) {
          if (p.understand) phyDone++;
          if (p.practice) phyDone++;
          if (p.revise) phyDone++;
        }
      });
      P1_CHE.concat(P2_CHE).forEach(c => {
        const p = chapterProgress[c.ch.trim()];
        if (p) {
          if (p.understand) chemDone++;
          if (p.practice) chemDone++;
          if (p.revise) chemDone++;
        }
      });
      P1_BIO.concat(P2_BIO).forEach(c => {
        const p = chapterProgress[c.ch.trim()];
        if (p) {
          if (p.understand) bioDone++;
          if (p.practice) bioDone++;
          if (p.revise) bioDone++;
        }
      });
      
      const phyPct = phyTot ? Math.round((phyDone / phyTot) * 100) : 0;
      const chemPct = chemTot ? Math.round((chemDone / chemTot) * 100) : 0;
      const bioPct = bioTot ? Math.round((bioDone / bioTot) * 100) : 0;
      
      const pgPhy = document.getElementById('progress-phy-text');
      if (pgPhy) pgPhy.textContent = phyPct + '%';
      const phyCircle = document.getElementById('progress-phy-circle');
      if (phyCircle) {
        phyCircle.style.strokeDashoffset = 238.76 * (1 - phyPct / 100);
      }
      
      const pgChem = document.getElementById('progress-chem-text');
      if (pgChem) pgChem.textContent = chemPct + '%';
      const chemCircle = document.getElementById('progress-chem-circle');
      if (chemCircle) {
        chemCircle.style.strokeDashoffset = 238.76 * (1 - chemPct / 100);
      }
      
      const pgBio = document.getElementById('progress-bio-text');
      if (pgBio) pgBio.textContent = bioPct + '%';
      const bioCircle = document.getElementById('progress-bio-circle');
      if (bioCircle) {
        bioCircle.style.strokeDashoffset = 238.76 * (1 - bioPct / 100);
      }
      
      // 4. Subject Study Balance stacked bar
      const sumH = phyH + chemH + bioH;
      const pSeg = document.getElementById('stacked-bar');
      if (pSeg) {
        if (sumH === 0) {
          pSeg.innerHTML = `
            <div class="stacked-segment" style="width:33.3%; background:var(--phy);"></div>
            <div class="stacked-segment" style="width:33.3%; background:var(--che);"></div>
            <div class="stacked-segment" style="width:33.4%; background:var(--bio);"></div>
          `;
          const lblPhy = document.getElementById('bal-phy-label');
          if (lblPhy) lblPhy.textContent = 'Phy: 0h (33%)';
          const lblChem = document.getElementById('bal-chem-label');
          if (lblChem) lblChem.textContent = 'Chem: 0h (33%)';
          const lblBio = document.getElementById('bal-bio-label');
          if (lblBio) lblBio.textContent = 'Bio: 0h (33%)';
        } else {
          const pP = Math.round((phyH / sumH) * 100);
          const cP = Math.round((chemH / sumH) * 100);
          const bP = 100 - pP - cP;
          
          pSeg.innerHTML = `
            <div class="stacked-segment" style="width:${pP}%; background:var(--phy);"></div>
            <div class="stacked-segment" style="width:${cP}%; background:var(--che);"></div>
            <div class="stacked-segment" style="width:${bP}%; background:var(--bio);"></div>
          `;
          const lblPhy2 = document.getElementById('bal-phy-label');
          if (lblPhy2) lblPhy2.textContent = `Phy: ${phyH.toFixed(1)}h (${pP}%)`;
          const lblChem2 = document.getElementById('bal-chem-label');
          if (lblChem2) lblChem2.textContent = `Chem: ${chemH.toFixed(1)}h (${cP}%)`;
          const lblBio2 = document.getElementById('bal-bio-label');
          if (lblBio2) lblBio2.textContent = `Bio: ${bioH.toFixed(1)}h (${bP}%)`;
        }
      }
      
      // 5. Daily study hours chart (last 7 logs)
      const chartBody = document.getElementById('hours-chart-body');
      if (chartBody) {
        if (trackerLogs.length === 0) {
          chartBody.innerHTML = '<div style="align-self:center; color:var(--text-muted); font-size:13px;">No study sessions logged yet.</div>';
        } else {
          const last7 = trackerLogs.slice(0, 7).reverse();
          let chartHtml = '';
          last7.forEach(l => {
            const total = l.phyHours + l.cheHours + l.bioHours;
            // cap height at 12 hours max scale
            const hPct = Math.min(100, Math.round((total / 12) * 100));
            // label is MM-DD
            const dLabel = l.date.substring(5);
            chartHtml += `
              <div class="chart-bar-col">
                <div class="chart-bar-fill" style="height:${hPct}%;">
                  <div class="chart-bar-tooltip">${total.toFixed(1)}h</div>
                </div>
                <span class="chart-label">${dLabel}</span>
              </div>
            `;
          });
          chartBody.innerHTML = chartHtml;
        }
      }
      
      // 6. Weak chapters
      const weakList = document.getElementById('weak-topics-list');
      if (weakList) {
        const weakEntries = trackerLogs.filter(l => l.confidence <= 2);
        if (weakEntries.length === 0) {
          weakList.innerHTML = '<span style="color:var(--text-muted); font-size:13px;">No weak areas flagged. You are doing great! 🌟</span>';
        } else {
          let wHtml = '<ul style="list-style:none; padding:0; margin:0; font-size:12.5px; display:flex; flex-direction:column; gap:8px;">';
          weakEntries.slice(0, 10).forEach(e => {
            wHtml += `<li style="padding:8px; background:rgba(255,255,255,0.01); border:1px solid var(--glass-border); border-radius:8px;">
              <div style="display:flex; justify-content:space-between; font-weight:600; margin-bottom:4px;">
                <span>${e.date}</span>
                <span style="color:var(--tertiary);">${e.confidence === 2 ? '⭐ Weak' : '⭐ Critical'}</span>
              </div>
              <div style="color:var(--text-muted); font-size:11.5px; line-height:1.4;">${e.notes || 'No specific notes recorded.'}</div>
            </li>`;
          });
          wHtml += '</ul>';
          weakList.innerHTML = wHtml;
        }
      }
    }
    
    // Overview tab calculations
    function updateCountdown() {
      const now = new Date();
      const diff = EXAM_DATE - now;
      
      const cdDays = document.getElementById('cd-days');
      const cdHours = document.getElementById('cd-hours');
      const cdMins = document.getElementById('cd-minutes');
      const cdSecs = document.getElementById('cd-seconds');
      
      if (diff <= 0) {
        const overCd1 = document.getElementById('over-countdown');
        if (overCd1) {
          overCd1.textContent = 'Exam Day!';
          overCd1.classList.add('pulse');
        }
        
        if (cdDays) cdDays.textContent = '00';
        if (cdHours) cdHours.textContent = '00';
        if (cdMins) cdMins.textContent = '00';
        if (cdSecs) cdSecs.textContent = '00';
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      
      const overCd2 = document.getElementById('over-countdown');
      if (overCd2) overCd2.textContent = `${days}d ${hours}h`;
      
      if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
      if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
      if (cdMins) cdMins.textContent = String(mins).padStart(2, '0');
      if (cdSecs) cdSecs.textContent = String(secs).padStart(2, '0');
    }
    
    function updateOverviewStats() {
      // Update countdown
      updateCountdown();
      
      // Streak
      const streak = calculateStreak();
      const elStreak = document.getElementById('over-streak');
      if (elStreak) elStreak.textContent = `${streak} Days`;

      // Update topbar Streak & Rank
      const topStreak = document.getElementById('user-streak');
      if (topStreak) topStreak.textContent = streak;
      
      const topRank = document.getElementById('user-rank');
      if (topRank) {
        let rank = 'Aspirant';
        const doneTotal = Object.values(done).filter(Boolean).length;
        if (doneTotal > 300) rank = 'AIIMS Master';
        else if (doneTotal > 100) rank = 'Ranker';
        else if (doneTotal > 25) rank = 'Challenger';
        
        topRank.textContent = `Rank: ${rank}`;
        // Update badge styling based on rank
        topRank.className = 'subject-badge';
        if (rank === 'AIIMS Master') {
          topRank.classList.add('badge-bio');
          topRank.style.background = 'rgba(226, 75, 74, 0.15)';
          topRank.style.color = '#E24B4A';
          topRank.style.border = '1px solid #E24B4A';
        } else if (rank === 'Ranker') {
          topRank.classList.add('badge-che');
          topRank.style.background = 'rgba(52, 211, 153, 0.15)';
          topRank.style.color = '#34d399';
          topRank.style.border = '1px solid #34d399';
        } else if (rank === 'Challenger') {
          topRank.classList.add('badge-phy');
          topRank.style.background = 'rgba(96, 165, 250, 0.15)';
          topRank.style.color = '#60a5fa';
          topRank.style.border = '1px solid #60a5fa';
        } else {
          topRank.style.background = 'rgba(255, 255, 255, 0.05)';
          topRank.style.color = 'var(--text-secondary)';
          topRank.style.border = '1px solid var(--border-color)';
        }
      }
      
      // Total Hours
      let totalH = 0;
      trackerLogs.forEach(l => {
        totalH += (l.phyHours + l.cheHours + l.bioHours);
      });
      const elHours = document.getElementById('over-hours');
      if (elHours) elHours.textContent = `${totalH.toFixed(1)}h`;
      
      // Syllabus Progress %
      const doneCnt = Object.values(done).filter(Boolean).length;
      const pct = PLAN.length ? Math.round((doneCnt / PLAN.length) * 100) : 0;
      const elProg = document.getElementById('over-progress');
      if (elProg) elProg.textContent = `${pct}%`;

      // Update Today's Plan Hero Card
      if (typeof updateTodayPlanCard === 'function') {
        updateTodayPlanCard();
      }

      // Sync background stats on the login screen
      const loginDays = document.getElementById('login-stat-days');
      if (loginDays) {
        const diffCd = EXAM_DATE - new Date();
        loginDays.textContent = diffCd > 0 ? Math.ceil(diffCd / (1000 * 60 * 60 * 24)) : 0;
      }
      const loginProg = document.getElementById('login-stat-progress');
      if (loginProg) loginProg.textContent = `${pct}%`;
      const loginStreak = document.getElementById('login-stat-streak');
      if (loginStreak) loginStreak.textContent = streak;
    }
    
    function renderOverviewStats() {
      updateOverviewStats();
    }

    // Previous Year Papers Logic
    let yearlyTestTimer = null;
    let yearlyTestQuestions = [];
    let yearlyTestAnswers = [];
    let yearlyTestMode = ''; // 'mock' or 'practice'
    let yearlyTestYear = 2026;
    let yearlyCurrentFilter = 'all';

    function renderPapersPicker() {
      const years = [];
      for (let y = 2026; y >= 2013; y--) {
        years.push(y);
      }
      
      const grid = document.getElementById('papers-picker-grid');
      let html = '';
      
      years.forEach(year => {
        const count = REAL_YEARLY_PAPERS[String(year)] ? REAL_YEARLY_PAPERS[String(year)].length : 0;
        
        html += `
          <div class="glass-card stat-card" style="align-items:stretch; gap:14px; padding:24px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="stat-title" style="color:var(--primary); font-size:14px; font-weight:800;">NEET ${year}</span>
              <span class="type-badge tb-study" style="font-size:10px;">📄 Official Paper</span>
            </div>
            <div style="font-size:13px; color:var(--text-muted); margin:4px 0;">
              Official NEET past-year paper: <strong style="color:#fff;">${count} Questions</strong>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px; margin-top:10px;">
              <button class="btn btn-primary" style="width:100%; font-size:12px; padding:10px;" onclick="initYearlyPaper(${year}, 'mock')">✍️ Start Exam Mode (3h 20m)</button>
              <button class="btn btn-secondary" style="width:100%; font-size:12px; padding:10px;" onclick="initYearlyPaper(${year}, 'practice')">📖 Browse & Practice</button>
            </div>
          </div>
        `;
      });
      
      grid.innerHTML = html;
      
      // Hide active test container and list view initially
      document.getElementById('active-test-container').style.display = 'none';
      document.getElementById('paper-questions-view').style.display = 'none';
      document.getElementById('exam-results').style.display = 'none';
      document.getElementById('papers-picker-grid').style.display = 'grid';
    }

    function initYearlyPaper(year, mode) {
      yearlyTestYear = year;
      yearlyTestMode = mode;
      yearlyCurrentFilter = 'all';
      
      let allYearQs = REAL_YEARLY_PAPERS[String(year)] || [];
      
      if (allYearQs.length === 0) {
        alert("No questions found for " + year);
        return;
      }
      
      if (mode === 'mock') {
        document.body.classList.add('exam-mode-active');
        yearlyTestQuestions = allYearQs;
        yearlyTestAnswers = new Array(yearlyTestQuestions.length).fill(null);
        
        // Setup timer: 3h 20m = 12000 seconds
        let secondsLeft = 12000;
        document.getElementById('test-timer').textContent = "03:20:00";
        document.getElementById('test-timer').style.color = "var(--primary)";
        
        clearInterval(yearlyTestTimer);
        yearlyTestTimer = setInterval(() => {
          secondsLeft--;
          if (secondsLeft <= 0) {
            clearInterval(yearlyTestTimer);
            submitYearlyPaper();
            return;
          }
          const h = Math.floor(secondsLeft / 3600);
          const m = Math.floor((secondsLeft % 3600) / 60);
          const s = secondsLeft % 60;
          document.getElementById('test-timer').textContent = 
            `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
          
          if (secondsLeft < 600) {
            document.getElementById('test-timer').style.color = "var(--tertiary)";
          }
        }, 1000);
        
        // Display header block
        document.getElementById('active-test-title').textContent = `NEET ${year} Exam Mode`;
        document.getElementById('active-test-mode').textContent = "Exam Mode";
        document.getElementById('active-test-mode').className = "type-badge tb-mock";
        document.getElementById('active-test-container').style.display = 'block';
        document.getElementById('paper-questions-view').style.display = 'block';
        document.getElementById('papers-picker-grid').style.display = 'none';
        document.getElementById('exam-results').style.display = 'none';
        
        updateTestProgress();
        renderPaperQuestions();
      } else {
        // Practice mode: load all available questions for that year
        yearlyTestQuestions = allYearQs;
        yearlyTestAnswers = new Array(yearlyTestQuestions.length).fill(null);
        
        document.getElementById('active-test-title').textContent = `NEET ${year} Practice Bank`;
        document.getElementById('active-test-mode').textContent = "Practice Mode";
        document.getElementById('active-test-mode').className = "type-badge tb-rev";
        
        // Hide timer controls for practice mode
        document.getElementById('active-test-container').style.display = 'none';
        document.getElementById('paper-questions-view').style.display = 'block';
        document.getElementById('papers-picker-grid').style.display = 'none';
        document.getElementById('exam-results').style.display = 'none';
        
        renderPaperQuestions();
      }
    }

    function getSubjectForChapter(chapterName) {
      const cNorm = chapterName.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (window.PHYS_CHAPS_SET.has(cNorm)) return 'physics';
      if (window.CHEM_CHAPS_SET.has(cNorm)) return 'chemistry';
      return 'biology';
    }

    function updateTestProgress() {
      const answered = yearlyTestAnswers.filter(a => a !== null).length;
      const total = yearlyTestQuestions.length;
      document.getElementById('test-progress-text').textContent = `Questions Answered: ${answered} / ${total}`;
      
      const pct = total ? Math.round((answered / total) * 100) : 0;
      document.getElementById('test-progress-fill').style.width = pct + '%';
      
      // Calculate estimated score (+4 for correct, -1 for wrong, assumes current selection correctness)
      let score = 0;
      yearlyTestAnswers.forEach((ans, idx) => {
        if (ans !== null) {
          if (ans === yearlyTestQuestions[idx].ans) {
            score += 4;
          } else {
            score -= 1;
          }
        }
      });
      document.getElementById('test-score-est').textContent = `Est. Score: ${score} / ${total * 4}`;
    }

    function filterPaperSubject(sub) {
      yearlyCurrentFilter = sub;
      // Reset filter button styles
      ['all', 'phy', 'chem', 'bio'].forEach(s => {
        const btn = document.getElementById('btn-filter-' + s);
        if (btn) {
          btn.className = "btn btn-secondary";
        }
      });
      const curBtn = document.getElementById('btn-filter-' + (sub === 'physics' ? 'phy' : sub === 'chemistry' ? 'chem' : sub === 'biology' ? 'bio' : 'all'));
      if (curBtn) curBtn.className = "btn btn-primary";
      
      renderPaperQuestions();
    }

    function renderPaperQuestions() {
      const container = document.getElementById('paper-questions-list');
      document.getElementById('paper-view-title').textContent = `Exam Questions (${yearlyTestQuestions.length} total)`;
      
      let html = '';
      let qNum = 0;
      
      yearlyTestQuestions.forEach((q, idx) => {
        // Filter by subject if specified
        if (yearlyCurrentFilter !== 'all' && q.subject !== yearlyCurrentFilter) {
          return;
        }
        
        qNum++;
        
        const isMock = yearlyTestMode === 'mock';
        const chosen = yearlyTestAnswers[idx];
        const isAnswered = chosen !== null;
        
        let explanationHtml = '';
        if (!isMock && isAnswered) {
          explanationHtml = `
            <div class="pyq-explanation">
              <div class="exp-title">Explanation (${q.chapter})</div>
              <div class="exp-text">${q.exp}</div>
            </div>
          `;
        }
        
        let optionsHtml = '';
        q.opts.forEach((opt, optIdx) => {
          let optClass = 'pyq-opt-btn';
          let disabledAttr = '';
          
          if (isMock) {
            if (chosen === optIdx) {
              optClass += ' wrong'; // Highlight current choice as active select style
            }
          } else {
            // Practice mode: highlight correct/wrong instantly
            if (isAnswered) {
              disabledAttr = 'disabled';
              if (optIdx === q.ans) {
                optClass += ' correct';
              } else if (chosen === optIdx) {
                optClass += ' wrong';
              }
            }
          }
          
          optionsHtml += `
            <button class="${optClass}" ${disabledAttr} onclick="selectPaperOption(${idx}, ${optIdx})">
              <div class="opt-letter">${String.fromCharCode(65 + optIdx)}</div>
              <span>${opt}</span>
            </button>
          `;
        });
        
        let diagramHtml = '';
        if (q.diagram) {
          if (q.diagram.startsWith('images/') || q.diagram.startsWith('data:image') || q.diagram.startsWith('http')) {
            diagramHtml = `<div class="pyq-diagram" style="margin: 16px 0; text-align: center;"><img src="${q.diagram}" style="max-width:100%; max-height:220px; border-radius:8px; border:1px solid #e2e8f0; padding:6px; background:#fff;" alt="Diagram"></div>`;
          } else {
            diagramHtml = `<div class="pyq-diagram" style="margin: 16px 0; text-align: center;">${q.diagram}</div>`;
          }
        } else {
          diagramHtml = '';
        }
        
        html += `
          <div class="pyq-card" style="margin-bottom:24px;">
            <div class="pyq-header">
              <span class="pyq-num">Question #${idx + 1} (Subject: ${q.subject.toUpperCase()})</span>
              <span class="pyq-badge">${q.year}</span>
            </div>
            <div class="pyq-question">${q.q}</div>
            ${diagramHtml}
            <div class="pyq-options">${optionsHtml}</div>
            ${explanationHtml}
          </div>
        `;
      });
      
      container.innerHTML = html || `<div style="text-align:center; padding:32px; color:var(--text-muted);">No questions found under this filter.</div>`;
      renderMath(container);
    }

    function selectPaperOption(qIdx, optIdx) {
      yearlyTestAnswers[qIdx] = optIdx;
      
      if (yearlyTestMode === 'mock') {
        updateTestProgress();
        renderPaperQuestions();
      } else {
        // Practice mode: render immediately to lock answer and show explanation
        renderPaperQuestions();
      }
    }

    function submitYearlyPaper() {
      document.body.classList.remove('exam-mode-active');
      clearInterval(yearlyTestTimer);
      
      let correct = 0;
      let wrong = 0;
      let score = 0;
      
      yearlyTestQuestions.forEach((q, idx) => {
        const ans = yearlyTestAnswers[idx];
        if (ans !== null) {
          if (ans === q.ans) {
            correct++;
            score += 4;
          } else {
            wrong++;
            score -= 1;
          }
        }
      });
      
      const attempted = correct + wrong;
      const accuracy = attempted ? Math.round((correct / attempted) * 100) : 0;
      
      document.getElementById('res-score').textContent = `${score} / ${yearlyTestQuestions.length * 4}`;
      document.getElementById('res-correct').textContent = correct;
      document.getElementById('res-wrong').textContent = wrong;
      document.getElementById('res-accuracy').textContent = accuracy + '%';
      
      // Hide active test bar and show result view
      document.getElementById('active-test-container').style.display = 'none';
      document.getElementById('paper-questions-view').style.display = 'none';
      document.getElementById('exam-results').style.display = 'block';
    }

    function reviewPaperQuestions() {
      // Switch mode to practice so answers are shown
      yearlyTestMode = 'practice';
      
      document.getElementById('exam-results').style.display = 'none';
      document.getElementById('paper-questions-view').style.display = 'block';
      
      renderPaperQuestions();
    }

    function exitPaperResults() {
      document.body.classList.remove('exam-mode-active');
      renderPapersPicker();
    }

    function exitYearlyPaper() {
      if (yearlyTestMode === 'practice' || confirm("Are you sure you want to exit? Your progress in this paper will be lost.")) {
        document.body.classList.remove('exam-mode-active');
        clearInterval(yearlyTestTimer);
        renderPapersPicker();
      }
    }
    
    // Google Search Tab Logic
    function executeGoogleSearch(e) {
      if (e && e.preventDefault) e.preventDefault();
      const el = document.getElementById('google-search-input');
      const val = el ? el.value.trim() : '';
      if (val) {
        window.open('https://www.google.com/search?q=' + encodeURIComponent(val), '_blank');
      }
    }

    function quickSearch(query) {
      window.open('https://www.google.com/search?q=' + encodeURIComponent(query), '_blank');
    }


  

// Bind functions to window so they are globally accessible from inline HTML event handlers
window.reviewPaperQuestions = reviewPaperQuestions;
window.renderAnalytics = renderAnalytics;
window.updateTestProgress = updateTestProgress;
window.showTab = showTab;
window.selectOption = selectOption;
window.renderTestList = renderTestList;
window.getWeek = getWeek;
window.showSched = showSched;
window.renderTrackerTable = renderTrackerTable;
window.toggleMenu = toggleMenu;
window.getSubjectForChapter = getSubjectForChapter;
window.calculateStreak = calculateStreak;
window.renderPaperQuestions = renderPaperQuestions;
window.saveDone = saveDone;
window.renderPapersPicker = renderPapersPicker;
window.logStudy = logStudy;
window.deleteTrackerEntry = deleteTrackerEntry;
window.executeGoogleSearch = executeGoogleSearch;
window.navigateTab = navigateTab;
window.startEditSched = startEditSched;
window.cancelEditSched = cancelEditSched;
window.saveEditSched = saveEditSched;
window.addNewSchedRow = addNewSchedRow;
window.deleteSchedRow = deleteSchedRow;
window.resetSchedToDefault = resetSchedToDefault;
window.toggleSyllabus = toggleSyllabus;
window.openTestAnalysisModal = openTestAnalysisModal;
window.closeTestAnalysisModal = closeTestAnalysisModal;
window.saveTestAnalysis = saveTestAnalysis;
window.openWeakTopicsModal = openWeakTopicsModal;
window.closeWeakTopicsModal = closeWeakTopicsModal;
window.calGo = calGo;
window.closePyqModal = closePyqModal;
window.updateCountdown = updateCountdown;
window.renderOverviewStats = renderOverviewStats;
window.toggleDone = toggleDone;
window.exportLogs = exportLogs;
window.quickSearch = quickSearch;
window.toggleChapterStep = toggleChapterStep;
window.exitYearlyPaper = exitYearlyPaper;
window.buildPlan = buildPlan;
window.renderCal = renderCal;
window.renderPlan = renderPlan;
window.exitPaperResults = exitPaperResults;
window.renderChapters = renderChapters;
window.updateOverviewStats = updateOverviewStats;
window.submitYearlyPaper = submitYearlyPaper;
window.filterPaperSubject = filterPaperSubject;
window.getProceduralDiagram = getProceduralDiagram;
window.selectPaperOption = selectPaperOption;
window.openPyqModal = openPyqModal;
window.initYearlyPaper = initYearlyPaper;

/* ==========================================
   AI CBT & CHAPTER TEST ENGINE
   ========================================== */

var selectedFile = null;
var cbtQuestions = [];
var cbtAnswers = {};
var cbtFlagged = new Set();
var cbtCurrentIdx = 0;
var cbtTimer = null;
var cbtTimeRemaining = 0;
var cbtTotalQuestions = 0;

function initAiDragAndDrop() {
  const dragZone = document.getElementById('drag-zone');
  const fileInput = document.getElementById('ai-file-input');
  const fileInfo = document.getElementById('file-info');

  if (!dragZone || !fileInput) return;

  // Prevent default drag behaviors
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dragZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });

  // Highlight drop zone when item is dragged over it
  ['dragenter', 'dragover'].forEach(eventName => {
    dragZone.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dragZone.addEventListener(eventName, unhighlight, false);
  });

  // Handle dropped files
  dragZone.addEventListener('drop', handleDrop, false);

  // Handle selected files
  fileInput.addEventListener('change', handleFileSelect, false);

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function highlight() {
    dragZone.classList.add('drag-over');
  }

  function unhighlight() {
    dragZone.classList.remove('drag-over');
  }

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }

  function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }

  function handleFile(file) {
    selectedFile = file;
    if (fileInfo) {
      fileInfo.textContent = `Selected File: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
      fileInfo.style.display = 'block';
    }
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
}

async function fetchGeminiWithRetry(apiKey, requestPayload, retries = 2, delayMs = 1500) {
  let model = "gemini-2.5-flash";
  let attempt = 0;
  
  while (attempt <= retries) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestPayload)
      });
      
      if (response.ok) {
        return response;
      }
      
      if (response.status === 503 || response.status === 429 || response.status >= 500) {
        attempt++;
        if (attempt <= retries) {
          console.warn(`Gemini API returned ${response.status}. Retrying in ${delayMs}ms with alternative model...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          if (model === "gemini-2.5-flash") {
            model = "gemini-1.5-flash";
          }
          continue;
        }
      }
      
      const errorText = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
      
    } catch (err) {
      if (attempt >= retries) {
        throw err;
      }
      attempt++;
      console.warn(`Fetch error: ${err.message}. Retrying in ${delayMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      if (model === "gemini-2.5-flash") {
        model = "gemini-1.5-flash";
      }
    }
  }
}

async function startAiParse() {
  const apiKey = safeGetLocalStorage('gemini_api_key');
  
  if (!apiKey) {
    alert("Please configure your Gemini API Key first in the '⚙️ Settings' tab.");
    showTab('settings');
    return;
  }
  
  if (!selectedFile) {
    alert("Please drag & drop or select a question paper PDF or Image.");
    return;
  }
  
  const durationInput = document.getElementById('ai-test-duration');
  const durationMinutes = durationInput ? parseInt(durationInput.value) || 30 : 30;
  
  // Show loading
  document.getElementById('ai-setup-view').style.display = 'none';
  document.getElementById('ai-loading-view').style.display = 'flex';
  document.getElementById('ai-loading-title').textContent = "AI is parsing your Question Paper...";
  document.getElementById('ai-loading-desc').textContent = "Extracting MCQs, validating options, and generating detailed explanations. This might take 15-30 seconds.";
  
  try {
    const base64Data = await fileToBase64(selectedFile);
    const mimeType = selectedFile.type || "application/pdf";
    
    const requestPayload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Extract all Multiple-Choice Questions (MCQs) from this question paper. Ensure each question has exactly 4 options. Identify the correct option and provide a very concise, 1-2 sentence explanation for each. Return the results in the required JSON schema format."
            },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            questions: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  question: { type: "STRING" },
                  options: {
                    type: "ARRAY",
                    items: { type: "STRING" }
                  },
                  correct_option_idx: { type: "INTEGER" },
                  explanation: { type: "STRING" }
                },
                required: ["question", "options", "correct_option_idx", "explanation"]
              }
            }
          },
          required: ["questions"]
        }
      }
    };
    
    const response = await fetchGeminiWithRetry(apiKey, requestPayload);
    
    const responseData = await response.json();
    const responseText = responseData.candidates[0].content.parts[0].text;
    const parsedData = JSON.parse(responseText);
    
    if (!parsedData.questions || parsedData.questions.length === 0) {
      throw new Error("No questions could be extracted from the uploaded document. Please check the document quality and try again.");
    }
    
    initCbt(parsedData.questions, durationMinutes);
    
  } catch (error) {
    console.error("AI CBT Parser Error:", error);
    alert(`Failed to generate CBT: ${error.message}`);
    document.getElementById('ai-loading-view').style.display = 'none';
    document.getElementById('ai-setup-view').style.display = 'block';
  }
}

async function generateAiChapterTest(chapterName) {
  const apiKey = safeGetLocalStorage('gemini_api_key');
  if (!apiKey) {
    alert("Please configure your Gemini API Key first in the '🤖 AI CBT' tab.");
    showTab('ai-test');
    return;
  }
  
  showTab('ai-test');
  document.getElementById('ai-setup-view').style.display = 'none';
  document.getElementById('ai-exam-view').style.display = 'none';
  document.getElementById('ai-results-view').style.display = 'none';
  document.getElementById('ai-loading-view').style.display = 'flex';
  document.getElementById('ai-loading-title').textContent = `Generating Test for: ${chapterName}`;
  document.getElementById('ai-loading-desc').textContent = "AI is drafting 30 high-quality, NEET-level MCQs with detailed explanations for this chapter. Please wait.";
  
  try {
    const prompt = `You are a premium NEET question bank generator. Generate exactly 30 high-quality, NEET-level MCQs for the chapter: '${chapterName}'. The questions should cover key concepts, theories, and numericals from this chapter, matching the standard and style of the NEET exam. Keep questions, options, and explanations extremely concise and brief (explanations must be at most 1-2 short sentences) to ensure super fast response generation. Each question must have exactly 4 plausible options, a single correct option (0-based index), and a concise explanation.`;
    
    const requestPayload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            questions: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  question: { type: "STRING" },
                  options: {
                    type: "ARRAY",
                    items: { type: "STRING" }
                  },
                  correct_option_idx: { type: "INTEGER" },
                  explanation: { type: "STRING" }
                },
                required: ["question", "options", "correct_option_idx", "explanation"]
              }
            }
          },
          required: ["questions"]
        }
      }
    };
    
    const response = await fetchGeminiWithRetry(apiKey, requestPayload);
    
    const responseData = await response.json();
    const responseText = responseData.candidates[0].content.parts[0].text;
    const parsedData = JSON.parse(responseText);
    
    if (!parsedData.questions || parsedData.questions.length === 0) {
      throw new Error("Failed to generate questions for the chapter. Please try again.");
    }
    
    initCbt(parsedData.questions, 45);
    
  } catch (error) {
    console.error("AI Chapter Test Generation Error:", error);
    alert(`Failed to generate chapter test: ${error.message}`);
    document.getElementById('ai-loading-view').style.display = 'none';
    document.getElementById('ai-setup-view').style.display = 'block';
  }
}

function initCbt(questions, durationMinutes) {
  cbtQuestions = questions;
  cbtAnswers = {};
  cbtFlagged = new Set();
  cbtCurrentIdx = 0;
  cbtTotalQuestions = questions.length;
  cbtTimeRemaining = durationMinutes * 60;

  document.getElementById('ai-setup-view').style.display = 'none';
  document.getElementById('ai-loading-view').style.display = 'none';
  document.getElementById('ai-results-view').style.display = 'none';
  document.getElementById('ai-exam-view').style.display = 'block';

  showTab('ai-test');

  if (cbtTimer) clearInterval(cbtTimer);
  cbtTimer = setInterval(() => {
    cbtTimeRemaining--;
    if (cbtTimeRemaining <= 0) {
      clearInterval(cbtTimer);
      cbtSubmitTest();
    } else {
      updateCbtTimerDisplay();
    }
  }, 1000);
  updateCbtTimerDisplay();

  cbtRenderQuestion();
  cbtRenderGrid();
}

function updateCbtTimerDisplay() {
  const display = document.getElementById('cbt-timer-display');
  if (!display) return;
  
  const minutes = Math.floor(cbtTimeRemaining / 60);
  const seconds = cbtTimeRemaining % 60;
  
  display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  if (cbtTimeRemaining <= 60) {
    display.style.color = '#ff6b6b';
  } else {
    display.style.color = '#FFD700';
  }
}

function cbtRenderQuestion() {
  const qNum = document.getElementById('cbt-q-number');
  const qText = document.getElementById('cbt-question-text');
  const optContainer = document.getElementById('cbt-options-container');
  const flagBtn = document.getElementById('cbt-btn-flag');
  
  if (!qNum || !qText || !optContainer) return;
  
  const question = cbtQuestions[cbtCurrentIdx];
  if (!question) return;
  
  qNum.textContent = `Question ${cbtCurrentIdx + 1} of ${cbtTotalQuestions}`;
  qText.innerHTML = question.question;
  
  optContainer.innerHTML = '';
  
  const optionPrefixes = ['A', 'B', 'C', 'D'];
  question.options.forEach((opt, idx) => {
    const div = document.createElement('div');
    div.className = 'cbt-option';
    if (cbtAnswers[cbtCurrentIdx] === idx) {
      div.classList.add('selected');
    }
    
    div.innerHTML = `
      <span class="option-prefix">${optionPrefixes[idx]}</span>
      <span class="option-text">${opt}</span>
      <input type="radio" name="cbt-option-radio" value="${idx}" ${cbtAnswers[cbtCurrentIdx] === idx ? 'checked' : ''}>
    `;
    
    div.onclick = () => cbtSelectOption(idx);
    optContainer.appendChild(div);
  });
  renderMath(document.getElementById('cbt-question-text'));
  renderMath(optContainer);
  
  if (flagBtn) {
    if (cbtFlagged.has(cbtCurrentIdx)) {
      flagBtn.textContent = 'Unflag Question';
      flagBtn.style.background = 'rgba(255, 165, 0, 0.15)';
      flagBtn.style.color = '#ffa500';
    } else {
      flagBtn.textContent = 'Flag Question';
      flagBtn.style.background = 'transparent';
      flagBtn.style.color = '#ffa500';
    }
  }
}

function cbtRenderGrid() {
  const container = document.getElementById('cbt-grid-container');
  if (!container) return;
  container.innerHTML = '';
  
  for (let i = 0; i < cbtTotalQuestions; i++) {
    const node = document.createElement('button');
    node.className = 'q-node';
    node.textContent = i + 1;
    
    if (i === cbtCurrentIdx) {
      node.classList.add('active');
    }
    if (cbtFlagged.has(i)) {
      node.classList.add('flagged');
    } else if (cbtAnswers[i] !== undefined) {
      node.classList.add('answered');
    }
    
    node.onclick = () => cbtJumpToQuestion(i);
    container.appendChild(node);
  }
}

function cbtSelectOption(optionIdx) {
  cbtAnswers[cbtCurrentIdx] = optionIdx;
  cbtRenderQuestion();
  cbtRenderGrid();
}

function cbtJumpToQuestion(idx) {
  cbtCurrentIdx = idx;
  cbtRenderQuestion();
  cbtRenderGrid();
}

function cbtPrev() {
  if (cbtCurrentIdx > 0) {
    cbtCurrentIdx--;
    cbtRenderQuestion();
    cbtRenderGrid();
  }
}

function cbtNext() {
  if (cbtCurrentIdx < cbtTotalQuestions - 1) {
    cbtCurrentIdx++;
    cbtRenderQuestion();
    cbtRenderGrid();
  }
}

function cbtToggleFlag() {
  if (cbtFlagged.has(cbtCurrentIdx)) {
    cbtFlagged.delete(cbtCurrentIdx);
  } else {
    cbtFlagged.add(cbtCurrentIdx);
  }
  cbtRenderGrid();
  cbtRenderQuestion();
}

function cbtSubmitTest() {
  if (cbtTimer) clearInterval(cbtTimer);
  
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;
  
  for (let i = 0; i < cbtTotalQuestions; i++) {
    const ans = cbtAnswers[i];
    if (ans === undefined) {
      unanswered++;
    } else if (ans === cbtQuestions[i].correct_option_idx) {
      correct++;
    } else {
      incorrect++;
    }
  }
  
  const score = (correct * 4) - (incorrect * 1);
  const maxScore = cbtTotalQuestions * 4;
  const accuracy = (correct + incorrect) > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;
  
  document.getElementById('cbt-score-total').textContent = `${score} / ${maxScore}`;
  document.getElementById('cbt-score-correct').textContent = correct;
  document.getElementById('cbt-score-incorrect').textContent = incorrect;
  document.getElementById('cbt-score-unanswered').textContent = unanswered;
  document.getElementById('cbt-score-accuracy').textContent = `${accuracy}%`;
  
  document.getElementById('ai-exam-view').style.display = 'none';
  document.getElementById('ai-results-view').style.display = 'block';
  document.getElementById('cbt-review-section').style.display = 'none';
  
  buildCbtReview();
}

function buildCbtReview() {
  const container = document.getElementById('cbt-review-container');
  if (!container) return;
  container.innerHTML = '';
  
  const optionPrefixes = ['A', 'B', 'C', 'D'];
  
  cbtQuestions.forEach((q, qIdx) => {
    const card = document.createElement('div');
    card.className = 'review-question-card';
    card.style.background = 'rgba(255, 255, 255, 0.02)';
    card.style.border = '1px solid rgba(255, 255, 255, 0.06)';
    card.style.borderRadius = '12px';
    card.style.padding = '20px';
    card.style.marginBottom = '16px';
    
    let statusBadgeHtml = '';
    const userAns = cbtAnswers[qIdx];
    if (userAns === undefined) {
      statusBadgeHtml = `<span style="background:rgba(156,163,175,0.1); color:#9ca3af; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:600;">Unanswered</span>`;
    } else if (userAns === q.correct_option_idx) {
      statusBadgeHtml = `<span style="background:rgba(0,212,170,0.1); color:var(--primary); padding:4px 8px; border-radius:4px; font-size:11px; font-weight:600;">Correct (+4)</span>`;
    } else {
      statusBadgeHtml = `<span style="background:rgba(255,107,107,0.1); color:var(--tertiary); padding:4px 8px; border-radius:4px; font-size:11px; font-weight:600;">Incorrect (-1)</span>`;
    }
    
    let optionsHtml = '';
    q.options.forEach((opt, optIdx) => {
      let optStyle = 'border:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.01); color:#d1d5db;';
      let badge = '';
      
      if (optIdx === q.correct_option_idx) {
        optStyle = 'border:1px solid var(--primary); background:rgba(0,212,170,0.08); color:var(--primary); font-weight:600;';
        badge = ' <span style="font-size:11px; margin-left:auto; color:var(--primary); font-weight:700;">✓ Correct</span>';
      } else if (userAns === optIdx) {
        optStyle = 'border:1px solid var(--tertiary); background:rgba(255,107,107,0.08); color:var(--tertiary); font-weight:600;';
        badge = ' <span style="font-size:11px; margin-left:auto; color:var(--tertiary); font-weight:700;">✗ Your Answer</span>';
      }
      
      optionsHtml += `
        <div style="display:flex; align-items:center; padding:10px 14px; border-radius:6px; margin-top:8px; font-size:13px; ${optStyle}">
          <span style="font-weight:700; margin-right:10px;">${optionPrefixes[optIdx]}.</span>
          <span>${opt}</span>
          ${badge}
        </div>
      `;
    });
    
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <span style="font-weight:700; font-family:'Share Tech',sans-serif; color:#FFD700;">Question ${qIdx + 1}</span>
        ${statusBadgeHtml}
      </div>
      <div style="font-size:15px; font-weight:600; margin-bottom:14px; line-height:1.5; color:#fff;">${q.question}</div>
      <div style="margin-bottom:16px;">${optionsHtml}</div>
      <div style="background:rgba(255,215,0,0.03); border-left:3px solid #FFD700; padding:12px 16px; border-radius:0 8px 8px 0; font-size:13px; line-height:1.5;">
        <strong style="color:#FFD700; display:block; margin-bottom:4px; font-family:'Share Tech',sans-serif;">Explanation:</strong>
        <span style="color:#e5e7eb;">${q.explanation}</span>
      </div>
    `;
    
    container.appendChild(card);
  });
}

function cbtShowReview() {
  const reviewSec = document.getElementById('cbt-review-section');
  if (reviewSec) {
    reviewSec.style.display = 'block';
    reviewSec.scrollIntoView({ behavior: 'smooth' });
  }
}

function cbtExitResults() {
  document.getElementById('ai-results-view').style.display = 'none';
  document.getElementById('ai-setup-view').style.display = 'block';
  
  selectedFile = null;
  const fileInfo = document.getElementById('file-info');
  if (fileInfo) fileInfo.style.display = 'none';
  const fileInput = document.getElementById('ai-file-input');
  if (fileInput) fileInput.value = '';
  
  showTab('calendar');
}

// ==========================================
// UI/UX UPGRADE HELPER FUNCTIONS
// ==========================================

function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function openQuickLog() {
  const modal = document.getElementById('quick-log-modal');
  if (modal) {
    // Pre-fill date with local YYYY-MM-DD
    const dateInput = document.getElementById('quick-track-date');
    if (dateInput) {
      const offset = new Date().getTimezoneOffset();
      const localDate = new Date(Date.now() - offset * 60 * 1000).toISOString().split('T')[0];
      dateInput.value = localDate;
    }
    modal.classList.add('active');
  }
}

function closeQuickLog() {
  const modal = document.getElementById('quick-log-modal');
  if (modal) modal.classList.remove('active');
}

function logQuickStudy(e) {
  e.preventDefault();
  const date = document.getElementById('quick-track-date').value;
  const phy = parseFloat(document.getElementById('quick-track-phy').value) || 0;
  const chem = parseFloat(document.getElementById('quick-track-chem').value) || 0;
  const bio = parseFloat(document.getElementById('quick-track-bio').value) || 0;
  const mcqs = parseInt(document.getElementById('quick-track-mcqs').value) || 0;
  const confidence = parseInt(document.getElementById('quick-track-confidence').value) || 3;
  const notes = document.getElementById('quick-track-notes').value;
  
  if (phy === 0 && chem === 0 && bio === 0) {
    alert('Please log study hours for at least one subject.');
    return;
  }
  
  const newEntry = { date, phyHours: phy, cheHours: chem, bioHours: bio, mcqs, confidence, notes };
  
  const idx = trackerLogs.findIndex(l => l.date === date);
  if (idx !== -1) {
    trackerLogs[idx] = newEntry;
  } else {
    trackerLogs.push(newEntry);
  }
  
  // Sort by date descending
  trackerLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  safeSetLocalStorage('neet_v3_tracker', JSON.stringify(trackerLogs));
  
  renderTrackerTable();
  updateOverviewStats();
  
  // Reset inputs
  document.getElementById('quick-track-phy').value = '';
  document.getElementById('quick-track-chem').value = '';
  document.getElementById('quick-track-bio').value = '';
  document.getElementById('quick-track-mcqs').value = '';
  document.getElementById('quick-track-notes').value = '';
  
  closeQuickLog();
  showToast('Study session logged successfully!');
}

function updateLoginStats() {
  // 1. Days left
  const EXAM_DATE = new Date(2027, 4, 3, 0, 0, 0);
  const diff = EXAM_DATE - new Date();
  const daysLeft = diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  const daysEl = document.getElementById('login-stat-days');
  if (daysEl) daysEl.textContent = daysLeft;
  
  // 2. Syllabus progress
  let localDone = {};
  try {
    localDone = JSON.parse(safeGetLocalStorage('neet_v3_done') || '{}');
  } catch(e){}
  const doneCnt = Object.values(localDone).filter(Boolean).length;
  const pct = PLAN.length ? Math.round((doneCnt / PLAN.length) * 100) : 0;
  const progEl = document.getElementById('login-stat-progress');
  if (progEl) progEl.textContent = pct + '%';
  
  // 3. Streak
  let localLogs = [];
  try {
    localLogs = JSON.parse(safeGetLocalStorage('neet_v3_tracker') || '[]');
  } catch(e){}
  
  let streak = 0;
  if (localLogs.length > 0) {
    const logDates = new Set(localLogs.map(l => l.date));
    let checkDate = new Date();
    const todayStr = checkDate.toISOString().split('T')[0];
    
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yestStr = yesterday.toISOString().split('T')[0];
    
    if (logDates.has(todayStr) || logDates.has(yestStr)) {
      if (!logDates.has(todayStr)) {
        checkDate = yesterday;
      }
      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (logDates.has(dateStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  }
  const streakEl = document.getElementById('login-stat-streak');
  if (streakEl) streakEl.textContent = streak;
}

function updateTodayPlanCard() {
  try {
    const dayNum = getTodayDayNum();
    const heroDayTitle = document.getElementById('hero-day-title');
    const heroPhy = document.getElementById('hero-phy-topic');
    const heroChe = document.getElementById('hero-che-topic');
    const heroBio = document.getElementById('hero-bio-topic');
    const heroBadges = document.getElementById('hero-badges');
    
    if (!heroDayTitle) return;
    
    const now = new Date();
    const weekday = now.toLocaleDateString('en-IN', { weekday: 'long' });
    const month = now.toLocaleDateString('en-IN', { month: 'short' });
    const day = now.toLocaleDateString('en-IN', { day: 'numeric' });
    
    if (dayNum <= 0) {
      const daysUntil = Math.abs(dayNum) + 1;
      const daysUntilText = daysUntil === 1 ? "tomorrow" : `in ${daysUntil} days`;
      heroDayTitle.textContent = `Plan Starts 29 June (${daysUntilText})`;
      
      if (heroBadges) {
        heroBadges.innerHTML = `
          <span class="subject-badge badge-phy" style="padding:2px 8px; font-size:10px;">⚡ Physics: 0h</span>
          <span class="subject-badge badge-che" style="padding:2px 8px; font-size:10px;">🧪 Chem: 0h</span>
          <span class="subject-badge badge-bio" style="padding:2px 8px; font-size:10px;">🧬 Bio: 0h</span>
        `;
      }
      
      if (heroPhy) heroPhy.innerHTML = `<div>Pre-Study: Physics foundations</div><div style="font-size:11px; color:var(--text-muted); margin-top:4px; font-weight:normal;">Plan officially begins on 29 June. Check the Day-by-Day calendar tab below for the full schedule.</div>`;
      if (heroChe) heroChe.innerHTML = `<div>Pre-Study: Chemistry fundamentals</div><div style="font-size:11px; color:var(--text-muted); margin-top:4px; font-weight:normal;">Prepare your NCERT textbooks and notebooks.</div>`;
      if (heroBio) heroBio.innerHTML = `<div>Pre-Study: Biology overview</div><div style="font-size:11px; color:var(--text-muted); margin-top:4px; font-weight:normal;">Set up your daily schedule and rest up.</div>`;
      
      const circle = document.getElementById('today-progress-circle');
      const pctText = document.getElementById('today-progress-pct');
      const toggleBtn = document.getElementById('hero-toggle-done-btn');
      if (circle && pctText) {
        pctText.textContent = '0%';
        circle.style.strokeDashoffset = 213.6;
      }
      if (toggleBtn) {
        toggleBtn.style.display = 'none';
      }
    } else {
      const r = PLAN.find(item => item.day === dayNum);
      if (r) {
        heroDayTitle.textContent = `Day ${r.day} — ${weekday}, ${month} ${day}`;
        
        // Prep subject badges
        const hours = getTodayTargetHours(r.day, r.type);
        if (heroBadges) {
          heroBadges.innerHTML = `
            <span class="subject-badge badge-phy" style="padding:2px 8px; font-size:10px;">⚡ Physics: ${hours.phy}h</span>
            <span class="subject-badge badge-che" style="padding:2px 8px; font-size:10px;">🧪 Chem: ${hours.che}h</span>
            <span class="subject-badge badge-bio" style="padding:2px 8px; font-size:10px;">🧬 Bio: ${hours.bio}h</span>
          `;
        }
        
        if (heroPhy) heroPhy.innerHTML = formatTopic(r.phy, r.phyNote);
        if (heroChe) heroChe.innerHTML = formatTopic(r.che, r.cheNote);
        if (heroBio) heroBio.innerHTML = formatTopic(r.bio, r.bioNote);

        // Circular progress & button
        const circle = document.getElementById('today-progress-circle');
        const pctText = document.getElementById('today-progress-pct');
        const toggleBtn = document.getElementById('hero-toggle-done-btn');
        const isDone = done[r.day] || false;
        const pctVal = isDone ? 100 : 0;
        
        if (circle && pctText) {
          pctText.textContent = `${pctVal}%`;
          const circumference = 213.6;
          const offset = circumference - (pctVal / 100) * circumference;
          circle.style.strokeDashoffset = offset;
        }
        if (toggleBtn) {
          toggleBtn.style.display = 'inline-block';
          toggleBtn.textContent = isDone ? '✓ Completed' : 'Mark Completed';
          toggleBtn.style.background = isDone ? 'rgba(0, 212, 170, 0.15)' : 'var(--bg-surface)';
          toggleBtn.style.color = isDone ? 'var(--accent-success)' : 'var(--text-primary)';
          toggleBtn.style.borderColor = isDone ? 'rgba(0, 212, 170, 0.4)' : 'var(--border-color)';
        }
      } else {
        const rDefault = PLAN[0];
        if (rDefault) {
          heroDayTitle.textContent = `Day 1 — ${weekday}, ${month} ${day}`;
          if (heroPhy) heroPhy.innerHTML = formatTopic(rDefault.phy, rDefault.phyNote);
          if (heroChe) heroChe.innerHTML = formatTopic(rDefault.che, rDefault.cheNote);
          if (heroBio) heroBio.innerHTML = formatTopic(rDefault.bio, rDefault.bioNote);
        }
      }
    }
  } catch (e) {
    console.error("Error in updateTodayPlanCard:", e);
  }
  
  function formatTopic(topic, note) {
    if (!topic) return '<span style="color:var(--text-muted);">Rest or Review Day</span>';
    return `<div>${topic}</div>${note ? `<div style="font-size:11px; color:var(--text-muted); margin-top:4px; font-weight:normal;">${note}</div>` : ''}`;
  }
}

function getTodayDayNum() {
  let parsedStartDate = new Date(safeGetLocalStorage("planStart") || "2026-06-29T00:00:00");
  if (isNaN(parsedStartDate.getTime())) {
    parsedStartDate = new Date(2026, 5, 29, 0, 0, 0);
  }
  const START_DATE = parsedStartDate;
  const now = new Date();
  const d1 = new Date(START_DATE.getFullYear(), START_DATE.getMonth(), START_DATE.getDate());
  const d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffTime = d2 - d1;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

function getTodayTargetHours(dayNum, type) {
  if (type === 'rest') {
    return { phy: 0, che: 0, bio: 0 };
  }
  if (dayNum <= 15) {
    return { phy: 1.5, che: 1.5, bio: 1.5 };
  } else if (dayNum <= 105) {
    return { phy: 2, che: 2, bio: 3.5 };
  } else if (dayNum <= 275) {
    return { phy: 3, che: 2.5, bio: 3.5 };
  } else {
    return { phy: 3.5, che: 3, bio: 4 };
  }
}

function renderHeatmap() {
  const container = document.getElementById('study-heatmap-container');
  if (!container) return;
  
  const hoursMap = {};
  trackerLogs.forEach(log => {
    const totalH = (log.phyHours || 0) + (log.cheHours || 0) + (log.bioHours || 0);
    hoursMap[log.date] = (hoursMap[log.date] || 0) + totalH;
  });
  
  const START_DATE_RAW = safeGetLocalStorage("planStart") || "2026-06-29T00:00:00";
  const startPlan = new Date(START_DATE_RAW);
  const startDate = new Date(startPlan);
  startDate.setDate(startPlan.getDate() - startPlan.getDay()); // Go to previous Sunday
  const endDate = new Date(startPlan);
  endDate.setDate(startPlan.getDate() + 312); // Show the full 309-day range plus padding to fill the week grid
  
  let html = '<div class="heatmap-grid">';
  const tempDate = new Date(startDate);
  
  while (tempDate <= endDate) {
    const yyyy = tempDate.getFullYear();
    const mm = String(tempDate.getMonth() + 1).padStart(2, '0');
    const dd = String(tempDate.getDate()).padStart(2, '0');
    const dateKey = `${yyyy}-${mm}-${dd}`;
    
    const hours = hoursMap[dateKey] || 0;
    
    let bg = 'rgba(255, 255, 255, 0.05)';
    if (hours > 0 && hours < 2) bg = '#e0f2fe';
    else if (hours >= 2 && hours < 4) bg = '#7dd3fc';
    else if (hours >= 4 && hours < 6) bg = '#0284c7';
    else if (hours >= 6) bg = '#0369a1';
    
    const formattedDate = tempDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const tooltip = `${formattedDate}: ${hours.toFixed(1)} hours studied`;
    
    html += `<div class="heatmap-cell" style="background: ${bg};" title="${tooltip}"></div>`;
    
    tempDate.setDate(tempDate.getDate() + 1);
  }
  
  html += '</div>';
  container.innerHTML = html;
}

function sortTable(thEl, colIdx, isNumeric = false) {
  const table = thEl.closest('table');
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  
  const asc = !thEl.classList.contains('sort-asc');
  
  table.querySelectorAll('th').forEach(th => th.classList.remove('sort-asc', 'sort-desc'));
  thEl.classList.add(asc ? 'sort-asc' : 'sort-desc');
  
  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[colIdx] ? rowA.cells[colIdx].textContent.trim() : '';
    const cellB = rowB.cells[colIdx] ? rowB.cells[colIdx].textContent.trim() : '';
    
    if (isNumeric) {
      const numA = parseFloat(cellA.replace(/[^0-9.-]/g, '')) || 0;
      const numB = parseFloat(cellB.replace(/[^0-9.-]/g, '')) || 0;
      return asc ? numA - numB : numB - numA;
    }
    
    return asc 
      ? cellA.localeCompare(cellB, undefined, { numeric: true, sensitivity: 'base' })
      : cellB.localeCompare(cellA, undefined, { numeric: true, sensitivity: 'base' });
  });
  
  rows.forEach(row => tbody.appendChild(row));
}

function toggleTheme() {
  const currentTheme = safeGetLocalStorage('theme') || 'dark';
  if (currentTheme === 'light') {
    applyTheme('default-dark');
  } else {
    applyTheme('light');
  }
}

function applyTheme(themeName) {
  document.body.classList.remove('theme-midnight-cyber', 'theme-forest-mint', 'theme-deep-cosmos', 'light-mode');
  
  if (themeName === 'light') {
    document.body.classList.add('light-mode');
    safeSetLocalStorage('theme', 'light');
  } else if (themeName === 'midnight-cyber') {
    document.body.classList.add('theme-midnight-cyber');
    safeSetLocalStorage('theme', 'midnight-cyber');
  } else if (themeName === 'forest-mint') {
    document.body.classList.add('theme-forest-mint');
    safeSetLocalStorage('theme', 'forest-mint');
  } else if (themeName === 'deep-cosmos') {
    document.body.classList.add('theme-deep-cosmos');
    safeSetLocalStorage('theme', 'deep-cosmos');
  } else {
    safeSetLocalStorage('theme', 'dark');
  }
  
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    btn.textContent = (themeName === 'light') ? '🌙' : '☀️';
  }
}

function loadTheme() {
  const savedTheme = safeGetLocalStorage('theme') || 'dark';
  applyTheme(savedTheme);
}

window.applyTheme = applyTheme;

function initOnLoad() {
  initAiDragAndDrop();
  const storedKey = safeGetLocalStorage('gemini_api_key');
  const keyInput = document.getElementById('gemini-key');
  if (storedKey && keyInput) {
    keyInput.value = storedKey;
  }
  
  // Initialize planStart date if not already set or if it's not the target start date
  const storedPlanStart = safeGetLocalStorage("planStart");
  if (storedPlanStart !== "2026-06-29T00:00:00") {
    safeSetLocalStorage("planStart", "2026-06-29T00:00:00");
  }
  
  // Set date input defaults to today
  const today = new Date().toISOString().split('T')[0];
  const dInput = document.getElementById('track-date');
  if (dInput) dInput.value = today;
  const qdInput = document.getElementById('quick-track-date');
  if (qdInput) qdInput.value = today;

  // Dynamically load week options in select
  const wkSel = document.getElementById('wkf');
  if (wkSel) {
    // Clear out existing options except first
    while (wkSel.options.length > 1) {
      wkSel.remove(1);
    }
    const totalWeeks = Math.ceil(PLAN.length / 7);
    for (let w = 1; w <= totalWeeks; w++) {
      const o = document.createElement('option');
      o.value = w;
      o.textContent = `Week ${w}`;
      wkSel.appendChild(o);
    }
  }

  // Render initial components and data tables safely
  try { renderPlan(); } catch(e) { console.error("Error in renderPlan:", e); }
  try { renderChapters(); } catch(e) { console.error("Error in renderChapters:", e); }
  try { renderTestList(); } catch(e) { console.error("Error in renderTestList:", e); }
  try { renderTrackerTable(); } catch(e) { console.error("Error in renderTrackerTable:", e); }
  try { renderAnalytics(); } catch(e) { console.error("Error in renderAnalytics:", e); }
  try {
    if (typeof renderHeatmap === 'function') {
      renderHeatmap();
    }
  } catch(e) { console.error("Error in renderHeatmap:", e); }

  // Render login statistics
  try { updateLoginStats(); } catch(e) { console.error("Error in updateLoginStats:", e); }
  
  // Load dark/light mode preference
  try { loadTheme(); } catch(e) { console.error("Error in loadTheme:", e); }

  // Initial stats updates & start countdown timer
  try { updateOverviewStats(); } catch(e) { console.error("Error in updateOverviewStats:", e); }
  try {
    setInterval(() => {
      try {
        updateCountdown();
      } catch(e) {
        console.error("Error in countdown interval:", e);
      }
    }, 1000);
  } catch(e) {
    console.error("Error setting countdown interval:", e);
  }

  try { renderErrorBookList(); } catch(e) { console.error("Error in renderErrorBookList:", e); }
  try { loadSelectedFlashcardDeck(); } catch(e) { console.error("Error in loadSelectedFlashcardDeck:", e); }
  try { renderMockTestsDashboard(); setDefaultMockDate(); } catch(e) { console.error("Error in renderMockTestsDashboard init:", e); }

  try {
    const hideWelcome = safeGetLocalStorage('neet_hide_welcome_modal');
    if (hideWelcome === 'true') {
      const modal = document.getElementById('welcome-summary-modal');
      if (modal) modal.classList.remove('active');
    } else {
      // Save scroll position before locking
      window._scrollLockY = window.scrollY || window.pageYOffset || 0;
      document.body.style.top = `-${window._scrollLockY}px`;
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');

      // Block touch scroll on the modal overlay, allowing the inner container to scroll
      const modal = document.getElementById('welcome-summary-modal');
      if (modal) {
        modal.addEventListener('touchmove', function(e) {
          const scrollable = e.target.closest('.welcome-modal-scrollable');
          if (!scrollable) {
            e.preventDefault();
          }
        }, { passive: false });
      }
    }
  } catch(e) { 
    console.error("Error hiding welcome modal:", e); 
  }

  // Dynamic bindings for Error Book
  try {
    const errSub = document.getElementById('err-subject');
    if (errSub) {
      errSub.addEventListener('change', populateErrorChapters);
      // Run once initially to populate chapters if a subject is already selected
      populateErrorChapters();
    }
    const errForm = document.getElementById('errorbook-form');
    if (errForm) {
      errForm.addEventListener('submit', saveErrorBookItem);
    }
  } catch(e) {
    console.error("Error binding Error Book event listeners:", e);
  }
}

function closeWelcomeSummary() {
  const modal = document.getElementById('welcome-summary-modal');
  if (modal) modal.classList.remove('active');
  
  // Unlock scroll
  document.body.classList.remove('modal-open');
  document.documentElement.classList.remove('modal-open');
  document.body.style.top = '';
  
  // Restore scroll position
  if (typeof window._scrollLockY === 'number') {
    window.scrollTo(0, window._scrollLockY);
    window._scrollLockY = 0;
  }

  try {
    const cb = document.getElementById('hide-welcome-cb');
    if (cb && cb.checked) {
      safeSetLocalStorage('neet_hide_welcome_modal', 'true');
    }
  } catch(e) {}
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOnLoad);
} else {
  initOnLoad();
}

window.startAiParse = startAiParse;
window.generateAiChapterTest = generateAiChapterTest;
window.cbtPrev = cbtPrev;
window.cbtNext = cbtNext;
window.cbtToggleFlag = cbtToggleFlag;
window.cbtSelectOption = cbtSelectOption;
window.cbtSubmitTest = cbtSubmitTest;
window.cbtShowReview = cbtShowReview;
window.cbtExitResults = cbtExitResults;
window.cbtJumpToQuestion = cbtJumpToQuestion;
window.openQuickLog = openQuickLog;
window.closeQuickLog = closeQuickLog;
window.logQuickStudy = logQuickStudy;
window.sortTable = sortTable;
window.toggleTheme = toggleTheme;
window.closeWelcomeSummary = closeWelcomeSummary;
window.showToast = showToast;

function saveApiKey() {
  const keyInput = document.getElementById('gemini-key');
  const statusEl = document.getElementById('settings-status');
  const key = keyInput ? keyInput.value.trim() : '';
  
  if (!statusEl) return;
  
  statusEl.style.display = 'block';
  
  if (key) {
    if (!key.startsWith('AIzaSy')) {
      statusEl.style.background = 'rgba(255, 107, 107, 0.1)';
      statusEl.style.color = 'var(--tertiary)';
      statusEl.style.border = '1px solid var(--tertiary)';
      statusEl.textContent = '⚠️ Invalid API Key format. It should start with "AIzaSy".';
      return;
    }
    
    safeSetLocalStorage('gemini_api_key', key);
    statusEl.style.background = 'rgba(0, 212, 170, 0.1)';
    statusEl.style.color = 'var(--primary)';
    statusEl.style.border = '1px solid var(--primary)';
    statusEl.textContent = '✓ API Key saved successfully!';
  } else {
    safeRemoveLocalStorage('gemini_api_key');
    statusEl.style.background = 'rgba(255, 165, 0, 0.1)';
    statusEl.style.color = '#ffa500';
    statusEl.style.border = '1px solid #ffa500';
    statusEl.textContent = '✓ API Key cleared successfully.';
  }
  
  setTimeout(() => {
    statusEl.style.display = 'none';
  }, 4000);
}

window.saveApiKey = saveApiKey;


/* ==========================================================================
   ULTIMATE UPGRADE FEATURES: ERROR BOOK, FLASHCARDS, BACKLOG RESCUE & CONFETTI
   ========================================================================== */

// 1. CONFETTI EFFECT
function triggerConfetti() {
  const colors = ['#fbbf24', '#8b5cf6', '#10b981', '#f87171', '#00f2fe', '#f35588'];
  const particleCount = 60;
  
  // Left corner launcher
  launchConfetti(0, window.innerHeight, 45, colors, particleCount / 2);
  // Right corner launcher
  launchConfetti(window.innerWidth, window.innerHeight, 135, colors, particleCount / 2);
}

function launchConfetti(x, y, angleDeg, colors, count) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    
    // Choose random color & size
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.backgroundColor = color;
    const size = Math.floor(Math.random() * 8) + 6;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    
    // Position at launcher
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    
    // Randomize path velocities
    const angleRad = (angleDeg + (Math.random() * 40 - 20)) * Math.PI / 180;
    const speed = Math.random() * 15 + 10;
    const vx = Math.cos(angleRad) * speed;
    const vy = -Math.sin(angleRad) * speed;
    
    // Set variables for animation
    p.style.setProperty('--x', (vx * 20) + 'px');
    p.style.setProperty('--y', (vy * 20 + 200) + 'px'); // simulate gravity drop
    
    document.body.appendChild(p);
    
    // Clean up
    setTimeout(() => p.remove(), 2500);
  }
}

// 2. TODAY DONE TOGGLE
function toggleTodayDone() {
  const dayNum = getTodayDayNum();
  if (dayNum > 0 && dayNum <= PLAN.length) {
    toggleDone(dayNum);
    // If just completed today's target, fire confetti!
    if (done[dayNum]) {
      triggerConfetti();
    }
  }
}

// 3. BACKLOG RESCUE SYSTEM
function getBacklogTasksForDay(dayNum) {
  const rescued = JSON.parse(safeGetLocalStorage('neet_v3_rescued_backlog_days') || '[]');
  if (rescued.length === 0) return null;
  
  const today = getTodayDayNum();
  if (dayNum <= today) return null; // Show backlogs only on future days
  
  // Future study days
  const futureStudyDays = PLAN.filter(r => r.day > today && r.type === 'study').map(r => r.day);
  const idx = futureStudyDays.indexOf(dayNum);
  
  if (idx !== -1 && idx < rescued.length) {
    const backlogDayNum = rescued[idx];
    const backlogDay = PLAN.find(r => r.day === backlogDayNum);
    if (backlogDay) {
      return {
        day: backlogDayNum,
        phy: backlogDay.phy,
        che: backlogDay.che,
        bio: backlogDay.bio
      };
    }
  }
  return null;
}

function openBacklogModal() {
  const modal = document.getElementById('backlog-modal');
  const listContainer = document.getElementById('backlog-modal-list');
  if (!modal || !listContainer) return;
  
  const today = getTodayDayNum();
  const rescuedDays = new Set(JSON.parse(safeGetLocalStorage('neet_v3_rescued_backlog_days') || '[]'));
  
  // Find skipped days up to yesterday
  const skipped = PLAN.filter(r => r.day < today && r.type !== 'rest' && !done[r.day] && !rescuedDays.has(r.day));
  
  if (skipped.length === 0) {
    listContainer.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-secondary); font-weight:600;">✓ Excellent! You have no backlog days to rescue. All past days are completed or on-track!</div>`;
  } else {
    let html = '';
    skipped.forEach(r => {
      html += `
        <label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:13px; color:var(--text-primary); padding:6px; background:var(--bg-surface-hover); border-radius:6px;">
          <input type="checkbox" class="backlog-rescue-cb" value="${r.day}" checked style="width:16px; height:16px;">
          <span><strong>Day ${r.day}</strong>: P: ${r.phy ? 'Yes' : 'No'} | C: ${r.che ? 'Yes' : 'No'} | B: ${r.bio ? 'Yes' : 'No'}</span>
        </label>
      `;
    });
    listContainer.innerHTML = html;
  }
  
  modal.classList.add('active');
}

function closeBacklogModal() {
  const modal = document.getElementById('backlog-modal');
  if (modal) modal.classList.remove('active');
}

function executeBacklogRescue() {
  const cbs = document.querySelectorAll('.backlog-rescue-cb:checked');
  if (cbs.length === 0) {
    alert("Please select at least one day to rescue!");
    return;
  }
  
  const selectedDays = Array.from(cbs).map(cb => parseInt(cb.value));
  let rescuedDays = JSON.parse(safeGetLocalStorage('neet_v3_rescued_backlog_days') || '[]');
  
  // Merge and save
  rescuedDays = Array.from(new Set(rescuedDays.concat(selectedDays)));
  safeSetLocalStorage('neet_v3_rescued_backlog_days', JSON.stringify(rescuedDays));
  
  alert(`Successfully rescued ${selectedDays.length} backlog day(s)! Skipped lectures have been distributed sequentially across your upcoming study days.`);
  closeBacklogModal();
  renderPlan();
  updateTodayPlanCard();
}

// 4. ERROR BOOK CONTROLLERS

function populateErrorChapters() {
  const subEl = document.getElementById('err-subject');
  const chapEl = document.getElementById('err-chapter');
  if (!subEl || !chapEl) return;
  
  const subject = subEl.value;
  let chList = [];
  if (subject === 'Physics') chList = P1_PHY.concat(P2_PHY);
  else if (subject === 'Chemistry') chList = P1_CHE.concat(P2_CHE);
  else if (subject === 'Biology') chList = P1_BIO.concat(P2_BIO);
  
  let html = '<option value="">Select Chapter</option>';
  chList.forEach(c => {
    html += `<option value="${c.ch.trim()}">${c.ch.trim()}</option>`;
  });
  chapEl.innerHTML = html;
}

function saveErrorBookItem(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  
  const subject = document.getElementById('err-subject').value;
  const chapter = document.getElementById('err-chapter').value;
  const category = document.getElementById('err-category').value;
  const description = document.getElementById('err-description').value.trim();
  const correct = document.getElementById('err-correct').value.trim();
  
  if (!subject || !chapter || !category || !description) return;
  
  const item = {
    id: Date.now(),
    subject,
    chapter,
    category,
    description,
    correct,
    done: false,
    date: new Date().toLocaleDateString('en-IN')
  };
  
  errorBookItems.unshift(item);
  safeSetLocalStorage('neet_v3_errorbook_items', JSON.stringify(errorBookItems));
  
  // Reset form
  document.getElementById('errorbook-form').reset();
  populateErrorChapters();
  
  renderErrorBookList();
  alert("Error saved to your notebook!");
}

function deleteErrorBookItem(id) {
  if (!confirm("Are you sure you want to delete this error entry?")) return;
  errorBookItems = errorBookItems.filter(item => item.id !== id);
  safeSetLocalStorage('neet_v3_errorbook_items', JSON.stringify(errorBookItems));
  renderErrorBookList();
}

function toggleErrorBookItemDone(id) {
  const item = errorBookItems.find(item => item.id === id);
  if (item) {
    item.done = !item.done;
    safeSetLocalStorage('neet_v3_errorbook_items', JSON.stringify(errorBookItems));
    renderErrorBookList();
    if (item.done) {
      triggerConfetti();
    }
  }
}

function renderErrorBookList() {
  const container = document.getElementById('errorbook-list-container');
  if (!container) return;
  
  const searchQ = (document.getElementById('err-srch') || {value:''}).value.toLowerCase();
  const subFilter = (document.getElementById('err-filter-sub') || {value:''}).value;
  const catFilter = (document.getElementById('err-filter-cat') || {value:''}).value;
  
  const filtered = errorBookItems.filter(item => {
    if (subFilter && item.subject !== subFilter) return false;
    if (catFilter && item.category !== catFilter) return false;
    if (searchQ) {
      const matchText = (item.chapter + ' ' + item.description + ' ' + item.correct).toLowerCase();
      if (!matchText.includes(searchQ)) return false;
    }
    return true;
  });
  
  if (filtered.length === 0) {
    container.innerHTML = `<div class="glass-card" style="text-align:center; padding:30px; color:var(--text-secondary);">No errors logged matching the selected filters. Log mistakes from tests to keep track!</div>`;
    return;
  }
  
  let html = '';
  filtered.forEach(item => {
    const isChecked = item.done ? 'checked' : '';
    const cardCls = item.done ? 'done-row' : '';
    
    // Category badges
    let catBadge = '';
    if (item.category === 'Silly') catBadge = '<span class="subject-badge badge-phy" style="background:rgba(96, 165, 250, 0.15); color:#60a5fa; border:1px solid #60a5fa; font-size:10px;">🤡 Silly</span>';
    else if (item.category === 'Conceptual') catBadge = '<span class="subject-badge badge-che" style="background:rgba(52, 211, 153, 0.15); color:#34d399; border:1px solid #34d399; font-size:10px;">🧠 Conceptual</span>';
    else if (item.category === 'Memory') catBadge = '<span class="subject-badge badge-bio" style="background:rgba(226, 75, 74, 0.15); color:#E24B4A; border:1px solid #E24B4A; font-size:10px;">💾 Memory</span>';
    else catBadge = '<span class="subject-badge badge-mock" style="background:rgba(245, 158, 11, 0.15); color:#f59e0b; border:1px solid #f59e0b; font-size:10px;">⏱️ Time</span>';
    
    html += `
      <div class="glass-card ${cardCls}" style="padding:16px; border-left:4px solid ${item.subject === 'Physics' ? 'var(--primary)' : item.subject === 'Chemistry' ? 'var(--accent-success)' : 'var(--secondary)'}; display:flex; justify-content:space-between; gap:16px; align-items:start;">
        <div style="flex:1; display:flex; gap:12px; align-items:start;">
          <input type="checkbox" ${isChecked} onchange="toggleErrorBookItemDone(${item.id})" style="width:18px; height:18px; margin-top:3px; cursor:pointer;">
          <div style="flex:1; display:flex; flex-direction:column; gap:6px;">
            <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
              <strong style="font-size:13px; color:var(--text-primary);">${item.subject}: ${item.chapter}</strong>
              ${catBadge}
              <span style="font-size:10px; color:var(--text-muted);">${item.date}</span>
            </div>
            <p style="margin:0; font-size:13px; color:var(--text-secondary); line-height:1.4;">❌ <strong>Mistake:</strong> ${item.description}</p>
            ${item.correct ? `<p style="margin:4px 0 0 0; font-size:12.5px; color:var(--accent-success); line-height:1.4;">✅ <strong>Correct Concept:</strong> ${item.correct}</p>` : ''}
          </div>
        </div>
        <button onclick="deleteErrorBookItem(${item.id})" style="background:transparent; border:none; color:var(--accent-danger); font-size:16px; cursor:pointer; opacity:0.75;" title="Delete Entry">✕</button>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// 5. FLASHCARDS CONTROLLERS

function getLinkedFlashcards() {
  const today = getTodayDayNum();
  const activeChapters = new Set();
  
  if (typeof PLAN !== 'undefined') {
    PLAN.forEach(item => {
      if (item.day <= today) {
        if (item.phyChap && item.phyChap !== 'Revision' && item.phyChap !== 'Test' && item.phyChap !== 'Rest') activeChapters.add(item.phyChap);
        if (item.cheChap && item.cheChap !== 'Revision' && item.cheChap !== 'Test' && item.cheChap !== 'Rest') activeChapters.add(item.cheChap);
        if (item.bioChap && item.bioChap !== 'Revision' && item.bioChap !== 'Test' && item.bioChap !== 'Rest') activeChapters.add(item.bioChap);
      }
    });
  }

  const cards = [];
  activeChapters.forEach(ch => {
    const questions = (typeof PYQ_BANK !== 'undefined' ? PYQ_BANK[ch] : []) || [];
    questions.forEach(q_obj => {
      let qText = q_obj.q;
      if (q_obj.opts && q_obj.opts.length === 4) {
        qText += "\n\n" +
                 "(A) " + q_obj.opts[0] + "\n" +
                 "(B) " + q_obj.opts[1] + "\n" +
                 "(C) " + q_obj.opts[2] + "\n" +
                 "(D) " + q_obj.opts[3];
      }
      let aText = "Correct Answer: (" + String.fromCharCode(65 + q_obj.ans) + ") " + q_obj.opts[q_obj.ans] + "\n\n" +
                  "Explanation:\n" + q_obj.exp;
      
      cards.push({
        q: qText,
        a: aText,
        cat: q_obj.subject ? (q_obj.subject.charAt(0).toUpperCase() + q_obj.subject.slice(1)) : 'General'
      });
    });
  });

  if (cards.length === 0) {
    // Return a merge of all default decks
    return (FLASHCARD_DECKS['physics'] || [])
      .concat(FLASHCARD_DECKS['chemistry'] || [])
      .concat(FLASHCARD_DECKS['biology'] || []);
  }

  // Shuffle the cards
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

function loadSelectedFlashcardDeck() {
  const select = document.getElementById('flashcard-deck-select');
  if (select) {
    currentDeckKey = select.value;
  }
  currentCardIdx = 0;
  
  if (currentDeckKey === 'linked') {
    FLASHCARD_DECKS['linked'] = getLinkedFlashcards();
  }
  
  // Unflip card structure
  const inner = document.getElementById('flashcard-inner');
  if (inner) inner.classList.remove('flipped');
  
  showFlashcard();
}

function showFlashcard() {
  const deck = FLASHCARD_DECKS[currentDeckKey] || [];
  const progText = document.getElementById('flashcard-progress');
  const catBadge = document.getElementById('flashcard-front-cat');
  const frontText = document.getElementById('flashcard-front-text');
  const backText = document.getElementById('flashcard-back-text');
  
  if (deck.length === 0) return;
  const card = deck[currentCardIdx];
  
  if (progText) progText.textContent = `Card ${currentCardIdx + 1} / ${deck.length}`;
  if (catBadge) {
    catBadge.textContent = card.cat;
    catBadge.className = 'subject-badge';
    if (card.cat === 'Physics') catBadge.classList.add('badge-phy');
    else if (card.cat === 'Chemistry') catBadge.classList.add('badge-che');
    else catBadge.classList.add('badge-bio');
  }
  if (frontText) frontText.textContent = card.q;
  if (backText) backText.textContent = card.a;
  renderMath(document.getElementById('flashcard-inner'));
}

function flipFlashcard() {
  const inner = document.getElementById('flashcard-inner');
  if (inner) {
    inner.classList.toggle('flipped');
  }
}

function handleFlashcardAction(isEasy) {
  const deck = FLASHCARD_DECKS[currentDeckKey] || [];
  
  // Reset card rotation
  const inner = document.getElementById('flashcard-inner');
  if (inner) inner.classList.remove('flipped');
  
  // Simple transition delay for next card
  setTimeout(() => {
    if (isEasy) {
      currentCardIdx = (currentCardIdx + 1) % deck.length;
    } else {
      // Shuffle the current card randomly further back
      const current = deck.splice(currentCardIdx, 1)[0];
      const insertAt = Math.min(deck.length, currentCardIdx + Math.floor(Math.random() * 3) + 1);
      deck.splice(insertAt, 0, current);
    }
    showFlashcard();
  }, 200);
}

// Bind all to window
// Bind all to window
window.triggerConfetti = triggerConfetti;
window.toggleTodayDone = toggleTodayDone;
window.getBacklogTasksForDay = getBacklogTasksForDay;
window.openBacklogModal = openBacklogModal;
window.closeBacklogModal = closeBacklogModal;
window.executeBacklogRescue = executeBacklogRescue;
window.populateErrorChapters = populateErrorChapters;
window.saveErrorBookItem = saveErrorBookItem;
window.deleteErrorBookItem = deleteErrorBookItem;
window.toggleErrorBookItemDone = toggleErrorBookItemDone;
window.renderErrorBookList = renderErrorBookList;
window.loadSelectedFlashcardDeck = loadSelectedFlashcardDeck;
window.showFlashcard = showFlashcard;
window.flipFlashcard = flipFlashcard;
window.handleFlashcardAction = handleFlashcardAction;

// 6. MOCK TESTS & SILLY MISTAKES CONTROLLERS

function setDefaultMockDate() {
  const dateInput = document.getElementById('mock-date');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    if (mm < 10) mm = '0' + mm;
    if (dd < 10) dd = '0' + dd;
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }
}

function saveMockTest(e) {
  if (e) e.preventDefault();
  
  const name = document.getElementById('mock-name').value;
  const date = document.getElementById('mock-date').value;
  const phy = parseInt(document.getElementById('mock-phy').value) || 0;
  const che = parseInt(document.getElementById('mock-che').value) || 0;
  const bio = parseInt(document.getElementById('mock-bio').value) || 0;
  
  const errConcept = parseInt(document.getElementById('mock-err-concept').value) || 0;
  const errCalc = parseInt(document.getElementById('mock-err-calc').value) || 0;
  const errRead = parseInt(document.getElementById('mock-err-read').value) || 0;
  const errTime = parseInt(document.getElementById('mock-err-time').value) || 0;
  const errOmr = parseInt(document.getElementById('mock-err-omr').value) || 0;
  
  const total = phy + che + bio;
  
  const testRecord = {
    id: 'mock_test_' + Date.now(),
    name: name,
    date: date,
    phy: phy,
    che: che,
    bio: bio,
    total: total,
    mistakes: {
      concept: errConcept,
      calc: errCalc,
      read: errRead,
      time: errTime,
      omr: errOmr
    }
  };
  
  mockTests.unshift(testRecord);
  safeSetLocalStorage('neet_v3_mock_tests', JSON.stringify(mockTests));
  
  // Reset form
  document.getElementById('mocktest-form').reset();
  setDefaultMockDate();
  
  renderMockTestsDashboard();
  triggerConfetti();
  alert(`Mock test "${name}" saved! Total Score: ${total}/720`);
}

function deleteMockTest(id) {
  if (!confirm("Are you sure you want to delete this mock test record?")) return;
  mockTests = mockTests.filter(t => t.id !== id);
  safeSetLocalStorage('neet_v3_mock_tests', JSON.stringify(mockTests));
  renderMockTestsDashboard();
}

function renderMockTestsDashboard() {
  const statsContainer = document.getElementById('mock-standing-stats');
  const mistakesContainer = document.getElementById('silly-mistakes-breakdown-panel');
  const safeZoneContainer = document.getElementById('safe-zone-bar-container');
  const logBody = document.getElementById('mock-test-log-body');
  const logCount = document.getElementById('mock-log-count');
  
  if (logCount) {
    logCount.textContent = `${mockTests.length} test${mockTests.length === 1 ? '' : 's'} logged`;
  }
  
  if (logBody) {
    if (mockTests.length === 0) {
      logBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; color:var(--text-muted); padding:30px;">No mock tests logged. Enter your scores above.</td>
        </tr>
      `;
    } else {
      let html = '';
      mockTests.forEach(t => {
        const totalMistakes = (t.mistakes.concept || 0) + (t.mistakes.calc || 0) + (t.mistakes.read || 0) + (t.mistakes.time || 0) + (t.mistakes.omr || 0);
        html += `
          <tr>
            <td style="font-weight:600;">${t.date}</td>
            <td style="color:var(--text-secondary); font-weight:600;">${t.name}</td>
            <td style="text-align:center; font-weight:600; color:var(--text-secondary);">${t.phy}</td>
            <td style="text-align:center; font-weight:600; color:var(--text-secondary);">${t.che}</td>
            <td style="text-align:center; font-weight:600; color:var(--text-secondary);">${t.bio}</td>
            <td style="text-align:center; font-weight:700; color:var(--primary);">${t.total}</td>
            <td>
              <div style="display:flex; flex-wrap:wrap; gap:4px; font-size:10px;">
                ${t.mistakes.concept ? `<span style="background:rgba(255,255,255,0.05); padding:2px 4px; border-radius:3px;">🧠 Concept: ${t.mistakes.concept}</span>` : ''}
                ${t.mistakes.calc ? `<span style="background:rgba(255,107,107,0.1); color:var(--tertiary); padding:2px 4px; border-radius:3px;">🔢 Math: ${t.mistakes.calc}</span>` : ''}
                ${t.mistakes.read ? `<span style="background:rgba(251,191,36,0.1); color:#fbbf24; padding:2px 4px; border-radius:3px;">📖 Read: ${t.mistakes.read}</span>` : ''}
                ${t.mistakes.time ? `<span style="background:rgba(96,165,250,0.1); color:#60a5fa; padding:2px 4px; border-radius:3px;">⏳ Time: ${t.mistakes.time}</span>` : ''}
                ${t.mistakes.omr ? `<span style="background:rgba(167,139,250,0.1); color:#a78bfa; padding:2px 4px; border-radius:3px;">⭕ OMR: ${t.mistakes.omr}</span>` : ''}
                ${!totalMistakes ? '<span style="color:var(--accent-success);">Perfect! No errors logged</span>' : ''}
              </div>
            </td>
            <td style="text-align:center;">
              <button class="btn btn-secondary" style="padding:2px 6px; font-size:10px; border-color:rgba(248,113,113,0.2); color:var(--tertiary);" onclick="deleteMockTest('${t.id}')">🗑️ Delete</button>
            </td>
          </tr>
        `;
      });
      logBody.innerHTML = html;
    }
  }
  
  if (mockTests.length === 0) {
    if (statsContainer) {
      statsContainer.innerHTML = `<div style="font-size:12px; color:var(--text-muted); padding:10px;">No mock tests logged yet. Enter your first test score on the left!</div>`;
    }
    if (mistakesContainer) {
      mistakesContainer.innerHTML = '';
    }
    if (safeZoneContainer) {
      safeZoneContainer.innerHTML = '';
    }
    return;
  }
  
  let sumTotal = 0;
  let sumPhy = 0;
  let sumChe = 0;
  let sumBio = 0;
  
  let errConcept = 0;
  let errCalc = 0;
  let errRead = 0;
  let errTime = 0;
  let errOmr = 0;
  
  mockTests.forEach(t => {
    sumTotal += t.total;
    sumPhy += t.phy;
    sumChe += t.che;
    sumBio += t.bio;
    
    errConcept += t.mistakes.concept || 0;
    errCalc += t.mistakes.calc || 0;
    errRead += t.mistakes.read || 0;
    errTime += t.mistakes.time || 0;
    errOmr += t.mistakes.omr || 0;
  });
  
  const len = mockTests.length;
  const avgTotal = Math.round(sumTotal / len);
  const avgPhy = Math.round(sumPhy / len);
  const avgChe = Math.round(sumChe / len);
  const avgBio = Math.round(sumBio / len);
  
  if (statsContainer) {
    statsContainer.innerHTML = `
      <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">Average Mock Score</div>
      <div style="font-size:38px; font-weight:800; color:var(--primary); line-height:1.1; text-shadow:0 0 10px var(--primary-glow);">${avgTotal} <span style="font-size:16px; font-weight:500; color:var(--text-muted);">/ 720</span></div>
      <div style="display:flex; justify-content:center; gap:16px; margin-top:10px; font-size:12px; color:var(--text-secondary); font-weight:600;">
        <span>Phy: <strong style="color:var(--text-primary);">${avgPhy}</strong></span>
        <span>Che: <strong style="color:var(--text-primary);">${avgChe}</strong></span>
        <span>Bio: <strong style="color:var(--text-primary);">${avgBio}</strong></span>
      </div>
    `;
  }
  
  if (safeZoneContainer) {
    let zoneBadge = '';
    let zoneColor = '';
    let zoneDesc = '';
    
    if (avgTotal >= 610) {
      zoneBadge = '🟢 Govt Seat Safe Zone';
      zoneColor = 'var(--accent-success)';
      zoneDesc = 'Excellent! Your average score is safe for State & All-India Govt MBBS seats. Keep drilling and focus on maintaining consistency.';
    } else if (avgTotal >= 550) {
      zoneBadge = '🟡 Borderline Territory';
      zoneColor = '#fbbf24';
      zoneDesc = 'You are very close! Government college eligibility starts around 580-600. Focus on reducing silly mistakes to gain the final 30-50 marks.';
    } else {
      zoneBadge = '🔴 Needs Improvement';
      zoneColor = 'var(--tertiary)';
      zoneDesc = 'Focus heavily on NCERT basics, error book analysis, and high-weightage chapters. Avoid guessing; focus on accuracy first.';
    }
    
    const pct = Math.min(100, Math.max(0, ((avgTotal - 360) / (720 - 360)) * 100));
    
    safeZoneContainer.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span style="font-size:11px; font-weight:700; color:var(--text-secondary);">GOVT MBBS ELIGIBILITY</span>
        <span class="type-badge" style="background:${zoneColor}15; color:${zoneColor}; border:1px solid ${zoneColor}20; padding:2px 6px; font-size:10px; font-weight:700;">${zoneBadge}</span>
      </div>
      <div style="width:100%; height:8px; border-radius:4px; background:rgba(255,255,255,0.05); overflow:hidden; display:flex; margin-bottom:8px; border:1px solid rgba(255,255,255,0.05);">
        <div style="width:${pct}%; height:100%; background:${zoneColor}; box-shadow: 0 0 8px ${zoneColor}aa; transition: width 0.4s ease;"></div>
      </div>
      <p style="font-size:11px; color:var(--text-muted); line-height:1.5; margin:0;">${zoneDesc}</p>
    `;
  }
  
  if (mistakesContainer) {
    const totalErrs = errConcept + errCalc + errRead + errTime + errOmr;
    if (totalErrs === 0) {
      mistakesContainer.innerHTML = `
        <div style="font-size:11px; font-weight:600; color:var(--accent-success); display:flex; align-items:center; gap:4px; margin-top:8px;">
          <span>🎉</span> No silly mistakes logged yet! Accuracy is outstanding.
        </div>
      `;
    } else {
      const conceptPct = Math.round((errConcept / totalErrs) * 100);
      const calcPct = Math.round((errCalc / totalErrs) * 100);
      const readPct = Math.round((errRead / totalErrs) * 100);
      const timePct = Math.round((errTime / totalErrs) * 100);
      const omrPct = Math.round((errOmr / totalErrs) * 100);
      
      mistakesContainer.innerHTML = `
        <span style="font-size:11px; font-weight:700; color:var(--text-secondary); display:block; margin-bottom:8px;">⚠️ Negative Marks Analysis (Mistake Share)</span>
        <div style="display:flex; flex-direction:column; gap:6px;">
          ${renderErrorBar('🧠 Concept Gaps', errConcept, conceptPct, 'rgba(255,255,255,0.25)')}
          ${renderErrorBar('🔢 Calculation Slips', errCalc, calcPct, 'var(--tertiary)')}
          ${renderErrorBar('📖 Reading Mistakes', errRead, readPct, '#fbbf24')}
          ${renderErrorBar('⏳ Guessing/Time Press', errTime, timePct, '#60a5fa')}
          ${renderErrorBar('⭕ Bubble Filling Slips', errOmr, omrPct, '#a78bfa')}
        </div>
      `;
    }
  }
}

function renderErrorBar(label, count, pct, color) {
  if (count === 0) return '';
  return `
    <div>
      <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted); margin-bottom:2px;">
        <span>${label} (${count})</span>
        <span style="font-weight:700; color:var(--text-secondary);">${pct}%</span>
      </div>
      <div style="width:100%; height:5px; border-radius:2.5px; background:rgba(255,255,255,0.02); overflow:hidden;">
        <div style="width:${pct}%; height:100%; background:${color};"></div>
      </div>
    </div>
  `;
}

window.saveMockTest = saveMockTest;
window.deleteMockTest = deleteMockTest;
window.renderMockTestsDashboard = renderMockTestsDashboard;
window.setDefaultMockDate = setDefaultMockDate;
