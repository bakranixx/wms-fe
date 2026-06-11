"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useT } from "@/hooks/use-translations";
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
  const t = useT();
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
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.purchaseOrders.columns.poNumber} />,
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium text-primary">{row.getValue("poNumber")}</span>
      ),
    },
    {
      accessorKey: "vendor",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.purchaseOrders.columns.vendor} />,
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
      header: t.purchaseOrders.columns.warehouse,
      cell: ({ row }) => row.original.warehouse.name,
    },
    {
      accessorKey: "orderDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.purchaseOrders.columns.orderDate} />,
      cell: ({ row }) => format(row.original.orderDate, "MMM dd, yyyy"),
    },
    {
      accessorKey: "expectedDate",
      header: t.purchaseOrders.columns.expectedDate,
      cell: ({ row }) => format(row.original.expectedDate, "MMM dd, yyyy"),
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.purchaseOrders.columns.totalAmount} />,
      cell: ({ row }) => (
        <span className="font-medium">Rp {row.original.totalAmount.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "status",
      header: t.purchaseOrders.columns.status,
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
                {t.purchaseOrders.actions.viewDetails}
              </DropdownMenuItem>
              {po.status === "Draft" && (
                <DropdownMenuItem onClick={() => handleApprove(po)}>
                  <Check className="mr-2 h-4 w-4" />
                  {t.purchaseOrders.actions.approvePO}
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
        title={t.purchaseOrders.title}
        description={t.purchaseOrders.description}
        breadcrumbs={[{ label: t.purchaseOrders.title }]}
        actions={
          <Button onClick={() => router.push("/purchase-orders/create")}>
            <Plus className="mr-2 h-4 w-4" />
            {t.purchaseOrders.createPO}
          </Button>
        }
      />

      {purchaseOrders.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title={t.purchaseOrders.noPOFound}
          description={t.purchaseOrders.noPOFoundDesc}
          action={
            <Button onClick={() => router.push("/purchase-orders/create")}>
              <Plus className="mr-2 h-4 w-4" />
              {t.purchaseOrders.createPO}
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredOrders}
          searchPlaceholder={t.purchaseOrders.searchPlaceholder}
          filterComponent={
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t.common.filterStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.common.allStatus}</SelectItem>
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
