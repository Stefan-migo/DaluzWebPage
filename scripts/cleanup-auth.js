const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../src/app/api/admin');

function getFiles(dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, files);
    } else if (fullPath.endsWith('.ts')) {
      files.push(fullPath);
    }
  });
  return files;
}

const allFiles = getFiles(targetDir);
let fixed = 0;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // We are looking for leftovers of getUser() that clash with const { user, supabase } = auth;
  if (!content.includes('const { user, supabase } = auth;')) return;
  if (!content.includes('.getUser()')) return;

  const originalContent = content;

  // Let's strip the blocks using simple regex
  content = content.replace(/const\s*{\s*data:\s*{\s*user\s*}\s*(?:,\s*error:\s*[a-zA-Z0-9_]+\s*)?}\s*=\s*await\s*supabase\.auth\.getUser\(\);?/g, '');
  content = content.replace(/const\s*{\s*data:\s*{\s*user\s*}\s*}\s*=\s*await\s*supabase\.auth\.getUser\(\);?/g, '');
  content = content.replace(/const\s*{\s*error:\s*[a-zA-Z0-9_]+,\s*data:\s*{\s*user\s*}\s*}\s*=\s*await\s*supabase\.auth\.getUser\(\);?/g, '');
  
  // Clean up dangling ifs
  content = content.replace(/if\s*\(!user\s*(?:\|\|\s*[a-zA-Z0-9_]+)?\)\s*{\s*return\s+(?:new\s+)?NextResponse(?:\.json)?\([\s\S]*?\)(?:;)?\s*}/g, '');
  content = content.replace(/if\s*\([a-zA-Z0-9_]+\s*\|\|\s*!user\)\s*{\s*return\s+(?:new\s+)?NextResponse(?:\.json)?\([\s\S]*?\)(?:;)?\s*}/g, '');

  if (originalContent !== content) {
      fs.writeFileSync(file, content);
      fixed++;
      console.log('Fixed leftover user in: ' + file.replace(targetDir, ''));
  }
});

console.log('Total fixed: ' + fixed);

