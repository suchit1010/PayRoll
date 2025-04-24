"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface ReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const payrollData = [
  { month: "Jan", amount: 142250 },
  { month: "Feb", amount: 139500 },
  { month: "Mar", amount: 145000 },
  { month: "Apr", amount: 142250 },
];

const departmentData = [
  { name: "Engineering", employees: 45, budget: 380000 },
  { name: "Marketing", employees: 28, budget: 220000 },
  { name: "Sales", employees: 32, budget: 280000 },
  { name: "Support", employees: 24, budget: 180000 },
  { name: "HR", employees: 12, budget: 95000 },
];

export function ReportsDialog({ open, onOpenChange }: ReportsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-[#0f172a] border-[#1e293b]">
        <DialogHeader>
          <DialogTitle>Reports & Analytics</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="payroll" className="w-full">
          <TabsList>
            <TabsTrigger value="payroll">Payroll History</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payroll">
            <Card className="border-[#1e293b]">
              <div className="h-[300px] w-full p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={payrollData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: "0.375rem",
                        color: "#f8fafc"
                      }}
                      formatter={(value) => [formatCurrency(value as number), "Amount"]}
                    />
                    <Bar dataKey="amount" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="departments">
            <Card className="border-[#1e293b]">
              <div className="h-[300px] w-full p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
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
                      formatter={(value, name) => [
                        name === "budget" ? formatCurrency(value as number) : value,
                        name === "budget" ? "Budget" : "Employees"
                      ]}
                    />
                    <Bar dataKey="employees" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="budget" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}