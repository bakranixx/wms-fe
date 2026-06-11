import { format } from "date-fns";
import {
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  FileText,
  Truck,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/page-components";
import {
  mockDeliveryOrders,
  mockRecentActivities,
  mockProducts,
  mockDashboardStats,
} from "@/lib/mock-data";
import type { RecentActivity } from "@/types";

const activityIcons: Record<RecentActivity["type"], React.ReactNode> = {
  inbound: <ArrowDownRight className="h-4 w-4 text-emerald-500" />,
  outbound: <ArrowUpRight className="h-4 w-4 text-primary" />,
  adjustment: <RefreshCw className="h-4 w-4 text-amber-500" />,
  po_created: <FileText className="h-4 w-4 text-primary" />,
  do_created: <Truck className="h-4 w-4 text-primary" />,
};

const reports = [
  { name: "Revenue Report", desc: "Monthly revenue and financial summary" },
  { name: "Inventory Report", desc: "Stock levels and movements" },
  { name: "Product Report", desc: "Product performance and popularity" },
  { name: "Vendor Report", desc: "Vendor activity and insights" },
  { name: "Order Report", desc: "Order completion and metrics" },
];

function DeliveryOrdersCard() {
  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Delivery Orders</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary text-xs h-8">
          View all
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">DO Number</TableHead>
              <TableHead className="text-xs">Client</TableHead>
              <TableHead className="text-xs">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDeliveryOrders.slice(0, 5).map((order) => (
              <TableRow key={order.id} className="text-sm">
                <TableCell className="font-medium py-2.5">{order.doNumber}</TableCell>
                <TableCell className="py-2.5">{order.garment.name}</TableCell>
                <TableCell className="py-2.5">
                  <StatusBadge status={order.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function RecentActivitiesCard() {
  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Recent Activities</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary text-xs h-8">
          View all
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[260px]">
          <div className="space-y-1 px-4 pb-4">
            {mockRecentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-muted/50 transition-colors"
              >
                <div className="mt-0.5 rounded-full bg-primary/10 p-2">
                  {activityIcons[activity.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-tight truncate">{activity.description}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{format(activity.timestamp, "MMM dd, HH:mm")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function ReportsCard() {
  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Reports</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary text-xs h-8">
          View all
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {reports.map((report) => (
            <div
              key={report.name}
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{report.name}</p>
                  <p className="text-xs text-muted-foreground">{report.desc}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs shrink-0">
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StockAlertsCard() {
  const stats = mockDashboardStats;
  const lowStockProducts = mockProducts.filter((p) => p.stock < p.minStock).slice(0, 5);

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Stock Alerts</CardTitle>
        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          {stats.lowStockAlerts} items
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lowStockProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-500/10 p-2 shrink-0">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Stock: {product.stock} / Min: {product.minStock}
                  </p>
                </div>
              </div>
              <Button size="sm" className="h-7 text-xs shrink-0">
                Restock
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ActivitySection() {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-4">
      <DeliveryOrdersCard />
      <RecentActivitiesCard />
      <ReportsCard />
      <StockAlertsCard />
    </div>
  );
}
