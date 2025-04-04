"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Header, Table, flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { ResizableHandle } from "./ResizableHandle";
import { Product } from "./columns";

interface SortableHeaderCellProps {
  header: Header<Product, unknown>;
  table: Table<Product>;
}

export function SortableHeaderCell({ header, table }: SortableHeaderCellProps) {
  const isResizing = header.column.getIsResizing();
  const canResize = header.column.getCanResize();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: header.column.id,
  });

  const columnDefHeader = header.column.columnDef.header;

  const label =
    typeof columnDefHeader === "function"
      ? flexRender(columnDefHeader, header.getContext())
      : columnDefHeader;

  return (
    <th
      ref={setNodeRef}
      colSpan={header.colSpan}
      style={{
        width: header.getSize(),
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 5 : undefined,
        position: isDragging ? "relative" : undefined,
      }}
      className={cn(
        "group relative bg-white border-b text-sm font-medium text-gray-800 align-middle select-none whitespace-nowrap",
        isResizing && "border-blue-500 border-b-2"
      )}
      data-column-id={header.column.id}
    >
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "flex items-center justify-between h-10 px-2",
          "cursor-move"
        )}
      >
        <div className="truncate w-full">{label}</div>
      </div>

      {canResize && <ResizableHandle header={header} />}
    </th>
  );
}
