const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/app/api/admin/system/seo/config/route.ts',
  'src/app/api/admin/system/shipping/carriers/route.ts',
  'src/app/api/admin/system/shipping/rates/[id]/route.ts',
  'src/app/api/admin/system/shipping/zones/[id]/route.ts'
];

filesToFix.forEach(relPath => {
  const filePath = path.join(__dirname, '..', relPath);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add import if missing
  if (!content.includes('requireAdmin')) {
    content = content.replace(/(import .*;\n)/, "$1import { requireAdmin } from '@/lib/auth/helpers';\n");
  }
  
  // Strip createClient import
  content = content.replace(/import { createClient } from '@\/utils\/supabase\/server';\n/, '');

  // Custom regex block replacements to replace the whole sequence.
  
  // 1. system/seo/config/route.ts GET
  content = content.replace(
      /const supabase = await createClient\(\);\s*const { data: configs, error } = await supabase/g,
      "const auth = await requireAdmin();\n    if (!auth.ok) return auth.response;\n    const { user, supabase } = auth;\n    const { data: configs, error } = await supabase"
  );
  
  // 1b. system/seo/config/route.ts PUT
  content = content.replace(
      /const supabase = await createClient\(\);\s*const { data: { user }, error: userError } = await supabase\.auth\.getUser\(\);\s*if \(userError \|\| !user\) {[\s\S]*?}/g,
      "const auth = await requireAdmin();\n    if (!auth.ok) return auth.response;\n    const { user, supabase } = auth;"
  );

  // 2. carriers GET
  content = content.replace(
      /const supabase = await createClient\(\);\s*const { data: carriers, error } = await supabase/g,
      "const auth = await requireAdmin();\n    if (!auth.ok) return auth.response;\n    const { user, supabase } = auth;\n    const { data: carriers, error } = await supabase"
  );

  // 2b. carriers POST, PUT, DELETE
  content = content.replace(
      /const supabase = await createClient\(\);\s*const { data: { user }, error: userError } = await supabase\.auth\.getUser\(\);\s*if \(userError \|\| !user\) {[\s\S]*?}/g,
      "const auth = await requireAdmin();\n    if (!auth.ok) return auth.response;\n    const { user, supabase } = auth;"
  );

  // 3. rates GET
  content = content.replace(
      /const supabase = await createClient\(\);\s*const { data: rate, error } = await supabase/g,
      "const auth = await requireAdmin();\n    if (!auth.ok) return auth.response;\n    const { user, supabase } = auth;\n    const { data: rate, error } = await supabase"
  );

  // 3b. rates PUT, DELETE
  // Since PUT and DELETE also check user manually using getUser()
  content = content.replace(
      /const supabase = await createClient\(\);\s*const { data: { user }, error: userError } = await supabase\.auth\.getUser\(\);\s*if \(userError \|\| !user\) {[\s\S]*?}/g,
      "const auth = await requireAdmin();\n    if (!auth.ok) return auth.response;\n    const { user, supabase } = auth;"
  );

  // 4. zones GET
  content = content.replace(
      /const supabase = await createClient\(\);\s*const { data: zone, error } = await supabase/g,
      "const auth = await requireAdmin();\n    if (!auth.ok) return auth.response;\n    const { user, supabase } = auth;\n    const { data: zone, error } = await supabase"
  );

  // 4b. zones PUT, DELETE
  content = content.replace(
      /const supabase = await createClient\(\);\s*\/\/ Check admin authorization\s*const { data: { user }, error: userError } = await supabase\.auth\.getUser\(\);\s*if \(userError \|\| !user\) {[\s\S]*?}/g,
      "const auth = await requireAdmin();\n    if (!auth.ok) return auth.response;\n    const { user, supabase } = auth;\n    // Check admin authorization"
  );


  fs.writeFileSync(filePath, content);
  console.log('Fixed ' + relPath);
});
