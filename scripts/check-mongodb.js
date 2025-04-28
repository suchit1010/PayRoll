// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Run basic MongoDB connection test
console.log('Checking MongoDB connection...');
console.log(`MONGODB_URI: ${maskConnectionString(process.env.MONGODB_URI || 'Not set')}`);
console.log(`MONGODB_DB_NAME: ${process.env.MONGODB_DB_NAME || 'Not set'}`);
console.log('\n');

// Import MongoDB connection module
const { MongoClient } = require('mongodb');

async function checkConnection() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set.');
    console.log('Please set it in your .env.local file.');
    return;
  }

  if (!process.env.MONGODB_DB_NAME) {
    console.warn('⚠️ MONGODB_DB_NAME environment variable is not set.');
    console.log('Using default database name from connection string.');
  }

  let client;
  try {
    console.log('Attempting to connect to MongoDB...');
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    // Get database
    const dbName = process.env.MONGODB_DB_NAME || 'payroll_app';
    const db = client.db(dbName);
    
    // Simple ping command to check connection
    await db.command({ ping: 1 });
    console.log('✅ Connection successful!');
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`\nDatabase: ${dbName}`);
    console.log('Collections:');
    if (collections.length === 0) {
      console.log('  No collections found (empty database)');
    } else {
      collections.forEach(collection => {
        console.log(`  - ${collection.name}`);
      });
    }

    console.log('\n✨ Your MongoDB connection is working properly!');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:');
    console.error(error);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check that your connection string is correct');
    console.log('2. Ensure your network allows connections to MongoDB');
    console.log('3. Verify your MongoDB user credentials');
    console.log('4. Make sure your IP address is in the MongoDB Atlas access list (if using Atlas)');
  } finally {
    if (client) {
      await client.close();
      console.log('Connection closed.');
    }
  }
}

// Mask the connection string for security
function maskConnectionString(uri) {
  if (!uri || uri === 'Not set') return uri;
  
  try {
    // For MongoDB Atlas URIs
    if (uri.includes('@')) {
      return uri.replace(/:([^@]*)@/, ':********@');
    }
    // For local connections or other formats
    return uri.split('//')[0] + '//' + uri.split('//')[1].split(':')[0] + ':******';
  } catch (e) {
    return 'Invalid URI format';
  }
}

// Run the check
checkConnection().catch(console.error); 