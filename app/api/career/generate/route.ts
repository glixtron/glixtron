export const runtime = 'edge';

export async function POST(req: Request) {
  const { resume, goal } = await req.json();
  const isLocal = process.env.NODE_ENV === 'development';
  
  // 1. SELECT ENGINE: Ollama for Local, GitHub Models for Production
  const endpoint = isLocal 
    ? 'http://localhost:11434/v1/chat/completions' 
    : 'https://models.inference.ai.azure.com/chat/completions';

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (!isLocal) {
    headers['Authorization'] = 'Bearer ' + process.env.GITHUB_TOKEN;
  }

  const prompt = `Generate a 10,000+ character roadmap for a user moving from their resume to goal: ${goal}. 
  1. 5-10 Best Skills (Name, Duration, Future Market). 
  2. Full month-by-month roadmap. 
  3. Skill gaps analysis.`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: isLocal ? 'deepseek-r1:8b' : 'meta-llama-3-70b-instruct',
      messages: [{ role: 'system', content: 'You are an expert career architect.' }, { role: 'user', content: prompt }],
      stream: true,
      max_tokens: 4000
    })
  });

  // Create streaming response
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      }
    }),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      }
    }
  );
}
