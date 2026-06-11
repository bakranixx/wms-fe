"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/shared/page-components";
import { mockInventoryItems, mockWarehouses } from "@/lib/mock-data";
import type { InventoryItem } from "@/types";
import { useT } from "@/hooks/use-translations";
import { InventoryStats } from "./_components/inventory-stats";
import { InventoryTable } from "./_components/inventory-table";

export default function InventoryPage() {
  const t = useT();
  const [inventoryItems] = React.useState<InventoryItem[]>(mockInventoryItems);

  const totalStock = inventoryItems.reduce((sum, item) => sum + item.availableStock, 0);
  const reservedStock = inventoryItems.reduce((sum, item) => sum + item.reservedStock, 0);
  const incomingStock = inventoryItems.reduce((sum, item) => sum + item.incomingStock, 0);
  const outgoingStock = inventoryItems.reduce((sum, item) => sum + item.outgoingStock, 0);
  const lowStockItems = inventoryItems.filter(
    (item) => item.availableStock < item.product.minStock
  );

  return (
    <DashboardLayout>
      <PageHeader
        title={t.inventory.title}
        description={t.inventory.description}
        breadcrumbs={[{ label: t.inventory.title }]}
      />

      <InventoryStats
        totalStock={totalStock}
        reservedStock={reservedStock}
        incomingStock={incomingStock}
        outgoingStock={outgoingStock}
        lowStockCount={lowStockItems.length}
      />

      <InventoryTable
        data={inventoryItems}
        warehouses={mockWarehouses}
      />
    </DashboardLayout>
  );
}
