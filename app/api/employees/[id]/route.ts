import { NextRequest, NextResponse } from 'next/server';
import { EmployeeService } from '@/lib/dual-database-service';
import { supabase } from '@/lib/supabase';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const employee = await EmployeeService.getEmployee(params.id);
    
    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    // Get employee activities from MongoDB
    const activities = await EmployeeService.getEmployeeActivities(params.id);
    
    return NextResponse.json({ 
      employee,
      activities
    });
  } catch (error: any) {
    console.error(`Error fetching employee ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch employee', message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json();
    
    // Update employee in Supabase
    const { data, error } = await supabase
      .from('employees')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Log the update activity
    await EmployeeService.logEmployeeActivity({
      employeeId: params.id,
      action: 'updated',
      timestamp: new Date(),
      details: body
    });
    
    return NextResponse.json({ employee: data });
  } catch (error: any) {
    console.error(`Error updating employee ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update employee', message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Delete employee from Supabase
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', params.id);
    
    if (error) throw error;
    
    // Log the delete activity
    await EmployeeService.logEmployeeActivity({
      employeeId: params.id,
      action: 'deleted',
      timestamp: new Date(),
      details: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error deleting employee ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete employee', message: error.message },
      { status: 500 }
    );
  }
} 