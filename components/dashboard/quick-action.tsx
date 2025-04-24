import { DivideIcon as LucideIcon, LucideIcon as LucideIconType } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  label: string;
  icon: LucideIconType;
  onClick?: () => void;
  className?: string;
  iconColor?: string;
  iconBgColor?: string;
}

export function QuickAction({ 
  label, 
  icon: Icon, 
  onClick, 
  className,
  iconColor = "text-blue-500",
  iconBgColor = "bg-blue-600/10" 
}: QuickActionProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "flex h-full min-h-[120px] w-full flex-col gap-3 border border-[#2a2f3e] bg-[#1e293b] p-4 transition-all duration-300 hover:border-blue-800/50 hover:bg-[#232b3e] hover:shadow-lg hover:shadow-blue-900/10",
        className
      )}
      onClick={onClick}
    >
      <div className={cn("rounded-full p-3", iconBgColor)}>
        <Icon className={cn("h-6 w-6", iconColor)} />
      </div>
      <span className="text-sm font-medium text-white">{label}</span>
    </Button>
  );
}