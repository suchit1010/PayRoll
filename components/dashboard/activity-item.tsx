import { formatDateShort } from "@/lib/utils";

interface ActivityItemProps {
  title: string;
  date: Date;
  amount: string;
}

export function ActivityItem({ title, date, amount }: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between border-b border-[#1e293b] px-1 py-4 transition-colors duration-200 last:border-0 hover:bg-[#121a29]/50">
      <div>
        <p className="font-medium leading-tight">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{formatDateShort(date)}</p>
      </div>
      <p className="font-medium tabular-nums">{amount}</p>
    </div>
  );
}