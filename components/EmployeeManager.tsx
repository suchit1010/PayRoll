'use client';

import { useState, FC } from 'react';
import { usePayrollProgram } from '@/hooks/usePayrollProgram';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface EmployeeManagerProps {
  payrollAddress?: string;
}

export const EmployeeManager: FC<EmployeeManagerProps> = ({ payrollAddress }) => {
  const { connected } = useWallet();
  const { addEmployee, loading, error } = usePayrollProgram();
  const [employeeId, setEmployeeId] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [salaryAmount, setSalaryAmount] = useState('');
  const [paymentFrequency, setPaymentFrequency] = useState<'Weekly' | 'BiWeekly' | 'Monthly'>('Monthly');

  const handleAddEmployee = async () => {
    if (!payrollAddress || !employeeId || !walletAddress || !salaryAmount) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // Validate the wallet address is a valid public key
      const employeeWallet = new PublicKey(walletAddress);
      const payrollPubkey = new PublicKey(payrollAddress);
      
      const result = await addEmployee(
        payrollPubkey,
        employeeId,
        employeeWallet,
        parseInt(salaryAmount),
        paymentFrequency
      );
      
      if (result?.success) {
        toast.success('Employee added successfully!');
        toast.info(`Employee Address: ${result.employeeAddress?.toString()}`);
        
        // Clear the form
        setEmployeeId('');
        setWalletAddress('');
        setSalaryAmount('');
      } else {
        toast.error('Failed to add employee');
      }
    } catch (err) {
      toast.error('Invalid wallet address');
      console.error(err);
    }
  };

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Add Employee</CardTitle>
          <CardDescription>You need to connect your wallet first</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!payrollAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Add Employee</CardTitle>
          <CardDescription>You need to initialize a payroll first</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Employee</CardTitle>
        <CardDescription>
          Add an employee to your payroll
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              placeholder="Enter a unique employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="walletAddress">Wallet Address</Label>
            <Input
              id="walletAddress"
              placeholder="Enter the employee's wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="salaryAmount">Salary Amount</Label>
            <Input
              id="salaryAmount"
              type="number"
              placeholder="Enter the salary amount"
              value={salaryAmount}
              onChange={(e) => setSalaryAmount(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="paymentFrequency">Payment Frequency</Label>
            <Select 
              value={paymentFrequency} 
              onValueChange={(value: string) => setPaymentFrequency(value as 'Weekly' | 'BiWeekly' | 'Monthly')}
            >
              <SelectTrigger id="paymentFrequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="BiWeekly">Bi-Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleAddEmployee} 
            disabled={loading || !employeeId || !walletAddress || !salaryAmount}
          >
            {loading ? 'Adding...' : 'Add Employee'}
          </Button>
          
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeManager; 