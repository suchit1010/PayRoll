import { connectToDatabase, Employee, PayrollTransaction, VaultTransaction, 
  EmployeeType, PayrollTransactionType, VaultTransactionType } from './mongodb';

// Export all types
export type { EmployeeType, PayrollTransactionType, VaultTransactionType };

// Employee operations
export async function getEmployees() {
  await connectToDatabase();
  const employees = await Employee.find().sort({ created_at: -1 });
  return employees.map(employee => ({
    ...employee.toObject(),
    id: employee._id.toString()
  }));
}

export async function addEmployee(employee: Omit<EmployeeType, '_id' | 'created_at'>) {
  await connectToDatabase();
  const newEmployee = new Employee(employee);
  const savedEmployee = await newEmployee.save();
  return {
    ...savedEmployee.toObject(),
    id: savedEmployee._id.toString()
  };
}

// Payroll operations
export async function processPayroll(companyId: string) {
  await connectToDatabase();
  
  // Get all active employees for the company
  const employees = await Employee.find({ 
    company_id: companyId,
    status: 'active'
  });

  // Create transaction objects for each employee
  const transactions = employees.map(employee => ({
    company_id: companyId,
    employee_id: employee._id.toString(),
    amount: employee.salary / 12, // Monthly salary
    type: 'salary',
    status: 'pending'
  }));

  // Save all transactions to database
  const savedTransactions = await PayrollTransaction.insertMany(transactions);
  
  return savedTransactions.map(transaction => ({
    ...transaction.toObject(),
    id: transaction._id.toString()
  }));
}

// Vault operations
export async function addVaultTransaction(transaction: Omit<VaultTransactionType, '_id' | 'created_at'>) {
  await connectToDatabase();
  const newTransaction = new VaultTransaction(transaction);
  const savedTransaction = await newTransaction.save();
  return {
    ...savedTransaction.toObject(),
    id: savedTransaction._id.toString()
  };
}

export async function getVaultTransactions() {
  await connectToDatabase();
  const transactions = await VaultTransaction.find().sort({ created_at: -1 });
  return transactions.map(transaction => ({
    ...transaction.toObject(),
    id: transaction._id.toString()
  }));
} 