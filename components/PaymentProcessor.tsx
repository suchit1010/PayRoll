'use client';

import { useState, FC, useEffect } from 'react';
import { usePayrollProgram } from '@/hooks/usePayrollProgram';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface PaymentProcessorProps {
  payrollAddress?: string;
  paymentToken?: string;
}

export const PaymentProcessor: FC<PaymentProcessorProps> = ({ 
  payrollAddress,
  paymentToken
}) => {
  const { connected, publicKey } = useWallet();
  const { processPayment, findEmployeeAddress, loading, error } = usePayrollProgram();
  const [employeeId, setEmployeeId] = useState('');
  const [employeeWallet, setEmployeeWallet] = useState('');
  const [processing, setProcessing] = useState(false);
  const [transactionResult, setTransactionResult] = useState<{success: boolean, txSignature?: string, error?: string} | null>(null);
  
  // Monitor changes in the error state from the hook
  useEffect(() => {
    if (error) {
      console.error('Payment error from hook:', error);
      toast.error(`Payment error: ${error}`);
    }
  }, [error]);

  const handleProcessPayment = async () => {
    if (!payrollAddress || !employeeId || !employeeWallet || !paymentToken) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setProcessing(true);
      setTransactionResult(null);
      
      // Validate inputs
      if (!publicKey) {
        throw new Error('Wallet not connected');
      }
      
      console.log('Processing payment with the following details:');
      console.log('- Payroll Address:', payrollAddress);
      console.log('- Employee ID:', employeeId);
      console.log('- Employee Wallet:', employeeWallet);
      console.log('- Payment Token:', paymentToken);
      
      // Convert string addresses to PublicKey objects
      const payrollPubkey = new PublicKey(payrollAddress);
      const employeeWalletPubkey = new PublicKey(employeeWallet);
      const paymentTokenPubkey = new PublicKey(paymentToken);
      
      // Find the employee PDA
      console.log('Finding employee PDA...');
      const employeePDA = await findEmployeeAddress(payrollPubkey, employeeId);
      
      if (!employeePDA) {
        throw new Error('Could not derive employee account');
      }
      console.log('Employee PDA found:', employeePDA.toString());
      
      // Process payment
      console.log('Sending transaction to Phantom wallet...');
      toast.info('Please approve the transaction in your Phantom wallet');
      
      const result = await processPayment(
        payrollPubkey,
        employeeId,
        employeePDA,
        employeeWalletPubkey,
        paymentTokenPubkey
      );
      
      setTransactionResult(result || { success: false, error: 'No result returned' });
      
      if (result?.success) {
        toast.success('Payment processed successfully!');
        toast.info(`Transaction signature: ${result.txSignature}`);
        
        // Clear the form
        setEmployeeId('');
        setEmployeeWallet('');
      } else {
        toast.error(`Failed to process payment: ${result?.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setTransactionResult({ success: false, error: errorMessage });
      toast.error(`Payment processing failed: ${errorMessage}`);
    } finally {
      setProcessing(false);
    }
  };

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Process Payment</CardTitle>
          <CardDescription>You need to connect your wallet first</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="text-center">
            <p className="mb-4">Connect your Phantom wallet to process payments</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!payrollAddress || !paymentToken) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Process Payment</CardTitle>
          <CardDescription>You need to initialize a payroll first</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="text-center">
            <p className="mb-4">Please go to the Initialize tab to set up your payroll</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Process Employee Payment</CardTitle>
        <CardDescription>
          Process a payment for an employee
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              placeholder="Enter the employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="employeeWallet">Employee Wallet</Label>
            <Input
              id="employeeWallet"
              placeholder="Enter the employee wallet address"
              value={employeeWallet}
              onChange={(e) => setEmployeeWallet(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleProcessPayment} 
            disabled={loading || processing || !employeeId || !employeeWallet}
            className="relative"
          >
            {(loading || processing) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {loading || processing ? 'Processing...' : 'Process Payment'}
          </Button>
        </div>
      </CardContent>
      
      {transactionResult && (
        <CardFooter className="flex flex-col items-start border-t p-4">
          <h3 className="font-semibold mb-2">Transaction Result:</h3>
          {transactionResult.success ? (
            <div className="text-green-500">
              <p>Success! Transaction signature:</p>
              <p className="font-mono text-xs break-all mt-1">{transactionResult.txSignature}</p>
            </div>
          ) : (
            <div className="text-red-500">
              <p>Transaction failed:</p>
              <p className="font-mono text-xs break-all mt-1">{transactionResult.error}</p>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default PaymentProcessor; 