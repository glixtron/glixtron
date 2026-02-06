const fs = require('fs');
const apiPath = './app/api/glix/analyze/route.ts';

const apiContent = `import { NextRequest, NextResponse } from 'next/server';
import { scienceMatcher } from '@/lib/engine/matcher';
import { expandAbbreviations } from '@/lib/engine/utils/dictionary';
import { PCMStream } from '@/lib/engine/streams/pcm';
import { PCBStream } from '@/lib/engine/streams/pcb';
import { PCMBStream } from '@/lib/engine/streams/pcmb';

const streamRegistry = { pcm: PCMStream, pcb: PCBStream, pcmb: PCMBStream };

export async function GET() {
  return NextResponse.json({ status: "operational", provider: "GlixAI" });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText, streamType = 'pcm' } = body;
    if (!resumeText) return NextResponse.json({ error: 'No text' }, { status: 400 });

    const expandedText = expandAbbreviations(resumeText);
    const analysis = scienceMatcher.analyzeResume(expandedText, streamType);
    
    return NextResponse.json({ success: true, data: analysis });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

fs.writeFileSync(apiPath, apiContent);
console.log('✅ API Route Reconstructed');
