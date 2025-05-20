import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const startTime = Date.now();
    const { client } = await connectToDatabase();
    
    // Run a simple command to verify connection is working
    await client!.db().command({ ping: 1 });
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'connected',
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('MongoDB connection error:', error);
    
    return NextResponse.json(
      {
        status: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 