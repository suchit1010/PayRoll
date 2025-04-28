const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envFilePath = path.join(process.cwd(), '.env.local');

// Check if .env.local exists
const envFileExists = fs.existsSync(envFilePath);
let existingEnvContent = '';

if (envFileExists) {
  existingEnvContent = fs.readFileSync(envFilePath, 'utf8');
  console.log('Found existing .env.local file');
} else {
  console.log('No .env.local file found, will create a new one');
}

console.log('\n=== MongoDB Configuration Setup ===\n');
console.log('This script will help you set up your MongoDB connection.');
console.log('Enter your MongoDB connection details below:\n');

rl.question('MongoDB URI (e.g. mongodb://localhost:27017 or mongodb+srv://...): ', (mongodbUri) => {
  if (!mongodbUri) {
    console.log('⚠️ MongoDB URI is required. Exiting setup.');
    rl.close();
    return;
  }

  rl.question('MongoDB Database Name (default: payroll_app): ', (mongodbDbName) => {
    const dbName = mongodbDbName || 'payroll_app';
    
    // Check if variables already exist in .env.local
    const hasMongoUri = existingEnvContent.includes('MONGODB_URI=');
    const hasMongoDbName = existingEnvContent.includes('MONGODB_DB_NAME=');
    
    let newEnvContent = existingEnvContent;
    
    // Add or update MongoDB URI
    if (hasMongoUri) {
      newEnvContent = newEnvContent.replace(
        /MONGODB_URI=.*/,
        `MONGODB_URI=${mongodbUri}`
      );
    } else {
      newEnvContent += `\n# MongoDB Configuration\nMONGODB_URI=${mongodbUri}\n`;
    }
    
    // Add or update MongoDB DB Name
    if (hasMongoDbName) {
      newEnvContent = newEnvContent.replace(
        /MONGODB_DB_NAME=.*/,
        `MONGODB_DB_NAME=${dbName}`
      );
    } else {
      newEnvContent += `MONGODB_DB_NAME=${dbName}\n`;
    }
    
    // Write to .env.local
    fs.writeFileSync(envFilePath, newEnvContent.trim() + '\n');
    
    console.log('\n✅ MongoDB configuration has been saved to .env.local');
    console.log('\nTo test your connection, run:');
    console.log('  node scripts/check-mongodb.js');
    
    rl.close();
  });
}); 