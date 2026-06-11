"use client";

import { ClipboardList, Package, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { SummaryCard } from "@/components/shared/page-components";

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
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <SummaryCard
        title="Total Stock"
        value={totalStock.toLocaleString()}
        icon={<ClipboardList className="h-5 w-5" />}
        description="Available units"
      />
      <SummaryCard
        title="Reserved"
        value={reservedStock.toLocaleString()}
        icon={<Package className="h-5 w-5" />}
        description="Allocated for orders"
      />
      <SummaryCard
        title="Incoming"
        value={`+${incomingStock.toLocaleString()}`}
        icon={<TrendingUp className="h-5 w-5" />}
        description="Expected from POs"
      />
      <SummaryCard
        title="Outgoing"
        value={`-${outgoingStock.toLocaleString()}`}
        icon={<TrendingDown className="h-5 w-5" />}
        description="Allocated for DOs"
      />
      <SummaryCard
        title="Low Stock"
        value={lowStockCount}
        icon={<AlertTriangle className="h-5 w-5" />}
        description="Items below minimum"
        className={lowStockCount > 0 ? "border-yellow-500/50" : ""}
      />
    </div>
  );
}
