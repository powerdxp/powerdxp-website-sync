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
  RowSelectionState,
} from "@tanstack/react-table";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
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
import { PaginationFooter } from "./PaginationFooter";

export default function ProductTable() {
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const updateFilterValue = (key: string, value: any) =>
    setFilterValues((prev) => ({ ...prev, [key]: value }));

  const columns = useMemo<ColumnDef<Product>[]>(() => generateColumns(), []);
  const defaultColumnOrder = useMemo(() => columns.map((col) => col.id!), [columns]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(defaultColumnOrder);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [currentDate, setCurrentDate] = useState<string>("");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  const resetColumnOrder = () => setColumnOrder(defaultColumnOrder);

  const table = useReactTable({
    data: useMemo(
      () => [
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
        },
      ],
      [currentDate]
    ),
    columns,
    state: {
      columnOrder,
      pagination: { pageIndex: 0, pageSize: 100 },
      rowSelection,
    },
    onColumnOrderChange: setColumnOrder,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });

  const activeColumn = table.getAllLeafColumns().find((col) => col.id === activeId);

  // ✅ Setup drag sensors with activation constraint
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // drag only starts after slight movement
      },
    })
  );

  const handleDragStart = (event: any) => {
    const target = event?.active?.data?.current?.target;

    // ❌ Prevent drag if clicking resizer or form control
    if (
      target?.closest(".resizer") ||
      target?.closest("input") ||
      target?.closest("button")
    ) {
      return;
    }

    setActiveId(event?.active?.id ?? null);
  };

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
      <div className="bg-white sticky top-0 z-20 px-4 py-2 border-b flex justify-between items-center">
        <span className="font-semibold text-sm text-gray-700">Manage Columns</span>
        <Button variant="outline" size="sm" onClick={resetColumnOrder}>
          🔄 Reset Columns
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToHorizontalAxis]}
      >
        <SortableContext
          items={table.getAllLeafColumns().map((col) => col.id!)}
          strategy={horizontalListSortingStrategy}
        >
          <table className="w-full text-sm text-left table-fixed">
            <thead className="bg-gray-100 sticky top-[40px] z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <React.Fragment key={headerGroup.id}>
                  <tr className="h-10">
                    {headerGroup.headers.map((header) => (
                      <SortableHeaderCell key={header.id} header={header} table={table} />
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
                <tr key={row.id}>
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

        {/* ✅ Drag preview overlay */}
        <DragOverlay>
          {activeColumn?.columnDef?.header ? (
            <div className="bg-white border px-2 py-1 text-sm font-medium shadow-md rounded">
              {String(activeColumn.columnDef.header)}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <PaginationFooter table={table} />
    </div>
  );
}
