import { createClient } from '@supabase/supabase-js';
import { getCollection } from './mongodb';
import { WithId, Document } from 'mongodb';

// Supabase client initialization
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  status: 'active' | 'onleave' | 'terminated';
}

export interface EmployeeActivity {
  employeeId: string;
  action: string;
  timestamp: Date;
  details: any;
  metadata?: any;
}

/**
 * Hybrid database service that uses both Supabase and MongoDB
 * - Supabase for relational data (employees, payroll)
 * - MongoDB for high-volume, schema-flexible data (activity logs, analytics)
 */
export const EmployeeService = {
  // Use Supabase for structured employee data
  async getEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*');
    
    if (error) throw error;
    return data as Employee[];
  },

  async getEmployee(id: string): Promise<Employee | null> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Employee;
  },

  async createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
    const { data, error } = await supabase
      .from('employees')
      .insert(employee)
      .select()
      .single();
    
    if (error) throw error;
    
    // Also log this activity to MongoDB
    await this.logEmployeeActivity({
      employeeId: data.id,
      action: 'created',
      timestamp: new Date(),
      details: { ...employee }
    });
    
    return data as Employee;
  },

  // Use MongoDB for high-volume, flexible-schema activity logs
  async logEmployeeActivity(activity: EmployeeActivity): Promise<void> {
    const collection = await getCollection('employee_activities');
    await collection.insertOne(activity);
  },

  async getEmployeeActivities(employeeId: string): Promise<EmployeeActivity[]> {
    const collection = await getCollection('employee_activities');
    const activities = await collection.find({ employeeId }).sort({ timestamp: -1 }).toArray();
    return activities as unknown as EmployeeActivity[];
  },

  // Use MongoDB for analytics data
  async storeAnalyticsData(data: any): Promise<void> {
    const collection = await getCollection('analytics');
    await collection.insertOne({
      ...data,
      timestamp: new Date()
    });
  },

  async getAnalytics(query: any): Promise<any[]> {
    const collection = await getCollection('analytics');
    return collection.find(query).toArray();
  }
}; 