"use client";

import * as React from "react";
import { format } from "date-fns";
import { ArrowLeftRight, Package, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { movementTypeConfig, sourceTypeLabels, statusConfig } from "./constants";
import type { StockMovement } from "@/types";

interface MovementDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movement: StockMovement | null;
}

export function MovementDetailSheet({ open, onOpenChange, movement }: MovementDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            Movement Details
          </SheetTitle>
          <SheetDescription>
            {movement?.transactionId}
          </SheetDescription>
        </SheetHeader>

        {movement && (
          <div className="mt-6 space-y-6">
            {/* Status & Type */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(() => {
                  const config = movementTypeConfig[movement.movementType];
                  const Icon = config.icon;
                  return (
                    <>
                      <div className={`rounded-full p-2 ${config.bgColor}`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <span className={`font-semibold ${config.color}`}>{config.label}</span>
                    </>
                  );
                })()}
              </div>
              <Badge className={`${statusConfig[movement.status].bgColor} ${statusConfig[movement.status].color} border-0`}>
                {movement.status}
              </Badge>
            </div>

            <Separator />

            {/* Product Info */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Product Information
              </h4>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{movement.product.name}</p>
                      <p className="text-sm text-muted-foreground">{movement.product.sku}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-medium">{movement.product.category}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quantity</p>
                      <p className={`font-bold ${movement.quantity > 0 ? "text-emerald-500" : "text-amber-500"}`}>
                        {movement.quantity > 0 ? "+" : ""}{movement.quantity.toLocaleString()} {movement.product.unit}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transaction Details */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Transaction Details
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Source Type</span>
                  <span className="font-medium">{sourceTypeLabels[movement.sourceType]}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Warehouse</span>
                  <span className="font-medium">{movement.warehouse.name}</span>
                </div>
                {movement.location && (
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Bin Location</span>
                    <span className="font-medium">{movement.location.binCode}</span>
                  </div>
                )}
                {movement.referenceNumber && (
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Reference</span>
                    <span className="font-mono font-medium">{movement.referenceNumber}</span>
                  </div>
                )}
                {movement.vendor && (
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Vendor</span>
                    <span className="font-medium">{movement.vendor.name}</span>
                  </div>
                )}
                {movement.garment && (
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Garment/Client</span>
                    <span className="font-medium">{movement.garment.name}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Created By</span>
                  <span className="font-medium">{movement.userName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="font-medium">
                    {format(movement.timestamp, "MMM dd, yyyy HH:mm")}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {movement.notes && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Notes
                </h4>
                <p className="text-sm text-foreground bg-muted/50 rounded-lg p-3">
                  {movement.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            {movement.status === "Draft" && (
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Post Movement
                </Button>
                <Button variant="destructive" className="flex-1">
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
