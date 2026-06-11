"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Package,
  Barcode,
  AlertTriangle,
  FileText,
  Truck,
  Hash,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  mockProducts,
  mockVendors,
  mockGarments,
  mockWarehouses,
  mockLocations,
  mockPurchaseOrders,
  mockDeliveryOrders,
} from "@/lib/mock-data";
import { movementTypeConfig } from "./constants";
import type { StockMovement, Product, MovementType, SourceType } from "@/types";

interface AddMovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (movement: StockMovement) => void;
  onReset: () => void;
}

export function AddMovementDialog({ open, onOpenChange, onSubmit, onReset }: AddMovementDialogProps) {
  const [movementType, setMovementType] = React.useState<MovementType>("INBOUND");
  const [sourceType, setSourceType] = React.useState<SourceType>("MANUAL");
  const [skuSearch, setSkuSearch] = React.useState("");
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState("");
  const [selectedLocation, setSelectedLocation] = React.useState("");
  const [selectedVendor, setSelectedVendor] = React.useState("");
  const [selectedGarment, setSelectedGarment] = React.useState("");
  const [selectedPO, setSelectedPO] = React.useState("");
  const [selectedDO, setSelectedDO] = React.useState("");
  const [referenceNumber, setReferenceNumber] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [adjustmentReason, setAdjustmentReason] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const handleSkuSearch = (value: string) => {
    setSkuSearch(value);
    const product = mockProducts.find(
      (p) => p.sku.toLowerCase() === value.toLowerCase() || p.barcode === value
    );
    if (product) {
      setSelectedProduct(product);
    }
  };

  const resetForm = () => {
    setMovementType("INBOUND");
    setSourceType("MANUAL");
    setSkuSearch("");
    setSelectedProduct(null);
    setSelectedWarehouse("");
    setSelectedLocation("");
    setSelectedVendor("");
    setSelectedGarment("");
    setSelectedPO("");
    setSelectedDO("");
    setReferenceNumber("");
    setQuantity("");
    setAdjustmentReason("");
    setNotes("");
  };

  const handlePOSelect = (poId: string) => {
    setSelectedPO(poId);
    const po = mockPurchaseOrders.find((p) => p.id === poId);
    if (po) {
      setSelectedVendor(po.vendorId);
      setSelectedWarehouse(po.warehouseId);
      setReferenceNumber(po.poNumber);
    }
  };

  const handleDOSelect = (doId: string) => {
    setSelectedDO(doId);
    const deliveryOrder = mockDeliveryOrders.find((d) => d.id === doId);
    if (deliveryOrder) {
      setSelectedGarment(deliveryOrder.garmentId);
      setSelectedWarehouse(deliveryOrder.warehouseId);
      setReferenceNumber(deliveryOrder.doNumber);
    }
  };

  const handleSubmit = () => {
    if (!selectedProduct || !selectedWarehouse || !quantity) return;

    const newMovement: StockMovement = {
      id: crypto.randomUUID(),
      transactionId: `TRX-2024-${crypto.randomUUID().slice(0, 4).toUpperCase()}`,
      productId: selectedProduct.id,
      product: selectedProduct,
      movementType,
      sourceType,
      quantity: movementType === "OUTBOUND" ? -Math.abs(Number(quantity)) : Number(quantity),
      warehouseId: selectedWarehouse,
      warehouse: mockWarehouses.find((w) => w.id === selectedWarehouse)!,
      locationId: selectedLocation || undefined,
      location: mockLocations.find((l) => l.id === selectedLocation),
      referenceNumber: referenceNumber || undefined,
      vendorId: selectedVendor || undefined,
      vendor: mockVendors.find((v) => v.id === selectedVendor),
      garmentId: selectedGarment || undefined,
      garment: mockGarments.find((g) => g.id === selectedGarment),
      purchaseOrderId: selectedPO || undefined,
      deliveryOrderId: selectedDO || undefined,
      adjustmentReason: adjustmentReason || undefined,
      userId: "user-1",
      userName: "Admin User",
      status: "Draft",
      timestamp: new Date(),
      notes: notes || undefined,
    };

    onSubmit(newMovement);
    resetForm();
  };

  const filteredLocations = React.useMemo(() => {
    if (!selectedWarehouse) return [];
    return mockLocations.filter((l) => l.warehouseId === selectedWarehouse);
  }, [selectedWarehouse]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            Add Stock Movement
          </DialogTitle>
          <DialogDescription>
            Create a new inventory movement transaction
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <div className="px-6 py-4 space-y-6">
            {/* Movement Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Movement Type</Label>
              <div className="grid grid-cols-4 gap-3">
                {(Object.keys(movementTypeConfig) as MovementType[]).map((type) => {
                  const config = movementTypeConfig[type];
                  const Icon = config.icon;
                  const isSelected = movementType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setMovementType(type);
                        if (type === "INBOUND") setSourceType("MANUAL");
                        else if (type === "OUTBOUND") setSourceType("MANUAL");
                        else if (type === "ADJUSTMENT") setSourceType("ADJUSTMENT");
                        else if (type === "TRANSFER") setSourceType("TRANSFER");
                      }}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                        isSelected
                          ? `border-primary ${config.bgColor}`
                          : "border-border/50 hover:border-border"
                      }`}
                    >
                      <div className={`rounded-full p-2 ${config.bgColor}`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? config.color : ""}`}>
                        {config.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Source Type (for Inbound/Outbound) */}
            <AnimatePresence mode="wait">
              {(movementType === "INBOUND" || movementType === "OUTBOUND") && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <Label className="text-sm font-semibold">Source Type</Label>
                  <Select value={sourceType} onValueChange={(v) => setSourceType(v as SourceType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANUAL">Manual Entry</SelectItem>
                      {movementType === "INBOUND" && (
                        <SelectItem value="PURCHASE_ORDER">From Purchase Order</SelectItem>
                      )}
                      {movementType === "OUTBOUND" && (
                        <SelectItem value="DELIVERY_ORDER">From Delivery Order</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </AnimatePresence>

            {/* PO Selector */}
            <AnimatePresence mode="wait">
              {sourceType === "PURCHASE_ORDER" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <Label className="text-sm font-semibold">Select Purchase Order</Label>
                  <Select value={selectedPO} onValueChange={handlePOSelect}>
                    <SelectTrigger>
                      <FileText className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select PO" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPurchaseOrders
                        .filter((po) => po.status === "Approved" || po.status === "Partial Received")
                        .map((po) => (
                          <SelectItem key={po.id} value={po.id}>
                            {po.poNumber} - {po.vendor.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </AnimatePresence>

            {/* DO Selector */}
            <AnimatePresence mode="wait">
              {sourceType === "DELIVERY_ORDER" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <Label className="text-sm font-semibold">Select Delivery Order</Label>
                  <Select value={selectedDO} onValueChange={handleDOSelect}>
                    <SelectTrigger>
                      <Truck className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select DO" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDeliveryOrders
                        .filter((dOrder) => dOrder.status === "Picking" || dOrder.status === "Packing")
                        .map((dOrder) => (
                          <SelectItem key={dOrder.id} value={dOrder.id}>
                            {dOrder.doNumber} - {dOrder.garment.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </AnimatePresence>

            <Separator />

            {/* Product Search */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Product Lookup</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter SKU or scan barcode..."
                  value={skuSearch}
                  onChange={(e) => handleSkuSearch(e.target.value)}
                  className="pl-10"
                />
                <Barcode className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>

              {/* Product Quick Select */}
              <div className="flex flex-wrap gap-2">
                {mockProducts.slice(0, 5).map((product) => (
                  <Button
                    key={product.id}
                    type="button"
                    variant={selectedProduct?.id === product.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedProduct(product);
                      setSkuSearch(product.sku);
                    }}
                    className="text-xs"
                  >
                    {product.sku}
                  </Button>
                ))}
              </div>
            </div>

            {/* Product Detail Card */}
            <AnimatePresence mode="wait">
              {selectedProduct && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-foreground">
                              {selectedProduct.name}
                            </h4>
                            {selectedProduct.stock < selectedProduct.minStock && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                Low Stock
                              </Badge>
                            )}
                          </div>
                          <div className="mt-2 grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">SKU</p>
                              <p className="font-medium">{selectedProduct.sku}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Category</p>
                              <p className="font-medium">{selectedProduct.category}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Color / Size</p>
                              <p className="font-medium">
                                {selectedProduct.color} / {selectedProduct.size}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Current Stock</p>
                              <p
                                className={`font-bold ${
                                  selectedProduct.stock < selectedProduct.minStock
                                    ? "text-red-500"
                                    : "text-emerald-500"
                                }`}
                              >
                                {selectedProduct.stock.toLocaleString()} {selectedProduct.unit}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Vendor/Garment Selection */}
            <AnimatePresence mode="wait">
              {movementType === "INBOUND" && sourceType === "MANUAL" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <Label className="text-sm font-semibold">Vendor</Label>
                  <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockVendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.code} - {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {movementType === "OUTBOUND" && sourceType === "MANUAL" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <Label className="text-sm font-semibold">Garment / Client</Label>
                  <Select value={selectedGarment} onValueChange={setSelectedGarment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select garment/client" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockGarments.map((garment) => (
                        <SelectItem key={garment.id} value={garment.id}>
                          {garment.code} - {garment.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Adjustment Reason */}
            <AnimatePresence mode="wait">
              {movementType === "ADJUSTMENT" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <Label className="text-sm font-semibold">Adjustment Reason</Label>
                  <Select value={adjustmentReason} onValueChange={setAdjustmentReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Stock count discrepancy">Stock count discrepancy</SelectItem>
                      <SelectItem value="Damaged goods">Damaged goods</SelectItem>
                      <SelectItem value="Expired items">Expired items</SelectItem>
                      <SelectItem value="Found missing stock">Found missing stock</SelectItem>
                      <SelectItem value="Quality rejection">Quality rejection</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Warehouse & Location */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Warehouse</Label>
                <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockWarehouses.map((wh) => (
                      <SelectItem key={wh.id} value={wh.id}>
                        {wh.code} - {wh.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Bin Location</Label>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                  disabled={!selectedWarehouse}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredLocations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.binCode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reference Number & Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Reference Number</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter reference..."
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Quantity</Label>
                <Input
                  type="number"
                  placeholder="Enter quantity..."
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Notes</Label>
              <Textarea
                placeholder="Add any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t border-border/50">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedProduct || !selectedWarehouse || !quantity}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Movement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
