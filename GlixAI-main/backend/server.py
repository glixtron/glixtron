from fastapi import FastAPI, APIRouter, UploadFile, File, Form, Body
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from agents.chat_engine import get_ai_response, analyze_resume_with_ai, generate_roadmap_with_ai
from agents.job_hunter import search_jobs_web
from agents.roadmap_architect import generate_roadmap
from agents.resume_analyzer import parse_resume_text
from agents.risk_analytics import calculate_automation_risk, get_shadow_salary, get_future_proofing_score
from agents.sprint_generator import generate_sprint, generate_gap_sprints
from agents.eq_scoring import analyze_eq_sq
from agents.science_streams import (
    SCIENCE_STREAMS, SCIENCE_FULL_FORMS, get_stream_info,
    get_stream_roles, match_stream_keywords
)
from shared.skill_dictionary import (
    expand_abbreviation, normalize_skills, calculate_skill_match,
    get_skill_gaps, SKILL_DICTIONARY, ROLE_REQUIREMENTS
)
from shared.brand_config import BRAND_CONFIG

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# --- Pydantic Models ---

class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    role: str
    content: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ChatRequest(BaseModel):
    session_id: str
    message: str
    context: Optional[str] = ""

class ChatSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = "New Chat"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    message_count: int = 0

class JobSearchRequest(BaseModel):
    query: str
    location: Optional[str] = ""
    skills: Optional[List[str]] = []
    stream: Optional[str] = ""

class RoadmapRequest(BaseModel):
    current_skills: List[str]
    target_role: str
    timeline_weeks: Optional[int] = 12

class SkillGapRequest(BaseModel):
    current_skills: List[str]
    target_role: str

class ExpandRequest(BaseModel):
    term: str

class RiskRequest(BaseModel):
    job_title: str

class SalaryRequest(BaseModel):
    role: str

class FutureProofRequest(BaseModel):
    role: str
    skills: List[str]

class SprintRequest(BaseModel):
    skill: str

class GapSprintsRequest(BaseModel):
    missing_skills: List[str]

class EQRequest(BaseModel):
    text: str

class StreamRequest(BaseModel):
    stream: str
    skills: Optional[List[str]] = []

class PassportRequest(BaseModel):
    name: str
    skills: List[str]
    target_role: str
    experience_level: Optional[str] = "Mid-Level"
    bio: Optional[str] = ""

class ResumeTextRequest(BaseModel):
    text: str


# --- Chat Endpoints ---

@api_router.post("/chat")
async def chat(request: ChatRequest):
    session_id = request.session_id
    existing = await db.chat_sessions.find_one({"id": session_id}, {"_id": 0})
    if not existing:
        session = ChatSession(id=session_id)
        await db.chat_sessions.insert_one(session.model_dump())

    user_msg = ChatMessage(session_id=session_id, role="user", content=request.message)
    await db.chat_messages.insert_one(user_msg.model_dump())

    ai_text = await get_ai_response(session_id, request.message, request.context or "")

    assistant_msg = ChatMessage(session_id=session_id, role="assistant", content=ai_text)
    await db.chat_messages.insert_one(assistant_msg.model_dump())

    title_text = request.message[:50] + ("..." if len(request.message) > 50 else "")
    await db.chat_sessions.update_one(
        {"id": session_id},
        {"$set": {"updated_at": datetime.now(timezone.utc).isoformat(), "title": title_text},
         "$inc": {"message_count": 2}}
    )

    return {
        "session_id": session_id,
        "message": {
            "id": assistant_msg.id,
            "role": "assistant",
            "content": ai_text,
            "timestamp": assistant_msg.timestamp,
        },
        "brand": BRAND_CONFIG["white_label"],
    }


@api_router.get("/chat/sessions")
async def get_sessions():
    sessions = await db.chat_sessions.find({}, {"_id": 0}).sort("updated_at", -1).to_list(50)
    return {"sessions": sessions, "brand": BRAND_CONFIG["white_label"]}


@api_router.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    messages = await db.chat_messages.find(
        {"session_id": session_id}, {"_id": 0}
    ).sort("timestamp", 1).to_list(200)
    return {"messages": messages, "session_id": session_id}


@api_router.delete("/chat/sessions/{session_id}")
async def delete_session(session_id: str):
    await db.chat_sessions.delete_one({"id": session_id})
    await db.chat_messages.delete_many({"session_id": session_id})
    return {"status": "deleted", "session_id": session_id}


# --- Job Search ---

@api_router.post("/jobs/search")
async def search_jobs(request: JobSearchRequest):
    query = request.query
    if request.stream:
        stream_info = get_stream_info(request.stream)
        if stream_info:
            query += " " + " ".join(stream_info.get("keywords", [])[:3])

    jobs = await search_jobs_web(query, request.location)

    # Add risk scores and salary data
    for job in jobs:
        risk = calculate_automation_risk(job.get("title", ""))
        job["risk_score"] = risk["risk_score"]
        job["risk_level"] = risk["risk_level"]
        job["human_necessity"] = risk["human_necessity"]
        job["horizon"] = risk["horizon"]

        salary_data = get_shadow_salary(job.get("title", ""))
        job["shadow_salary"] = salary_data

        if request.skills:
            job["match_score"] = calculate_skill_match(request.skills, job.get("skills", []))

    if request.skills:
        jobs.sort(key=lambda x: x.get("match_score", 0), reverse=True)

    return {
        "jobs": jobs,
        "total": len(jobs),
        "query": request.query,
        "location": request.location,
        "brand": BRAND_CONFIG["white_label"],
    }


# --- Resume ---

@api_router.post("/resume/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    content = await file.read()
    text = ""
    if file.filename and file.filename.lower().endswith('.pdf'):
        try:
            import PyPDF2
            import io
            reader = PyPDF2.PdfReader(io.BytesIO(content))
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        except Exception as e:
            logging.error(f"PDF parse error: {e}")
            text = content.decode('utf-8', errors='ignore')
    else:
        text = content.decode('utf-8', errors='ignore')

    if not text.strip():
        return {"error": "Could not extract text from the uploaded file."}

    parsed = parse_resume_text(text)
    session_id = f"resume-{str(uuid.uuid4())[:8]}"
    ai_analysis = await analyze_resume_with_ai(session_id, text[:3000])
    eq_sq = analyze_eq_sq(text)

    resume_doc = {
        "id": str(uuid.uuid4()),
        "filename": file.filename,
        "parsed_data": parsed,
        "ai_analysis": ai_analysis,
        "eq_sq_assessment": eq_sq,
        "uploaded_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.resumes.insert_one(resume_doc)
    del resume_doc["_id"]

    return {
        "parsed": parsed,
        "ai_analysis": ai_analysis,
        "eq_sq": eq_sq,
        "resume_id": resume_doc["id"],
        "brand": BRAND_CONFIG["white_label"],
    }


@api_router.post("/resume/analyze-text")
async def analyze_resume_text_endpoint(request: ResumeTextRequest):
    if not request.text.strip():
        return {"error": "No text provided."}

    parsed = parse_resume_text(request.text)
    session_id = f"resume-{str(uuid.uuid4())[:8]}"
    ai_analysis = await analyze_resume_with_ai(session_id, request.text[:3000])
    eq_sq = analyze_eq_sq(request.text)

    return {
        "parsed": parsed,
        "ai_analysis": ai_analysis,
        "eq_sq": eq_sq,
        "brand": BRAND_CONFIG["white_label"],
    }


# --- Roadmap ---

@api_router.post("/roadmap/generate")
async def generate_career_roadmap(request: RoadmapRequest):
    roadmap = generate_roadmap(request.current_skills, request.target_role, request.timeline_weeks)

    session_id = f"roadmap-{str(uuid.uuid4())[:8]}"
    ai_roadmap = await generate_roadmap_with_ai(
        session_id, request.current_skills, request.target_role, request.timeline_weeks
    )

    # Generate gap sprints for missing skills
    missing = roadmap.get("skill_gap_analysis", {}).get("missing_must_have", [])
    sprints = generate_gap_sprints(missing)

    roadmap_doc = {
        "id": str(uuid.uuid4()),
        "target_role": request.target_role,
        "current_skills": request.current_skills,
        "timeline_weeks": request.timeline_weeks,
        "structured_roadmap": roadmap,
        "ai_roadmap": ai_roadmap,
        "sprints": sprints,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.roadmaps.insert_one(roadmap_doc)
    del roadmap_doc["_id"]

    return {
        "structured_roadmap": roadmap,
        "ai_roadmap": ai_roadmap,
        "sprints": sprints,
        "roadmap_id": roadmap_doc["id"],
        "brand": BRAND_CONFIG["white_label"],
    }


# --- Analytics Endpoints ---

@api_router.post("/analytics/risk")
async def get_risk(request: RiskRequest):
    risk = calculate_automation_risk(request.job_title)
    return {"risk": risk, "brand": BRAND_CONFIG["white_label"]}


@api_router.post("/analytics/salary")
async def get_salary(request: SalaryRequest):
    salary = get_shadow_salary(request.role)
    return {"salary": salary, "brand": BRAND_CONFIG["white_label"]}


@api_router.post("/analytics/future-proof")
async def get_future_proof(request: FutureProofRequest):
    result = get_future_proofing_score(request.role, request.skills)
    return {"future_proofing": result, "brand": BRAND_CONFIG["white_label"]}


# --- Sprint Endpoints ---

@api_router.post("/sprints/generate")
async def get_sprint(request: SprintRequest):
    sprint = generate_sprint(request.skill)
    return {"sprint": sprint, "brand": BRAND_CONFIG["white_label"]}


@api_router.post("/sprints/gap")
async def get_gap_sprints(request: GapSprintsRequest):
    sprints = generate_gap_sprints(request.missing_skills)
    return {"sprints": sprints, "total": len(sprints), "brand": BRAND_CONFIG["white_label"]}


# --- EQ/SQ Endpoints ---

@api_router.post("/eq-sq/analyze")
async def analyze_eq(request: EQRequest):
    result = analyze_eq_sq(request.text)
    return {"assessment": result, "brand": BRAND_CONFIG["white_label"]}


# --- Science Streams ---

@api_router.get("/streams")
async def get_streams():
    streams = []
    for code, info in SCIENCE_STREAMS.items():
        streams.append({
            "code": code,
            "title": info["title"],
            "full_name": info["full_name"],
            "roles": info["roles"],
            "portals": info["portals"],
        })
    return {"streams": streams}


@api_router.post("/streams/match")
async def match_stream(request: StreamRequest):
    result = match_stream_keywords(request.skills, request.stream)
    stream_info = get_stream_info(request.stream)
    return {
        "stream": stream_info,
        "match": result,
        "recommended_roles": get_stream_roles(request.stream),
        "brand": BRAND_CONFIG["white_label"],
    }


# --- Glix Passport ---

@api_router.post("/passport/generate")
async def generate_passport(request: PassportRequest):
    gap_analysis = get_skill_gaps(request.skills, request.target_role)
    risk = calculate_automation_risk(request.target_role)
    salary = get_shadow_salary(request.target_role)
    eq_sq = analyze_eq_sq(request.bio or " ".join(request.skills))

    # Generate verified badges
    badges = []
    for skill in request.skills:
        badges.append({
            "skill": skill,
            "verified": True,
            "badge_type": "GlixAI Verified",
        })

    passport = {
        "id": str(uuid.uuid4()),
        "name": request.name,
        "experience_level": request.experience_level,
        "target_role": request.target_role,
        "skills": request.skills,
        "verified_badges": badges,
        "skill_match_score": gap_analysis.get("match_score", 0),
        "gap_analysis": gap_analysis,
        "automation_risk": risk,
        "salary_insight": salary,
        "eq_sq_assessment": eq_sq,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "brand": BRAND_CONFIG["white_label"],
    }

    await db.passports.insert_one({**passport})
    # Remove _id before returning
    passport.pop("_id", None)

    return {"passport": passport}


@api_router.get("/passport/{passport_id}")
async def get_passport(passport_id: str):
    passport = await db.passports.find_one({"id": passport_id}, {"_id": 0})
    if not passport:
        return {"error": "Passport not found"}
    return {"passport": passport}


# --- Skills ---

@api_router.post("/skills/gap-analysis")
async def skill_gap_analysis(request: SkillGapRequest):
    gaps = get_skill_gaps(request.current_skills, request.target_role)
    return {
        "analysis": gaps,
        "target_role": request.target_role,
        "available_roles": list(ROLE_REQUIREMENTS.keys()),
        "brand": BRAND_CONFIG["white_label"],
    }


@api_router.post("/skills/expand")
async def expand_skill(request: ExpandRequest):
    expanded = expand_abbreviation(request.term)
    # Also check science full forms
    if expanded == request.term:
        expanded = SCIENCE_FULL_FORMS.get(request.term.lower(), request.term)
    return {"term": request.term, "expanded": expanded}


@api_router.get("/skills/dictionary")
async def get_skill_dictionary():
    combined = {**SKILL_DICTIONARY, **SCIENCE_FULL_FORMS}
    return {"dictionary": combined, "total": len(combined)}


@api_router.get("/skills/roles")
async def get_available_roles():
    roles = []
    for role, info in ROLE_REQUIREMENTS.items():
        risk = calculate_automation_risk(role)
        salary = get_shadow_salary(role)
        roles.append({
            "name": role,
            "must_have_skills": info.get("must_have", []),
            "nice_to_have_skills": info.get("nice_to_have", []),
            "risk_score": risk["risk_score"],
            "risk_level": risk["risk_level"],
            "salary_range": f"${salary['low']:,} - ${salary['high']:,}",
            "demand": salary.get("demand", "Unknown"),
        })
    return {"roles": roles}


# --- Brand ---

@api_router.get("/brand")
async def get_brand_config():
    return BRAND_CONFIG


@api_router.get("/")
async def root():
    return {"message": "GlixAI Autonomous Engine v1.0", "status": "active", "modules": [
        "chat", "job_search", "resume_analysis", "roadmap_engine",
        "risk_analytics", "sprint_generator", "eq_scoring", "science_streams", "passport"
    ]}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
