const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('Inserting with ANON key...');
  const { data, error } = await supabase.from('categories').insert({
    name: 'Kits y Experiencia',
    slug: 'linea-kits-experiencia',
    description: 'Nuestra colección especial de Kits y Experiencias.',
    is_active: true
  }).select();
  console.log(error ? 'Error: ' + JSON.stringify(error) : 'Success: ' + JSON.stringify(data));
}
run();
