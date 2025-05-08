// /src/lib/utils/filterFns.ts
import { FilterFn } from "@tanstack/react-table";

// ✅ Text-based filter with match modes
export const fuzzyText: FilterFn<any> = (row, columnId, filterValue) => {
  const cellValue = (row.getValue<string>(columnId) || "").trim();

  if (typeof filterValue === "object" && filterValue !== null) {
    const { value, mode } = filterValue;

    switch (mode) {
      case "isEmpty":
        return cellValue === "";
      case "isNotEmpty":
        return cellValue !== "";
      case "equals":
        return cellValue.toLowerCase() === value.toLowerCase();
      case "notEquals":
        return cellValue.toLowerCase() !== value.toLowerCase();
      case "startsWith":
        return cellValue.toLowerCase().startsWith(value.toLowerCase());
      case "contains":
      default:
        return cellValue.toLowerCase().includes(value.toLowerCase());
    }
  }

  return cellValue.toLowerCase().includes(String(filterValue).toLowerCase());
};

// ✅ Number range filter (min & max)
export const range: FilterFn<any> = (row, columnId, filterValue) => {
  const val = row.getValue<number>(columnId);
  const min = parseFloat(filterValue?.min);
  const max = parseFloat(filterValue?.max);
  if (filterValue.min && val < min) return false;
  if (filterValue.max && val > max) return false;
  return true;
};

// ✅ Dropdown filter (e.g. Blocked/Unblocked, Status, Visibility)
export const dropdown: FilterFn<any> = (row, columnId, value) => {
  const cellValue = String(row.getValue(columnId));
  if (value === "All") return true;
  if (value === "Blocked") return cellValue === "true";
  if (value === "Unblocked") return cellValue === "false";
  return cellValue === value;
};

// ✅ Date range filter (From/To)
export const dateRange: FilterFn<any> = (row, columnId, value) => {
  const cellDate = new Date(row.getValue<string>(columnId));
  if (value.from && cellDate < new Date(value.from)) return false;
  if (value.to && cellDate > new Date(value.to)) return false;
  return true;
};

// ✅ Image count-based filter
export const image: FilterFn<any> = (row, columnId, value) => {
  const count = row.getValue<number>("imageCount");
  if (value === "noImage") return count === 0;
  if (value === "atLeastOne") return count >= 1;
  if (value === "twoOrMore") return count >= 2;
  return true;
};
