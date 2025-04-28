import { NextRequest, NextResponse } from 'next/server';
import { EmployeeService } from '@/lib/dual-database-service';
import { getCollection } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const event = searchParams.get('event');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Build MongoDB query
    const query: any = {};
    
    if (event) {
      query.event = event;
    }
    
    if (startDate || endDate) {
      query.timestamp = {};
      
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }
    
    // Fetch analytics data from MongoDB
    const analyticsData = await EmployeeService.getAnalytics(query);
    
    // Perform aggregation directly with MongoDB
    const collection = await getCollection('analytics');
    
    // Example: Count events by department
    const departmentStats = await collection.aggregate([
      { $match: query },
      { $group: {
          _id: "$department",
          count: { $sum: 1 },
          totalSalary: { $sum: "$salary" }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();
    
    return NextResponse.json({
      data: analyticsData,
      departmentStats
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
} 