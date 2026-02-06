import logging
from typing import Optional
from shared.skill_dictionary import get_skill_gaps, ROLE_REQUIREMENTS, SKILL_CATEGORIES

logger = logging.getLogger(__name__)

LEARNING_RESOURCES = {
    "python": [
        {"name": "Python for Everybody (Coursera)", "url": "https://www.coursera.org/specializations/python", "type": "course"},
        {"name": "Automate the Boring Stuff", "url": "https://automatetheboringstuff.com", "type": "book"},
    ],
    "javascript": [
        {"name": "JavaScript.info", "url": "https://javascript.info", "type": "tutorial"},
        {"name": "freeCodeCamp JS", "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", "type": "course"},
    ],
    "react": [
        {"name": "React Official Docs", "url": "https://react.dev", "type": "docs"},
        {"name": "Full Stack Open", "url": "https://fullstackopen.com", "type": "course"},
    ],
    "machine learning": [
        {"name": "Andrew Ng ML (Coursera)", "url": "https://www.coursera.org/learn/machine-learning", "type": "course"},
        {"name": "Hands-On ML (O'Reilly)", "url": "https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/", "type": "book"},
    ],
    "docker": [
        {"name": "Docker Official Tutorial", "url": "https://docs.docker.com/get-started/", "type": "tutorial"},
        {"name": "Docker Deep Dive", "url": "https://www.pluralsight.com/courses/docker-deep-dive-update", "type": "course"},
    ],
    "aws": [
        {"name": "AWS Cloud Practitioner", "url": "https://aws.amazon.com/certification/certified-cloud-practitioner/", "type": "certification"},
        {"name": "AWS Free Tier Labs", "url": "https://aws.amazon.com/free/", "type": "hands-on"},
    ],
    "sql": [
        {"name": "SQLBolt", "url": "https://sqlbolt.com", "type": "tutorial"},
        {"name": "Mode SQL Tutorial", "url": "https://mode.com/sql-tutorial/", "type": "tutorial"},
    ],
    "typescript": [
        {"name": "TypeScript Handbook", "url": "https://www.typescriptlang.org/docs/handbook/", "type": "docs"},
        {"name": "Execute Program TS", "url": "https://www.executeprogram.com/courses/typescript", "type": "course"},
    ],
    "kubernetes": [
        {"name": "Kubernetes Docs", "url": "https://kubernetes.io/docs/tutorials/", "type": "docs"},
        {"name": "KodeKloud CKA", "url": "https://kodekloud.com/courses/certified-kubernetes-administrator-cka/", "type": "course"},
    ],
    "tensorflow": [
        {"name": "TensorFlow Tutorials", "url": "https://www.tensorflow.org/tutorials", "type": "docs"},
        {"name": "Deep Learning Specialization", "url": "https://www.coursera.org/specializations/deep-learning", "type": "course"},
    ],
    "pytorch": [
        {"name": "PyTorch Tutorials", "url": "https://pytorch.org/tutorials/", "type": "docs"},
        {"name": "Fast.ai Practical DL", "url": "https://course.fast.ai", "type": "course"},
    ],
    "git": [
        {"name": "Git Handbook", "url": "https://guides.github.com/introduction/git-handbook/", "type": "tutorial"},
        {"name": "Learn Git Branching", "url": "https://learngitbranching.js.org", "type": "interactive"},
    ],
}

PORTFOLIO_PROJECTS = {
    "frontend developer": [
        "E-commerce product page with cart functionality",
        "Real-time dashboard with WebSocket integration",
        "Accessible design system component library",
    ],
    "backend developer": [
        "RESTful API with authentication and rate limiting",
        "Microservice with message queue integration",
        "Database migration and optimization tool",
    ],
    "full stack developer": [
        "Full-stack task management app with real-time updates",
        "Social media dashboard with analytics",
        "E-commerce platform with payment integration",
    ],
    "data scientist": [
        "Customer churn prediction model",
        "NLP sentiment analysis dashboard",
        "Time series forecasting with visualization",
    ],
    "ml engineer": [
        "ML model serving API with monitoring",
        "Automated training pipeline with MLflow",
        "Real-time recommendation engine",
    ],
    "devops engineer": [
        "CI/CD pipeline for microservices",
        "Infrastructure as Code with Terraform",
        "Monitoring stack with alerting",
    ],
    "ai engineer": [
        "RAG-powered Q&A system",
        "Fine-tuned LLM for domain-specific tasks",
        "Multi-agent AI system",
    ],
}


def generate_roadmap(current_skills: list, target_role: str, timeline_weeks: int = 12):
    """Generate a structured career roadmap"""
    gap_analysis = get_skill_gaps(current_skills, target_role)
    role_info = ROLE_REQUIREMENTS.get(target_role.lower(), {})

    phase_weeks = timeline_weeks // 3
    remainder = timeline_weeks % 3

    phases = []

    # Phase 1: Foundation
    foundation_skills = gap_analysis.get("missing_must_have", [])[:4]
    phases.append({
        "name": "Foundation",
        "weeks": f"1-{phase_weeks}",
        "duration": f"{phase_weeks} weeks",
        "skills": foundation_skills if foundation_skills else ["core fundamentals"],
        "milestones": [
            f"Complete fundamentals of {', '.join(foundation_skills[:2]) if foundation_skills else target_role}",
            "Build 1 small practice project",
            "Set up development environment and tools",
        ],
        "resources": get_resources_for_skills(foundation_skills),
    })

    # Phase 2: Advanced Specialization
    advanced_skills = gap_analysis.get("missing_must_have", [])[4:] + gap_analysis.get("missing_nice_to_have", [])[:3]
    p2_start = phase_weeks + 1
    p2_end = phase_weeks * 2
    phases.append({
        "name": "Advanced Specialization",
        "weeks": f"{p2_start}-{p2_end}",
        "duration": f"{phase_weeks} weeks",
        "skills": advanced_skills if advanced_skills else ["advanced topics"],
        "milestones": [
            f"Deep dive into {', '.join(advanced_skills[:2]) if advanced_skills else 'specialization'}",
            "Build 1 medium complexity project",
            "Contribute to open source",
        ],
        "resources": get_resources_for_skills(advanced_skills),
    })

    # Phase 3: Industry Certification
    p3_start = phase_weeks * 2 + 1
    p3_end = timeline_weeks
    phases.append({
        "name": "Industry Certification & Portfolio",
        "weeks": f"{p3_start}-{p3_end}",
        "duration": f"{phase_weeks + remainder} weeks",
        "skills": ["certification", "portfolio", "interview prep"],
        "milestones": [
            "Complete relevant industry certification",
            "Build portfolio project showcasing all skills",
            "Practice mock interviews and system design",
        ],
        "resources": [],
    })

    projects = PORTFOLIO_PROJECTS.get(target_role.lower(), [
        "Personal portfolio website",
        "API-driven application",
        "Open source contribution",
    ])

    return {
        "target_role": target_role,
        "timeline_weeks": timeline_weeks,
        "phases": phases,
        "skill_gap_analysis": gap_analysis,
        "portfolio_projects": projects,
        "current_skills_count": len(current_skills),
        "skills_to_learn": len(gap_analysis.get("missing_must_have", [])) + len(gap_analysis.get("missing_nice_to_have", [])),
    }


def get_resources_for_skills(skills: list) -> list:
    """Get learning resources for a list of skills"""
    resources = []
    for skill in skills:
        skill_lower = skill.lower()
        if skill_lower in LEARNING_RESOURCES:
            resources.extend(LEARNING_RESOURCES[skill_lower])
    return resources[:6]
