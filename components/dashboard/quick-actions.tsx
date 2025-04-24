'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickAction } from "@/components/dashboard/quick-action";
import { UserPlus, PiggyBank, BarChart4, Cog } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddEmployeeDialog } from "@/components/employees/add-employee-dialog";
import { DepositFundsDialog } from "@/components/vault/deposit-funds-dialog";
import { ReportsDialog } from "@/components/reports/reports-dialog";

export function QuickActions() {
  const router = useRouter();
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showDepositFunds, setShowDepositFunds] = useState(false);
  const [showReports, setShowReports] = useState(false);

  return (
    <>
      <Card className="border border-[#2a2f3e] bg-[#1a2235]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <QuickAction 
              label="Add Employee" 
              icon={UserPlus} 
              onClick={() => setShowAddEmployee(true)}
              iconColor="text-blue-400"
              iconBgColor="bg-blue-500/10"
            />
            <QuickAction 
              label="Deposit Funds" 
              icon={PiggyBank} 
              onClick={() => setShowDepositFunds(true)}
              iconColor="text-emerald-400"
              iconBgColor="bg-emerald-500/10"
            />
            <QuickAction 
              label="View Reports" 
              icon={BarChart4} 
              onClick={() => setShowReports(true)}
              iconColor="text-indigo-400"
              iconBgColor="bg-indigo-500/10"
            />
            <QuickAction 
              label="Settings" 
              icon={Cog} 
              onClick={() => router.push('/settings')}
              iconColor="text-slate-400"
              iconBgColor="bg-slate-500/10"
            />
          </div>
        </CardContent>
      </Card>

      <AddEmployeeDialog 
        open={showAddEmployee} 
        onOpenChange={setShowAddEmployee} 
      />
      
      <DepositFundsDialog 
        open={showDepositFunds} 
        onOpenChange={setShowDepositFunds} 
      />
      
      <ReportsDialog 
        open={showReports} 
        onOpenChange={setShowReports} 
      />
    </>
  );
}