#!/usr/bin/env python3
"""
Quick Assessment Script - Fast career assessment without resume upload
"""

from science_career_assessment import ScienceCareerAssessment

def quick_assessment():
    """Quick career assessment for those without resume"""
    print("🔬 QUICK SCIENCE CAREER ASSESSMENT")
    print("="*60)
    print("Fast assessment without resume upload - just answer a few questions!")
    
    print("\nSelect your primary interest area:")
    print("1. Computer Science / IT")
    print("2. Biology / Biotechnology")
    print("3. Physics / Mathematics")
    print("4. Chemistry / Chemical Sciences")
    print("5. Environmental Science")
    print("6. Other Sciences")
    
    choice = input("\nEnter choice (1-6): ").strip()
    
    field_map = {
        '1': 'cs', '2': 'bio', '3': 'physics',
        '4': 'chemistry', '5': 'env', '6': 'general'
    }
    
    field_id = field_map.get(choice, 'cs')
    
    # Get basic info
    name = input("\nEnter your name (optional): ").strip() or "Student"
    
    # Create mock profile
    mock_profile = {
        'name': name,
        'primary_field': field_id,
        'skills': ['Basic knowledge in field'],
        'experience_level': 1.0,
        'education': ['Currently studying'],
        'experience': ['Entry-level'],
        'projects': ['Planning to start projects']
    }
    
    # Initialize and run assessment
    assessment = ScienceCareerAssessment()
    assessment.user_profile = mock_profile
    
    print(f"\n🎯 Selected Field: {assessment.ai_engine.career_knowledge['fields'][field_id]['name']}")
    print("📝 Generating personalized questions...\n")
    
    # Generate questions
    questions = assessment.generate_assessment_questions()
    
    # Conduct assessment
    answers = assessment.conduct_assessment(questions)
    assessment.assessment_answers = answers
    
    # Analyze
    analysis = assessment.analyze_assessment()
    
    # Generate roadmap
    roadmap = assessment.generate_career_roadmap(analysis)
    
    # Display results
    assessment.display_results(roadmap, analysis)
    
    # Save results
    from datetime import datetime
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"quick_assessment_{timestamp}.txt"
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write("QUICK CAREER ASSESSMENT REPORT\n")
        f.write("="*60 + "\n\n")
        f.write(f"Name: {name}\n")
        f.write(f"Field: {roadmap['field']}\n")
        f.write(f"Specialization: {roadmap['specialization']}\n")
        f.write(f"Experience Level: {roadmap['experience_level']}\n\n")
        
        f.write("IMMEDIATE ACTIONS:\n")
        f.write(f"{roadmap['timeline']['immediate']}\n\n")
        
        f.write("SKILLS TO DEVELOP:\n")
        for skill in roadmap['skill_development']:
            f.write(f"- {skill}\n")
    
    print(f"\n📄 Quick assessment saved to: {filename}")

def mini_assessment():
    """Even faster mini assessment"""
    print("⚡ MINI CAREER ASSESSMENT")
    print("="*40)
    print("Get instant career guidance in 2 minutes!")
    
    # Quick field selection
    interests = {
        '1': ('Computer Science', ['Programming', 'Web Development', 'Data Science', 'AI/ML']),
        '2': ('Biology', ['Genetics', 'Biotechnology', 'Medical Research', 'Environmental Science']),
        '3': ('Physics', ['Quantum Physics', 'Astrophysics', 'Engineering Physics', 'Applied Physics']),
        '4': ('Chemistry', ['Organic Chemistry', 'Pharmaceuticals', 'Materials Science', 'Environmental Chemistry']),
        '5': ('Mathematics', ['Statistics', 'Data Science', 'Actuarial Science', 'Applied Mathematics'])
    }
    
    print("\nQuick field selection:")
    for num, (field, _) in interests.items():
        print(f"{num}. {field}")
    
    field_choice = input("\nSelect field (1-5): ").strip()
    field_name, specializations = interests.get(field_choice, interests['1'])
    
    print(f"\n🎯 {field_name} Specializations:")
    for i, spec in enumerate(specializations, 1):
        print(f"{i}. {spec}")
    
    spec_choice = input(f"\nSelect specialization (1-{len(specializations)}): ").strip()
    try:
        spec_index = int(spec_choice) - 1
        specialization = specializations[spec_index]
    except:
        specialization = specializations[0]
    
    # Experience level
    print("\nExperience level:")
    print("1. Just starting (0-1 years)")
    print("2. Some experience (1-3 years)")
    print("3. Experienced (3+ years)")
    
    exp_choice = input("Select experience (1-3): ").strip()
    exp_levels = {'1': 'Beginner', '2': 'Intermediate', '3': 'Advanced'}
    experience = exp_levels.get(exp_choice, 'Beginner')
    
    # Generate instant recommendations
    recommendations = generate_instant_recommendations(field_name, specialization, experience)
    
    print("\n" + "="*60)
    print("YOUR INSTANT CAREER GUIDANCE")
    print("="*60)
    
    print(f"\n🎯 Field: {field_name}")
    print(f"🔬 Specialization: {specialization}")
    print(f"⭐ Experience: {experience}")
    
    print(f"\n📈 IMMEDIATE NEXT STEPS:")
    for i, step in enumerate(recommendations['immediate'], 1):
        print(f"   {i}. {step}")
    
    print(f"\n🎓 SKILLS TO FOCUS ON:")
    for i, skill in enumerate(recommendations['skills'], 1):
        print(f"   {i}. {skill}")
    
    print(f"\n💼 CAREER PATHS:")
    for i, career in enumerate(recommendations['careers'], 1):
        print(f"   {i}. {career}")
    
    print(f"\n🌟 LONG-TERM GOAL:")
    print(f"   {recommendations['long_term']}")
    
    print(f"\n💡 QUICK TIP:")
    print(f"   {recommendations['tip']}")
    
    print(f"\n" + "="*60)
    print("✅ Mini Assessment Complete!")
    print("💡 For detailed roadmap, use the full assessment system.")
    print("="*60)

def generate_instant_recommendations(field_name, specialization, experience):
    """Generate instant recommendations based on inputs"""
    
    recommendations_db = {
        'Computer Science': {
            'AI/ML': {
                'Beginner': {
                    'immediate': ['Learn Python programming', 'Take online ML courses', 'Build small ML projects'],
                    'skills': ['Python', 'Statistics', 'Machine Learning Basics', 'Data Analysis'],
                    'careers': ['ML Engineer', 'Data Scientist', 'AI Researcher', 'Data Analyst'],
                    'long_term': 'Become a Machine Learning Engineer or Data Scientist',
                    'tip': 'Start with Python and basic statistics before diving into ML algorithms'
                },
                'Intermediate': {
                    'immediate': ['Deepen ML knowledge', 'Build portfolio projects', 'Contribute to open source'],
                    'skills': ['Deep Learning', 'TensorFlow/PyTorch', 'Cloud Computing', 'MLOps'],
                    'careers': ['Senior ML Engineer', 'AI Architect', 'Data Science Lead', 'ML Researcher'],
                    'long_term': 'Lead AI/ML projects and teams',
                    'tip': 'Focus on practical applications and real-world projects'
                },
                'Advanced': {
                    'immediate': ['Lead ML projects', 'Mentor others', 'Explore cutting-edge research'],
                    'skills': ['AI Architecture', 'Research Leadership', 'Team Management', 'Innovation'],
                    'careers': ['AI Director', 'Principal Scientist', 'CTO', 'Research Lead'],
                    'long_term': 'Become an AI/ML thought leader and innovator',
                    'tip': 'Focus on leadership and innovation in AI'
                }
            }
        },
        'Biology': {
            'Genetics': {
                'Beginner': {
                    'immediate': ['Master basic biology', 'Learn lab techniques', 'Study genetics fundamentals'],
                    'skills': ['Molecular Biology', 'Lab Safety', 'Genetics Basics', 'Data Analysis'],
                    'careers': ['Lab Technician', 'Research Assistant', 'Quality Control', 'Biotech Analyst'],
                    'long_term': 'Become a Genetics Researcher or Lab Manager',
                    'tip': 'Focus on hands-on lab experience and fundamental genetics'
                },
                'Intermediate': {
                    'immediate': ['Specialize in genetic techniques', 'Start research projects', 'Publish findings'],
                    'skills': ['Advanced Genetics', 'Bioinformatics', 'Statistical Analysis', 'Research Methods'],
                    'careers': ['Geneticist', 'Research Scientist', 'Lab Manager', 'Biotech Specialist'],
                    'long_term': 'Lead genetics research projects',
                    'tip': 'Combine wet lab skills with computational analysis'
                },
                'Advanced': {
                    'immediate': ['Lead research teams', 'Secure funding', 'Publish high-impact papers'],
                    'skills': ['Research Leadership', 'Grant Writing', 'Project Management', 'Innovation'],
                    'careers': ['Principal Investigator', 'Research Director', 'Biotech Founder', 'Professor'],
                    'long_term': 'Become a leader in genetics research',
                    'tip': 'Focus on leadership and innovation in genetics'
                }
            }
        },
        'Physics': {
            'Quantum Physics': {
                'Beginner': {
                    'immediate': ['Master advanced mathematics', 'Learn quantum mechanics basics', 'Study physics fundamentals'],
                    'skills': ['Advanced Mathematics', 'Physics Fundamentals', 'Problem Solving', 'Research Methods'],
                    'careers': ['Physics Tutor', 'Lab Assistant', 'Research Assistant', 'Technical Writer'],
                    'long_term': 'Become a Quantum Physics Researcher',
                    'tip': 'Focus on mathematics and fundamental physics concepts'
                },
                'Intermediate': {
                    'immediate': ['Specialize in quantum theory', 'Conduct research', 'Learn computational physics'],
                    'skills': ['Quantum Mechanics', 'Computational Physics', 'Research Methods', 'Data Analysis'],
                    'careers': ['Physicist', 'Research Scientist', 'Quantum Analyst', 'Academic Researcher'],
                    'long_term': 'Lead quantum physics research',
                    'tip': 'Combine theoretical knowledge with computational skills'
                },
                'Advanced': {
                    'immediate': ['Lead quantum research', 'Publish papers', 'Mentor junior researchers'],
                    'skills': ['Quantum Theory', 'Research Leadership', 'Innovation', 'Collaboration'],
                    'careers': ['Quantum Physicist', 'Research Director', 'Professor', 'Industry Consultant'],
                    'long_term': 'Become a leader in quantum physics',
                    'tip': 'Focus on cutting-edge quantum research and applications'
                }
            }
        },
        'Chemistry': {
            'Organic Chemistry': {
                'Beginner': {
                    'immediate': ['Master basic chemistry', 'Learn lab techniques', 'Study organic compounds'],
                    'skills': ['Basic Chemistry', 'Lab Techniques', 'Safety Protocols', 'Chemical Analysis'],
                    'careers': ['Lab Technician', 'Quality Control', 'Chemistry Tutor', 'Research Assistant'],
                    'long_term': 'Become an Organic Chemist or Lab Manager',
                    'tip': 'Focus on hands-on lab experience and safety'
                },
                'Intermediate': {
                    'immediate': ['Specialize in organic synthesis', 'Conduct research', 'Learn analytical techniques'],
                    'skills': ['Organic Synthesis', 'Analytical Chemistry', 'Research Methods', 'Instrumentation'],
                    'careers': ['Organic Chemist', 'Research Scientist', 'Quality Control Manager', 'Lab Manager'],
                    'long_term': 'Lead organic chemistry research',
                    'tip': 'Combine synthesis skills with analytical techniques'
                },
                'Advanced': {
                    'immediate': ['Lead chemistry projects', 'Develop new compounds', 'Mentor researchers'],
                    'skills': ['Advanced Chemistry', 'Research Leadership', 'Innovation', 'Project Management'],
                    'careers': ['Senior Chemist', 'Research Director', 'Chemistry Professor', 'Industry Consultant'],
                    'long_term': 'Become a leader in organic chemistry',
                    'tip': 'Focus on innovation and leadership in chemistry'
                }
            }
        },
        'Mathematics': {
            'Statistics': {
                'Beginner': {
                    'immediate': ['Learn basic statistics', 'Master probability', 'Study data analysis'],
                    'skills': ['Basic Statistics', 'Probability', 'Data Analysis', 'Excel/Python'],
                    'careers': ['Data Analyst', 'Statistics Tutor', 'Research Assistant', 'Quality Analyst'],
                    'long_term': 'Become a Statistician or Data Scientist',
                    'tip': 'Focus on practical applications of statistics'
                },
                'Intermediate': {
                    'immediate': ['Learn advanced statistics', 'Study machine learning', 'Build analytical models'],
                    'skills': ['Advanced Statistics', 'Machine Learning', 'Data Science', 'Statistical Software'],
                    'careers': ['Statistician', 'Data Scientist', 'Quantitative Analyst', 'Research Scientist'],
                    'long_term': 'Lead statistical analysis projects',
                    'tip': 'Combine statistics with programming and machine learning'
                },
                'Advanced': {
                    'immediate': ['Lead statistical projects', 'Develop new methods', 'Mentor analysts'],
                    'skills': ['Advanced Statistics', 'Research Leadership', 'Methodology Development', 'Innovation'],
                    'careers': ['Senior Statistician', 'Data Science Lead', 'Research Director', 'Professor'],
                    'long_term': 'Become a leader in statistical analysis',
                    'tip': 'Focus on innovation and leadership in statistics'
                }
            }
        }
    }
    
    # Get recommendations or use defaults
    field_recs = recommendations_db.get(field_name, {})
    spec_recs = field_recs.get(specialization, {})
    exp_recs = spec_recs.get(experience, spec_recs.get('Beginner', {}))
    
    # Default recommendations if not found
    if not exp_recs:
        exp_recs = {
            'immediate': ['Study fundamentals', 'Build skills', 'Gain experience'],
            'skills': ['Core skills', 'Technical skills', 'Soft skills'],
            'careers': ['Entry Level', 'Mid Level', 'Senior Level'],
            'long_term': 'Build successful career in chosen field',
            'tip': 'Focus on continuous learning and practical experience'
        }
    
    return exp_recs

def main():
    """Main execution function"""
    print("🚀 QUICK CAREER ASSESSMENT OPTIONS")
    print("="*60)
    
    print("Select assessment type:")
    print("1. Quick Assessment (8 questions)")
    print("2. Mini Assessment (2 minutes)")
    print("3. Field Exploration")
    
    choice = input("\nEnter choice (1-3): ").strip()
    
    if choice == "1":
        quick_assessment()
    elif choice == "2":
        mini_assessment()
    elif choice == "3":
        field_exploration()
    else:
        print("❌ Invalid choice!")
        return

def field_exploration():
    """Explore different science fields"""
    print("🔬 SCIENCE FIELD EXPLORATION")
    print("="*60)
    
    fields = {
        'Computer Science': {
            'description': 'Study of computation, algorithms, and information processing',
            'specializations': ['AI/ML', 'Web Development', 'Data Science', 'Cybersecurity', 'Cloud Computing'],
            'careers': ['Software Engineer', 'Data Scientist', 'ML Engineer', 'DevOps Engineer'],
            'skills': ['Programming', 'Problem Solving', 'Mathematics', 'Logic'],
            'outlook': 'Excellent growth, high demand, good salaries'
        },
        'Biology': {
            'description': 'Study of living organisms and life processes',
            'specializations': ['Genetics', 'Biotechnology', 'Microbiology', 'Ecology', 'Medicine'],
            'careers': ['Research Scientist', 'Lab Manager', 'Biotech Analyst', 'Medical Professional'],
            'skills': ['Lab Techniques', 'Research Methods', 'Data Analysis', 'Critical Thinking'],
            'outlook': 'Steady growth, research opportunities, healthcare demand'
        },
        'Physics': {
            'description': 'Study of matter, energy, and their interactions',
            'specializations': ['Quantum Physics', 'Astrophysics', 'Material Science', 'Engineering Physics'],
            'careers': ['Research Scientist', 'Engineer', 'Data Analyst', 'Academic'],
            'skills': ['Mathematics', 'Problem Solving', 'Research', 'Analytical Thinking'],
            'outlook': 'Research opportunities, tech applications, steady demand'
        },
        'Chemistry': {
            'description': 'Study of matter, its properties, and reactions',
            'specializations': ['Organic Chemistry', 'Inorganic Chemistry', 'Analytical Chemistry', 'Environmental Chemistry'],
            'careers': ['Chemist', 'Researcher', 'Quality Control', 'Environmental Analyst'],
            'skills': ['Lab Techniques', 'Chemical Analysis', 'Safety Protocols', 'Research'],
            'outlook': 'Industrial applications, research opportunities, steady growth'
        },
        'Mathematics': {
            'description': 'Study of numbers, quantities, and patterns',
            'specializations': ['Statistics', 'Applied Mathematics', 'Actuarial Science', 'Pure Mathematics'],
            'careers': ['Data Analyst', 'Statistician', 'Actuary', 'Quantitative Analyst'],
            'skills': ['Analytical Thinking', 'Problem Solving', 'Logic', 'Modeling'],
            'outlook': 'High demand in tech and finance, research opportunities'
        }
    }
    
    print("\nAvailable Science Fields:")
    for i, field in enumerate(fields.keys(), 1):
        print(f"{i}. {field}")
    
    choice = input(f"\nSelect field to explore (1-{len(fields)}): ").strip()
    
    try:
        field_index = int(choice) - 1
        field_name = list(fields.keys())[field_index]
        field_info = fields[field_name]
        
        print(f"\n" + "="*60)
        print(f"🔬 {field_name.upper()}")
        print("="*60)
        
        print(f"\n📖 Description:")
        print(f"   {field_info['description']}")
        
        print(f"\n🎯 Specializations:")
        for spec in field_info['specializations']:
            print(f"   • {spec}")
        
        print(f"\n💼 Career Options:")
        for career in field_info['careers']:
            print(f"   • {career}")
        
        print(f"\n🛠️ Key Skills:")
        for skill in field_info['skills']:
            print(f"   • {skill}")
        
        print(f"\n📈 Career Outlook:")
        print(f"   {field_info['outlook']}")
        
        print(f"\n💡 Next Steps:")
        print(f"   1. Take the quick assessment for {field_name}")
        print(f"   2. Explore specializations that interest you")
        print(f"   3. Develop key skills through courses and projects")
        print(f"   4. Network with professionals in the field")
        
    except (ValueError, IndexError):
        print("❌ Invalid choice!")

if __name__ == "__main__":
    main()
