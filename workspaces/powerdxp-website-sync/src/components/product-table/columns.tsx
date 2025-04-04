import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

// ✅ Product type definition
export type Product = {
  sku: string;
  title: string;
  description?: string;
  cost: number;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  map: number;
  quantity: number;
  brand: string;
  vendor: string;
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
  asin?: string;
};

export function generateColumns(): ColumnDef<Product>[] {
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
      cell: ({ getValue }) => {
        const url = getValue() as string | undefined;
        return url ? (
          <img src={url} alt="product" className="w-10 h-10 object-cover rounded" />
        ) : (
          <span className="text-muted-foreground italic">No Image</span>
        );
      },
      size: 100,
      meta: { filterType: "image" },
    },
    {
      id: "sku",
      accessorKey: "sku",
      header: "SKU",
      size: 120,
      meta: { filterType: "text" },
    },
    {
      id: "title",
      accessorKey: "title",
      header: "Title",
      size: 200,
      meta: { filterType: "text" },
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Description",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return value ? value.slice(0, 60) + (value.length > 60 ? "..." : "") : "-";
      },
      size: 240,
      meta: { filterType: "text" },
    },
    {
      id: "cost",
      accessorKey: "cost",
      header: "Cost",
      cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`,
      size: 100,
      meta: { filterType: "range" },
    },
    {
      id: "price",
      accessorKey: "price",
      header: "Price",
      cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`,
      size: 100,
      meta: { filterType: "range" },
    },
    {
      id: "minPrice",
      accessorKey: "minPrice",
      header: "Min Price",
      cell: ({ getValue }) => {
        const val = getValue() as number | undefined;
        return val !== undefined ? `$${val.toFixed(2)}` : "-";
      },
      size: 100,
      meta: { filterType: "range" },
    },
    {
      id: "maxPrice",
      accessorKey: "maxPrice",
      header: "Max Price",
      cell: ({ getValue }) => {
        const val = getValue() as number | undefined;
        return val !== undefined ? `$${val.toFixed(2)}` : "-";
      },
      size: 100,
      meta: { filterType: "range" },
    },
    {
      id: "map",
      accessorKey: "map",
      header: "MAP",
      cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`,
      size: 100,
      meta: { filterType: "range" },
    },
    {
      id: "quantity",
      accessorKey: "quantity",
      header: "Quantity",
      size: 100,
      meta: { filterType: "range" },
    },
    {
      id: "brand",
      accessorKey: "brand",
      header: "Brand",
      size: 140,
      meta: { filterType: "text" },
    },
    {
      id: "vendor",
      accessorKey: "vendor",
      header: "Vendor",
      size: 140,
      meta: { filterType: "text" },
    },
    {
      id: "distributor",
      accessorKey: "distributor",
      header: "Distributor",
      size: 140,
      meta: { filterType: "text" },
    },
    {
      id: "upc",
      accessorKey: "upc",
      header: "UPC",
      size: 140,
      meta: { filterType: "text" },
    },
    {
      id: "asin",
      accessorKey: "asin",
      header: "ASIN",
      size: 140,
      meta: { filterType: "text" },
    },
    {
      id: "weight",
      accessorKey: "weight",
      header: "Weight (lbs)",
      size: 100,
      meta: { filterType: "range" },
    },
    {
      id: "width",
      accessorKey: "width",
      header: "Width (in)",
      size: 100,
      meta: { filterType: "range" },
    },
    {
      id: "length",
      accessorKey: "length",
      header: "Length (in)",
      size: 100,
      meta: { filterType: "range" },
    },
    {
      id: "shippingCost",
      accessorKey: "shippingCost",
      header: "Shipping ($)",
      cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`,
      size: 120,
      meta: { filterType: "range" },
    },
    {
      id: "imageCount",
      accessorKey: "imageCount",
      header: "Image Count",
      size: 100,
      meta: { filterType: "range" },
    },
    {
      id: "blocked",
      accessorKey: "blocked",
      header: "Blocked",
      cell: React.memo(({ getValue }) => {
        const checked = getValue() as boolean;
        return <Checkbox checked={checked} />;
      }),
      size: 80,
      meta: { filterType: "dropdown" },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      size: 120,
      meta: { filterType: "dropdown" },
    },
    {
      id: "visibility",
      accessorKey: "visibility",
      header: "Visibility",
      size: 120,
      meta: { filterType: "dropdown" },
    },
    {
      id: "lastUpdated",
      accessorKey: "lastUpdated",
      header: "Last Updated",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        const parsedDate = new Date(value);
        return parsedDate instanceof Date && !isNaN(parsedDate.getTime())
          ? format(parsedDate, "MM/dd/yyyy")
          : "Invalid Date";
      },
      size: 120,
      meta: { filterType: "date" },
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        const parsedDate = new Date(value);
        return parsedDate instanceof Date && !isNaN(parsedDate.getTime())
          ? format(parsedDate, "MM/dd/yyyy")
          : "Invalid Date";
      },
      size: 120,
      meta: { filterType: "date" },
    },
  ];
}
