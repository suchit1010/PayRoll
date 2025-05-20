import { NextRequest, NextResponse } from 'next/server';
import { getEmployees, addEmployee } from '@/lib/supabase';
import { EmployeeService } from '@/lib/dual-database-service';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    // Attempt to get employees from Supabase first
    let employees;
    try {
      employees = await getEmployees();
    } catch (error) {
      // Fall back to dual database service if Supabase fails
      employees = await EmployeeService.getEmployees();
    }
    
    return NextResponse.json({ employees });
  } catch (error: any) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'position', 'department', 'salary', 'status'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', fields: missingFields },
        { status: 400 }
      );
    }
    
    // Create employee using dual database service to ensure it's logged properly
    const newEmployee = await EmployeeService.createEmployee({
      name: body.name,
      email: body.email,
      position: body.position,
      department: body.department,
      salary: body.salary,
      status: body.status
    });
    
    return NextResponse.json({ employee: newEmployee }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee', message: error.message },
      { status: 500 }
    );
  }
} 