# Glixtron AI Career Platform

A cutting-edge AI-powered career intelligence platform that revolutionizes how professionals navigate their career journeys through advanced 127-dimensional analysis and personalized recommendations.

## 🚀 Features

- **Career Genome AI**: 127-dimensional analysis of skills, personality, and career preferences
- **Smart Job Matching**: AI-powered matching with opportunities that align with your career DNA
- **Resume Optimization**: ATS-compatible resume analysis and optimization
- **Interview Coaching**: AI-driven interview preparation with personalized feedback
- **Skill Development**: Personalized learning paths to bridge skill gaps
- **Career Planning**: Long-term strategy development with milestone tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 14.2.5, React, TypeScript
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: Mock persistent storage (ready for Supabase migration)
- **Styling**: Tailwind CSS, Glass Morphism UI
- **Authentication**: NextAuth.js with credentials provider
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/glixtron-pilot.git
cd glixtron-pilot
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

## 📁 Project Structure

```
glixtron-pilot/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── profile/           # User profile
│   └── register/          # User registration
├── components/            # Reusable React components
├── lib/                   # Utility functions and database
├── public/                # Static assets (logos, images)
├── types/                 # TypeScript type definitions
└── data/                  # Persistent user data (JSON file)
```

## 🎯 Key Features

### Authentication
- User registration with email validation
- Secure login with credentials provider
- Auto-login after registration
- Session management with NextAuth.js

### User Management
- Complete user profiles with social links
- Preference management
- Profile editing and updates
- Admin dashboard for user management

### Career Intelligence
- AI-powered career assessment
- Resume scanning and optimization
- Job matching algorithms
- Skill gap analysis

### Premium UI/UX
- Glass morphism design
- Interactive animations
- Responsive design
- Dark theme optimized

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment
```bash
npm run build
npm start
```

## 🧪 Testing

### Test Users
- **Email**: `test@example.com`
- **Password**: `password123`

### Quick Test Login
Visit `/test-login` for automatic login with test credentials

### Admin Panel
Visit `/admin/users` for user management dashboard

## 📊 Database

The application uses a mock persistent database stored in `/data/users.json`. 

**For production**, migrate to Supabase or another real database:

1. Install Supabase client
2. Set up Supabase project
3. Replace mock database functions with Supabase calls
4. Update environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email us at: [glixtron.global@gmail.com](mailto:glixtron.global@gmail.com)

---

**Built with ❤️ by the Glixtron Team**

### Advanced Features
- **Resume Scanner**: AI-powered resume optimization against job descriptions
  - File upload support (PDF, DOCX, TXT)
  - JD link extraction from job postings
  - Advanced NLP analysis with similarity matching
  - Keyword extraction with similar/related terms
  - Next steps suggestions
  - Hiring probability scoring

- **Authentication System**:
  - Email/password registration and login
  - Google OAuth integration
  - Email verification (mock implementation)
  - Session management with NextAuth.js

- **Data Persistence**:
  - User data storage (mock - ready for database integration)
  - Resume scan history
  - Assessment data saving

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with glassmorphism effects
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Authentication**: NextAuth.js
- **NLP**: Natural language processing with similarity matching
- **File Parsing**: PDF and DOCX support (mock implementation)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- (Optional) Google OAuth credentials for Google login

### Installation

```bash
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your configuration:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-in-production

# Google OAuth (Optional - get from https://console.cloud.google.com/)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

3. Generate a secure NextAuth secret:
```bash
openssl rand -base64 32
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Authentication

### User Registration
1. Navigate to `/register`
2. Fill in name, email, and password
3. Check email for verification code (mock - check console)
4. Verify email at `/verify-email`
5. Sign in at `/login`

### Google OAuth
1. Set up Google OAuth credentials at [Google Cloud Console](https://console.cloud.google.com/)
2. Add credentials to `.env.local`
3. Use "Sign in with Google" button on login/register pages

## Resume Scanner Features

### File Upload
- Supports PDF, DOCX, DOC, and TXT files
- Drag & drop or browse to upload
- Automatic text extraction (mock implementation)

### JD Extraction
- Paste job posting URLs (LinkedIn, Indeed, etc.)
- AI automatically extracts job description
- Or paste JD text directly

### Advanced NLP Analysis
- **Exact Keyword Matching**: Finds exact matches between resume and JD
- **Similar Keywords**: Identifies similar terms using string similarity
- **Related Terms**: Finds related keywords with similarity scores
- **Skill Matching**: Matches skills with similarity detection
- **Next Steps**: AI-generated actionable next steps

### Analysis Results
- Overall match score
- Hiring probability (current vs optimized)
- Skills match/mismatch with similar skills
- Keyword density analysis
- Experience alignment
- Education requirements check
- Prioritized suggestions with impact scores

## Project Structure

```
glixtron-pilot/
├── app/
│   ├── api/auth/          # Authentication API routes
│   ├── assessment/        # Multi-step assessment form
│   ├── dashboard/         # AI analysis dashboard
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── verify-email/      # Email verification page
│   ├── resume-scanner/    # Resume scanning feature
│   └── ...
├── components/
│   ├── ResumeUpload.tsx   # File upload component
│   └── ...
├── lib/
│   ├── auth.ts            # Authentication utilities
│   ├── database.ts        # Data persistence (mock)
│   ├── file-parser.ts     # File parsing utilities
│   ├── nlp-analyzer.ts    # Advanced NLP analysis
│   └── resume-analyzer.ts # Resume analysis engine
└── ...
```

## Project Structure

```
glixtron-pilot/
├── app/
│   ├── assessment/      # Multi-step assessment form
│   ├── dashboard/        # AI analysis dashboard
│   ├── globals.css       # Global styles with dark theme
│   ├── layout.tsx        # Root layout with Navbar & Footer
│   └── page.tsx          # Landing page
├── components/
│   ├── Navbar.tsx        # Navigation component
│   └── Footer.tsx        # Footer component
└── lib/
    └── mock-data.ts      # Mock AI analysis data generator
```

## Design System

- **Theme**: Dark mode default
- **Colors**: Slate/Blue/Violet accents
- **Effects**: Glassmorphism, subtle gradients
- **Typography**: Modern, clean sans-serif

## Next Steps

- Connect to Python backend for real AI analysis
- Add user authentication
- Implement real job matching API
- Add learning path integration
