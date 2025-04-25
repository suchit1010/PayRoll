import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Try to get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a mock Supabase client for SSR or when credentials are missing
const createMockClient = (): SupabaseClient => {
  // Return a mock client that just throws errors when methods are called
  return {
    from: () => {
      throw new Error("Supabase client not properly initialized");
    }
  } as unknown as SupabaseClient;
};

// Initialize with mock client first
let supabase: SupabaseClient = createMockClient();

// Only attempt to create the real client on the client side, not during SSR
if (typeof window !== 'undefined') {
  const hasSupabaseCredentials = !!supabaseUrl && !!supabaseAnonKey;
  
  if (hasSupabaseCredentials) {
    try {
      supabase = createClient(supabaseUrl, supabaseAnonKey);
      console.log("Supabase client initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error);
      // Keep using the mock client
    }
  } else {
    console.warn("Missing Supabase credentials. Using localStorage fallback.");
  }
}

// Flag to check if we're using a real Supabase client
export const isUsingRealSupabase = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!supabaseUrl && !!supabaseAnonKey;
};

export { supabase };

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
  if (!isUsingRealSupabase()) {
    throw new Error("Supabase credentials not configured. Please check your environment variables.");
  }

  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Employee[];
  } catch (error) {
    console.error("Failed to get employees from Supabase:", error);
    throw error;
  }
}

export async function addEmployee(employee: Omit<Employee, 'id' | 'created_at'>) {
  if (!isUsingRealSupabase()) {
    throw new Error("Supabase credentials not configured. Please check your environment variables.");
  }

  try {
    const { data, error } = await supabase
      .from('employees')
      .insert([employee])
      .select()
      .single();
      
    if (error) throw error;
    return data as Employee;
  } catch (error) {
    console.error("Failed to add employee to Supabase:", error);
    throw error;
  }
}

export async function processPayroll(companyId: string) {
  if (!isUsingRealSupabase()) {
    throw new Error("Supabase credentials not configured. Please check your environment variables.");
  }

  try {
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', 'active');
      
    if (employeesError) throw employeesError;

    const transactions = employees.map(employee => ({
      company_id: companyId,
      employee_id: employee.id,
      amount: (employee as Employee).salary / 12, // Monthly salary
      type: 'salary' as const,
      status: 'pending' as const
    }));

    const { data, error } = await supabase
      .from('payroll_transactions')
      .insert(transactions)
      .select();
      
    if (error) throw error;
    return data as PayrollTransaction[];
  } catch (error) {
    console.error("Failed to process payroll in Supabase:", error);
    throw error;
  }
}

export async function addVaultTransaction(transaction: Omit<VaultTransaction, 'id' | 'created_at'>) {
  if (!isUsingRealSupabase()) {
    throw new Error("Supabase credentials not configured. Please check your environment variables.");
  }

  try {
    const { data, error } = await supabase
      .from('vault_transactions')
      .insert([transaction])
      .select()
      .single();
      
    if (error) throw error;
    return data as VaultTransaction;
  } catch (error) {
    console.error("Failed to add vault transaction to Supabase:", error);
    throw error;
  }
}

export async function getVaultTransactions() {
  if (!isUsingRealSupabase()) {
    throw new Error("Supabase credentials not configured. Please check your environment variables.");
  }

  try {
    const { data, error } = await supabase
      .from('vault_transactions')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as VaultTransaction[];
  } catch (error) {
    console.error("Failed to get vault transactions from Supabase:", error);
    throw error;
  }
}