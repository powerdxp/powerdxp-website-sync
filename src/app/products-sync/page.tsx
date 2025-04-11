"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import ProductTable from "@/components/synced-product/product-table";

export default function ProductsSyncPage() {
  return (
    <DashboardShell>
      <ProductTable />
    </DashboardShell>
  );
}
