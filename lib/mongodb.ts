import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Model Schemas
const employeeSchema = new mongoose.Schema({
  company_id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: String, required: true },
  salary: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['active', 'onleave', 'terminated'],
    default: 'active'
  },
  created_at: { type: Date, default: Date.now }
});

const payrollTransactionSchema = new mongoose.Schema({
  company_id: { type: String, required: true },
  employee_id: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['salary', 'bonus', 'reimbursement'],
    default: 'salary'
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  processed_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now }
});

const vaultTransactionSchema = new mongoose.Schema({
  company_id: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['deposit', 'withdrawal'],
    required: true 
  },
  description: { type: String, default: null },
  created_at: { type: Date, default: Date.now }
});

// Models
export const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
export const PayrollTransaction = mongoose.models.PayrollTransaction || 
  mongoose.model('PayrollTransaction', payrollTransactionSchema);
export const VaultTransaction = mongoose.models.VaultTransaction || 
  mongoose.model('VaultTransaction', vaultTransactionSchema);

// Types
export type EmployeeType = mongoose.InferSchemaType<typeof employeeSchema> & { _id: string };
export type PayrollTransactionType = mongoose.InferSchemaType<typeof payrollTransactionSchema> & { _id: string };
export type VaultTransactionType = mongoose.InferSchemaType<typeof vaultTransactionSchema> & { _id: string }; 