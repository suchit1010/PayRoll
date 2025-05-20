import { NextRequest, NextResponse } from 'next/server';
import { processPayroll } from '@/lib/supabase';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    // Get payroll transactions from MongoDB for better querying capabilities
    const collection = await getCollection('payroll_transactions');
    const transactions = await collection
      .find({})
      .sort({ created_at: -1 })
      .limit(100)
      .toArray();
    
    return NextResponse.json({ transactions });
  } catch (error: any) {
    console.error('Error fetching payroll transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payroll transactions', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }
    
    // Process payroll using Supabase
    const transactions = await processPayroll(body.companyId);
    
    // Store detailed transaction data in MongoDB for analytics
    const collection = await getCollection('payroll_transactions');
    await collection.insertMany(
      transactions.map(tx => ({
        supabase_id: tx.id,
        company_id: tx.company_id,
        employee_id: tx.employee_id,
        amount: tx.amount,
        type: tx.type,
        status: tx.status,
        processed_at: tx.processed_at,
        created_at: new Date(),
        processing_details: body.details || {}
      }))
    );
    
    return NextResponse.json({ 
      success: true,
      transactions_count: transactions.length,
      total_amount: transactions.reduce((sum, tx) => sum + tx.amount, 0)
    });
  } catch (error: any) {
    console.error('Error processing payroll:', error);
    return NextResponse.json(
      { error: 'Failed to process payroll', message: error.message },
      { status: 500 }
    );
  }
} 