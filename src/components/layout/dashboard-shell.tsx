// src/components/dashboard-shell.tsx
import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar always on the left */}
      <Sidebar />

      {/* Main section with header and content area */}
      <div className="flex flex-col flex-1">
        {/* Sticky top header */}
        <Header />

        {/* Content area grows to fill remaining space */}
        <main className="flex flex-col flex-1 min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
