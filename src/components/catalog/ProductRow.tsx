"use client";

import React from "react";
import { flexRender, Row } from "@tanstack/react-table";
import { Product } from "./columns";

interface ProductRowProps {
  row: Row<Product>;
}

export const ProductRow = React.memo(function ProductRow({ row }: ProductRowProps) {
  const isSelected = row.getIsSelected();

  return (
    <tr
      className={`transition-colors duration-200 ${
        isSelected
          ? "bg-blue-100" // ✅ Highlight selected rows
          : row.index % 2 === 0
          ? "bg-white"
          : "bg-gray-50"
      } hover:bg-blue-50`}
    >
      {row.getVisibleCells().map((cell) => {
        const columnId = cell.column.id;

        return (
          <td
            key={cell.id}
            className={`px-3 py-2 border-b align-top whitespace-nowrap overflow-hidden text-ellipsis ${
              columnId === "sku" ? "font-mono text-xs text-gray-700" : ""
            }`}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
});
