import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function middleware(request: NextRequest) {
  // Get API key from header
  const apiKey = request.headers.get('x-api-key');
  
  // Skip authentication for certain endpoints or in development
  const isDev = process.env.NODE_ENV === 'development';
  const isPublicEndpoint = request.nextUrl.pathname === '/api' || 
                           request.nextUrl.pathname === '/api/mongodb-status';
  
  if (!isDev && !isPublicEndpoint && !apiKey) {
    return NextResponse.json(
      { error: 'API Key is required' },
      { status: 401 }
    );
  }
  
  // Skip validation in dev mode or for public endpoints
  if (!isDev && !isPublicEndpoint) {
    // Validate API key (you would implement your own validation logic)
    const isValidApiKey = await validateApiKey(apiKey);
    
    if (!isValidApiKey) {
      return NextResponse.json(
        { error: 'Invalid API Key' },
        { status: 401 }
      );
    }
  }
  
  // Log the API request
  try {
    await logApiRequest(request);
  } catch (error) {
    console.error('Failed to log API request:', error);
    // Continue processing the request even if logging fails
  }
  
  // Continue processing the request
  return NextResponse.next();
}

// Limit middleware to API routes
export const config = {
  matcher: '/api/:path*',
};

// Helper function to validate API key
async function validateApiKey(apiKey: string | null): Promise<boolean> {
  if (!apiKey) return false;
  
  try {
    const collection = await getCollection('api_keys');
    const keyExists = await collection.findOne({ key: apiKey, active: true });
    
    return !!keyExists;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}

// Helper function to log API requests
async function logApiRequest(request: NextRequest): Promise<void> {
  try {
    const collection = await getCollection('api_logs');
    
    await collection.insertOne({
      method: request.method,
      path: request.nextUrl.pathname,
      query: Object.fromEntries(request.nextUrl.searchParams),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error logging API request:', error);
  }
} 