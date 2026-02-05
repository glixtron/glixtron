export interface AdvancedRole {
  title: string;
  matchThreshold: number;
  portals: string[];
  gapSkills: string[];
  salaryRange: {
    entry: number;
    mid: number;
    senior: number;
  };
  growthRate: number;
  companies: string[];
}

export interface StreamData {
  id: string;
  title: string;
  keywords: string[];
  advancedRoles: AdvancedRole[];
  tools: string[];
  certifications: string[];
  educationPaths: string[];
  industryFocus: string[];
}

export const PCMStream: StreamData = {
  id: "pcm",
  title: "Engineering & Physical Sciences",
  keywords: [
    // Mathematics (15+ keywords)
    "Calculus", "Linear Algebra", "Differential Equations", "Statistics", "Probability",
    "Discrete Mathematics", "Numerical Methods", "Optimization", "Graph Theory",
    "Complex Analysis", "Real Analysis", "Abstract Algebra", "Topology", "Geometry",
    "Number Theory", "Mathematical Modeling",
    
    // Physics (15+ keywords)
    "Quantum Mechanics", "Electromagnetism", "Thermodynamics", "Statistical Mechanics",
    "Classical Mechanics", "Optics", "Astrophysics", "Particle Physics", "Condensed Matter",
    "Nuclear Physics", "Acoustics", "Fluid Dynamics", "Solid State Physics", "Plasma Physics",
    "Computational Physics",
    
    // Computer Science & Tools (20+ keywords)
    "Python", "MATLAB", "C++", "Java", "R", "Julia", "Mathematica", "Maple",
    "TensorFlow", "PyTorch", "Scikit-learn", "NumPy", "SciPy", "Pandas",
    "Data Structures", "Algorithms", "Machine Learning", "Deep Learning", "Computer Vision",
    "Natural Language Processing", "Data Science", "Artificial Intelligence", "Big Data",
    "Cloud Computing", "Docker", "Kubernetes", "Git", "Linux", "Unix", "Shell Scripting",
    
    // Engineering Tools (15+ keywords)
    "SolidWorks", "AutoCAD", "ANSYS", "COMSOL", "LabVIEW", "Simulink", "CATIA",
    "Finite Element Analysis", "Computational Fluid Dynamics", "Computer-Aided Design",
    "Computer-Aided Manufacturing", "Rapid Prototyping", "3D Printing", "CNC Machining",
    "Robotics", "Control Systems", "Signal Processing", "Image Processing", "Embedded Systems",
    "Microcontrollers", "Circuit Design", "VLSI", "FPGA", "Verilog", "VHDL"
  ],
  
  advancedRoles: [
    {
      title: "Quantum Computing Researcher",
      matchThreshold: 85,
      portals: [
        "https://quantum-computing.ibm.com/jobs",
        "https://physics_today.org/jobs",
        "https://aps.org/careers",
        "https://quantum-jobs.org",
        "https://linkedin.com/jobs/quantum-computing"
      ],
      gapSkills: ["Qiskit", "Linear Algebra", "Complex Analysis", "Quantum Algorithms", "Error Correction"],
      salaryRange: { entry: 120000, mid: 180000, senior: 250000 },
      growthRate: 0.35,
      companies: ["IBM", "Google", "Microsoft", "Amazon", "Intel", "Honeywell", "Rigetti", "IonQ"]
    },
    {
      title: "Data Scientist (Quantitative)",
      matchThreshold: 70,
      portals: [
        "https://kaggle.com/jobs",
        "https://dice.com",
        "https://hired.com",
        "https://levels.fyi",
        "https://angel.co/jobs"
      ],
      gapSkills: ["Statistical Modeling", "SQL", "Pandas", "Machine Learning", "Data Visualization"],
      salaryRange: { entry: 95000, mid: 140000, senior: 200000 },
      growthRate: 0.25,
      companies: ["Google", "Meta", "Amazon", "Netflix", "Spotify", "Airbnb", "Uber", "LinkedIn"]
    },
    {
      title: "Aerospace Engineer",
      matchThreshold: 75,
      portals: [
        "https://aiaa.org/careers",
        "https://aviationweek.com/jobs",
        "https://spacecareers.org",
        "https://nasa.gov/careers",
        "https://spacex.com/careers"
      ],
      gapSkills: ["Aerodynamics", "Propulsion", "Structural Analysis", "CFD", "Materials Science"],
      salaryRange: { entry: 85000, mid: 120000, senior: 160000 },
      growthRate: 0.12,
      companies: ["NASA", "SpaceX", "Boeing", "Lockheed Martin", "Airbus", "Northrop Grumman", "Blue Origin"]
    },
    {
      title: "Quantitative Analyst (Finance)",
      matchThreshold: 80,
      portals: [
        "https://quantnet.com/jobs",
        "https://efinancialcareers.com",
        "https://linkedin.com/jobs/quantitative-analyst",
        "https://glassdoor.com/quant-jobs"
      ],
      gapSkills: ["Stochastic Calculus", "Financial Modeling", "C++", "Risk Management", "Options Pricing"],
      salaryRange: { entry: 130000, mid: 200000, senior: 350000 },
      growthRate: 0.20,
      companies: ["Goldman Sachs", "JP Morgan", "Morgan Stanley", "Citadel", "Renaissance Technologies", "Two Sigma"]
    },
    {
      title: "Machine Learning Engineer",
      matchThreshold: 72,
      portals: [
        "https://mljobs.com",
        "https://ai-jobs.net",
        "https://builtin.com/jobs",
        "https://indeed.com/machine-learning-jobs"
      ],
      gapSkills: ["Deep Learning", "MLOps", "Cloud Platforms", "Computer Vision", "NLP"],
      salaryRange: { entry: 105000, mid: 155000, senior: 220000 },
      growthRate: 0.40,
      companies: ["OpenAI", "Anthropic", "Google", "Meta", "Apple", "Microsoft", "Amazon"]
    }
  ],
  
  tools: [
    "Python", "MATLAB", "R", "Julia", "Mathematica", "Maple", "C++", "Java",
    "TensorFlow", "PyTorch", "Scikit-learn", "NumPy", "SciPy", "Pandas", "Jupyter",
    "SolidWorks", "AutoCAD", "ANSYS", "COMSOL", "LabVIEW", "Simulink", "CATIA",
    "Git", "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Linux", "Unix"
  ],
  
  certifications: [
    "AWS Certified Machine Learning",
    "Google Cloud ML Engineer",
    "Microsoft Certified: Azure Data Scientist",
    "Certified Analytics Professional",
    "TensorFlow Developer Certificate",
    "Professional Engineer (PE)",
    "Certified Computing Professional",
    "Quantitative Finance Certification",
    "CFA Charter",
    "FRM Certification"
  ],
  
  educationPaths: [
    "PhD in Physics/Engineering",
    "Master of Science in Data Science",
    "Master of Engineering",
    "Bachelor of Science in Engineering",
    "Bachelor of Science in Physics/Mathematics",
    "Online Specializations (Coursera, edX)"
  ],
  
  industryFocus: [
    "Technology",
    "Finance",
    "Aerospace & Defense",
    "Research & Development",
    "Consulting",
    "Energy",
    "Manufacturing",
    "Healthcare Technology"
  ]
};
