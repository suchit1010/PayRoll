import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.describe('Employee Management', () => {
  // Initialize data - this could come from environment variables or fixtures
  const testEmployee = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    position: 'QA Engineer',
    department: 'Engineering',
    salary: '80000'
  };

  test('can add a new employee', async ({ page }: { page: Page }) => {
    // Navigate to employees page
    await page.goto('/employees');
    
    // Click the "Add Employee" button
    await page.click('button:has-text("Add Employee")');
    
    // Wait for dialog to appear
    await page.waitForSelector('form:has-text("Add New Employee")');
    
    // Fill in the form
    await page.fill('#name', testEmployee.name);
    await page.fill('#email', testEmployee.email);
    await page.fill('#position', testEmployee.position);
    await page.fill('#department', testEmployee.department);
    await page.fill('#salary', testEmployee.salary);
    
    // Submit the form
    await page.click('button:has-text("Add Employee"):not(:disabled)');
    
    // Wait for the dialog to close and employees to refresh
    await page.waitForTimeout(1000);
    
    // Look for the added employee in the table
    const employeeCell = page.locator(`text=${testEmployee.name}`);
    await expect(employeeCell).toBeVisible();
  });

  test('can search for employees', async ({ page }: { page: Page }) => {
    // Navigate to employees page
    await page.goto('/employees');
    
    // Search for the test employee
    await page.fill('input[type="search"]', testEmployee.name);
    
    // Check the search results
    const employeeCell = page.locator(`text=${testEmployee.name}`);
    await expect(employeeCell).toBeVisible();
    
    // Clear the search and check all employees appear
    await page.fill('input[type="search"]', '');
    await page.waitForTimeout(500);
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });

  test('can filter employees by status', async ({ page }: { page: Page }) => {
    // Navigate to employees page
    await page.goto('/employees');
    
    // Click on the Active tab
    await page.click('button:has-text("Active")');
    await page.waitForTimeout(500);
    
    // Check that our test employee (which should be active) is visible
    const employeeCell = page.locator(`text=${testEmployee.name}`);
    await expect(employeeCell).toBeVisible();
    
    // Now click on the Terminated tab
    await page.click('button:has-text("Terminated")');
    await page.waitForTimeout(500);
    
    // Our test employee should not be visible here
    await expect(employeeCell).not.toBeVisible();
  });
}); 