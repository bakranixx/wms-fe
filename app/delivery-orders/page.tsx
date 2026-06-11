"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Plus,
  Eye,
  MoreHorizontal,
  Truck,
  Shirt,
  Check,
  ArrowUpFromLine
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader, StatusBadge, EmptyState } from "@/components/shared/page-components";
import { DataTable, DataTableColumnHeader } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockDeliveryOrders, mockStockMovements } from "@/lib/mock-data";
import type { DeliveryOrder, DOStatus, StockMovement } from "@/types";
import { CreateDODialog } from "./_components/create-do-dialog";
import { ShipConfirmDialog } from "./_components/ship-confirm-dialog";
import { DODetailSheet } from "./_components/do-detail-sheet";

const statusFilter: DOStatus[] = ["Draft", "Picking", "Packing", "Shipped", "Completed", "Cancelled"];

const getStatusProgress = (status: DOStatus): number => {
  const progressMap: Record<DOStatus, number> = {
    Draft: 0,
    Picking: 25,
    Packing: 50,
    Shipped: 75,
    Completed: 100,
    Cancelled: 0,
  };
  return progressMap[status];
};

export default function DeliveryOrdersPage() {
  const [deliveryOrders, setDeliveryOrders] = React.useState<DeliveryOrder[]>(mockDeliveryOrders);
  const [stockMovements, setStockMovements] = React.useState<StockMovement[]>(mockStockMovements);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [selectedDO, setSelectedDO] = React.useState<DeliveryOrder | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [shipConfirmOpen, setShipConfirmOpen] = React.useState(false);
  const [doToShip, setDoToShip] = React.useState<DeliveryOrder | null>(null);

  const filteredOrders = React.useMemo(() => {
    if (filterStatus === "all") return deliveryOrders;
    return deliveryOrders.filter((order) => order.status === filterStatus);
  }, [deliveryOrders, filterStatus]);

  const openDetail = (order: DeliveryOrder) => {
    setSelectedDO(order);
    setIsDetailOpen(true);
  };

  const handleCreateDO = (newDO: DeliveryOrder) => {
    setDeliveryOrders([newDO, ...deliveryOrders]);
  };

  const updateDOStatus = (doOrder: DeliveryOrder, newStatus: DOStatus) => {
    setDeliveryOrders(deliveryOrders.map(d =>
      d.id === doOrder.id ? { ...d, status: newStatus, updatedAt: new Date() } : d
    ));
    setSelectedDO(prev => prev?.id === doOrder.id ? { ...prev, status: newStatus } : prev);
  };

  const handleShipDO = () => {
    if (!doToShip) return;

    updateDOStatus(doToShip, "Shipped");

    const newMovements: StockMovement[] = doToShip.items.map((item, index) => ({
      id: crypto.randomUUID(),
      transactionId: `TRX-${Date.now()}-${index}`,
      productId: item.productId,
      product: item.product,
      movementType: 'OUTBOUND' as const,
      sourceType: 'DELIVERY_ORDER' as const,
      quantity: item.allocatedQuantity || item.requestedQuantity,
      warehouseId: doToShip.warehouseId,
      warehouse: doToShip.warehouse,
      referenceNumber: doToShip.doNumber,
      garmentId: doToShip.garmentId,
      garment: doToShip.garment,
      deliveryOrderId: doToShip.id,
      userId: 'user-1',
      userName: 'System',
      status: 'Posted' as const,
      timestamp: new Date(),
      notes: `Automatic outbound from ${doToShip.doNumber} - Shipped`,
    }));

    setStockMovements([...newMovements, ...stockMovements]);
    setShipConfirmOpen(false);
    setDoToShip(null);
    setIsDetailOpen(false);
  };

  const columns: ColumnDef<DeliveryOrder>[] = [
    {
      accessorKey: "doNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="DO Number" />,
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium text-primary">{row.getValue("doNumber")}</span>
      ),
    },
    {
      accessorKey: "garment",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Client" />,
      cell: ({ row }) => {
        const garment = row.original.garment;
        return (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Shirt className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">{garment.name}</p>
              <p className="text-xs text-muted-foreground">{garment.brand}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "warehouse",
      header: "Warehouse",
      cell: ({ row }) => row.original.warehouse.name,
    },
    {
      accessorKey: "deliveryDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Delivery Date" />,
      cell: ({ row }) => format(row.original.deliveryDate, "MMM dd, yyyy"),
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.items.length} items</Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="space-y-1">
          <StatusBadge status={row.getValue("status")} />
          <Progress value={getStatusProgress(row.getValue("status"))} className="h-1 w-20" />
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openDetail(order)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {order.status === "Draft" && (
                <DropdownMenuItem onClick={() => updateDOStatus(order, "Picking")}>
                  <Check className="mr-2 h-4 w-4" />
                  Start Picking
                </DropdownMenuItem>
              )}
              {order.status === "Picking" && (
                <DropdownMenuItem onClick={() => updateDOStatus(order, "Packing")}>
                  <Check className="mr-2 h-4 w-4" />
                  Complete Picking
                </DropdownMenuItem>
              )}
              {order.status === "Packing" && (
                <DropdownMenuItem onClick={() => {
                  setDoToShip(order);
                  setShipConfirmOpen(true);
                }}>
                  <ArrowUpFromLine className="mr-2 h-4 w-4" />
                  Mark as Shipped
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Delivery Orders"
        description="Manage outbound orders to garment clients"
        breadcrumbs={[{ label: "Delivery Orders" }]}
        actions={
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create DO
          </Button>
        }
      />

      {deliveryOrders.length === 0 ? (
        <EmptyState
          icon={<Truck className="h-8 w-8" />}
          title="No delivery orders found"
          description="Get started by creating your first delivery order."
          action={
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create DO
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredOrders}
          searchPlaceholder="Search delivery orders..."
          filterComponent={
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusFilter.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
      )}

      <CreateDODialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateDO}
      />

      <ShipConfirmDialog
        open={shipConfirmOpen}
        onOpenChange={setShipConfirmOpen}
        doOrder={doToShip}
        onConfirm={handleShipDO}
      />

      <DODetailSheet
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        deliveryOrder={selectedDO}
        onStatusUpdate={updateDOStatus}
        onShip={(order) => {
          setDoToShip(order);
          setShipConfirmOpen(true);
        }}
      />
    </DashboardLayout>
  );
}
