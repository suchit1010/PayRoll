import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addEmployee, getEmployees } from '../lib/supabase';
import { supabase } from '../lib/supabase';

// Mock Supabase client
vi.mock('../lib/supabase', async (importOriginal: any) => {
  const actual = await importOriginal();
  
  // Create properly typed mock functions
  const mockFrom = vi.fn().mockReturnThis();
  const mockSelect = vi.fn().mockReturnThis();
  const mockInsert = vi.fn().mockReturnThis();
  const mockUpdate = vi.fn().mockReturnThis();
  const mockDelete = vi.fn().mockReturnThis();
  const mockEq = vi.fn().mockReturnThis();
  const mockOrder = vi.fn().mockReturnThis();
  const mockSingle = vi.fn().mockReturnThis();
  
  // Add mockResolvedValue to the chain
  mockSingle.mockResolvedValue = vi.fn();
  mockOrder.mockResolvedValue = vi.fn();
  
  return {
    ...actual,
    supabase: {
      from: mockFrom,
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
      eq: mockEq,
      order: mockOrder,
      single: mockSingle
    }
  };
});

describe('Employee CRUD Operations', () => {
  const mockEmployee = {
    company_id: '123',
    name: 'Test Employee',
    email: 'test@example.com',
    position: 'Developer',
    department: 'Engineering',
    salary: 75000,
    status: 'active' as const
  };

  const mockEmployeeResponse = {
    ...mockEmployee,
    id: 'emp123',
    created_at: new Date().toISOString()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addEmployee', () => {
    it('should add an employee successfully', async () => {
      // Mock the supabase response
      const mockSingle = {
        data: mockEmployeeResponse,
        error: null
      };
      
      // Setup the mock chain
      const mockFrom = vi.fn().mockReturnThis();
      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingleFn = vi.fn().mockResolvedValue(mockSingle);
      
      // Replace the mock implementations
      vi.spyOn(supabase, 'from').mockImplementation(mockFrom);
      vi.spyOn(mockFrom(), 'insert').mockImplementation(mockInsert);
      vi.spyOn(mockInsert(), 'select').mockImplementation(mockSelect);
      vi.spyOn(mockSelect(), 'single').mockImplementation(mockSingleFn);

      const result = await addEmployee(mockEmployee);
      
      // Verify the supabase client was called correctly
      expect(supabase.from).toHaveBeenCalledWith('employees');
      expect(mockFrom().insert).toHaveBeenCalledWith([mockEmployee]);
      
      // Verify the returned data
      expect(result).toEqual(mockEmployeeResponse);
    });

    it('should throw an error if the API call fails', async () => {
      // Mock an error response
      const mockSingle = {
        data: null,
        error: { message: 'Failed to add employee' }
      };
      
      // Setup the mock chain
      const mockFrom = vi.fn().mockReturnThis();
      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingleFn = vi.fn().mockResolvedValue(mockSingle);
      
      // Replace the mock implementations
      vi.spyOn(supabase, 'from').mockImplementation(mockFrom);
      vi.spyOn(mockFrom(), 'insert').mockImplementation(mockInsert);
      vi.spyOn(mockInsert(), 'select').mockImplementation(mockSelect);
      vi.spyOn(mockSelect(), 'single').mockImplementation(mockSingleFn);

      await expect(addEmployee(mockEmployee)).rejects.toEqual({ 
        message: 'Failed to add employee' 
      });
    });
  });

  describe('getEmployees', () => {
    it('should fetch employees successfully', async () => {
      const mockEmployees = [mockEmployeeResponse];
      
      // Mock the supabase response
      const mockResponse = {
        data: mockEmployees,
        error: null
      };
      
      // Setup the mock chain
      const mockFrom = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue(mockResponse);
      
      // Replace the mock implementations
      vi.spyOn(supabase, 'from').mockImplementation(mockFrom);
      vi.spyOn(mockFrom(), 'select').mockImplementation(mockSelect);
      vi.spyOn(mockSelect(), 'order').mockImplementation(mockOrder);

      const result = await getEmployees();
      
      // Verify the supabase client was called correctly
      expect(supabase.from).toHaveBeenCalledWith('employees');
      expect(mockFrom().select).toHaveBeenCalledWith('*');
      
      // Verify the returned data
      expect(result).toEqual(mockEmployees);
    });

    it('should throw an error if the API call fails', async () => {
      // Mock an error response
      const mockResponse = {
        data: null,
        error: { message: 'Failed to fetch employees' }
      };
      
      // Setup the mock chain
      const mockFrom = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue(mockResponse);
      
      // Replace the mock implementations
      vi.spyOn(supabase, 'from').mockImplementation(mockFrom);
      vi.spyOn(mockFrom(), 'select').mockImplementation(mockSelect);
      vi.spyOn(mockSelect(), 'order').mockImplementation(mockOrder);

      await expect(getEmployees()).rejects.toEqual({ 
        message: 'Failed to fetch employees' 
      });
    });
  });
}); 