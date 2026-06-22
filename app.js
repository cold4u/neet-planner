
  function handleLogin() {
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    const errorEl = document.getElementById('login-error');
    
    if (!user) {
      errorEl.textContent = 'Please enter a username!';
      errorEl.style.display = 'block';
      return;
    }
    
    if (user !== 'Meowww') {
      errorEl.textContent = 'Incorrect username!';
      errorEl.style.display = 'block';
      return;
    }
    if (pass === 'SHUBxCOLD') {
      sessionStorage.setItem('neet_logged_in', 'true');
      document.getElementById('login-overlay').style.display = 'none';
    } else {
      errorEl.textContent = 'Incorrect password!';
      errorEl.style.display = 'block';
    }
  }

  // Check login state on load (temporarily bypassed for 24 hours)
  document.addEventListener('DOMContentLoaded', function() {
    const bypassUntil = new Date("2026-06-23T10:25:10+05:30");
    const isBypassActive = new Date() < bypassUntil;
    
    if (isBypassActive || sessionStorage.getItem('neet_logged_in') === 'true') {
      document.getElementById('login-overlay').style.display = 'none';
    }
  });



    // Chapter Lists
    const P1_PHY = [
  {ch:'Units & Measurement',task:'Dimensions,SI units,errors. 30 MCQs.',wt:'m'},
  {ch:'Kinematics 1D',task:'Graphs, equations of motion. 40 MCQs.',wt:'h'},
  {ch:'Kinematics 2D / Projectile',task:'Projectile, relative motion. 40 MCQs.',wt:'h'},
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
  {ch:'Experimental Skills',task:'Vernier, screw gauge, experiments. 20 MCQs.',wt:'l',miss:true},
];
    const P1_CHE = [
  {ch:'Basic Concepts',task:'Mole concept, stoichiometry. 30 MCQs.',wt:'h'},
  {ch:'Atomic Structure',task:'Bohr model, quantum numbers, orbitals. 50 MCQs.',wt:'h'},
  {ch:'Periodic Table',task:'IE, EA, electronegativity trends. 40 MCQs.',wt:'h'},
  {ch:'Chemical Bonding',task:'VSEPR, hybridisation, MO theory. 50 MCQs.',wt:'h'},
  {ch:'States of Matter',task:'Gas laws, van der Waals. 30 MCQs.',wt:'m'},
  {ch:'Thermodynamics (Chem)',task:'Hess law, entropy, Gibbs. 40 MCQs.',wt:'h'},
  {ch:'Equilibrium',task:'Kp, Kc, Le Chatelier, buffer. 50 MCQs.',wt:'h'},
  {ch:'Redox Reactions',task:'Oxidation numbers, balancing. 30 MCQs.',wt:'m'},
  {ch:'Hydrogen',task:'Properties, compounds, isotopes. 20 MCQs.',wt:'l',miss:true},
  {ch:'s-Block Elements',task:'Alkali & alkaline earth, anomalies. 30 MCQs.',wt:'m',miss:true},
  {ch:'p-Block (Gr 13-14)',task:'B, Al, C, Si chemistry. 30 MCQs.',wt:'m'},
  {ch:'Organic Basics',task:'IUPAC, isomerism, intermediates. 50 MCQs.',wt:'h'},
  {ch:'Hydrocarbons',task:'Alkane/alkene/alkyne reactions. 50 MCQs.',wt:'h'},
  {ch:'Environmental Chemistry',task:'Pollution, ozone, green chem. 20 MCQs.',wt:'l',miss:true},
  {ch:'Practical Chemistry',task:'Lab techniques, titrations. 20 MCQs.',wt:'l',miss:true},
];
    const P1_BIO = [
  {ch:'The Living World',task:'Taxonomy, NCERT line-by-line. 30 MCQs.',wt:'m'},
  {ch:'Biological Classification',task:'5 kingdoms, examples. 40 MCQs.',wt:'h'},
  {ch:'Plant Kingdom',task:'Alternation of generations. 40 MCQs.',wt:'h'},
  {ch:'Animal Kingdom',task:'All phyla, examples. 50 MCQs.',wt:'h'},
  {ch:'Morphology of Plants',task:'Root, stem, leaf, flower types. 40 MCQs.',wt:'h'},
  {ch:'Anatomy of Plants',task:'Tissues, meristems. 30 MCQs.',wt:'m'},
  {ch:'Structural Org Animals',task:'Tissues, earthworm, cockroach. 40 MCQs.',wt:'h',miss:true},
  {ch:'Cell: Unit of Life',task:'Cell organelles, diagrams. 50 MCQs.',wt:'h'},
  {ch:'Biomolecules',task:'Enzyme names, carbohydrates, vitamins. 50 MCQs.',wt:'h'},
  {ch:'Cell Cycle & Division',task:'Mitosis/meiosis stages diagrams. 50 MCQs.',wt:'h'},
  {ch:'Transport in Plants',task:'Osmosis, translocation, transpiration. 30 MCQs.',wt:'m'},
  {ch:'Mineral Nutrition',task:'Essential elements, deficiencies. 30 MCQs.',wt:'m'},
  {ch:'Photosynthesis',task:'Z-scheme, Calvin cycle — must diagram. 50 MCQs.',wt:'h'},
  {ch:'Respiration in Plants',task:'Glycolysis, Krebs, ETC. 40 MCQs.',wt:'h'},
  {ch:'Plant Growth & Dev',task:'Phytohormones, photoperiodism. 30 MCQs.',wt:'m',miss:true},
  {ch:'Digestion & Absorption',task:'Enzymes, GI tract. 40 MCQs.',wt:'h'},
  {ch:'Breathing & Gas Exchange',task:'Lung volumes, breathing mechanics. 40 MCQs.',wt:'h'},
  {ch:'Body Fluids & Circulation',task:'Heart anatomy, ECG, blood groups. 50 MCQs.',wt:'h'},
  {ch:'Excretion',task:'Nephron, osmoregulation, dialysis. 40 MCQs.',wt:'h'},
  {ch:'Locomotion & Movement',task:'Joint types, muscles, disorders. 30 MCQs.',wt:'m'},
  {ch:'Neural Control',task:'Neuron, AP, brain parts, reflexes. 50 MCQs.',wt:'h'},
  {ch:'Chemical Coordination',task:'All hormones, glands, disorders. 50 MCQs.',wt:'h',miss:true},
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
  {ch:'Communication Systems',task:'Modulation, bandwidth, satellites. 20 MCQs.',wt:'l'},
];
    const P2_CHE = [
  {ch:'Solid State',task:'Crystal systems, defects, packing. 30 MCQs.',wt:'m'},
  {ch:'Solutions',task:'Colligative properties, osmosis. 40 MCQs.',wt:'h',conn:true},
  {ch:'Electrochemistry',task:'Nernst, EMF, corrosion, electrolysis. 50 MCQs.',wt:'h',conn:true},
  {ch:'Chemical Kinetics',task:'Rate law, order, Arrhenius, mechanisms. 50 MCQs.',wt:'h',conn:true},
  {ch:'Surface Chemistry',task:'Adsorption, colloids, emulsions. 30 MCQs.',wt:'m'},
  {ch:'Metallurgy',task:'Ore extraction, refining, alloys. 20 MCQs.',wt:'l',miss:true},
  {ch:'p-Block (Gr 15-18)',task:'Group 15/16/17/18 reactions. 50 MCQs.',wt:'h',conn:true},
  {ch:'d & f Block',task:'Transition metals, lanthanoids, oxidation states. 40 MCQs.',wt:'m'},
  {ch:'Coordination Compounds',task:'Werner, isomerism, CFSE, naming. 50 MCQs.',wt:'h',conn:true},
  {ch:'Haloalkanes',task:'SN1, SN2, E1, E2 mechanisms. 50 MCQs.',wt:'h',conn:true},
  {ch:'Alcohols, Phenols',task:'Acidity order, Lucas test, reactions. 40 MCQs.',wt:'h',conn:true},
  {ch:'Aldehydes & Ketones',task:'Nucleophilic add, Aldol, Cannizzaro. 50 MCQs.',wt:'h',conn:true},
  {ch:'Carboxylic Acids',task:'Acidity, reactions, derivatives. 30 MCQs.',wt:'m',conn:true},
  {ch:'Amines',task:'Basicity order, diazonium reactions. 40 MCQs.',wt:'h',conn:true},
  {ch:'Biomolecules (12)',task:'Carbohydrates, amino acids, nucleic acids. 30 MCQs.',wt:'m',conn:true},
  {ch:'Polymers',task:'Natural vs synthetic, addition vs condensation. 20 MCQs.',wt:'l'},
  {ch:'Chemistry in Daily Life',task:'Drugs, food additives, detergents. 20 MCQs.',wt:'l'},
];
    const P2_BIO = [
  {ch:'Reproduction: Organisms',task:'Asexual methods, vegetative propagation. 30 MCQs.',wt:'m',conn:true},
  {ch:'Sexual Repro in Plants',task:'Double fertilisation, embryo, endosperm. 50 MCQs.',wt:'h',conn:true},
  {ch:'Human Reproduction',task:'Spermatogenesis, oogenesis, diagrams. 50 MCQs.',wt:'h',conn:true},
  {ch:'Reproductive Health',task:'Contraceptives, STDs, MTP. 30 MCQs.',wt:'m'},
  {ch:'Principles of Inheritance',task:'Mendel, blood groups, linkage, exceptions. 50 MCQs.',wt:'h',conn:true},
  {ch:'Molecular Basis',task:'DNA replication, transcription, translation — 8-10 Qs. 50 MCQs.',wt:'h',conn:true},
  {ch:'Evolution',task:'Hardy-Weinberg, Darwin, human evolution. 40 MCQs.',wt:'m',conn:true},
  {ch:'Human Health & Disease',task:'Pathogens, immunity, cancer, drugs. 50 MCQs.',wt:'h',conn:true},
  {ch:'Food Production',task:'Animal husbandry, plant breeding, biofortification. 30 MCQs.',wt:'m'},
  {ch:'Microbes in Welfare',task:'Biogas, sewage, antibiotics. 30 MCQs.',wt:'m'},
  {ch:'Biotech: Principles',task:'rDNA, restriction enzymes, PCR, vectors. 50 MCQs.',wt:'h',conn:true},
  {ch:'Biotech: Applications',task:'Bt cotton, gene therapy, GMO, ELISA. 40 MCQs.',wt:'h'},
  {ch:'Organisms & Populations',task:'Interspecific, intraspecific, logistic, age pyramid. 40 MCQs.',wt:'m',conn:true},
  {ch:'Ecosystem',task:'Productivity, energy flow, succession, nutrient cycles. 40 MCQs.',wt:'m'},
  {ch:'Biodiversity',task:'Types of diversity, hotspots, conservation. 30 MCQs.',wt:'m'},
  {ch:'Environmental Issues',task:'Pollution types, ozone, global warming, BOD. 30 MCQs.',wt:'m'},
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
  'Solutions':'← States of Matter (Ch11)',
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
  'Reproduction: Organisms':'← Cell Division (Ch11)',
  'Sexual Repro in Plants':'← Plant Morphology (Ch11)',
  'Human Reproduction':'← Struct Org Animals (Ch11)',
  'Principles of Inheritance':'← Cell Cycle (Ch11)',
  'Molecular Basis':'← Biomolecules (Ch11)',
  'Evolution':'← Living World / Classification (Ch11)',
  'Human Health & Disease':'← Digestion/Circulation (Ch11)',
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
    ['Structural Org Animals','11','Day 53–56','h','→ Human Reproduction Ch12','Earthworm,cockroach,frog anatomy ✦Added',],
    ['Transport in Plants','11','Day 57–59','m','—','Osmosis, ascent of sap, translocation',],
    ['Mineral Nutrition','11','Day 60–62','m','—','Essential elements, deficiency symptoms',],
    ['Plant Growth & Dev','11','Day 63–65','m','→ Reproduction Ch12','Phytohormones, photoperiodism ✦Added',],
    ['Digestion & Absorption','11','Day 66–69','h','→ Human Health Ch12','Enzymes, accessory glands, absorption',],
    ['Breathing & Gas Exchange','11','Day 70–72','h','→ Human Health Ch12','Lung volumes, breathing mechanics',],
    ['Body Fluids & Circulation','11','Day 73–76','h','→ Human Repro Ch12','ECG, heart anatomy, blood groups',],
    ['Excretion','11','Day 77–79','h','—','Nephron diagram, osmoregulation',],
    ['Locomotion & Movement','11','Day 80–82','m','—','Joint types, muscle anatomy, disorders',],
    ['Neural Control','11','Day 83–86','h','→ Chemical Coord Ch11','Neuron diagram, AP, brain parts',],
    ['Chemical Coordination','11','Day 87–90','h','→ Human Health Ch12','All hormones + glands + disorders ✦Added',],
    ['Living World','11','Day 1–3','m','→ Evolution Ch12','Taxonomy, ICZN, ICBN rules',],
    ['Biological Classification','11','Day 4–6','h','→ Evolution Ch12','5 kingdoms + examples',],
    ['Plant Kingdom','11','Day 7–9','m','—','Alt. of generations, rep methods',],
    ['Reproduction: Organisms','12','Day 95–97','m','← Cell Division Ch11','Asexual methods, vegetative propagation',],
    ['Sexual Repro in Plants','12','Day 98–102','h','← Plant Morphology Ch11','Double fert, embryo, endosperm — 6–8Qs',],
    ['Human Reproduction','12','Day 103–108','h','← Struct Org Animals Ch11','Spermatogenesis, oogenesis, placenta',],
    ['Reproductive Health','12','Day 109–111','m','—','Contraceptives, STDs, MTP',],
    ['Principles of Inheritance','12','Day 112–120','h','← Cell Cycle Ch11','Mendel laws, blood groups, linkage, exceptions',],
    ['Molecular Basis','12','Day 121–130','h','← Biomolecules Ch11','DNA replication, transcription, translation — 8–10Qs',],
    ['Evolution','12','Day 131–136','m','← Living World/Class Ch11','Hardy-Weinberg, Darwin, human evolution',],
    ['Human Health & Disease','12','Day 137–143','h','← Digestion/Circ Ch11','Pathogens, immunity, cancer, drugs — 8Qs',],
    ['Food Production','12','Day 144–147','m','—','Animal husbandry, plant breeding, biofortification',],
    ['Microbes in Welfare','12','Day 148–151','m','—','Biogas, sewage treatment, antibiotics',],
    ['Biotech: Principles','12','Day 152–157','h','← Molecular Basis Ch11','rDNA, restriction enzymes, PCR, vectors',],
    ['Biotech: Applications','12','Day 158–162','h','—','Bt cotton, gene therapy, GMO, ELISA',],
    ['Organisms & Populations','12','Day 163–167','m','← Animal Kingdom Ch11','Population interactions, logistic growth',],
    ['Ecosystem','12','Day 168–172','m','—','Energy flow, succession, nutrient cycles',],
    ['Biodiversity','12','Day 173–176','m','—','Types, hotspots, conservation strategies',],
    ['Environmental Issues','12','Day 177–180','m','—','Pollution types, ozone, BOD, global warming',],
  ],
  chem:[
    ['Basic Concepts','11','Day 1–2','h','—','Mole, stoichiometry, limiting reagent',],
    ['Atomic Structure','11','Day 5–9','h','→ Dual Nature Ch12','Bohr model, quantum numbers, orbitals',],
    ['Periodic Table','11','Day 10–14','h','—','IE, EA, electronegativity trends',],
    ['Chemical Bonding','11','Day 15–20','h','→ Coordination Cpds Ch12','VSEPR, hybridisation, MO theory',],
    ['States of Matter','11','Day 21–24','m','→ Solutions Ch12','Gas laws, van der Waals equation',],
    ['Thermodynamics (Chem)','11','Day 25–29','h','→ Chemical Kinetics Ch12','Hess law, entropy, Gibbs energy',],
    ['Equilibrium','11','Day 30–35','h','→ Electrochemistry Ch12','Kp, Kc, Le Chatelier, buffer solutions',],
    ['Redox Reactions','11','Day 36–38','m','→ Electrochemistry Ch12','Oxidation numbers, balancing methods',],
    ['Hydrogen','11','Day 39–40','l','—','Isotopes, H₂O₂, hydrides ✦Added',],
    ['s-Block Elements','11','Day 41–43','m','—','Alkali & alkaline earth metals, anomalies ✦Added',],
    ['p-Block (Gr 13–14)','11','Day 44–46','m','→ p-Block Gr15-18 Ch12','B, Al, C, Si chemistry',],
    ['Organic Basics','11','Day 47–52','h','→ All Organic Ch12','IUPAC, isomerism, intermediates, inductive/resonance',],
    ['Hydrocarbons','11','Day 53–58','h','→ Haloalkanes Ch12','Alkane, alkene, alkyne reactions + arenes',],
    ['Environmental Chemistry','11','Day 59–60','l','—','Pollution types, green chemistry ✦Added',],
    ['Practical Chemistry','11','Day 61–62','l','—','Lab techniques, titrations, qualitative analysis ✦Added',],
    ['Solid State','12','Day 91–94','m','—','Crystal systems, defects, packing efficiency',],
    ['Solutions','12','Day 95–99','h','← States of Matter Ch11','Colligative properties, osmosis, vant Hoff',],
    ['Electrochemistry','12','Day 100–105','h','← Redox Ch11','Nernst, EMF, SHE, corrosion, electrolysis',],
    ['Chemical Kinetics','12','Day 106–110','h','← Equilibrium Ch11','Rate law, order, Arrhenius, integrated rate',],
    ['Surface Chemistry','12','Day 111–113','m','—','Adsorption, colloids, emulsions, catalysis',],
    ['Metallurgy','12','Day 114–115','l','—','Ore extraction, refining, alloys ✦Added',],
    ['p-Block (Gr 15–18)','12','Day 116–122','h','← p-Block Gr13-14 Ch11','Groups 15/16/17/18 reactions — 5–6Qs',],
    ['d & f Block','12','Day 123–127','m','—','Transition metals, lanthanoids, oxidation states',],
    ['Coordination Compounds','12','Day 128–133','h','← Chemical Bonding Ch11','Werner theory, isomerism, CFSE, naming — 4–5Qs',],
    ['Haloalkanes','12','Day 134–139','h','← Hydrocarbons Ch11','SN1, SN2, E1, E2 mechanisms',],
    ['Alcohols, Phenols','12','Day 140–144','h','← Organic Basics Ch11','Acidity order, Lucas test, oxidation reactions',],
    ['Aldehydes & Ketones','12','Day 145–150','h','← Organic Basics Ch11','Nucleophilic addition, Aldol, Cannizzaro',],
    ['Carboxylic Acids','12','Day 151–154','m','← Organic Basics Ch11','Acidity, Fischer esterification, amide',],
    ['Amines','12','Day 155–158','h','← Organic Basics Ch11','Basicity order, diazonium coupling — 3–4Qs',],
    ['Biomolecules (12)','12','Day 159–162','m','← Biomolecules Bio Ch11','Carbohydrates, amino acids, nucleic acids, enzymes',],
    ['Polymers','12','Day 163–165','l','—','Natural vs synthetic, addition vs condensation',],
    ['Chemistry in Daily Life','12','Day 166–168','l','—','Drugs, food additives, detergents, soaps',],
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
    ['Experimental Skills','11','Day 56–57','l','—','Vernier, screw gauge, experiments ✦Added',],
    ['Electrostatics','12','Day 92–98','h','← Laws of Motion Ch11','Coulomb, Gauss law, potential, capacitors — 5–7Qs',],
    ['Current Electricity','12','Day 99–105','h','← Units/Meas Ch11','Ohm, Kirchhoff, Wheatstone, potentiometer',],
    ['Magnetic Effects','12','Day 106–110','h','← Laws of Motion Ch11','Biot-Savart, Ampere, force on charge/wire',],
    ['Magnetism & Matter','12','Day 111–113','m','—','Magnetic moment, dia/para/ferro',],
    ['EMI & AC Circuits','12','Day 114–120','h','← Oscillations Ch11','Faraday, Lenz, LC circuit, resonance, transformer',],
    ['EM Waves','12','Day 121–122','l','—','Types, spectrum, properties',],
    ['Ray Optics','12','Day 123–129','h','← Waves Ch11','Mirrors, lenses, prism, TIR, optical instruments',],
    ['Wave Optics','12','Day 130–134','m','← Oscillations Ch11','YDSE, diffraction, polarisation',],
    ['Dual Nature','12','Day 135–139','h','← Kinetic Theory Ch11','Photoelectric, de Broglie, Davisson-Germer',],
    ['Atoms & Nuclei','12','Day 140–146','h','← Atomic Struct Chem Ch11','Bohr model, radioactivity, half life, Q value',],
    ['Semiconductors','12','Day 147–153','m','—','Diode, transistor, logic gates, rectifier',],
    ['Communication Systems','12','Day 154–156','l','—','Modulation, bandwidth, propagation, satellites',],
  ],
};
    const SCHEDS = {
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
    {t:'2:50 PM',a:'PYQ Practice: 50 questions from NEET 2010–2024 (mixed)',d:'50 min',cat:'test'},
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
    
    // PYQ Bank
    let PYQ_BANK = {};
    
    // Real Yearly Papers (exact questions with diagrams)
    let REAL_YEARLY_PAPERS = {};

    // Asynchronously fetch databases for faster page load
    Promise.all([
      fetch('pyq_bank.json').then(res => {
        if (!res.ok) throw new Error('Failed to load pyq_bank.json');
        return res.json();
      }),
      fetch('real_yearly_papers.json').then(res => {
        if (!res.ok) throw new Error('Failed to load real_yearly_papers.json');
        return res.json();
      })
    ]).then(([pyqData, yearlyData]) => {
      PYQ_BANK = pyqData;
      REAL_YEARLY_PAPERS = yearlyData;
      console.log('Successfully loaded PYQ and Yearly Papers database.');
      // Re-render components once data is available
      if (typeof renderCal === 'function') renderCal();
      if (typeof renderPapersPicker === 'function') renderPapersPicker();
    }).catch(err => {
      console.error('Error loading database JSON files:', err);
    });
    
    // Quick subject lookup sets
    window.PHYS_CHAPS_SET = new Set(P1_PHY.concat(P2_PHY).map(c => c.ch.toLowerCase().replace(/[^a-z0-9]/g, '')));
    window.CHEM_CHAPS_SET = new Set(P1_CHE.concat(P2_CHE).map(c => c.ch.toLowerCase().replace(/[^a-z0-9]/g, '')));
    
    // 318-Day Plan Engine
    const START_DATE = new Date(2026, 5, 19); // 19th June 2026
    const EXAM_DATE = new Date(2027, 4, 3); // 3rd May 2027
    const DIFF = Math.ceil((EXAM_DATE - START_DATE) / (1000 * 60 * 60 * 24)) + 1; // 319 days
    
    function buildPlan() {
      const plan = [];
      
      const ALL_BIO = P1_BIO.concat(P2_BIO);
      const ALL_CHE = P1_CHE.concat(P2_CHE);
      const ALL_PHY = P1_PHY.concat(P2_PHY);
      
      let p1_bio_idx = 0;
      let p1_che_idx = 0;
      let p1_phy_idx = 0;
      
      let p2_bio_idx = 0;
      let p2_che_idx = 0;
      let p2_phy_idx = 0;
      
      let p3_bio_idx = 0;
      let p3_che_idx = 0;
      let p3_phy_idx = 0;
      
      for (let d = 0; d < DIFF; d++) {
        const currentDate = new Date(START_DATE);
        currentDate.setDate(START_DATE.getDate() + d);
        const dayNum = d + 1;
        
        // Date formatting: "20 Jun" or similar
        const dateStr = currentDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const isSunday = (dayOfWeek === 0);
        
        let phase = 0;
        let type = 'study';
        let phy = '', che = '', bio = '';
        let phyNote = '', cheNote = '', bioNote = '';
        
        if (dayNum <= 15) {
          phase = 0;
          if (isSunday) {
            type = 'rest';
            phy = '🟢 Foundation Review';
            che = '🟢 Concept mapping';
            bio = '🟢 Motivation & planning';
            phyNote = cheNote = bioNote = 'Rest, plan your next phase, check NCERTs';
          } else {
            type = 'study';
            const f_phy = ['Math for Physics (Calculus intro)', 'Math for Physics (Trig & Vectors)', 'Units & Dimensions intro'];
            const f_che = ['Mole Concept basics', 'Basic chemical calculations', 'Introduction to Periodic Table'];
            const f_bio = ['How to read NCERT line-by-line', 'Introduction to Cell biology', 'Living World overview'];
            
            phy = f_phy[d % f_phy.length];
            che = f_che[d % f_che.length];
            bio = f_bio[d % f_bio.length];
            phyNote = 'Focus on understanding formulas, not just memorizing';
            cheNote = 'Practice mole conversions';
            bioNote = 'Learn the art of highlighting NCERT';
          }
        } else if (dayNum <= 120) {
          phase = 1;
          if (isSunday) {
            type = 'test';
            const wk = Math.ceil(dayNum / 7);
            phy = `📝 Week ${wk} Test — Physics Class 11 (Topics this week)`;
            che = `📝 Week ${wk} Test — Chemistry Class 11 (Topics this week)`;
            bio = `📝 Week ${wk} Test — Biology Class 11 (Topics this week)`;
            phyNote = cheNote = bioNote = 'Sunday: Test + Error Analysis + Rest';
          } else {
            type = 'study';
            if (dayOfWeek === 1 || dayOfWeek === 4) { // Bio focus
              const ch_obj = P1_BIO[p1_bio_idx % P1_BIO.length];
              bio = ch_obj ? ch_obj.ch : '📖 Bio Revision';
              bioNote = ch_obj ? ch_obj.task : 'Revise Class 11 Biology';
              p1_bio_idx++;
              
              phy = '📖 Physics practice';
              phyNote = 'Solve 15-20 MCQs of previous chapter';
              che = '📖 Chemistry practice';
              cheNote = 'Solve 15-20 MCQs of previous chapter';
            } else if (dayOfWeek === 2 || dayOfWeek === 5) { // Chem focus
              const ch_obj = P1_CHE[p1_che_idx % P1_CHE.length];
              che = ch_obj ? ch_obj.ch : '📖 Chem Revision';
              cheNote = ch_obj ? ch_obj.task : 'Revise Class 11 Chemistry';
              p1_che_idx++;
              
              phy = '📖 Physics practice';
              phyNote = 'Solve 15-20 MCQs of previous chapter';
              bio = '📖 Biology revision';
              bioNote = "Active recall of yesterday's Bio topic";
            } else { // Physics focus
              const ch_obj = P1_PHY[p1_phy_idx % P1_PHY.length];
              phy = ch_obj ? ch_obj.ch : '📖 Phy Revision';
              phyNote = ch_obj ? ch_obj.task : 'Revise Class 11 Physics';
              p1_phy_idx++;
              
              che = '📖 Chemistry practice';
              cheNote = 'Solve 15-20 MCQs of previous chapter';
              bio = '📖 Biology revision';
              bioNote = "Active recall of yesterday's Bio topic";
            }
          }
        } else if (dayNum <= 220) {
          phase = 2;
          if (isSunday) {
            type = 'test';
            const wk = Math.ceil(dayNum / 7);
            phy = `📝 Week ${wk} Test — Physics Class 12 + Links`;
            che = `📝 Week ${wk} Test — Chemistry Class 12 + Links`;
            bio = `📝 Week ${wk} Test — Biology Class 12 + Links`;
            phyNote = cheNote = bioNote = 'Sunday: Test + Link Analysis + Rest';
          } else {
            type = 'study';
            if (dayOfWeek === 1 || dayOfWeek === 4) { // Bio focus
              const ch_obj = P2_BIO[p2_bio_idx % P2_BIO.length];
              bio = ch_obj ? ch_obj.ch : '📖 Bio Revision';
              bioNote = ch_obj ? ch_obj.task : 'Revise Class 12 Biology';
              p2_bio_idx++;
              
              phy = '📖 Physics linking practice';
              phyNote = 'Solve MCQs linking Class 11 and Class 12';
              che = '📖 Chemistry linking practice';
              cheNote = 'Solve MCQs linking Class 11 and Class 12';
            } else if (dayOfWeek === 2 || dayOfWeek === 5) { // Chem focus
              const ch_obj = P2_CHE[p2_che_idx % P2_CHE.length];
              che = ch_obj ? ch_obj.ch : '📖 Chem Revision';
              cheNote = ch_obj ? ch_obj.task : 'Revise Class 12 Chemistry';
              p2_che_idx++;
              
              phy = '📖 Physics linking practice';
              phyNote = 'Solve MCQs linking Class 11 and Class 12';
              bio = '📖 Biology linking practice';
              bioNote = "Active recall of yesterday's Bio topic";
            } else { // Physics focus
              const ch_obj = P2_PHY[p2_phy_idx % P2_PHY.length];
              phy = ch_obj ? ch_obj.ch : '📖 Phy Revision';
              phyNote = ch_obj ? ch_obj.task : 'Revise Class 12 Physics';
              p2_phy_idx++;
              
              che = '📖 Chemistry linking practice';
              cheNote = 'Solve MCQs linking Class 11 and Class 12';
              bio = '📖 Biology linking practice';
              bioNote = "Active recall of yesterday's Bio topic";
            }
          }
        } else if (dayNum <= 280) {
          phase = 3;
          if (isSunday) {
            type = 'mock';
            phy = '🔴 FULL MOCK TEST (200 Qs · 3h 20min)';
            che = '📊 Post-mock: Deep Chemistry error analysis';
            bio = '📊 Post-mock: Deep Biology error analysis';
            phyNote = cheNote = bioNote = 'Simulate real exam timing (2:00 PM - 5:20 PM)';
          } else {
            type = 'revision';
            const b_ch = ALL_BIO[p3_bio_idx % ALL_BIO.length];
            bio = `REV: ${b_ch.ch}`;
            bioNote = '30 MCQs timed + NCERT check';
            p3_bio_idx++;
            
            const c_ch = ALL_CHE[p3_che_idx % ALL_CHE.length];
            che = `REV: ${c_ch.ch}`;
            cheNote = '20 MCQs timed + Reaction check';
            p3_che_idx++;
            
            const p_ch = ALL_PHY[p3_phy_idx % ALL_PHY.length];
            phy = `REV: ${p_ch.ch}`;
            phyNote = '20 MCQs timed + Formula check';
            p3_phy_idx++;
          }
        } else {
          phase = 4;
          const mockNum = dayNum - 280;
          if (dayNum >= 315) {
            type = 'rest';
            phy = '🟢 Physics formula overview';
            che = '🟢 Chemistry reaction overview';
            bio = '🟢 NCERT Biology light reading';
            phyNote = cheNote = bioNote = 'Relax, stay positive, light reading only';
          } else if (isSunday) {
            type = 'rest';
            phy = '🟢 Weekly Rest & Reset';
            che = '🟢 Weekly Rest & Reset';
            bio = '🟢 Weekly Rest & Reset';
            phyNote = cheNote = bioNote = 'Sunday: Final relaxation before exam';
          } else {
            type = 'mock';
            phy = `🔴 Full Mock #${mockNum} — Physics Analysis`;
            che = `🔴 Full Mock #${mockNum} — Chemistry Analysis`;
            bio = `🔴 Full Mock #${mockNum} — Biology Analysis`;
            phyNote = cheNote = bioNote = 'Morning mock (3h 20m) + Afternoon analysis';
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
      done = JSON.parse(localStorage.getItem('neet_v3_done') || '{}');
    } catch(e){}
    
    let trackerLogs = [];
    try {
      trackerLogs = JSON.parse(localStorage.getItem('neet_v3_tracker') || '[]');
    } catch(e){}
    
    let chapterProgress = {};
    try {
      chapterProgress = JSON.parse(localStorage.getItem('neet_v3_chapter_progress') || '{}');
    } catch(e){}
    
    // Pagination & Filters
    const PER_PAGE = 35;
    let calPage = 0;
    
    function saveDone() {
      try {
        localStorage.setItem('neet_v3_done', JSON.stringify(done));
      } catch(e){}
    }
    
    function toggleDone(dayNum) {
      done[dayNum] = !done[dayNum];
      saveDone();
      renderCal();
      updateOverviewStats();
    }
    
    // Load week options in select
    const wkSel = document.getElementById('wkf');
    if (wkSel) {
      const totalWeeks = Math.ceil(PLAN.length / 7);
      for (let w = 1; w <= totalWeeks; w++) {
        const o = document.createElement('option');
        o.value = w;
        o.textContent = `Week ${w}`;
        wkSel.appendChild(o);
      }
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
      
      function cellHtml(text, note) {
        if (!text) return '<span style="color:var(--text-muted);">—</span>';
        const isRev = text.startsWith('REV: ');
        const ch = isRev ? text.slice(5) : text;
        const isSp = text.startsWith('📝') || text.startsWith('🔴') || text.startsWith('📜') || text.startsWith('🟢') || text.startsWith('🧪');
        
        let pyqBtn = '';
        // If it's a chapter name, add a button to open its PYQ modal
        if (!isSp && ch && PYQ_BANK[ch.trim()]) {
          pyqBtn = `<br><button class="btn btn-secondary" style="font-size:10px; padding:2px 6px; margin-top:6px;" onclick="openPyqModal('${ch.trim().replace(/'/g, "\'")}')">📝 PYQs</button>`;
        }
        
        const wtLabel = !isSp ? getChapterWeight(ch) : '';
        
        return `<div class="ch-cell">
          ${isRev ? '<span style="font-size:9.5px; background:var(--primary-glow); color:var(--primary); padding:1px 4px; border-radius:3px; display:inline-block; margin-bottom:2px; font-weight:700;">REV</span><br>' : ''}
          <span class="ch-main">${ch}</span>${wtLabel}
          ${note ? `<div class="ch-sub">${note}</div>` : ''}
          ${pyqBtn}
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
          <td>${cellHtml(r.phy, r.phyNote)}</td>
          <td>${cellHtml(r.che, r.cheNote)}</td>
          <td>${cellHtml(r.bio, r.bioNote)}</td>
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
      renderCal();
    }
    
    // Tab switching
    function showTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.drawer-item').forEach(el => el.classList.remove('active'));
      
      const activeTabEl = document.getElementById(tabId);
      if (activeTabEl) activeTabEl.classList.add('active');
      
      const sidebarBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
      if (sidebarBtn) sidebarBtn.classList.add('active');
      
      const drawerItem = document.querySelector(`.drawer-item[data-tab="${tabId}"]`);
      if (drawerItem) drawerItem.classList.add('active');
      
      if (tabId === 'calendar') {
        renderCal();
      } else if (tabId === 'timing') {
        showSched('p1', document.querySelector('.sched-btn'));
      } else if (tabId === 'chapters') {
        renderChapters();
      } else if (tabId === 'papers') {
        renderPapersPicker();
      } else if (tabId === 'tests') {
        renderTestList();
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
    function showSched(key, btn) {
      document.querySelectorAll('.sched-btn').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
      
      const data = SCHEDS[key];
      if (!data) return;
      
      const colors = { 'bio': '#a78bfa', 'che': '#34d399', 'phy': '#60a5fa', 'test': '#ff6b6b', 'rev': '#00d4aa', 'break': '#64748b' };
      
      let html = '<table class="sched-table"><thead><tr><th style="width:4px; padding:0;"></th><th>Time</th><th>Activity</th><th>Duration</th></tr></thead><tbody>';
      data.forEach(r => {
        const clr = colors[r.cat] || '#e2e8f0';
        html += `<tr>
          <td style="background:${clr}; padding:0;"></td>
          <td style="font-weight:600; width:100px;">${r.t}</td>
          <td>${r.a}</td>
          <td style="color:var(--text-muted); width:90px;">${r.d}</td>
        </tr>`;
      });
      html += '</tbody></table>';
      document.getElementById('sched-out').innerHTML = html;
    }
    
    // Chapter List Progress Table
    function renderChapters() {
      const q = document.getElementById('chap-srch').value.toLowerCase();
      const sub = document.getElementById('chap-subf').value;
      
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
          if (c.sub === 'Chemistry') subClr = 'var(--che)';
          if (c.sub === 'Biology') subClr = 'var(--bio)';
          
          let wtBadge = '<span class="type-badge" style="background:rgba(255,255,255,0.03); color:var(--text-muted);">L</span>';
          if (c.wt === 'h') wtBadge = '<span class="type-badge" style="background:rgba(255,107,107,0.1); color:var(--tertiary);">High</span>';
          if (c.wt === 'm') wtBadge = '<span class="type-badge" style="background:rgba(0,212,170,0.1); color:var(--primary);">Med</span>';
          
          const connTip = CONNS[chName] ? `<div style="font-size:10px; color:var(--text-muted); margin-top:2px;">${CONNS[chName]}</div>` : '';
          
          html += `<tr>
            <td style="color:${subClr}; font-weight:700;">${c.sub}</td>
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
              <button class="btn btn-secondary" style="padding:6px 12px; font-size:11px;" onclick="openPyqModal('${chName.replace(/'/g, "\'")}')">📖 Solve PYQs</button>
            </td>
          </tr>`;
        });
        return html;
      }
      
      const filtered11 = list11.filter(c => !q || c.ch.toLowerCase().includes(q));
      const filtered12 = list12.filter(c => !q || c.ch.toLowerCase().includes(q));
      
      document.getElementById('chaps-body-11').innerHTML = makeRows(filtered11);
      document.getElementById('chaps-body-12').innerHTML = makeRows(filtered12);
    }
    
    function toggleChapterStep(chName, step) {
      if (!chapterProgress[chName]) {
        chapterProgress[chName] = { understand: false, practice: false, revise: false };
      }
      chapterProgress[chName][step] = !chapterProgress[chName][step];
      localStorage.setItem('neet_v3_chapter_progress', JSON.stringify(chapterProgress));
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
          diagHtml = `<div class="pyq-diagram" style="margin:16px 0; text-align:center;">${q.diagram}</div>`;
        } else {
          const pDiag = getProceduralDiagram(chName, q.q, qIdx);
          diagHtml = `<div class="pyq-diagram" style="margin:16px 0; text-align:center;">${pDiag}</div>`;
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
      }
    });
    
    // Tests & Mocks list
    function renderTestList() {
      const tests = PLAN.filter(r => r.type === 'test' || r.type === 'mock');
      let html = '';
      if (tests.length === 0) {
        html = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No tests scheduled.</td></tr>';
      } else {
        tests.forEach(r => {
          const isDone = !!done[r.day];
          const testDesc = `
            <div style="font-weight:600; font-size:13.5px;">${r.phy}</div>
            <div style="font-size:11.5px; color:var(--text-muted); margin-top:4px;">${r.che} &middot; ${r.bio}</div>
          `;
          html += `<tr class="${isDone ? 'done-row' : ''}">
            <td style="font-weight:600;">Day ${r.day}</td>
            <td>${r.date}</td>
            <td>${testDesc}</td>
            <td style="text-align:center;"><input type="checkbox" class="done-cb" ${isDone ? 'checked' : ''} onchange="toggleDone(${r.day})"></td>
          </tr>`;
        });
      }
      document.getElementById('test-list-body').innerHTML = html;
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
      
      localStorage.setItem('neet_v3_tracker', JSON.stringify(trackerLogs));
      renderTrackerTable();
      updateOverviewStats();
      
      // Reset inputs
      document.getElementById('track-phy').value = '';
      document.getElementById('track-chem').value = '';
      document.getElementById('track-bio').value = '';
      document.getElementById('track-mcqs').value = '';
      document.getElementById('track-notes').value = '';
    }
    
    function deleteTrackerEntry(date) {
      if (confirm(`Delete study entry for ${date}?`)) {
        trackerLogs = trackerLogs.filter(l => l.date !== date);
        localStorage.setItem('neet_v3_tracker', JSON.stringify(trackerLogs));
        renderTrackerTable();
        updateOverviewStats();
      }
    }
    
    function renderTrackerTable() {
      const tbody = document.getElementById('tracker-table-body');
      if (trackerLogs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:30px;">No entries logged yet.</td></tr>';
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
      document.getElementById('an-streak').textContent = `${streak} Days`;
      
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
      document.getElementById('an-avg-hours').textContent = `${avg}h`;
      document.getElementById('an-total-mcqs').textContent = totalMcqs.toLocaleString();
      
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
      
      document.getElementById('progress-phy-text').textContent = phyPct + '%';
      document.getElementById('progress-phy-bar').style.width = phyPct + '%';
      
      document.getElementById('progress-chem-text').textContent = chemPct + '%';
      document.getElementById('progress-chem-bar').style.width = chemPct + '%';
      
      document.getElementById('progress-bio-text').textContent = bioPct + '%';
      document.getElementById('progress-bio-bar').style.width = bioPct + '%';
      
      // 4. Subject Study Balance stacked bar
      const sumH = phyH + chemH + bioH;
      const pSeg = document.getElementById('stacked-bar');
      if (sumH === 0) {
        pSeg.innerHTML = `
          <div class="stacked-segment" style="width:33.3%; background:var(--phy);"></div>
          <div class="stacked-segment" style="width:33.3%; background:var(--che);"></div>
          <div class="stacked-segment" style="width:33.4%; background:var(--bio);"></div>
        `;
        document.getElementById('bal-phy-label').textContent = 'Phy: 0h (33%)';
        document.getElementById('bal-chem-label').textContent = 'Chem: 0h (33%)';
        document.getElementById('bal-bio-label').textContent = 'Bio: 0h (33%)';
      } else {
        const pP = Math.round((phyH / sumH) * 100);
        const cP = Math.round((chemH / sumH) * 100);
        const bP = 100 - pP - cP;
        
        pSeg.innerHTML = `
          <div class="stacked-segment" style="width:${pP}%; background:var(--phy);"></div>
          <div class="stacked-segment" style="width:${cP}%; background:var(--che);"></div>
          <div class="stacked-segment" style="width:${bP}%; background:var(--bio);"></div>
        `;
        document.getElementById('bal-phy-label').textContent = `Phy: ${phyH.toFixed(1)}h (${pP}%)`;
        document.getElementById('bal-chem-label').textContent = `Chem: ${chemH.toFixed(1)}h (${cP}%)`;
        document.getElementById('bal-bio-label').textContent = `Bio: ${bioH.toFixed(1)}h (${bP}%)`;
      }
      
      // 5. Daily study hours chart (last 7 logs)
      const chartBody = document.getElementById('hours-chart-body');
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
      
      // 6. Weak chapters
      const weakList = document.getElementById('weak-topics-list');
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
    
    // Overview tab calculations
    function updateCountdown() {
      const now = new Date();
      const diff = EXAM_DATE - now;
      
      const cdDays = document.getElementById('cd-days');
      const cdHours = document.getElementById('cd-hours');
      const cdMins = document.getElementById('cd-minutes');
      const cdSecs = document.getElementById('cd-seconds');
      
      if (diff <= 0) {
        document.getElementById('over-countdown').textContent = 'Exam Day!';
        document.getElementById('over-countdown').classList.add('pulse');
        
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
      
      document.getElementById('over-countdown').textContent = `${days}d ${hours}h`;
      
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
      document.getElementById('over-streak').textContent = `${streak} Days`;
      
      // Total Hours
      let totalH = 0;
      trackerLogs.forEach(l => {
        totalH += (l.phyHours + l.cheHours + l.bioHours);
      });
      document.getElementById('over-hours').textContent = `${totalH.toFixed(1)}h`;
      
      // Syllabus Progress %
      const doneCnt = Object.values(done).filter(Boolean).length;
      const pct = PLAN.length ? Math.round((doneCnt / PLAN.length) * 100) : 0;
      document.getElementById('over-progress').textContent = `${pct}%`;
    }
    
    function renderOverviewStats() {
      updateOverviewStats();
    }

    // Previous Year Papers Logic
    let yearlyTestTimer = null;
    let yearlyTestQuestions = [];
    let yearlyTestAnswers = [];
    let yearlyTestMode = ''; // 'mock' or 'practice'
    let yearlyTestYear = 2024;
    let yearlyCurrentFilter = 'all';

    function renderPapersPicker() {
      const years = [];
      for (let y = 2025; y >= 2010; y--) {
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
      document.getElementById('paper-results-view').style.display = 'none';
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
        document.getElementById('paper-results-view').style.display = 'none';
        
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
        document.getElementById('paper-results-view').style.display = 'none';
        
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
          diagramHtml = `<div class="pyq-diagram" style="margin: 16px 0; text-align: center;">${q.diagram}</div>`;
        } else {
          const pDiag = getProceduralDiagram(q.chapter || '', q.q, idx);
          diagramHtml = `<div class="pyq-diagram" style="margin: 16px 0; text-align: center;">${pDiag}</div>`;
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
      document.getElementById('paper-results-view').style.display = 'block';
    }

    function reviewPaperQuestions() {
      // Switch mode to practice so answers are shown
      yearlyTestMode = 'practice';
      
      document.getElementById('paper-results-view').style.display = 'none';
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
      e.preventDefault();
      const val = document.getElementById('google-search-input').value.trim();
      if (val) {
        window.open('https://www.google.com/search?q=' + encodeURIComponent(val), '_blank');
      }
    }

    function quickSearch(query) {
      window.open('https://www.google.com/search?q=' + encodeURIComponent(query), '_blank');
    }

    // Initial run
    setInterval(updateCountdown, 1000);
    
    // Set date input default to today
    window.addEventListener('load', () => {
      const today = new Date().toISOString().split('T')[0];
      const dInput = document.getElementById('track-date');
      if (dInput) dInput.value = today;
      
      // Initial stats updates
      updateOverviewStats();
    });
  

// Bind functions to window so they are globally accessible from inline HTML event handlers
window.getChapterWeight = getChapterWeight;
window.makeRows = makeRows;
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
window.handleLogin = handleLogin;
window.renderPaperQuestions = renderPaperQuestions;
window.cellHtml = cellHtml;
window.saveDone = saveDone;
window.renderPapersPicker = renderPapersPicker;
window.logStudy = logStudy;
window.deleteTrackerEntry = deleteTrackerEntry;
window.executeGoogleSearch = executeGoogleSearch;
window.navigateTab = navigateTab;
window.calGo = calGo;
window.closePyqModal = closePyqModal;
window.updateCountdown = updateCountdown;
window.renderOverviewStats = renderOverviewStats;
window.toggleDone = toggleDone;
window.exportLogs = exportLogs;
window.quickSearch = quickSearch;
window.toggleChapterStep = toggleChapterStep;
window.typeBadge = typeBadge;
window.exitYearlyPaper = exitYearlyPaper;
window.buildPlan = buildPlan;
window.renderCal = renderCal;
window.exitPaperResults = exitPaperResults;
window.renderChapters = renderChapters;
window.updateOverviewStats = updateOverviewStats;
window.submitYearlyPaper = submitYearlyPaper;
window.filterPaperSubject = filterPaperSubject;
window.getProceduralDiagram = getProceduralDiagram;
window.selectPaperOption = selectPaperOption;
window.openPyqModal = openPyqModal;
window.initYearlyPaper = initYearlyPaper;
