import httpx
import logging
import re
from bs4 import BeautifulSoup
from typing import Optional

logger = logging.getLogger(__name__)

# Sample job data for fallback/demo
SAMPLE_JOBS = [
    {
        "title": "Senior Python Developer",
        "company": "TechCorp Inc.",
        "location": "San Francisco, CA",
        "salary": "$150,000 - $180,000",
        "description": "Build scalable backend systems using Python, FastAPI, and cloud services.",
        "skills": ["python", "fastapi", "aws", "docker", "postgresql"],
        "source": "LinkedIn",
        "url": "https://linkedin.com/jobs",
        "posted": "2 days ago",
        "type": "Full-time"
    },
    {
        "title": "Full Stack Engineer",
        "company": "StartupAI",
        "location": "Remote",
        "salary": "$130,000 - $160,000",
        "description": "End-to-end development of AI-powered SaaS platform using React and Node.js.",
        "skills": ["react", "node.js", "typescript", "mongodb", "aws"],
        "source": "Indeed",
        "url": "https://indeed.com/jobs",
        "posted": "1 day ago",
        "type": "Full-time"
    },
    {
        "title": "Machine Learning Engineer",
        "company": "DataFlow Labs",
        "location": "New York, NY",
        "salary": "$160,000 - $200,000",
        "description": "Design and deploy ML models for real-time recommendation systems.",
        "skills": ["python", "tensorflow", "pytorch", "kubernetes", "mlops"],
        "source": "Glassdoor",
        "url": "https://glassdoor.com/jobs",
        "posted": "3 days ago",
        "type": "Full-time"
    },
    {
        "title": "DevOps Engineer",
        "company": "CloudNine Systems",
        "location": "Austin, TX",
        "salary": "$140,000 - $170,000",
        "description": "Manage CI/CD pipelines, container orchestration, and cloud infrastructure.",
        "skills": ["docker", "kubernetes", "terraform", "aws", "jenkins"],
        "source": "LinkedIn",
        "url": "https://linkedin.com/jobs",
        "posted": "5 hours ago",
        "type": "Full-time"
    },
    {
        "title": "Frontend Developer",
        "company": "DesignHub",
        "location": "Los Angeles, CA",
        "salary": "$120,000 - $145,000",
        "description": "Create pixel-perfect, accessible UIs with React and modern CSS frameworks.",
        "skills": ["react", "typescript", "tailwind", "next.js", "figma"],
        "source": "Indeed",
        "url": "https://indeed.com/jobs",
        "posted": "1 day ago",
        "type": "Full-time"
    },
    {
        "title": "Data Scientist",
        "company": "AnalyticsPlus",
        "location": "Chicago, IL",
        "salary": "$135,000 - $165,000",
        "description": "Extract insights from large datasets to drive business decisions using Python and ML.",
        "skills": ["python", "sql", "machine learning", "pandas", "tableau"],
        "source": "Glassdoor",
        "url": "https://glassdoor.com/jobs",
        "posted": "4 days ago",
        "type": "Full-time"
    },
    {
        "title": "AI Engineer",
        "company": "NeuralWorks",
        "location": "Remote",
        "salary": "$170,000 - $210,000",
        "description": "Build and fine-tune LLMs, design RAG pipelines, and deploy AI systems at scale.",
        "skills": ["python", "llm", "pytorch", "langchain", "vector databases"],
        "source": "LinkedIn",
        "url": "https://linkedin.com/jobs",
        "posted": "12 hours ago",
        "type": "Full-time"
    },
    {
        "title": "Cloud Architect",
        "company": "ScaleUp Solutions",
        "location": "Seattle, WA",
        "salary": "$180,000 - $220,000",
        "description": "Design multi-region cloud architectures on AWS with high availability.",
        "skills": ["aws", "terraform", "networking", "security", "kubernetes"],
        "source": "Indeed",
        "url": "https://indeed.com/jobs",
        "posted": "2 days ago",
        "type": "Full-time"
    },
    {
        "title": "React Native Developer",
        "company": "MobileFirst Inc.",
        "location": "Miami, FL",
        "salary": "$125,000 - $150,000",
        "description": "Build cross-platform mobile apps using React Native and TypeScript.",
        "skills": ["react native", "typescript", "javascript", "firebase", "redux"],
        "source": "Glassdoor",
        "url": "https://glassdoor.com/jobs",
        "posted": "3 days ago",
        "type": "Full-time"
    },
    {
        "title": "Backend Engineer - Go",
        "company": "FinTech Corp",
        "location": "Boston, MA",
        "salary": "$145,000 - $175,000",
        "description": "Build high-performance microservices in Go for financial transaction processing.",
        "skills": ["go", "postgresql", "redis", "docker", "grpc"],
        "source": "LinkedIn",
        "url": "https://linkedin.com/jobs",
        "posted": "6 hours ago",
        "type": "Full-time"
    },
]


async def search_jobs_web(query: str, location: str = "", page: int = 1) -> list:
    """Search for jobs using web scraping (Google search)"""
    try:
        search_query = f"{query} jobs {location}".strip()
        url = f"https://www.google.com/search?q={search_query}+site:linkedin.com/jobs+OR+site:indeed.com+OR+site:glassdoor.com"

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(url, headers=headers, follow_redirects=True)

            if response.status_code == 200:
                soup = BeautifulSoup(response.text, "html.parser")
                results = []

                for g in soup.select("div.g")[:10]:
                    title_el = g.select_one("h3")
                    link_el = g.select_one("a")
                    snippet_el = g.select_one("div.VwiC3b")

                    if title_el and link_el:
                        href = link_el.get("href", "")
                        title = title_el.get_text()
                        snippet = snippet_el.get_text() if snippet_el else ""

                        source = "Web"
                        if "linkedin.com" in href:
                            source = "LinkedIn"
                        elif "indeed.com" in href:
                            source = "Indeed"
                        elif "glassdoor.com" in href:
                            source = "Glassdoor"

                        results.append({
                            "title": title,
                            "company": extract_company(title, snippet),
                            "location": location or "Various",
                            "salary": extract_salary(snippet),
                            "description": snippet[:300],
                            "skills": extract_skills_from_text(snippet),
                            "source": source,
                            "url": href,
                            "posted": "Recent",
                            "type": "Full-time"
                        })

                if results:
                    return results

    except Exception as e:
        logger.warning(f"Web search failed: {e}")

    return get_filtered_sample_jobs(query, location)


def get_filtered_sample_jobs(query: str, location: str = "") -> list:
    """Return filtered sample jobs based on query"""
    query_lower = query.lower()
    location_lower = location.lower() if location else ""

    scored_jobs = []
    for job in SAMPLE_JOBS:
        score = 0
        title_lower = job["title"].lower()
        desc_lower = job["description"].lower()
        loc_lower = job["location"].lower()
        skills_str = " ".join(job["skills"]).lower()

        for word in query_lower.split():
            if word in title_lower:
                score += 3
            if word in desc_lower:
                score += 1
            if word in skills_str:
                score += 2

        if location_lower and (location_lower in loc_lower or "remote" in loc_lower):
            score += 2

        if score > 0 or not query_lower:
            scored_jobs.append((score, job))

    scored_jobs.sort(key=lambda x: x[0], reverse=True)

    if not scored_jobs:
        return SAMPLE_JOBS[:5]

    return [j for _, j in scored_jobs[:8]]


def extract_company(title: str, snippet: str) -> str:
    """Extract company name heuristically"""
    parts = title.split(" - ")
    if len(parts) > 1:
        return parts[-1].strip()
    parts = title.split(" at ")
    if len(parts) > 1:
        return parts[-1].strip()
    return "Company"


def extract_salary(text: str) -> str:
    """Extract salary information from text"""
    patterns = [
        r'\$[\d,]+\s*-\s*\$[\d,]+',
        r'\$[\d,]+\s*(?:per year|annually|/yr)',
        r'[\d,]+k\s*-\s*[\d,]+k',
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group()
    return "Competitive"


def extract_skills_from_text(text: str) -> list:
    """Extract skill keywords from text"""
    common_skills = [
        "python", "javascript", "react", "node.js", "aws", "docker",
        "kubernetes", "sql", "mongodb", "typescript", "java", "go",
        "machine learning", "deep learning", "tensorflow", "pytorch",
        "ci/cd", "devops", "agile", "scrum", "git", "linux",
        "api", "rest", "graphql", "html", "css", "tailwind",
        "fastapi", "django", "flask", "spring", "angular", "vue"
    ]
    text_lower = text.lower()
    found = [s for s in common_skills if s in text_lower]
    return found[:6] if found else ["see description"]
