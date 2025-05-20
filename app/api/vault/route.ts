import { NextRequest, NextResponse } from 'next/server';
import { addVaultTransaction, getVaultTransactions } from '@/lib/supabase';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    // Get transactions from Supabase
    const transactions = await getVaultTransactions();
    
    // Get additional analytics from MongoDB
    const collection = await getCollection('vault_analytics');
    const analytics = await collection
      .find({})
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();
    
    return NextResponse.json({ 
      transactions,
      analytics
    });
  } catch (error: any) {
    console.error('Error fetching vault data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vault data', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['company_id', 'amount', 'type'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', fields: missingFields },
        { status: 400 }
      );
    }
    
    if (!['deposit', 'withdrawal'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Invalid transaction type. Must be "deposit" or "withdrawal"' },
        { status: 400 }
      );
    }
    
    // Add transaction to Supabase
    const transaction = await addVaultTransaction({
      company_id: body.company_id,
      amount: body.amount,
      type: body.type,
      description: body.description || null
    });
    
    // Log detailed transaction in MongoDB
    const collection = await getCollection('vault_analytics');
    await collection.insertOne({
      supabase_id: transaction.id,
      company_id: transaction.company_id,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      user_id: body.user_id, // Additional field not in Supabase
      ip_address: body.ip_address, // Additional field for audit
      user_agent: body.user_agent, // Additional field for audit
      timestamp: new Date()
    });
    
    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating vault transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create vault transaction', message: error.message },
      { status: 500 }
    );
  }
} 