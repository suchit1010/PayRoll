# MongoDB Setup Guide

This guide will help you set up MongoDB alongside Supabase for the Payroll Management System.

## Why Use Both Databases?

Our application uses a dual-database approach to leverage the strengths of both Supabase (PostgreSQL) and MongoDB:

- **Supabase (PostgreSQL)**: Used for structured data with clear relationships, such as employee records, payroll transactions, and company information.
- **MongoDB**: Used for schema-flexible data, high-volume writes, and real-time analytics, such as activity logs, user events, and analytics data.

## Prerequisites

1. A MongoDB Atlas account (free tier is sufficient) or a local MongoDB installation
2. Node.js and npm installed

## Step 1: Set Up MongoDB

### Option 1: MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up or log in.
2. Create a new project and cluster (free tier is sufficient for development).
3. Set up database access:
   - Create a database user with appropriate permissions.
   - Remember to save your username and password securely.
4. Set up network access:
   - Add your IP address to the allowlist or allow access from anywhere (for development only).
5. Get your connection string:
   - Go to "Connect" > "Connect your application".
   - Copy the connection string, which will look like: `mongodb+srv://<username>:<password>@<cluster-url>/test?retryWrites=true&w=majority`

### Option 2: Local MongoDB (for Development)

1. [Download and install MongoDB Community Edition](https://www.mongodb.com/try/download/community).
2. Start the MongoDB service.
3. Your connection string will be: `mongodb://localhost:27017`

## Step 2: Configure Environment Variables

1. Update your `.env.local` file (or create one if it doesn't exist) in the root of your project.
2. Add the following MongoDB configuration:

```
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=your_database_name
```

3. Replace `your_mongodb_connection_string` with your connection string from Step 1.
4. Replace `your_database_name` with your preferred database name (e.g., `payroll_app`).

## Step 3: Test the Connection

1. Start your application with `npm run dev`.
2. Use the API endpoints that interact with MongoDB (e.g., `/api/analytics`).
3. Check your MongoDB database to confirm that data is being stored.

## MongoDB Collections

This application uses the following MongoDB collections:

- **employee_activities**: Logs employee-related activities (creation, updates, etc.)
- **analytics**: Stores analytics data for reporting and dashboards

## Usage Guidelines

- Use Supabase for:
  - Core business data that requires transactions
  - User authentication and authorization
  - Data with clear relational structure

- Use MongoDB for:
  - Logging and activity tracking
  - Real-time analytics
  - Data with flexible or evolving schemas
  - High-throughput operations

## Troubleshooting

If you encounter issues:

1. **Connection Errors**: Verify your connection string and ensure your IP is in the allowlist.
2. **Authentication Errors**: Check your username and password in the connection string.
3. **Deployment Issues**: Make sure environment variables are correctly set up in your production environment.

## Note on Development

During development, the application uses connection caching to optimize MongoDB connections. This is handled automatically by the `connectToDatabase()` function in `lib/mongodb.ts`. 