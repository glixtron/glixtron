# AI Integration Guide - Gemini, DeepSeek, Firecrawl

## Setup Instructions

### 1. Add API Keys to Environment

Create or update `.env.local` with your API keys:

```env
# AI API Keys
GEMINI_API_KEY=your-gemini-api-key
DEEPSEEK_API_KEY=your-deepseek-api-key
FIRECRAWL_API_KEY=your-firecrawl-api-key
```

**Security Note:** Never commit API keys to git. Add `.env.local` to `.gitignore`. If you've exposed keys, rotate them immediately in each provider's dashboard.

### 2. Get Your API Keys

- **Gemini**: [Google AI Studio](https://makersuite.google.com/app/apikey)
- **DeepSeek**: [DeepSeek Platform](https://platform.deepseek.com/)
- **Firecrawl**: [Firecrawl](https://firecrawl.dev/)

---

## Integration Overview

### Firecrawl - JD Extraction
- **Purpose**: Extract job descriptions from URLs (LinkedIn, Indeed, company career pages)
- **API**: `POST /api/jd/firecrawl` - Extract JD from URL
- **Usage**: Automatically used when `extractJDFromURL()` is called and `FIRECRAWL_API_KEY` is set
- **Fallback**: Direct fetch + HTML parsing if Firecrawl fails

### Gemini AI - Resume vs JD Analysis
- **Purpose**: AI-powered resume analysis against job descriptions, improvement suggestions
- **API**: `POST /api/resume/gemini-analyze` - Analyze resume vs JD
- **Features**: Match score, hiring probability, actionable suggestions, key findings
- **Fallback**: Local NLP analyzer if Gemini fails

### DeepSeek - Career Guidance
- **Purpose**: Real-time career analysis, career map, skill gaps, recommended roles
- **API**: `POST /api/career/deepseek` - Career analysis (requires auth)
- **Input**: Resume text + optional assessment data
- **Output**: Career map, recommended roles, skill gaps, next steps

---

## API Endpoints

### JD Extraction (Firecrawl)
```bash
POST /api/jd/firecrawl
Content-Type: application/json
{ "url": "https://linkedin.com/jobs/..." }
```

### Resume Analysis (Gemini)
```bash
POST /api/resume/gemini-analyze
Content-Type: application/json
{ "resume": "...", "jobDescription": "..." }
```

### Career Guidance (DeepSeek)
```bash
POST /api/career/deepseek
Authorization: Session required
Content-Type: application/json
{ 
  "resumeText": "...", 
  "assessmentData": { "coreSkills": [], "softSkills": [], ... } 
}
```

---

## Cross-Device Login

Auth is configured for cross-device access:
- `trustHost: true` - Works across domains
- `useSecureCookies` - HTTPS only in production
- Session updates every 24 hours
- JWT strategy for stateless auth

**For production**: Ensure `NEXTAUTH_URL` matches your deployed URL (e.g., `https://glixtron.vercel.app`).

---

## Real-Time Data Flow

1. **JD Extraction**: User pastes URL → Firecrawl extracts → Returns markdown/text
2. **Resume Analysis**: User uploads/pastes resume + JD → Gemini analyzes → Returns suggestions
3. **Career Guidance**: User completes assessment → DeepSeek analyzes → Returns career map
4. **Dashboard**: Assessment data + resume → DeepSeek career analysis → Career recommendations

---

## Troubleshooting

### Firecrawl fails
- Check API key is valid
- Some sites block scraping - try pasting JD text instead
- Falls back to direct fetch automatically

### Gemini fails
- Check API key and quota
- Falls back to local NLP analysis
- Response may be less detailed

### DeepSeek fails
- Check API key
- Ensure request includes resume text (min 50 chars)
- Requires authentication

### Login not working on other devices
- Verify NEXTAUTH_URL matches your deployment URL
- Check NEXTAUTH_SECRET is set
- Ensure cookies are not blocked
- Use HTTPS in production
