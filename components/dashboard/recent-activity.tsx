import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityItem } from "@/components/dashboard/activity-item";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const activityData = [
  {
    id: 1,
    title: "Payroll Processed",
    date: new Date("2025-04-14"),
    amount: "$142,250.00",
  },
  {
    id: 2,
    title: "Payroll Processed",
    date: new Date("2025-04-13"),
    amount: "$142,250.00",
  },
  {
    id: 3,
    title: "Payroll Processed",
    date: new Date("2025-04-12"),
    amount: "$142,250.00",
  },
];

export function RecentActivity() {
  return (
    <Card className="border-[#1e293b] bg-[#0f172a]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs text-blue-500">
          View all <ChevronRight className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {activityData.map((activity) => (
            <ActivityItem
              key={activity.id}
              title={activity.title}
              date={activity.date}
              amount={activity.amount}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}