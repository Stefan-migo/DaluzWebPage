// Debug script to check checkout API environment
console.log('🔍 Checkout Environment Debug');
console.log('================================');

console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
console.log('MERCADOPAGO_ACCESS_TOKEN:', process.env.MERCADOPAGO_ACCESS_TOKEN ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY:', process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);

// Test Supabase connection
async function testSupabase() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    const { data, error } = await supabase.from('orders').select('count').limit(1);
    console.log('Supabase connection:', error ? '❌ Failed' : '✅ Working');
    if (error) console.log('Supabase error:', error.message);
  } catch (err) {
    console.log('Supabase test failed:', err.message);
  }
}

testSupabase();
