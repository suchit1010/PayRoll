/*
  This script helps create a proper .env.local file for your project
  Run it with: node setup-env.js
*/

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Setting up your environment variables...');
console.log('This will create or update your .env.local file\n');

// Function to ask questions and get user input
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

async function setup() {
  console.log('If you don\'t have a Supabase project yet, visit https://supabase.com/ to create one.');
  console.log('You can find your Supabase URL and anon key in your project dashboard > Settings > API\n');
  
  // Check if .env.local exists already
  const envPath = path.join(__dirname, '.env.local');
  let currentEnv = {};
  
  if (fs.existsSync(envPath)) {
    console.log('Found existing .env.local file.');
    const content = fs.readFileSync(envPath, 'utf8');
    
    // Parse existing env variables
    content.split('\n').forEach(line => {
      if (line && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key && value) {
          currentEnv[key.trim()] = value.trim();
        }
      }
    });
  }
  
  // Ask for Supabase URL
  const supabaseUrl = await askQuestion(`Supabase URL ${currentEnv.NEXT_PUBLIC_SUPABASE_URL ? `(current: ${currentEnv.NEXT_PUBLIC_SUPABASE_URL})` : ''}: `);
  if (supabaseUrl) {
    currentEnv.NEXT_PUBLIC_SUPABASE_URL = supabaseUrl;
  }
  
  // Ask for Supabase anon key
  const supabaseAnonKey = await askQuestion(`Supabase anon key ${currentEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '(current: ******)' : ''}: `);
  if (supabaseAnonKey) {
    currentEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY = supabaseAnonKey;
  }
  
  // Create or update .env.local
  let envContent = '';
  Object.entries(currentEnv).forEach(([key, value]) => {
    envContent += `${key}=${value}\n`;
  });
  
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Environment variables successfully saved to .env.local');
  console.log('You can now start your application with: npm run dev');
  
  rl.close();
}

setup().catch(error => {
  console.error('Error setting up environment variables:', error);
  rl.close();
}); 