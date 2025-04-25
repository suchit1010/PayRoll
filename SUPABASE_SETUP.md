# Supabase Setup Guide

This guide will help you set up Supabase for the Payroll Management System.

## Prerequisites

1. A Supabase account (free tier is sufficient)
2. Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in.
2. Click "New Project" to create a new project.
3. Choose an organization (or create a new one).
4. Give your project a name (e.g., "payroll-management").
5. Set a secure database password (store it somewhere safe).
6. Choose a region close to your target users.
7. Click "Create new project" and wait for the project to be set up.

## Step 2: Set Up Database Tables

Once your project is created, you need to set up the database tables. You can do this in two ways:

### Option 1: Use the provided SQL migration

1. In the Supabase dashboard, go to the "SQL Editor" section.
2. Click "New query".
3. Copy and paste the contents of the `supabase/migrations/20250421041958_bold_union.sql` file from this project.
4. Click "Run" to execute the SQL and create the tables.

### Option 2: Use the Supabase UI

1. Go to the "Table Editor" section.
2. Create the following tables:

   - **companies**
     - `id` (uuid, primary key)
     - `name` (text)
     - `created_at` (timestamp)
   
   - **employees**
     - `id` (uuid, primary key)
     - `company_id` (uuid, foreign key to companies.id)
     - `name` (text)
     - `email` (text, unique)
     - `position` (text)
     - `department` (text)
     - `salary` (numeric)
     - `status` (text, with constraint check: 'active', 'onleave', 'terminated')
     - `created_at` (timestamp)
   
   - **payroll_transactions**
     - `id` (uuid, primary key)
     - `company_id` (uuid, foreign key to companies.id)
     - `employee_id` (uuid, foreign key to employees.id)
     - `amount` (numeric)
     - `type` (text, with constraint check: 'salary', 'bonus', 'reimbursement')
     - `status` (text, with constraint check: 'pending', 'processing', 'completed', 'failed')
     - `processed_at` (timestamp)
     - `created_at` (timestamp)
   
   - **vault_transactions**
     - `id` (uuid, primary key)
     - `company_id` (uuid, foreign key to companies.id)
     - `amount` (numeric)
     - `type` (text, with constraint check: 'deposit', 'withdrawal')
     - `description` (text)
     - `created_at` (timestamp)

## Step 3: Enable Row-Level Security (RLS) 

If you used Option 1, RLS is already enabled. If you used Option 2, follow these steps:

1. For each table, go to the "Authentication" tab.
2. Toggle "Enable RLS" to turn on Row-Level Security.
3. Create appropriate policies for each table.

## Step 4: Get your API Keys

1. In the Supabase dashboard, go to "Project Settings" (the gear icon).
2. Click on the "API" section.
3. You'll find your project URL and anon (public) key.

## Step 5: Configure Environment Variables

1. Create a `.env.local` file in the root of your project.
2. Add the following lines:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Replace `your_supabase_project_url` and `your_supabase_anon_key` with the values from Step 4.

## Step 6: Test the Connection

1. Start your application with `npm run dev`.
2. Try adding and viewing employees.
3. If it's working correctly, you should see the "(Using local storage)" indicator disappear.
4. You can also run the test script with `node lib/test-supabase.js` to verify your connection.

## Troubleshooting

If you encounter issues:

1. **Environment Variables**: Make sure your environment variables are correctly set.
2. **CORS Issues**: Check that your Supabase project allows requests from your app's domain.
3. **Network Issues**: Ensure your network allows connections to Supabase.
4. **RLS Policies**: Verify that your RLS policies are correctly set up.

## Note on Local Storage

This application is designed to fall back to local storage if Supabase is not available. This is great for development but not suitable for production. For a production environment, ensure Supabase is properly configured. 