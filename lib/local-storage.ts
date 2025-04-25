import { Employee } from './supabase';

// Fallback data for initial state
const initialEmployees = [
  { id: "1", name: "John Smith", position: "Software Engineer", department: "Engineering", salary: 85000, status: "active" as const, email: "john.smith@inco.com", company_id: "1", created_at: new Date().toISOString() },
  { id: "2", name: "Sarah Johnson", position: "Marketing Manager", department: "Marketing", salary: 92000, status: "active" as const, email: "sarah.johnson@inco.com", company_id: "1", created_at: new Date().toISOString() },
];

const EMPLOYEES_KEY = 'payroll_app_employees';

// Helper function to generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Function to get all employees from localStorage
export const getLocalEmployees = (): Employee[] => {
  if (typeof window === 'undefined') {
    return initialEmployees;
  }

  try {
    const storedEmployees = localStorage.getItem(EMPLOYEES_KEY);
    if (!storedEmployees) {
      // Initialize with default data if empty
      localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(initialEmployees));
      return initialEmployees;
    }
    return JSON.parse(storedEmployees);
  } catch (error) {
    console.error('Error getting employees from localStorage:', error);
    return initialEmployees;
  }
};

// Function to add an employee to localStorage
export const addLocalEmployee = (employee: Omit<Employee, 'id' | 'created_at'>): Employee => {
  try {
    const employees = getLocalEmployees();
    
    const newEmployee = {
      ...employee,
      id: generateId(),
      created_at: new Date().toISOString()
    };
    
    const updatedEmployees = [newEmployee, ...employees];
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(updatedEmployees));
    
    return newEmployee;
  } catch (error) {
    console.error('Error adding employee to localStorage:', error);
    throw error;
  }
};

// Function to update an employee in localStorage
export const updateLocalEmployee = (id: string, updates: Partial<Employee>): Employee => {
  try {
    const employees = getLocalEmployees();
    const index = employees.findIndex(emp => emp.id === id);
    
    if (index === -1) {
      throw new Error(`Employee with id ${id} not found`);
    }
    
    const updatedEmployee = {
      ...employees[index],
      ...updates
    };
    
    employees[index] = updatedEmployee;
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
    
    return updatedEmployee;
  } catch (error) {
    console.error('Error updating employee in localStorage:', error);
    throw error;
  }
};

// Function to delete an employee from localStorage
export const deleteLocalEmployee = (id: string): void => {
  try {
    const employees = getLocalEmployees();
    const filteredEmployees = employees.filter(emp => emp.id !== id);
    
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(filteredEmployees));
  } catch (error) {
    console.error('Error deleting employee from localStorage:', error);
    throw error;
  }
}; 