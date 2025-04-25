import { CircuitBoard } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
        <CircuitBoard className="h-5 w-5 text-white" />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xl font-bold text-blue-600">INCO</span>
        <span className="text-lg text-gray-200">Payroll</span>
      </div>
    </div>
  );
}