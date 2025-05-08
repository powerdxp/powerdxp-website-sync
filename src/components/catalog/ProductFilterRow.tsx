"use client";

import React, { useCallback, useState } from "react";
import { Table } from "@tanstack/react-table";

interface ProductFilterRowProps {
  table: Table<any>;
  filterValues: Record<string, any>;
  setFilterValues: (key: string, value: any) => void;
}

const textMatchOptions = [
  { label: "Contains", value: "contains" },
  { label: "Starts With", value: "startsWith" },
  { label: "Equals", value: "equals" },
  { label: "Not Equals", value: "notEquals" },
  { label: "Is Empty", value: "isEmpty" },
  { label: "Is Not Empty", value: "isNotEmpty" },
];

const imageOptions = [
  { label: "All", value: "All" },
  { label: "No Image", value: "noImage" },
  { label: "At Least 1", value: "atLeastOne" },
  { label: "Two or More", value: "twoOrMore" },
];

// ✅ Updated with more dropdown options (like "Active"/"Inactive")
const dropdownOptions: Record<string, string[]> = {
  status: ["All", "Synced", "Incomplete", "Unreviewed", "Blocked"],
  visibility: ["All", "Visible", "Hidden"],
  blocked: ["All", "Blocked", "Unblocked"],
  active: ["All", "Active", "Inactive"],
  enabled: ["All", "Yes", "No"], // optional
};

export const ProductFilterRow = React.memo(function ProductFilterRow({
  table,
  filterValues,
  setFilterValues,
}: ProductFilterRowProps) {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const activeStyle = "border-blue-500 ring-1 ring-blue-300";

  const handleChange = useCallback(
    (id: string, value: any) => {
      setFilterValues(id, value);
    },
    [setFilterValues]
  );

  const renderFilter = (column: any) => {
    const id = column.id;
    const filterType = column.columnDef.meta?.filterType;
    const rawValue = filterValues[id];

    const value = typeof rawValue === "object" && rawValue !== null ? rawValue.value : rawValue;
    const matchMode = typeof rawValue === "object" ? rawValue.mode || "contains" : "contains";

    const showDropdown = focusedInput === id || value;

    switch (filterType) {
      case "text":
        return (
          <div className="flex flex-col gap-1">
            <select
              value={matchMode}
              onChange={(e) => handleChange(id, { value, mode: e.target.value })}
              className="text-xs border px-2 py-1 rounded bg-white"
            >
              {textMatchOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search..."
              value={value || ""}
              onFocus={() => setFocusedInput(id)}
              onBlur={() => setTimeout(() => setFocusedInput(null), 200)}
              onChange={(e) =>
                handleChange(id, { value: e.target.value, mode: matchMode })
              }
              className={`border px-2 py-1 rounded text-xs w-full transition ${
                value ? activeStyle : "border-gray-300"
              }`}
            />
          </div>
        );

      case "range":
        return (
          <div className="flex gap-1">
            <input
              type="number"
              placeholder="Min"
              value={rawValue?.min || ""}
              onChange={(e) => handleChange(id, { ...rawValue, min: e.target.value })}
              className={`border px-2 py-1 rounded text-xs w-1/2 transition ${
                rawValue?.min ? activeStyle : "border-gray-300"
              }`}
            />
            <input
              type="number"
              placeholder="Max"
              value={rawValue?.max || ""}
              onChange={(e) => handleChange(id, { ...rawValue, max: e.target.value })}
              className={`border px-2 py-1 rounded text-xs w-1/2 transition ${
                rawValue?.max ? activeStyle : "border-gray-300"
              }`}
            />
          </div>
        );

      case "dropdown":
        const options = dropdownOptions[id] || ["All", "Yes", "No"];
        return (
          <select
            value={value || "All"}
            onChange={(e) => handleChange(id, e.target.value)}
            className={`border px-2 py-1 rounded text-xs w-full transition ${
              value && value !== "All" ? activeStyle : "border-gray-300"
            }`}
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "date":
        return (
          <div className="flex flex-col gap-1">
            <input
              type="date"
              value={rawValue?.from || ""}
              onChange={(e) => handleChange(id, { ...rawValue, from: e.target.value })}
              className={`border px-2 py-1 rounded text-xs w-full transition ${
                rawValue?.from ? activeStyle : "border-gray-300"
              }`}
            />
            <input
              type="date"
              value={rawValue?.to || ""}
              onChange={(e) => handleChange(id, { ...rawValue, to: e.target.value })}
              className={`border px-2 py-1 rounded text-xs w-full transition ${
                rawValue?.to ? activeStyle : "border-gray-300"
              }`}
            />
          </div>
        );

      case "image":
        return (
          <select
            value={value || "All"}
            onChange={(e) => handleChange(id, e.target.value)}
            className={`border px-2 py-1 rounded text-xs w-full transition ${
              value !== "All" ? activeStyle : "border-gray-300"
            }`}
          >
            {imageOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <tr className="bg-gray-100 text-xs border-b border-gray-300 sticky top-[41px] z-[8]">
      {table.getAllLeafColumns().map((column) => (
        <th
          key={column.id}
          className="px-2 py-2 min-w-[80px] border border-gray-300 bg-gray-100 text-left align-top"
        >
          {renderFilter(column)}
        </th>
      ))}
    </tr>
  );
});
