'use client';

import { useState, FC } from 'react';
import { usePayrollProgram } from '@/hooks/usePayrollProgram';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface PayrollInitializerProps {
  onPayrollInitialized?: (address: string, token: string) => void;
}

export const PayrollInitializer: FC<PayrollInitializerProps> = ({ onPayrollInitialized }) => {
  const { connected } = useWallet();
  const { initializePayroll, loading, error } = usePayrollProgram();
  const [payrollId, setPayrollId] = useState('');
  const [paymentToken, setPaymentToken] = useState('');

  const handleInitializePayroll = async () => {
    if (!payrollId || !paymentToken) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // Validate the payment token is a valid public key
      const paymentTokenPubkey = new PublicKey(paymentToken);
      
      const result = await initializePayroll(payrollId, paymentTokenPubkey);
      
      if (result?.success) {
        toast.success('Payroll initialized successfully!');
        toast.info(`Payroll Address: ${result.payrollAddress?.toString()}`);
        toast.info(`Vault Address: ${result.vaultAddress?.toString()}`);
        
        // Call the callback with the payroll address and payment token
        if (onPayrollInitialized && result.payrollAddress) {
          onPayrollInitialized(result.payrollAddress.toString(), paymentToken);
        }
      } else {
        toast.error('Failed to initialize payroll');
      }
    } catch (err) {
      toast.error('Invalid payment token address');
      console.error(err);
    }
  };

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Initialize Payroll</CardTitle>
          <CardDescription>You need to connect your wallet first</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Initialize New Payroll</CardTitle>
        <CardDescription>
          Create a new payroll by providing a unique ID and payment token
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="payrollId">Payroll ID</Label>
            <Input
              id="payrollId"
              placeholder="Enter a unique payroll ID"
              value={payrollId}
              onChange={(e) => setPayrollId(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="paymentToken">Payment Token</Label>
            <Input
              id="paymentToken"
              placeholder="Enter the payment token address"
              value={paymentToken}
              onChange={(e) => setPaymentToken(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleInitializePayroll} 
            disabled={loading || !payrollId || !paymentToken}
          >
            {loading ? 'Initializing...' : 'Initialize Payroll'}
          </Button>
          
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollInitializer; 