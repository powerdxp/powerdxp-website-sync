"use client";

import { Table } from "@tanstack/react-table";
import { Button } from "../ui/button";

interface PaginationFooterProps<T> {
  table: Table<T>;
}

const PAGE_SIZES = [50, 100, 250, 500];

export function PaginationFooter<T>({ table }: PaginationFooterProps<T>) {
  const pageIndex = table.getState().pagination.pageIndex + 1;
  const pageCount = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageSize = table.getState().pagination.pageSize;

  return (
    <div className="sticky bottom-0 z-10 w-full bg-white border-t">
      <div className="flex flex-wrap items-center justify-between p-4">
        {/* Pagination Controls */}
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            ⏮ First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ◀ Prev
          </Button>
          <span className="text-sm whitespace-nowrap">
            Page <strong>{pageIndex}</strong> of <strong>{pageCount}</strong> ({totalRows.toLocaleString()} total)
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next ▶
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
          >
            Last ⏭
          </Button>
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-600">
            View
          </label>
          <select
            id="pageSize"
            className="border px-2 py-1 text-sm rounded"
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}