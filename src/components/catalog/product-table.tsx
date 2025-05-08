"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
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
import { fetchNormalizedProducts } from "@/lib/supabase/fetchNormalizedProducts";
import { supabase } from "@/lib/supabase/browserClient";
import { fuzzyText } from "@/lib/utils/filterFns";

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const updateFilterValue = (key: string, value: any) =>
    setFilterValues((prev) => ({ ...prev, [key]: value }));

  const columns = useMemo(() => generateColumns(), []);
  const defaultColumnOrder = useMemo(() => columns.map((col) => col.id!), [columns]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(defaultColumnOrder);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  const loadProducts = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const res = await fetchNormalizedProducts({
        pageSize: 100,
        cursor,
        filters: filterValues,
      });

      setProducts((prev) => [...prev, ...res.data]);
      setCursor(res.nextCursor);
      setHasMore(Boolean(res.nextCursor));
    } catch (err) {
      console.error("❌ Failed to fetch products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setProducts([]);
    setCursor(null);
    setHasMore(true);
    loadProducts();
  }, [filterValues]);

  useEffect(() => {
    const mappedFilters: ColumnFiltersState = [];
    for (const key in filterValues) {
      const value = filterValues[key];
      if (value === "" || value === null || value === undefined) continue;
      const filterType = columns.find((c) => c.id === key)?.meta?.filterType;
      if (filterType === "range") {
        if (value.min || value.max) mappedFilters.push({ id: key, value });
      } else if (filterType === "date") {
        if (value.from || value.to) mappedFilters.push({ id: key, value });
      } else {
        mappedFilters.push({ id: key, value });
      }
    }
    setColumnFilters(mappedFilters);
  }, [filterValues, columns]);

  const resetColumnOrder = () => setColumnOrder(defaultColumnOrder);

  const table = useReactTable({
    data: products,
    columns,
    state: {
      columnOrder,
      rowSelection,
      columnFilters,
    },
    onColumnOrderChange: setColumnOrder,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    filterFns: {
      fuzzyText,
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });

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

  async function sendSelectedToSyncedPage() {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedSkus = selectedRows.map((row) => row.original.sku);
    if (selectedSkus.length === 0) return;

    try {
      const { error } = await supabase
        .from("products_normalized")
        .update({ status: "approved_for_sync" })
        .in("sku", selectedSkus);

      if (error) {
        console.error("❌ Supabase error:", error.message || error);
        alert("Failed to sync selected products.");
      } else {
        alert(`${selectedSkus.length} product(s) sent to Synced Page ✅`);
        window.location.reload();
      }
    } catch (err: any) {
      console.error("❌ Error syncing products:", err.message || err);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white sticky top-[60px] z-30 px-4 py-2 border-b flex justify-between items-center">
        <span className="font-semibold text-sm text-gray-700">Manage Columns</span>
        <Button variant="outline" size="sm" onClick={resetColumnOrder}>
          🔄 Reset Columns
        </Button>
      </div>

      <div className="flex-1 relative border-t">
        <div className="absolute inset-0 overflow-auto">
          {isLoading && products.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Loading products...</div>
          ) : (
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
                {activeId ? (
                  <div className="bg-white border px-2 py-1 text-sm font-medium shadow-md rounded">
                    {String(activeId)}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>

      <PaginationFooter table={table} />

      {hasMore && (
        <div className="p-4 text-center">
          <Button onClick={loadProducts} disabled={isLoading}>
            {isLoading ? "Loading..." : "⬇️ Load More"}
          </Button>
        </div>
      )}

      {Object.keys(rowSelection).length > 0 && (
        <div className="fixed bottom-20 right-6 z-50">
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 shadow"
            onClick={sendSelectedToSyncedPage}
          >
            🚀 Send {Object.keys(rowSelection).length} to Synced Page
          </Button>
        </div>
      )}
    </div>
  );
}
