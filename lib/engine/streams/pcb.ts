import { AdvancedRole, StreamData } from './pcm';

export const PCBStream: StreamData = {
  id: "pcb",
  title: "Medical & Life Sciences",
  keywords: [
    // Biology (20+ keywords)
    "Molecular Biology", "Genetics", "Cell Biology", "Microbiology", "Biochemistry",
    "Physiology", "Anatomy", "Ecology", "Evolution", "Immunology", "Neuroscience",
    "Developmental Biology", "Structural Biology", "Systems Biology", "Synthetic Biology",
    "Computational Biology", "Bioinformatics", "Genomics", "Proteomics", "Metabolomics",
    "Transcriptomics", "Epigenetics", "Stem Cell Biology", "Virology", "Bacteriology",
    "Mycology", "Parasitology", "Pharmacology", "Toxicology", "Pathology",
    
    // Chemistry (15+ keywords)
    "Organic Chemistry", "Inorganic Chemistry", "Analytical Chemistry", "Physical Chemistry",
    "Biochemistry", "Medicinal Chemistry", "Polymer Chemistry", "Environmental Chemistry",
    "Food Chemistry", "Agricultural Chemistry", "Forensic Chemistry", "Materials Chemistry",
    "Nanotechnology", "Catalysis", "Spectroscopy", "Chromatography", "Electrochemistry",
    "Thermochemistry", "Kinetics", "Equilibrium", "Acid-Base Chemistry", "Organic Synthesis",
    
    // Laboratory Techniques (25+ keywords)
    "PCR", "DNA Sequencing", "RNA Sequencing", "Gene Cloning", "Protein Purification",
    "Cell Culture", "Tissue Culture", "Microscopy", "Electrophoresis", "Chromatography",
    "Spectroscopy", "Mass Spectrometry", "NMR Spectroscopy", "X-Ray Crystallography",
    "Flow Cytometry", "ELISA", "Western Blot", "Southern Blot", "Northern Blot",
    "Gel Electrophoresis", "HPLC", "GC", "LC-MS", "GC-MS", "FTIR", "UV-Vis",
    "Atomic Absorption", "ICP-MS", "XRF", "SEM", "TEM", "AFM", "Confocal Microscopy",
    "Fluorescence Microscopy", "Electron Microscopy", "Light Microscopy",
    
    // Medical & Clinical (15+ keywords)
    "Clinical Research", "Clinical Trials", "Drug Development", "Pharmaceutical Development",
    "Regulatory Affairs", "Quality Assurance", "Quality Control", "GMP", "GLP", "GCP",
    "Medical Devices", "Diagnostics", "Therapeutics", "Biologics", "Vaccines",
    "Antibiotics", "Gene Therapy", "Cell Therapy", "Stem Cell Therapy", "Precision Medicine",
    "Personalized Medicine", "Biomarkers", "Pharmacogenomics", "Clinical Laboratory",
    "Pathology", "Histology", "Cytology", "Hematology", "Clinical Chemistry",
    
    // Research & Analysis (10+ keywords)
    "Statistical Analysis", "Data Analysis", "Bioinformatics", "Computational Biology",
    "Systems Biology", "Network Biology", "Structural Biology", "Molecular Modeling",
    "Drug Design", "Structure-Activity Relationship", "Quantitative Structure-Activity Relationship",
    "Molecular Docking", "Virtual Screening", "High-Throughput Screening", "Assay Development",
    "Validation", "Method Development", "Method Validation", "Standard Operating Procedures"
  ],
  
  advancedRoles: [
    {
      title: "Biomedical Engineer",
      matchThreshold: 80,
      portals: [
        "https://biospace.com/jobs",
        "https://naturecareers.com",
        "https://sciencecareers.org",
        "https://bmescareers.org",
        "https://linkedin.com/jobs/biomedical-engineering"
      ],
      gapSkills: ["Medical Imaging", "Prosthetics Design", "FDA Regulations", "Biomaterials", "Tissue Engineering"],
      salaryRange: { entry: 75000, mid: 110000, senior: 150000 },
      growthRate: 0.18,
      companies: ["Medtronic", "Boston Scientific", "Johnson & Johnson", "GE Healthcare", "Siemens Healthineers", "Philips", "Stryker"]
    },
    {
      title: "Clinical Research Associate",
      matchThreshold: 65,
      portals: [
        "https://sciencecareers.org",
        "https://clinicalresearchjobs.com",
        "https://crajobs.org",
        "https://indeed.com/clinical-research-jobs",
        "https://glassdoor.com/clinical-research-jobs"
      ],
      gapSkills: ["GCP Guidelines", "Clinical Trials Management", "Pharmacovigilance", "Regulatory Compliance", "Medical Writing"],
      salaryRange: { entry: 68000, mid: 88000, senior: 120000 },
      growthRate: 0.15,
      companies: ["Parexel", "PPD", "Covance", "IQVIA", "PRA Health Sciences", "Charles River Laboratories", "Labcorp"]
    },
    {
      title: "Biotechnologist",
      matchThreshold: 75,
      portals: [
        "https://biotech-careers.org",
        "https://geneticengineeringjobs.com",
        "https://biojobs.com",
        "https://naturecareers.com/biotechnology"
      ],
      gapSkills: ["Recombinant DNA Technology", "Protein Engineering", "Cell Culture", "Downstream Processing", "Process Development"],
      salaryRange: { entry: 70000, mid: 95000, senior: 130000 },
      growthRate: 0.28,
      companies: ["Genentech", "Amgen", "Regeneron", "Moderna", "BioNTech", "Pfizer", "Novartis", "Roche"]
    },
    {
      title: "Pharmacologist",
      matchThreshold: 78,
      portals: [
        "https://pharmacologyjobs.com",
        "https://pharma-jobs.com",
        "https://asp.org/careers",
        "https://naturecareers.com/pharmacology"
      ],
      gapSkills: ["Toxicology", "Regulatory Affairs", "Pharmacokinetics", "Drug Development", "Preclinical Studies"],
      salaryRange: { entry: 75000, mid: 105000, senior: 145000 },
      growthRate: 0.22,
      companies: ["Pfizer", "Johnson & Johnson", "Merck", "Roche", "Novartis", "Eli Lilly", "Bristol Myers Squibb", "AstraZeneca"]
    },
    {
      title: "Environmental Chemist",
      matchThreshold: 70,
      portals: [
        "https://environmentaljobs.com",
        "https://chemistryjobs.com/environmental",
        "https://acs.org/careers",
        "https://epa.gov/careers"
      ],
      gapSkills: ["Analytical Instrumentation", "Environmental Regulations", "Waste Management", "Water Quality Analysis", "Air Quality Monitoring"],
      salaryRange: { entry: 65000, mid: 85000, senior: 115000 },
      growthRate: 0.15,
      companies: ["EPA", "Environmental consulting firms", "Waste management companies", "Industrial laboratories", "Government agencies"]
    },
    {
      title: "Bioinformatics Scientist",
      matchThreshold: 82,
      portals: [
        "https://bioinformatics.org/jobs",
        "https://genomicsjobs.com",
        "https://naturecareers.com/bioinformatics",
        "https://iscb.org/careers"
      ],
      gapSkills: ["Computational Biology", "Machine Learning", "Database Management", "Statistical Genetics", "Pipeline Development"],
      salaryRange: { entry: 85000, mid: 115000, senior: 155000 },
      growthRate: 0.35,
      companies: ["Illumina", "Thermo Fisher Scientific", "23andMe", "Ancestry", "Broad Institute", "NCBI", "Genentech"]
    }
  ],
  
  tools: [
    "PCR Machines", "DNA Sequencers", "Mass Spectrometers", "HPLC Systems", "GC Systems",
    "NMR Spectrometers", "Electron Microscopes", "Flow Cytometers", "Cell Counters",
    "Incubators", "Autoclaves", "Centrifuges", "Spectrophotometers", "Fluorometers",
    "Thermal Cyclers", "Gel Electrophoresis Systems", "Western Blot Equipment",
    "Chromatography Software", "Bioinformatics Tools", "Statistical Software",
    "Laboratory Information Management Systems (LIMS)", "Electronic Lab Notebooks"
  ],
  
  certifications: [
    "Certified Clinical Research Associate (CCRA)",
    "Certified Clinical Research Professional (CCRP)",
    "Certified Biotechnology Professional",
    "ASQ Certified Quality Auditor",
    "GLP Certification",
    "GMP Certification",
    "Hazardous Materials Handling",
    "Medical Laboratory Scientist (MLS)",
    "Clinical Laboratory Scientist (CLS)",
    "Certified Toxicologist",
    "Environmental Health and Safety (EHS) Certification"
  ],
  
  educationPaths: [
    "PhD in Molecular Biology/Biochemistry",
    "Master of Science in Biotechnology",
    "Master of Science in Pharmacology",
    "Bachelor of Science in Biology/Chemistry",
    "Bachelor of Science in Biochemistry",
    "Medical Laboratory Science Program",
    "Clinical Research Certification Programs",
    "Regulatory Affairs Certification"
  ],
  
  industryFocus: [
    "Pharmaceuticals",
    "Biotechnology",
    "Medical Devices",
    "Healthcare",
    "Environmental Services",
    "Food and Beverage",
    "Agriculture",
    "Cosmetics",
    "Government Research",
    "Academic Research",
    "Clinical Research Organizations",
    "Contract Research Organizations"
  ]
};
