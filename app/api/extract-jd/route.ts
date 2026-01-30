import { NextResponse } from 'next/server';

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

    // 2. AI INTEGRATION: Use structured parsing to extract job information
    // For now, we'll do basic parsing. In production, you'd use Gemini/GPT here
    const structuredData = extractJobInfo(rawContent);

    return NextResponse.json({ 
      success: true, 
      data: {
        ...structuredData,
        rawContent: rawContent.substring(0, 5000), // Store first 5000 chars for reference
        extractedAt: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error("Extraction Error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to extract job description",
      details: error.stack
    }, { status: 500 });
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
