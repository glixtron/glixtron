export interface StreamData {
  stream: string
  atsKeywords: string[]
  careerPaths: CareerPath[]
  portals: JobPortal[]
  skills: SkillCategory[]
  education: EducationPath[]
  tools: Tool[]
  certifications: Certification[]
  journals: Journal[]
  conferences: Conference[]
}

export interface CareerPath {
  title: string
  demand: 'Low' | 'Medium' | 'High'
  gapRequirements: string[]
  averageSalary: {
    entry: number
    mid: number
    senior: number
  }
  growthRate: number
  requiredSkills: string[]
  companies: string[]
}

export interface JobPortal {
  name: string
  url: string
  focus: string
  features: string[]
}

export interface SkillCategory {
  category: string
  skills: Skill[]
}

export interface Skill {
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  importance: number
  description: string
}

export interface EducationPath {
  degree: string
  specializations: string[]
  duration: string
  prerequisites: string[]
  topInstitutions: string[]
}

export interface Tool {
  name: string
  category: string
  purpose: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

export interface Certification {
  name: string
  provider: string
  duration: string
  cost: string
  validity: string
}

export interface Journal {
  name: string
  publisher: string
  impactFactor: number
  frequency: string
}

export interface Conference {
  name: string
  frequency: string
  location: string
  focus: string
}

export const physicsMathematicsStream: StreamData = {
  stream: 'Physics & Mathematics',
  atsKeywords: [
    'Quantitative Analysis', 'Statistical Modeling', 'Calculus', 
    'Thermodynamics', 'Python', 'MATLAB', 'Data Visualization',
    'Quantum Mechanics', 'Electromagnetism', 'Linear Algebra',
    'Differential Equations', 'Numerical Methods', 'Computational Physics',
    'Statistical Mechanics', 'Optics', 'Astrophysics', 'Particle Physics',
    'Machine Learning', 'Big Data', 'Simulation', 'Modeling'
  ],
  careerPaths: [
    {
      title: 'Data Scientist',
      demand: 'High',
      gapRequirements: ['Machine Learning', 'SQL', 'Big Data Tools', 'Deep Learning', 'NLP'],
      averageSalary: {
        entry: 85000,
        mid: 120000,
        senior: 180000
      },
      growthRate: 0.35,
      requiredSkills: ['Python', 'Statistics', 'Machine Learning', 'Data Visualization', 'SQL'],
      companies: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Tesla']
    },
    {
      title: 'Aerospace Engineer',
      demand: 'Medium',
      gapRequirements: ['CAD Software', 'Structural Analysis', 'Fluid Dynamics', 'Materials Science'],
      averageSalary: {
        entry: 75000,
        mid: 110000,
        senior: 160000
      },
      growthRate: 0.12,
      requiredSkills: ['Physics', 'Mathematics', 'CAD', 'Simulation', 'Programming'],
      companies: ['NASA', 'SpaceX', 'Boeing', 'Lockheed Martin', 'Airbus', 'Blue Origin']
    },
    {
      title: 'Quantitative Analyst (Finance)',
      demand: 'High',
      gapRequirements: ['Stochastic Calculus', 'Financial Modeling', 'C++', 'Risk Management'],
      averageSalary: {
        entry: 120000,
        mid: 200000,
        senior: 350000
      },
      growthRate: 0.25,
      requiredSkills: ['Mathematics', 'Statistics', 'Programming', 'Finance', 'Machine Learning'],
      companies: ['Goldman Sachs', 'JP Morgan', 'Morgan Stanley', 'Citadel', 'Renaissance Technologies']
    },
    {
      title: 'Research Physicist',
      demand: 'Medium',
      gapRequirements: ['Experimental Design', 'Data Analysis', 'Publication', 'Grant Writing'],
      averageSalary: {
        entry: 60000,
        mid: 90000,
        senior: 130000
      },
      growthRate: 0.08,
      requiredSkills: ['Physics', 'Mathematics', 'Programming', 'Research Methods', 'Statistics'],
      companies: ['MIT', 'Stanford', 'Berkeley', 'Caltech', 'Fermilab', 'CERN', 'NASA']
    },
    {
      title: 'Machine Learning Engineer',
      demand: 'High',
      gapRequirements: ['Deep Learning', 'Cloud Platforms', 'MLOps', 'Computer Vision'],
      averageSalary: {
        entry: 95000,
        mid: 140000,
        senior: 200000
      },
      growthRate: 0.40,
      requiredSkills: ['Python', 'Machine Learning', 'Deep Learning', 'Cloud Computing', 'Mathematics'],
      companies: ['Google', 'OpenAI', 'Anthropic', 'Meta', 'Apple', 'Microsoft', 'Amazon']
    }
  ],
  portals: [
    {
      name: 'IEEE Job Site',
      url: 'https://jobs.ieee.org',
      focus: 'Engineering and Technology',
      features: ['Advanced filtering', 'Career resources', 'Networking opportunities', 'Research positions']
    },
    {
      name: 'MathJobs.org',
      url: 'https://www.mathjobs.org',
      focus: 'Mathematics and Statistics',
      features: ['Academic positions', 'Industry roles', 'Postdoc opportunities', 'Faculty positions']
    },
    {
      name: 'Dice (Tech Focus)',
      url: 'https://www.dice.com',
      focus: 'Technology and Data Science',
      features: ['Tech jobs', 'Salary insights', 'Career advice', 'Skill assessments']
    },
    {
      name: 'APS Careers',
      url: 'https://careers.aps.org',
      focus: 'Physics and Astronomy',
      features: ['Physics positions', 'Research jobs', 'Academic careers', 'Industry roles']
    },
    {
      name: 'Kaggle Jobs',
      url: 'https://www.kaggle.com/jobs',
      focus: 'Data Science and ML',
      features: ['Data science competitions', 'ML positions', 'Community networking', 'Skill development']
    }
  ],
  skills: [
    {
      category: 'Mathematical Foundations',
      skills: [
        { name: 'Calculus', level: 'Expert', importance: 10, description: 'Fundamental for physics and advanced mathematics' },
        { name: 'Linear Algebra', level: 'Expert', importance: 9, description: 'Essential for quantum mechanics and machine learning' },
        { name: 'Differential Equations', level: 'Advanced', importance: 9, description: 'Modeling dynamic systems in physics' },
        { name: 'Probability & Statistics', level: 'Advanced', importance: 8, description: 'Data analysis and stochastic processes' },
        { name: 'Complex Analysis', level: 'Intermediate', importance: 7, description: 'Advanced mathematical techniques' }
      ]
    },
    {
      category: 'Physics Concepts',
      skills: [
        { name: 'Quantum Mechanics', level: 'Advanced', importance: 9, description: 'Fundamental physics at atomic scale' },
        { name: 'Thermodynamics', level: 'Advanced', importance: 8, description: 'Heat, work, and energy systems' },
        { name: 'Electromagnetism', level: 'Advanced', importance: 8, description: 'Electric and magnetic phenomena' },
        { name: 'Statistical Mechanics', level: 'Intermediate', importance: 7, description: 'Statistical behavior of particles' },
        { name: 'Optics', level: 'Intermediate', importance: 6, description: 'Light and electromagnetic waves' }
      ]
    },
    {
      category: 'Computational Skills',
      skills: [
        { name: 'Python', level: 'Expert', importance: 10, description: 'Primary programming language for scientific computing' },
        { name: 'MATLAB', level: 'Advanced', importance: 8, description: 'Mathematical computing and simulation' },
        { name: 'R', level: 'Intermediate', importance: 7, description: 'Statistical analysis and data visualization' },
        { name: 'C++', level: 'Intermediate', importance: 7, description: 'High-performance computing' },
        { name: 'Julia', level: 'Beginner', importance: 6, description: 'Emerging language for scientific computing' }
      ]
    },
    {
      category: 'Data Science',
      skills: [
        { name: 'Machine Learning', level: 'Advanced', importance: 9, description: 'Pattern recognition and prediction' },
        { name: 'Data Visualization', level: 'Advanced', importance: 8, description: 'Communicating data insights' },
        { name: 'Big Data Technologies', level: 'Intermediate', importance: 7, description: 'Processing large datasets' },
        { name: 'SQL', level: 'Intermediate', importance: 7, description: 'Database querying and management' },
        { name: 'Deep Learning', level: 'Intermediate', importance: 8, description: 'Neural networks and AI' }
      ]
    }
  ],
  education: [
    {
      degree: 'Bachelor of Science in Physics',
      specializations: ['Astrophysics', 'Quantum Physics', 'Computational Physics', 'Applied Physics'],
      duration: '4 years',
      prerequisites: ['Strong Mathematics', 'Physics', 'Chemistry'],
      topInstitutions: ['MIT', 'Stanford', 'Caltech', 'Berkeley', 'Harvard', 'Princeton']
    },
    {
      degree: 'Bachelor of Science in Mathematics',
      specializations: ['Pure Mathematics', 'Applied Mathematics', 'Statistics', 'Computational Mathematics'],
      duration: '4 years',
      prerequisites: ['Advanced Mathematics', 'Physics', 'Computer Science'],
      topInstitutions: ['MIT', 'Princeton', 'Harvard', 'Stanford', 'Berkeley', 'Chicago']
    },
    {
      degree: 'Master of Science in Data Science',
      specializations: ['Machine Learning', 'Statistics', 'Big Data', 'Computational Finance'],
      duration: '2 years',
      prerequisites: ['Bachelor in STEM', 'Programming', 'Mathematics'],
      topInstitutions: ['Stanford', 'Berkeley', 'CMU', 'MIT', 'Washington', 'Columbia']
    },
    {
      degree: 'PhD in Physics',
      specializations: ['Theoretical Physics', 'Experimental Physics', 'Computational Physics', 'Particle Physics'],
      duration: '5-7 years',
      prerequisites: ['Bachelor/Master in Physics', 'Research Experience', 'Publications'],
      topInstitutions: ['MIT', 'Caltech', 'Stanford', 'Berkeley', 'Harvard', 'Princeton']
    }
  ],
  tools: [
    { name: 'Python (NumPy/SciPy)', category: 'Programming', purpose: 'Scientific computing', difficulty: 'Medium' },
    { name: 'MATLAB', category: 'Software', purpose: 'Mathematical modeling', difficulty: 'Medium' },
    { name: 'R', category: 'Programming', purpose: 'Statistical analysis', difficulty: 'Medium' },
    { name: 'TensorFlow/PyTorch', category: 'ML Framework', purpose: 'Machine learning', difficulty: 'Hard' },
    { name: 'COMSOL', category: 'Simulation', purpose: 'Multiphysics simulation', difficulty: 'Hard' },
    { name: 'Mathematica', category: 'Software', purpose: 'Symbolic computation', difficulty: 'Medium' },
    { name: 'LaTeX', category: 'Documentation', purpose: 'Scientific writing', difficulty: 'Medium' },
    { name: 'Git', category: 'Version Control', purpose: 'Code management', difficulty: 'Easy' },
    { name: 'Docker', category: 'Containerization', purpose: 'Environment management', difficulty: 'Medium' },
    { name: 'AWS/GCP', category: 'Cloud', purpose: 'Cloud computing', difficulty: 'Hard' }
  ],
  certifications: [
    { name: 'AWS Certified Machine Learning', provider: 'Amazon', duration: '3 months', cost: '$300', validity: '3 years' },
    { name: 'Google Cloud ML Engineer', provider: 'Google', duration: '2 months', cost: '$200', validity: '2 years' },
    { name: 'Microsoft Certified: Azure Data Scientist', provider: 'Microsoft', duration: '3 months', cost: '$165', validity: '1 year' },
    { name: 'Certified Analytics Professional', provider: 'INFORMS', duration: '6 months', cost: '$600', validity: '3 years' },
    { name: 'TensorFlow Developer Certificate', provider: 'Google', duration: '2 months', cost: '$100', validity: '2 years' }
  ],
  journals: [
    { name: 'Physical Review Letters', publisher: 'APS', impactFactor: 9.2, frequency: 'Weekly' },
    { name: 'Nature Physics', publisher: 'Nature', impactFactor: 12.5, frequency: 'Monthly' },
    { name: 'Journal of Mathematical Physics', publisher: 'AIP', impactFactor: 1.8, frequency: 'Monthly' },
    { name: 'Science', publisher: 'AAAS', impactFactor: 47.7, frequency: 'Weekly' },
    { name: 'Nature Machine Intelligence', publisher: 'Nature', impactFactor: 25.8, frequency: 'Monthly' }
  ],
  conferences: [
    { name: 'APS March Meeting', frequency: 'Annual', location: 'Various', focus: 'Physics research' },
    { name: 'NeurIPS', frequency: 'Annual', location: 'Various', focus: 'Machine learning' },
    { name: 'ICML', frequency: 'Annual', location: 'Various', focus: 'Machine learning' },
    { name: 'International Congress of Mathematicians', frequency: '4 years', location: 'Various', focus: 'Mathematics' },
    { name: 'AAAI Conference on Artificial Intelligence', frequency: 'Annual', location: 'Various', focus: 'AI research' }
  ]
}
