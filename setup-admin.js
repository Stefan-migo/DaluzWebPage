#!/usr/bin/env node

/**
 * Admin Setup Script for DA LUZ CONSCIENTE
 * 
 * This script sets up admin access for daluzalkimya@gmail.com
 * and ensures the admin system is properly configured.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  console.log('🚀 Setting up admin access for DA LUZ CONSCIENTE...\n');

  try {
    // Check if admin_users table exists
    console.log('📋 Checking admin system setup...');
    const { data: tableExists, error: tableError } = await supabase
      .from('admin_users')
      .select('id')
      .limit(1);

    if (tableError && tableError.code === '42P01') {
      console.log('⚠️  Admin tables not found. Please run the migration first:');
      console.log('   npx supabase migration up');
      process.exit(1);
    }

    // Check if user exists in auth.users
    console.log('👤 Checking if daluzalkimya@gmail.com exists...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error accessing auth users:', authError.message);
      process.exit(1);
    }

    const adminUser = authUsers.users.find(user => user.email === 'daluzalkimya@gmail.com');
    
    if (!adminUser) {
      console.log('⚠️  User daluzalkimya@gmail.com not found in auth.users');
      console.log('   The user needs to sign up first, then run this script again.');
      console.log('   Or you can create the user manually in the Supabase dashboard.');
      process.exit(1);
    }

    console.log('✅ User found:', adminUser.email);

    // Check if user is already in admin_users
    console.log('🔐 Checking admin status...');
    const { data: existingAdmin, error: adminCheckError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', adminUser.id)
      .single();

    if (adminCheckError && adminCheckError.code !== 'PGRST116') {
      console.error('❌ Error checking admin status:', adminCheckError.message);
      process.exit(1);
    }

    if (existingAdmin) {
      console.log('✅ User is already an admin with role:', existingAdmin.role);
      
      // Update to ensure super_admin role
      if (existingAdmin.role !== 'super_admin') {
        console.log('🔄 Updating to super_admin role...');
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({
            role: 'super_admin',
            permissions: {
              orders: ["read", "create", "update", "delete"],
              products: ["read", "create", "update", "delete"],
              customers: ["read", "create", "update", "delete"],
              analytics: ["read"],
              settings: ["read", "create", "update", "delete"],
              admin_users: ["read", "create", "update", "delete"]
            },
            is_active: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', adminUser.id);

        if (updateError) {
          console.error('❌ Error updating admin role:', updateError.message);
          process.exit(1);
        }
        console.log('✅ Updated to super_admin role');
      }
    } else {
      // Create admin user entry
      console.log('➕ Creating admin user entry...');
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          id: adminUser.id,
          email: adminUser.email,
          role: 'super_admin',
          permissions: {
            orders: ["read", "create", "update", "delete"],
            products: ["read", "create", "update", "delete"],
            customers: ["read", "create", "update", "delete"],
            analytics: ["read"],
            settings: ["read", "create", "update", "delete"],
            admin_users: ["read", "create", "update", "delete"]
          },
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('❌ Error creating admin user:', insertError.message);
        process.exit(1);
      }
      console.log('✅ Admin user created successfully');
    }

    // Update profile membership_tier
    console.log('👤 Updating profile membership tier...');
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: adminUser.id,
        membership_tier: 'admin',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.log('⚠️  Warning: Could not update profile:', profileError.message);
      console.log('   This is not critical for admin functionality.');
    } else {
      console.log('✅ Profile updated successfully');
    }

    // Test admin functions
    console.log('🧪 Testing admin functions...');
    
    const { data: isAdminResult, error: isAdminError } = await supabase
      .rpc('is_admin', { user_id: adminUser.id });

    if (isAdminError) {
      console.error('❌ Error testing is_admin function:', isAdminError.message);
    } else if (isAdminResult) {
      console.log('✅ Admin function test passed');
    } else {
      console.log('❌ Admin function test failed - user not recognized as admin');
    }

    const { data: roleResult, error: roleError } = await supabase
      .rpc('get_admin_role', { user_id: adminUser.id });

    if (roleError) {
      console.error('❌ Error testing get_admin_role function:', roleError.message);
    } else {
      console.log('✅ Admin role function test passed. Role:', roleResult);
    }

    console.log('\n🎉 Admin setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • Email: ${adminUser.email}`);
    console.log(`   • Role: super_admin`);
    console.log(`   • Status: Active`);
    console.log(`   • Admin Dashboard: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin`);
    
    console.log('\n✨ daluzalkimya@gmail.com now has full admin access to the DA LUZ CONSCIENTE admin dashboard!');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupAdmin();
