import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { url } = await req.json();

  try {
    // Use Jina Reader to bypass anti-bot and CORS issues
    const proxyUrl = `https://r.jina.ai/${url}`;
    
    const response = await fetch(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch site: ${response.status} ${response.statusText}`);
    }
    
    const cleanText = await response.text();
    
    return NextResponse.json({ 
      success: true,
      data: cleanText,
      url: url,
      extractedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('JD Extraction Error:', error);
    return NextResponse.json({ 
      success: false,
      error: "Could not fetch job description. The website might be blocking automated access or the URL might be invalid.",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Optional: Add a GET endpoint for health check
export async function GET() {
  return NextResponse.json({ 
    status: 'healthy',
    service: 'JD Extractor API',
    version: '1.0.0'
  });
}
