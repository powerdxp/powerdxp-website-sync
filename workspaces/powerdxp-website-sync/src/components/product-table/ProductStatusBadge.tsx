// ==============================
// 🔧 ProductStatusBadge.tsx
// ==============================
import { cn } from "@/lib/utils";

interface Props {
  status: string;
}

export function ProductStatusBadge({ status }: Props) {
  const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold";
  const colors: Record<string, string> = {
    Synced: "bg-green-100 text-green-800 ring-1 ring-inset ring-green-300",
    Blocked: "bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-300",
    Error: "bg-red-100 text-red-800 ring-1 ring-inset ring-red-300",
  };

  return (
    <span className={cn(baseStyle, colors[status] || "bg-gray-100 text-gray-800 ring-gray-300")}>
      {status}
    </span>
  );
}
