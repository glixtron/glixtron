const fs = require('fs');
const content = fs.readFileSync('/Users/macbookpro/Desktop/glixtron-pilot/app/career-guidance/page.tsx', 'utf8');

const lines = content.split('\n');
let braceCount = 0;
let parenCount = 0;

console.log('🔍 JSX Validation Report\n');

lines.forEach((line, index) => {
  const openBraces = (line.match(/{/g) || []).length;
  const closeBraces = (line.match(/}/g) || []).length;
  const openParens = (line.match(/\(/g) || []).length;
  const closeParens = (line.match(/\)/g) || []).length;
  
  braceCount += openBraces - closeBraces;
  parenCount += openParens - closeParens;
  
  if (openBraces !== closeBraces || openParens !== closeParens) {
    console.log(`❌ Line ${index + 1}: BRACKET MISMATCH`);
    console.log(`   Braces: ${openBraces} open, ${closeBraces} close`);
    console.log(`   Parens: ${openParens} open, ${closeParens} close`);
    console.log(`   Content: ${line.trim()}`);
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Total Brace Balance: ${braceCount}`);
console.log(`   Total Paren Balance: ${parenCount}`);

if (braceCount === 0 && parenCount === 0) {
  console.log('✅ JSX syntax appears valid!');
} else {
  console.log('🚨 JSX syntax issues detected!');
}
