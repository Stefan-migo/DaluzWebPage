const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log("Checking if category exists...");
  const { data: existing } = await supabase.from('categories').select('*').eq('slug', 'linea-utopica');
  
  if (existing && existing.length > 0) {
    console.log("Category already exists!", existing);
    
    // Make sure it's active
    if (!existing[0].is_active) {
       await supabase.from('categories').update({ is_active: true }).eq('slug', 'linea-utopica');
       console.log("Updated to active.");
    }
  } else {
    console.log("Creating category...");
    const { data, error } = await supabase.from('categories').insert({
      name: 'Línea Utópica',
      slug: 'linea-utopica',
      description: 'Línea de maquillaje consciente y ceremonial.',
      is_active: true
    });
    console.log(error ? `Error: ${JSON.stringify(error)}` : 'Success created category');
  }
}
run();
