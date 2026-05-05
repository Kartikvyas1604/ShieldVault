const fs = require('fs');
const path = require('path');

const apiDir = '/Users/0xkartikvyas/project/ShieldVault/apps/web/src/app/api';

function fixAPIParams(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixAPIParams(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix param types and usage
      if (content.includes('{ params }: { params: {')) {
        content = content.replace(/\{ params \}: \{ params: \{ (.*?): string \}? \}/g, '{ params }: { params: Promise<{ $1: string }> }');
        
        // Add await params before using
        content = content.replace(/params\.([a-zA-Z0-9_]+)/g, '(await params).$1');
        
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

fixAPIParams(apiDir);
console.log('Fixed params');
