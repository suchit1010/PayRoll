/**
 * This script tests the MongoDB connection directly without using dotenv
 */

const { MongoClient } = require('mongodb');

// Use the connection string directly
const mongoUri = "mongodb://localhost:27017/payroll";
console.log('Using MongoDB URI:', mongoUri);

async function testConnection() {
  console.log('Testing MongoDB connection...');
  
  // Create client with longer timeout and direct connection string
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
    console.log('5. Try MongoDB Atlas connection string:');
    console.log('   mongodb+srv://username:password@cluster.mongodb.net/payroll?retryWrites=true&w=majority');
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