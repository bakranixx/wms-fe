"use client";

import { FileText, Check, Building2, Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/page-components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PurchaseOrder, POStatus } from "@/types";

interface PODetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseOrder: PurchaseOrder | null;
  onApprove: (po: PurchaseOrder) => void;
}

export function PODetailSheet({
  open,
  onOpenChange,
  purchaseOrder,
  onApprove,
}: PODetailSheetProps) {
  if (!purchaseOrder) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Purchase Order Details</SheetTitle>
          <SheetDescription>
            View detailed information about this purchase order.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{purchaseOrder.poNumber}</h3>
                <StatusBadge status={purchaseOrder.status} />
              </div>
            </div>
            {purchaseOrder.status === "Draft" && (
              <Button onClick={() => onApprove(purchaseOrder)}>
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
            )}
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                Vendor
              </div>
              <p className="mt-1 font-medium">{purchaseOrder.vendor.name}</p>
              <p className="text-sm text-muted-foreground">{purchaseOrder.vendor.companyName}</p>
              <Badge variant="outline" className="mt-2">{purchaseOrder.vendor.vendorType}</Badge>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                Warehouse
              </div>
              <p className="mt-1 font-medium">{purchaseOrder.warehouse.name}</p>
              <p className="text-sm text-muted-foreground">{purchaseOrder.warehouse.code}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Order Date
              </div>
              <p className="mt-1 font-medium">{format(purchaseOrder.orderDate, "MMMM dd, yyyy")}</p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Expected Date
              </div>
              <p className="mt-1 font-medium">{format(purchaseOrder.expectedDate, "MMMM dd, yyyy")}</p>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Order Items</h4>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Received</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrder.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">{item.product.sku}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity} {item.unit}
                      </TableCell>
                      <TableCell className="text-right">
                        Rp {item.price.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        Rp {item.total.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            item.receivedQuantity < item.quantity
                              ? "text-amber-500"
                              : "text-emerald-500"
                          }
                        >
                          {item.receivedQuantity} / {item.quantity}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="rounded-lg border bg-muted/50 p-4 text-right">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">Rp {purchaseOrder.totalAmount.toLocaleString()}</p>
            </div>
          </div>

          {purchaseOrder.notes && (
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="mt-1">{purchaseOrder.notes}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
