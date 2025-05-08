import React from "react";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { AvailableFromCell } from "./AvailableFromCell";

// ✅ Enhanced Product type with lock flags
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
  imageCount: number;
  imageUrl?: string;
  status: string;
  visibility: string;
  blocked: boolean;
  lastUpdated: string;
  createdAt: string;
  upc?: string;
  upc_locked?: boolean;
  asin?: string;

  // ✅ Sync tracking
  approved_for_shopify: boolean;
  synced_to_shopify: boolean;
};

// 🔧 Utility for showing lock icon next to locked fields
function LockableCell({
  value,
  locked,
}: {
  value: string | number | undefined;
  locked?: boolean;
}) {
  return (
    <span className="flex items-center gap-1">
      {value ?? "-"}
      {locked && <span title="Locked" className="text-xs">🔒</span>}
    </span>
  );
}

export function generateColumns(): ColumnDef<Product>[] {
  return [
    // ✅ Select checkbox
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
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

    // ✅ Image column
    {
      id: "imageUrl",
      accessorKey: "imageUrl",
      header: "Image",
      cell: ({ getValue }) => {
        const url = getValue() as string | undefined;
        return url ? (
          <img
            src={url}
            alt="product"
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <span className="text-muted-foreground italic">No Image</span>
        );
      },
      size: 100,
      meta: { filterType: "image" },
      filterFn: "image" as unknown as FilterFn<Product>,
      enableColumnFilter: true,
    },

    // 🔢 SKU
    {
      id: "sku",
      accessorKey: "sku",
      header: "SKU",
      size: 120,
      meta: { filterType: "text" },
      filterFn: "fuzzyText" as unknown as FilterFn<Product>,
      enableColumnFilter: true,
    },

    // 📝 Title (with lock support)
    {
      id: "title",
      accessorKey: "title",
      header: "Title",
      size: 200,
      meta: { filterType: "text" },
      filterFn: "fuzzyText" as unknown as FilterFn<Product>,
      enableColumnFilter: true,
      cell: ({ row }) =>
        LockableCell({
          value: row.original.title,
          locked: row.original.title_locked,
        }),
    },

    // 🧾 Description (lock support optional)
    {
      id: "description",
      accessorKey: "description",
      header: "Description",
      size: 240,
      meta: { filterType: "text" },
      filterFn: "fuzzyText" as unknown as FilterFn<Product>,
      enableColumnFilter: true,
      cell: ({ row }) =>
        LockableCell({
          value:
            row.original.description?.slice(0, 60) +
            (row.original.description?.length > 60 ? "..." : ""),
          locked: row.original.description_locked,
        }),
    },

    // ✅ Pricing & Range Fields
    ...["cost", "price", "minPrice", "maxPrice", "map"].map((key) => ({
      id: key,
      accessorKey: key,
      header: key
        .replace("minPrice", "Min Price")
        .replace("maxPrice", "Max Price")
        .toUpperCase(),
      cell: ({ getValue }) => {
        const val = getValue() as number | undefined;
        return val !== undefined ? `$${val.toFixed(2)}` : "-";
      },
      size: 100,
      meta: { filterType: "range" },
      filterFn: "range" as unknown as FilterFn<Product>,
      enableColumnFilter: true,
    })),

    // 📦 Quantity
    {
      id: "quantity",
      accessorKey: "quantity",
      header: "Quantity",
      size: 100,
      meta: { filterType: "range" },
      filterFn: "range" as unknown as FilterFn<Product>,
      enableColumnFilter: true,
    },

    // 🏷 Brand (with lock support)
    {
      id: "brand",
      accessorKey: "brand",
      header: "Brand",
      size: 140,
      meta: { filterType: "text" },
      filterFn: "fuzzyText" as unknown as FilterFn<Product>,
      enableColumnFilter: true,
      cell: ({ row }) =>
        LockableCell({
          value: row.original.brand,
          locked: row.original.brand_locked,
        }),
    },

    // 🏬 Vendor (with lock support)
    {
      id: "vendor",
      accessorKey: "vendor",
      header: "Vendor",
      size: 140,
      meta: { filterType: "text" },
      filterFn: "fuzzyText" as unknown as FilterFn<Product>,
      enableColumnFilter: true,
      cell: ({ row }) =>
        LockableCell({
          value: row.original.vendor,
          locked: row.original.vendor_locked,
        }),
    },

    // 🚚 Distributor
    {
      id: "distributor",
      accessorKey: "distributor",
      header: "Distributor",
      size: 140,
      meta: { filterType: "text" },
      filterFn: "fuzzyText" as unknown as FilterFn<Product>,
      enableColumnFilter: true,
    },

    // ✅ NEW: Available From (distributor list)
    {
      id: "available_from",
      header: "Available From",
      accessorKey: "sku",
      cell: ({ row }) => <AvailableFromCell sku={row.original.sku} />,
      size: 200,
      enableSorting: false,
      meta: { filterType: "text" },
      enableColumnFilter: false,
    },

    // 🧪 UPC (with lock)
    {
      id: "upc",
      accessorKey: "upc",
      header: "UPC",
      size: 140,
      meta: { filterType: "text" },
      filterFn: "fuzzyText" as unknown as FilterFn<Product>,
      enableColumnFilter: true,
      cell: ({ row }) =>
        LockableCell({
          value: row.original.upc,
          locked: row.original.upc_locked,
        }),
    },

    // 🔎 ASIN
    {
      id: "asin",
      accessorKey: "asin",
      header: "ASIN",
      size: 140,
      meta: { filterType: "text" },
      filterFn: "fuzzyText" as unknown as FilterFn<Product>,
      enableColumnFilter: true,
    },

    // ⚖️ Dimensions & Shipping
    ...[
      ["weight", "Weight (lbs)"],
      ["width", "Width (in)"],
      ["length", "Length (in)"],
      ["shippingCost", "Shipping ($)"],
    ].map(([key, label]) => ({
      id: key,
      accessorKey: key,
      header: label,
      size: 100,
      meta: { filterType: "range" },
      filterFn: "range" as unknown as FilterFn<Product>,
      enableColumnFilter: true,
    })),

    // 🖼 Image count
    {
      id: "imageCount",
      accessorKey: "imageCount",
      header: "Image Count",
      size: 100,
      meta: { filterType: "range" },
      filterFn: "range" as unknown as FilterFn<Product>,
      enableColumnFilter: true,
    },

    // 🚫 Blocked
    {
      id: "blocked",
      accessorKey: "blocked",
      header: "Blocked",
      size: 80,
      meta: { filterType: "dropdown" },
      filterFn: "dropdown" as unknown as FilterFn<Product>,
      enableColumnFilter: true,
      cell: React.memo(({ getValue }) => {
        const checked = getValue() as boolean;
        return <Checkbox checked={checked} />;
      }),
    },

    // ✅ Shopify sync flags
    ...[
      ["approved_for_shopify", "Approved?"],
      ["synced_to_shopify", "Synced?"],
    ].map(([key, label]) => ({
      id: key,
      accessorKey: key,
      header: label,
      size: 100,
      meta: { filterType: "dropdown" },
      filterFn: "dropdown" as unknown as FilterFn<Product>,
      enableColumnFilter: true,
      cell: React.memo(({ getValue }) => {
        const val = getValue() as boolean;
        return key === "synced_to_shopify" ? (
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              val ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {val ? "Yes" : "No"}
          </span>
        ) : (
          <Checkbox checked={val} />
        );
      }),
    })),

    // 🔄 Status / Visibility dropdowns
    ...[
      ["status", "Status"],
      ["visibility", "Visibility"],
    ].map(([key, label]) => ({
      id: key,
      accessorKey: key,
      header: label,
      size: 120,
      meta: { filterType: "dropdown" },
      filterFn: "dropdown" as unknown as FilterFn<Product>,
      enableColumnFilter: true,
    })),

    // 📅 Dates
    ...[
      ["lastUpdated", "Last Updated"],
      ["createdAt", "Created Date"],
    ].map(([key, label]) => ({
      id: key,
      accessorKey: key,
      header: label,
      size: 120,
      meta: { filterType: "date" },
      filterFn: "dateRange" as unknown as FilterFn<Product>,
      enableColumnFilter: true,
      cell: ({ getValue }) => {
        const value = getValue() as string;
        const parsed = new Date(value);
        return parsed instanceof Date && !isNaN(parsed.getTime())
          ? format(parsed, "MM/dd/yyyy")
          : "Invalid Date";
      },
    })),
  ];
}
