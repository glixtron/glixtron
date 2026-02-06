"""
GlixAI Adaptive Sprint Generator
Generates 7-day micro-learning sprints for identified skill gaps
"""

SPRINT_TEMPLATES = {
    "python": {
        "skill": "Python Programming",
        "days": {
            "1": {"focus": "Syntax & Data Types Mastery", "resources": [
                {"name": "Python Crash Course (YouTube)", "url": "https://www.youtube.com/results?search_query=python+crash+course", "type": "video"},
                {"name": "W3Schools Python", "url": "https://www.w3schools.com/python/", "type": "tutorial"},
            ]},
            "2": {"focus": "Functions, OOP & Modules", "resources": [
                {"name": "Corey Schafer OOP", "url": "https://www.youtube.com/results?search_query=corey+schafer+python+oop", "type": "video"},
            ]},
            "3": {"focus": "Data Structures & Algorithms", "resources": [
                {"name": "LeetCode Easy Problems", "url": "https://leetcode.com/problemset/all/?difficulty=EASY", "type": "practice"},
            ]},
            "4": {"focus": "Hands-on Project: Build a CLI Tool", "resources": [
                {"name": "Build CLI Apps (GitHub)", "url": "https://github.com/topics/python-cli", "type": "project"},
            ]},
            "5": {"focus": "Libraries: Pandas, NumPy, Requests", "resources": [
                {"name": "Pandas Tutorial", "url": "https://pandas.pydata.org/docs/getting_started/intro_tutorials/", "type": "docs"},
            ]},
            "6": {"focus": "API Development with FastAPI/Flask", "resources": [
                {"name": "FastAPI Tutorial", "url": "https://fastapi.tiangolo.com/tutorial/", "type": "docs"},
            ]},
            "7": {"focus": "Mock Assessment & Code Review", "resources": [
                {"name": "HackerRank Python", "url": "https://www.hackerrank.com/domains/python", "type": "assessment"},
            ]},
        }
    },
    "machine learning": {
        "skill": "Machine Learning",
        "days": {
            "1": {"focus": "ML Fundamentals & Math Review", "resources": [
                {"name": "3Blue1Brown Linear Algebra", "url": "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", "type": "video"},
                {"name": "StatQuest ML", "url": "https://www.youtube.com/c/joshstarmer", "type": "video"},
            ]},
            "2": {"focus": "Supervised Learning: Regression & Classification", "resources": [
                {"name": "Scikit-learn Tutorials", "url": "https://scikit-learn.org/stable/tutorial/", "type": "docs"},
            ]},
            "3": {"focus": "Unsupervised Learning & Clustering", "resources": [
                {"name": "Kaggle ML Course", "url": "https://www.kaggle.com/learn/intro-to-machine-learning", "type": "course"},
            ]},
            "4": {"focus": "Hands-on: Build a Prediction Model", "resources": [
                {"name": "Kaggle Datasets", "url": "https://www.kaggle.com/datasets", "type": "project"},
            ]},
            "5": {"focus": "Neural Networks & Deep Learning Intro", "resources": [
                {"name": "Neural Networks (3B1B)", "url": "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", "type": "video"},
            ]},
            "6": {"focus": "Model Evaluation & Hyperparameter Tuning", "resources": [
                {"name": "MLflow Quickstart", "url": "https://mlflow.org/docs/latest/quickstart.html", "type": "docs"},
            ]},
            "7": {"focus": "Mock Assessment: Kaggle Competition", "resources": [
                {"name": "Kaggle Getting Started", "url": "https://www.kaggle.com/competitions?type=getting-started", "type": "assessment"},
            ]},
        }
    },
    "react": {
        "skill": "React Development",
        "days": {
            "1": {"focus": "React Fundamentals & JSX", "resources": [
                {"name": "React Official Tutorial", "url": "https://react.dev/learn", "type": "docs"},
            ]},
            "2": {"focus": "State, Props & Hooks", "resources": [
                {"name": "React Hooks Guide", "url": "https://react.dev/reference/react/hooks", "type": "docs"},
            ]},
            "3": {"focus": "Routing & API Integration", "resources": [
                {"name": "React Router Docs", "url": "https://reactrouter.com/en/main/start/tutorial", "type": "docs"},
            ]},
            "4": {"focus": "Hands-on: Build a Todo App", "resources": [
                {"name": "React Projects (GitHub)", "url": "https://github.com/topics/react-project", "type": "project"},
            ]},
            "5": {"focus": "State Management & Context", "resources": [
                {"name": "Redux Toolkit", "url": "https://redux-toolkit.js.org/tutorials/quick-start", "type": "docs"},
            ]},
            "6": {"focus": "Testing & Performance", "resources": [
                {"name": "React Testing Library", "url": "https://testing-library.com/docs/react-testing-library/intro/", "type": "docs"},
            ]},
            "7": {"focus": "Mock Assessment: Build a Dashboard", "resources": [
                {"name": "Frontend Mentor", "url": "https://www.frontendmentor.io/challenges", "type": "assessment"},
            ]},
        }
    },
    "docker": {
        "skill": "Docker & Containerization",
        "days": {
            "1": {"focus": "Container Concepts & Docker Setup", "resources": [
                {"name": "Docker Get Started", "url": "https://docs.docker.com/get-started/", "type": "docs"},
            ]},
            "2": {"focus": "Dockerfiles & Image Building", "resources": [
                {"name": "Dockerfile Best Practices", "url": "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/", "type": "docs"},
            ]},
            "3": {"focus": "Docker Compose & Networking", "resources": [
                {"name": "Docker Compose Tutorial", "url": "https://docs.docker.com/compose/gettingstarted/", "type": "docs"},
            ]},
            "4": {"focus": "Hands-on: Containerize a Full-Stack App", "resources": [
                {"name": "Docker Samples", "url": "https://github.com/docker/awesome-compose", "type": "project"},
            ]},
            "5": {"focus": "Docker Volumes & Persistence", "resources": [
                {"name": "Docker Volumes Guide", "url": "https://docs.docker.com/storage/volumes/", "type": "docs"},
            ]},
            "6": {"focus": "Docker in CI/CD Pipelines", "resources": [
                {"name": "GitHub Actions + Docker", "url": "https://docs.github.com/en/actions/publishing-packages/publishing-docker-images", "type": "docs"},
            ]},
            "7": {"focus": "Mock Assessment: Deploy Multi-Container App", "resources": [
                {"name": "Play with Docker", "url": "https://labs.play-with-docker.com/", "type": "assessment"},
            ]},
        }
    },
    "sql": {
        "skill": "SQL & Database Management",
        "days": {
            "1": {"focus": "SQL Basics: SELECT, WHERE, JOIN", "resources": [
                {"name": "SQLBolt", "url": "https://sqlbolt.com/", "type": "tutorial"},
            ]},
            "2": {"focus": "Advanced Queries: Subqueries, CTEs, Window Functions", "resources": [
                {"name": "Mode SQL Tutorial", "url": "https://mode.com/sql-tutorial/", "type": "tutorial"},
            ]},
            "3": {"focus": "Database Design & Normalization", "resources": [
                {"name": "DB Design Guide", "url": "https://www.lucidchart.com/pages/database-diagram/database-design", "type": "tutorial"},
            ]},
            "4": {"focus": "Hands-on: Design a Database Schema", "resources": [
                {"name": "SQLZoo Exercises", "url": "https://sqlzoo.net/wiki/SQL_Tutorial", "type": "practice"},
            ]},
            "5": {"focus": "Indexing & Query Optimization", "resources": [
                {"name": "Use The Index, Luke", "url": "https://use-the-index-luke.com/", "type": "tutorial"},
            ]},
            "6": {"focus": "NoSQL Comparison & When to Use", "resources": [
                {"name": "MongoDB University", "url": "https://university.mongodb.com/", "type": "course"},
            ]},
            "7": {"focus": "Mock Assessment: Complex Queries", "resources": [
                {"name": "HackerRank SQL", "url": "https://www.hackerrank.com/domains/sql", "type": "assessment"},
            ]},
        }
    },
    "hplc": {
        "skill": "High-Performance Liquid Chromatography",
        "days": {
            "1": {"focus": "HPLC Fundamentals & Full-Form Mastery", "resources": [
                {"name": "HPLC Basics (YouTube)", "url": "https://www.youtube.com/results?search_query=hplc+basics+tutorial", "type": "video"},
            ]},
            "2": {"focus": "Column Selection & Mobile Phase", "resources": [
                {"name": "ChromAcademy Free Modules", "url": "https://www.chromacademy.com/", "type": "course"},
            ]},
            "3": {"focus": "Method Development & Validation", "resources": [
                {"name": "ICH Guidelines Q2", "url": "https://www.ich.org/page/quality-guidelines", "type": "docs"},
            ]},
            "4": {"focus": "Hands-on: Lab Simulation & Data Analysis", "resources": [
                {"name": "Virtual Lab HPLC", "url": "https://www.youtube.com/results?search_query=virtual+hplc+lab+simulation", "type": "video"},
            ]},
            "5": {"focus": "Troubleshooting Common Issues", "resources": [
                {"name": "HPLC Troubleshooting Guide", "url": "https://www.youtube.com/results?search_query=hplc+troubleshooting", "type": "video"},
            ]},
            "6": {"focus": "Advanced: UHPLC & Coupled Techniques", "resources": [
                {"name": "UHPLC vs HPLC", "url": "https://www.youtube.com/results?search_query=uhplc+vs+hplc", "type": "video"},
            ]},
            "7": {"focus": "Glix-Verified Mock Assessment", "resources": [
                {"name": "Analytical Chemistry Quiz", "url": "https://www.proprofs.com/quiz-school/topic/analytical-chemistry", "type": "assessment"},
            ]},
        }
    },
}

# Generic sprint template for unknown skills
GENERIC_SPRINT = {
    "1": {"focus": "Concepts & Full-Form Mastery"},
    "2": {"focus": "Core Theory & Fundamentals"},
    "3": {"focus": "Practical Examples & Case Studies"},
    "4": {"focus": "Hands-on Project / Lab Simulation"},
    "5": {"focus": "Advanced Topics & Edge Cases"},
    "6": {"focus": "Real-World Application & Integration"},
    "7": {"focus": "Glix-Verified Mock Assessment"},
}


def generate_sprint(skill: str) -> dict:
    """Generate a 7-day micro-learning sprint for a skill"""
    skill_lower = skill.lower().strip()

    if skill_lower in SPRINT_TEMPLATES:
        template = SPRINT_TEMPLATES[skill_lower]
        return {
            "skill": template["skill"],
            "duration": "7 days",
            "type": "Micro-Learning Sprint",
            "days": template["days"],
            "completion_badge": f"GlixAI Verified: {template['skill']}",
        }

    # Generate from generic template
    return {
        "skill": skill,
        "duration": "7 days",
        "type": "Micro-Learning Sprint",
        "days": {
            day: {
                "focus": f"{info['focus']} - {skill}",
                "resources": [
                    {"name": f"{skill} Tutorial (YouTube)", "url": f"https://www.youtube.com/results?search_query={skill.replace(' ', '+')}+tutorial+day+{day}", "type": "video"},
                ]
            }
            for day, info in GENERIC_SPRINT.items()
        },
        "completion_badge": f"GlixAI Verified: {skill}",
    }


def generate_gap_sprints(missing_skills: list) -> list:
    """Generate sprints for all missing skills"""
    return [generate_sprint(skill) for skill in missing_skills[:5]]
