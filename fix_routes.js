const fs = require('fs');
const path = require('path');

const baseDir = '/Users/0xkartikvyas/project/ShieldVault/apps/web/src/app';

function replaceInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/lib/g, '../../../../lib');
  fs.writeFileSync(filePath, content);
}

replaceInFile(path.join(baseDir, 'api/vault/state/[walletAddress]/route.ts'));
replaceInFile(path.join(baseDir, 'api/hedge/active/[walletAddress]/route.ts'));
replaceInFile(path.join(baseDir, 'api/hedge/history/[walletAddress]/route.ts'));
replaceInFile(path.join(baseDir, 'api/proof/[hedgePositionId]/route.ts'));
replaceInFile(path.join(baseDir, 'api/audit/[walletAddress]/route.ts'));
console.log('Fixed paths');
