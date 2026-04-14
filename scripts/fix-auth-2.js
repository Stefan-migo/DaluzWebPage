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
let migrated = 0;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Si ya tiene requireAdmin o requireAuth importado, lo saltamos (salvo que sea para fixing local)
  if (content.includes('requireAdmin') && !content.includes('verifyAdminUser') && !content.includes('from("admin_users")')) {
    return;
  }
  
  if (!content.includes('createClient')) return;

  const originalContent = content;

  // Remover importaciones viejas
  content = content.replace(/import\s*{\s*createClient[\s\S]*?}\s*from\s*["']@supabase\/supabase-js["'];?\n*/g, '');
  content = content.replace(/import\s*{\s*createClient\s*}\s*from\s*["']@\/utils\/supabase\/server["'];?\n*/g, '');
  content = content.replace(/import\s*{\s*createClient\s*,\s*createServiceRoleClient\s*}\s*from\s*["']@\/utils\/supabase\/server["'];?\n*/g, '');

  
  // Agregar importación de helpers (solo las que se necesiten)
  let helpersToImport = new Set();
  
  // Decide if admin or normal auth
  // By default all admin routes should use requireAdmin() unless it's known to be something else.
  // Actually, we'll try to find the standard patterns.
  
  // Pattern 1: admin_users checking
  const adminUsersRegex = /const\s+{\s*data:\s*adminData[\s\S]*?includes\(adminData\.role\)\)[\s\S]*?}/;
  if(adminUsersRegex.test(content)) {
      content = content.replace(adminUsersRegex, '');
      helpersToImport.add('requireAdmin');
  }

  // Pattern 2: custom verifyAdminUser function in products/route.ts
  const verifyAdminRegex = /async function verifyAdminUser\([\s\S]*?\}[\s\S]*?const adminCheck = await verifyAdminUser\(supabase\);\s*if\s*\(!adminCheck\.authorized\)\s*{\s*return NextResponse\.json\([\s\S]*?\);\s*}/;
  if (verifyAdminRegex.test(content)) {
      content = content.replace(verifyAdminRegex, '');
      helpersToImport.add('requireAdmin');
  }

  // General replacement block
  // Replace: const supabase = await createClient(); up to if (!user) ...
  const generalAuthRegex = /const\s+supabase\s*=\s*(?:await\s*)?(?:createClient\(\)|createServiceRoleClient\(\))[\s\S]*?if\s*\(!user(Error)?\)\s*{(?:[^}]*?\n)*?\s*}/g;
  
  // If we couldn't match a large block, try matching piece by piece
  
  // Very simplistic approach: Find the handler "export async function GET(..." 
  // Replace the inside.
  
  // Since AST is hard with regex, let's just do targeted replacements for the boilerplate:
  content = content.replace(/const\s+supabase\s*=\s*await\s*createClient\(\);?\s*/g, '');
  
  // Remove user fetching block
  content = content.replace(/const\s*{\s*data:\s*{\s*user\s*}\s*,\s*error[:,]?\s*(?:[a-zA-Z0-9_]*)\s*}\s*=\s*await\s*supabase\.auth\.getUser\(\);?/g, '');
  content = content.replace(/const\s*{\s*data:\s*{\s*user\s*}\s*}\s*=\s*await\s*supabase\.auth\.getUser\(\);?/g, '');
  
  // Remove if(!user) block
  content = content.replace(/if\s*\(!user\s*(?:\|\|\s*[a-zA-Z0-9_]+)?\)\s*{\s*return\s+(?:new\s+)?NextResponse(?:\.json)?\([\s\S]*?\)(?:;)?\s*}/g, '');
  content = content.replace(/if\s*\([a-zA-Z0-9_]+\s*\|\|\s*!user\)\s*{\s*return\s+(?:new\s+)?NextResponse(?:\.json)?\([\s\S]*?\)(?:;)?\s*}/g, '');
  
  // Remove adminData checks
  content = content.replace(/const\s+{\s*data:\s*adminData\s*}\s*=\s*await\s*supabase[\s\S]*?\.single\(\);?\s*/g, '');
  content = content.replace(/if\s*\(!adminData[\s\S]*?}\s*/g, '');

  // Add the new auth logic at the top of the handler
  content = content.replace(/(export\s+async\s+function\s+(?:GET|POST|PUT|DELETE|PATCH)\([^)]*\)\s*{\s*)(?:try\s*{)?\s*/g, (match, p1) => {
      // Re-add try if it was matched
      const hasTry = match.includes('try');
      const tryStr = hasTry ? 'try {\n    ' : '';
      return `${p1}${tryStr}const auth = await requireAdmin();\n    if (!auth.ok) return auth.response;\n    const { user, supabase } = auth;\n\n    `;
  });

  // Handle createServiceRoleClient calls
  if (content.includes('createServiceRoleClient')) {
      content = content.replace(/const\s+[a-zA-Z0-9_]+\s*=\s*createServiceRoleClient\(\);?/g, 'const adminClient = getServiceClient();');
      helpersToImport.add('getServiceClient');
  }

  // Ensure imports at the top
  helpersToImport.add('requireAdmin');
  
  let importStr = `import { ${Array.from(helpersToImport).join(', ')} } from '@/lib/auth/helpers';\n`;
  if (!content.includes('@/lib/auth/helpers')) {
      // Add after last import
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
          const endOfImport = content.indexOf('\n', lastImportIndex);
          content = content.slice(0, endOfImport + 1) + importStr + content.slice(endOfImport + 1);
      } else {
          content = importStr + content;
      }
  }

  // Cleanup potential leftover verifyAdminUser function
  content = content.replace(/async\s+function\s+verifyAdminUser[\s\S]*?return\s*{\s*authorized:\s*true[\s\S]*?}\s*}/g, '');

  if (originalContent !== content) {
    fs.writeFileSync(file, content);
    migrated++;
    console.log(`Migrated: ${file.replace(targetDir, '')}`);
  }
});

console.log(`Total migrated: ${migrated}`);
