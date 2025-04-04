"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnOrderState,
  ColumnDef,
  Table,
} from "@tanstack/react-table";
import {
  DndContext,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { Product, generateColumns } from "./columns";
import { ProductFilterRow } from "./ProductFilterRow";
import { SortableHeaderCell } from "./SortableHeaderCell";
import { Button } from "../ui/button";

export default function ProductTable() {
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const updateFilterValue = (key: string, value: any) =>
    setFilterValues((prev) => ({ ...prev, [key]: value }));

  const columns = useMemo<ColumnDef<Product>[]>(() => generateColumns(), []);
  const defaultColumnOrder = useMemo(
    () => columns.map((col) => col.id!),
    [columns]
  );
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(defaultColumnOrder);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [activeId, setActiveId] = useState<string | null>(null);

  // ✅ Safely update date on client only
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  // ✅ Memoized data — prevents re-renders on every drag
  const data = useMemo(() => [
    {
      sku: "SKU123",
      title: "Test Product",
      description: "Mock item for preview",
      cost: 10,
      price: 19.99,
      minPrice: 17.49,
      maxPrice: 22.99,
      map: 18.5,
      quantity: 12,
      brand: "BrandX",
      vendor: "VendorA",
      distributor: "DistOne",
      weight: 1.2,
      width: 3.4,
      length: 5.6,
      shippingCost: 4.99,
      imageCount: 1,
      imageUrl: "https://via.placeholder.com/40",
      status: "Active",
      visibility: "Visible",
      blocked: false,
      lastUpdated: currentDate,
      createdAt: currentDate,
      upc: "1234567890",
      asin: "B000123456",
    }
  ], [currentDate]);

  const resetColumnOrder = () => {
    setColumnOrder(defaultColumnOrder);
  };

  const table = useReactTable({
    data, // ✅ Uses memoized array
    columns,
    state: { columnOrder },
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: "onChange",
  });

  const activeColumn = table.getAllLeafColumns().find(
    (col) => col.id === activeId
  );

  const handleDragEnd = (event: any) => {
    const activeId = event?.active?.id;
    const overId = event?.over?.id;
    setActiveId(null);

    if (!overId || activeId === overId) return;

    setColumnOrder((old) => {
      const oldIndex = old.indexOf(activeId as string);
      const newIndex = old.indexOf(overId as string);
      return arrayMove(old, oldIndex, newIndex);
    });
  };

  return (
    <div className="rounded-md border overflow-auto">
      {/* 🔄 Reset Button */}
      <div className="bg-white sticky top-0 z-20 px-4 py-2 border-b flex justify-between items-center">
        <span className="font-semibold text-sm text-gray-700">Manage Columns</span>
        <Button variant="outline" size="sm" onClick={resetColumnOrder}>
          🔄 Reset Columns
        </Button>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={(event: any) => {
          setActiveId(event?.active?.id ?? null);
        }}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToHorizontalAxis]}
      >
        <SortableContext
          items={table.getAllLeafColumns().map((col) => col.id!)}
          strategy={horizontalListSortingStrategy}
        >
          <table className="w-full text-sm text-left" style={{ tableLayout: "auto" }}>
            <thead className="bg-gray-100 sticky top-[40px] z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <React.Fragment key={headerGroup.id}>
                  <tr className="h-10">
                    {headerGroup.headers.map((header) => (
                      <SortableHeaderCell key={header.id} header={header} />
                    ))}
                  </tr>
                  <ProductFilterRow
                    table={table}
                    filterValues={filterValues}
                    setFilterValues={updateFilterValue}
                  />
                </React.Fragment>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 border-b">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </SortableContext>

        {/* ✅ Drag preview */}
        <DragOverlay>
          {activeColumn ? (
            <div className="px-3 py-1 rounded bg-white border shadow text-sm font-medium whitespace-nowrap">
              {activeColumn.columnDef.header as string}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
