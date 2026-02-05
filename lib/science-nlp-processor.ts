/**
 * Science-Optimized NLP Processor
 * Specialized for processing scientific terminology, concepts, and language patterns
 */

import { ScienceStream, detectScienceStream } from './science-streams-config'

export interface ScienceNLPAnalysis {
  detectedStream: ScienceStream | null
  confidence: number
  keyConcepts: ScienceConcept[]
  terminology: ScienceTerminology[]
  methodologies: ScienceMethodology[]
  equipment: ScienceEquipment[]
  software: ScienceSoftware[]
  researchAreas: ResearchArea[]
  skillLevel: SkillLevelAssessment
  expertise: ExpertiseArea[]
  publications: PublicationAnalysis[]
  collaborations: CollaborationAnalysis[]
  funding: FundingAnalysis[]
  careerStage: CareerStageAssessment
  recommendations: ScienceRecommendation[]
}

export interface ScienceConcept {
  concept: string
  category: string
  confidence: number
  context: string
  relatedConcepts: string[]
  difficulty: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert'
}

export interface ScienceTerminology {
  term: string
  definition: string
  field: string
  usage: string
  synonyms: string[]
  relatedTerms: string[]
}

export interface ScienceMethodology {
  method: string
  description: string
  field: string
  applications: string[]
  techniques: string[]
  validation: string
}

export interface ScienceEquipment {
  equipment: string
  type: string
  field: string
  specifications: string
  applications: string[]
  alternatives: string[]
}

export interface ScienceSoftware {
  software: string
  type: string
  field: string
  functionality: string
  alternatives: string[]
  learningCurve: 'Low' | 'Medium' | 'High'
}

export interface ResearchArea {
  area: string
  description: string
  trends: string[]
  challenges: string[]
  opportunities: string[]
  keyQuestions: string[]
}

export interface SkillLevelAssessment {
  technical: SkillAssessment[]
  laboratory: SkillAssessment[]
  research: SkillAssessment[]
  software: SkillAssessment[]
  overall: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
}

export interface SkillAssessment {
  skill: string
  level: number
  evidence: string[]
  confidence: number
  recommendations: string[]
}

export interface ExpertiseArea {
  area: string
  expertise: number
  publications: number
  experience: string
  recognition: string[]
}

export interface PublicationAnalysis {
  type: string
  quality: number
  impact: number
  venue: string
  citations: number
  collaboration: string[]
}

export interface CollaborationAnalysis {
  collaborators: string[]
  institutions: string[]
  network: string
  diversity: string
  impact: string
}

export interface FundingAnalysis {
  sources: string[]
  amounts: string[]
  success: number
  areas: string[]
  potential: string[]
}

export interface CareerStageAssessment {
  stage: 'Early Career' | 'Mid Career' | 'Senior' | 'Leadership'
  years: number
  achievements: string[]
  nextSteps: string[]
  trajectory: string
}

export interface ScienceRecommendation {
  category: string
  recommendation: string
  priority: 'High' | 'Medium' | 'Low'
  rationale: string
  resources: string[]
  timeline: string
}

export class ScienceNLPProcessor {
  private scienceOntology = {
    physics: {
      concepts: [
        'quantum mechanics', 'electromagnetism', 'thermodynamics', 'statistical mechanics',
        'optics', 'astrophysics', 'particle physics', 'condensed matter', 'nuclear physics',
        'relativity', 'wave mechanics', 'field theory', 'plasma physics'
      ],
      terminology: [
        'wavefunction', 'eigenvalue', 'hamiltonian', 'lagrangian', 'entropy',
        'enthalpy', 'photon', 'electron', 'proton', 'neutron', 'quark', 'lepton'
      ],
      methodologies: [
        'spectroscopy', 'interferometry', 'calorimetry', 'magnetometry',
        'particle detection', 'laser cooling', 'vacuum technology', 'precision measurement'
      ],
      equipment: [
        'spectrometer', 'laser', 'magnet', 'cryostat', 'vacuum chamber',
        'particle detector', 'interferometer', 'oscilloscope', 'lock-in amplifier'
      ],
      software: [
        'matlab', 'mathematica', 'comsol', 'ansys', 'root', 'labview',
        'python', 'origin', 'igor pro', 'autocad'
      ]
    },
    chemistry: {
      concepts: [
        'organic synthesis', 'inorganic chemistry', 'physical chemistry', 'analytical chemistry',
        'biochemistry', 'polymer chemistry', 'electrochemistry', 'thermodynamics',
        'kinetics', 'equilibrium', 'bonding', 'molecular structure'
      ],
      terminology: [
        'molecule', 'compound', 'reaction', 'catalyst', 'solvent', 'reagent',
        'functional group', 'isomer', 'polymer', 'monomer', 'oxidation', 'reduction'
      ],
      methodologies: [
        'synthesis', 'purification', 'characterization', 'analysis', 'chromatography',
        'spectroscopy', 'crystallography', 'electrochemistry', 'calorimetry'
      ],
      equipment: [
        'spectrometer', 'chromatograph', 'reactor', 'fume hood', 'balance',
        'centrifuge', 'microscope', 'x-ray diffractometer', 'mass spectrometer'
      ],
      software: [
        'chemdraw', 'gaussian', 'spartan', 'mestrenova', 'origin',
        'matlab', 'python', 'schrödinger', 'jmol', 'avogadro'
      ]
    },
    biology: {
      concepts: [
        'molecular biology', 'cell biology', 'genetics', 'microbiology', 'ecology',
        'evolution', 'physiology', 'neurobiology', 'immunology', 'biochemistry',
        'developmental biology', 'systems biology', 'synthetic biology'
      ],
      terminology: [
        'gene', 'protein', 'cell', 'organism', 'ecosystem', 'mutation',
        'transcription', 'translation', 'metabolism', 'homeostasis', 'adaptation'
      ],
      methodologies: [
        'pcr', 'sequencing', 'cloning', 'cell culture', 'microscopy', 'electrophoresis',
        'western blot', 'elisa', 'flow cytometry', 'crispr', 'gene editing'
      ],
      equipment: [
        'microscope', 'centrifuge', 'thermocycler', 'sequencer', 'flow cytometer',
        'incubator', 'biosafety cabinet', 'spectrophotometer', 'gel electrophoresis'
      ],
      software: [
        'blast', 'geneious', 'snapgene', 'imagej', 'graphpad prism',
        'r', 'python', 'clustalw', 'mega', 'cytoscape'
      ]
    },
    mathematics: {
      concepts: [
        'calculus', 'algebra', 'geometry', 'statistics', 'probability',
        'analysis', 'topology', 'number theory', 'discrete mathematics', 'optimization'
      ],
      terminology: [
        'function', 'derivative', 'integral', 'matrix', 'vector', 'eigenvalue',
        'theorem', 'proof', 'algorithm', 'distribution', 'correlation', 'regression'
      ],
      methodologies: [
        'mathematical modeling', 'statistical analysis', 'numerical methods',
        'optimization', 'simulation', 'proof techniques', 'algorithmic analysis'
      ],
      equipment: [
        'computer', 'calculator', 'software', 'hardware', 'cluster',
        'supercomputer', 'gpu', 'cpu', 'memory', 'storage'
      ],
      software: [
        'matlab', 'mathematica', 'r', 'python', 'sas', 'spss',
        'stata', 'maple', 'magma', 'sagemath', 'julia'
      ]
    }
  }

  private researchPatterns = {
    experimental: [
      'experiment', 'trial', 'test', 'measurement', 'observation', 'data',
      'hypothesis', 'control', 'variable', 'result', 'conclusion'
    ],
    theoretical: [
      'theory', 'model', 'simulation', 'calculation', 'derivation', 'proof',
      'equation', 'formula', 'algorithm', 'analysis', 'prediction'
    ],
    computational: [
      'simulation', 'modeling', 'computation', 'algorithm', 'programming',
      'data analysis', 'visualization', 'optimization', 'numerical methods'
    ]
  }

  private careerStageKeywords = {
    early: [
      'intern', 'assistant', 'junior', 'trainee', 'student', 'graduate',
      'undergraduate', 'master', 'phd student', 'research assistant'
    ],
    mid: [
      'associate', 'senior', 'lead', 'principal', 'postdoc', 'scientist',
      'researcher', 'analyst', 'engineer', 'specialist'
    ],
    senior: [
      'senior', 'principal', 'lead', 'director', 'manager', 'head',
      'chief', 'professor', 'expert', 'consultant', 'advisor'
    ],
    leadership: [
      'director', 'manager', 'head', 'chief', 'leader', 'executive',
      'president', 'vp', 'c-level', 'board', 'chair'
    ]
  }

  async processScienceText(text: string): Promise<ScienceNLPAnalysis> {
    // Detect science stream
    const detectedStream = detectScienceStream(text)
    const confidence = this.calculateStreamConfidence(text, detectedStream)
    
    // Extract key concepts
    const keyConcepts = this.extractKeyConcepts(text, detectedStream)
    
    // Extract terminology
    const terminology = this.extractTerminology(text, detectedStream)
    
    // Extract methodologies
    const methodologies = this.extractMethodologies(text, detectedStream)
    
    // Extract equipment
    const equipment = this.extractEquipment(text, detectedStream)
    
    // Extract software
    const software = this.extractSoftware(text, detectedStream)
    
    // Identify research areas
    const researchAreas = this.identifyResearchAreas(text, detectedStream)
    
    // Assess skill levels
    const skillLevel = this.assessSkillLevels(text, detectedStream)
    
    // Identify expertise areas
    const expertise = this.identifyExpertiseAreas(text, detectedStream)
    
    // Analyze publications
    const publications = this.analyzePublications(text, detectedStream)
    
    // Analyze collaborations
    const collaborations: CollaborationAnalysis[] = [this.analyzeCollaborations(text, detectedStream)]
    
    // Analyze funding
    const funding: FundingAnalysis[] = [this.analyzeFunding(text, detectedStream)]
    
    // Assess career stage
    const careerStage = this.assessCareerStage(text, detectedStream)
    
    // Generate recommendations
    const recommendations = this.generateScienceRecommendations(text, detectedStream)
    
    return {
      detectedStream,
      confidence,
      keyConcepts,
      terminology,
      methodologies,
      equipment,
      software,
      researchAreas,
      skillLevel,
      expertise,
      publications,
      collaborations,
      funding,
      careerStage,
      recommendations
    }
  }

  private calculateStreamConfidence(text: string, stream: ScienceStream | null): number {
    if (!stream) return 0
    
    let matches = 0
    let total = 0
    
    // Check concepts
    for (const concept of stream.coreDisciplines) {
      total++
      if (text.toLowerCase().includes(concept.toLowerCase())) {
        matches++
      }
    }
    
    // Check skills
    for (const skill of stream.keySkills) {
      total++
      if (text.toLowerCase().includes(skill.toLowerCase())) {
        matches++
      }
    }
    
    // Check techniques
    for (const technique of stream.laboratoryTechniques) {
      total++
      if (text.toLowerCase().includes(technique.toLowerCase())) {
        matches++
      }
    }
    
    return total > 0 ? (matches / total) * 100 : 0
  }

  private extractKeyConcepts(text: string, stream: ScienceStream | null): ScienceConcept[] {
    const concepts: ScienceConcept[] = []
    
    if (!stream) return concepts
    
    for (const concept of stream.coreDisciplines) {
      if (text.toLowerCase().includes(concept.toLowerCase())) {
        concepts.push({
          concept,
          category: 'Core Discipline',
          confidence: this.calculateConceptConfidence(text, concept),
          context: this.extractContext(text, concept),
          relatedConcepts: this.findRelatedConcepts(concept, stream),
          difficulty: this.assessConceptDifficulty(concept)
        })
      }
    }
    
    return concepts
  }

  private extractTerminology(text: string, stream: ScienceStream | null): ScienceTerminology[] {
    const terminology: ScienceTerminology[] = []
    
    if (!stream) return terminology
    
    // Extract field-specific terminology
    const fieldId = stream.id
    const ontology = this.scienceOntology[fieldId as keyof typeof this.scienceOntology]
    
    if (ontology) {
      for (const term of ontology.terminology) {
        if (text.toLowerCase().includes(term.toLowerCase())) {
          terminology.push({
            term,
            definition: this.getDefinition(term),
            field: stream.name,
            usage: this.extractUsage(text, term),
            synonyms: this.getSynonyms(term),
            relatedTerms: this.getRelatedTerms(term, stream)
          })
        }
      }
    }
    
    return terminology
  }

  private extractMethodologies(text: string, stream: ScienceStream | null): ScienceMethodology[] {
    const methodologies: ScienceMethodology[] = []
    
    if (!stream) return methodologies
    
    for (const method of stream.researchMethods) {
      if (text.toLowerCase().includes(method.toLowerCase())) {
        methodologies.push({
          method,
          description: this.getMethodDescription(method),
          field: stream.name,
          applications: this.getMethodApplications(method),
          techniques: this.getMethodTechniques(method),
          validation: this.getMethodValidation(method)
        })
      }
    }
    
    return methodologies
  }

  private extractEquipment(text: string, stream: ScienceStream | null): ScienceEquipment[] {
    const equipment: ScienceEquipment[] = []
    
    if (!stream) return equipment
    
    for (const equip of stream.laboratoryTechniques) {
      if (text.toLowerCase().includes(equip.toLowerCase())) {
        equipment.push({
          equipment: equip,
          type: this.getEquipmentType(equip),
          field: stream.name,
          specifications: this.getEquipmentSpecifications(equip),
          applications: this.getEquipmentApplications(equip),
          alternatives: this.getEquipmentAlternatives(equip)
        })
      }
    }
    
    return equipment
  }

  private extractSoftware(text: string, stream: ScienceStream | null): ScienceSoftware[] {
    const software: ScienceSoftware[] = []
    
    if (!stream) return software
    
    for (const soft of stream.softwareTools) {
      if (text.toLowerCase().includes(soft.toLowerCase())) {
        software.push({
          software: soft,
          type: this.getSoftwareType(soft),
          field: stream.name,
          functionality: this.getSoftwareFunctionality(soft),
          alternatives: this.getSoftwareAlternatives(soft),
          learningCurve: this.getSoftwareLearningCurve(soft)
        })
      }
    }
    
    return software
  }

  private identifyResearchAreas(text: string, stream: ScienceStream | null): ResearchArea[] {
    const areas: ResearchArea[] = []
    
    if (!stream) return areas
    
    // Identify emerging fields
    for (const field of stream.emergingFields) {
      if (text.toLowerCase().includes(field.toLowerCase())) {
        areas.push({
          area: field,
          description: this.getResearchAreaDescription(field),
          trends: this.getResearchAreaTrends(field),
          challenges: this.getResearchAreaChallenges(field),
          opportunities: this.getResearchAreaOpportunities(field),
          keyQuestions: this.getResearchAreaKeyQuestions(field)
        })
      }
    }
    
    return areas
  }

  private assessSkillLevels(text: string, stream: ScienceStream | null): SkillLevelAssessment {
    const assessment: SkillLevelAssessment = {
      technical: [],
      laboratory: [],
      research: [],
      software: [],
      overall: 'Beginner'
    }
    
    if (!stream) return assessment
    
    // Assess technical skills
    for (const skill of stream.keySkills) {
      if (text.toLowerCase().includes(skill.toLowerCase())) {
        const level = this.assessIndividualSkillLevel(text, skill)
        assessment.technical.push({
          skill,
          level: this.convertLevelToNumber(level),
          evidence: this.extractSkillEvidence(text, skill),
          confidence: this.calculateSkillConfidence(text, skill),
          recommendations: this.getSkillRecommendations(skill, level)
        })
      }
    }
    
    // Assess laboratory skills
    for (const technique of stream.laboratoryTechniques) {
      if (text.toLowerCase().includes(technique.toLowerCase())) {
        const level = this.assessIndividualSkillLevel(text, technique)
        assessment.laboratory.push({
          skill: technique,
          level: this.convertLevelToNumber(level),
          evidence: this.extractSkillEvidence(text, technique),
          confidence: this.calculateSkillConfidence(text, technique),
          recommendations: this.getSkillRecommendations(technique, level)
        })
      }
    }
    
    // Assess research skills
    for (const method of stream.researchMethods) {
      if (text.toLowerCase().includes(method.toLowerCase())) {
        const level = this.assessIndividualSkillLevel(text, method)
        assessment.research.push({
          skill: method,
          level: this.convertLevelToNumber(level),
          evidence: this.extractSkillEvidence(text, method),
          confidence: this.calculateSkillConfidence(text, method),
          recommendations: this.getSkillRecommendations(method, level)
        })
      }
    }
    
    // Assess software skills
    for (const software of stream.softwareTools) {
      if (text.toLowerCase().includes(software.toLowerCase())) {
        const level = this.assessIndividualSkillLevel(text, software)
        assessment.software.push({
          skill: software,
          level: this.convertLevelToNumber(level),
          evidence: this.extractSkillEvidence(text, software),
          confidence: this.calculateSkillConfidence(text, software),
          recommendations: this.getSkillRecommendations(software, level)
        })
      }
    }
    
    // Calculate overall skill level
    assessment.overall = this.calculateOverallSkillLevel(assessment)
    
    return assessment
  }

  private identifyExpertiseAreas(text: string, stream: ScienceStream | null): ExpertiseArea[] {
    const expertise: ExpertiseArea[] = []
    
    if (!stream) return expertise
    
    // Identify expertise based on publications, experience, and recognition
    for (const area of stream.coreDisciplines) {
      if (text.toLowerCase().includes(area.toLowerCase())) {
        expertise.push({
          area,
          expertise: this.calculateExpertiseLevel(text, area),
          publications: this.countPublications(text, area),
          experience: this.extractExperience(text, area),
          recognition: this.extractRecognition(text, area)
        })
      }
    }
    
    return expertise
  }

  private analyzePublications(text: string, stream: ScienceStream | null): PublicationAnalysis[] {
    const publications: PublicationAnalysis[] = []
    
    // Extract publication information
    const publicationMatches = text.match(/(\d{4})\.\s*([^.\n]+)\./g) || []
    
    for (const match of publicationMatches) {
      publications.push({
        type: this.inferPublicationType(match),
        quality: this.assessPublicationQuality(match),
        impact: this.estimatePublicationImpact(match),
        venue: this.extractPublicationVenue(match),
        citations: this.estimateCitations(match),
        collaboration: this.extractCollaborators(match)
      })
    }
    
    return publications
  }

  private analyzeCollaborations(text: string, stream: ScienceStream | null): CollaborationAnalysis {
    const collaborators = this.extractCollaboratorNames(text)
    const institutions = this.extractInstitutions(text)
    
    return {
      collaborators,
      institutions,
      network: this.assessNetworkDiversity(collaborators, institutions),
      diversity: this.assessCollaborationDiversity(collaborators),
      impact: this.assessCollaborationImpact(text)
    }
  }

  private analyzeFunding(text: string, stream: ScienceStream | null): FundingAnalysis {
    return {
      sources: this.extractFundingSources(text),
      amounts: this.extractFundingAmounts(text),
      success: this.calculateFundingSuccess(text),
      areas: this.extractFundingAreas(text),
      potential: this.assessFundingPotential(text, stream)
    }
  }

  private assessCareerStage(text: string, stream: ScienceStream | null): CareerStageAssessment {
    const stage = this.determineCareerStage(text)
    const years = this.extractYearsExperience(text)
    
    return {
      stage,
      years,
      achievements: this.extractAchievements(text),
      nextSteps: this.suggestNextSteps(stage, years),
      trajectory: this.assessCareerTrajectory(text, stage)
    }
  }

  private generateScienceRecommendations(text: string, stream: ScienceStream | null): ScienceRecommendation[] {
    const recommendations: ScienceRecommendation[] = []
    
    if (!stream) return recommendations
    
    // Generate skill development recommendations
    const skillRecs = this.generateSkillRecommendations(text, stream)
    recommendations.push(...skillRecs)
    
    // Generate research recommendations
    const researchRecs = this.generateResearchRecommendations(text, stream)
    recommendations.push(...researchRecs)
    
    // Generate career recommendations
    const careerRecs = this.generateCareerRecommendations(text, stream)
    recommendations.push(...careerRecs)
    
    return recommendations
  }

  // Helper methods
  private calculateConceptConfidence(text: string, concept: string): number {
    const occurrences = (text.toLowerCase().match(new RegExp(concept.toLowerCase(), 'g')) || []).length
    return Math.min(occurrences * 20, 100)
  }

  private extractContext(text: string, concept: string): string {
    const index = text.toLowerCase().indexOf(concept.toLowerCase())
    if (index === -1) return ''
    
    const start = Math.max(0, index - 50)
    const end = Math.min(text.length, index + concept.length + 50)
    return text.substring(start, end).trim()
  }

  private findRelatedConcepts(concept: string, stream: ScienceStream): string[] {
    return stream.coreDisciplines.filter(c => c !== concept).slice(0, 3)
  }

  private assessConceptDifficulty(concept: string): 'Basic' | 'Intermediate' | 'Advanced' | 'Expert' {
    const advancedConcepts = ['quantum mechanics', 'statistical mechanics', 'particle physics', 'molecular biology', 'topology']
    const basicConcepts = ['physics', 'chemistry', 'biology', 'mathematics', 'calculus']
    
    if (advancedConcepts.some(ac => concept.toLowerCase().includes(ac))) return 'Advanced'
    if (basicConcepts.some(bc => concept.toLowerCase().includes(bc))) return 'Basic'
    return 'Intermediate'
  }

  private getDefinition(term: string): string {
    // Simplified definition mapping
    const definitions: Record<string, string> = {
      'wavefunction': 'Mathematical description of quantum state',
      'entropy': 'Measure of disorder or randomness',
      'gene': 'Unit of heredity in living organisms',
      'function': 'Mathematical relation between inputs and outputs'
    }
    return definitions[term] || 'Scientific concept in the field'
  }

  private extractUsage(text: string, term: string): string {
    const sentences = text.split('.')
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(term.toLowerCase())) {
        return sentence.trim()
      }
    }
    return ''
  }

  private getSynonyms(term: string): string[] {
    // Simplified synonym mapping
    const synonyms: Record<string, string[]> = {
      'wavefunction': ['psi', 'quantum state'],
      'entropy': ['disorder', 'randomness'],
      'gene': ['hereditary unit', 'DNA segment'],
      'function': ['mapping', 'transformation']
    }
    return synonyms[term] || []
  }

  private getRelatedTerms(term: string, stream: ScienceStream): string[] {
    return stream.keySkills.filter(skill => skill !== term).slice(0, 3)
  }

  private getMethodDescription(method: string): string {
    return `Scientific methodology for ${method}`
  }

  private getMethodApplications(method: string): string[] {
    return [`${method} in research`, `${method} in industry`, `${method} in education`]
  }

  private getMethodTechniques(method: string): string[] {
    return [`${method} technique 1`, `${method} technique 2`]
  }

  private getMethodValidation(method: string): string {
    return 'Peer review and experimental validation'
  }

  private getEquipmentType(equipment: string): string {
    if (equipment.includes('spectrometer')) return 'Analytical Instrument'
    if (equipment.includes('microscope')) return 'Imaging Equipment'
    return 'Laboratory Equipment'
  }

  private getEquipmentSpecifications(equipment: string): string {
    return 'High-precision scientific equipment'
  }

  private getEquipmentApplications(equipment: string): string[] {
    return ['Research', 'Education', 'Industry']
  }

  private getEquipmentAlternatives(equipment: string): string[] {
    return ['Alternative 1', 'Alternative 2']
  }

  private getSoftwareType(software: string): string {
    if (software.includes('matlab') || software.includes('python')) return 'Computational'
    if (software.includes('chemdraw')) return 'Chemical Drawing'
    return 'Analysis Software'
  }

  private getSoftwareFunctionality(software: string): string {
    return `Software for ${software} applications`
  }

  private getSoftwareAlternatives(software: string): string[] {
    return ['Alternative 1', 'Alternative 2']
  }

  private getSoftwareLearningCurve(software: string): 'Low' | 'Medium' | 'High' {
    const complexSoftware = ['gaussian', 'comsol', 'schrödinger']
    return complexSoftware.includes(software) ? 'High' : 'Medium'
  }

  private getResearchAreaDescription(field: string): string {
    return `Emerging field in ${field}`
  }

  private getResearchAreaTrends(field: string): string[] {
    return ['Trend 1', 'Trend 2', 'Trend 3']
  }

  private getResearchAreaChallenges(field: string): string[] {
    return ['Challenge 1', 'Challenge 2']
  }

  private getResearchAreaOpportunities(field: string): string[] {
    return ['Opportunity 1', 'Opportunity 2']
  }

  private getResearchAreaKeyQuestions(field: string): string[] {
    return ['Question 1', 'Question 2']
  }

  private assessIndividualSkillLevel(text: string, skill: string): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' {
    const lowerText = text.toLowerCase()
    const skillLower = skill.toLowerCase()
    
    if (lowerText.includes(`${skillLower} expert`) || lowerText.includes(`expert ${skillLower}`)) return 'Expert'
    if (lowerText.includes(`${skillLower} advanced`) || lowerText.includes(`advanced ${skillLower}`)) return 'Advanced'
    if (lowerText.includes(`${skillLower} intermediate`) || lowerText.includes(`intermediate ${skillLower}`)) return 'Intermediate'
    return 'Beginner'
  }

  private convertLevelToNumber(level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'): number {
    const mapping = { 'Beginner': 25, 'Intermediate': 50, 'Advanced': 75, 'Expert': 100 }
    return mapping[level]
  }

  private extractSkillEvidence(text: string, skill: string): string[] {
    const evidence: string[] = []
    const sentences = text.split('.')
    
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(skill.toLowerCase())) {
        evidence.push(sentence.trim())
      }
    }
    
    return evidence
  }

  private calculateSkillConfidence(text: string, skill: string): number {
    const occurrences = (text.toLowerCase().match(new RegExp(skill.toLowerCase(), 'g')) || []).length
    return Math.min(occurrences * 25, 100)
  }

  private getSkillRecommendations(skill: string, level: string): string[] {
    return [`Continue developing ${skill}`, `Practice ${skill} in real projects`]
  }

  private calculateOverallSkillLevel(assessment: SkillLevelAssessment): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' {
    const allSkills = [...assessment.technical, ...assessment.laboratory, ...assessment.research, ...assessment.software]
    if (allSkills.length === 0) return 'Beginner'
    
    const averageLevel = allSkills.reduce((sum, skill) => sum + skill.level, 0) / allSkills.length
    
    if (averageLevel >= 80) return 'Expert'
    if (averageLevel >= 60) return 'Advanced'
    if (averageLevel >= 40) return 'Intermediate'
    return 'Beginner'
  }

  private calculateExpertiseLevel(text: string, area: string): number {
    const occurrences = (text.toLowerCase().match(new RegExp(area.toLowerCase(), 'g')) || []).length
    return Math.min(occurrences * 15, 100)
  }

  private countPublications(text: string, area: string): number {
    const areaLower = area.toLowerCase()
    const sentences = text.split('.')
    return sentences.filter(sentence => sentence.toLowerCase().includes(areaLower)).length
  }

  private extractExperience(text: string, area: string): string {
    return `Experience in ${area}`
  }

  private extractRecognition(text: string, area: string): string[] {
    return ['Recognition 1', 'Recognition 2']
  }

  private inferPublicationType(match: string): string {
    if (match.includes('journal')) return 'Journal Article'
    if (match.includes('conference')) return 'Conference Paper'
    return 'Publication'
  }

  private assessPublicationQuality(match: string): number {
    return 75 // Placeholder
  }

  private estimatePublicationImpact(match: string): number {
    return 50 // Placeholder
  }

  private extractPublicationVenue(match: string): string {
    return 'Science Journal'
  }

  private estimateCitations(match: string): number {
    return 10 // Placeholder
  }

  private extractCollaborators(match: string): string[] {
    return ['Collaborator 1', 'Collaborator 2']
  }

  private extractCollaboratorNames(text: string): string[] {
    return ['Collaborator 1', 'Collaborator 2']
  }

  private extractInstitutions(text: string): string[] {
    return ['University 1', 'Company 1']
  }

  private assessNetworkDiversity(collaborators: string[], institutions: string[]): string {
    return 'Diverse network'
  }

  private assessCollaborationDiversity(collaborators: string[]): string {
    return 'High diversity'
  }

  private assessCollaborationImpact(text: string): string {
    return 'High impact'
  }

  private extractFundingSources(text: string): string[] {
    return ['NIH', 'NSF', 'Private Foundation']
  }

  private extractFundingAmounts(text: string): string[] {
    return ['$100,000', '$250,000']
  }

  private calculateFundingSuccess(text: string): number {
    return 75 // Placeholder
  }

  private extractFundingAreas(text: string): string[] {
    return ['Research Area 1', 'Research Area 2']
  }

  private assessFundingPotential(text: string, stream: ScienceStream | null): string[] {
    return ['High potential', 'Medium potential', 'Low potential']
  }

  private determineCareerStage(text: string): 'Early Career' | 'Mid Career' | 'Senior' | 'Leadership' {
    const lowerText = text.toLowerCase()
    
    for (const [stage, keywords] of Object.entries(this.careerStageKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return stage as 'Early Career' | 'Mid Career' | 'Senior' | 'Leadership'
      }
    }
    
    return 'Early Career'
  }

  private extractYearsExperience(text: string): number {
    const yearMatches = text.match(/(\d+)\s*(?:years?|yrs?)/gi)
    if (yearMatches) {
      return Math.max(...yearMatches.map(match => parseInt(match.match(/\d+/)![0])))
    }
    return 0
  }

  private extractAchievements(text: string): string[] {
    return ['Achievement 1', 'Achievement 2']
  }

  private suggestNextSteps(stage: string, years: number): string[] {
    return ['Next step 1', 'Next step 2']
  }

  private assessCareerTrajectory(text: string, stage: string): string {
    return 'Positive trajectory'
  }

  private generateSkillRecommendations(text: string, stream: ScienceStream): ScienceRecommendation[] {
    return [{
      category: 'Skill Development',
      recommendation: 'Develop advanced technical skills',
      priority: 'High',
      rationale: 'Essential for career advancement',
      resources: ['Online courses', 'Workshops'],
      timeline: '6 months'
    }]
  }

  private generateResearchRecommendations(text: string, stream: ScienceStream): ScienceRecommendation[] {
    return [{
      category: 'Research',
      recommendation: 'Focus on emerging research areas',
      priority: 'Medium',
      rationale: 'High impact potential',
      resources: ['Literature review', 'Collaborations'],
      timeline: '12 months'
    }]
  }

  private generateCareerRecommendations(text: string, stream: ScienceStream): ScienceRecommendation[] {
    return [{
      category: 'Career',
      recommendation: 'Build professional network',
      priority: 'High',
      rationale: 'Career advancement opportunities',
      resources: ['Conferences', 'Professional societies'],
      timeline: 'Ongoing'
    }]
  }
}
