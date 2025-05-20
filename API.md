# PayRoll API Documentation

This document outlines the API endpoints available in the PayRoll Management System.

## Authentication

Most API endpoints require authentication via an API key, which should be included in the request headers:

```
x-api-key: your-api-key
```

To obtain an API key, please contact the system administrator.

## Base URL

All API endpoints are relative to:

```
https://your-domain.com/api
```

In development environments, this will be:

```
http://localhost:3000/api
```

## General Endpoints

### Health Check

Check if the API is running.

```
GET /
```

**Response**:
```json
{
  "status": "ok",
  "message": "PayRoll API is running",
  "version": "1.0.0",
  "timestamp": "2023-07-10T12:34:56.789Z"
}
```

### MongoDB Status

Check if the MongoDB connection is working.

```
GET /mongodb-status
```

**Response**:
```json
{
  "status": "connected",
  "responseTime": "45ms",
  "timestamp": "2023-07-10T12:34:56.789Z"
}
```

## Employee Endpoints

### List Employees

Get a list of all employees.

```
GET /employees
```

**Response**:
```json
{
  "employees": [
    {
      "id": "1234abcd",
      "name": "John Doe",
      "email": "john@example.com",
      "position": "Developer",
      "department": "Engineering",
      "salary": 75000,
      "status": "active",
      "created_at": "2023-01-15T08:30:00.000Z"
    },
    // ...more employees
  ]
}
```

### Create Employee

Create a new employee.

```
POST /employees
```

**Request Body**:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "position": "Designer",
  "department": "Marketing",
  "salary": 70000,
  "status": "active"
}
```

**Response**:
```json
{
  "employee": {
    "id": "5678efgh",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "position": "Designer",
    "department": "Marketing",
    "salary": 70000,
    "status": "active",
    "created_at": "2023-07-10T12:34:56.789Z"
  }
}
```

### Get Employee

Get details for a specific employee.

```
GET /employees/:id
```

**Response**:
```json
{
  "employee": {
    "id": "1234abcd",
    "name": "John Doe",
    "email": "john@example.com",
    "position": "Developer",
    "department": "Engineering",
    "salary": 75000,
    "status": "active",
    "created_at": "2023-01-15T08:30:00.000Z"
  },
  "activities": [
    {
      "employeeId": "1234abcd",
      "action": "updated",
      "timestamp": "2023-06-20T14:45:30.000Z",
      "details": {
        "salary": 75000,
        "previousSalary": 70000
      }
    },
    // ...more activities
  ]
}
```

### Update Employee

Update an existing employee.

```
PUT /employees/:id
```

**Request Body**:
```json
{
  "position": "Senior Developer",
  "salary": 85000
}
```

**Response**:
```json
{
  "employee": {
    "id": "1234abcd",
    "name": "John Doe",
    "email": "john@example.com",
    "position": "Senior Developer",
    "department": "Engineering",
    "salary": 85000,
    "status": "active",
    "created_at": "2023-01-15T08:30:00.000Z"
  }
}
```

### Delete Employee

Delete an employee.

```
DELETE /employees/:id
```

**Response**:
```json
{
  "success": true
}
```

## Payroll Endpoints

### List Payroll Transactions

Get a list of recent payroll transactions.

```
GET /payroll
```

**Response**:
```json
{
  "transactions": [
    {
      "id": "tx123",
      "company_id": "company456",
      "employee_id": "1234abcd",
      "amount": 6250,
      "type": "salary",
      "status": "completed",
      "processed_at": "2023-06-30T00:00:00.000Z",
      "created_at": "2023-06-29T12:00:00.000Z"
    },
    // ...more transactions
  ]
}
```

### Process Payroll

Process payroll for a company.

```
POST /payroll
```

**Request Body**:
```json
{
  "companyId": "company456",
  "details": {
    "period": "June 2023",
    "processedBy": "user789"
  }
}
```

**Response**:
```json
{
  "success": true,
  "transactions_count": 45,
  "total_amount": 281250
}
```

## Vault Endpoints

### Get Vault Transactions

Get vault transactions and analytics.

```
GET /vault
```

**Response**:
```json
{
  "transactions": [
    {
      "id": "vt123",
      "company_id": "company456",
      "amount": 100000,
      "type": "deposit",
      "description": "Initial funding",
      "created_at": "2023-01-01T00:00:00.000Z"
    },
    // ...more transactions
  ],
  "analytics": [
    {
      "date": "2023-06-01",
      "deposits": 150000,
      "withdrawals": 120000,
      "balance": 30000
    },
    // ...more analytics
  ]
}
```

### Add Vault Transaction

Add a new vault transaction.

```
POST /vault
```

**Request Body**:
```json
{
  "company_id": "company456",
  "amount": 50000,
  "type": "deposit",
  "description": "Monthly funding",
  "user_id": "user789"
}
```

**Response**:
```json
{
  "transaction": {
    "id": "vt789",
    "company_id": "company456",
    "amount": 50000,
    "type": "deposit",
    "description": "Monthly funding",
    "created_at": "2023-07-10T12:34:56.789Z"
  }
}
```

## Analytics Endpoints

### Get Analytics

Get analytics data for various aspects of the system.

```
GET /analytics?type=payroll&period=30d
```

**Query Parameters**:
- `type`: Type of analytics to retrieve (payroll, employees, vault, default)
- `period`: Time period for analytics (e.g., 30d, 3m, 1y)

**Response**:
```json
{
  "analytics": [
    {
      "_id": "2023-06-15",
      "totalAmount": 75000,
      "count": 15
    },
    {
      "_id": "2023-06-30",
      "totalAmount": 85000,
      "count": 17
    },
    // ...more analytics data
  ]
}
```

### Record Analytics Event

Record a custom analytics event.

```
POST /analytics
```

**Request Body**:
```json
{
  "event": "user_login",
  "userId": "user789",
  "details": {
    "browser": "Chrome",
    "platform": "Windows"
  }
}
```

**Response**:
```json
{
  "success": true
}
```

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "error": "Error message",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error 