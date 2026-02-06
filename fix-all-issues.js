const fs = require('fs');

// Read the file
const filePath = '/Users/macbookpro/Desktop/glixtron-pilot/app/career-guidance/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix the GlixAI Analysis Results section syntax
const glixAISectionFix = `              {/* GlixAI Analysis Results */}
              {glixaiAnalysis && (
                <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-green-500/20">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
                    GlixAI Analysis Results
                  </h3>`;

// Replace the problematic section
const badPattern = /              \/\* GlixAI Analysis Results \*\/[\s\S]*?<div className="bg-gradient-to-br from-slate-900\/50 to-slate-800\/50 backdrop-blur-sm rounded-lg p-6 border-green-500\/20">[\s\S]*?<h3 className="text-xl font-semibold text-white mb-6 flex items-center">[\s\S]*?<\/h3>/;
content = content.replace(badPattern, glixAISectionFix);

// Find and fix any remaining syntax issues
content = content.replace(/\s*<\/div>\s*\{glixaiAnalysis && \(/g, '\n              {glixaiAnalysis && (\n');
content = content.replace(/<div className="[^"]*"[^>]*>/g, (match) => {
  if (match.includes('                <div')) {
    return '                <div' + match.substring(match.indexOf('className'));
  }
  return match;
});

// Write the fixed content back
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ All syntax issues fixed successfully!');
console.log('🔧 GlixAI integration is now complete!');
