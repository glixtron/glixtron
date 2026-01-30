/**
 * Field-specific questions for personalized career assessment
 */

export interface FieldQuestion {
  id: string
  question: string
  type: 'single' | 'multiple' | 'text' | 'rating'
  options?: string[]
  category: 'interest' | 'technical' | 'career' | 'skills' | 'preference' | 'experience' | 'goals' | 'industry'
  required?: boolean
}

export const fieldQuestions: Record<string, FieldQuestion[]> = {
  'physics': [
    {
      id: 'physics_1',
      question: 'Based on your background, which area of physics interests you most?',
      type: 'single',
      options: ['Theoretical Physics', 'Applied Physics', 'Experimental Physics', 'Computational Physics'],
      category: 'interest'
    },
    {
      id: 'physics_2',
      question: 'What specific physics concepts do you want to work with?',
      type: 'multiple',
      options: ['Quantum Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Astrophysics', 'Particle Physics', 'Condensed Matter'],
      category: 'technical'
    },
    {
      id: 'physics_3',
      question: 'Are you interested in academic research or industry applications?',
      type: 'single',
      options: ['Academic Research', 'Industry Applications', 'Both', 'Undecided'],
      category: 'career'
    },
    {
      id: 'physics_4',
      question: 'What level of mathematical complexity are you comfortable with?',
      type: 'single',
      options: ['Basic Calculus', 'Advanced Mathematics', 'Complex Mathematical Modeling', 'Theoretical Mathematics'],
      category: 'technical'
    },
    {
      id: 'physics_5',
      question: 'Do you have experience with computational physics or simulation software?',
      type: 'single',
      options: ['No Experience', 'Basic', 'Intermediate', 'Advanced'],
      category: 'skills'
    },
    {
      id: 'physics_6',
      question: 'Which physics-related industries interest you most?',
      type: 'multiple',
      options: ['Aerospace', 'Energy', 'Healthcare', 'Electronics', 'Telecommunications', 'Research Institutes', 'Defense'],
      category: 'industry'
    },
    {
      id: 'physics_7',
      question: 'Are you interested in emerging fields like quantum computing or nanotechnology?',
      type: 'single',
      options: ['Very Interested', 'Somewhat Interested', 'Neutral', 'Not Interested'],
      category: 'interest'
    },
    {
      id: 'physics_8',
      question: 'What type of work environment do you prefer?',
      type: 'single',
      options: ['Laboratory Research', 'Theoretical Work', 'Field Applications', 'Mixed Environment'],
      category: 'preference'
    },
    {
      id: 'physics_9',
      question: 'How important is publishing research papers to your career goals?',
      type: 'single',
      options: ['Very Important', 'Important', 'Somewhat Important', 'Not Important'],
      category: 'goals'
    },
    {
      id: 'physics_10',
      question: 'Are you interested in teaching physics at any level?',
      type: 'single',
      options: ['University Level', 'High School', 'Corporate Training', 'Not Interested in Teaching'],
      category: 'career'
    },
    {
      id: 'physics_11',
      question: 'What specific physics equipment or instruments have you worked with?',
      type: 'text',
      category: 'experience'
    },
    {
      id: 'physics_12',
      question: 'Are you interested in interdisciplinary fields combining physics with other sciences?',
      type: 'multiple',
      options: ['Biophysics', 'Chemical Physics', 'Geophysics', 'Astrophysics', 'Medical Physics', 'Materials Science'],
      category: 'interest'
    },
    {
      id: 'physics_13',
      question: 'What is your experience with data analysis in physics research?',
      type: 'single',
      options: ['No Experience', 'Basic Data Analysis', 'Statistical Analysis', 'Advanced Data Science'],
      category: 'skills'
    },
    {
      id: 'physics_14',
      question: 'Are you interested in renewable energy or sustainable physics applications?',
      type: 'single',
      options: ['Very Interested', 'Somewhat Interested', 'Neutral', 'Not Interested'],
      category: 'interest'
    },
    {
      id: 'physics_15',
      question: 'What programming languages do you use for physics simulations?',
      type: 'multiple',
      options: ['Python', 'MATLAB', 'C++', 'Fortran', 'Julia', 'R'],
      category: 'technical'
    }
  ],
  
  'chemistry': [
    {
      id: 'chemistry_1',
      question: 'Which area of chemistry interests you most?',
      type: 'single',
      options: ['Organic Chemistry', 'Inorganic Chemistry', 'Analytical Chemistry', 'Physical Chemistry', 'Biochemistry'],
      category: 'interest'
    },
    {
      id: 'chemistry_2',
      question: 'What type of laboratory work do you prefer?',
      type: 'single',
      options: ['Synthesis', 'Analysis', 'Quality Control', 'Research & Development'],
      category: 'preference'
    },
    {
      id: 'chemistry_3',
      question: 'Are you interested in pharmaceutical research or industrial chemistry?',
      type: 'single',
      options: ['Pharmaceutical Research', 'Industrial Chemistry', 'Both', 'Neither'],
      category: 'career'
    },
    {
      id: 'chemistry_4',
      question: 'What analytical techniques are you proficient in?',
      type: 'multiple',
      options: ['Chromatography', 'Spectroscopy', 'Mass Spectrometry', 'NMR', 'X-ray Crystallography', 'Electrochemistry'],
      category: 'skills'
    },
    {
      id: 'chemistry_5',
      question: 'Do you have experience with green chemistry or sustainable processes?',
      type: 'single',
      options: ['Extensive Experience', 'Some Experience', 'Basic Knowledge', 'No Experience'],
      category: 'experience'
    },
    {
      id: 'chemistry_6',
      question: 'Which chemistry-related industries interest you most?',
      type: 'multiple',
      options: ['Pharmaceuticals', 'Petrochemicals', 'Food & Beverage', 'Cosmetics', 'Environmental', 'Materials Science'],
      category: 'industry'
    },
    {
      id: 'chemistry_7',
      question: 'Are you interested in computational chemistry or molecular modeling?',
      type: 'single',
      options: ['Very Interested', 'Somewhat Interested', 'Neutral', 'Not Interested'],
      category: 'interest'
    },
    {
      id: 'chemistry_8',
      question: 'What level of safety protocols and regulations are you familiar with?',
      type: 'single',
      options: ['Basic Safety', 'Industry Standards', 'Regulatory Compliance', 'Advanced Safety Management'],
      category: 'skills'
    },
    {
      id: 'chemistry_9',
      question: 'Are you interested in developing new materials or chemical processes?',
      type: 'single',
      options: ['New Materials Development', 'Process Development', 'Both', 'Neither'],
      category: 'career'
    },
    {
      id: 'chemistry_10',
      question: 'Do you prefer working with small molecules or large biomolecules?',
      type: 'single',
      options: ['Small Molecules', 'Large Biomolecules', 'Both', 'No Preference'],
      category: 'preference'
    },
    {
      id: 'chemistry_11',
      question: 'What specific research areas in chemistry excite you most?',
      type: 'text',
      category: 'interest'
    },
    {
      id: 'chemistry_12',
      question: 'Are you interested in regulatory affairs or quality assurance roles?',
      type: 'single',
      options: ['Very Interested', 'Somewhat Interested', 'Neutral', 'Not Interested'],
      category: 'career'
    },
    {
      id: 'chemistry_13',
      question: 'What is your experience with polymer chemistry or materials science?',
      type: 'single',
      options: ['No Experience', 'Basic', 'Intermediate', 'Advanced'],
      category: 'skills'
    },
    {
      id: 'chemistry_14',
      question: 'Are you interested in environmental chemistry or sustainability?',
      type: 'single',
      options: ['Very Interested', 'Somewhat Interested', 'Neutral', 'Not Interested'],
      category: 'interest'
    },
    {
      id: 'chemistry_15',
      question: 'What laboratory automation or instrumentation experience do you have?',
      type: 'text',
      category: 'experience'
    }
  ],
  
  'biology': [
    {
      id: 'biology_1',
      question: 'Which area of biology interests you most?',
      type: 'single',
      options: ['Molecular Biology', 'Ecology', 'Genetics', 'Physiology', 'Microbiology', 'Biotechnology'],
      category: 'interest'
    },
    {
      id: 'biology_2',
      question: 'Do you prefer laboratory research, field work, or computational biology?',
      type: 'single',
      options: ['Laboratory Research', 'Field Work', 'Computational Biology', 'Mixed Approach'],
      category: 'preference'
    },
    {
      id: 'biology_3',
      question: 'Are you interested in medical/biomedical research or environmental biology?',
      type: 'single',
      options: ['Medical/Biomedical Research', 'Environmental Biology', 'Both', 'Neither'],
      category: 'career'
    },
    {
      id: 'biology_4',
      question: 'What laboratory techniques are you proficient in?',
      type: 'multiple',
      options: ['PCR', 'DNA Sequencing', 'Cell Culture', 'Microscopy', 'Protein Analysis', 'Bioinformatics'],
      category: 'skills'
    },
    {
      id: 'biology_5',
      question: 'Are you interested in biotechnology and genetic engineering?',
      type: 'single',
      options: ['Very Interested', 'Somewhat Interested', 'Neutral', 'Not Interested'],
      category: 'interest'
    },
    {
      id: 'biology_6',
      question: 'Which biology-related industries interest you most?',
      type: 'multiple',
      options: ['Pharmaceuticals', 'Biotechnology', 'Healthcare', 'Agriculture', 'Environmental Conservation', 'Food Science'],
      category: 'industry'
    },
    {
      id: 'biology_7',
      question: 'Do you have experience with bioinformatics or computational biology tools?',
      type: 'single',
      options: ['Extensive Experience', 'Some Experience', 'Basic Knowledge', 'No Experience'],
      category: 'skills'
    },
    {
      id: 'biology_8',
      question: 'Are you interested in wildlife biology or conservation work?',
      type: 'single',
      options: ['Very Interested', 'Somewhat Interested', 'Neutral', 'Not Interested'],
      category: 'interest'
    },
    {
      id: 'biology_9',
      question: 'What level of statistical analysis are you comfortable with for biological data?',
      type: 'single',
      options: ['Basic Statistics', 'Intermediate Analysis', 'Advanced Statistical Modeling', 'Expert Level'],
      category: 'skills'
    },
    {
      id: 'biology_10',
      question: 'Are you interested in clinical research or drug development?',
      type: 'single',
      options: ['Clinical Research', 'Drug Development', 'Both', 'Neither'],
      category: 'career'
    },
    {
      id: 'biology_11',
      question: 'What specific biological systems or organisms interest you most?',
      type: 'text',
      category: 'interest'
    },
    {
      id: 'biology_12',
      question: 'Are you interested in teaching biology or science communication?',
      type: 'single',
      options: ['University Teaching', 'High School Teaching', 'Science Communication', 'Not Interested in Teaching'],
      category: 'career'
    },
    {
      id: 'biology_13',
      question: 'What is your experience with CRISPR or gene editing technologies?',
      type: 'single',
      options: ['No Experience', 'Basic', 'Intermediate', 'Advanced'],
      category: 'skills'
    },
    {
      id: 'biology_14',
      question: 'Are you interested in marine biology or aquatic sciences?',
      type: 'single',
      options: ['Very Interested', 'Somewhat Interested', 'Neutral', 'Not Interested'],
      category: 'interest'
    },
    {
      id: 'biology_15',
      question: 'What specific research projects have you worked on in biology?',
      type: 'text',
      category: 'experience'
    }
  ],
  
  'mathematics': [
    {
      id: 'math_1',
      question: 'Which area of mathematics interests you most?',
      type: 'single',
      options: ['Pure Mathematics', 'Applied Mathematics', 'Statistics', 'Computational Mathematics'],
      category: 'interest'
    },
    {
      id: 'math_2',
      question: 'Are you interested in theoretical research or practical applications?',
      type: 'single',
      options: ['Theoretical Research', 'Practical Applications', 'Both', 'Undecided'],
      category: 'career'
    },
    {
      id: 'math_3',
      question: 'What level of mathematical proof and theory are you comfortable with?',
      type: 'single',
      options: ['Basic Proofs', 'Advanced Theory', 'Abstract Mathematics', 'Cutting-edge Research'],
      category: 'skills'
    },
    {
      id: 'math_4',
      question: 'Are you interested in data science and machine learning applications?',
      type: 'single',
      options: ['Very Interested', 'Somewhat Interested', 'Neutral', 'Not Interested'],
      category: 'interest'
    },
    {
      id: 'math_5',
      question: 'What mathematical software or programming languages are you proficient in?',
      type: 'multiple',
      options: ['MATLAB', 'Python', 'R', 'Mathematica', 'SAS', 'Stata', 'Julia'],
      category: 'skills'
    },
    {
      id: 'math_6',
      question: 'Which mathematics-related industries interest you most?',
      type: 'multiple',
      options: ['Finance', 'Technology', 'Research', 'Education', 'Insurance', 'Consulting', 'Gaming'],
      category: 'industry'
    },
    {
      id: 'math_7',
      question: 'Are you interested in financial mathematics or quantitative analysis?',
      type: 'single',
      options: ['Very Interested', 'Somewhat Interested', 'Neutral', 'Not Interested'],
      category: 'interest'
    },
    {
      id: 'math_8',
      question: 'What level of statistical analysis are you comfortable with?',
      type: 'single',
      options: ['Basic Statistics', 'Intermediate Analysis', 'Advanced Statistics', 'Expert Level'],
      category: 'skills'
    },
    {
      id: 'math_9',
      question: 'Are you interested in cryptography or cybersecurity applications?',
      type: 'single',
      options: ['Very Interested', 'Somewhat Interested', 'Neutral', 'Not Interested'],
      category: 'interest'
    },
    {
      id: 'math_10',
      question: 'Do you prefer working with discrete mathematics or continuous mathematics?',
      type: 'single',
      options: ['Discrete Mathematics', 'Continuous Mathematics', 'Both', 'No Preference'],
      category: 'preference'
    },
    {
      id: 'math_11',
      question: 'What specific mathematical problems or theorems interest you most?',
      type: 'text',
      category: 'interest'
    },
    {
      id: 'math_12',
      question: 'Are you interested in mathematical modeling and simulation?',
      type: 'single',
      options: ['Very Interested', 'Somewhat Interested', 'Neutral', 'Not Interested'],
      category: 'interest'
    },
    {
      id: 'math_13',
      question: 'What is your experience with optimization algorithms?',
      type: 'single',
      options: ['No Experience', 'Basic', 'Intermediate', 'Advanced'],
      category: 'skills'
    },
    {
      id: 'math_14',
      question: 'Are you interested in teaching mathematics at any level?',
      type: 'single',
      options: ['University Level', 'High School', 'Corporate Training', 'Not Interested in Teaching'],
      category: 'career'
    },
    {
      id: 'math_15',
      question: 'What specific mathematical modeling projects have you completed?',
      type: 'text',
      category: 'experience'
    }
  ],
  
  'computer-science': [
    {
      id: 'cs_1',
      question: 'Which area of computer science interests you most?',
      type: 'single',
      options: ['Software Development', 'AI/Machine Learning', 'Cybersecurity', 'Data Science', 'Cloud Computing'],
      category: 'interest'
    },
    {
      id: 'cs_2',
      question: 'What programming languages are you most proficient in?',
      type: 'multiple',
      options: ['Python', 'JavaScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'TypeScript', 'Swift', 'Kotlin'],
      category: 'skills'
    },
    {
      id: 'cs_3',
      question: 'Are you interested in frontend development, backend development, or full-stack?',
      type: 'single',
      options: ['Frontend Development', 'Backend Development', 'Full-stack Development', 'DevOps'],
      category: 'preference'
    },
    {
      id: 'cs_4',
      question: 'What level of experience do you have with cloud platforms?',
      type: 'single',
      options: ['No Experience', 'Basic', 'Intermediate', 'Advanced'],
      category: 'skills'
    },
    {
      id: 'cs_5',
      question: 'Are you interested in artificial intelligence and machine learning?',
      type: 'single',
      options: ['Very Interested', 'Somewhat Interested', 'Neutral', 'Not Interested'],
      category: 'interest'
    },
    {
      id: 'cs_6',
      question: 'Which technology industries interest you most?',
      type: 'multiple',
      options: ['FinTech', 'HealthTech', 'EdTech', 'E-commerce', 'Gaming', 'Social Media', 'Automotive'],
      category: 'industry'
    },
    {
      id: 'cs_7',
      question: 'What level of database experience do you have?',
      type: 'single',
      options: ['Basic SQL', 'Advanced SQL', 'NoSQL Databases', 'Database Administration'],
      category: 'skills'
    },
    {
      id: 'cs_8',
      question: 'Are you interested in mobile app development or web development?',
      type: 'single',
      options: ['Mobile App Development', 'Web Development', 'Both', 'Neither'],
      category: 'preference'
    },
    {
      id: 'cs_9',
      question: 'Do you have experience with version control systems like Git?',
      type: 'single',
      options: ['No Experience', 'Basic', 'Intermediate', 'Advanced'],
      category: 'skills'
    },
    {
      id: 'cs_10',
      question: 'Are you interested in blockchain or cryptocurrency technologies?',
      type: 'single',
      options: ['Very Interested', 'Somewhat Interested', 'Neutral', 'Not Interested'],
      category: 'interest'
    },
    {
      id: 'cs_11',
      question: 'What specific software projects have you worked on?',
      type: 'text',
      category: 'experience'
    },
    {
      id: 'cs_12',
      question: 'Are you interested in startup environments or established tech companies?',
      type: 'single',
      options: ['Startup Environment', 'Established Tech Company', 'Both', 'No Preference'],
      category: 'career'
    },
    {
      id: 'cs_13',
      question: 'What is your experience with containerization and orchestration?',
      type: 'single',
      options: ['No Experience', 'Basic Docker', 'Docker + Kubernetes', 'Advanced DevOps'],
      category: 'skills'
    },
    {
      id: 'cs_14',
      question: 'Are you interested in quantum computing or advanced algorithms?',
      type: 'single',
      options: ['Very Interested', 'Somewhat Interested', 'Neutral', 'Not Interested'],
      category: 'interest'
    },
    {
      id: 'cs_15',
      question: 'What frameworks or libraries have you worked with extensively?',
      type: 'text',
      category: 'experience'
    }
  ],
  
  'environmental-science': [
    {
      id: 'env_1',
      question: 'Which area of environmental science interests you most?',
      type: 'single',
      options: ['Climate Science', 'Ecology', 'Environmental Policy', 'Sustainability', 'Conservation Biology'],
      category: 'interest'
    },
    {
      id: 'env_2',
      question: 'Do you prefer field work, laboratory research, or policy analysis?',
      type: 'single',
      options: ['Field Work', 'Laboratory Research', 'Policy Analysis', 'Mixed Approach'],
      category: 'preference'
    },
    {
      id: 'env_3',
      question: 'Are you interested in climate change research or environmental conservation?',
      type: 'single',
      options: ['Climate Change Research', 'Environmental Conservation', 'Both', 'Neither'],
      category: 'career'
    },
    {
      id: 'env_4',
      question: 'What environmental monitoring techniques are you familiar with?',
      type: 'multiple',
      options: ['Remote Sensing', 'GIS', 'Water Quality Testing', 'Air Quality Monitoring', 'Biodiversity Assessment'],
      category: 'skills'
    },
    {
      id: 'env_5',
      question: 'Do you have experience with environmental impact assessments?',
      type: 'single',
      options: ['Extensive Experience', 'Some Experience', 'Basic Knowledge', 'No Experience'],
      category: 'experience'
    },
    {
      id: 'env_6',
      question: 'Which environmental sectors interest you most?',
      type: 'multiple',
      options: ['Renewable Energy', 'Waste Management', 'Water Resources', 'Air Quality', 'Land Management', 'Marine Conservation'],
      category: 'industry'
    },
    {
      id: 'env_7',
      question: 'Are you interested in environmental policy and regulations?',
      type: 'single',
      options: ['Very Interested', 'Somewhat Interested', 'Neutral', 'Not Interested'],
      category: 'interest'
    },
    {
      id: 'env_8',
      question: 'What level of GIS and remote sensing skills do you have?',
      type: 'single',
      options: ['No Experience', 'Basic', 'Intermediate', 'Advanced'],
      category: 'skills'
    },
    {
      id: 'env_9',
      question: 'Are you interested in renewable energy or sustainable technologies?',
      type: 'single',
      options: ['Renewable Energy', 'Sustainable Technologies', 'Both', 'Neither'],
      category: 'career'
    },
    {
      id: 'env_10',
      question: 'Do you prefer working with urban or rural environmental issues?',
      type: 'single',
      options: ['Urban Environmental Issues', 'Rural Environmental Issues', 'Both', 'No Preference'],
      category: 'preference'
    },
    {
      id: 'env_11',
      question: 'What specific environmental research have you conducted?',
      type: 'text',
      category: 'experience'
    },
    {
      id: 'env_12',
      question: 'Are you interested in environmental education or advocacy?',
      type: 'single',
      options: ['Environmental Education', 'Environmental Advocacy', 'Both', 'Neither'],
      category: 'career'
    },
    {
      id: 'env_13',
      question: 'What is your experience with environmental data analysis?',
      type: 'single',
      options: ['No Experience', 'Basic Analysis', 'Statistical Analysis', 'Advanced Modeling'],
      category: 'skills'
    },
    {
      id: 'env_14',
      question: 'Are you interested in corporate sustainability or environmental consulting?',
      type: 'single',
      options: ['Corporate Sustainability', 'Environmental Consulting', 'Both', 'Neither'],
      category: 'career'
    },
    {
      id: 'env_15',
      question: 'What environmental challenges are you most passionate about addressing?',
      type: 'text',
      category: 'interest'
    }
  ]
}

/**
 * Get questions for a specific field
 */
export function getFieldQuestions(field: string): FieldQuestion[] {
  return fieldQuestions[field] || fieldQuestions['physics']
}

/**
 * Get questions by category for a field
 */
export function getQuestionsByCategory(field: string, category: string): FieldQuestion[] {
  const questions = getFieldQuestions(field)
  return questions.filter(q => q.category === category)
}

/**
 * Get required questions for a field
 */
export function getRequiredQuestions(field: string): FieldQuestion[] {
  const questions = getFieldQuestions(field)
  return questions.filter(q => q.required)
}

/**
 * Get total number of questions for a field
 */
export function getTotalQuestions(field: string): number {
  return getFieldQuestions(field).length
}
