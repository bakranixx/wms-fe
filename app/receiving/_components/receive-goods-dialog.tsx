"use client";

import * as React from "react";
import { ArrowDownToLine, Check, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PurchaseOrder, StockMovement } from "@/types";

export interface ReceiveItemForm {
  poItemId: string;
  productId: string;
  productName: string;
  productSku: string;
  expectedQuantity: number;
  receivedQuantity: number;
  rejectedQuantity: number;
}

export interface ReceiveSubmitData {
  selectedPO: PurchaseOrder;
  receiveItems: ReceiveItemForm[];
  receiverName: string;
  receiveNotes: string;
  stockMovements: StockMovement[];
}

interface ReceiveGoodsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPO: PurchaseOrder | null;
  onSubmit: (data: ReceiveSubmitData) => void;
}

export function ReceiveGoodsDialog({ open, onOpenChange, selectedPO, onSubmit }: ReceiveGoodsDialogProps) {
  const [receiveItems, setReceiveItems] = React.useState<ReceiveItemForm[]>([]);
  const [receiverName, setReceiverName] = React.useState("");
  const [receiveNotes, setReceiveNotes] = React.useState("");

  React.useEffect(() => {
    if (selectedPO && open) {
      setReceiveItems(selectedPO.items.map(item => ({
        poItemId: item.id,
        productId: item.productId,
        productName: item.product.name,
        productSku: item.product.sku,
        expectedQuantity: item.quantity - item.receivedQuantity,
        receivedQuantity: item.quantity - item.receivedQuantity,
        rejectedQuantity: 0,
      })));
      setReceiverName("");
      setReceiveNotes("");
    }
  }, [selectedPO, open]);

  const updateReceiveQuantity = (poItemId: string, field: 'receivedQuantity' | 'rejectedQuantity', value: number) => {
    setReceiveItems(receiveItems.map(item =>
      item.poItemId === poItemId ? { ...item, [field]: value } : item
    ));
  };

  const getTotalReceived = () => receiveItems.reduce((sum, item) => sum + item.receivedQuantity, 0);
  const getTotalRejected = () => receiveItems.reduce((sum, item) => sum + item.rejectedQuantity, 0);

  const handleConfirm = () => {
    if (!receiverName.trim() || getTotalReceived() === 0 || !selectedPO) return;

    const stockMovements: StockMovement[] = receiveItems
      .filter(item => item.receivedQuantity > 0)
      .map((item, index) => {
        const poItem = selectedPO.items.find(i => i.id === item.poItemId)!;
        return {
          id: crypto.randomUUID(),
          transactionId: `TRX-${Date.now()}-${index}`,
          productId: item.productId,
          product: poItem.product,
          movementType: 'INBOUND' as const,
          sourceType: 'PURCHASE_ORDER' as const,
          quantity: item.receivedQuantity,
          warehouseId: selectedPO.warehouseId,
          warehouse: selectedPO.warehouse,
          referenceNumber: selectedPO.poNumber,
          vendorId: selectedPO.vendorId,
          vendor: selectedPO.vendor,
          purchaseOrderId: selectedPO.id,
          userId: 'user-1',
          userName: receiverName.trim(),
          status: 'Posted' as const,
          timestamp: new Date(),
          notes: `Received from ${selectedPO.poNumber} - ${item.receivedQuantity} ${poItem.unit}`,
        };
      });

    onSubmit({
      selectedPO,
      receiveItems,
      receiverName: receiverName.trim(),
      receiveNotes,
      stockMovements,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowDownToLine className="h-5 w-5 text-primary" />
            Receive Goods
          </DialogTitle>
          <DialogDescription>
            Receive goods from purchase order. Stock will be added to inventory after confirmation.
          </DialogDescription>
        </DialogHeader>

        {selectedPO && (
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Package className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Purchase Order</p>
                <p className="text-xl font-bold font-mono text-primary">{selectedPO.poNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Vendor</p>
                <p className="font-medium">{selectedPO.vendor.name}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Receiver Name <span className="text-destructive">*</span></Label>
              <Input
                placeholder="Enter receiver name..."
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="text-base font-semibold">Items to Receive</Label>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Product</TableHead>
                      <TableHead className="w-[100px] text-center">Expected</TableHead>
                      <TableHead className="w-[120px] text-center">Received</TableHead>
                      <TableHead className="w-[120px] text-center">Rejected</TableHead>
                      <TableHead className="w-[100px] text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receiveItems.map((item) => (
                      <TableRow key={item.poItemId}>
                        <TableCell>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{item.productSku}</p>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{item.expectedQuantity}</Badge>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max={item.expectedQuantity}
                            value={item.receivedQuantity}
                            onChange={(e) => updateReceiveQuantity(item.poItemId, 'receivedQuantity', parseInt(e.target.value) || 0)}
                            className="w-24 mx-auto text-center"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={item.rejectedQuantity}
                            onChange={(e) => updateReceiveQuantity(item.poItemId, 'rejectedQuantity', parseInt(e.target.value) || 0)}
                            className="w-24 mx-auto text-center"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          {item.receivedQuantity === 0 ? (
                            <Badge variant="destructive">Rejected</Badge>
                          ) : item.receivedQuantity >= item.expectedQuantity ? (
                            <Badge variant="default">Complete</Badge>
                          ) : (
                            <Badge variant="secondary">Partial</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end gap-4">
                <div className="rounded-lg border bg-emerald-500/10 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Total Received</p>
                  <p className="text-2xl font-bold text-emerald-500">{getTotalReceived()}</p>
                </div>
                {getTotalRejected() > 0 && (
                  <div className="rounded-lg border bg-destructive/10 p-4 text-center">
                    <p className="text-sm text-muted-foreground">Total Rejected</p>
                    <p className="text-2xl font-bold text-destructive">{getTotalRejected()}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Add notes about this receiving..."
                value={receiveNotes}
                onChange={(e) => setReceiveNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!receiverName.trim() || getTotalReceived() === 0}
          >
            <Check className="mr-2 h-4 w-4" />
            Confirm Receive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
