/*
  # Initial Payroll System Schema

  1. New Tables
    - `companies`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamp)
      
    - `employees`
      - `id` (uuid, primary key)
      - `company_id` (uuid, foreign key)
      - `name` (text)
      - `email` (text, unique)
      - `position` (text)
      - `department` (text)
      - `salary` (numeric)
      - `status` (text)
      - `created_at` (timestamp)
      
    - `payroll_transactions`
      - `id` (uuid, primary key)
      - `company_id` (uuid, foreign key)
      - `employee_id` (uuid, foreign key)
      - `amount` (numeric)
      - `type` (text)
      - `status` (text)
      - `processed_at` (timestamp)
      - `created_at` (timestamp)
      
    - `vault_transactions`
      - `id` (uuid, primary key)
      - `company_id` (uuid, foreign key)
      - `amount` (numeric)
      - `type` (text)
      - `description` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create companies table
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create employees table
CREATE TABLE employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  position text NOT NULL,
  department text NOT NULL,
  salary numeric NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('active', 'onleave', 'terminated'))
);

-- Create payroll_transactions table
CREATE TABLE payroll_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id),
  employee_id uuid REFERENCES employees(id),
  amount numeric NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_type CHECK (type IN ('salary', 'bonus', 'reimbursement')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

-- Create vault_transactions table
CREATE TABLE vault_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id),
  amount numeric NOT NULL,
  type text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_type CHECK (type IN ('deposit', 'withdrawal'))
);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Companies are viewable by authenticated users" ON companies
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Employees are viewable by company members" ON employees
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM companies c
    WHERE c.id = employees.company_id
  ));

CREATE POLICY "Payroll transactions are viewable by company members" ON payroll_transactions
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM companies c
    WHERE c.id = payroll_transactions.company_id
  ));

CREATE POLICY "Vault transactions are viewable by company members" ON vault_transactions
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM companies c
    WHERE c.id = vault_transactions.company_id
  ));