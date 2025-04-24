/**
 * This script tests the MongoDB connection
 * 
 * To run:
 * 1. Make sure MongoDB is running locally or update .env.local with your Atlas connection string
 * 2. Run: node scripts/test-mongodb-connection.js
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI environment variable is not set in .env.local');
  process.exit(1);
}

console.log('MongoDB URI:', mongoUri);

async function testConnection() {
  console.log('Testing MongoDB connection...');
  
  const client = new MongoClient(mongoUri, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
  });
  
  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('Successfully connected to MongoDB!');
    
    // Basic operations to verify connection
    console.log('Checking connection with basic operations...');
    const db = client.db('admin');
    const ping = await db.command({ ping: 1 });
    console.log('MongoDB responded with:', ping);
    
    // List all databases
    const dbList = await client.db().admin().listDatabases();
    console.log('Available databases:');
    dbList.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
    
    // Check for the payroll database
    const dbExists = dbList.databases.some(db => db.name === 'payroll');
    if (dbExists) {
      console.log('\nPayroll database exists');
      
      // Connect to the payroll DB and check for collections
      const db = client.db('payroll');
      const collections = await db.listCollections().toArray();
      
      console.log('Collections in payroll database:');
      if (collections.length === 0) {
        console.log('No collections found. This is expected for a new database.');
      } else {
        collections.forEach(collection => {
          console.log(`- ${collection.name}`);
        });
      }
      
      // Create test collection and document if it doesn't exist
      if (!collections.some(c => c.name === 'test')) {
        console.log('\nCreating test collection and document...');
        const testCollection = db.collection('test');
        const result = await testCollection.insertOne({ 
          test: true, 
          message: 'MongoDB connection successful!',
          timestamp: new Date()
        });
        console.log(`Test document created with ID: ${result.insertedId}`);
      }
    } else {
      console.log('\nPayroll database does not exist yet. It will be created when you first use it.');
    }
    
    console.log('\nConnection test completed successfully!');
  } catch (error) {
    console.error('MongoDB connection failed with error:');
    console.error(error);
    
    // Provide troubleshooting tips
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. For local connections, check if MongoDB service is active:');
    console.log('   - On Windows: Check Services app for MongoDB service');
    console.log('   - On Linux/Mac: Run "sudo systemctl status mongodb" or "brew services list"');
    console.log('3. Check your connection string format');
    console.log('4. For Atlas connections, verify network access settings and whitelisted IPs');
    console.log('5. Try connecting with MongoDB Compass to verify credentials');
  } finally {
    try {
      await client.close();
      console.log('MongoDB connection closed');
    } catch (e) {
      // Ignore close errors
    }
  }
}

// Run with immediate error catching
(async () => {
  try {
    await testConnection();
  } catch (e) {
    console.error('Unexpected error in test script:', e);
  }
})(); 