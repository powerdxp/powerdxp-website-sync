"use client";

import React from "react";
import { Header } from "@tanstack/react-table";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "./columns";

interface ResizableHandleProps {
  header: Header<Product, unknown>;
}

export function ResizableHandle({ header }: ResizableHandleProps) {
  return (
    <div
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      className={cn(
        "resizer",
        "absolute right-0 top-0 h-full w-1 bg-transparent hover:bg-blue-500 hover:cursor-col-resize",
        header.column.getIsResizing() && "bg-blue-500"
      )}
    >
      <GripVertical
        size={12}
        className="text-blue-500 absolute top-1/2 -translate-y-1/2 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
}