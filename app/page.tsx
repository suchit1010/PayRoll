import { Card } from "@/components/ui/card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StatCard } from "@/components/dashboard/stat-card";
import { Users, PiggyBank, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/DashboardShell";

export default function Dashboard() {
  return (
    <DashboardShell>
      <div className="flex justify-between mb-8">
        <div>
          <h2 className="text-lg font-medium text-[#8a8f9d]">Welcome back,</h2>
          <p className="text-2xl font-bold text-white">John Smith</p>
        </div>
        <Button size="default" className="hidden bg-blue-600 hover:bg-blue-700 text-white md:inline-flex">
          Process Payroll
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        <StatCard
          title="Total Employees"
          value="148"
          description="Active employees this month"
          icon={Users}
          iconBgColor="bg-blue-600"
        />
        
        <StatCard
          title="Payroll Vault Balance"
          value="$284,500.00"
          description="Available for next payroll"
          icon={PiggyBank}
          iconBgColor="bg-emerald-600"
        />
        
        <StatCard
          title="Last Payroll"
          value="$142,250.00"
          description="Processed on Apr 15, 2025"
          icon={DollarSign}
          iconBgColor="bg-amber-600"
        />
      </div>
      
      <Button size="default" className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white md:hidden">
        Process Payroll
      </Button>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivity />
        <QuickActions />
      </div>
    </DashboardShell>
  );
}