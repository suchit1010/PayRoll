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
    <Card className="border border-[#2a2f3e] bg-[#1a2235]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-white">Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-[#2a2f3e]">
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