"use client";

import React, { useState } from "react";
import { flexRender, Row } from "@tanstack/react-table";
import { Product } from "./columns";
import { Button } from "@/components/ui/button";
import { pushToShopify } from "@/lib/shopify/pushToShopify";

interface ProductRowProps {
  row: Row<Product>;
}

export const ProductRow = React.memo(function ProductRow({ row }: ProductRowProps) {
  const [isPushing, setIsPushing] = useState(false);
  const product = row.original;

  const handlePush = async () => {
    setIsPushing(true);
    const result = await pushToShopify([product.sku]);
    setIsPushing(false);

    if (result === "success") {
      alert(`✅ ${product.sku} synced to Shopify!`);
    } else {
      alert(`❌ Failed to sync ${product.sku}`);
    }
  };

  return (
    <tr className="transition-colors duration-200 hover:bg-blue-50 odd:bg-white even:bg-gray-50">
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

      {/* Push Button Column */}
      <td className="px-3 py-2 border-b text-right">
        {product.synced_to_shopify ? (
          <span className="text-green-600 font-semibold text-sm">✅ Synced</span>
        ) : (
          <Button size="sm" disabled={isPushing} onClick={handlePush}>
            {isPushing ? "Syncing..." : "Push to Shopify"}
          </Button>
        )}
      </td>
    </tr>
  );
});
