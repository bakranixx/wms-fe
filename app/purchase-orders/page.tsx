"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Plus,
  Eye,
  MoreHorizontal,
  FileText,
  Building2,
  Check,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PODetailSheet } from "./_components/po-detail-sheet";
import { usePurchaseOrdersStore } from "@/stores/ui-store";
import type { PurchaseOrder, POStatus } from "@/types";

const statusFilter: POStatus[] = ["Draft", "Approved", "Partial Received", "Completed", "Cancelled"];

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const { purchaseOrders, approvePurchaseOrder } = usePurchaseOrdersStore();
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [selectedPO, setSelectedPO] = React.useState<PurchaseOrder | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<string>("all");

  const filteredOrders = React.useMemo(() => {
    if (filterStatus === "all") return purchaseOrders;
    return purchaseOrders.filter((po) => po.status === filterStatus);
  }, [purchaseOrders, filterStatus]);

  const openDetail = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setIsDetailOpen(true);
  };

  const handleApprove = (po: PurchaseOrder) => {
    approvePurchaseOrder(po.id);
    setSelectedPO((prev) =>
      prev?.id === po.id ? { ...prev, status: "Approved" as POStatus } : prev,
    );
  };

  const columns: ColumnDef<PurchaseOrder>[] = [
    {
      accessorKey: "poNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="PO Number" />,
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium text-primary">{row.getValue("poNumber")}</span>
      ),
    },
    {
      accessorKey: "vendor",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Vendor" />,
      cell: ({ row }) => {
        const vendor = row.original.vendor;
        return (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">{vendor.name}</p>
              <p className="text-xs text-muted-foreground">{vendor.vendorType}</p>
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
      accessorKey: "orderDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Order Date" />,
      cell: ({ row }) => format(row.original.orderDate, "MMM dd, yyyy"),
    },
    {
      accessorKey: "expectedDate",
      header: "Expected Date",
      cell: ({ row }) => format(row.original.expectedDate, "MMM dd, yyyy"),
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total Amount" />,
      cell: ({ row }) => (
        <span className="font-medium">Rp {row.original.totalAmount.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const po = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openDetail(po)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {po.status === "Draft" && (
                <DropdownMenuItem onClick={() => handleApprove(po)}>
                  <Check className="mr-2 h-4 w-4" />
                  Approve PO
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
        title="Purchase Orders"
        description="Manage inbound orders from vendors"
        breadcrumbs={[{ label: "Purchase Orders" }]}
        actions={
          <Button onClick={() => router.push("/purchase-orders/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Create PO
          </Button>
        }
      />

      {purchaseOrders.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title="No purchase orders found"
          description="Get started by creating your first purchase order."
          action={
            <Button onClick={() => router.push("/purchase-orders/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Create PO
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredOrders}
          searchPlaceholder="Search purchase orders..."
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

      <PODetailSheet
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        purchaseOrder={selectedPO}
        onApprove={handleApprove}
      />
    </DashboardLayout>
  );
}
