#!/usr/bin/env python3
"""
Bulk Assessment Script for processing multiple resumes
"""

import os
from pathlib import Path
import json
from datetime import datetime

# Import the main assessment system
from science_career_assessment import ScienceCareerAssessment

class BulkCareerAssessment:
    """Process multiple resumes in batch"""
    
    def __init__(self):
        self.assessment = ScienceCareerAssessment()
        self.results = []
        self.ai_engine = self.assessment.ai_engine
    
    def process_folder(self, folder_path):
        """Process all text files in folder"""
        folder = Path(folder_path)
        
        if not folder.exists():
            print(f"❌ Folder {folder_path} does not exist!")
            return
        
        print(f"\n🔍 Processing resumes from: {folder_path}")
        print("="*60)
        
        txt_files = list(folder.glob("*.txt"))
        
        if not txt_files:
            print("❌ No .txt files found in the folder!")
            return
        
        print(f"📁 Found {len(txt_files)} resume files")
        
        for file_path in txt_files:
            print(f"\n📄 Processing: {file_path.name}")
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    resume_text = f.read()
                
                # Process resume
                profile = self.assessment.process_resume_text(resume_text)
                
                # Generate questions and simulate answers
                questions = self.assessment.generate_assessment_questions()
                
                # For bulk processing, use default answers (first option for each question)
                default_answers = []
                for q in questions[:8]:  # First 8 questions only for bulk processing
                    default_answers.append({
                        'question_id': q['id'],
                        'question': q['question'],
                        'answer': q['options'][0],
                        'type': q['type'],
                        'weight': q['weight']
                    })
                
                self.assessment.assessment_answers = default_answers
                analysis = self.assessment.analyze_assessment()
                
                # Generate roadmap
                roadmap = self.assessment.generate_career_roadmap(analysis)
                
                self.results.append({
                    'file': file_path.name,
                    'profile': profile,
                    'analysis': analysis,
                    'roadmap': roadmap
                })
                
                print(f"✅ Completed: {file_path.name}")
                
            except Exception as e:
                print(f"❌ Error processing {file_path.name}: {str(e)}")
                continue
        
        self.generate_summary_report()
        self.save_detailed_report()
    
    def generate_summary_report(self):
        """Generate summary report for all candidates"""
        print("\n" + "="*60)
        print("BULK ASSESSMENT SUMMARY")
        print("="*60)
        
        field_distribution = {}
        specialization_distribution = {}
        experience_levels = []
        
        for result in self.results:
            field = result['analysis']['primary_field']
            specialization = result['analysis']['specialization']
            exp_level = result['analysis']['experience_level']
            
            # Count fields
            field_distribution[field] = field_distribution.get(field, 0) + 1
            
            # Count specializations
            specialization_distribution[specialization] = specialization_distribution.get(specialization, 0) + 1
            
            # Collect experience levels
            experience_levels.append(exp_level)
        
        print(f"\n📊 SUMMARY STATISTICS:")
        print(f"   Total Candidates: {len(self.results)}")
        print(f"   Average Experience Level: {sum(experience_levels)/len(experience_levels):.1f}/5")
        
        print(f"\n🎯 FIELD DISTRIBUTION:")
        for field, count in sorted(field_distribution.items(), key=lambda x: x[1], reverse=True):
            field_name = self.ai_engine.career_knowledge['fields'][field]['name']
            percentage = (count / len(self.results)) * 100
            print(f"   {field_name}: {count} candidates ({percentage:.1f}%)")
        
        print(f"\n🔬 TOP SPECIALIZATIONS:")
        top_specializations = sorted(specialization_distribution.items(), key=lambda x: x[1], reverse=True)[:5]
        for spec, count in top_specializations:
            percentage = (count / len(self.results)) * 100
            print(f"   {spec}: {count} candidates ({percentage:.1f}%)")
        
        print(f"\n📈 EXPERIENCE LEVEL BREAKDOWN:")
        exp_ranges = {'Beginner': 0, 'Intermediate': 0, 'Advanced': 0}
        for exp in experience_levels:
            if exp < 2:
                exp_ranges['Beginner'] += 1
            elif exp < 4:
                exp_ranges['Intermediate'] += 1
            else:
                exp_ranges['Advanced'] += 1
        
        for level, count in exp_ranges.items():
            percentage = (count / len(experience_levels)) * 100
            print(f"   {level}: {count} candidates ({percentage:.1f}%)")
    
    def save_detailed_report(self):
        """Save detailed report to file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"bulk_assessment_report_{timestamp}.txt"
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write("BULK CAREER ASSESSMENT REPORT\n")
            f.write("="*60 + "\n")
            f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Total Candidates: {len(self.results)}\n\n")
            
            # Summary statistics
            field_distribution = {}
            for result in self.results:
                field = result['analysis']['primary_field']
                field_distribution[field] = field_distribution.get(field, 0) + 1
            
            f.write("FIELD DISTRIBUTION:\n")
            f.write("-" * 30 + "\n")
            for field, count in sorted(field_distribution.items(), key=lambda x: x[1], reverse=True):
                field_name = self.ai_engine.career_knowledge['fields'][field]['name']
                f.write(f"{field_name}: {count} candidates\n")
            f.write("\n")
            
            # Individual candidate details
            f.write("INDIVIDUAL CANDIDATE DETAILS:\n")
            f.write("="*60 + "\n\n")
            
            for i, result in enumerate(self.results, 1):
                f.write(f"CANDIDATE #{i}: {result['file']}\n")
                f.write("-" * 40 + "\n")
                f.write(f"Name: {result['profile'].get('name', 'N/A')}\n")
                f.write(f"Field: {result['roadmap']['field']}\n")
                f.write(f"Specialization: {result['analysis']['specialization']}\n")
                f.write(f"Experience Level: {result['analysis']['experience_level']:.1f}/5\n")
                f.write(f"Skills Found: {len(result['profile'].get('skills', []))}\n")
                
                f.write("\nImmediate Plan:\n")
                f.write(f"{result['roadmap']['timeline']['immediate']}\n")
                
                f.write("\n" + "="*60 + "\n\n")
        
        print(f"\n📄 Detailed report saved to: {filename}")
    
    def create_sample_resumes(self, count=5):
        """Create sample resume files for testing"""
        print(f"\n📝 Creating {count} sample resume files...")
        
        sample_resumes = [
            """
Alice Johnson
alice.johnson@email.com

EDUCATION
Bachelor of Science in Biology
State University, 2020-2024

SKILLS
Molecular Biology, Genetics, Lab Techniques, Data Analysis, PCR, Research

EXPERIENCE
Research Assistant
University Lab, 2023-2024
- Conducted genetic research
- Analyzed experimental data
- Maintained lab equipment

PROJECTS
Gene Expression Study
- Analyzed gene expression patterns
- Used statistical analysis tools
- Presented findings at conference
""",
            """
Bob Smith
bob.smith@email.com

EDUCATION
Master of Science in Physics
Technical Institute, 2019-2021

SKILLS
Mathematics, Simulation, Data Analysis, Quantum Mechanics, Programming, Research

EXPERIENCE
Physics Tutor
University, 2020-2021
- Taught undergraduate physics
- Developed simulation models
- Graded assignments and exams

PROJECTS
Quantum Simulation
- Built quantum mechanics simulation
- Used Python for calculations
- Published research paper
""",
            """
Carol Davis
carol.davis@email.com

EDUCATION
Bachelor of Science in Chemistry
Chemistry College, 2021-2025

SKILLS
Organic Chemistry, Lab Techniques, Chemical Analysis, Instrumentation, Safety

EXPERIENCE
Lab Intern
Chemical Company, Summer 2024
- Conducted chemical analysis
- Maintained lab safety protocols
- Assisted senior chemists

PROJECTS
Polymer Research
- Developed new polymer compounds
- Tested material properties
- Documented experimental results
""",
            """
David Wilson
david.wilson@email.com

EDUCATION
PhD in Mathematics
Research University, 2018-2023

SKILLS
Statistics, Calculus, Linear Algebra, Modeling, Data Science, Programming

EXPERIENCE
Teaching Assistant
University, 2019-2023
- Taught undergraduate math courses
- Graded assignments
- Conducted tutoring sessions

PROJECTS
Statistical Analysis Tool
- Built data analysis software
- Applied to real-world data
- Published methodology paper
""",
            """
Eva Brown
eva.brown@email.com

EDUCATION
Bachelor of Science in Computer Science
Tech University, 2020-2024

SKILLS
Python, Java, JavaScript, SQL, Machine Learning, Web Development, Data Science

EXPERIENCE
Software Developer Intern
Tech Company, Summer 2023
- Developed web applications
- Implemented machine learning models
- Collaborated with development team

PROJECTS
AI Chatbot
- Built conversational AI system
- Used natural language processing
- Deployed on cloud platform
"""
        ]
        
        # Create resumes directory if it doesn't exist
        resumes_dir = Path("resumes")
        resumes_dir.mkdir(exist_ok=True)
        
        for i in range(min(count, len(sample_resumes))):
            filename = f"candidate_{i+1}.txt"
            filepath = resumes_dir / filename
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(sample_resumes[i])
            
            print(f"✅ Created: {filename}")
        
        print(f"\n📁 Sample resumes created in: {resumes_dir.absolute()}")

def main():
    """Main execution function"""
    print("🔬 BULK SCIENCE CAREER ASSESSMENT")
    print("="*60)
    
    bulk = BulkCareerAssessment()
    
    print("\nSelect option:")
    print("1. Process existing resume files")
    print("2. Create sample resumes for testing")
    print("3. Create samples and process them")
    
    choice = input("\nEnter choice (1-3): ").strip()
    
    if choice == "1":
        folder_path = input("Enter folder path containing resume files: ").strip()
        bulk.process_folder(folder_path)
    elif choice == "2":
        count = input("Number of sample resumes to create (default 5): ").strip()
        try:
            count = int(count) if count else 5
        except ValueError:
            count = 5
        bulk.create_sample_resumes(count)
    elif choice == "3":
        count = input("Number of sample resumes to create (default 5): ").strip()
        try:
            count = int(count) if count else 5
        except ValueError:
            count = 5
        
        bulk.create_sample_resumes(count)
        bulk.process_folder("resumes")
    else:
        print("❌ Invalid choice!")
        return
    
    print("\n✅ Bulk assessment completed!")

if __name__ == "__main__":
    main()
