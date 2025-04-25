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
      <Card className="border-[#1e293b] bg-[#0f172a]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <QuickAction 
              label="Add Employee" 
              icon={UserPlus} 
              onClick={() => setShowAddEmployee(true)}
            />
            <QuickAction 
              label="Deposit Funds" 
              icon={PiggyBank} 
              onClick={() => setShowDepositFunds(true)}
            />
            <QuickAction 
              label="View Reports" 
              icon={BarChart4} 
              onClick={() => setShowReports(true)}
            />
            <QuickAction 
              label="Settings" 
              icon={Cog} 
              onClick={() => router.push('/settings')}
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