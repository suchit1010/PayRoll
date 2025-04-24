"use client";

import { useState, Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, LineChart, DollarSign, Download, PiggyBank, ArrowUp, ArrowDown } from "lucide-react";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  Legend,
} from "recharts";
import WalletConnectButton from '@/components/WalletConnectButton';
import PayrollInitializer from '@/components/PayrollInitializer';
import EmployeeManager from '@/components/EmployeeManager';
import PaymentProcessor from '@/components/PaymentProcessor';
import { Toaster } from 'sonner';

interface Transaction {
  id: number;
  date: Date;
  type: "deposit" | "withdraw";
  description: string;
  amount: number;
}

const transactions: Transaction[] = [
  { id: 1, date: new Date("2025-04-15"), type: "withdraw", description: "Payroll Processing", amount: 142250 },
  { id: 2, date: new Date("2025-04-10"), type: "deposit", description: "Funds Transfer", amount: 150000 },
  { id: 3, date: new Date("2025-04-01"), type: "withdraw", description: "Payroll Processing", amount: 142250 },
  { id: 4, date: new Date("2025-03-25"), type: "deposit", description: "Funds Transfer", amount: 150000 },
  { id: 5, date: new Date("2025-03-15"), type: "withdraw", description: "Payroll Processing", amount: 139500 },
  { id: 6, date: new Date("2025-03-10"), type: "deposit", description: "Funds Transfer", amount: 150000 },
  { id: 7, date: new Date("2025-03-01"), type: "withdraw", description: "Payroll Processing", amount: 139500 },
  { id: 8, date: new Date("2025-02-25"), type: "deposit", description: "Funds Transfer", amount: 140000 },
];

const chartData = [
  { name: "Jan", deposits: 580000, withdrawals: 558000 },
  { name: "Feb", deposits: 590000, withdrawals: 562000 },
  { name: "Mar", deposits: 600000, withdrawals: 579000 },
  { name: "Apr", deposits: 450000, withdrawals: 284500 },
];

const lineChartData = [
  { name: "Jan", balance: 22000 },
  { name: "Feb", balance: 50000 },
  { name: "Mar", balance: 71000 },
  { name: "Apr", balance: 284500 },
];

export default function PayrollVaultPage() {
  const [payrollAddress, setPayrollAddress] = useState<string | undefined>();
  const [paymentToken, setPaymentToken] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState('initialize');

  // Calculate total deposits and withdrawals
  const totalDeposits = transactions
    .filter(t => t.type === "deposit")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const totalWithdrawals = transactions
    .filter(t => t.type === "withdraw")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  // Callback to receive the payroll address after initialization
  const handlePayrollInitialized = (address: string, token: string) => {
    setPayrollAddress(address);
    setPaymentToken(token);
    setActiveTab('employees'); // Switch to the employees tab after initialization
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">Payroll Vault</h1>
          <p className="text-muted-foreground mt-2">
            Manage your payroll vaults on the Solana blockchain
          </p>
        </div>
        <WalletConnectButton />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="initialize">Initialize</TabsTrigger>
          <TabsTrigger value="employees" disabled={!payrollAddress}>Employees</TabsTrigger>
          <TabsTrigger value="payments" disabled={!payrollAddress}>Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="initialize" className="mt-6">
          <Suspense fallback={<div>Loading...</div>}>
            <PayrollInitializer onPayrollInitialized={handlePayrollInitialized} />
          </Suspense>
        </TabsContent>

        <TabsContent value="employees" className="mt-6">
          <Suspense fallback={<div>Loading...</div>}>
            <EmployeeManager payrollAddress={payrollAddress} />
          </Suspense>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Suspense fallback={<div>Loading...</div>}>
            <PaymentProcessor 
              payrollAddress={payrollAddress}
              paymentToken={paymentToken}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
      
      <Toaster position="top-right" />
    </div>
  );
}