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

// Basic job information extraction (replace with AI in production)
function extractJobInfo(content: string) {
  const lines = content.split('\n');
  
  // Extract job title (common patterns)
  const jobTitle = extractField(content, [
    /job title[:\s]+(.+)/i,
    /position[:\s]+(.+)/i,
    /role[:\s]+(.+)/i,
    /^(senior|junior|lead|principal|staff|intern).+/i
  ]) || 'Job Title Not Found';

  // Extract company name
  const companyName = extractField(content, [
    /company[:\s]+(.+)/i,
    /at\s+([A-Z][a-zA-Z\s&]+)/i,
    /([A-Z][a-zA-Z\s]+)\s+is hiring/i
  ]) || 'Company Not Found';

  // Extract skills (common tech keywords)
  const skillKeywords = [
    'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'C++',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
    'Git', 'CI/CD', 'Agile', 'Scrum', 'REST API',
    'Machine Learning', 'AI', 'Data Science', 'DevOps'
  ];
  
  const foundSkills = skillKeywords.filter(skill => 
    content.toLowerCase().includes(skill.toLowerCase())
  );

  // Extract experience level
  const experienceLevel = extractField(content, [
    /experience[:\s]+(.+)/i,
    /(\d+\+?\s*years?)/i,
    /(senior|junior|lead|principal|staff|intern|entry-level)/i
  ]) || 'Not Specified';

  // Extract salary
  const salary = extractField(content, [
    /\$[\d,]+k?[-\s]*[\d,]*k?/i,
    /salary[:\s]+(.+)/i,
    /compensation[:\s]+(.+)/i
  ]) || 'Not Specified';

  // Extract responsibilities (first few lines that look like responsibilities)
  const responsibilities = lines
    .filter(line => 
      line.length > 20 && 
      (line.includes('develop') || line.includes('design') || line.includes('manage') || 
       line.includes('implement') || line.includes('create') || line.includes('work'))
    )
    .slice(0, 5)
    .map(line => line.replace(/^[-•*]\s*/, '').trim());

  return {
    jobTitle: jobTitle,
    companyName: companyName,
    keySkills: foundSkills,
    experienceLevel: experienceLevel,
    salaryRange: salary,
    responsibilities: responsibilities.length > 0 ? responsibilities : ['Responsibilities not clearly specified'],
    location: extractField(content, [/location[:\s]+(.+)/i, /\b([A-Z][a-zA-Z\s]+,\s*[A-Z]{2})\b/]) || 'Not Specified',
    remote: /remote|work from home|wfh/i.test(content) ? 'Yes' : 'Not Specified',
    employmentType: extractField(content, [/employment type[:\s]+(.+)/i, /(full-time|part-time|contract|temporary)/i]) || 'Not Specified'
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

// Optional: Add a GET endpoint for health check
export async function GET() {
  return NextResponse.json({ 
    status: 'healthy',
    service: 'JD Extractor API with AI Processing',
    version: '2.0.0',
    features: ['Jina Reader Scraping', 'Structured Data Extraction', 'AI-Ready Output']
  });
}
