import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Employee = {
  id: string;
  company_id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  status: 'active' | 'onleave' | 'terminated';
  created_at: string;
};

export type PayrollTransaction = {
  id: string;
  company_id: string;
  employee_id: string;
  amount: number;
  type: 'salary' | 'bonus' | 'reimbursement';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processed_at: string | null;
  created_at: string;
};

export type VaultTransaction = {
  id: string;
  company_id: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  description: string | null;
  created_at: string;
};

export async function getEmployees() {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data as Employee[];
}

export async function addEmployee(employee: Omit<Employee, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('employees')
    .insert([employee])
    .select()
    .single();
    
  if (error) throw error;
  return data as Employee;
}

export async function processPayroll(companyId: string) {
  const { data: employees, error: employeesError } = await supabase
    .from('employees')
    .select('*')
    .eq('company_id', companyId)
    .eq('status', 'active');
    
  if (employeesError) throw employeesError;

  const transactions = employees.map(employee => ({
    company_id: companyId,
    employee_id: employee.id,
    amount: employee.salary / 12, // Monthly salary
    type: 'salary' as const,
    status: 'pending' as const
  }));

  const { data, error } = await supabase
    .from('payroll_transactions')
    .insert(transactions)
    .select();
    
  if (error) throw error;
  return data as PayrollTransaction[];
}

export async function addVaultTransaction(transaction: Omit<VaultTransaction, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('vault_transactions')
    .insert([transaction])
    .select()
    .single();
    
  if (error) throw error;
  return data as VaultTransaction;
}

export async function getVaultTransactions() {
  const { data, error } = await supabase
    .from('vault_transactions')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data as VaultTransaction[];
}