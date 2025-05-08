// /lib/catalog/getSyncStatus.ts

import { Product } from "@/components/catalog/columns";

/**
 * Determines the sync status and notes for a product.
 */
export function getSyncStatus(product: Product): {
  status: "✅ Synced" | "🟡 Incomplete" | "❌ No-Synced" | "⚪ Unreviewed";
  notes: string[];
} {
  const notes: string[] = [];

  // ❌ Blocked overrides everything
  if (product.blocked) {
    notes.push("Product is manually blocked");
    return {
      status: "❌ No-Synced",
      notes,
    };
  }

  // 🟡 Incomplete
  if (!product.title) notes.push("Missing title");
  if (!product.upc) notes.push("Missing UPC");

  if (notes.length > 0) {
    return {
      status: "🟡 Incomplete",
      notes,
    };
  }

  // ✅ Synced (approved_for_sync set)
  if (product.approved_for_sync) {
    return {
      status: "✅ Synced",
      notes: ["Successfully added to Synced products"],
    };
  }

  // ⚪ Unreviewed (default case)
  return {
    status: "⚪ Unreviewed",
    notes: [],
  };
}
