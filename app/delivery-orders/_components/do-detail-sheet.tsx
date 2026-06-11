"use client";

import { format } from "date-fns";
import { Truck, Shirt, Calendar, ArrowUpFromLine } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/page-components";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DeliveryOrder, DOStatus } from "@/types";

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

interface DODetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deliveryOrder: DeliveryOrder | null;
  onStatusUpdate: (order: DeliveryOrder, newStatus: DOStatus) => void;
  onShip: (order: DeliveryOrder) => void;
}

export function DODetailSheet({
  open,
  onOpenChange,
  deliveryOrder,
  onStatusUpdate,
  onShip,
}: DODetailSheetProps) {
  if (!deliveryOrder) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Delivery Order Details</SheetTitle>
          <SheetDescription>
            View detailed information about this delivery order.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Truck className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{deliveryOrder.doNumber}</h3>
                <StatusBadge status={deliveryOrder.status} />
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <p className="mb-3 text-sm font-medium">Order Progress</p>
            <Progress value={getStatusProgress(deliveryOrder.status)} className="h-2" />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Draft</span>
              <span>Picking</span>
              <span>Packing</span>
              <span>Shipped</span>
              <span>Completed</span>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shirt className="h-4 w-4" />
                Client
              </div>
              <p className="mt-1 font-medium">{deliveryOrder.garment.name}</p>
              <p className="text-sm text-muted-foreground">{deliveryOrder.garment.brand}</p>
              <Badge variant="outline" className="mt-2">{deliveryOrder.garment.productionType}</Badge>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Delivery Date
              </div>
              <p className="mt-1 font-medium">{format(deliveryOrder.deliveryDate, "MMMM dd, yyyy")}</p>
              <p className="text-sm text-muted-foreground">
                From: {deliveryOrder.warehouse.name}
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Order Items</h4>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                    <TableHead className="text-right">Requested</TableHead>
                    <TableHead className="text-right">Allocated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveryOrder.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">{item.product.sku}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.availableStock}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.requestedQuantity}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={item.allocatedQuantity < item.requestedQuantity ? "text-amber-500" : "text-emerald-500"}>
                          {item.allocatedQuantity}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {deliveryOrder.notes && (
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="mt-1">{deliveryOrder.notes}</p>
            </div>
          )}

          <div className="flex gap-2">
            {deliveryOrder.status === "Draft" && (
              <Button className="flex-1" onClick={() => onStatusUpdate(deliveryOrder, "Picking")}>
                Start Picking
              </Button>
            )}
            {deliveryOrder.status === "Picking" && (
              <Button className="flex-1" onClick={() => onStatusUpdate(deliveryOrder, "Packing")}>
                Complete Picking
              </Button>
            )}
            {deliveryOrder.status === "Packing" && (
              <Button className="flex-1" onClick={() => onShip(deliveryOrder)}>
                <ArrowUpFromLine className="mr-2 h-4 w-4" />
                Mark as Shipped
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
