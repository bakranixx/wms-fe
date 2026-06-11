"use client";

import * as React from "react";
import { format } from "date-fns";
import { PackageCheck } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/page-components";
import { Separator } from "@/components/ui/separator";
import type { Receiving } from "@/types";

interface ReceivingDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiving: Receiving | null;
}

export function ReceivingDetailSheet({ open, onOpenChange, receiving }: ReceivingDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Receiving Details</SheetTitle>
          <SheetDescription>
            View detailed information about this receiving record.
          </SheetDescription>
        </SheetHeader>
        {receiving && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <PackageCheck className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {receiving.purchaseOrder.poNumber}
                </h3>
                <StatusBadge status={receiving.status} />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Vendor</p>
                <p className="mt-1 font-medium">
                  {receiving.purchaseOrder.vendor.name}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Receiving Date</p>
                <p className="mt-1 font-medium">
                  {format(receiving.receivingDate, "MMMM dd, yyyy")}
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Receiver</p>
              <p className="mt-1 font-medium">{receiving.receiverName}</p>
            </div>

            <div>
              <h4 className="mb-3 font-semibold">Received Items</h4>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Expected</TableHead>
                      <TableHead className="text-right">Received</TableHead>
                      <TableHead className="text-right">Rejected</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receiving.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">{item.product.sku}</p>
                        </TableCell>
                        <TableCell className="text-right">{item.expectedQuantity}</TableCell>
                        <TableCell className="text-right text-emerald-500">
                          {item.receivedQuantity}
                        </TableCell>
                        <TableCell className="text-right text-destructive">
                          {item.rejectedQuantity}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {receiving.notes && (
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="mt-1">{receiving.notes}</p>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
