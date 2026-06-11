"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  PackageCheck,
  ScanBarcode,
  Building2,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader, StatusBadge, EmptyState } from "@/components/shared/page-components";
import { DataTable, DataTableColumnHeader } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { mockReceivings, mockPurchaseOrders, mockStockMovements } from "@/lib/mock-data";
import type { Receiving, PurchaseOrder, StockMovement, ReceivingItem } from "@/types";
import { ReceiveGoodsDialog } from "./_components/receive-goods-dialog";
import type { ReceiveSubmitData } from "./_components/receive-goods-dialog";
import { ConfirmReceiveDialog } from "./_components/confirm-receive-dialog";
import { ReceivingDetailSheet } from "./_components/receiving-detail-sheet";
import { useT } from "@/hooks/use-translations";

export default function ReceivingPage() {
  const t = useT();
  const [receivings, setReceivings] = React.useState<Receiving[]>(mockReceivings);
  const [purchaseOrders, setPurchaseOrders] = React.useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [stockMovements, setStockMovements] = React.useState<StockMovement[]>(mockStockMovements);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = React.useState(false);
  const [selectedReceiving, setSelectedReceiving] = React.useState<Receiving | null>(null);
  const [selectedPO, setSelectedPO] = React.useState<PurchaseOrder | null>(null);
  const [scanValue, setScanValue] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [confirmReceiveOpen, setConfirmReceiveOpen] = React.useState(false);
  const [pendingSubmitData, setPendingSubmitData] = React.useState<ReceiveSubmitData | null>(null);

  const openDetail = (receiving: Receiving) => {
    setSelectedReceiving(receiving);
    setIsDetailOpen(true);
  };

  const pendingPOs = purchaseOrders.filter(
    (po) => po.status === "Approved" || po.status === "Partial Received"
  );

  const openReceiveModal = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setIsReceiveOpen(true);
  };

  const handleReceiveSubmit = (data: ReceiveSubmitData) => {
    setPendingSubmitData(data);
    setConfirmReceiveOpen(true);
  };

  const handleReceive = async () => {
    if (!pendingSubmitData) return;

    const { selectedPO, receiveItems, receiverName, receiveNotes, stockMovements: newStockMovements } = pendingSubmitData;

    setIsSubmitting(true);
    setConfirmReceiveOpen(false);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const newReceiving: Receiving = {
      id: crypto.randomUUID(),
      purchaseOrderId: selectedPO.id,
      purchaseOrder: selectedPO,
      receivingDate: new Date(),
      receiverName,
      items: receiveItems.map((item, index) => {
        const poItem = selectedPO.items.find(i => i.id === item.poItemId)!;
        const status = item.receivedQuantity === 0
          ? 'Rejected'
          : item.receivedQuantity >= item.expectedQuantity
            ? 'Received'
            : 'Partial';
        return {
          id: `${index + 1}`,
          poItemId: item.poItemId,
          productId: item.productId,
          product: poItem.product,
          expectedQuantity: item.expectedQuantity,
          receivedQuantity: item.receivedQuantity,
          rejectedQuantity: item.rejectedQuantity,
          status: status as ReceivingItem['status'],
        };
      }),
      status: 'Completed',
      notes: receiveNotes || undefined,
    };

    const updatedPO = {
      ...selectedPO,
      items: selectedPO.items.map(item => {
        const receiveItem = receiveItems.find(r => r.poItemId === item.id);
        if (receiveItem) {
          return {
            ...item,
            receivedQuantity: item.receivedQuantity + receiveItem.receivedQuantity,
          };
        }
        return item;
      }),
      updatedAt: new Date(),
    };

    const allReceived = updatedPO.items.every(item => item.receivedQuantity >= item.quantity);
    const someReceived = updatedPO.items.some(item => item.receivedQuantity > 0);
    updatedPO.status = allReceived ? 'Completed' : someReceived ? 'Partial Received' : updatedPO.status;

    setReceivings([newReceiving, ...receivings]);
    setPurchaseOrders(purchaseOrders.map(po => po.id === selectedPO.id ? updatedPO : po));
    setStockMovements([...newStockMovements, ...stockMovements]);

    setIsSubmitting(false);
    setIsReceiveOpen(false);
    setSelectedPO(null);
    setPendingSubmitData(null);
  };

  const columns: ColumnDef<Receiving>[] = [
    {
      accessorKey: "purchaseOrder",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.receiving.columns.poNumber} />,
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium text-primary">
          {row.original.purchaseOrder.poNumber}
        </span>
      ),
    },
    {
      id: "vendor",
      header: t.receiving.columns.vendor,
      cell: ({ row }) => {
        const vendor = row.original.purchaseOrder.vendor;
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
      accessorKey: "receivingDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.receiving.columns.receivingDate} />,
      cell: ({ row }) => format(row.original.receivingDate, "MMM dd, yyyy"),
    },
    {
      accessorKey: "receiverName",
      header: t.receiving.columns.receiver,
    },
    {
      accessorKey: "items",
      header: t.receiving.columns.items,
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.items.length} {t.common.items}</Badge>
      ),
    },
    {
      accessorKey: "status",
      header: t.receiving.columns.status,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="outline" size="sm" onClick={() => openDetail(row.original)}>
          {t.common.view}
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title={t.receiving.title}
        description={t.receiving.description}
        breadcrumbs={[{ label: t.receiving.title }]}
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ScanBarcode className="h-5 w-5" />
            {t.receiving.scanBarcode}
          </CardTitle>
          <CardDescription>
            {t.receiving.scanDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder={t.receiving.scanPlaceholder}
              value={scanValue}
              onChange={(e) => setScanValue(e.target.value)}
              className="max-w-md font-mono"
            />
            <Button>{t.receiving.search}</Button>
          </div>
        </CardContent>
      </Card>

      {pendingPOs.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold">{t.receiving.pendingPO}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pendingPOs.map((po) => {
              const totalItems = po.items.reduce((sum, item) => sum + item.quantity, 0);
              const receivedItems = po.items.reduce((sum, item) => sum + item.receivedQuantity, 0);
              const progress = Math.round((receivedItems / totalItems) * 100);

              return (
                <Card
                  key={po.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => openReceiveModal(po)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono text-sm font-medium text-primary">{po.poNumber}</p>
                        <p className="text-sm text-muted-foreground">{po.vendor.name}</p>
                      </div>
                      <StatusBadge status={po.status} />
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t.receiving.progress}</span>
                        <span className="font-medium">{receivedItems} / {totalItems}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                      <span>{po.items.length} {t.common.items}</span>
                      <span>{t.receiving.expected}: {format(po.expectedDate, "MMM dd")}</span>
                    </div>
                    <Button className="mt-3 w-full" size="sm">
                      <PackageCheck className="mr-2 h-4 w-4" />
                      {t.receiving.receiveGoods}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-lg font-semibold">{t.receiving.receivingHistory}</h3>
        {receivings.length === 0 ? (
          <EmptyState
            icon={<PackageCheck className="h-8 w-8" />}
            title={t.receiving.noRecords}
            description={t.receiving.noRecordsDesc}
          />
        ) : (
          <DataTable
            columns={columns}
            data={receivings}
            searchPlaceholder={t.receiving.searchPlaceholder}
          />
        )}
      </div>

      <ReceiveGoodsDialog
        open={isReceiveOpen}
        onOpenChange={setIsReceiveOpen}
        selectedPO={selectedPO}
        onSubmit={handleReceiveSubmit}
      />

      <ConfirmReceiveDialog
        open={confirmReceiveOpen}
        onOpenChange={setConfirmReceiveOpen}
        poNumber={pendingSubmitData?.selectedPO.poNumber ?? null}
        totalReceived={pendingSubmitData?.receiveItems.reduce((sum, item) => sum + item.receivedQuantity, 0) ?? 0}
        totalRejected={pendingSubmitData?.receiveItems.reduce((sum, item) => sum + item.rejectedQuantity, 0) ?? 0}
        onConfirm={handleReceive}
      />

      <ReceivingDetailSheet
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        receiving={selectedReceiving}
      />
    </DashboardLayout>
  );
}
