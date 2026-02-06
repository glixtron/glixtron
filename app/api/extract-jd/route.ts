import { NextResponse } from 'next/server';

// Initialize AI services
let geminiAI: any = null;
let firecrawlAI: any = null;

// Initialize AI services lazily
const getGeminiAI = () => {
  if (!geminiAI && process.env.GEMINI_API_KEY) {
    try {
      // Dynamic import to avoid require() lint error
      import('@google/generative-ai').then(({ GoogleGenerativeAI }: any) => {
        geminiAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        console.log('Gemini AI initialized successfully');
      }).catch((error: any) => {
        console.warn('Failed to initialize Gemini AI:', error?.message || 'Unknown error');
        console.warn('Falling back to structured parsing');
      });
    } catch (error: any) {
      console.warn('Failed to initialize Gemini AI:', error?.message || 'Unknown error');
      console.warn('Falling back to structured parsing');
    }
  }
  return geminiAI;
};

const getFirecrawlAI = () => {
  if (!firecrawlAI && process.env.FIRECRAWL_API_KEY) {
    try {
      // Firecrawl would require a custom implementation or SDK
      // For now, we'll use a placeholder
      firecrawlAI = {
        scrapeUrl: async (url: string) => {
          // Placeholder for Firecrawl implementation
          const response = await fetch(`https://api.firecrawl.dev/v1/scrape`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: url,
              formats: ['markdown', 'raw'],
            }),
          });
          
          if (!response.ok) {
            throw new Error(`Firecrawl API error: ${response.status}`);
          }
          
          return await response.json();
        }
      };
    } catch (error: any) {
      console.warn('Failed to initialize Firecrawl AI:', error?.message || 'Unknown error');
    }
  }
  return firecrawlAI;
};

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // 1. SCRAPE: Use Jina Reader to get clean Markdown/Text from the URL
    // This bypasses LinkedIn/Indeed bot protections
    const scrapeResponse = await fetch(`https://r.jina.ai/${url}`, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (!scrapeResponse.ok) {
      throw new Error(`Failed to scrape the URL: ${scrapeResponse.status} ${scrapeResponse.statusText}`);
    }
    
    const scrapeData = await scrapeResponse.json();
    const rawContent = scrapeData.data?.content || scrapeData.data || '';

    if (!rawContent) {
      throw new Error('No content found on the page');
    }

    // 2. AI INTEGRATION: Use Gemini for enhanced data extraction
    let structuredData;
    
    try {
      const gemini = getGeminiAI();
      if (gemini) {
        structuredData = await extractJobInfoWithGemini(rawContent, gemini);
      } else {
        // Fallback to structured parsing
        structuredData = extractJobInfo(rawContent);
        console.log('Using structured parsing fallback (Gemini not available)');
      }
    } catch (error: any) {
      console.warn('AI extraction failed, using structured parsing:', error?.message || 'Unknown error');
      structuredData = extractJobInfo(rawContent);
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        ...structuredData,
        rawContent: rawContent.substring(0, 5000), // Store first 5000 chars for reference
        extractedAt: new Date().toISOString(),
        aiEnhanced: !!getGeminiAI()
      }
    });

  } catch (error: any) {
    console.error("Extraction Error:", error);
    return NextResponse.json({ 
      error: error?.message || "Failed to extract job description",
      details: error?.stack || 'No stack trace available'
    }, { status: 500 });
  }
}

// Enhanced job information extraction using Gemini AI
async function extractJobInfoWithGemini(content: string, geminiAI: any) {
  const model = geminiAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
    Extract the following information from this job description and return it as valid JSON:
    - jobTitle: The job title
    - companyName: The company name
    - keySkills: Array of key technical skills mentioned
    - experienceLevel: The experience level required
    - salaryRange: The salary range if mentioned
    - location: Job location
    - remote: Whether it's remote (Yes/No/Not Specified)
    - employmentType: Employment type (full-time/part-time/contract/internship)
    - responsibilities: Array of key responsibilities as bullet points
    - requirements: Array of key requirements as bullet points
    - benefits: Array of benefits mentioned
    - applicationDeadline: Application deadline if mentioned
    
    Job Content: ${content.substring(0, 8000)}
    
    Return ONLY valid JSON. No markdown formatting, no code blocks, no explanations.
  `;

  const result = await model.generateContent(prompt);
  const aiResponse = result.response.text();
  
  // Clean JSON if the AI adds markdown blocks
  const cleanedJson = aiResponse.replace(/```json|```/g, '').trim();
  
  try {
    return JSON.parse(cleanedJson);
  } catch (error: any) {
    console.warn('Failed to parse AI response, using fallback parsing:', error?.message || 'Unknown error');
    return extractJobInfo(content);
  }
}

// Basic job information extraction (enhanced with GlixAI patterns)
function extractJobInfo(content: string) {
  const lines = content.split('\n');
  
  // Enhanced skill keywords from GlixAI job hunter
  const skillKeywords = [
    // Frontend
    'React', 'TypeScript', 'JavaScript', 'Next.js', 'Vue.js', 'Angular', 'HTML', 'CSS', 'Tailwind', 'SASS',
    // Backend
    'Node.js', 'Python', 'Java', 'Go', 'Rust', 'PHP', 'Ruby', 'C++', 'C#', 'Express', 'FastAPI', 'Django',
    // Database
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Cassandra', 'DynamoDB',
    // Cloud & DevOps
    'AWS', 'Azure', 'Google Cloud', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Jenkins', 'GitLab CI',
    // AI/ML
    'Machine Learning', 'AI', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy',
    'LLM', 'LangChain', 'Vector Databases', 'MLOps',
    // Mobile
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android',
    // Tools & Others
    'Git', 'REST API', 'GraphQL', 'Microservices', 'Agile', 'Scrum', 'TDD', 'Unit Testing'
  ];
  
  const foundSkills = skillKeywords.filter(skill => 
    content.toLowerCase().includes(skill.toLowerCase())
  );

  // Enhanced job title extraction
  const jobTitlePatterns = [
    /(?:job\s+title|position|role)[:\s]+(.+)/i,
    /(?:senior|junior|lead|principal|staff|intern|entry-level|mid-level|sr\.|jr\.)\s+(.+)/i,
    /(?:software|frontend|backend|full[-\s]?stack|data|machine\s+learning|ai|devops|cloud|mobile)\s+(?:engineer|developer|architect|scientist|manager)/i,
    /^(?:senior|junior|lead|principal|staff|intern|entry-level|mid-level)\s+.+/i
  ];

  const jobTitle = extractFieldWithPatterns(content, jobTitlePatterns) || 'Job Title Not Found';

  // Enhanced company extraction
  const companyPatterns = [
    /(?:company|at)\s+([A-Z][a-zA-Z\s&]+(?:Inc|LLC|Corp|Ltd|Technologies|Solutions)?)/i,
    /([A-Z][a-zA-Z\s&]+(?:Inc|LLC|Corp|Ltd|Technologies|Solutions))\s+is\s+hiring/i,
    /(?:join|work\s+at)\s+([A-Z][a-zA-Z\s&]+)/i
  ];

  const companyName = extractFieldWithPatterns(content, companyPatterns) || 'Company Not Found';

  // Enhanced experience level extraction
  const experiencePatterns = [
    /(?:experience|years?\s+(?:of\s+)?experience?)[:\s]*(\d+\+?\s*(?:years?|yrs?))/i,
    /(\d+\+?\s*(?:years?|yrs?))\s+(?:of\s+)?experience/i,
    /(senior|junior|lead|principal|staff|intern|entry-level|mid-level)/i
  ];

  const experienceLevel = extractFieldWithPatterns(content, experiencePatterns) || 'Not Specified';

  // Enhanced salary extraction
  const salaryPatterns = [
    /\$[\d,]+k?[-\s]*[\d,]*k?\s*(?:\/\s*year|annually|per\s+annum)?/i,
    /(?:salary|compensation|pay)[:\s]*\$?[\d,]+k?[-\s]*[\d,]*k?/i,
    /(?:range|from|to)\s+\$?[\d,]+k?\s*(?:to|-)\s*\$?[\d,]+k?/i
  ];

  const salary = extractFieldWithPatterns(content, salaryPatterns) || 'Not Specified';

  // Enhanced location extraction
  const locationPatterns = [
    /(?:location|based\s+in|office)[:\s]*([A-Z][a-zA-Z\s,]+(?:\s*[A-Z]{2})?)/i,
    /\b([A-Z][a-zA-Z\s]+,\s*[A-Z]{2})\b/,
    /(?:remote|work\s+from\s+home|wfh)/i,
    /(?:hybrid|flexible)/i
  ];

  const location = extractFieldWithPatterns(content, locationPatterns) || 'Not Specified';

  // Remote work detection
  const remoteWork = /(?:remote|work\s+from\s+home|wfh|virtual|distributed)/i.test(content);
  const hybridWork = /(?:hybrid|flexible|partial\s+remote)/i.test(content);

  // Enhanced employment type extraction
  const employmentPatterns = [
    /(?:employment\s+type|type|contract)[:\s]*(full[-\s]?time|part[-\s]?time|contract|temporary|internship|freelance|consultant)/i,
    /(full[-\s]?time|part[-\s]?time|contract|temporary|internship|freelance|consultant)\s+(?:position|role|job)/i
  ];

  const employmentType = extractFieldWithPatterns(content, employmentPatterns) || 'Not Specified';

  // Enhanced responsibilities extraction
  const responsibilityKeywords = [
    'develop', 'design', 'implement', 'create', 'build', 'manage', 'lead', 'coordinate',
    'optimize', 'improve', 'maintain', 'support', 'collaborate', 'work with', 'responsible for'
  ];

  const responsibilities = lines
    .filter(line => 
      line.length > 20 && 
      responsibilityKeywords.some(keyword => line.toLowerCase().includes(keyword))
    )
    .slice(0, 8)
    .map(line => line.replace(/^[-•*·▪]\s*/, '').trim())
    .filter(line => line.length > 10);

  // Enhanced requirements extraction
  const requirementKeywords = [
    'requirement', 'qualification', 'skill', 'experience', 'degree', 'certification',
    'must have', 'required', 'needed', 'essential'
  ];

  const requirements = lines
    .filter(line => 
      line.length > 15 && 
      requirementKeywords.some(keyword => line.toLowerCase().includes(keyword))
    )
    .slice(0, 6)
    .map(line => line.replace(/^[-•*·▪]\s*/, '').trim())
    .filter(line => line.length > 10);

  // Benefits extraction
  const benefitKeywords = [
    'benefit', 'insurance', 'health', 'dental', 'vision', '401k', 'retirement',
    'vacation', 'pto', 'paid time off', 'stock', 'equity', 'bonus', 'flexible'
  ];

  const benefits = lines
    .filter(line => 
      line.length > 10 && 
      benefitKeywords.some(keyword => line.toLowerCase().includes(keyword))
    )
    .slice(0, 5)
    .map(line => line.replace(/^[-•*·▪]\s*/, '').trim())
    .filter(line => line.length > 8);

  return {
    jobTitle: jobTitle,
    companyName: companyName,
    keySkills: Array.from(new Set(foundSkills)), // Remove duplicates
    experienceLevel: experienceLevel,
    salaryRange: salary,
    location: location,
    remote: remoteWork ? 'Yes' : (hybridWork ? 'Hybrid' : 'Not Specified'),
    employmentType: employmentType,
    responsibilities: responsibilities.length > 0 ? responsibilities : ['Responsibilities not clearly specified'],
    requirements: requirements.length > 0 ? requirements : [],
    benefits: benefits.length > 0 ? benefits : []
  };
}

function extractField(content: string, patterns: RegExp[]): string {
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return '';
}

function extractFieldWithPatterns(content: string, patterns: RegExp[]): string {
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      // For patterns without capture groups, return the full match
      if (match[1]) {
        return match[1].trim();
      } else if (match[0]) {
        return match[0].trim();
      }
    }
  }
  return '';
}

// Optional: Add a GET endpoint for health check
export async function GET() {
  return NextResponse.json({ 
    status: 'healthy',
    service: 'JD Extractor API with AI Processing',
    version: '2.0.0',
    features: ['Jina Reader Scraping', 'Structured Data Extraction', 'AI-Ready Output']
  });
}
