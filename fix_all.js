const fs = require('fs');
const path = require('path');

const vaultDir = '/Users/0xkartikvyas/project/ShieldVault/apps/web/src/components/vault';
const apiDir = '/Users/0xkartikvyas/project/ShieldVault/apps/web/src/app/api';

function fixUI(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixUI(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      content = content.replace(/from '@shieldvault\/ui\/(Button|Card)'/g, "from '@shieldvault/ui'");
      fs.writeFileSync(fullPath, content);
    }
  }
}

function fixAPI(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixAPI(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      content = content.replace(/(\.\.\/)+lib/g, '@/lib');
      fs.writeFileSync(fullPath, content);
    }
  }
}

fixUI(vaultDir);
fixAPI(apiDir);
console.log('Fixed everything');
