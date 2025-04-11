"use client";

// ==============================
// 🔧 Imports
// ==============================
import { Button } from "@/components/ui/button";

interface ProductBulkActionsProps {
  selectedCount: number;
  onSelectFiltered: () => void;
  onDelete: () => void;
  onExport: () => void;
}

// ==============================
// 📦 Component
// ==============================
export function ProductBulkActions({
  selectedCount,
  onSelectFiltered,
  onDelete,
  onExport,
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
      </div>
    </div>
  );
}