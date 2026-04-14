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
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('createClient')) return;

  const lines = content.split('\n');
  const newLines = [];
  
  let state = 'NORMAL';
  let hasRequireAdmin = false;
  let requireAdminImported = false;
  let getServiceClientImported = false;
  let importsUpdated = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle imports
    if (line.includes('import') && line.includes('@supabase/supabase-js') && line.includes('createClient')) {
        // Drop createClient import
        continue;
    }
    if (line.includes('import') && line.includes('@/utils/supabase/server') && line.includes('createClient')) {
        // Drop createClient import
        continue;
    }
    if (line.includes('import { requireAuth') || line.includes('requireAdmin')) {
        requireAdminImported = true;
    }
    if (line.includes('getServiceClient')) {
        getServiceClientImported = true;
    }

    // STATE MACHINE TRANSITIONS
    if (state === 'NORMAL') {
        const isAuthStart = line.includes('const supabase = await createClient()') || line.includes('const supabase = createClient(');
        if (isAuthStart) {
            state = 'IN_AUTH_BLOCK';
            newLines.push('    const auth = await requireAdmin();');
            newLines.push('    if (!auth.ok) return auth.response;');
            newLines.push('    const { user, supabase } = auth;');
            continue;
        }

        // Special verifyAdminUser block
        if (line.includes('async function verifyAdminUser')) {
            state = 'SKIP_VERIFY_FN';
            continue;
        }
        if (line.includes('const adminCheck = await verifyAdminUser')) {
            state = 'SKIP_ADMIN_CHECK';
            newLines.push('    const auth = await requireAdmin();');
            newLines.push('    if (!auth.ok) return auth.response;');
            newLines.push('    const { user, supabase } = auth;');
            continue;
        }

        // service role client mapping
        if (line.includes('createServiceRoleClient()')) {
            newLines.push(line.replace('createServiceRoleClient()', 'getServiceClient()'));
            continue;
        }

        newLines.push(line);
    } 
    else if (state === 'IN_AUTH_BLOCK') {
        // Skip user checks
        if (line.includes('await supabase.auth.getUser()')) continue;
        if (line.trim() === 'const {' || line.trim() === 'data: { user },' || line.trim() === '} = await supabase.auth.getUser();') continue;
        if (line.trim() === 'error: userError') continue;

        // Skip admin_users check
        if (line.includes('from("admin_users")')) {
            state = 'SKIP_ADMIN_USERS';
            continue; 
        }

        // Detect end of basic auth block: Usually returns an error response
        if (line.includes('return NextResponse.json') && line.includes('401') || line.includes('403') || line.includes('Unauthorized')) {
            // Usually preceded by an if statement, we'll strip the whole block below by scanning for closing brackets
            continue;
        }
        
        if (line.includes('return') && line.includes('new NextResponse')) continue;
        if (line.trim() === 'if (!user) {' || line.trim() === 'if (userError || !user) {') continue;
        if (line.trim() === 'if (!user || userError) {') continue;
        if (line.trim() === '}') continue; // end of if

        // If we hit a line that isn't auth related, switch back to NORMAL
        if (line.trim() !== '' && !line.includes('const {') && !line.includes('data:')) {
            state = 'NORMAL';
            newLines.push(line);
        }
    }
    else if (state === 'SKIP_VERIFY_FN') {
        // wait until finding closing bracket at col 0
        if (line === '}') {
            state = 'NORMAL';
        }
    }
    else if (state === 'SKIP_ADMIN_CHECK') {
        if (line.includes('}')) {
            state = 'NORMAL';
        }
    }
    else if (state === 'SKIP_ADMIN_USERS') {
        // Skip till the end of the admin_users forbidden check
        if (line.includes('return NextResponse') && line.includes('Forbidden')) {
            continue;
        }
        if (line.includes('}')) {
            state = 'NORMAL';
        }
    }
  }

  // Prepend imports
  const finalContent = newLines.join('\n');
  if (finalContent !== content && !finalContent.includes('createClient(')) {
      let finalFileContent = finalContent;
      // Add imports nicely
      let helpers = [];
      if (!requireAdminImported) helpers.push('requireAdmin');
      if (finalContent.includes('getServiceClient') && !getServiceClientImported) helpers.push('getServiceClient');
      
      if (helpers.length > 0) {
          const importStr = `import { ${helpers.join(', ')} } from '@/lib/auth/helpers';\n`;
          const lastImportIdx = finalFileContent.lastIndexOf('import ');
          if (lastImportIdx !== -1) {
              const endIdx = finalFileContent.indexOf('\n', lastImportIdx) + 1;
              finalFileContent = finalFileContent.slice(0, endIdx) + importStr + finalFileContent.slice(endIdx);
          } else {
              finalFileContent = importStr + finalFileContent;
          }
      }
      fs.writeFileSync(file, finalFileContent);
      migrated++;
      console.log(`Migrated: ${file.replace(targetDir, '')}`);
  }
});

console.log(`Total state machine migrated: ${migrated}`);
