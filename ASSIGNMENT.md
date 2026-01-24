# Glixtron Pilot MVP - Detailed Assignment

## Project Overview

**Project Name:** Glixtron - AI-Powered Career Intelligence Platform  
**Version:** MVP (Minimum Viable Product)  
**Timeline:** Single-pass prototype development  
**Status:** In Development

---

## Vision Statement

> "Glixtron isn't just another platform - it's your personal career architect."

Glixtron transforms career development through AI-powered intelligence, helping users discover their unique career genome, develop essential skills, and connect with opportunities that truly match their professional DNA.

---

## Core Function Flow

```
Assessment (Genome Mapping) → Development (Skills) → Connection (Job Matching)
```

### 1. Assessment (Genome Mapping)
- Multi-dimensional analysis of user's professional profile
- Captures: Skills, Interests, Values, Work Preferences
- Generates 127-dimension Career Genome

### 2. Development (Skills)
- Identifies skill gaps through AI analysis
- Provides personalized learning pathways
- Recommends courses and resources

### 3. Connection (Job Matching)
- Smart job matching based on Career Genome
- Resume optimization with JD analysis
- Hiring probability scoring

---

## Technical Stack (Strict Constraints)

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** Custom components (Shadcn UI patterns simulated with Tailwind)
- **Icons:** Lucide React
- **Animations:** Framer Motion

### Design System
- **Theme:** Dark mode default
- **Color Palette:**
  - Background: `#0a0a0f` (slate-900)
  - Primary: Blue (`#3b82f6` to `#2563eb`)
  - Accent: Violet (`#8b5cf6` to `#7c3aed`)
  - Text: Slate scale (`#f8fafc` to `#64748b`)
- **Effects:** Glassmorphism, subtle gradients, smooth transitions

---

## Feature Requirements

### ✅ Phase 1: Core MVP (Completed)

#### 1. Landing Page (`/`)
**Purpose:** High-converting entry point

**Components:**
- Hero Section
  - Headline: "Discover Your Career Genome"
  - Subhead: "AI-powered intelligence to assess, develop, and connect you to your future"
  - Primary CTA: "Start Free Assessment" → `/assessment`
- Features Grid (3 cards)
  1. **Career Genome AI:** "127-dimension analysis of your potential"
  2. **Smart Matching:** "Connect with roles that fit your DNA, not just keywords"
  3. **Growth Pathways:** "Personalized roadmaps to close skill gaps"
- Secondary CTA section

**Design Requirements:**
- Gradient backgrounds
- Glassmorphism cards
- Hover effects
- Responsive layout

#### 2. Assessment Engine (`/assessment`)
**Purpose:** Capture user's Career Genome data

**Flow:**
- **Step 1: Core Skills**
  - Input field for top 3 technical/professional skills
  - Example: Python, Design, Sales
  - Validation: Minimum 1 skill required
- **Step 2: Soft Skills**
  - Select buttons for traits
  - Options: Leadership, Empathy, Analytics, Communication, Creativity, Problem Solving
  - Multi-select enabled
  - Validation: Minimum 1 selection required
- **Step 3: Work Preferences**
  - Slider 1: Remote vs Office (0-100%)
  - Slider 2: Startup vs Corporate (0-100%)
- **Completion:**
  - "Analyzing..." loading state (2 seconds)
  - Redirect to `/dashboard`
  - Store data in localStorage

**UX Requirements:**
- Progress bar (Step X of 3)
- Smooth transitions (Framer Motion)
- Back/Next navigation
- Form validation
- Disabled states

#### 3. User Dashboard (`/dashboard`)
**Purpose:** Display AI Analysis and recommendations

**Layout:**
- **Top Bar:**
  - Welcome message: "Hello, Candidate. Here is your Career Genome."
  - Genome dimensions count
- **Left Column (The Genome):**
  - Skill Radar Chart (SVG visualization)
    - 6 dimensions: Technical, Creative, Analytical, Leadership, Communication, Strategic
    - Interactive visualization
  - Career DNA Tags
    - Dynamic tags based on profile (e.g., 'Creative Strategist', 'Data Storyteller')
    - Description paragraph
- **Right Column (The Matches):**
  - 3 "High Match" Job Cards
    - Job Title
    - Company Name
    - Match Score (percentage)
    - Gap Analysis Badge (e.g., "Missing: SQL")
- **Bottom Row (Development):**
  - Recommended Learning Path section
  - 2 mock courses
    - Course Title
    - Provider
    - Duration
    - Skills covered

**Data Source:**
- Mock data generator (`lib/mock-data.ts`)
- Function: `getAiAnalysis(userInputs)`
- Returns consistent JSON structure

---

### 🆕 Phase 2: Resume Scanning Feature (New)

#### 4. Resume Scanner (`/resume-scanner`)
**Purpose:** AI-powered resume optimization against Job Descriptions

**Core Functionality:**

##### 4.1 Resume Input
- **Option A: Text Paste**
  - Large textarea for resume content
  - Character counter
  - Format helper text
- **Option B: File Upload** (Future enhancement)
  - PDF/DOCX support
  - Drag & drop interface
  - File size validation

##### 4.2 Job Description Input
- **Option A: Link Paste**
  - URL input field
  - "Extract JD" button
  - AI fetches and extracts JD from URL
  - Loading state during extraction
  - Display extracted JD in preview
- **Option B: Text Paste**
  - Large textarea for JD content
  - Character counter
  - Toggle between Link/Text modes

##### 4.3 Analysis Engine
- **Process:**
  1. Parse resume content
  2. Extract JD content (from link or text)
  3. AI analysis comparison
  4. Generate suggestions

##### 4.4 Results Display
- **Match Score:** Overall compatibility percentage
- **Section Analysis:**
  - Skills Match/Mismatch
  - Experience Alignment
  - Education Requirements
  - Keywords Coverage
- **Suggestions Panel:**
  - **Critical Improvements** (High priority)
    - Missing keywords
    - Required skills not mentioned
    - Experience gaps
  - **Enhancement Tips** (Medium priority)
    - Better phrasing suggestions
    - Quantifiable achievements
    - Formatting recommendations
  - **Optimization Score:** Hiring probability increase estimate
- **Action Items:**
  - Specific changes to make
  - Priority levels
  - Expected impact

**Technical Implementation:**
- Mock JD extraction (simulates web scraping)
- Resume parsing (text analysis)
- Keyword matching algorithm
- Skill extraction and comparison
- Suggestion generation logic

**UI Components:**
- Two-column layout (Resume | JD)
- Analysis results panel
- Expandable suggestion cards
- Copy-to-clipboard for suggestions
- Export analysis report (future)

---

## File Structure

```
glixtron-pilot/
├── app/
│   ├── assessment/
│   │   └── page.tsx              # Multi-step assessment form
│   ├── dashboard/
│   │   └── page.tsx              # AI analysis dashboard
│   ├── resume-scanner/
│   │   └── page.tsx              # Resume scanning feature
│   ├── globals.css               # Global styles (dark theme)
│   ├── layout.tsx                # Root layout (Navbar + Footer)
│   └── page.tsx                  # Landing page
├── components/
│   ├── Navbar.tsx                # Navigation component
│   ├── Footer.tsx                # Footer component
│   └── ResumeScanner/            # Resume scanner components
│       ├── ResumeInput.tsx       # Resume input component
│       ├── JDInput.tsx           # JD input component
│       ├── AnalysisResults.tsx   # Results display
│       └── SuggestionsPanel.tsx  # Suggestions UI
├── lib/
│   ├── mock-data.ts              # Mock AI analysis generator
│   └── resume-analyzer.ts        # Resume vs JD analysis engine
└── README.md                     # Project documentation
```

---

## Design Specifications

### Color Palette
```css
Background: #0a0a0f
Foreground: #f8fafc
Primary Blue: #3b82f6 → #2563eb
Accent Violet: #8b5cf6 → #7c3aed
Slate Scale: #f8fafc → #64748b → #0f172a
```

### Typography
- **Headings:** Bold, gradient text for emphasis
- **Body:** Slate-300 to slate-400 for readability
- **Font Stack:** System fonts (San Francisco, Segoe UI, etc.)

### Components
- **Cards:** Glass effect with `backdrop-filter: blur(10px)`
- **Buttons:** Gradient backgrounds, hover scale effects
- **Inputs:** Dark backgrounds, blue focus borders
- **Badges:** Colored backgrounds with borders

### Animations
- Page transitions: Fade + slide
- Button hovers: Scale + shadow
- Loading states: Spinner animations
- Progress bars: Smooth width transitions

---

## Data Models

### User Inputs (Assessment)
```typescript
interface UserInputs {
  coreSkills: string[]
  softSkills: string[]
  remotePreference: number  // 0-100
  startupPreference: number // 0-100
}
```

### AI Analysis Response
```typescript
interface AIAnalysis {
  careerDNA: {
    tags: string[]
    description: string
  }
  skillRadar: {
    technical: number
    creative: number
    analytical: number
    leadership: number
    communication: number
    strategic: number
  }
  jobMatches: JobMatch[]
  learningPaths: LearningPath[]
  genomeDimensions: number
}
```

### Resume Analysis Response
```typescript
interface ResumeAnalysis {
  matchScore: number
  skillsMatch: {
    matched: string[]
    missing: string[]
    extra: string[]
  }
  keywords: {
    found: string[]
    missing: string[]
    density: number
  }
  suggestions: Suggestion[]
  hiringProbability: {
    current: number
    optimized: number
    improvement: number
  }
}
```

---

## User Flows

### Flow 1: Career Genome Discovery
1. Landing Page → Click "Start Free Assessment"
2. Assessment Step 1 → Enter core skills
3. Assessment Step 2 → Select soft skills
4. Assessment Step 3 → Adjust preferences
5. Complete → Loading → Dashboard
6. Dashboard → View analysis, matches, learning paths

### Flow 2: Resume Optimization
1. Navigate to `/resume-scanner`
2. Paste/upload resume
3. Paste JD link or text
4. Click "Analyze Resume"
5. View match score and suggestions
6. Review critical improvements
7. Apply suggestions to resume
8. Re-analyze for improved score

---

## Success Metrics

### MVP Goals
- ✅ Functional 3-page prototype
- ✅ Smooth user experience
- ✅ Modern, premium design
- ✅ Mock data integration
- ✅ Responsive layout

### Future Enhancements
- Real AI backend integration
- User authentication
- Database persistence
- Real job matching API
- Learning platform integration
- Resume builder
- Application tracking

---

## Development Guidelines

### Code Standards
- TypeScript strict mode
- Functional components with hooks
- Client components marked with `'use client'`
- Server components by default
- Consistent naming (PascalCase for components)

### Performance
- Lazy loading for heavy components
- Image optimization
- Code splitting
- Minimal bundle size

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Focus states
- Color contrast compliance

---

## Testing Checklist

### Functionality
- [ ] Landing page loads correctly
- [ ] Assessment form validates inputs
- [ ] Dashboard displays mock analysis
- [ ] Resume scanner accepts inputs
- [ ] JD extraction works (mock)
- [ ] Analysis generates suggestions
- [ ] Navigation between pages works

### Design
- [ ] Dark theme applied consistently
- [ ] Glassmorphism effects visible
- [ ] Gradients render correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Animations smooth
- [ ] Loading states clear

### UX
- [ ] Clear CTAs
- [ ] Progress indicators visible
- [ ] Error states handled
- [ ] Form validation messages
- [ ] Smooth transitions

---

## Deployment Notes

### Environment Setup
```bash
npm install
npm run dev      # Development
npm run build    # Production build
npm start        # Production server
```

### Environment Variables (Future)
```
NEXT_PUBLIC_API_URL=
RESUME_ANALYZER_API_KEY=
JD_EXTRACTION_SERVICE_URL=
```

---

## Next Steps After MVP

1. **Backend Integration**
   - Connect to Python AI service
   - Real JD extraction API
   - Resume parsing service

2. **Authentication**
   - User accounts
   - Save assessments
   - Resume library

3. **Enhanced Features**
   - Real-time job matching
   - Learning platform integration
   - Application tracking
   - Career insights dashboard

4. **Performance**
   - Caching strategies
   - API optimization
   - Database indexing

---

## Contact & Support

**Project:** Glixtron Pilot MVP  
**Status:** Active Development  
**Last Updated:** January 2026

---

*This document serves as the comprehensive assignment and specification for the Glixtron MVP development.*
