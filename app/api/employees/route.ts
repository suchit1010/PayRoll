import { NextRequest, NextResponse } from 'next/server';
import { EmployeeService } from '@/lib/dual-database-service';

export async function GET() {
  try {
    // Get employees from Supabase
    const employees = await EmployeeService.getEmployees();
    return NextResponse.json({ employees });
  } catch (error) {
    console.error('Failed to fetch employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const employeeData = await request.json();
    
    // Create employee in Supabase and log to MongoDB
    const newEmployee = await EmployeeService.createEmployee(employeeData);
    
    // Store analytics data in MongoDB
    await EmployeeService.storeAnalyticsData({
      event: 'employee_created',
      employeeId: newEmployee.id,
      department: newEmployee.department,
      salary: newEmployee.salary
    });
    
    return NextResponse.json({ employee: newEmployee }, { status: 201 });
  } catch (error) {
    console.error('Failed to create employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
} 