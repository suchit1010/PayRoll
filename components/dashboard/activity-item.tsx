import { formatDateShort } from "@/lib/utils";

interface ActivityItemProps {
  title: string;
  date: Date;
  amount: string;
}

export function ActivityItem({ title, date, amount }: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between border-b border-[#2a2f3e] px-1 py-4 transition-colors duration-200 last:border-0 hover:bg-[#1e293b]/70 table-row-hover">
      <div>
        <p className="font-medium leading-tight text-white">{title}</p>
        <p className="mt-1 text-sm text-[#8a8f9d]">{formatDateShort(date)}</p>
      </div>
      <p className="font-medium tabular-nums text-white">{amount}</p>
    </div>
  );
}