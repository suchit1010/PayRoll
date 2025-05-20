import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { EmployeeService } from '@/lib/dual-database-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'default';
    const period = searchParams.get('period') || '30d';
    
    let analytics = [];
    
    switch (type) {
      case 'payroll':
        // Get payroll analytics from MongoDB
        const payrollCollection = await getCollection('payroll_transactions');
        analytics = await payrollCollection.aggregate([
          {
            $match: {
              created_at: { 
                $gte: new Date(Date.now() - getPeriodInMs(period)) 
              }
            }
          },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } },
              totalAmount: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]).toArray();
        break;
        
      case 'employees':
        // Get employee analytics from MongoDB
        const employeeActivities = await getCollection('employee_activities');
        analytics = await employeeActivities.aggregate([
          {
            $match: {
              timestamp: { 
                $gte: new Date(Date.now() - getPeriodInMs(period)) 
              }
            }
          },
          {
            $group: {
              _id: '$action',
              count: { $sum: 1 }
            }
          }
        ]).toArray();
        break;
        
      case 'vault':
        // Get vault analytics from MongoDB
        const vaultCollection = await getCollection('vault_analytics');
        analytics = await vaultCollection.aggregate([
          {
            $match: {
              timestamp: { 
                $gte: new Date(Date.now() - getPeriodInMs(period)) 
              }
            }
          },
          {
            $group: {
              _id: '$type',
              totalAmount: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          }
        ]).toArray();
        break;
        
      default:
        // Get general analytics from MongoDB
        analytics = await EmployeeService.getAnalytics({
          timestamp: { $gte: new Date(Date.now() - getPeriodInMs(period)) }
        });
    }
    
    return NextResponse.json({ analytics });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.event) {
      return NextResponse.json(
        { error: 'Event name is required' },
        { status: 400 }
      );
    }
    
    // Store analytics event in MongoDB
    await EmployeeService.storeAnalyticsData({
      ...body,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error storing analytics event:', error);
    return NextResponse.json(
      { error: 'Failed to store analytics event', message: error.message },
      { status: 500 }
    );
  }
}

// Helper function to convert period string to milliseconds
function getPeriodInMs(period: string): number {
  const value = parseInt(period);
  const unit = period.slice(-1);
  
  switch (unit) {
    case 'd': return value * 24 * 60 * 60 * 1000;
    case 'w': return value * 7 * 24 * 60 * 60 * 1000;
    case 'm': return value * 30 * 24 * 60 * 60 * 1000;
    case 'y': return value * 365 * 24 * 60 * 60 * 1000;
    default: return 30 * 24 * 60 * 60 * 1000; // Default to 30 days
  }
} 