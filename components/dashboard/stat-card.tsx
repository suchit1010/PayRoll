import { DivideIcon as LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: typeof LucideIcon;
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
      "overflow-hidden border border-[#2a2f3e] bg-[#1a2235] transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10 card-hover", 
      className
    )}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[#8a8f9d]">{title}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</p>
            {description && (
              <p className="mt-1.5 text-xs text-[#8a8f9d]">{description}</p>
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