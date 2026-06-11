"use client";

import { ClipboardList, Package, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { SummaryCard } from "@/components/shared/page-components";
import { useT } from "@/hooks/use-translations";

interface InventoryStatsProps {
  totalStock: number;
  reservedStock: number;
  incomingStock: number;
  outgoingStock: number;
  lowStockCount: number;
}

export function InventoryStats({
  totalStock,
  reservedStock,
  incomingStock,
  outgoingStock,
  lowStockCount,
}: InventoryStatsProps) {
  const t = useT();
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <SummaryCard
        title={t.inventory.totalStock}
        value={totalStock.toLocaleString()}
        icon={<ClipboardList className="h-5 w-5" />}
        description="Available units"
      />
      <SummaryCard
        title={t.inventory.reserved}
        value={reservedStock.toLocaleString()}
        icon={<Package className="h-5 w-5" />}
        description="Allocated for orders"
      />
      <SummaryCard
        title={t.inventory.incoming}
        value={`+${incomingStock.toLocaleString()}`}
        icon={<TrendingUp className="h-5 w-5" />}
        description="Expected from POs"
      />
      <SummaryCard
        title={t.inventory.outgoing}
        value={`-${outgoingStock.toLocaleString()}`}
        icon={<TrendingDown className="h-5 w-5" />}
        description="Allocated for DOs"
      />
      <SummaryCard
        title={t.inventory.lowStock}
        value={lowStockCount}
        icon={<AlertTriangle className="h-5 w-5" />}
        description="Items below minimum"
        className={lowStockCount > 0 ? "border-yellow-500/50" : ""}
      />
    </div>
  );
}
