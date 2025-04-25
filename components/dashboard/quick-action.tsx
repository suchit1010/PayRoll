import { DivideIcon as LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
}

export function QuickAction({ label, icon: Icon, onClick, className }: QuickActionProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "flex h-full min-h-[120px] w-full flex-col gap-3 border-[#1e293b] bg-gradient-to-br from-[#121a29] to-[#0f172a] p-4 transition-all duration-300 hover:border-blue-800/50 hover:bg-[#1e293b] hover:shadow-lg hover:shadow-blue-900/10",
        className
      )}
      onClick={onClick}
    >
      <div className="rounded-full bg-blue-600/10 p-3">
        <Icon className="h-6 w-6 text-blue-500" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
}