#!/usr/bin/env python3
"""
Science Stream Career Assessment System
Local script-based implementation without external APIs
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import sys
import os

# Simulated local AI/ML models (using rule-based + pattern matching)
class LocalAIEngine:
    """Local rule-based AI simulation for processing"""
    
    def __init__(self):
        # Knowledge base for career mapping
        self.career_knowledge = self._load_knowledge_base()
        self.skill_patterns = self._load_skill_patterns()
        
    def _load_knowledge_base(self):
        """Local career knowledge base"""
        return {
            'fields': {
                'cs': {
                    'name': 'Computer Science',
                    'specializations': ['AI/ML', 'Web Development', 'Data Science', 'Cybersecurity', 'Cloud Computing'],
                    'careers': ['Software Engineer', 'Data Scientist', 'ML Engineer', 'DevOps Engineer'],
                    'skills': ['python', 'java', 'javascript', 'sql', 'algorithm', 'data structure'],
                    'roadmap': {
                        'short_term': 'Learn programming fundamentals, build projects',
                        'mid_term': 'Specialize in chosen field, contribute to open source',
                        'long_term': 'Senior/Lead roles, architecture design, management'
                    }
                },
                'bio': {
                    'name': 'Biology/Biotech',
                    'specializations': ['Genetics', 'Bioinformatics', 'Pharmaceuticals', 'Environmental Bio'],
                    'careers': ['Research Scientist', 'Lab Manager', 'Biotech Analyst', 'Clinical Researcher'],
                    'skills': ['molecular biology', 'genetics', 'lab techniques', 'data analysis'],
                    'roadmap': {
                        'short_term': 'Master lab techniques, research methodology',
                        'mid_term': 'Specialize research, publish papers',
                        'long_term': 'Lead research teams, commercial applications'
                    }
                },
                'physics': {
                    'name': 'Physics',
                    'specializations': ['Quantum', 'Astrophysics', 'Material Science', 'Applied Physics'],
                    'careers': ['Research Scientist', 'Data Analyst', 'Engineer', 'Academic'],
                    'skills': ['mathematics', 'simulation', 'data analysis', 'research'],
                    'roadmap': {
                        'short_term': 'Advanced mathematics, research projects',
                        'mid_term': 'Specialized research, computational skills',
                        'long_term': 'Research leadership, industry applications'
                    }
                },
                'chemistry': {
                    'name': 'Chemistry',
                    'specializations': ['Organic', 'Inorganic', 'Analytical', 'Environmental'],
                    'careers': ['Chemist', 'Researcher', 'Quality Control', 'Environmental Analyst'],
                    'skills': ['lab techniques', 'chemical analysis', 'instrumentation', 'safety'],
                    'roadmap': {
                        'short_term': 'Master lab techniques, chemical analysis',
                        'mid_term': 'Specialize in chosen field, research experience',
                        'long_term': 'Lead research, industrial applications'
                    }
                },
                'math': {
                    'name': 'Mathematics',
                    'specializations': ['Applied Math', 'Statistics', 'Actuarial Science', 'Operations Research'],
                    'careers': ['Data Analyst', 'Statistician', 'Actuary', 'Quantitative Analyst'],
                    'skills': ['statistics', 'calculus', 'linear algebra', 'modeling'],
                    'roadmap': {
                        'short_term': 'Advanced mathematics, programming basics',
                        'mid_term': 'Specialize in applications, real-world projects',
                        'long_term': 'Senior analytical roles, research leadership'
                    }
                }
            }
        }
    
    def _load_skill_patterns(self):
        """Patterns to identify skills from text"""
        return {
            'programming': [r'python', r'java', r'javascript', r'c\+\+', r'c#', r'sql', r'html', r'css'],
            'data_science': [r'machine learning', r'data analysis', r'statistics', r'pandas', r'numpy', r'tensorflow'],
            'biology': [r'biology', r'genetics', r'microbiology', r'biochemistry', r'lab', r'research'],
            'physics': [r'physics', r'quantum', r'mechanics', r'astrophysics', r'calculus'],
            'chemistry': [r'chemistry', r'organic', r'inorganic', r'analytical', r'laboratory'],
            'mathematics': [r'calculus', r'algebra', r'statistics', r'probability', r'modeling'],
            'soft_skills': [r'leadership', r'communication', r'teamwork', r'problem solving', r'critical thinking']
        }
    
    def extract_field(self, text):
        """Identify primary field from text"""
        text_lower = text.lower()
        field_scores = {}
        
        for field_id, field_info in self.career_knowledge['fields'].items():
            score = 0
            # Check for field name
            if field_info['name'].lower() in text_lower:
                score += 3
            # Check for skills
            for skill in field_info['skills']:
                if skill in text_lower:
                    score += 2
            # Check for specializations
            for spec in field_info['specializations']:
                if spec.lower() in text_lower:
                    score += 1.5
            
            if score > 0:
                field_scores[field_id] = score
        
        if field_scores:
            return max(field_scores.items(), key=lambda x: x[1])
        return ('cs', 0)  # Default to CS
    
    def generate_questions(self, field_id, resume_data):
        """Generate field-specific questions"""
        base_questions = []
        field_info = self.career_knowledge['fields'].get(field_id, self.career_knowledge['fields']['cs'])
        
        if field_id == 'cs':
            base_questions = [
                {
                    "id": 1,
                    "question": f"Your background in {field_info['name']} shows technical aptitude. Which specialization interests you most?",
                    "options": field_info['specializations'],
                    "type": "specialization",
                    "weight": 5
                },
                {
                    "id": 2,
                    "question": "How do you prefer to apply your technical skills?",
                    "options": ["Building Applications", "Data Analysis", "Research & Development", "System Architecture"],
                    "type": "application_preference",
                    "weight": 4
                },
                {
                    "id": 3,
                    "question": "Which emerging technology area excites you most?",
                    "options": ["Quantum Computing", "AI Ethics", "Blockchain Applications", "Edge Computing"],
                    "type": "emerging_tech",
                    "weight": 3
                },
                {
                    "id": 4,
                    "question": "What's your preferred project scale?",
                    "options": ["Startup/Small Projects", "Enterprise Systems", "Open Source Contributions", "Academic Research"],
                    "type": "project_scale",
                    "weight": 3
                },
                {
                    "id": 5,
                    "question": "How important is continuous learning vs mastery?",
                    "options": ["Always learning new tech", "Master specific domain", "Balance of both", "Depends on project"],
                    "type": "learning_style",
                    "weight": 2
                }
            ]
        elif field_id == 'bio':
            base_questions = [
                {
                    "id": 1,
                    "question": f"Your {field_info['name']} background suggests research aptitude. Which area appeals most?",
                    "options": field_info['specializations'],
                    "type": "research_area",
                    "weight": 5
                },
                {
                    "id": 2,
                    "question": "Preference for computational vs experimental biology?",
                    "options": ["Computational/Bioinformatics", "Wet Lab Experimental", "Combination Approach", "Field Research"],
                    "type": "methodology",
                    "weight": 4
                },
                {
                    "id": 3,
                    "question": "Which application area interests you most?",
                    "options": ["Healthcare/Medicine", "Agriculture", "Environmental Conservation", "Industrial Biotech"],
                    "type": "application_domain",
                    "weight": 4
                },
                {
                    "id": 4,
                    "question": "Interest level in emerging biotech fields?",
                    "options": ["High - Gene Editing", "Moderate - Synthetic Bio", "Academic Research", "Applied/Industrial"],
                    "type": "emerging_fields",
                    "weight": 3
                },
                {
                    "id": 5,
                    "question": "Career setting preference?",
                    "options": ["Academic Research", "Pharmaceutical Industry", "Government Agency", "Startup Environment"],
                    "type": "work_setting",
                    "weight": 3
                }
            ]
        
        # Add 3 general questions
        general_questions = [
            {
                "id": 100,
                "question": "What's your preferred work environment?",
                "options": ["Fast-paced Startup", "Structured Corporate", "Academic/Research", "Remote/Flexible"],
                "type": "work_environment",
                "weight": 2
            },
            {
                "id": 101,
                "question": "Geographical preference for career development?",
                "options": ["Major Tech Hub", "University Town", "International Location", "Local/Current City"],
                "type": "location",
                "weight": 2
            },
            {
                "id": 102,
                "question": "Work-life balance vs career growth priority?",
                "options": ["Balance Critical", "Growth Priority Now", "Balance with Growth", "Depends on Life Stage"],
                "type": "lifestyle",
                "weight": 2
            }
        ]
        
        return base_questions + general_questions
    
    def generate_roadmap(self, field_id, specialization, answers, experience_level):
        """Generate personalized career roadmap"""
        
        field_info = self.career_knowledge['fields'].get(field_id)
        if not field_info:
            field_info = self.career_knowledge['fields']['cs']
        
        # Determine experience level
        if experience_level < 1:
            level = "Beginner"
        elif experience_level < 3:
            level = "Intermediate"
        else:
            level = "Advanced"
        
        # Create roadmap based on field and level
        roadmap = {
            "field": field_info['name'],
            "specialization": specialization,
            "experience_level": level,
            "timeline": {
                "immediate": self._get_immediate_plan(field_id, level, answers),
                "short_term": self._get_short_term_plan(field_id, level, answers),
                "mid_term": self._get_mid_term_plan(field_id, level, answers),
                "long_term": self._get_long_term_plan(field_id, level, answers)
            },
            "skill_development": self._get_skill_plan(field_id, specialization),
            "project_recommendations": self._get_project_recommendations(field_id, specialization),
            "education_path": self._get_education_path(field_id, level),
            "career_options": field_info['careers'],
            "industry_trends": self._get_industry_trends(field_id)
        }
        
        return roadmap
    
    def _get_immediate_plan(self, field_id, level, answers):
        """Get immediate action plan"""
        plans = {
            'cs': {
                'Beginner': "1. Complete Python/Java fundamentals course\n2. Build 2-3 small projects\n3. Learn Git and version control\n4. Start algorithm practice\n5. Join coding communities",
                'Intermediate': "1. Deepen specialization knowledge\n2. Contribute to open source\n3. Build portfolio project\n4. Network with professionals\n5. Prepare for technical interviews",
                'Advanced': "1. Mentor beginners\n2. Work on complex systems\n3. Learn system design\n4. Explore leadership skills\n5. Stay updated with latest trends"
            },
            'bio': {
                'Beginner': "1. Master lab safety protocols\n2. Learn basic research methodologies\n3. Start literature review in chosen area\n4. Develop data recording skills\n5. Join research groups",
                'Intermediate': "1. Specialize in chosen technique\n2. Start independent research project\n3. Learn statistical analysis\n4. Attend conferences\n5. Network with researchers",
                'Advanced': "1. Lead research projects\n2. Publish findings\n3. Mentor junior researchers\n4. Explore commercialization\n5. Build professional network"
            }
        }
        
        return plans.get(field_id, {}).get(level, "Start with fundamentals in your field")
    
    def _get_short_term_plan(self, field_id, level, answers):
        """Get short-term plan"""
        plans = {
            'cs': {
                'Beginner': "1. Complete intermediate courses in chosen specialization\n2. Build medium-scale projects\n3. Participate in hackathons\n4. Start networking\n5. Create GitHub portfolio",
                'Intermediate': "1. Advanced specialization courses\n2. Contribute to major open source\n3. Lead small projects\n4. Attend tech meetups\n5. Prepare for senior roles",
                'Advanced': "1. Architect complex systems\n2. Lead development teams\n3. Publish technical articles\n4. Speak at conferences\n5. Explore management roles"
            },
            'bio': {
                'Beginner': "1. Advanced lab techniques\n2. Research assistant positions\n3. Literature review specialization\n4. Statistical analysis training\n5. Conference attendance",
                'Intermediate': "1. Independent research projects\n2. Collaborative studies\n3. Publication preparation\n4. Grant writing skills\n5. Industry networking",
                'Advanced': "1. Lead research programs\n2. Secure funding\n3. Commercial applications\n4. International collaborations\n5. Teaching/mentoring"
            }
        }
        
        return plans.get(field_id, {}).get(level, "Continue building intermediate skills")
    
    def _get_mid_term_plan(self, field_id, level, answers):
        """Get mid-term plan"""
        plans = {
            'cs': {
                'Beginner': "1. Senior developer roles\n2. System architecture skills\n3. Team leadership\n4. Industry specialization\n5. Advanced certifications",
                'Intermediate': "1. Technical lead positions\n2. Architecture design\n3. Cross-functional projects\n4. Mentoring programs\n5. Advanced studies",
                'Advanced': "1. Principal/Staff engineer\n2. CTO/VP Engineering\n3. Startup founding\n4. Industry consulting\n5. Research contributions"
            },
            'bio': {
                'Beginner': "1. Senior researcher roles\n2. Lab management\n3. Publication track record\n4. Industry collaborations\n5. Advanced degrees",
                'Intermediate': "1. Research leadership\n2. Program management\n3. Commercial partnerships\n4. International recognition\n5. Teaching positions",
                'Advanced': "1. Department leadership\n2. Commercial ventures\n3. Policy influence\n4. Global collaborations\n5. Innovation leadership"
            }
        }
        
        return plans.get(field_id, {}).get(level, "Advance to senior positions")
    
    def _get_long_term_plan(self, field_id, level, answers):
        """Get long-term plan"""
        plans = {
            'cs': {
                'Beginner': "1. Executive technology roles\n2. Industry thought leadership\n3. Innovation leadership\n4. Global impact\n5. Legacy building",
                'Intermediate': "1. C-level executive\n2. Industry disruption\n3. Global influence\n4. Philanthropic tech\n5. Knowledge sharing",
                'Advanced': "1. Industry transformation\n2. Global technology leadership\n3. Policy influence\n4. Education reform\n5. Sustainable innovation"
            },
            'bio': {
                'Beginner': "1. Research institution leadership\n2. Industry innovation\n3. Policy influence\n4. Global health impact\n5. Scientific legacy",
                'Intermediate': "1. Scientific leadership\n2. Commercial innovation\n3. Global research impact\n4. Policy development\n5. Educational leadership",
                'Advanced': "1. Nobel-level contributions\n2. Global scientific leadership\n3. Policy transformation\n4. Humanitarian impact\n5. Scientific revolution"
            }
        }
        
        return plans.get(field_id, {}).get(level, "Achieve leadership positions")
    
    def _get_skill_plan(self, field_id, specialization):
        """Get skill development plan"""
        skill_plans = {
            'cs': {
                'AI/ML': ["Python, Statistics", "ML Algorithms", "Deep Learning", "TensorFlow/PyTorch", "Model Deployment"],
                'Web Development': ["HTML/CSS/JS", "React/Angular", "Node.js", "Databases", "DevOps Basics"],
                'Data Science': ["Python/R", "Statistics", "Data Visualization", "SQL", "Big Data Tools"]
            },
            'bio': {
                'Genetics': ["Molecular Biology", "PCR Techniques", "Sequencing", "Data Analysis", "Bioinformatics"],
                'Bioinformatics': ["Python/R", "Statistics", "Genomic Tools", "Database Management", "Machine Learning"]
            }
        }
        return skill_plans.get(field_id, {}).get(specialization, ["Core field skills", "Analytical thinking", "Technical expertise"])
    
    def _get_project_recommendations(self, field_id, specialization):
        """Get project recommendations"""
        projects = {
            'cs': {
                'AI/ML': ["Image Classification System", "Chatbot Development", "Predictive Analytics Dashboard", "Recommendation Engine"],
                'Web Development': ["E-commerce Platform", "Social Media App", "Portfolio Website", "API Development"],
                'Data Science': ["Sales Analysis Dashboard", "Customer Segmentation", "Trend Analysis Tool", "Data Pipeline"]
            },
            'bio': {
                'Genetics': ["Gene Expression Analysis", "CRISPR Design Tool", "Protein Structure Prediction", "Genetic Disease Database"],
                'Bioinformatics': ["Sequence Alignment Tool", "Phylogenetic Analysis", "Drug Discovery Pipeline", "Biomarker Detection"]
            }
        }
        return projects.get(field_id, {}).get(specialization, ["Research Project", "Literature Review", "Experimental Design", "Data Analysis"])
    
    def _get_education_path(self, field_id, level):
        """Get education path recommendations"""
        paths = {
            'cs': {
                'Beginner': ["Online Courses (Coursera, edX)", "Bootcamp Programs", "Self-study with Projects", "Community College"],
                'Intermediate': ["Bachelor's Degree", "Professional Certifications", "Specialized Training", "Workshops"],
                'Advanced': ["Master's Degree", "PhD Programs", "Executive Education", "Advanced Certifications"]
            },
            'bio': {
                'Beginner': ["Associate Degree", "Lab Technician Training", "Certificate Programs", "Online Courses"],
                'Intermediate': ["Bachelor's in Biology", "Research Assistant Programs", "Lab Experience", "Conferences"],
                'Advanced': ["Master's/PhD", "Postdoctoral Research", "Specialized Training", "International Programs"]
            }
        }
        return paths.get(field_id, {}).get(level, ["Continuing Education", "Professional Development", "Industry Training"])
    
    def _get_industry_trends(self, field_id):
        """Get industry trends to watch"""
        trends = {
            'cs': ["AI/ML Integration", "Cloud Native Development", "Cybersecurity Focus", "Quantum Computing", "Edge Computing"],
            'bio': ["Personalized Medicine", "Gene Therapy", "Synthetic Biology", "Bioinformatics", "Sustainable Biotech"],
            'physics': ["Quantum Computing", "Renewable Energy", "Materials Science", "Space Technology", "Medical Physics"],
            'chemistry': ["Green Chemistry", "Pharmaceutical Innovation", "Materials Science", "Environmental Chemistry", "Nanotechnology"],
            'math': ["Big Data Analytics", "AI/ML Mathematics", "Quantitative Finance", "Cryptography", "Computational Mathematics"]
        }
        return trends.get(field_id, ["Technology Trends", "Industry Innovation", "Research Developments"])

# Main Assessment System
class ScienceCareerAssessment:
    """Complete assessment system without external APIs"""
    
    def __init__(self):
        self.ai_engine = LocalAIEngine()
        self.user_profile = {}
        self.assessment_answers = []
        
    def process_resume_text(self, resume_text):
        """Process resume text and extract key information"""
        print("\n" + "="*60)
        print("PROCESSING RESUME...")
        print("="*60)
        
        # Extract basic information
        profile = {
            'name': self._extract_name(resume_text),
            'education': self._extract_education(resume_text),
            'skills': self._extract_skills(resume_text),
            'experience': self._extract_experience(resume_text),
            'projects': self._extract_projects(resume_text),
            'raw_text': resume_text[:1000]  # Store first 1000 chars
        }
        
        # Identify primary field
        field_id, confidence = self.ai_engine.extract_field(resume_text)
        profile['primary_field'] = field_id
        profile['field_confidence'] = confidence
        
        self.user_profile = profile
        
        print(f"\n✓ Profile Extracted:")
        print(f"  Name: {profile.get('name', 'Not found')}")
        print(f"  Primary Field: {self.ai_engine.career_knowledge['fields'][field_id]['name']}")
        print(f"  Confidence: {confidence:.1f}/10")
        print(f"  Skills found: {len(profile['skills'])}")
        
        return profile
    
    def _extract_name(self, text):
        """Simple name extraction"""
        # Look for common name patterns
        lines = text.split('\n')
        for line in lines[:5]:  # Check first 5 lines
            line = line.strip()
            if re.match(r'^[A-Z][a-z]+ [A-Z][a-z]+$', line):
                return line
        return "Candidate"
    
    def _extract_education(self, text):
        """Extract education information"""
        education = []
        edu_keywords = ['university', 'college', 'institute', 'bachelor', 'master', 'phd', 'diploma']
        
        lines = text.lower().split('\n')
        for i, line in enumerate(lines):
            if any(keyword in line for keyword in edu_keywords):
                # Get the line and next few lines as context
                context = lines[i:i+3]
                education.append(' '.join(context).title())
        
        return education if education else ["Education details not specified"]
    
    def _extract_skills(self, text):
        """Extract skills from text"""
        skills = []
        text_lower = text.lower()
        
        # Check against known skill patterns
        for category, patterns in self.ai_engine.skill_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text_lower):
                    skill_name = pattern.replace('r\'', '').replace('\'', '')
                    if skill_name not in skills:
                        skills.append(skill_name.title())
        
        return skills if skills else ["Analytical Skills", "Problem Solving"]
    
    def _extract_experience(self, text):
        """Extract experience information"""
        # Simple extraction based on common patterns
        exp_patterns = [r'experience', r'internship', r'work at', r'employed at']
        lines = text.lower().split('\n')
        
        experiences = []
        for i, line in enumerate(lines):
            if any(pattern in line for pattern in exp_patterns):
                context = lines[max(0, i-1):min(len(lines), i+3)]
                experiences.append(' '.join(context).title())
        
        return experiences if experiences else ["Experience details not specified"]
    
    def _extract_projects(self, text):
        """Extract project information"""
        proj_keywords = ['project', 'research', 'developed', 'created', 'built']
        lines = text.lower().split('\n')
        
        projects = []
        for i, line in enumerate(lines):
            if any(keyword in line for keyword in proj_keywords):
                context = lines[i:i+3]
                projects.append(' '.join(context).title())
        
        return projects if projects else ["Project details not specified"]
    
    def generate_assessment_questions(self):
        """Generate personalized questions"""
        print("\n" + "="*60)
        print("GENERATING PERSONALIZED ASSESSMENT QUESTIONS...")
        print("="*60)
        
        field_id = self.user_profile.get('primary_field', 'cs')
        questions = self.ai_engine.generate_questions(field_id, self.user_profile)
        
        print(f"\n✓ Generated {len(questions)} personalized questions")
        print(f"  Field: {self.ai_engine.career_knowledge['fields'][field_id]['name']}")
        print(f"  Field-specific: {len(questions)-3} questions")
        print(f"  General: 3 questions")
        
        return questions
    
    def conduct_assessment(self, questions):
        """Conduct interactive assessment"""
        print("\n" + "="*60)
        print("CAREER ASSESSMENT QUESTIONNAIRE")
        print("="*60)
        print("\nPlease answer the following questions (1-4):\n")
        
        answers = []
        for i, question in enumerate(questions, 1):
            print(f"\nQ{i}. {question['question']}")
            for idx, option in enumerate(question['options'], 1):
                print(f"   {idx}. {option}")
            
            while True:
                try:
                    choice = int(input(f"\nYour choice (1-{len(question['options'])}): "))
                    if 1 <= choice <= len(question['options']):
                        answers.append({
                            'question_id': question['id'],
                            'question': question['question'],
                            'answer': question['options'][choice-1],
                            'type': question['type'],
                            'weight': question['weight']
                        })
                        break
                    else:
                        print(f"Please enter a number between 1 and {len(question['options'])}")
                except ValueError:
                    print("Please enter a valid number")
        
        self.assessment_answers = answers
        return answers
    
    def analyze_assessment(self):
        """Analyze assessment results"""
        print("\n" + "="*60)
        print("ANALYZING ASSESSMENT RESULTS...")
        print("="*60)
        
        # Calculate scores by category
        category_scores = {}
        for answer in self.assessment_answers:
            cat = answer['type']
            if cat not in category_scores:
                category_scores[cat] = 0
            category_scores[cat] += answer['weight']
        
        # Determine specialization preference
        specialization_questions = [a for a in self.assessment_answers if a['type'] in ['specialization', 'research_area']]
        if specialization_questions:
            primary_specialization = specialization_questions[0]['answer']
        else:
            primary_specialization = "General"
        
        # Calculate experience level (simulated)
        skills_count = len(self.user_profile.get('skills', []))
        experience_level = min(5, skills_count / 2)  # Scale 0-5
        
        analysis = {
            'primary_field': self.user_profile['primary_field'],
            'specialization': primary_specialization,
            'experience_level': experience_level,
            'category_scores': category_scores,
            'strengths': self._identify_strengths(category_scores),
            'recommendations': self._generate_recommendations(category_scores)
        }
        
        print(f"\n✓ Analysis Complete:")
        print(f"  Specialization: {primary_specialization}")
        print(f"  Experience Level: {analysis['experience_level']:.1f}/5")
        print(f"  Key Strengths: {', '.join(analysis['strengths'][:3])}")
        
        return analysis
    
    def _identify_strengths(self, category_scores):
        """Identify key strengths from assessment"""
        strengths = []
        if category_scores.get('specialization', 0) > 3:
            strengths.append("Clear Specialization Focus")
        if category_scores.get('application_preference', 0) > 3:
            strengths.append("Practical Application Skills")
        if category_scores.get('emerging_tech', 0) > 2:
            strengths.append("Future Technology Interest")
        
        return strengths if strengths else ["Analytical Thinking", "Learning Agility"]
    
    def _generate_recommendations(self, category_scores):
        """Generate personalized recommendations"""
        recs = []
        
        if category_scores.get('work_environment', 0) > 3:
            recs.append("Consider environments matching your work style preference")
        if category_scores.get('learning_style', 0) > 3:
            recs.append("Focus on continuous learning pathways")
        if category_scores.get('project_scale', 0) > 3:
            recs.append("Seek projects that match your preferred scale")
        
        return recs if recs else ["Build portfolio projects", "Network with professionals"]
    
    def generate_career_roadmap(self, analysis):
        """Generate complete career roadmap"""
        print("\n" + "="*60)
        print("GENERATING PERSONALIZED CAREER ROADMAP")
        print("="*60)
        
        roadmap = self.ai_engine.generate_roadmap(
            analysis['primary_field'],
            analysis['specialization'],
            self.assessment_answers,
            analysis['experience_level']
        )
        
        return roadmap
    
    def display_results(self, roadmap, analysis):
        """Display complete assessment results"""
        print("\n" + "="*60)
        print("YOUR PERSONALIZED CAREER ROADMAP")
        print("="*60)
        
        print(f"\n🎯 FIELD: {roadmap['field']}")
        print(f"🎯 SPECIALIZATION: {roadmap['specialization']}")
        print(f"🎯 EXPERIENCE LEVEL: {roadmap['experience_level']}")
        
        print(f"\n📈 IMMEDIATE PLAN (Next 3-6 months):")
        print(f"   {roadmap['timeline']['immediate'].replace(chr(10), chr(10) + '   ')}")
        
        print(f"\n🎯 SHORT TERM GOALS (1 Year):")
        print(f"   {roadmap['timeline']['short_term'].replace(chr(10), chr(10) + '   ')}")
        
        print(f"\n🚀 MID TERM GOALS (2-3 Years):")
        print(f"   {roadmap['timeline']['mid_term'].replace(chr(10), chr(10) + '   ')}")
        
        print(f"\n🌟 LONG TERM VISION (4-5 Years):")
        print(f"   {roadmap['timeline']['long_term'].replace(chr(10), chr(10) + '   ')}")
        
        print(f"\n💡 SKILL DEVELOPMENT PATH:")
        for i, skill in enumerate(roadmap['skill_development'], 1):
            print(f"   {i}. {skill}")
        
        print(f"\n🔧 RECOMMENDED PROJECTS:")
        for i, project in enumerate(roadmap['project_recommendations'], 1):
            print(f"   {i}. {project}")
        
        print(f"\n🎓 EDUCATION PATH:")
        for i, path in enumerate(roadmap['education_path'], 1):
            print(f"   {i}. {path}")
        
        print(f"\n💼 POTENTIAL CAREER OPTIONS:")
        for i, career in enumerate(roadmap['career_options'], 1):
            print(f"   {i}. {career}")
        
        print(f"\n📊 INDUSTRY TRENDS TO WATCH:")
        for i, trend in enumerate(roadmap['industry_trends'], 1):
            print(f"   {i}. {trend}")
        
        print(f"\n" + "="*60)
        print("KEY RECOMMENDATIONS")
        print("="*60)
        for rec in analysis['recommendations']:
            print(f"   • {rec}")
        
        print(f"\n" + "="*60)
        print("ASSESSMENT COMPLETE")
        print("="*60)
        print("\n💡 Save this roadmap and revisit it every 6 months!")
        print("🔄 Update your skills and goals as you progress.")
        print("🌟 Good luck with your science career journey!\n")

# Example Resume Data (can be replaced with actual resume text)
SAMPLE_RESUME = """
John Doe
123 Science Street, Tech City
john.doe@email.com | (123) 456-7890

EDUCATION
Bachelor of Science in Computer Science
University of Technology, 2020-2024
GPA: 3.8/4.0

SKILLS
Programming: Python, Java, JavaScript, SQL
Machine Learning: TensorFlow, scikit-learn
Data Analysis: Pandas, NumPy, Statistics
Web Development: React, Node.js, HTML/CSS

EXPERIENCE
Machine Learning Intern
AI Research Lab, Summer 2023
- Developed predictive models using Python
- Implemented deep learning algorithms
- Analyzed large datasets for patterns

PROJECTS
Stock Prediction System
- Built ML model for stock price prediction
- Used Python and TensorFlow
- Achieved 85% accuracy on test data

Student Management Portal
- Full-stack web application
- React frontend, Node.js backend
- MongoDB database

RESEARCH
Published paper on "AI in Healthcare"
Presented at International Conference on AI

CERTIFICATIONS
Google Machine Learning Certification
AWS Cloud Practitioner
"""

def main():
    """Main execution function"""
    print("🔬 SCIENCE STREAM CAREER ASSESSMENT SYSTEM")
    print("="*60)
    
    # Initialize assessment system
    assessment = ScienceCareerAssessment()
    
    # Option 1: Use sample resume
    # Option 2: Load from file
    # Option 3: Manual input
    
    print("\nSelect input method:")
    print("1. Use sample resume (demo)")
    print("2. Load from text file")
    print("3. Enter resume text manually")
    
    choice = input("\nEnter choice (1-3): ").strip()
    
    resume_text = ""
    if choice == "1":
        resume_text = SAMPLE_RESUME
        print("\nUsing sample resume for demonstration...")
    elif choice == "2":
        filename = input("Enter filename (txt format): ").strip()
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                resume_text = f.read()
        except FileNotFoundError:
            print(f"File {filename} not found. Using sample resume.")
            resume_text = SAMPLE_RESUME
    elif choice == "3":
        print("\nEnter your resume text (press Ctrl+D or Ctrl+Z when done):")
        lines = []
        try:
            while True:
                line = input()
                lines.append(line)
        except EOFError:
            resume_text = '\n'.join(lines)
    else:
        print("Invalid choice. Using sample resume.")
        resume_text = SAMPLE_RESUME
    
    # Step 1: Process resume
    profile = assessment.process_resume_text(resume_text)
    
    # Step 2: Generate questions
    questions = assessment.generate_assessment_questions()
    
    # Step 3: Conduct assessment
    answers = assessment.conduct_assessment(questions)
    
    # Step 4: Analyze results
    analysis = assessment.analyze_assessment()
    
    # Step 5: Generate roadmap
    roadmap = assessment.generate_career_roadmap(analysis)
    
    # Step 6: Display results
    assessment.display_results(roadmap, analysis)
    
    # Save results to file
    save_results(profile, answers, analysis, roadmap)

def save_results(profile, answers, analysis, roadmap):
    """Save assessment results to file"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"career_assessment_{timestamp}.txt"
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write("SCIENCE CAREER ASSESSMENT REPORT\n")
        f.write("="*60 + "\n\n")
        
        f.write("PROFILE SUMMARY:\n")
        f.write(f"Name: {profile.get('name', 'N/A')}\n")
        f.write(f"Field: {roadmap['field']}\n")
        f.write(f"Specialization: {roadmap['specialization']}\n\n")
        
        f.write("ASSESSMENT ANSWERS:\n")
        for answer in answers:
            f.write(f"Q: {answer['question']}\n")
            f.write(f"A: {answer['answer']}\n\n")
        
        f.write("CAREER ROADMAP:\n")
        f.write(f"Experience Level: {roadmap['experience_level']}\n\n")
        
        f.write("TIMELINE:\n")
        for period, plan in roadmap['timeline'].items():
            f.write(f"\n{period.upper().replace('_', ' ')}:\n")
            f.write(f"{plan}\n")
        
        f.write("\nRECOMMENDED SKILLS:\n")
        for skill in roadmap['skill_development']:
            f.write(f"- {skill}\n")
    
    print(f"\n📄 Results saved to: {filename}")

if __name__ == "__main__":
    main()
