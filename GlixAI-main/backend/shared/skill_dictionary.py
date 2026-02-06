# Master Skill Dictionary for NLP matching
# Maps abbreviations, acronyms, and short forms to full forms

SKILL_DICTIONARY = {
    # Programming Languages
    "js": "JavaScript",
    "ts": "TypeScript",
    "py": "Python",
    "rb": "Ruby",
    "cpp": "C++",
    "c#": "C Sharp",
    "go": "Go",
    "rs": "Rust",

    # AI/ML
    "ai": "Artificial Intelligence",
    "ml": "Machine Learning",
    "dl": "Deep Learning",
    "nlp": "Natural Language Processing",
    "cv": "Computer Vision",
    "nn": "Neural Networks",
    "cnn": "Convolutional Neural Network",
    "rnn": "Recurrent Neural Network",
    "llm": "Large Language Model",
    "gpt": "Generative Pre-trained Transformer",
    "rl": "Reinforcement Learning",
    "gan": "Generative Adversarial Network",

    # Data Science
    "ds": "Data Science",
    "da": "Data Analysis",
    "de": "Data Engineering",
    "etl": "Extract Transform Load",
    "eda": "Exploratory Data Analysis",
    "bi": "Business Intelligence",

    # Cloud & DevOps
    "aws": "Amazon Web Services",
    "gcp": "Google Cloud Platform",
    "k8s": "Kubernetes",
    "ci/cd": "Continuous Integration / Continuous Deployment",
    "iac": "Infrastructure as Code",
    "vm": "Virtual Machine",
    "cdn": "Content Delivery Network",
    "dns": "Domain Name System",
    "vpc": "Virtual Private Cloud",

    # Web Development
    "html": "HyperText Markup Language",
    "css": "Cascading Style Sheets",
    "api": "Application Programming Interface",
    "rest": "Representational State Transfer",
    "graphql": "GraphQL",
    "spa": "Single Page Application",
    "ssr": "Server Side Rendering",
    "pwa": "Progressive Web App",
    "dom": "Document Object Model",

    # Frameworks
    "rn": "React Native",
    "ng": "Angular",
    "vue": "Vue.js",
    "django": "Django",
    "flask": "Flask",
    "fastapi": "FastAPI",
    "express": "Express.js",
    "nextjs": "Next.js",
    "nuxt": "Nuxt.js",
    "spring": "Spring Framework",

    # Databases
    "sql": "Structured Query Language",
    "nosql": "NoSQL",
    "db": "Database",
    "rdbms": "Relational Database Management System",
    "orm": "Object Relational Mapping",
    "pg": "PostgreSQL",
    "mongo": "MongoDB",

    # Security
    "auth": "Authentication",
    "oauth": "OAuth",
    "jwt": "JSON Web Token",
    "ssl": "Secure Sockets Layer",
    "tls": "Transport Layer Security",
    "xss": "Cross-Site Scripting",
    "csrf": "Cross-Site Request Forgery",
    "iam": "Identity and Access Management",

    # Methodologies
    "agile": "Agile",
    "scrum": "Scrum",
    "tdd": "Test Driven Development",
    "bdd": "Behavior Driven Development",
    "oop": "Object Oriented Programming",
    "fp": "Functional Programming",
    "ddd": "Domain Driven Design",
    "solid": "SOLID Principles",
    "dry": "Don't Repeat Yourself",

    # Roles
    "swe": "Software Engineer",
    "sde": "Software Development Engineer",
    "fe": "Frontend Engineer",
    "be": "Backend Engineer",
    "fsd": "Full Stack Developer",
    "devops": "DevOps Engineer",
    "sre": "Site Reliability Engineer",
    "pm": "Product Manager",
    "po": "Product Owner",
    "qa": "Quality Assurance",
    "ux": "User Experience",
    "ui": "User Interface",

    # General Tech
    "os": "Operating System",
    "ide": "Integrated Development Environment",
    "cli": "Command Line Interface",
    "gui": "Graphical User Interface",
    "sdk": "Software Development Kit",
    "saas": "Software as a Service",
    "paas": "Platform as a Service",
    "iaas": "Infrastructure as a Service",
    "iot": "Internet of Things",
    "ar": "Augmented Reality",
    "vr": "Virtual Reality",
    "blockchain": "Blockchain",
    "web3": "Web3",
    "defi": "Decentralized Finance",
    "nft": "Non-Fungible Token",
}

# Skill categories for matching
SKILL_CATEGORIES = {
    "programming": ["python", "javascript", "typescript", "java", "c++", "c#", "go", "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "perl", "lua", "dart"],
    "frontend": ["react", "angular", "vue.js", "svelte", "next.js", "nuxt.js", "html", "css", "sass", "tailwind", "bootstrap", "webpack", "vite", "redux", "mobx", "jquery"],
    "backend": ["node.js", "express.js", "fastapi", "django", "flask", "spring boot", "rails", "laravel", "asp.net", "gin", "fiber", "nest.js"],
    "database": ["postgresql", "mysql", "mongodb", "redis", "elasticsearch", "cassandra", "dynamodb", "sqlite", "oracle", "sql server", "neo4j", "couchdb"],
    "cloud": ["aws", "google cloud platform", "azure", "heroku", "vercel", "netlify", "digital ocean", "cloudflare"],
    "devops": ["docker", "kubernetes", "terraform", "ansible", "jenkins", "github actions", "gitlab ci", "circleci", "prometheus", "grafana", "nginx", "apache"],
    "ai_ml": ["tensorflow", "pytorch", "scikit-learn", "keras", "hugging face", "opencv", "spacy", "nltk", "pandas", "numpy", "matplotlib", "jupyter"],
    "mobile": ["react native", "flutter", "swift", "kotlin", "xamarin", "ionic", "android", "ios"],
    "tools": ["git", "jira", "confluence", "figma", "postman", "swagger", "notion", "slack", "vs code", "vim"],
}

# Role requirements mapping
ROLE_REQUIREMENTS = {
    "frontend developer": {
        "must_have": ["html", "css", "javascript", "react"],
        "nice_to_have": ["typescript", "next.js", "tailwind", "testing", "webpack"],
        "category_focus": ["frontend", "programming"]
    },
    "backend developer": {
        "must_have": ["python", "sql", "api design", "server management"],
        "nice_to_have": ["docker", "aws", "redis", "message queues"],
        "category_focus": ["backend", "database", "programming"]
    },
    "full stack developer": {
        "must_have": ["javascript", "react", "node.js", "sql", "git"],
        "nice_to_have": ["typescript", "docker", "aws", "mongodb", "redis"],
        "category_focus": ["frontend", "backend", "database", "programming"]
    },
    "data scientist": {
        "must_have": ["python", "sql", "statistics", "machine learning", "pandas"],
        "nice_to_have": ["tensorflow", "pytorch", "spark", "tableau", "deep learning"],
        "category_focus": ["ai_ml", "database", "programming"]
    },
    "ml engineer": {
        "must_have": ["python", "machine learning", "tensorflow", "docker"],
        "nice_to_have": ["kubernetes", "mlops", "aws", "spark", "distributed computing"],
        "category_focus": ["ai_ml", "devops", "programming"]
    },
    "devops engineer": {
        "must_have": ["docker", "kubernetes", "ci/cd", "linux", "scripting"],
        "nice_to_have": ["terraform", "aws", "monitoring", "security", "networking"],
        "category_focus": ["devops", "cloud", "tools"]
    },
    "cloud architect": {
        "must_have": ["aws", "networking", "security", "infrastructure design"],
        "nice_to_have": ["terraform", "kubernetes", "multi-cloud", "cost optimization"],
        "category_focus": ["cloud", "devops"]
    },
    "mobile developer": {
        "must_have": ["react native", "javascript", "mobile ui", "api integration"],
        "nice_to_have": ["typescript", "swift", "kotlin", "firebase", "testing"],
        "category_focus": ["mobile", "frontend", "programming"]
    },
    "ai engineer": {
        "must_have": ["python", "deep learning", "nlp", "llm", "api design"],
        "nice_to_have": ["pytorch", "transformers", "mlops", "vector databases", "prompt engineering"],
        "category_focus": ["ai_ml", "backend", "programming"]
    },
}


def expand_abbreviation(term):
    """Expand abbreviation to full form"""
    return SKILL_DICTIONARY.get(term.lower(), term)


def normalize_skills(skills):
    """Normalize a list of skills using the dictionary"""
    normalized = []
    for skill in skills:
        expanded = expand_abbreviation(skill.strip())
        normalized.append(expanded.lower())
    return list(set(normalized))


def calculate_skill_match(user_skills, job_skills):
    """Calculate match score between user skills and job requirements"""
    user_normalized = set(normalize_skills(user_skills))
    job_normalized = set(normalize_skills(job_skills))
    
    if not job_normalized:
        return 0.0
    
    overlap = user_normalized.intersection(job_normalized)
    score = len(overlap) / len(job_normalized) * 100
    
    return round(score, 1)


def get_skill_gaps(user_skills, target_role):
    """Identify skill gaps for a target role"""
    role_info = ROLE_REQUIREMENTS.get(target_role.lower(), {})
    if not role_info:
        return {"missing_must_have": [], "missing_nice_to_have": [], "matching": []}
    
    user_normalized = set(normalize_skills(user_skills))
    must_have = set(normalize_skills(role_info.get("must_have", [])))
    nice_to_have = set(normalize_skills(role_info.get("nice_to_have", [])))
    
    missing_must = must_have - user_normalized
    missing_nice = nice_to_have - user_normalized
    matching = user_normalized.intersection(must_have.union(nice_to_have))
    
    return {
        "missing_must_have": list(missing_must),
        "missing_nice_to_have": list(missing_nice),
        "matching": list(matching),
        "match_score": round(len(matching) / max(len(must_have.union(nice_to_have)), 1) * 100, 1)
    }
