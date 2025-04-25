"use client";

import { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("transactions");

  // Calculate total deposits and withdrawals
  const totalDeposits = transactions
    .filter(t => t.type === "deposit")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const totalWithdrawals = transactions
    .filter(t => t.type === "withdraw")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Payroll Vault" />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Payroll Vault</h2>
          <p className="text-sm text-muted-foreground">Manage your payroll funds and track transactions</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="border-[#1e293b] bg-gradient-to-br from-[#121a29] to-[#0f172a]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <PiggyBank className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="mt-2 text-3xl font-bold">$284,500.00</p>
              <p className="mt-1.5 text-xs text-muted-foreground">Available for payroll</p>
              
              <div className="mt-6 flex gap-2">
                <Button className="flex-1 gap-1 bg-emerald-600 hover:bg-emerald-700">
                  <ArrowUpRight className="h-4 w-4" />
                  Deposit
                </Button>
                <Button className="flex-1 gap-1 bg-blue-600 hover:bg-blue-700">
                  <ArrowDownLeft className="h-4 w-4" />
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-[#1e293b] bg-gradient-to-br from-[#121a29] to-[#0f172a]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Deposits</p>
                <div className="rounded-full bg-emerald-500/10 p-1.5">
                  <ArrowUp className="h-4 w-4 text-emerald-500" />
                </div>
              </div>
              <p className="mt-2 text-3xl font-bold">{formatCurrency(totalDeposits)}</p>
              <p className="mt-1.5 text-xs text-emerald-500">+{formatCurrency(150000)} this month</p>
              
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={60}>
                  <RechartsLineChart data={lineChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <Line 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="#10b981" 
                      strokeWidth={2} 
                      dot={false} 
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-[#1e293b] bg-gradient-to-br from-[#121a29] to-[#0f172a]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Withdrawals</p>
                <div className="rounded-full bg-amber-500/10 p-1.5">
                  <ArrowDown className="h-4 w-4 text-amber-500" />
                </div>
              </div>
              <p className="mt-2 text-3xl font-bold">{formatCurrency(totalWithdrawals)}</p>
              <p className="mt-1.5 text-xs text-amber-500">-{formatCurrency(142250)} this month</p>
              
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={60}>
                  <RechartsLineChart data={lineChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <Line 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="#f59e0b" 
                      strokeWidth={2} 
                      dot={false} 
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="bg-[#121a29]">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <Button variant="outline" size="sm" className="gap-1 border-[#1e293b] hover:bg-[#1e293b]">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
            
            <TabsContent value="transactions" className="mt-4">
              <Card className="border-[#1e293b] bg-[#0f172a]">
                <CardContent className="p-4 pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#1e293b] text-left text-sm text-muted-foreground">
                          <th className="pb-3 pl-4">Date</th>
                          <th className="pb-3">Description</th>
                          <th className="pb-3">Type</th>
                          <th className="pb-3 pr-4 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr 
                            key={transaction.id} 
                            className="border-b border-[#1e293b] last:border-0 hover:bg-[#121a29]/50"
                          >
                            <td className="py-4 pl-4 text-sm">
                              {formatDateShort(transaction.date)}
                            </td>
                            <td className="py-4 font-medium">
                              {transaction.description}
                            </td>
                            <td className="py-4">
                              <div className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                                transaction.type === "deposit" 
                                  ? "bg-emerald-500/10 text-emerald-500" 
                                  : "bg-amber-500/10 text-amber-500"
                              }`}>
                                {transaction.type === "deposit" ? (
                                  <ArrowUpRight className="h-3 w-3" />
                                ) : (
                                  <ArrowDownLeft className="h-3 w-3" />
                                )}
                                {transaction.type === "deposit" ? "Deposit" : "Withdrawal"}
                              </div>
                            </td>
                            <td className={`py-4 pr-4 text-right font-medium tabular-nums ${
                              transaction.type === "deposit" 
                                ? "text-emerald-500" 
                                : "text-amber-500"
                            }`}>
                              {transaction.type === "deposit" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-4">
              <Card className="border-[#1e293b] bg-[#0f172a]">
                <CardHeader>
                  <CardTitle>Transaction Analytics</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "#0f172a", 
                            border: "1px solid #1e293b",
                            borderRadius: "0.375rem",
                            color: "#f8fafc"
                          }} 
                          formatter={(value) => [formatCurrency(value as number), ""]}
                        />
                        <Legend />
                        <Bar 
                          dataKey="deposits" 
                          name="Deposits" 
                          fill="hsl(var(--chart-2))" 
                          radius={[4, 4, 0, 0]} 
                        />
                        <Bar 
                          dataKey="withdrawals" 
                          name="Withdrawals" 
                          fill="hsl(var(--chart-1))" 
                          radius={[4, 4, 0, 0]} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}