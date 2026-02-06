import logging
import re

logger = logging.getLogger(__name__)


def parse_resume_text(text: str) -> dict:
    """Parse resume text and extract structured information"""
    text_lower = text.lower()

    skills = extract_skills(text_lower)
    experience = estimate_experience(text_lower)
    education = extract_education(text_lower)
    contact = extract_contact(text)

    return {
        "skills": skills,
        "experience_level": experience,
        "education": education,
        "contact": contact,
        "word_count": len(text.split()),
        "raw_text": text[:2000],
    }


def extract_skills(text: str) -> list:
    """Extract technical skills from resume text"""
    all_skills = [
        "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust",
        "ruby", "php", "swift", "kotlin", "scala", "r", "matlab",
        "react", "angular", "vue", "svelte", "next.js", "nuxt",
        "node.js", "express", "fastapi", "django", "flask", "spring boot",
        "rails", "laravel", "asp.net",
        "html", "css", "sass", "tailwind", "bootstrap",
        "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
        "dynamodb", "sqlite", "oracle", "sql server", "cassandra",
        "aws", "azure", "gcp", "google cloud", "heroku", "vercel",
        "docker", "kubernetes", "terraform", "ansible", "jenkins",
        "ci/cd", "github actions", "gitlab",
        "tensorflow", "pytorch", "scikit-learn", "keras", "opencv",
        "pandas", "numpy", "matplotlib", "jupyter",
        "machine learning", "deep learning", "nlp", "computer vision",
        "data analysis", "data science", "data engineering",
        "git", "linux", "bash", "powershell",
        "rest api", "graphql", "grpc", "websocket",
        "agile", "scrum", "jira", "confluence",
        "figma", "sketch", "adobe xd",
        "react native", "flutter", "android", "ios",
        "microservices", "serverless", "event-driven",
        "sql", "nosql", "etl", "big data", "spark", "hadoop",
        "llm", "transformers", "langchain", "rag",
        "prompt engineering", "fine-tuning",
    ]

    found = []
    for skill in all_skills:
        if skill in text:
            found.append(skill)

    return list(set(found))


def estimate_experience(text: str) -> str:
    """Estimate experience level from resume text"""
    year_patterns = [
        r'(\d+)\+?\s*years?\s*(?:of\s*)?(?:experience|exp)',
        r'(?:experience|exp)[\s:]*(\d+)\+?\s*years?',
    ]

    max_years = 0
    for pattern in year_patterns:
        matches = re.findall(pattern, text)
        for m in matches:
            years = int(m)
            max_years = max(max_years, years)

    senior_keywords = ["senior", "lead", "principal", "staff", "architect", "director", "head of", "vp ", "manager"]
    mid_keywords = ["mid-level", "intermediate", "3+ years", "4+ years", "5+ years"]
    junior_keywords = ["junior", "intern", "entry-level", "graduate", "fresher", "trainee"]

    senior_count = sum(1 for k in senior_keywords if k in text)
    mid_count = sum(1 for k in mid_keywords if k in text)
    junior_count = sum(1 for k in junior_keywords if k in text)

    if max_years >= 7 or senior_count >= 2:
        return "Senior"
    elif max_years >= 3 or mid_count >= 1:
        return "Mid-Level"
    elif junior_count >= 1 or max_years < 2:
        return "Junior"
    else:
        return "Mid-Level"


def extract_education(text: str) -> list:
    """Extract education information"""
    education = []
    degrees = {
        "ph.d": "PhD",
        "phd": "PhD",
        "doctorate": "PhD",
        "master": "Master's",
        "m.s.": "Master's",
        "m.sc": "Master's",
        "mba": "MBA",
        "bachelor": "Bachelor's",
        "b.s.": "Bachelor's",
        "b.sc": "Bachelor's",
        "b.tech": "B.Tech",
        "b.e.": "B.E.",
        "associate": "Associate",
    }

    for key, label in degrees.items():
        if key in text:
            education.append(label)

    return list(set(education)) if education else ["Not specified"]


def extract_contact(text: str) -> dict:
    """Extract contact information"""
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    phone_pattern = r'[\+]?[\d]{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    linkedin_pattern = r'linkedin\.com/in/[\w-]+'

    emails = re.findall(email_pattern, text)
    phones = re.findall(phone_pattern, text)
    linkedin = re.findall(linkedin_pattern, text.lower())

    return {
        "email": emails[0] if emails else None,
        "phone": phones[0] if phones else None,
        "linkedin": linkedin[0] if linkedin else None,
    }
