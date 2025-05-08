"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import ProductTable from "@/components/catalog/product-table";
import ClientOnly from "@/components/common/ClientOnly"; // ✅ import it

export default function CatalogPage() {
  return (
    <DashboardShell>
      <ClientOnly>
        <ProductTable />
      </ClientOnly>
    </DashboardShell>
  );
}
