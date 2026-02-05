/**
 * Comprehensive Science Streams Configuration
 * Covers all major science disciplines with specialized terminology, skills, and career paths
 */

export interface ScienceStream {
  id: string
  name: string
  description: string
  coreDisciplines: string[]
  keySkills: string[]
  laboratoryTechniques: string[]
  researchMethods: string[]
  softwareTools: string[]
  careerPaths: CareerPath[]
  requiredEducation: EducationLevel[]
  industryApplications: string[]
  emergingFields: string[]
  professionalCertifications: string[]
  journals: string[]
  conferences: string[]
}

export interface CareerPath {
  title: string
  description: string
  requiredSkills: string[]
  averageSalary: string
  growthRate: string
  typicalEmployers: string[]
  advancementPath: string[]
}

export interface EducationLevel {
  level: string
  duration: string
  prerequisites: string[]
  coreSubjects: string[]
  researchComponent: boolean
}

// Physics Stream Configuration
export const physicsStream: ScienceStream = {
  id: 'physics',
  name: 'Physics',
  description: 'Study of matter, energy, and their interactions in the universe',
  coreDisciplines: [
    'Classical Mechanics', 'Quantum Mechanics', 'Electromagnetism', 
    'Thermodynamics', 'Statistical Mechanics', 'Optics', 'Astrophysics',
    'Particle Physics', 'Condensed Matter Physics', 'Nuclear Physics'
  ],
  keySkills: [
    'Mathematical Modeling', 'Experimental Design', 'Data Analysis',
    'Computational Physics', 'Theoretical Analysis', 'Problem Solving',
    'Statistical Analysis', 'Instrumentation', 'Programming (Python/MATLAB)'
  ],
  laboratoryTechniques: [
    'Spectroscopy', 'Microscopy', 'Vacuum Systems', 'Laser Systems',
    'Particle Detection', 'Cryogenics', 'Material Characterization',
    'Precision Measurements', 'Data Acquisition Systems'
  ],
  researchMethods: [
    'Experimental Physics', 'Theoretical Physics', 'Computational Physics',
    'Monte Carlo Simulations', 'Finite Element Analysis', 'Statistical Mechanics',
    'Quantum Field Theory', 'Numerical Methods'
  ],
  softwareTools: [
    'MATLAB', 'Python (NumPy, SciPy, Pandas)', 'Mathematica', 'COMSOL',
    'ROOT', 'LabVIEW', 'Origin', 'Igor Pro', 'ANSYS', 'AutoCAD'
  ],
  careerPaths: [
    {
      title: 'Research Physicist',
      description: 'Conduct fundamental research in academic or industrial settings',
      requiredSkills: ['Quantum Mechanics', 'Statistical Analysis', 'Computational Physics'],
      averageSalary: '$80,000-$120,000',
      growthRate: '8%',
      typicalEmployers: ['Universities', 'National Labs', 'Research Institutes'],
      advancementPath: ['Postdoc → Assistant Professor → Professor → Department Head']
    },
    {
      title: 'Applied Physicist',
      description: 'Apply physics principles to solve real-world problems',
      requiredSkills: ['Engineering Physics', 'Instrumentation', 'Data Analysis'],
      averageSalary: '$90,000-$140,000',
      growthRate: '12%',
      typicalEmployers: ['Tech Companies', 'Engineering Firms', 'Government Agencies'],
      advancementPath: ['Junior Physicist → Senior Physicist → Lead Scientist → R&D Director']
    },
    {
      title: 'Medical Physicist',
      description: 'Apply physics in healthcare, particularly in radiation therapy',
      requiredSkills: ['Medical Imaging', 'Radiation Physics', 'Dosimetry'],
      averageSalary: '$120,000-$180,000',
      growthRate: '15%',
      typicalEmployers: ['Hospitals', 'Cancer Centers', 'Medical Device Companies'],
      advancementPath: ['Resident Physicist → Certified Physicist → Chief Physicist']
    }
  ],
  requiredEducation: [
    {
      level: 'Bachelor of Science in Physics',
      duration: '4 years',
      prerequisites: ['Calculus', 'Physics', 'Chemistry', 'Mathematics'],
      coreSubjects: ['Mechanics', 'Electricity & Magnetism', 'Quantum Physics', 'Thermodynamics'],
      researchComponent: false
    },
    {
      level: 'Master of Science in Physics',
      duration: '2 years',
      prerequisites: ['B.S. in Physics', 'GRE Physics', 'Research Experience'],
      coreSubjects: ['Advanced Quantum Mechanics', 'Statistical Mechanics', 'Electrodynamics'],
      researchComponent: true
    },
    {
      level: 'PhD in Physics',
      duration: '4-6 years',
      prerequisites: ['M.S. in Physics', 'Research Proposal', 'Publications'],
      coreSubjects: ['Specialized Field Research', 'Advanced Theory', 'Original Research'],
      researchComponent: true
    }
  ],
  industryApplications: [
    'Semiconductor Industry', 'Energy Sector', 'Aerospace', 'Healthcare',
    'Telecommunications', 'Materials Science', 'Defense', 'Environmental Science'
  ],
  emergingFields: [
    'Quantum Computing', 'Nanotechnology', 'Photonics', 'Plasma Physics',
    'Biophysics', 'Neurophysics', 'Climate Physics', 'Space Physics'
  ],
  professionalCertifications: [
    'American Board of Radiology (ABR)', 'Certified Medical Physicist (CMP)',
    'ANSI N45 Radiation Protection', 'Laser Safety Officer'
  ],
  journals: [
    'Physical Review Letters', 'Nature Physics', 'Physics Review B',
    'Journal of Applied Physics', 'Nature Photonics', 'Science'
  ],
  conferences: [
    'APS March Meeting', 'American Physical Society Conference',
    'International Conference on Physics', 'Quantum Technology Conference'
  ]
}

// Chemistry Stream Configuration
export const chemistryStream: ScienceStream = {
  id: 'chemistry',
  name: 'Chemistry',
  description: 'Study of matter, its properties, composition, and reactions',
  coreDisciplines: [
    'Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry',
    'Analytical Chemistry', 'Biochemistry', 'Polymer Chemistry',
    'Environmental Chemistry', 'Materials Chemistry', 'Medicinal Chemistry'
  ],
  keySkills: [
    'Chemical Synthesis', 'Spectroscopic Analysis', 'Chromatography',
    'Chemical Modeling', 'Laboratory Safety', 'Quality Control',
    'Data Analysis', 'Problem Solving', 'Technical Writing'
  ],
  laboratoryTechniques: [
    'NMR Spectroscopy', 'Mass Spectrometry', 'X-ray Crystallography',
    'HPLC', 'GC-MS', 'FTIR', 'UV-Vis Spectroscopy', 'Electrochemistry',
    'Polymer Characterization', 'Material Synthesis'
  ],
  researchMethods: [
    'Synthetic Chemistry', 'Analytical Methods', 'Computational Chemistry',
    'Structure Determination', 'Kinetic Studies', 'Thermodynamics',
    'Quantum Chemistry', 'Molecular Modeling'
  ],
  softwareTools: [
    'ChemDraw', 'Gaussian', 'Spartan', 'MestReNova', 'Origin',
    'MATLAB', 'Python (RDKit)', 'Schrödinger Suite', 'JMP', 'LabVIEW'
  ],
  careerPaths: [
    {
      title: 'Research Chemist',
      description: 'Develop new compounds and materials in academic or industrial settings',
      requiredSkills: ['Organic Synthesis', 'Analytical Chemistry', 'Research Methods'],
      averageSalary: '$75,000-$115,000',
      growthRate: '7%',
      typicalEmployers: ['Pharmaceutical Companies', 'Chemical Companies', 'Universities'],
      advancementPath: ['Research Chemist → Senior Chemist → Principal Scientist → R&D Manager']
    },
    {
      title: 'Analytical Chemist',
      description: 'Develop and validate analytical methods for quality control and research',
      requiredSkills: ['Chromatography', 'Spectroscopy', 'Method Development'],
      averageSalary: '$70,000-$110,000',
      growthRate: '10%',
      typicalEmployers: ['Testing Labs', 'Pharmaceutical Companies', 'Environmental Agencies'],
      advancementPath: ['Junior Analyst → Senior Analyst → Lab Manager → Quality Director']
    },
    {
      title: 'Process Chemist',
      description: 'Scale up chemical processes for industrial production',
      requiredSkills: ['Process Development', 'Scale-up Chemistry', 'Quality Control'],
      averageSalary: '$85,000-$130,000',
      growthRate: '12%',
      typicalEmployers: ['Chemical Manufacturing', 'Pharmaceutical Companies', 'Biotech Firms'],
      advancementPath: ['Process Chemist → Senior Process Chemist → Process Development Manager']
    }
  ],
  requiredEducation: [
    {
      level: 'Bachelor of Science in Chemistry',
      duration: '4 years',
      prerequisites: ['General Chemistry', 'Organic Chemistry', 'Calculus', 'Physics'],
      coreSubjects: ['Organic Chemistry', 'Physical Chemistry', 'Analytical Chemistry', 'Inorganic Chemistry'],
      researchComponent: false
    },
    {
      level: 'Master of Science in Chemistry',
      duration: '2 years',
      prerequisites: ['B.S. in Chemistry', 'GRE Chemistry', 'Lab Experience'],
      coreSubjects: ['Advanced Organic Chemistry', 'Advanced Analytical Chemistry', 'Research'],
      researchComponent: true
    },
    {
      level: 'PhD in Chemistry',
      duration: '4-6 years',
      prerequisites: ['M.S. in Chemistry', 'Research Proposal', 'Publications'],
      coreSubjects: ['Specialized Research', 'Advanced Theory', 'Original Research'],
      researchComponent: true
    }
  ],
  industryApplications: [
    'Pharmaceutical Industry', 'Chemical Manufacturing', 'Environmental Testing',
    'Food Industry', 'Cosmetics', 'Materials Science', 'Energy', 'Agriculture'
  ],
  emergingFields: [
    'Green Chemistry', 'Nanomaterials', 'Drug Discovery', 'Biomaterials',
    'Energy Storage', 'Catalysis', 'Computational Chemistry', 'Chemical Biology'
  ],
  professionalCertifications: [
    'American Chemical Society (ACS) Certification', 'Hazardous Materials Management',
    'Quality Assurance (QA) Certification', 'Laboratory Safety Certification'
  ],
  journals: [
    'Journal of the American Chemical Society', 'Nature Chemistry',
    'Angewandte Chemie', 'Chemical Reviews', 'Organic Letters'
  ],
  conferences: [
    'ACS National Meeting', 'American Chemical Society Conference',
    'International Chemistry Conference', 'Green Chemistry Conference'
  ]
}

// Biology Stream Configuration
export const biologyStream: ScienceStream = {
  id: 'biology',
  name: 'Biology',
  description: 'Study of living organisms and their interactions with the environment',
  coreDisciplines: [
    'Molecular Biology', 'Cell Biology', 'Genetics', 'Microbiology',
    'Ecology', 'Evolutionary Biology', 'Biochemistry', 'Physiology',
    'Neurobiology', 'Immunology', 'Developmental Biology'
  ],
  keySkills: [
    'Molecular Techniques', 'Cell Culture', 'DNA/RNA Analysis',
    'Microscopy', 'Statistical Analysis', 'Experimental Design',
    'Bioinformatics', 'Laboratory Safety', 'Scientific Writing'
  ],
  laboratoryTechniques: [
    'PCR', 'Western Blotting', 'ELISA', 'Flow Cytometry',
    'Cell Culture', 'DNA Sequencing', 'CRISPR-Cas9', 'Microscopy',
    'Protein Purification', 'Gel Electrophoresis'
  ],
  researchMethods: [
    'Molecular Biology', 'Cell Biology', 'Genetic Engineering',
    'Bioinformatics', 'Statistical Analysis', 'Experimental Design',
    'Systems Biology', 'Computational Biology'
  ],
  softwareTools: [
    'BLAST', 'Geneious', 'SnapGene', 'ImageJ', 'GraphPad Prism',
    'R Programming', 'Python (Biopython)', 'MEGA', 'ClustalW', 'Cytoscape'
  ],
  careerPaths: [
    {
      title: 'Research Scientist',
      description: 'Conduct biological research in academic or industrial settings',
      requiredSkills: ['Molecular Biology', 'Cell Culture', 'Data Analysis'],
      averageSalary: '$70,000-$110,000',
      growthRate: '8%',
      typicalEmployers: ['Universities', 'Research Institutes', 'Biotech Companies'],
      advancementPath: ['Postdoc → Assistant Professor → Professor → Department Head']
    },
    {
      title: 'Biotechnologist',
      description: 'Apply biological principles to develop products and technologies',
      requiredSkills: ['Genetic Engineering', 'Protein Engineering', 'Process Development'],
      averageSalary: '$80,000-$130,000',
      growthRate: '15%',
      typicalEmployers: ['Biotech Companies', 'Pharmaceutical Companies', 'Agricultural Companies'],
      advancementPath: ['Junior Biotechnologist → Senior Biotechnologist → R&D Manager']
    },
    {
      title: 'Clinical Research Associate',
      description: 'Manage clinical trials and research studies',
      requiredSkills: ['Clinical Research', 'Regulatory Compliance', 'Data Management'],
      averageSalary: '$65,000-$95,000',
      growthRate: '12%',
      typicalEmployers: ['Hospitals', 'Research Organizations', 'Pharmaceutical Companies'],
      advancementPath: ['CRA I → CRA II → Senior CRA → Clinical Trial Manager']
    }
  ],
  requiredEducation: [
    {
      level: 'Bachelor of Science in Biology',
      duration: '4 years',
      prerequisites: ['Biology', 'Chemistry', 'Mathematics', 'Physics'],
      coreSubjects: ['Cell Biology', 'Genetics', 'Molecular Biology', 'Ecology'],
      researchComponent: false
    },
    {
      level: 'Master of Science in Biology',
      duration: '2 years',
      prerequisites: ['B.S. in Biology', 'GRE Biology', 'Research Experience'],
      coreSubjects: ['Advanced Molecular Biology', 'Advanced Genetics', 'Research'],
      researchComponent: true
    },
    {
      level: 'PhD in Biology',
      duration: '4-6 years',
      prerequisites: ['M.S. in Biology', 'Research Proposal', 'Publications'],
      coreSubjects: ['Specialized Research', 'Advanced Theory', 'Original Research'],
      researchComponent: true
    }
  ],
  industryApplications: [
    'Healthcare', 'Pharmaceuticals', 'Biotechnology', 'Agriculture',
    'Environmental Science', 'Food Industry', 'Cosmetics', 'Diagnostics'
  ],
  emergingFields: [
    'Synthetic Biology', 'CRISPR Technology', 'Personalized Medicine',
    'Systems Biology', 'Neurobiology', 'Immunotherapy', 'Bioinformatics'
  ],
  professionalCertifications: [
    'ASCP Certification', 'Clinical Research Professional (CCRP)',
    'Laboratory Safety Certification', 'Biotechnology Certification'
  ],
  journals: [
    'Nature', 'Science', 'Cell', 'PNAS', 'Nature Genetics',
    'Molecular Cell', 'Developmental Cell', 'Immunity'
  ],
  conferences: [
    'AAAS Annual Meeting', 'Biology Conference', 'Genetics Conference',
    'Cell Biology Conference', 'Neuroscience Conference'
  ]
}

// Additional Science Streams
export const mathematicsStream: ScienceStream = {
  id: 'mathematics',
  name: 'Mathematics',
  description: 'Study of numbers, quantities, structures, and patterns',
  coreDisciplines: [
    'Pure Mathematics', 'Applied Mathematics', 'Statistics',
    'Discrete Mathematics', 'Numerical Analysis', 'Topology',
    'Algebra', 'Geometry', 'Analysis', 'Probability Theory'
  ],
  keySkills: [
    'Mathematical Modeling', 'Statistical Analysis', 'Problem Solving',
    'Logical Reasoning', 'Abstract Thinking', 'Computational Mathematics',
    'Data Analysis', 'Algorithm Development', 'Proof Writing'
  ],
  laboratoryTechniques: [
    'Computational Experiments', 'Mathematical Simulations',
    'Statistical Modeling', 'Algorithm Testing', 'Data Visualization',
    'Numerical Methods', 'Optimization Techniques'
  ],
  researchMethods: [
    'Theoretical Mathematics', 'Applied Mathematics', 'Computational Mathematics',
    'Statistical Analysis', 'Mathematical Modeling', 'Algorithm Development'
  ],
  softwareTools: [
    'MATLAB', 'Mathematica', 'R Programming', 'Python (NumPy, SciPy)',
    'SAS', 'SPSS', 'Stata', 'Maple', 'Magma', 'SageMath'
  ],
  careerPaths: [
    {
      title: 'Mathematician',
      description: 'Conduct research in pure or applied mathematics',
      requiredSkills: ['Advanced Mathematics', 'Proof Writing', 'Research Methods'],
      averageSalary: '$70,000-$120,000',
      growthRate: '6%',
      typicalEmployers: ['Universities', 'Research Institutes', 'Government Agencies'],
      advancementPath: ['Postdoc → Assistant Professor → Professor → Department Head']
    },
    {
      title: 'Data Scientist',
      description: 'Apply mathematical and statistical methods to analyze data',
      requiredSkills: ['Statistics', 'Machine Learning', 'Data Analysis'],
      averageSalary: '$90,000-$150,000',
      growthRate: '22%',
      typicalEmployers: ['Tech Companies', 'Finance', 'Healthcare', 'Research'],
      advancementPath: ['Junior Data Scientist → Senior Data Scientist → Lead Data Scientist']
    },
    {
      title: 'Quantitative Analyst',
      description: 'Apply mathematical models to financial markets',
      requiredSkills: ['Financial Mathematics', 'Statistics', 'Programming'],
      averageSalary: '$100,000-$200,000',
      growthRate: '15%',
      typicalEmployers: ['Investment Banks', 'Hedge Funds', 'Trading Firms'],
      advancementPath: ['Junior Quant → Senior Quant → Portfolio Manager']
    }
  ],
  requiredEducation: [
    {
      level: 'Bachelor of Science in Mathematics',
      duration: '4 years',
      prerequisites: ['Calculus', 'Linear Algebra', 'Discrete Mathematics'],
      coreSubjects: ['Analysis', 'Algebra', 'Geometry', 'Statistics'],
      researchComponent: false
    },
    {
      level: 'Master of Science in Mathematics',
      duration: '2 years',
      prerequisites: ['B.S. in Mathematics', 'GRE Mathematics'],
      coreSubjects: ['Advanced Analysis', 'Abstract Algebra', 'Topology'],
      researchComponent: true
    },
    {
      level: 'PhD in Mathematics',
      duration: '4-6 years',
      prerequisites: ['M.S. in Mathematics', 'Research Proposal'],
      coreSubjects: ['Specialized Research', 'Advanced Theory'],
      researchComponent: true
    }
  ],
  industryApplications: [
    'Finance', 'Technology', 'Insurance', 'Healthcare', 'Engineering',
    'Research', 'Education', 'Government', 'Consulting'
  ],
  emergingFields: [
    'Data Science', 'Machine Learning', 'Quantum Computing', 'Financial Mathematics',
    'Computational Biology', 'Cryptography', 'Network Science', 'Optimization'
  ],
  professionalCertifications: [
    'Actuarial Certification', 'Data Science Certification',
    'Statistical Analysis Certification', 'Financial Risk Manager (FRM)'
  ],
  journals: [
    'Annals of Mathematics', 'Journal of the American Mathematical Society',
    'Nature Mathematics', 'SIAM Review', 'Mathematical Reviews'
  ],
  conferences: [
    'International Congress of Mathematicians', 'AMS Meeting',
    'SIAM Conference', 'Mathematics Conference'
  ]
}

// All Science Streams Registry
export const scienceStreams: ScienceStream[] = [
  physicsStream,
  chemistryStream,
  biologyStream,
  mathematicsStream
]

// Stream Detection Functions
export function detectScienceStream(text: string): ScienceStream | null {
  const lowerText = text.toLowerCase()
  
  for (const stream of scienceStreams) {
    // Check for stream-specific keywords
    const streamKeywords = [
      ...stream.coreDisciplines,
      ...stream.keySkills,
      ...stream.laboratoryTechniques
    ].map(keyword => keyword.toLowerCase())
    
    const matchCount = streamKeywords.filter(keyword => 
      lowerText.includes(keyword)
    ).length
    
    if (matchCount >= 3) {
      return stream
    }
  }
  
  return null
}

export function getScienceStreamById(id: string): ScienceStream | null {
  return scienceStreams.find(stream => stream.id === id) || null
}

export function getAllScienceStreams(): ScienceStream[] {
  return scienceStreams
}
