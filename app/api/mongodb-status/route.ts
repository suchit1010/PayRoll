import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Checking MongoDB connection status...');
    const { client, db } = await connectToDatabase();
    
    if (!client || !db) {
      return NextResponse.json(
        { status: 'error', message: 'Failed to connect to MongoDB' },
        { status: 500 }
      );
    }
    
    // Test connection with a ping
    await db.command({ ping: 1 });
    
    // Get collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    return NextResponse.json({
      status: 'success',
      message: 'MongoDB connected successfully',
      database: db.databaseName,
      collections: collectionNames
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'MongoDB connection failed',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 