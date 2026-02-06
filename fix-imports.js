const fs = require('fs');
const path = './app/career-guidance/page.tsx';

let c = fs.readFileSync(path, 'utf8');

if (c.includes('lucide-react')) {
  if (!c.includes('BarChart3')) {
    // Find the lucide-react import line
    const lines = c.split('\n');
    const importLineIndex = lines.findIndex(line => line.includes('lucide-react'));
    
    if (importLineIndex !== -1) {
      const importLine = lines[importLineIndex];
      const regex = /import\s+{([^}]+)\s+from\s+'lucide-react'/s;
      const match = importLine.match(regex);
      
      if (match && match[1]) {
        const p1 = match[1];
        lines[importLineIndex] = `import {${p1.trim()}, BarChart3 } from 'lucide-react'`;
        c = lines.join('\n');
      }
    }
  }
}

fs.writeFileSync(path, c);
console.log('✅ Fixed BarChart3 import');
