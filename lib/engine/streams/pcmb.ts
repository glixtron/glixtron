import { AdvancedRole, StreamData } from './pcm';

export const PCMBStream: StreamData = {
  id: "pcmb",
  title: "Integrated Sciences & Advanced Technologies",
  keywords: [
    // Combined Physics, Chemistry, Mathematics, Biology (50+ keywords)
    "Computational Biology", "Biophysics", "Chemical Physics", "Mathematical Biology",
    "Quantum Biology", "Systems Biology", "Bioinformatics", "Chemical Biology",
    "Physical Chemistry", "Biophysical Chemistry", "Mathematical Modeling",
    "Statistical Mechanics", "Molecular Dynamics", "Quantum Chemistry",
    "Structural Biology", "Computational Chemistry", "Drug Design", "Molecular Modeling",
    "Bioinformatics", "Genomics", "Proteomics", "Metabolomics", "Systems Biology",
    "Synthetic Biology", "Protein Engineering", "Enzyme Engineering", "Metabolic Engineering",
    "Nanotechnology", "Nanomedicine", "Nanobiotechnology", "Quantum Dots",
    "Medical Physics", "Radiation Biology", "Radiation Chemistry", "Nuclear Medicine",
    "Imaging Physics", "Medical Imaging", "MRI Physics", "CT Physics", "PET Physics",
    "Laser Physics", "Optical Physics", "Biophotonics", "Medical Lasers",
    "Computational Neuroscience", "Neurophysics", "Brain Modeling", "Neural Networks",
    "Artificial Intelligence in Biology", "Machine Learning in Chemistry",
    "Data Science in Biology", "Big Data in Healthcare", "Health Informatics",
    "Clinical Informatics", "Biomedical Data Science", "Computational Medicine",
    "Precision Medicine", "Personalized Medicine", "Pharmacogenomics", "Bioinformatics",
    
    // Advanced Interdisciplinary Skills (30+ keywords)
    "Machine Learning", "Deep Learning", "Neural Networks", "Artificial Intelligence",
    "Data Science", "Big Data Analytics", "Cloud Computing", "High-Performance Computing",
    "Parallel Computing", "Distributed Computing", "GPU Computing", "Quantum Computing",
    "Statistical Analysis", "Mathematical Modeling", "Computational Modeling",
    "Simulation", "Numerical Methods", "Optimization Algorithms", "Graph Theory",
    "Network Analysis", "Complex Systems", "Chaos Theory", "Fractal Geometry",
    "Information Theory", "Control Theory", "Signal Processing", "Image Processing",
    "Pattern Recognition", "Computer Vision", "Natural Language Processing",
    "Database Systems", "Data Mining", "Knowledge Discovery", "Expert Systems",
    "Decision Support Systems", "Expert Systems", "Knowledge Engineering",
    
    // Laboratory & Research Techniques (20+ keywords)
    "Advanced Microscopy", "Super-Resolution Microscopy", "Cryo-EM", "X-Ray Crystallography",
    "NMR Spectroscopy", "Mass Spectrometry", "Chromatography", "Spectroscopy",
    "Laser Spectroscopy", "Ultrafast Spectroscopy", "Single-Molecule Spectroscopy",
    "Flow Cytometry", "Cell Sorting", "Laser Capture Microdissection", "Microfluidics",
    "Lab-on-a-Chip", "Organ-on-a-Chip", "Tissue Engineering", "3D Bioprinting",
    "Gene Editing", "CRISPR-Cas9", "Gene Synthesis", "Protein Engineering",
    "Directed Evolution", "Rational Design", "High-Throughput Screening",
    "Combinatorial Chemistry", "Parallel Synthesis", "Automated Synthesis",
    "Robotics", "Automation", "Artificial Intelligence in Research"
  ],
  
  advancedRoles: [
    {
      title: "Computational Biophysicist",
      matchThreshold: 85,
      portals: [
        "https://biophysics.org/careers",
        "https://naturecareers.com/biophysics",
        "https://acs.org/careers/computational",
        "https://iscb.org/careers",
        "https://linkedin.com/jobs/computational-biology"
      ],
      gapSkills: ["Molecular Dynamics", "Quantum Chemistry", "Statistical Mechanics", "High-Performance Computing", "Structural Biology"],
      salaryRange: { entry: 110000, mid: 160000, senior: 220000 },
      growthRate: 0.32,
      companies: ["Genentech", "Pfizer", "Novartis", "Google", "Microsoft Research", "IBM Research", "Broad Institute", "MIT"]
    },
    {
      title: "Medical Physicist",
      matchThreshold: 80,
      portals: [
        "https://aapm.org/careers",
        "https://comp.org/careers",
        "https://medicalphysics.org/jobs",
        "https://radiology.org/careers",
        "https://linkedin.com/jobs/medical-physics"
      ],
      gapSkills: ["Radiation Physics", "Medical Imaging", "Dosimetry", "Treatment Planning", "Quality Assurance"],
      salaryRange: { entry: 120000, mid: 180000, senior: 250000 },
      growthRate: 0.18,
      companies: ["Mayo Clinic", "MD Anderson", "Memorial Sloan Kettering", "Varian Medical Systems", "Elekta", "Siemens Healthineers", "GE Healthcare"]
    },
    {
      title: "Quantum Chemist",
      matchThreshold: 82,
      portals: [
        "https://chemistryjobs.com/quantum",
        "https://acs.org/careers/computational",
        "https://rsc.org/careers",
        "https://naturecareers.com/chemistry"
      ],
      gapSkills: ["Quantum Chemistry", "Molecular Modeling", "Computational Chemistry", "DFT", "Ab Initio Methods"],
      salaryRange: { entry: 95000, mid: 140000, senior: 190000 },
      growthRate: 0.25,
      companies: ["Schrodinger", "Dassault Systèmes", "Schrödinger", "BASF", "Dow", "ExxonMobil", "Pfizer", "Merck"]
    },
    {
      title: "Bioinformatics Engineer",
      matchThreshold: 78,
      portals: [
        "https://bioinformatics.org/jobs",
        "https://genomicsjobs.com",
        "https://naturecareers.com/bioinformatics",
        "https://iscb.org/careers"
      ],
      gapSkills: ["Genomics", "Proteomics", "Machine Learning", "Pipeline Development", "Cloud Computing"],
      salaryRange: { entry: 90000, mid: 130000, senior: 180000 },
      growthRate: 0.35,
      companies: ["Illumina", "Thermo Fisher", "23andMe", "Ancestry", "Broad Institute", "Google", "Microsoft", "Amazon"]
    },
    {
      title: "Pharmaceutical Data Scientist",
      matchThreshold: 75,
      portals: [
        "https://pharma-jobs.com/data-science",
        "https://efinancialcareers.com/pharma",
        "https://linkedin.com/jobs/pharmaceutical-data-scientist"
      ],
      gapSkills: ["Pharmaceutical Analytics", "Clinical Trial Analysis", "Regulatory Compliance", "Statistical Programming", "Drug Development"],
      salaryRange: { entry: 100000, mid: 150000, senior: 210000 },
      growthRate: 0.28,
      companies: ["Pfizer", "Johnson & Johnson", "Roche", "Novartis", "Merck", "AstraZeneca", "Bristol Myers Squibb"]
    },
    {
      title: "Neurotechnology Engineer",
      matchThreshold: 83,
      portals: [
        "https://neurotechjobs.com",
        "https://brainjobs.org",
        "https://naturecareers.com/neuroscience",
        "https://sfn.org/careers"
      ],
      gapSkills: ["Neuroscience", "Signal Processing", "Machine Learning", "Brain-Computer Interface", "Neural Engineering"],
      salaryRange: { entry: 105000, mid: 155000, senior: 220000 },
      growthRate: 0.40,
      companies: ["Neuralink", "Kernel", "BrainCo", "Emotiv", "MindMaze", "NeuroSky", "Google", "Facebook Reality Labs"]
    }
  ],
  
  tools: [
    "Gaussian", "VASP", "LAMMPS", "GROMACS", "AMBER", "CHARMM", "NAMD", "Schrödinger Suite",
    "BLAST", "ClustalW", "PhyML", "MEGA", "RaxML", "MrBayes", "BEAST",
    "TensorFlow", "PyTorch", "Scikit-learn", "Keras", "XGBoost", "LightGBM",
    "R", "Python", "MATLAB", "Julia", "SAS", "SPSS", "Stata",
    "VMD", "PyMOL", "Chimera", "UCSF ChimeraX", "VMD", "Jmol",
    "MPI", "OpenMP", "CUDA", "OpenCL", "SLURM", "PBS",
    "Cryo-EM", "X-Ray Crystallography", "NMR", "Mass Spectrometry", "Super-Resolution Microscopy",
    "MRI", "CT", "PET", "SPECT", "Ultrasound", "Linear Accelerators"
  ],
  
  certifications: [
    "Certified Clinical Physicist (ABR)",
    "Certified Health Physicist (ABHP)",
    "Certified Bioinformatics Professional (ASCP)",
    "Certified Clinical Research Professional (CCRP)",
    "Certified Quality Auditor (ASQ)",
    "Certified Data Scientist (INFORMS)",
    "AWS Certified Machine Learning",
    "Google Cloud Professional Data Engineer",
    "Microsoft Certified: Azure Data Scientist",
    "Certified Computational Chemist",
    "Certified Medical Physicist",
    "Certified Radiation Safety Officer"
  ],
  
  educationPaths: [
    "PhD in Computational Biology/Biochemistry",
    "PhD in Biophysics/Medical Physics",
    "PhD in Computational Chemistry/Physics",
    "MD/PhD Combined Programs",
    "Master of Science in Computational Biology",
    "Master of Science in Medical Physics",
    "Master of Science in Bioinformatics",
    "Bachelor of Science in Physics/Chemistry/Biology",
    "Combined BS/MS Programs",
    "Professional Science Master's (PSM) Programs"
  ],
  
  industryFocus: [
    "Pharmaceuticals",
    "Biotechnology",
    "Medical Technology",
    "Healthcare IT",
    "Research Institutions",
    "Government Laboratories",
    "Academic Research",
    "Technology Companies",
    "Consulting",
    "Finance (Quantitative)",
    "Energy",
    "Environmental Science",
    "Agriculture",
    "Food Science",
    "Materials Science"
  ]
};
