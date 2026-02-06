"""
GlixAI EQ/SQ Assessment Engine
Analyzes emotional and social intelligence from text
"""

import re

# EQ indicators
EQ_POSITIVE_INDICATORS = {
    "leadership": ["led", "managed", "mentored", "guided", "coached", "directed", "supervised", "inspired"],
    "empathy": ["collaborated", "supported", "helped", "assisted", "empowered", "advocated", "facilitated"],
    "self_awareness": ["reflected", "improved", "learned", "adapted", "grew", "evolved", "recognized"],
    "resilience": ["overcame", "resolved", "navigated", "persevered", "recovered", "pivoted", "transformed"],
    "communication": ["presented", "communicated", "articulated", "negotiated", "persuaded", "published", "documented"],
}

# SQ indicators
SQ_POSITIVE_INDICATORS = {
    "teamwork": ["team", "cross-functional", "interdisciplinary", "collaborated", "partnered", "coordinated"],
    "influence": ["stakeholder", "client-facing", "customer", "executive", "board", "presented to"],
    "networking": ["community", "conference", "meetup", "open source", "contributor", "volunteer"],
    "mentoring": ["mentor", "train", "onboard", "teach", "guide", "coach", "knowledge sharing"],
    "conflict_resolution": ["mediated", "resolved conflict", "consensus", "compromise", "aligned"],
}

# Culture fit indicators
CULTURE_PROFILES = {
    "startup": {
        "keywords": ["fast-paced", "startup", "agile", "iterate", "mvp", "scrappy", "wear many hats", "autonomous"],
        "traits": "High autonomy, comfort with ambiguity, rapid iteration"
    },
    "corporate": {
        "keywords": ["enterprise", "process", "compliance", "governance", "large-scale", "established", "fortune 500"],
        "traits": "Structured processes, clear hierarchies, stability-focused"
    },
    "research": {
        "keywords": ["research", "publication", "peer-review", "thesis", "grant", "hypothesis", "experiment", "lab"],
        "traits": "Deep focus, methodical approach, knowledge-driven"
    },
    "creative": {
        "keywords": ["design", "creative", "innovation", "brainstorm", "prototype", "user-centered", "aesthetic"],
        "traits": "Design thinking, creative problem-solving, user empathy"
    },
    "remote": {
        "keywords": ["remote", "distributed", "async", "documentation", "self-directed", "time zones"],
        "traits": "Strong written communication, self-discipline, async collaboration"
    },
}


def analyze_eq_sq(text: str) -> dict:
    """Analyze EQ and SQ from resume/experience text"""
    text_lower = text.lower()
    words = text_lower.split()
    word_count = len(words)

    # Calculate EQ score
    eq_scores = {}
    eq_total = 0
    for category, indicators in EQ_POSITIVE_INDICATORS.items():
        count = sum(1 for ind in indicators if ind in text_lower)
        eq_scores[category] = min(count * 20, 100)
        eq_total += eq_scores[category]

    eq_overall = min(round(eq_total / max(len(EQ_POSITIVE_INDICATORS), 1)), 100)

    # Calculate SQ score
    sq_scores = {}
    sq_total = 0
    for category, indicators in SQ_POSITIVE_INDICATORS.items():
        count = sum(1 for ind in indicators if ind in text_lower)
        sq_scores[category] = min(count * 20, 100)
        sq_total += sq_scores[category]

    sq_overall = min(round(sq_total / max(len(SQ_POSITIVE_INDICATORS), 1)), 100)

    # Culture fit analysis
    culture_matches = []
    for culture, profile in CULTURE_PROFILES.items():
        match_count = sum(1 for kw in profile["keywords"] if kw in text_lower)
        if match_count >= 2:
            culture_matches.append({
                "culture": culture,
                "confidence": min(match_count * 15, 100),
                "traits": profile["traits"]
            })

    culture_matches.sort(key=lambda x: x["confidence"], reverse=True)

    # Strengths and improvement areas
    all_scores = {**{f"EQ-{k}": v for k, v in eq_scores.items()}, **{f"SQ-{k}": v for k, v in sq_scores.items()}}
    strengths = [k for k, v in all_scores.items() if v >= 60]
    improvements = [k for k, v in all_scores.items() if v < 40]

    return {
        "eq_score": eq_overall,
        "sq_score": sq_overall,
        "combined_score": round((eq_overall + sq_overall) / 2),
        "eq_breakdown": eq_scores,
        "sq_breakdown": sq_scores,
        "strengths": strengths[:5],
        "areas_for_improvement": improvements[:5],
        "culture_fit": culture_matches[:3],
        "assessment_note": get_assessment_note(eq_overall, sq_overall),
    }


def get_assessment_note(eq: int, sq: int) -> str:
    combined = (eq + sq) / 2
    if combined >= 70:
        return "Strong interpersonal profile. Well-suited for collaborative and leadership roles."
    elif combined >= 50:
        return "Balanced profile with room for growth in interpersonal areas."
    elif combined >= 30:
        return "Technical focus detected. Consider highlighting more collaborative experiences."
    else:
        return "Profile shows strong individual contributor traits. Team experiences would strengthen applications."
