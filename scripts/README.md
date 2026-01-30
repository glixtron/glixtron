# Science Career Assessment System

A comprehensive local script-based career assessment system for science students that works without external APIs.

## 🚀 Features

- **No External Dependencies**: Works completely offline without any API calls
- **Field-Specific Assessment**: Personalized questions for Computer Science, Biology, Physics, Chemistry, Mathematics, and Environmental Science
- **Real Resume Analysis**: Extract and analyze actual resume content
- **Personalized Roadmaps**: Generate detailed career roadmaps based on individual profiles
- **Multiple Input Methods**: Resume upload, file input, or manual entry
- **Visual Representations**: ASCII art roadmaps and progress charts
- **Bulk Processing**: Handle multiple candidates at once
- **Quick Assessment**: Fast 2-minute assessment option

## 📁 Files Overview

### Main Scripts

1. **`science-career-assessment.py`** - Main assessment system
   - Complete resume processing and analysis
   - Field-specific question generation
   - Personalized roadmap creation
   - Interactive assessment with 8+ questions per field

2. **`bulk_assessment.py`** - Batch processing tool
   - Process multiple resumes from a folder
   - Generate summary reports
   - Create sample resumes for testing
   - Statistical analysis of candidates

3. **`roadmap_visualizer.py`** - Visualization tools
   - ASCII timeline roadmaps
   - Skill development matrices
   - Progress charts and diagrams
   - Career path visualizations

4. **`quick_assess.py`** - Fast assessment options
   - Mini assessment (2 minutes)
   - Quick assessment (8 questions)
   - Field exploration guide
   - Instant recommendations

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.7 or higher
- No external packages required (uses only Python standard library)

### Setup Instructions

```bash
# Clone or download the scripts
git clone <repository-url>
cd science-career-assessment/scripts

# Make scripts executable (Unix/Linux/macOS)
chmod +x *.py

# Run the main assessment system
python3 science-career-assessment.py
```

## 📖 Usage Guide

### 1. Main Assessment System

```bash
python3 science-career-assessment.py
```

**Features:**
- Resume upload and analysis
- Field-specific questions (8+ per field)
- Personalized career roadmap
- Detailed recommendations
- Results saved to file

**Input Options:**
1. Use sample resume (demo)
2. Load from text file
3. Enter resume text manually

### 2. Quick Assessment

```bash
python3 quick_assess.py
```

**Options:**
1. **Quick Assessment** - 8 questions, detailed results
2. **Mini Assessment** - 2 minutes, instant recommendations
3. **Field Exploration** - Browse different science fields

### 3. Bulk Processing

```bash
python3 bulk_assessment.py
```

**Features:**
- Process multiple resumes from a folder
- Generate summary statistics
- Create sample resumes for testing
- Export detailed reports

### 4. Visualizations

```bash
python3 roadmap_visualizer.py
```

**Visualizations:**
- ASCII timeline roadmaps
- Skill development matrices
- Progress charts
- Career path diagrams
- Interactive dashboard

## 🎯 Supported Fields

### Computer Science
- **Specializations**: AI/ML, Web Development, Data Science, Cybersecurity, Cloud Computing
- **Questions**: Technical preferences, emerging tech, project scale, learning style
- **Careers**: Software Engineer, Data Scientist, ML Engineer, DevOps Engineer

### Biology/Biotechnology
- **Specializations**: Genetics, Bioinformatics, Pharmaceuticals, Environmental Biology
- **Questions**: Research methodology, computational vs experimental, application domains
- **Careers**: Research Scientist, Lab Manager, Biotech Analyst, Clinical Researcher

### Physics
- **Specializations**: Quantum Physics, Astrophysics, Material Science, Applied Physics
- **Questions**: Theoretical vs applied, mathematical complexity, research interests
- **Careers**: Research Scientist, Data Analyst, Engineer, Academic

### Chemistry
- **Specializations**: Organic, Inorganic, Analytical, Environmental Chemistry
- **Questions**: Lab techniques, research areas, industry preferences
- **Careers**: Chemist, Researcher, Quality Control, Environmental Analyst

### Mathematics
- **Specializations**: Applied Math, Statistics, Actuarial Science, Operations Research
- **Questions**: Pure vs applied math, applications, industry preferences
- **Careers**: Data Analyst, Statistician, Actuary, Quantitative Analyst

## 📊 Assessment Process

### Step 1: Resume Analysis
- Extract personal information
- Identify skills and experience
- Determine primary field
- Calculate confidence scores

### Step 2: Question Generation
- Field-specific questions (5 per field)
- General questions (3)
- Personalized based on resume content
- Weighted scoring system

### Step 3: Assessment
- Interactive questionnaire
- Multiple choice format
- Progress tracking
- Answer validation

### Step 4: Analysis
- Category-based scoring
- Strength identification
- Personalized recommendations
- Experience level calculation

### Step 5: Roadmap Generation
- Immediate actions (3-6 months)
- Short-term goals (1 year)
- Mid-term goals (2-3 years)
- Long-term vision (4-5 years)

## 🎨 Visualization Examples

### ASCII Timeline
```
┌─────────────────────────────────────────────────────────────┐
│                  CAREER ROADMAP TIMELINE                   │
├─────────────────────────────────────────────────────────────┤
│  ⚡ IMMEDIATE (3-6 months)                                 │
│  └─ Complete Python/Java fundamentals course...              │
│  🎯 SHORT TERM (1 year)                                    │
│  └─ Deepen specialization knowledge...                        │
│  🚀 MID TERM (2-3 years)                                   │
│  └─ Senior developer roles...                               │
│  🌟 LONG TERM (4-5 years)                                  │
│  └─ Executive technology roles...                           │
└─────────────────────────────────────────────────────────────┘
```

### Skill Matrix
```
SKILL DEVELOPMENT MATRIX
════════════════════════════════════════════════════════════
 1. Python, Statistics      [██████████] 10/10
 2. ML Algorithms           [██████████] 10/10
 3. Deep Learning            [██████████] 10/10
 4. TensorFlow/PyTorch      [██████████] 10/10
 5. Model Deployment         [██████████] 10/10
```

## 📈 Sample Resume Format

Create text files with the following structure:

```
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

EXPERIENCE
Machine Learning Intern
AI Research Lab, Summer 2023
- Developed predictive models using Python
- Implemented deep learning algorithms

PROJECTS
Stock Prediction System
- Built ML model for stock price prediction
- Used Python and TensorFlow
```

## 🔧 Customization

### Adding New Fields

1. Update `LocalAIEngine._load_knowledge_base()` in `science-career-assessment.py`
2. Add field-specific questions in `generate_questions()`
3. Update skill patterns in `_load_skill_patterns()`
4. Add roadmap templates in `_get_*_plan()` methods

### Modifying Questions

Edit the `generate_questions()` method to customize:
- Question content
- Answer options
- Scoring weights
- Question categories

### Customizing Roadmaps

Modify the roadmap generation methods:
- `_get_immediate_plan()`
- `_get_short_term_plan()`
- `_get_mid_term_plan()`
- `_get_long_term_plan()`

## 📊 Output Files

### Assessment Reports
- `career_assessment_YYYYMMDD_HHMMSS.txt` - Detailed assessment report
- `quick_assessment_YYYYMMDD_HHMMSS.txt` - Quick assessment results

### Bulk Reports
- `bulk_assessment_report_YYYYMMDD_HHMMSS.txt` - Comprehensive batch report

### Visualizations
- `roadmap_timeline_YYYYMMDD_HHMMSS.txt` - ASCII timeline
- `roadmap_skills_YYYYMMDD_HHMMSS.txt` - Skill matrix
- `roadmap_progress_YYYYMMDD_HHMMSS.txt` - Progress chart
- `roadmap_dashboard_YYYYMMDD_HHMMSS.txt` - Complete dashboard

## 🎯 Best Practices

### For Users
1. **Be Honest**: Answer questions truthfully for best results
2. **Complete Resume**: Include all relevant experience and skills
3. **Regular Updates**: Reassess every 6-12 months
4. **Follow Roadmap**: Use the generated plan for career development

### For Institutions
1. **Batch Processing**: Use bulk assessment for multiple students
2. **Custom Fields**: Customize for specific educational programs
3. **Integration**: Integrate with existing career counseling systems
4. **Tracking**: Monitor student progress over time

## 🚀 Advanced Features

### Resume Processing
- **Field Detection**: Automatic field identification from resume content
- **Skill Extraction**: Pattern-based skill recognition
- **Experience Analysis**: Work experience parsing and classification
- **Project Identification**: Automatic project extraction

### Assessment Logic
- **Weighted Scoring**: Different question weights for accurate analysis
- **Category Analysis**: Separate scoring for different aspects
- **Experience Level**: Automatic experience level calculation
- **Personalization**: Questions adapted to individual profiles

### Roadmap Generation
- **Timeline-Based**: Clear timeline with specific actions
- **Skill-Focused**: Skill development paths for each specialization
- **Career-Aligned**: Roadmaps aligned with career goals
- **Actionable**: Specific, actionable recommendations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your improvements
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues, questions, or suggestions:
1. Check the README for common solutions
2. Review the code comments for understanding
3. Test with sample data first
4. Report issues with detailed descriptions

## 🌟 Key Benefits

- **No External Dependencies**: Works completely offline
- **Privacy-Focused**: No data sent to external services
- **Customizable**: Easily adapted for specific needs
- **Comprehensive**: Covers multiple science fields
- **Actionable**: Provides specific, actionable guidance
- **Scalable**: Handles individual and bulk assessments
- **Visual**: Includes multiple visualization options
- **Free**: No costs or subscriptions required

This system provides enterprise-grade career assessment capabilities while maintaining complete privacy and independence from external services. Perfect for educational institutions, career centers, or individual use!
