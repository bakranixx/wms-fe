import { Users, FileText, RefreshCw, Warehouse } from "lucide-react";
import { MiniCard } from "@/components/shared/page-components";
import { mockDashboardStats, mockVendors } from "@/lib/mock-data";

export function BottomStats() {
  const stats = mockDashboardStats;
  const capacityPercent = Math.round(
    (stats.warehouseUsed / stats.warehouseCapacity) * 100,
  );

  return (
    <div className="mt-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
      <MiniCard
        title="Total Vendors"
        value={mockVendors.length}
        icon={<Users className="h-full w-full" />}
        trend={{ value: 8.6, isPositive: true }}
        description="vs last month"
      />
      <MiniCard
        title="Active Contracts"
        value="362"
        icon={<FileText className="h-full w-full" />}
        trend={{ value: 10.4, isPositive: true }}
        description="vs last month"
      />
      <MiniCard
        title="Repeat Customers"
        value="68%"
        icon={<RefreshCw className="h-full w-full" />}
        trend={{ value: 7.3, isPositive: true }}
        description="vs last month"
      />
      <MiniCard
        title="Warehouse Usage"
        value={`${capacityPercent}%`}
        icon={<Warehouse className="h-full w-full" />}
        description={`${stats.warehouseUsed.toLocaleString()} / ${stats.warehouseCapacity.toLocaleString()}`}
      />
    </div>
  );
}
