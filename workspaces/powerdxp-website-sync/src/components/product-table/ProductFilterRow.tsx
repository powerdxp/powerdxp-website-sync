"use client";

import React, { useCallback } from "react";
import { Table } from "@tanstack/react-table";

interface ProductFilterRowProps {
  table: Table<any>;
  filterValues: Record<string, any>;
  setFilterValues: (key: string, value: any) => void;
}

export const ProductFilterRow = React.memo(function ProductFilterRow({
  table,
  filterValues,
  setFilterValues,
}: ProductFilterRowProps) {
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
    const value = filterValues[id] || "";

    switch (filterType) {
      case "text":
        return (
          <input
            type="text"
            placeholder="Search..."
            value={value}
            onChange={(e) => handleChange(id, e.target.value)}
            className={`border px-2 py-1 rounded text-xs w-full transition ${
              value ? activeStyle : "border-gray-300"
            }`}
          />
        );
      case "range":
        return (
          <div className="flex gap-1">
            <input
              type="number"
              placeholder="Min"
              value={value?.min || ""}
              onChange={(e) => handleChange(id, { ...value, min: e.target.value })}
              className={`border px-2 py-1 rounded text-xs w-1/2 transition ${
                value?.min ? activeStyle : "border-gray-300"
              }`}
            />
            <input
              type="number"
              placeholder="Max"
              value={value?.max || ""}
              onChange={(e) => handleChange(id, { ...value, max: e.target.value })}
              className={`border px-2 py-1 rounded text-xs w-1/2 transition ${
                value?.max ? activeStyle : "border-gray-300"
              }`}
            />
          </div>
        );
      case "dropdown":
        return (
          <select
            value={value}
            onChange={(e) => handleChange(id, e.target.value)}
            className={`border px-2 py-1 rounded text-xs w-full transition ${
              value && value !== "All" ? activeStyle : "border-gray-300"
            }`}
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Visible">Visible</option>
            <option value="Hidden">Hidden</option>
            <option value="Blocked">Blocked</option>
            <option value="Unblocked">Unblocked</option>
          </select>
        );
      case "date":
        return (
          <div className="flex flex-col gap-1">
            <input
              type="date"
              value={value?.from || ""}
              onChange={(e) => handleChange(id, { ...value, from: e.target.value })}
              className={`border px-2 py-1 rounded text-xs w-full transition ${
                value?.from ? activeStyle : "border-gray-300"
              }`}
            />
            <input
              type="date"
              value={value?.to || ""}
              onChange={(e) => handleChange(id, { ...value, to: e.target.value })}
              className={`border px-2 py-1 rounded text-xs w-full transition ${
                value?.to ? activeStyle : "border-gray-300"
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
            <option value="All">All</option>
            <option value="HasImage">Has Image</option>
            <option value="NoImage">No Image</option>
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <tr className="bg-gray-100 text-xs border-b border-gray-300">
      {table.getAllLeafColumns().map((column) => (
        <th key={column.id} className="px-2 py-2 min-w-[80px]">
          {renderFilter(column)}
        </th>
      ))}
    </tr>
  );
});
