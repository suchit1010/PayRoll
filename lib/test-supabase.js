// This file is for testing the Supabase connection
// Run it with: node lib/test-supabase.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure you have .env.local file with:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key');
  process.exit(1);
}

// Create Supabase client
console.log('Creating Supabase client with:');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey.substring(0, 5) + '...');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
async function testConnection() {
  try {
    // Test a simple query
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('employees').select('count(*)', { count: 'exact' });
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return;
    }
    
    console.log('Connection successful!');
    console.log('Result:', data);
    
    // Try to create a test employee
    const testEmployee = {
      company_id: '1',
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      position: 'Tester',
      department: 'QA',
      salary: 70000,
      status: 'active'
    };
    
    console.log('Adding test employee:', testEmployee);
    
    const { data: insertData, error: insertError } = await supabase
      .from('employees')
      .insert([testEmployee])
      .select()
      .single();
    
    if (insertError) {
      console.error('Error inserting test employee:', insertError);
      return;
    }
    
    console.log('Test employee added successfully!');
    console.log('Inserted data:', insertData);
    
    // List all employees
    const { data: allEmployees, error: listError } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (listError) {
      console.error('Error listing employees:', listError);
      return;
    }
    
    console.log('All employees:', allEmployees);
    
  } catch (err) {
    console.error('Unhandled error:', err);
  }
}

testConnection(); 