"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import ProductTable from "@/components/catalog/product-table";

export default function CatalogPage() {
  return (
    <DashboardShell>
      <ProductTable />
    </DashboardShell>
  );
}
