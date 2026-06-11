import { Package, Users, Warehouse, FileText, CheckCircle2 } from "lucide-react";
import { SummaryCard } from "@/components/shared/page-components";
import { mockDashboardStats } from "@/lib/mock-data";

export function StatsOverview() {
  const stats = mockDashboardStats;
  const capacityPercent = Math.round(
    (stats.warehouseUsed / stats.warehouseCapacity) * 100,
  );

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      <SummaryCard
        title="Total Revenue"
        value="Rp 24.78M"
        icon={<Package className="h-full w-full" />}
        trend={{ value: 12.5, isPositive: true }}
        description="vs last week"
        variant="primary"
      />
      <SummaryCard
        title="New Orders"
        value="48"
        icon={<Users className="h-full w-full" />}
        trend={{ value: 8.2, isPositive: true }}
        description="vs last week"
        variant="primary"
      />
      <SummaryCard
        title="Total Stock"
        value={stats.totalStock.toLocaleString()}
        icon={<Warehouse className="h-full w-full" />}
        trend={{ value: 15.3, isPositive: true }}
        description="vs last week"
        variant="primary"
      />
      <SummaryCard
        title="Active PO"
        value={stats.activePO}
        icon={<FileText className="h-full w-full" />}
        trend={{ value: 9.7, isPositive: true }}
        description="vs last week"
        variant="primary"
      />
      <SummaryCard
        title="Completion Rate"
        value={`${capacityPercent}%`}
        icon={<CheckCircle2 className="h-full w-full" />}
        trend={{ value: 6.1, isPositive: true }}
        description="vs last week"
        variant="success"
      />
    </div>
  );
}
