const fs = require('fs');
const path = require('path');

const componentsDir = '/Users/0xkartikvyas/project/ShieldVault/apps/web/src/components';

function fixUI(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixUI(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      content = content.replace(/from '.*?\/ui\/(Button|Card|StatCard|MetricCard|GridBackground)'/g, "from '@shieldvault/ui'");
      content = content.replace(/from '\.\.?\/ui'/g, "from '@shieldvault/ui'");
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

fixUI(componentsDir);
console.log('Fixed UI in all components');
