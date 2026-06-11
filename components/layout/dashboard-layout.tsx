"use client";

import * as React from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { useSidebarStore } from "@/stores/ui-store";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <TopNavbar />
      <main
        style={{ marginLeft: isCollapsed ? 72 : 260 }}
        className="min-h-[calc(100vh-4rem)] p-6 transition-[margin] duration-200"
      >
        {children}
      </main>
    </div>
  );
}
