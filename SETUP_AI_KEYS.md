# AI API Keys Setup

## Add to .env.local

Copy your API keys to `.env.local` (create the file if it doesn't exist):

```env
# AI API Keys - Add these for full functionality
GEMINI_API_KEY=your-gemini-api-key-here
DEEPSEEK_API_KEY=your-deepseek-api-key-here
FIRECRAWL_API_KEY=your-firecrawl-api-key-here
```

## Where to Get Keys

- **Gemini**: https://makersuite.google.com/app/apikey
- **DeepSeek**: https://platform.deepseek.com/
- **Firecrawl**: https://firecrawl.dev/

## Security Warning

**If you've shared API keys publicly, rotate them immediately** in each provider's dashboard. Exposed keys can be abused.

- Never commit `.env.local` to git (it's in .gitignore)
- For Vercel/Netlify: Add keys in Environment Variables in dashboard
- Use different keys for development and production

## Verify Setup

After adding keys, restart the dev server:
```bash
npm run dev
```

Test endpoints:
- JD Extraction: Use Job Extractor with a LinkedIn/Indeed URL
- Resume Analysis: Use Resume Scanner with resume + JD
- Career Guidance: Complete assessment, then view career guidance
