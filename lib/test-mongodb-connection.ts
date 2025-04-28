import { connectToDatabase } from './mongodb';

async function testConnection() {
  console.log('Testing MongoDB connection...');
  
  try {
    const { client, db } = await connectToDatabase();
    
    if (client && db) {
      console.log('✅ Successfully connected to MongoDB!');
      console.log(`Database name: ${db.databaseName}`);
      
      // List all collections
      const collections = await db.listCollections().toArray();
      console.log('Available collections:');
      if (collections.length === 0) {
        console.log('  No collections found (empty database)');
      } else {
        collections.forEach(collection => {
          console.log(`  - ${collection.name}`);
        });
      }
      
      // Close the connection
      await client.close();
      console.log('Connection closed.');
    } else {
      console.log('❌ Failed to connect to MongoDB. Client or DB is null.');
    }
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:');
    console.error(error);
  }
}

// Run the test
testConnection(); 