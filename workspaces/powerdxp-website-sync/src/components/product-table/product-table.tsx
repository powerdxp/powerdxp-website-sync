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
import { PaginationFooter } from "./PaginationFooter";
import { Button } from "../ui/button";
import { ProductRow } from "./ProductRow";

export default function ProductTable() {
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const updateFilterValue = (key: string, value: any) =>
    setFilterValues((prev) => ({ ...prev, [key]: value }));

  const columns = useMemo(() => generateColumns(), []);
  const defaultColumnOrder = useMemo(() => columns.map((col) => col.id!), [columns]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(defaultColumnOrder);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [currentDate, setCurrentDate] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  const resetColumnOrder = () => setColumnOrder(defaultColumnOrder);

  const table = useReactTable({
    data: useMemo(
      () => [
        {
          sku: "SKU001",
          title: "Fishing Rod",
          description: "Durable rod for precision casting.",
          cost: 25.5,
          price: 49.99,
          minPrice: 40.0,
          maxPrice: 60.0,
          map: 45.99,
          quantity: 10,
          brand: "ProCast",
          vendor: "Vendor A",
          distributor: "Zanders",
          weight: 1.2,
          width: 2.5,
          length: 4.0,
          shippingCost: 7.99,
          imageCount: 1,
          imageUrl: "/placeholder.png",
          status: "Active",
          visibility: "Visible",
          blocked: false,
          lastUpdated: currentDate,
          createdAt: currentDate,
          upc: "1234567890",
          asin: "B000000001",
        },
        {
          sku: "SKU002",
          title: "Hunting Backpack",
          description: "Durable backpack with hydration system and gear compartments...",
          cost: 54.49,
          price: 74.99,
          minPrice: 65.0,
          maxPrice: 80.0,
          map: 69.99,
          quantity: 12,
          brand: "HuntMax",
          vendor: "Vendor B",
          distributor: "CWR",
          weight: 2.0,
          width: 3.0,
          length: 5.0,
          shippingCost: 9.99,
          imageCount: 2,
          imageUrl: "/placeholder.png",
          status: "Active",
          visibility: "Visible",
          blocked: false,
          lastUpdated: currentDate,
          createdAt: currentDate,
          upc: "2345678901",
          asin: "B000000002",
        },
        {
          sku: "SKU003",
          title: "LED Flashlight 1000 Lumens",
          description: "Compact flashlight for tactical or everyday use.",
          cost: 22.5,
          price: 29.99,
          minPrice: 25.0,
          maxPrice: 34.0,
          map: 27.0,
          quantity: 30,
          brand: "BrightBeam",
          vendor: "Vendor C",
          distributor: "Zanders",
          weight: 0.8,
          width: 1.2,
          length: 3.0,
          shippingCost: 3.99,
          imageCount: 1,
          imageUrl: "/placeholder.png",
          status: "Active",
          visibility: "Visible",
          blocked: false,
          lastUpdated: currentDate,
          createdAt: currentDate,
          upc: "3456789012",
          asin: "B000000003",
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: any) => {
    const target = event?.active?.data?.current?.target;

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
    <div className="flex flex-col h-full">
      <div className="bg-white sticky top-0 z-20 px-4 py-2 border-b flex justify-between items-center">
        <span className="font-semibold text-sm text-gray-700">Manage Columns</span>
        <Button variant="outline" size="sm" onClick={resetColumnOrder}>
          🔄 Reset Columns
        </Button>
      </div>

      <div className="flex-1 overflow-auto border-t">
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
            <thead className="bg-gray-100 sticky top-[0px] z-10">   {/* top-[0px] works because the scroll container starts after the bar above */}
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
              <tbody className="bg-white">
                {table.getRowModel().rows.map((row) => (
                  <ProductRow key={row.id} row={row} />
                ))}
              </tbody>
            </table>
          </SortableContext>

          <DragOverlay>
            {activeColumn?.columnDef?.header ? (
              <div className="bg-white border px-2 py-1 text-sm font-medium shadow-md rounded">
                {String(activeColumn.columnDef.header)}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <PaginationFooter table={table} />
    </div>
  );
}
