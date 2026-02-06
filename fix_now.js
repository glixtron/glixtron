const fs = require('fs');
const path = './app/career-guidance/page.tsx';
let c = fs.readFileSync(path, 'utf8');
c = c.replace(/\{\/\* GlixAI Analysis Results \*\/\}/g, ')} {/* GlixAI Analysis Results */} {glixaiAnalysis && (');
if (!c.includes('export default')) {
    c += '
          )}
        </div>
      </div>
    </div>
  )}
';
}
fs.writeFileSync(path, c);
console.log('🚀 GlixAI Frontend Fixed!');
