const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
  console.log("Missing Supabase credentials");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log("Checking if category exists...");
  const { data: existing } = await supabase.from('categories').select('*').eq('slug', 'linea-kits-experiencia');
  
  if (existing && existing.length > 0) {
    console.log("Category already exists!", existing);
    if (!existing[0].is_active) {
       await supabase.from('categories').update({ is_active: true }).eq('slug', 'linea-kits-experiencia');
       console.log("Updated to active.");
    }
  } else {
    console.log("Creating category 'Línea Kits y Experiencias'...");
    const { data, error } = await supabase.from('categories').insert({
      name: 'Kits y Experiencia',
      slug: 'linea-kits-experiencia',
      description: 'Nuestra colección especial de Kits y Experiencias.',
      is_active: true
    }).select();
    if (error) {
       console.error("Error creating category:", error);
    } else {
       console.log("Success created category:", data);
    }
  }
}
run();
