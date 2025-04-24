/**
 * MongoDB Basic Usage Examples
 * 
 * This file demonstrates common MongoDB operations for your payroll application.
 */

const { MongoClient, ObjectId } = require('mongodb');

// Connection URL and Database Name
const url = 'mongodb://localhost:27017';
const dbName = 'payroll';

// Connect to MongoDB
async function main() {
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(url);
  
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    
    const db = client.db(dbName);
    
    // EXAMPLE 1: Insert a document
    console.log('\n--- Example 1: Insert a document ---');
    const employee = {
      company_id: 'comp_123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      position: 'Software Developer',
      department: 'Engineering',
      salary: 85000,
      status: 'active',
      created_at: new Date()
    };
    
    const result = await db.collection('employees').insertOne(employee);
    console.log(`Inserted employee with ID: ${result.insertedId}`);
    
    // EXAMPLE 2: Find documents
    console.log('\n--- Example 2: Find documents ---');
    const employees = await db.collection('employees')
      .find({ department: 'Engineering' })
      .sort({ created_at: -1 })
      .limit(5)
      .toArray();
      
    console.log(`Found ${employees.length} engineering employees:`);
    employees.forEach(emp => {
      console.log(`- ${emp.name} (${emp.position})`);
    });
    
    // EXAMPLE 3: Update a document
    console.log('\n--- Example 3: Update a document ---');
    const updateResult = await db.collection('employees').updateOne(
      { _id: result.insertedId },
      { $set: { salary: 90000 } }
    );
    
    console.log(`Updated ${updateResult.modifiedCount} employee(s)`);
    
    // EXAMPLE 4: Aggregate data
    console.log('\n--- Example 4: Aggregate data ---');
    const aggregation = await db.collection('employees').aggregate([
      { $group: { _id: '$department', totalSalary: { $sum: '$salary' }, count: { $sum: 1 } } },
      { $sort: { totalSalary: -1 } }
    ]).toArray();
    
    console.log('Department salary breakdown:');
    aggregation.forEach(dept => {
      console.log(`- ${dept._id}: $${dept.totalSalary.toLocaleString()} (${dept.count} employees)`);
    });
    
    // EXAMPLE 5: Delete the test document
    console.log('\n--- Example 5: Delete a document ---');
    const deleteResult = await db.collection('employees').deleteOne({ _id: result.insertedId });
    console.log(`Deleted ${deleteResult.deletedCount} employee(s)`);
    
    console.log('\nAll examples completed successfully!');
  } catch (err) {
    console.error('Error occurred during MongoDB operations:', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the examples
main().catch(console.error); 