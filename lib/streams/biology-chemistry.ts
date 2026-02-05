import { StreamData, CareerPath, JobPortal, SkillCategory, Skill, EducationPath, Tool, Certification, Journal, Conference } from './physics-mathematics'

export const biologyChemistryStream: StreamData = {
  stream: 'Biology & Chemistry',
  atsKeywords: [
    'Molecular Biology', 'Organic Synthesis', 'HPLC', 
    'Biochemistry', 'Clinical Trials', 'CRISPR', 'Lab Safety',
    'Genetics', 'Cell Culture', 'PCR', 'Sequencing', 'Protein Analysis',
    'Drug Discovery', 'Toxicology', 'Pharmacology', 'Analytical Chemistry',
    'Bioinformatics', 'Structural Biology', 'Immunology', 'Microbiology',
    'Environmental Science', 'Quality Control', 'GMP', 'Regulatory Affairs'
  ],
  careerPaths: [
    {
      title: 'Biotechnologist',
      demand: 'High',
      gapRequirements: ['Recombinant DNA Technology', 'Bioinformatics', 'Cell Culture', 'Protein Engineering'],
      averageSalary: {
        entry: 70000,
        mid: 95000,
        senior: 130000
      },
      growthRate: 0.28,
      requiredSkills: ['Molecular Biology', 'Cell Culture', 'Bioinformatics', 'Protein Analysis', 'Lab Techniques'],
      companies: ['Genentech', 'Amgen', 'Regeneron', 'Moderna', 'BioNTech', 'Pfizer', 'Novartis']
    },
    {
      title: 'Pharmacologist',
      demand: 'High',
      gapRequirements: ['Toxicology', 'Regulatory Affairs', 'Pharmacokinetics', 'Drug Development'],
      averageSalary: {
        entry: 75000,
        mid: 105000,
        senior: 145000
      },
      growthRate: 0.22,
      requiredSkills: ['Pharmacology', 'Biochemistry', 'Statistics', 'Regulatory Knowledge', 'Research Methods'],
      companies: ['Pfizer', 'Johnson & Johnson', 'Merck', 'Roche', 'Novartis', 'Eli Lilly', 'Bristol Myers Squibb']
    },
    {
      title: 'Environmental Chemist',
      demand: 'Medium',
      gapRequirements: ['Analytical Instrumentation', 'GIS', 'Waste Management Protocols', 'Environmental Regulations'],
      averageSalary: {
        entry: 65000,
        mid: 85000,
        senior: 115000
      },
      growthRate: 0.15,
      requiredSkills: ['Chemistry', 'Environmental Science', 'Analytical Techniques', 'Data Analysis', 'Regulations'],
      companies: ['EPA', 'Environmental consulting firms', 'Waste management companies', 'Industrial labs']
    },
    {
      title: 'Bioinformatics Scientist',
      demand: 'High',
      gapRequirements: ['Computational Biology', 'Machine Learning', 'Database Management', 'Statistical Genetics'],
      averageSalary: {
        entry: 85000,
        mid: 115000,
        senior: 155000
      },
      growthRate: 0.35,
      requiredSkills: ['Bioinformatics', 'Programming', 'Statistics', 'Molecular Biology', 'Data Analysis'],
      companies: ['Illumina', 'Thermo Fisher', '23andMe', 'Ancestry', 'Broad Institute', 'NCBI']
    },
    {
      title: 'Clinical Research Associate',
      demand: 'High',
      gapRequirements: ['GCP Guidelines', 'Clinical Trial Management', 'Regulatory Compliance', 'Medical Writing'],
      averageSalary: {
        entry: 68000,
        mid: 88000,
        senior: 120000
      },
      growthRate: 0.25,
      requiredSkills: ['Clinical Research', 'Regulatory Knowledge', 'Data Management', 'Medical Terminology', 'Communication'],
      companies: ['Parexel', 'PPD', 'Covance', 'IQVIA', 'Pharmaceutical companies', 'Clinical research organizations']
    }
  ],
  portals: [
    {
      name: 'Nature Careers',
      url: 'https://www.nature.com/naturecareers',
      focus: 'Science and Research',
      features: ['Academic positions', 'Industry roles', 'Postdoc opportunities', 'Research positions']
    },
    {
      name: 'ScienceCareers',
      url: 'https://jobs.sciencecareers.org',
      focus: 'Scientific Careers',
      features: ['Life sciences', 'Chemistry positions', 'Academic jobs', 'Industry roles']
    },
    {
      name: 'BioSpace',
      url: 'https://www.biospace.com',
      focus: 'Biotechnology and Pharma',
      features: ['Biotech jobs', 'Pharma positions', 'Startup opportunities', 'Industry news']
    },
    {
      name: 'FiercePharma Jobs',
      url: 'https://jobs.fiercepharma.com',
      focus: 'Pharmaceutical Industry',
      features: ['Pharma careers', 'Clinical research', 'Regulatory affairs', 'Drug development']
    },
    {
      name: 'LabManager',
      url: 'https://www.labmanager.com/jobs',
      focus: 'Laboratory and Research',
      features: ['Lab positions', 'Research jobs', 'Technical roles', 'Management positions']
    }
  ],
  skills: [
    {
      category: 'Molecular Biology',
      skills: [
        { name: 'PCR Techniques', level: 'Expert', importance: 10, description: 'DNA amplification and analysis' },
        { name: 'DNA Sequencing', level: 'Advanced', importance: 9, description: 'Genetic sequencing technologies' },
        { name: 'CRISPR/Cas9', level: 'Advanced', importance: 9, description: 'Gene editing technology' },
        { name: 'Protein Analysis', level: 'Advanced', importance: 8, description: 'Protein purification and characterization' },
        { name: 'Cell Culture', level: 'Advanced', importance: 8, description: 'Maintaining and manipulating cell lines' }
      ]
    },
    {
      category: 'Chemistry Techniques',
      skills: [
        { name: 'HPLC', level: 'Expert', importance: 9, description: 'High-performance liquid chromatography' },
        { name: 'GC-MS', level: 'Advanced', importance: 8, description: 'Gas chromatography-mass spectrometry' },
        { name: 'NMR Spectroscopy', level: 'Advanced', importance: 8, description: 'Nuclear magnetic resonance analysis' },
        { name: 'Organic Synthesis', level: 'Advanced', importance: 7, description: 'Chemical compound synthesis' },
        { name: 'Analytical Chemistry', level: 'Expert', importance: 9, description: 'Chemical analysis methods' }
      ]
    },
    {
      category: 'Bioinformatics',
      skills: [
        { name: 'Sequence Analysis', level: 'Advanced', importance: 9, description: 'DNA/RNA sequence analysis' },
        { name: 'Database Management', level: 'Intermediate', importance: 8, description: 'Biological data databases' },
        { name: 'Computational Biology', level: 'Advanced', importance: 8, description: 'Biological system modeling' },
        { name: 'Statistical Genetics', level: 'Intermediate', importance: 7, description: 'Genetic data analysis' },
        { name: 'Machine Learning for Biology', level: 'Intermediate', importance: 8, description: 'ML applications in biology' }
      ]
    },
    {
      category: 'Clinical Research',
      skills: [
        { name: 'Clinical Trial Design', level: 'Advanced', importance: 9, description: 'Designing clinical studies' },
        { name: 'GCP Guidelines', level: 'Expert', importance: 10, description: 'Good Clinical Practice standards' },
        { name: 'Regulatory Affairs', level: 'Advanced', importance: 8, description: 'Regulatory compliance' },
        { name: 'Medical Writing', level: 'Intermediate', importance: 7, description: 'Clinical documentation' },
        { name: 'Data Management', level: 'Intermediate', importance: 8, description: 'Clinical data handling' }
      ]
    }
  ],
  education: [
    {
      degree: 'Bachelor of Science in Biology',
      specializations: ['Molecular Biology', 'Genetics', 'Microbiology', 'Ecology', 'Biochemistry'],
      duration: '4 years',
      prerequisites: ['Biology', 'Chemistry', 'Mathematics', 'Physics'],
      topInstitutions: ['MIT', 'Stanford', 'Harvard', 'Berkeley', 'Johns Hopkins', 'UCSF']
    },
    {
      degree: 'Bachelor of Science in Chemistry',
      specializations: ['Organic Chemistry', 'Analytical Chemistry', 'Biochemistry', 'Physical Chemistry'],
      duration: '4 years',
      prerequisites: ['Chemistry', 'Mathematics', 'Physics', 'Biology'],
      topInstitutions: ['MIT', 'Caltech', 'Stanford', 'Berkeley', 'Harvard', 'Northwestern']
    },
    {
      degree: 'Master of Science in Biotechnology',
      specializations: ['Pharmaceutical Biotech', 'Industrial Biotech', 'Medical Biotech', 'Agricultural Biotech'],
      duration: '2 years',
      prerequisites: ['Bachelor in Biology/Chemistry', 'Lab Experience', 'Mathematics'],
      topInstitutions: ['Johns Hopkins', 'UCSF', 'MIT', 'Stanford', 'UC Berkeley', 'University of Pennsylvania']
    },
    {
      degree: 'PhD in Biochemistry',
      specializations: ['Structural Biology', 'Enzymology', 'Metabolism', 'Molecular Biology'],
      duration: '5-7 years',
      prerequisites: ['Bachelor/Master in Biochemistry', 'Research Experience', 'Publications'],
      topInstitutions: ['MIT', 'Stanford', 'Harvard', 'UCSF', 'Johns Hopkins', 'Rockefeller University']
    }
  ],
  tools: [
    { name: 'BLAST', category: 'Bioinformatics', purpose: 'Sequence alignment', difficulty: 'Easy' },
    { name: 'Geneious', category: 'Bioinformatics', purpose: 'Molecular biology analysis', difficulty: 'Medium' },
    { name: 'ChemDraw', category: 'Chemistry', purpose: 'Chemical structure drawing', difficulty: 'Medium' },
    { name: 'SAS', category: 'Statistics', purpose: 'Statistical analysis', difficulty: 'Hard' },
    { name: 'R (Bioconductor)', category: 'Programming', purpose: 'Bioinformatics analysis', difficulty: 'Medium' },
    { name: 'Python (Biopython)', category: 'Programming', purpose: 'Bioinformatics tools', difficulty: 'Medium' },
    { name: 'LabKey Server', category: 'Data Management', purpose: 'Lab data management', difficulty: 'Hard' },
    { name: 'MasterControl', category: 'Quality Management', purpose: 'Quality control systems', difficulty: 'Hard' },
    { name: 'GraphPad Prism', category: 'Statistics', purpose: 'Scientific graphing', difficulty: 'Easy' },
    { name: 'ImageJ', category: 'Image Analysis', purpose: 'Scientific image analysis', difficulty: 'Easy' }
  ],
  certifications: [
    { name: 'Certified Clinical Research Associate', provider: 'ACRP', duration: '6 months', cost: '$400', validity: '2 years' },
    { name: 'Certified Quality Auditor', provider: 'ASQ', duration: '3 months', cost: '$350', validity: '3 years' },
    { name: 'GLP Certification', provider: 'SQA', duration: '4 months', cost: '$500', validity: '2 years' },
    { name: 'Certified Biotechnology Professional', provider: 'Biotech Institute', duration: '6 months', cost: '$600', validity: '3 years' },
    { name: 'Hazardous Materials Handling', provider: 'OSHA', duration: '1 month', cost: '$200', validity: '1 year' }
  ],
  journals: [
    { name: 'Nature', publisher: 'Nature', impactFactor: 47.7, frequency: 'Weekly' },
    { name: 'Cell', publisher: 'Cell Press', impactFactor: 38.6, frequency: 'Biweekly' },
    { name: 'Journal of Biological Chemistry', publisher: 'ASBMB', impactFactor: 5.5, frequency: 'Weekly' },
    { name: 'Journal of the American Chemical Society', publisher: 'ACS', impactFactor: 15.4, frequency: 'Weekly' },
    { name: 'Nature Biotechnology', publisher: 'Nature', impactFactor: 41.8, frequency: 'Monthly' }
  ],
  conferences: [
    { name: 'American Society for Cell Biology Meeting', frequency: 'Annual', location: 'Various', focus: 'Cell biology research' },
    { name: 'American Chemical Society Meeting', frequency: 'Biannual', location: 'Various', focus: 'Chemistry research' },
    { name: 'BIO International Convention', frequency: 'Annual', location: 'Various', focus: 'Biotechnology industry' },
    { name: 'American Association for Cancer Research', frequency: 'Annual', location: 'Various', focus: 'Cancer research' },
    { name: 'Experimental Biology', frequency: 'Annual', location: 'Various', focus: 'Life sciences' }
  ]
}
