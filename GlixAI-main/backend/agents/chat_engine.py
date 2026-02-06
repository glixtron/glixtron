import os
import logging
from dotenv import load_dotenv
from pathlib import Path
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are GlixAI, an advanced autonomous career intelligence assistant. You help users with:

1. **Job Search**: Finding relevant job opportunities based on skills, experience, and preferences
2. **Resume Analysis**: Analyzing uploaded resumes to extract skills, experience, and provide feedback
3. **Career Roadmap**: Creating personalized career development plans with milestones
4. **Skill Gap Analysis**: Identifying gaps between current skills and target role requirements
5. **Career Coaching**: Providing actionable career advice and industry insights

Your responses should be:
- Specific and actionable (not generic advice)
- Data-driven when possible
- Structured with clear sections using markdown
- Encouraging but honest about skill gaps

When users ask about jobs, ask for: target role, location, experience level, key skills.
When analyzing careers, consider: current skills, target role, timeline, learning style.

Format responses with markdown for readability. Use bullet points, headers, and bold text.
Never mention that you are powered by OpenAI or any specific model. You are GlixAI."""


async def get_ai_response(session_id: str, user_message: str, context: str = "") -> str:
    """Get AI response from GPT-5.2 via Emergent LLM key"""
    try:
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            return "AI service is not configured. Please check the API key."

        system = SYSTEM_PROMPT
        if context:
            system += f"\n\nAdditional context:\n{context}"

        chat = LlmChat(
            api_key=api_key,
            session_id=session_id,
            system_message=system
        )
        chat.with_model("openai", "gpt-5.2")

        msg = UserMessage(text=user_message)
        response = await chat.send_message(msg)
        return response

    except Exception as e:
        logger.error(f"AI chat error: {e}")
        return f"I encountered an issue processing your request. Please try again. Error: {str(e)}"


async def analyze_resume_with_ai(session_id: str, resume_text: str) -> str:
    """Use AI to analyze resume text"""
    prompt = f"""Analyze the following resume and provide:
1. **Extracted Skills** - List all technical and soft skills found
2. **Experience Level** - Junior/Mid/Senior based on the content
3. **Strengths** - Key strengths identified
4. **Areas for Improvement** - Suggestions for improvement
5. **Recommended Roles** - Top 3 roles this person is suited for
6. **Overall Score** - Rate the resume out of 10

Resume text:
---
{resume_text}
---

Provide a detailed, structured analysis."""

    return await get_ai_response(session_id, prompt)


async def generate_roadmap_with_ai(session_id: str, current_skills: list, target_role: str, timeline_weeks: int = 12) -> str:
    """Use AI to generate a career roadmap"""
    skills_str = ", ".join(current_skills) if current_skills else "Not specified"
    prompt = f"""Create a detailed career roadmap:
- **Current Skills**: {skills_str}
- **Target Role**: {target_role}
- **Timeline**: {timeline_weeks} weeks

Generate a structured roadmap with:
1. **Phase 1: Foundation** (Weeks 1-4) - Core skills to build
2. **Phase 2: Advanced Specialization** (Weeks 5-8) - Deep dive topics
3. **Phase 3: Industry Certification** (Weeks 9-{timeline_weeks}) - Certifications & portfolio

For each phase include:
- Specific skills to learn
- Recommended resources (courses, books, projects)
- Weekly milestones
- Practice projects

Also include:
- **Skill Gap Analysis** comparing current skills vs requirements
- **Learning Resources** with direct links to platforms like Coursera, edX, GitHub
- **Portfolio Projects** to demonstrate competency"""

    return await get_ai_response(session_id, prompt)
