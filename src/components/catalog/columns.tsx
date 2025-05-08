import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { getSyncStatus } from "@/lib/catalog/getSyncStatus";
import {
  fuzzyText,
  range,
  dropdown,
  dateRange,
  image,
} from "@/lib/utils/filterFns";
import { Lock, Unlock } from "lucide-react";
import { unlockField } from "@/lib/supabase/unlockField";

export type Product = {
  sku: string;
  title: string;
  title_locked?: boolean;
  description?: string;
  description_locked?: boolean;
  cost: number;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  map: number;
  quantity: number;
  brand: string;
  brand_locked?: boolean;
  vendor: string;
  vendor_locked?: boolean;
  distributor: string;
  weight: number;
  width: number;
  length: number;
  shippingCost: number;
  shippingCost_locked?: boolean;
  imageCount: number;
  imageUrl?: string;
  visibility: string;
  blocked: boolean;
  lastUpdated: string;
  createdAt: string;
  upc?: string;
  upc_locked?: boolean;
  asin?: string;
  approved_for_sync?: boolean;
  product_type?: string;
  product_type_locked?: boolean;
  tags?: string;
  tags_locked?: boolean;
  meta_title?: string;
  meta_title_locked?: boolean;
  meta_description?: string;
  meta_description_locked?: boolean;
};

const editableCell = (field: keyof Product, lockKey?: keyof Product) => {
  return ({ row }: any) => {
    const [editing, setEditing] = React.useState(false);
    const [value, setValue] = React.useState(row.original[field] ?? "");
    const [saving, setSaving] = React.useState(false);
    const [unlocked, setUnlocked] = React.useState(false);
    const isLocked = lockKey && row.original[lockKey] && !unlocked;

    const handleSave = async () => {
      setSaving(true);
      try {
        const res = await fetch("/api/products/update-field", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sku: row.original.sku,
            field,
            value,
          }),
        });
        if (!res.ok) throw new Error("Failed to save");
        setEditing(false);
      } catch {
        alert("Failed to save value.");
      } finally {
        setSaving(false);
      }
    };

    const handleUnlock = async () => {
      const result = await unlockField({ sku: row.original.sku, field: field as string });
      if (result.success) {
        setUnlocked(true);
      }
    };

    return (
      <div
        className={`group relative w-full px-1 ${
          isLocked ? "bg-gray-50 text-muted-foreground italic" : ""
        }`}
        onClick={() => setEditing(true)}
      >
        {isLocked && (
          <>
            <div className="absolute top-0 right-6 p-1 text-gray-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUnlock();
              }}
              className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Unlock field for sync updates"
            >
              <Unlock className="w-3.5 h-3.5 text-gray-400 hover:text-black" />
            </button>
          </>
        )}
        {editing ? (
          <div className="flex flex-col gap-1">
            <input
              className="w-full px-1 py-0.5 text-sm border rounded"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={saving}
            />
            <div className="flex gap-1">
              <button
                onClick={handleSave}
                className="px-2 py-0.5 text-xs bg-purple-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-2 py-0.5 text-xs border rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="cursor-pointer truncate">{String(value || "-")}</div>
        )}
      </div>
    );
  };
};

export function generateColumns(): ColumnDef<Product>[] {
  const lockable = (field: keyof Product) => `${field}_locked` as keyof Product;

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      id: "imageUrl",
      accessorKey: "imageUrl",
      header: "Image",
      size: 100,
      meta: { filterType: "image" },
      filterFn: image,
      enableColumnFilter: true,
      cell: ({ getValue }) => {
        const url = getValue() as string | undefined;
        return url ? (
          <img src={url} alt="product" className="w-10 h-10 object-cover rounded" />
        ) : (
          <span className="text-muted-foreground italic">No Image</span>
        );
      },
    },
    {
      id: "sku",
      accessorKey: "sku",
      header: "SKU",
      size: 120,
      meta: { filterType: "text" },
      filterFn: fuzzyText,
      enableColumnFilter: true,
    },

    { id: "title", accessorKey: "title", header: "Title", size: 200, cell: editableCell("title", lockable("title")), meta: { filterType: "text" }, filterFn: fuzzyText, enableColumnFilter: true },
    { id: "description", accessorKey: "description", header: "Description", size: 240, cell: editableCell("description", lockable("description")), meta: { filterType: "text" }, filterFn: fuzzyText, enableColumnFilter: true },
    { id: "brand", accessorKey: "brand", header: "Brand", size: 140, cell: editableCell("brand", lockable("brand")), meta: { filterType: "text" }, filterFn: fuzzyText, enableColumnFilter: true },
    { id: "vendor", accessorKey: "vendor", header: "Vendor", size: 140, cell: editableCell("vendor", lockable("vendor")), meta: { filterType: "text" }, filterFn: fuzzyText, enableColumnFilter: true },
    { id: "product_type", accessorKey: "product_type", header: "Product Type", size: 160, cell: editableCell("product_type", lockable("product_type")), meta: { filterType: "text" }, filterFn: fuzzyText, enableColumnFilter: true },
    { id: "tags", accessorKey: "tags", header: "Tags", size: 140, cell: editableCell("tags", lockable("tags")), meta: { filterType: "text" }, filterFn: fuzzyText, enableColumnFilter: true },
    { id: "meta_title", accessorKey: "meta_title", header: "Meta Title", size: 160, cell: editableCell("meta_title", lockable("meta_title")), meta: { filterType: "text" }, filterFn: fuzzyText, enableColumnFilter: true },
    { id: "meta_description", accessorKey: "meta_description", header: "Meta Description", size: 200, cell: editableCell("meta_description", lockable("meta_description")), meta: { filterType: "text" }, filterFn: fuzzyText, enableColumnFilter: true },
    { id: "upc", accessorKey: "upc", header: "UPC", size: 140, cell: editableCell("upc", lockable("upc")), meta: { filterType: "text" }, filterFn: fuzzyText, enableColumnFilter: true },
    { id: "shippingCost", accessorKey: "shippingCost", header: "Shipping ($)", size: 120, cell: editableCell("shippingCost", lockable("shippingCost")), meta: { filterType: "range" }, filterFn: range, enableColumnFilter: true },

    { id: "cost", accessorKey: "cost", header: "Cost", size: 100, meta: { filterType: "range" }, filterFn: range, enableColumnFilter: true, cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}` },
    { id: "price", accessorKey: "price", header: "Price", size: 100, meta: { filterType: "range" }, filterFn: range, enableColumnFilter: true, cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}` },
    { id: "map", accessorKey: "map", header: "MAP", size: 100, meta: { filterType: "range" }, filterFn: range, enableColumnFilter: true, cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}` },
    { id: "quantity", accessorKey: "quantity", header: "Quantity", size: 100, meta: { filterType: "range" }, filterFn: range, enableColumnFilter: true },
    { id: "imageCount", accessorKey: "imageCount", header: "Image Count", size: 100, meta: { filterType: "range" }, filterFn: range, enableColumnFilter: true },
    { id: "blocked", accessorKey: "blocked", header: "Blocked", size: 80, meta: { filterType: "dropdown" }, filterFn: dropdown, enableColumnFilter: true, cell: React.memo(({ getValue }) => <Checkbox checked={getValue() as boolean} />) },
    { id: "distributor", accessorKey: "distributor", header: "Distributor", size: 140, meta: { filterType: "text" }, filterFn: fuzzyText, enableColumnFilter: true },
    { id: "asin", accessorKey: "asin", header: "ASIN", size: 140, meta: { filterType: "text" }, filterFn: fuzzyText, enableColumnFilter: true },
    { id: "weight", accessorKey: "weight", header: "Weight (lbs)", size: 100, meta: { filterType: "range" }, filterFn: range, enableColumnFilter: true },
    { id: "width", accessorKey: "width", header: "Width (in)", size: 100, meta: { filterType: "range" }, filterFn: range, enableColumnFilter: true },
    { id: "length", accessorKey: "length", header: "Length (in)", size: 100, meta: { filterType: "range" }, filterFn: range, enableColumnFilter: true },
    {
      id: "status",
      header: "Status",
      size: 140,
      meta: { filterType: "dropdown" },
      filterFn: dropdown,
      enableColumnFilter: true,
      accessorFn: (row) => getSyncStatus(row).status,
      cell: ({ row }) => {
        const { status } = getSyncStatus(row.original);
        const color =
          status === "✅ Synced" ? "bg-green-100 text-green-800" :
          status === "❌ No-Synced" ? "bg-red-100 text-red-800" :
          status === "🟡 Incomplete" ? "bg-yellow-100 text-yellow-800" :
          "text-gray-400";
        return <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>{status || "—"}</span>;
      },
    },
    { id: "visibility", accessorKey: "visibility", header: "Visibility", size: 120, meta: { filterType: "dropdown" }, filterFn: dropdown, enableColumnFilter: true },
    {
      id: "lastUpdated",
      accessorKey: "lastUpdated",
      header: "Last Updated",
      size: 120,
      meta: { filterType: "date" },
      filterFn: dateRange,
      enableColumnFilter: true,
      cell: ({ getValue }) => {
        const value = getValue() as string;
        const parsedDate = new Date(value);
        return parsedDate instanceof Date && !isNaN(parsedDate.getTime())
          ? format(parsedDate, "MM/dd/yyyy")
          : "Invalid Date";
      },
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Created Date",
      size: 120,
      meta: { filterType: "date" },
      filterFn: dateRange,
      enableColumnFilter: true,
      cell: ({ getValue }) => {
        const value = getValue() as string;
        const parsedDate = new Date(value);
        return parsedDate instanceof Date && !isNaN(parsedDate.getTime())
          ? format(parsedDate, "MM/dd/yyyy")
          : "Invalid Date";
      },
    },
    {
      id: "status_notes",
      header: "Status Notes",
      size: 300,
      accessorFn: (row) => getSyncStatus(row).notes.join(", "),
      meta: { filterType: "text" },
      filterFn: fuzzyText,
      enableColumnFilter: true,
      cell: ({ row }) => {
        const { notes } = getSyncStatus(row.original);
        return notes.length > 0 ? (
          <div className="text-xs text-muted-foreground">{notes.join(", ")}</div>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        );
      },
    },
  ];
}
