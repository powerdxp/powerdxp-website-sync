"use client";

import React from "react"; // ✅ Fix for React.memo
import Image from "next/image";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductStatusBadge } from "./ProductStatusBadge";
import { Pencil, Check, X, Lock } from "lucide-react";
import clsx from "clsx";

interface ProductRowProps {
  product: {
    status: string;
    image: string;
    sku: string;
    title: string;
    brand: string;
    distributor: string;
    cost: number;
    cost_locked?: boolean;
    map: number;
    quantity: number;
    upc: string;
    asin: string;
    description: string;
    lastUpdated: string;
  };
  isSelected: boolean;
  onToggle: () => void;
}

export const ProductRow = React.memo(function ProductRow({
  product,
  isSelected,
  onToggle,
}: ProductRowProps) {
  const [editingCost, setEditingCost] = useState(false);
  const [editedCost, setEditedCost] = useState(product.cost);
  const [costLocked, setCostLocked] = useState(product.cost_locked ?? false);

  const [editingMap, setEditingMap] = useState(false);
  const [editedMap, setEditedMap] = useState(product.map);

  const [editingQty, setEditingQty] = useState(false);
  const [editedQty, setEditedQty] = useState(product.quantity);

  const [editingTitle, setEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(product.title);

  const [editingBrand, setEditingBrand] = useState(false);
  const [editedBrand, setEditedBrand] = useState(product.brand);

  const [editingDescription, setEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(product.description);

  const handleSave = (field: string) => {
    switch (field) {
      case "cost":
        setEditingCost(false);
        break;
      case "map":
        setEditingMap(false);
        break;
      case "quantity":
        setEditingQty(false);
        break;
      case "title":
        setEditingTitle(false);
        break;
      case "brand":
        setEditingBrand(false);
        break;
      case "description":
        setEditingDescription(false);
        break;
    }
  };

  const handleCancel = (field: string) => {
    switch (field) {
      case "cost":
        setEditedCost(product.cost);
        setEditingCost(false);
        break;
      case "map":
        setEditedMap(product.map);
        setEditingMap(false);
        break;
      case "quantity":
        setEditedQty(product.quantity);
        setEditingQty(false);
        break;
      case "title":
        setEditedTitle(product.title);
        setEditingTitle(false);
        break;
      case "brand":
        setEditedBrand(product.brand);
        setEditingBrand(false);
        break;
      case "description":
        setEditedDescription(product.description);
        setEditingDescription(false);
        break;
    }
  };

  return (
    <tr
      className={clsx(
        "transition-colors duration-200",
        "hover:bg-blue-50",
        isSelected ? "bg-blue-100" : "odd:bg-white even:bg-gray-50"
      )}
    >
      <td className="p-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => {
            if (typeof checked === "boolean") {
              onToggle();
            }
          }}
        />
      </td>

      <td className="p-2">
        <ProductStatusBadge status={product.status} />
      </td>

      <td className="p-2">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.title || "Product image"}
          width={24}
          height={24}
          className="h-6 w-6 rounded"
        />
      </td>

      <td className="p-2 font-mono text-xs">{product.sku}</td>

      <td className="p-2">
        {editingTitle ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={() => handleSave("title")}
              onKeyDown={(e) => e.key === "Enter" && handleSave("title")}
              className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm"
              autoFocus
            />
            <Check size={14} onClick={() => handleSave("title")} />
            <X size={14} onClick={() => handleCancel("title")} />
          </div>
        ) : (
          <div className="flex items-center gap-1">
            {editedTitle}
            <Pencil size={14} onClick={() => setEditingTitle(true)} />
          </div>
        )}
      </td>

      <td className="p-2">
        {editingBrand ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={editedBrand}
              onChange={(e) => setEditedBrand(e.target.value)}
              onBlur={() => handleSave("brand")}
              onKeyDown={(e) => e.key === "Enter" && handleSave("brand")}
              className="w-full px-1 py-0.5 border border-gray-300 rounded text-sm"
              autoFocus
            />
            <Check size={14} onClick={() => handleSave("brand")} />
            <X size={14} onClick={() => handleCancel("brand")} />
          </div>
        ) : (
          <div className="flex items-center gap-1">
            {editedBrand}
            <Pencil size={14} onClick={() => setEditingBrand(true)} />
          </div>
        )}
      </td>

      <td className="p-2">{product.distributor}</td>

      <td className="p-2 text-green-700">
        {editingCost ? (
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={editedCost}
              onChange={(e) => setEditedCost(parseFloat(e.target.value))}
              className="w-20 px-1 py-0.5 border border-gray-300 rounded text-sm"
              autoFocus
            />
            <Check size={14} onClick={() => handleSave("cost")} />
            <X size={14} onClick={() => handleCancel("cost")} />
          </div>
        ) : (
          <div className="flex items-center gap-1">
            ${editedCost.toFixed(2)}
            <Pencil size={14} onClick={() => setEditingCost(true)} />
            <Lock size={14} className="text-gray-300" />
          </div>
        )}
      </td>

      <td className="p-2 text-blue-700">
        {editingMap ? (
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={editedMap}
              onChange={(e) => setEditedMap(parseFloat(e.target.value))}
              className="w-20 px-1 py-0.5 border border-gray-300 rounded text-sm"
              autoFocus
            />
            <Check size={14} onClick={() => handleSave("map")} />
            <X size={14} onClick={() => handleCancel("map")} />
          </div>
        ) : (
          <div className="flex items-center gap-1">
            ${editedMap.toFixed(2)}
            <Pencil size={14} onClick={() => setEditingMap(true)} />
          </div>
        )}
      </td>

      <td className="p-2">
        {editingQty ? (
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={editedQty}
              onChange={(e) => setEditedQty(parseInt(e.target.value))}
              className="w-16 px-1 py-0.5 border border-gray-300 rounded text-sm"
              autoFocus
            />
            <Check size={14} onClick={() => handleSave("quantity")} />
            <X size={14} onClick={() => handleCancel("quantity")} />
          </div>
        ) : (
          <div className="flex items-center gap-1">
            {editedQty}
            <Pencil size={14} onClick={() => setEditingQty(true)} />
          </div>
        )}
      </td>

      <td className="p-2">{product.upc}</td>
      <td className="p-2">{product.asin}</td>

      <td className="p-2">
        {editingDescription ? (
          <div className="flex items-start gap-1">
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full px-1 py-1 border border-gray-300 rounded text-sm"
              autoFocus
              rows={2}
            />
            <div className="flex flex-col gap-1">
              <Check size={14} onClick={() => handleSave("description")} />
              <X size={14} onClick={() => handleCancel("description")} />
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-1 max-w-[300px]">
            <span className="truncate ...">{editedDescription}</span>
            <Pencil size={14} onClick={() => setEditingDescription(true)} />
          </div>
        )}
      </td>

      <td className="p-2">{product.lastUpdated}</td>
    </tr>
  );
});
