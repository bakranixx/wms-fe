import { TrendingUp } from "lucide-react";
import {
  ChartContainer,
  SimpleBarChart,
  SimpleLineChart,
  SimplePieChart,
  ServiceItem,
} from "@/components/charts/chart-components";
import { monthlyMovement } from "@/lib/mock-data";

const revenueByCategory = [
  { name: "Fabric Materials", value: 12450000 },
  { name: "Garment Products", value: 6760000 },
  { name: "Accessories", value: 3240000 },
  { name: "Raw Materials", value: 2105000 },
  { name: "Others", value: 1890000 },
];

const topProducts = [
  { name: "T-Shirt Blank - White", value: 8945000 },
  { name: "Cotton Fabric Premium", value: 6320000 },
  { name: "Polo Shirt - Navy", value: 3210000 },
  { name: "Denim Jacket Material", value: 2105000 },
  { name: "Jersey Fabric", value: 1890000 },
];

const monthlyOrders = [
  { name: "Jan", value: 45 },
  { name: "Feb", value: 52 },
  { name: "Mar", value: 65 },
  { name: "Apr", value: 72 },
  { name: "May", value: 91 },
  { name: "Jun", value: 88 },
  { name: "Jul", value: 104 },
  { name: "Aug", value: 118 },
  { name: "Sep", value: 112 },
  { name: "Oct", value: 126 },
  { name: "Nov", value: 98 },
  { name: "Dec", value: 85 },
];

export function ChartsSection() {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-4">
      {/* Revenue Overview */}
      <ChartContainer
        title="Revenue Overview"
        description="Rp 24,780,000"
        action={
          <select className="text-xs bg-transparent border border-border rounded px-2 py-1">
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Daily</option>
          </select>
        }
      >
        <div className="text-sm text-emerald-500 mb-2 flex items-center gap-1">
          <TrendingUp className="h-4 w-4" />
          +12.5% vs last month
        </div>
        <SimpleLineChart
          data={monthlyMovement}
          dataKeys={["inbound"]}
          height={180}
          area
        />
      </ChartContainer>

      {/* Top Products */}
      <ChartContainer title="Top Products" viewAllHref="/products">
        <div className="space-y-1">
          {topProducts.map((item, index) => (
            <ServiceItem key={item.name} name={item.name} value={item.value} index={index} />
          ))}
        </div>
      </ChartContainer>

      {/* Revenue by Category */}
      <ChartContainer title="Revenue by Category">
        <SimplePieChart
          data={revenueByCategory}
          height={220}
          innerRadius={50}
          showLegend
          centerText={{ label: "Total Revenue", value: "24780000" }}
        />
      </ChartContainer>

      {/* Orders Overview */}
      <ChartContainer
        title="Orders Overview (Monthly)"
        description="126 orders"
        action={
          <select className="text-xs bg-transparent border border-border rounded px-2 py-1">
            <option>This Year</option>
            <option>Last Year</option>
          </select>
        }
      >
        <div className="text-sm text-emerald-500 mb-2 flex items-center gap-1">
          <TrendingUp className="h-4 w-4" />
          +15.3% vs last month
        </div>
        <SimpleBarChart data={monthlyOrders} dataKeys={["value"]} height={180} />
      </ChartContainer>
    </div>
  );
}
