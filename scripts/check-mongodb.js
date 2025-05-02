// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Run basic MongoDB connection test
console.log('Checking MongoDB connection...');
console.log(`MONGODB_URI: ${maskConnectionString(process.env.MONGODB_URI || 'Not set')}`);
console.log(`MONGODB_DB_NAME: ${process.env.MONGODB_DB_NAME || 'Not set'}`);
console.log('\n');

// Import MongoDB connection module
const { MongoClient } = require('mongodb');

async function checkMongoDBConnection() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!uri) {
    console.error('❌ MONGODB_URI is not set in .env.local');
    return;
  }

  if (!dbName) {
    console.error('❌ MONGODB_DB_NAME is not set in .env.local');
    return;
  }

  console.log('🔍 Checking MongoDB connection...');
  console.log(`URI: ${uri}`);
  console.log(`Database: ${dbName}`);

  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');

    // Check if database exists
    const databases = await client.db().admin().listDatabases();
    const dbExists = databases.databases.some(db => db.name === dbName);
    
    if (dbExists) {
      console.log(`✅ Database "${dbName}" exists`);
    } else {
      console.log(`⚠️ Database "${dbName}" does not exist`);
    }

    // Get server info
    const serverInfo = await client.db().admin().serverStatus();
    console.log('\n📊 Server Information:');
    console.log(`- Version: ${serverInfo.version}`);
    console.log(`- Host: ${serverInfo.host}`);
    console.log(`- Process: ${serverInfo.process}`);

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await client.close();
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
checkMongoDBConnection().catch(console.error); 