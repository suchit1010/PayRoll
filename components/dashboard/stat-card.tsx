import { DivideIcon as LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  iconColor?: string;
  iconBgColor?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  className,
  iconBgColor = "bg-blue-600",
}: StatCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden border-[#1e293b] bg-gradient-to-br from-[#121a29] to-[#0f172a] transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10", 
      className
    )}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
            {description && (
              <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {Icon && (
            <div className={cn("rounded-full p-2.5", iconBgColor)}>
              <Icon className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}