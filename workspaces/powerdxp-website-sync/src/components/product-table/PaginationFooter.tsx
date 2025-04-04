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
    <div className="flex items-center justify-between p-4 border-t bg-white sticky bottom-0 z-10">
      <div className="flex items-center gap-2">
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
        <span className="text-sm">
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
  );
}
