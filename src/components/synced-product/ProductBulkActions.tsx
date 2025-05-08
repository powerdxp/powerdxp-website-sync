"use client";

// ==============================
// 🔧 Imports
// ==============================
import { Button } from "@/components/ui/button";
import { pushToShopify } from "@/lib/shopify/pushToShopify";

// ==============================
// 📦 Props
// ==============================
interface ProductBulkActionsProps {
  selectedCount: number;
  selectedSkus: string[];
  onSelectFiltered: () => void;
  onDelete: () => void;
  onExport: () => void;
  onPushToShopify: () => void; // ✅ New callback
}

// ==============================
// 📦 Component
// ==============================
export function ProductBulkActions({
  selectedCount,
  selectedSkus,
  onSelectFiltered,
  onDelete,
  onExport,
  onPushToShopify,
}: ProductBulkActionsProps) {
  return (
    <div className="mb-4 bg-gray-100 rounded-md border border-gray-300 px-4 py-3 flex items-center justify-between shadow-sm">
      {/* 🧮 Count */}
      <span className="text-sm text-gray-700">
        {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
      </span>

      {/* 🧰 Buttons */}
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onSelectFiltered}>
          Select Filtered
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          Delete Selected
        </Button>
        <Button variant="outline" onClick={onExport}>
          Export Selected
        </Button>
        {/* ✅ Push to Shopify Button */}
        <Button
          variant="default"
          onClick={onPushToShopify}
          disabled={selectedCount === 0}
        >
          🛒 Push Selected to Shopify
        </Button>
      </div>
    </div>
  );
}
