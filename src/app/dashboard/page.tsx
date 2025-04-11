"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Welcome to PowerSync Admin</h1>
          <p className="text-muted-foreground text-sm">
            Manage your full product pipeline from one dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/catalog">
            <Button variant="outline" className="w-full justify-start">
              📦 View Product Catalog
            </Button>
          </Link>

          <Link href="/products-sync">
            <Button variant="outline" className="w-full justify-start">
              🔄 Synced Products
            </Button>
          </Link>

          <Link href="/logs">
            <Button variant="outline" className="w-full justify-start">
              📜 View Sync Logs
            </Button>
          </Link>

          <Link href="/settings">
            <Button variant="outline" className="w-full justify-start">
              ⚙️ Settings
            </Button>
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
