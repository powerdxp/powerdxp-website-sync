import { ColumnMeta } from "@tanstack/react-table";
import type { Product } from "@/components/catalog/columns";

// ✅ Tell TypeScript about our custom column meta shape
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends unknown, TValue> {
    filterType?: "text" | "range" | "dropdown" | "date" | "image";
  }
}
