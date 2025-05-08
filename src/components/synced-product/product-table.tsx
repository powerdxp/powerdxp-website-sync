"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnOrderState,
  RowSelectionState,
  ColumnFiltersState,
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
import { PaginationFooter } from "@/components/layout/PaginationFooter";
import { Button } from "../ui/button";
import { ProductRow } from "./ProductRow";
import { fetchReadyToSyncProducts } from "@/lib/supabase/fetchReadyToSyncProducts";
import { ProductBulkActions } from "./ProductBulkActions";

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  const columns = useMemo(() => generateColumns(), []);
  const defaultColumnOrder = useMemo(() => columns.map((col) => col.id!), [columns]);

  useEffect(() => {
    setColumnOrder(defaultColumnOrder);
  }, [defaultColumnOrder]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const result = await fetchReadyToSyncProducts({ page: 1, pageSize: 100 });
        setProducts(result || []);
      } catch (err) {
        console.error("❌ Failed to fetch ready-to-sync products:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    const mappedFilters: ColumnFiltersState = [];

    for (const key in filterValues) {
      const value = filterValues[key];
      if (value === "" || value === null || value === undefined) continue;

      const filterType = columns.find((c) => c.id === key)?.meta?.filterType;

      if (filterType === "range") {
        if (value.min || value.max) {
          mappedFilters.push({ id: key, value });
        }
      } else if (filterType === "date") {
        if (value.from || value.to) {
          mappedFilters.push({ id: key, value });
        }
      } else {
        mappedFilters.push({ id: key, value });
      }
    }

    setColumnFilters(mappedFilters);
  }, [filterValues, columns]);

  const updateFilterValue = (key: string, value: any) =>
    setFilterValues((prev) => ({ ...prev, [key]: value }));

  const resetColumnOrder = () => setColumnOrder(defaultColumnOrder);

  const table = useReactTable({
    data: products,
    columns,
    state: {
      columnOrder,
      rowSelection,
      columnFilters,
      pagination: { pageIndex: 0, pageSize: 100 },
    },
    onColumnOrderChange: setColumnOrder,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    filterFns: {
      fuzzyText: (row, columnId, filterValue) => {
        const raw = row.getValue(columnId);
        const value = String(filterValue?.value ?? filterValue ?? "").toLowerCase();
        const mode = filterValue?.mode ?? "contains";
        const rowValue = String(raw ?? "").toLowerCase();

        switch (mode) {
          case "contains":
            return rowValue.includes(value);
          case "startsWith":
            return rowValue.startsWith(value);
          case "equals":
            return rowValue === value;
          case "notEquals":
            return rowValue !== value;
          case "isEmpty":
            return rowValue === "";
          case "isNotEmpty":
            return rowValue !== "";
          default:
            return true;
        }
      },
      range: (row, columnId, value) => {
        const val = Number(row.getValue(columnId));
        const min = Number(value?.min);
        const max = Number(value?.max);
        if (!isNaN(min) && val < min) return false;
        if (!isNaN(max) && val > max) return false;
        return true;
      },
      dateRange: (row, columnId, value) => {
        const date = new Date(row.getValue(columnId));
        const from = value?.from ? new Date(value.from) : null;
        const to = value?.to ? new Date(value.to) : null;
        if (from && date < from) return false;
        if (to && date > to) return false;
        return true;
      },
      dropdown: (row, columnId, value) => {
        if (value === "All" || !value) return true;
        return String(row.getValue(columnId)) === value;
      },
      image: (row, columnId, value) => {
        const count = Number(row.getValue("imageCount"));
        switch (value) {
          case "noImage":
            return count === 0;
          case "atLeastOne":
            return count >= 1;
          case "twoOrMore":
            return count >= 2;
          default:
            return true;
        }
      },
    },
  });

  const activeColumn = table.getAllLeafColumns().find((col) => col.id === activeId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = (event: any) => {
    const target = event?.active?.data?.current?.target;
    if (target?.closest(".resizer") || target?.closest("input") || target?.closest("button")) return;
    setActiveId(event?.active?.id ?? null);
  };

  const handleDragEnd = (event: any) => {
    const activeId = event?.active?.id;
    const overId = event?.over?.id;
    setActiveId(null);
    if (!overId || activeId === overId) return;
    setColumnOrder((old) => arrayMove(old, old.indexOf(activeId), old.indexOf(overId)));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sticky reset bar */}
      <div className="bg-white sticky top-[60px] z-30 px-4 py-2 border-b flex justify-between items-center">
        <span className="font-semibold text-sm text-gray-700">Manage Columns</span>
        <Button variant="outline" size="sm" onClick={resetColumnOrder}>
          🔄 Reset Columns
        </Button>
      </div>

      {/* ✅ Bulk Actions Bar */}
      <ProductBulkActions
        selectedCount={Object.keys(rowSelection).length}
        selectedSkus={table.getSelectedRowModel().rows.map((r) => r.original.sku)}
        onSelectFiltered={() => {
          const filteredRows = table.getFilteredRowModel().rows;
          const selection: Record<string, boolean> = {};
          filteredRows.forEach((row) => {
            selection[row.id] = true;
          });
          setRowSelection(selection);
        }}
        onDelete={() => alert("🧨 Delete logic not implemented")}
        onExport={() => alert("📦 Export logic not implemented")}
        onPushToShopify={async () => {
          const skus = table.getSelectedRowModel().rows.map((r) => r.original.sku);
          if (skus.length === 0) return;

          const { pushToShopify } = await import("@/lib/shopify/pushToShopify");
          const result = await pushToShopify(skus);

          if (result === "success") {
            alert(`✅ Pushed ${skus.length} SKU(s) to Shopify!`);
          } else {
            alert("❌ Failed to push some SKUs.");
          }

          // Refresh product list after sync
          const fresh = await fetchReadyToSyncProducts({ page: 1, pageSize: 100 });
          setProducts(fresh || []);
          setRowSelection({});
        }}
      />

      {/* Scrollable table area */}
      <div className="flex-1 relative border-t">
        <div className="absolute inset-0 overflow-auto">
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
                <thead className="bg-gray-100 sticky top-0 z-10">
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
      </div>

      {/* Sticky footer */}
      <PaginationFooter table={table} />
    </div>
  );
}
