/**
 * This script migrates data from Supabase to MongoDB
 * 
 * To run:
 * 1. Make sure both Supabase and MongoDB credentials are in .env.local
 * 2. Run: node scripts/migrate-to-mongodb.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { MongoClient } = require('mongodb');

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// MongoDB setup
const mongoUri = process.env.MONGODB_URI;
const dbName = 'payroll';

async function migrateData() {
  console.log('Starting migration from Supabase to MongoDB...');
  
  // Connect to MongoDB
  const client = new MongoClient(mongoUri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    
    // Migrate employees
    console.log('Migrating employees...');
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .select('*');
      
    if (employeesError) {
      throw employeesError;
    }
    
    if (employees && employees.length > 0) {
      const employeesCollection = db.collection('employees');
      const result = await employeesCollection.insertMany(employees);
      console.log(`Migrated ${result.insertedCount} employees`);
    } else {
      console.log('No employees to migrate');
    }
    
    // Migrate payroll transactions
    console.log('Migrating payroll transactions...');
    const { data: payroll, error: payrollError } = await supabase
      .from('payroll_transactions')
      .select('*');
      
    if (payrollError) {
      throw payrollError;
    }
    
    if (payroll && payroll.length > 0) {
      const payrollCollection = db.collection('payrolltransactions');
      const result = await payrollCollection.insertMany(payroll);
      console.log(`Migrated ${result.insertedCount} payroll transactions`);
    } else {
      console.log('No payroll transactions to migrate');
    }
    
    // Migrate vault transactions
    console.log('Migrating vault transactions...');
    const { data: vault, error: vaultError } = await supabase
      .from('vault_transactions')
      .select('*');
      
    if (vaultError) {
      throw vaultError;
    }
    
    if (vault && vault.length > 0) {
      const vaultCollection = db.collection('vaulttransactions');
      const result = await vaultCollection.insertMany(vault);
      console.log(`Migrated ${result.insertedCount} vault transactions`);
    } else {
      console.log('No vault transactions to migrate');
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

migrateData(); 