#!/usr/bin/env python3
"""
Roadmap Visualizer - Create visual representations of career roadmaps
"""

class RoadmapVisualizer:
    """Create visual roadmap representation"""
    
    @staticmethod
    def create_ascii_roadmap(roadmap):
        """Create ASCII art roadmap"""
        lines = []
        lines.append("┌─────────────────────────────────────────────────────────────┐")
        lines.append("│                  CAREER ROADMAP TIMELINE                   │")
        lines.append("├─────────────────────────────────────────────────────────────┤")
        
        # Immediate (3-6 months)
        immediate_lines = roadmap['timeline']['immediate'].split('\n')
        lines.append("│  ⚡ IMMEDIATE (3-6 months)                                 │")
        lines.append(f"│  └─ {immediate_lines[0][:50]}{'...' if len(immediate_lines[0]) > 50 else ''}│")
        
        # Short term (1 year)
        short_lines = roadmap['timeline']['short_term'].split('\n')
        lines.append("│  🎯 SHORT TERM (1 year)                                    │")
        lines.append(f"│  └─ {short_lines[0][:50]}{'...' if len(short_lines[0]) > 50 else ''}│")
        
        # Mid term (2-3 years)
        mid_lines = roadmap['timeline']['mid_term'].split('\n')
        lines.append("│  🚀 MID TERM (2-3 years)                                   │")
        lines.append(f"│  └─ {mid_lines[0][:50]}{'...' if len(mid_lines[0]) > 50 else ''}│")
        
        # Long term (4-5 years)
        long_lines = roadmap['timeline']['long_term'].split('\n')
        lines.append("│  🌟 LONG TERM (4-5 years)                                  │")
        lines.append(f"│  └─ {long_lines[0][:50]}{'...' if len(long_lines[0]) > 50 else ''}│")
        
        lines.append("└─────────────────────────────────────────────────────────────┘")
        
        return '\n'.join(lines)
    
    @staticmethod
    def create_skill_matrix(skills):
        """Create skill development matrix"""
        matrix = []
        matrix.append("SKILL DEVELOPMENT MATRIX")
        matrix.append("═" * 50)
        
        for i, skill in enumerate(skills, 1):
            progress = min(10, i * 2)  # Simulated progress
            bar = "█" * (progress // 2) + "░" * (10 - progress // 2)
            matrix.append(f"{i:2}. {skill[:25]:25} [{bar}] {progress}/10")
        
        return '\n'.join(matrix)
    
    @staticmethod
    def create_progress_chart(roadmap):
        """Create progress chart visualization"""
        chart = []
        chart.append("CAREER PROGRESS CHART")
        chart.append("═" * 60)
        
        stages = [
            ("Beginner", "🌱"),
            ("Intermediate", "🌿"),
            ("Advanced", "🌳"),
            ("Expert", "🌲")
        ]
        
        current_level = roadmap['experience_level']
        
        for i, (stage, emoji) in enumerate(stages):
            if i < current_level / 1.25:  # Scale to 0-5 range
                status = "✅ COMPLETED"
            elif abs(i - current_level / 1.25) < 0.5:
                status = "🔄 CURRENT"
            else:
                status = "⏳ PENDING"
            
            chart.append(f"{emoji} {stage:12} {status}")
        
        return '\n'.join(chart)
    
    @staticmethod
    def create_timeline_diagram(roadmap):
        """Create detailed timeline diagram"""
        diagram = []
        diagram.append("DETAILED CAREER TIMELINE")
        diagram.append("═" * 80)
        
        timeline_data = [
            ("IMMEDIATE", "⚡", "3-6 months", roadmap['timeline']['immediate']),
            ("SHORT TERM", "🎯", "1 year", roadmap['timeline']['short_term']),
            ("MID TERM", "🚀", "2-3 years", roadmap['timeline']['mid_term']),
            ("LONG TERM", "🌟", "4-5 years", roadmap['timeline']['long_term'])
        ]
        
        for i, (phase, emoji, duration, plan) in enumerate(timeline_data):
            diagram.append(f"\n{emoji} {phase} ({duration})")
            diagram.append("─" * 60)
            
            # Split plan into lines and format
            plan_lines = plan.split('\n')
            for line in plan_lines:
                if line.strip():
                    diagram.append(f"  • {line.strip()}")
        
        return '\n'.join(diagram)
    
    @staticmethod
    def create_skill_wheel(skills):
        """Create a text-based skill wheel visualization"""
        wheel = []
        wheel.append("SKILL DEVELOPMENT WHEEL")
        wheel.append("═" * 40)
        
        # Create circular visualization
        max_skills = min(len(skills), 8)  # Limit to 8 for visual clarity
        
        for i in range(max_skills):
            skill = skills[i]
            # Calculate position in circle
            angle = (360 / max_skills) * i
            
            # Create visual representation
            if i < max_skills // 2:
                wheel.append(f"  {skill[:20]:20} ●")
            else:
                wheel.append(f"  {skill[:20]:20} ○")
        
        wheel.append("\nLegend:")
        wheel.append("● = Core Skill  ○ = Development Skill")
        
        return '\n'.join(wheel)
    
    @staticmethod
    def create_career_path_diagram(roadmap):
        """Create career path diagram"""
        diagram = []
        diagram.append("CAREER PATH DIAGRAM")
        diagram.append("═" * 50)
        
        # Create path visualization
        path_steps = [
            f"Start: {roadmap['field']} Student",
            f"Specialize: {roadmap['specialization']}",
            "Build Portfolio",
            "Gain Experience",
            "Advanced Skills",
            "Leadership Role",
            "Industry Expert"
        ]
        
        for i, step in enumerate(path_steps):
            if i < len(path_steps) - 1:
                diagram.append(f"  {step}")
                diagram.append("      │")
                diagram.append("      ▼")
            else:
                diagram.append(f"  🎯 {step}")
        
        return '\n'.join(diagram)
    
    @staticmethod
    def create_dashboard(roadmap, analysis):
        """Create comprehensive dashboard"""
        dashboard = []
        dashboard.append("CAREER ASSESSMENT DASHBOARD")
        dashboard.append("═" * 80)
        
        # Header
        dashboard.append(f"\n📊 FIELD: {roadmap['field']}")
        dashboard.append(f"🎯 SPECIALIZATION: {roadmap['specialization']}")
        dashboard.append(f"⭐ EXPERIENCE LEVEL: {roadmap['experience_level']}")
        
        # Progress bar
        progress = min(100, (roadmap['experience_level'] / 5) * 100)
        bar_length = 30
        filled = int((progress / 100) * bar_length)
        progress_bar = "█" * filled + "░" * (bar_length - filled)
        dashboard.append(f"\n📈 Progress: [{progress_bar}] {progress:.0f}%")
        
        # Key metrics
        dashboard.append(f"\n📋 KEY METRICS:")
        dashboard.append(f"   Skills to Develop: {len(roadmap['skill_development'])}")
        dashboard.append(f"   Recommended Projects: {len(roadmap['project_recommendations'])}")
        dashboard.append(f"   Career Options: {len(roadmap['career_options'])}")
        dashboard.append(f"   Industry Trends: {len(roadmap['industry_trends'])}")
        
        # Quick actions
        dashboard.append(f"\n⚡ IMMEDIATE ACTIONS:")
        immediate_actions = roadmap['timeline']['immediate'].split('\n')[:3]
        for action in immediate_actions:
            if action.strip():
                dashboard.append(f"   • {action.strip()}")
        
        return '\n'.join(dashboard)
    
    @staticmethod
    def save_visualizations(roadmap, analysis, filename_prefix="roadmap"):
        """Save all visualizations to files"""
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        visualizations = {
            f"{filename_prefix}_timeline_{timestamp}.txt": RoadmapVisualizer.create_ascii_roadmap(roadmap),
            f"{filename_prefix}_skills_{timestamp}.txt": RoadmapVisualizer.create_skill_matrix(roadmap['skill_development']),
            f"{filename_prefix}_progress_{timestamp}.txt": RoadmapVisualizer.create_progress_chart(roadmap),
            f"{filename_prefix}_diagram_{timestamp}.txt": RoadmapVisualizer.create_timeline_diagram(roadmap),
            f"{filename_prefix}_wheel_{timestamp}.txt": RoadmapVisualizer.create_skill_wheel(roadmap['skill_development']),
            f"{filename_prefix}_path_{timestamp}.txt": RoadmapVisualizer.create_career_path_diagram(roadmap),
            f"{filename_prefix}_dashboard_{timestamp}.txt": RoadmapVisualizer.create_dashboard(roadmap, analysis)
        }
        
        created_files = []
        for filename, content in visualizations.items():
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            created_files.append(filename)
        
        return created_files

def main():
    """Demo the visualizer"""
    print("🎨 ROADMAP VISUALIZER DEMO")
    print("="*60)
    
    # Sample roadmap for demonstration
    sample_roadmap = {
        'field': 'Computer Science',
        'specialization': 'AI/ML',
        'experience_level': 2.5,
        'timeline': {
            'immediate': '1. Complete ML fundamentals course\n2. Build 2 ML projects\n3. Learn Python libraries',
            'short_term': '1. Specialize in deep learning\n2. Contribute to open source\n3. Build portfolio',
            'mid_term': '1. Lead ML projects\n2. Publish research\n3. Network with professionals',
            'long_term': '1. Senior ML Engineer\n2. Architecture design\n3. Team leadership'
        },
        'skill_development': [
            'Python Programming',
            'Machine Learning',
            'Deep Learning',
            'Statistics',
            'Data Visualization',
            'Cloud Computing',
            'MLOps',
            'Research Methods'
        ],
        'project_recommendations': [
            'Image Classification System',
            'Chatbot Development',
            'Predictive Analytics',
            'Recommendation Engine'
        ],
        'career_options': [
            'ML Engineer',
            'Data Scientist',
            'AI Researcher',
            'ML Architect'
        ],
        'industry_trends': [
            'AI/ML Integration',
            'Cloud Native ML',
            'AutoML',
            'Edge AI',
            'Explainable AI'
        ]
    }
    
    sample_analysis = {
        'primary_field': 'cs',
        'specialization': 'AI/ML',
        'experience_level': 2.5,
        'strengths': ['Technical Skills', 'Problem Solving', 'Learning Agility'],
        'recommendations': ['Focus on deep learning', 'Build portfolio projects']
    }
    
    print("\nSelect visualization to demo:")
    print("1. ASCII Timeline")
    print("2. Skill Matrix")
    print("3. Progress Chart")
    print("4. Timeline Diagram")
    print("5. Skill Wheel")
    print("6. Career Path")
    print("7. Dashboard")
    print("8. Generate All")
    
    choice = input("\nEnter choice (1-8): ").strip()
    
    if choice == "1":
        print(RoadmapVisualizer.create_ascii_roadmap(sample_roadmap))
    elif choice == "2":
        print(RoadmapVisualizer.create_skill_matrix(sample_roadmap['skill_development']))
    elif choice == "3":
        print(RoadmapVisualizer.create_progress_chart(sample_roadmap))
    elif choice == "4":
        print(RoadmapVisualizer.create_timeline_diagram(sample_roadmap))
    elif choice == "5":
        print(RoadmapVisualizer.create_skill_wheel(sample_roadmap['skill_development']))
    elif choice == "6":
        print(RoadmapVisualizer.create_career_path_diagram(sample_roadmap))
    elif choice == "7":
        print(RoadmapVisualizer.create_dashboard(sample_roadmap, sample_analysis))
    elif choice == "8":
        created_files = RoadmapVisualizer.save_visualizations(sample_roadmap, sample_analysis)
        print(f"\n✅ Created {len(created_files)} visualization files:")
        for file in created_files:
            print(f"   📄 {file}")
    else:
        print("❌ Invalid choice!")

if __name__ == "__main__":
    main()
