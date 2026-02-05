export const SkillDictionary: Record<string, string> = {
  // Computer Science & Data Science
  "NLP": "Natural Language Processing",
  "ML": "Machine Learning",
  "AI": "Artificial Intelligence",
  "DL": "Deep Learning",
  "CV": "Computer Vision",
  "DS": "Data Science",
  "MLOps": "Machine Learning Operations",
  "DevOps": "Development Operations",
  "CI/CD": "Continuous Integration/Continuous Deployment",
  "API": "Application Programming Interface",
  "UI": "User Interface",
  "UX": "User Experience",
  "SQL": "Structured Query Language",
  "NoSQL": "Not Only SQL",
  "ETL": "Extract Transform Load",
  "BI": "Business Intelligence",
  "KPI": "Key Performance Indicator",
  "ROI": "Return on Investment",
  
  // Physics & Mathematics
  "QM": "Quantum Mechanics",
  "EM": "Electromagnetism",
  "TD": "Thermodynamics",
  "SM": "Statistical Mechanics",
  "GR": "General Relativity",
  "SR": "Special Relativity",
  "QFT": "Quantum Field Theory",
  "LA": "Linear Algebra",
  "Calc": "Calculus",
  "ODE": "Ordinary Differential Equations",
  "PDE": "Partial Differential Equations",
  "FFT": "Fast Fourier Transform",
  "CAD": "Computer-Aided Design",
  "CAM": "Computer-Aided Manufacturing",
  "FEA": "Finite Element Analysis",
  "CFD": "Computational Fluid Dynamics",
  "FEM": "Finite Element Method",
  "DSA": "Data Structures and Algorithms",
  
  // Chemistry & Biology
  "HPLC": "High-Performance Liquid Chromatography",
  "GC": "Gas Chromatography",
  "MS": "Mass Spectrometry",
  "NMR": "Nuclear Magnetic Resonance",
  "IR": "Infrared Spectroscopy",
  "UV": "Ultraviolet Spectroscopy",
  "XRD": "X-Ray Diffraction",
  "SEM": "Scanning Electron Microscopy",
  "TEM": "Transmission Electron Microscopy",
  "PCR": "Polymerase Chain Reaction",
  "DNA": "Deoxyribonucleic Acid",
  "RNA": "Ribonucleic Acid",
  "ATP": "Adenosine Triphosphate",
  "CRISPR": "Clustered Regularly Interspaced Short Palindromic Repeats",
  "GMO": "Genetically Modified Organism",
  "ELISA": "Enzyme-Linked Immunosorbent Assay",
  "SDS": "Sodium Dodecyl Sulfate",
  "PAGE": "Polyacrylamide Gel Electrophoresis",
  "BLAST": "Basic Local Alignment Search Tool",
  
  // Laboratory & Research
  "QC": "Quality Control",
  "QA": "Quality Assurance",
  "R&D": "Research and Development",
  "SOP": "Standard Operating Procedure",
  "GLP": "Good Laboratory Practice",
  "GMP": "Good Manufacturing Practice",
  "GCP": "Good Clinical Practice",
  "ISO": "International Organization for Standardization",
  "FDA": "Food and Drug Administration",
  "EPA": "Environmental Protection Agency",
  "NIH": "National Institutes of Health",
  "NSF": "National Science Foundation",
  "DOE": "Department of Energy",
  "NASA": "National Aeronautics and Space Administration",
  
  // General Technical Terms
  "IoT": "Internet of Things",
  "AR": "Augmented Reality",
  "VR": "Virtual Reality",
  "MR": "Mixed Reality",
  "SaaS": "Software as a Service",
  "PaaS": "Platform as a Service",
  "IaaS": "Infrastructure as a Service",
  "GPU": "Graphics Processing Unit",
  "CPU": "Central Processing Unit",
  "RAM": "Random Access Memory",
  "SSD": "Solid State Drive",
  "HDD": "Hard Disk Drive",
  "LAN": "Local Area Network",
  "WAN": "Wide Area Network",
  "VPN": "Virtual Private Network",
  "DNS": "Domain Name System",
  "HTTP": "Hypertext Transfer Protocol",
  "HTTPS": "Hypertext Transfer Protocol Secure",
  "FTP": "File Transfer Protocol",
  "SSH": "Secure Shell",
  "SSL": "Secure Sockets Layer",
  "TLS": "Transport Layer Security"
};

export const expandAbbreviations = (text: string): string => {
  let expandedText = text;
  
  Object.entries(SkillDictionary).forEach(([abbreviation, fullForm]) => {
    const regex = new RegExp(`\\b${abbreviation}\\b`, 'gi');
    expandedText = expandedText.replace(regex, fullForm);
  });
  
  return expandedText;
};

export const normalizeSkill = (skill: string): string => {
  const upperSkill = skill.toUpperCase().trim();
  return SkillDictionary[upperSkill] || skill;
};
