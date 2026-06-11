"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  FileText,
  Building2,
  Calendar,
  Plus,
  Trash2,
  Package,
  Search,
  Printer,
  Check,
  Loader2,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { mockVendors, mockWarehouses, mockProducts } from "@/lib/mock-data";
import { usePurchaseOrdersStore } from "@/stores/ui-store";
import type { Product, Vendor, Warehouse } from "@/types";

const generatePONumber = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 900) + 100;
  return `PO-${year}-${randomNum}`;
};

interface POItemForm {
  id: string;
  product: Product | null;
  quantity: number;
  unit: string;
  price: number;
}

export default function CreatePurchaseOrderPage() {
  const router = useRouter();
  const addPurchaseOrder = usePurchaseOrdersStore((s) => s.addPurchaseOrder);

  const [poNumber, setPONumber] = React.useState("");
  React.useEffect(() => { setPONumber(generatePONumber()); }, []);

  const [selectedVendor, setSelectedVendor] = React.useState<Vendor | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState<Warehouse | null>(null);
  const [expectedDate, setExpectedDate] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [poItems, setPOItems] = React.useState<POItemForm[]>([
    { id: crypto.randomUUID(), product: null, quantity: 1, unit: "", price: 0 },
  ]);
  const [skuSearchOpen, setSkuSearchOpen] = React.useState<number | null>(null);
  const [skuSearchValue, setSkuSearchValue] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const today = format(new Date(), "yyyy-MM-dd");

  const filteredProducts = mockProducts.filter(
    (p) =>
      p.sku.toLowerCase().includes(skuSearchValue.toLowerCase()) ||
      p.name.toLowerCase().includes(skuSearchValue.toLowerCase()) ||
      p.barcode.includes(skuSearchValue),
  );

  const calculateTotal = () =>
    poItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const addItemRow = () =>
    setPOItems([...poItems, { id: crypto.randomUUID(), product: null, quantity: 1, unit: "", price: 0 }]);

  const removeItemRow = (id: string) => {
    if (poItems.length > 1) setPOItems(poItems.filter((i) => i.id !== id));
  };

  const updateItemProduct = (id: string, product: Product) => {
    setPOItems(poItems.map((item) =>
      item.id === id ? { ...item, product, unit: product.unit, price: product.price } : item,
    ));
    setSkuSearchOpen(null);
    setSkuSearchValue("");
  };

  const updateItemQuantity = (id: string, quantity: number) =>
    setPOItems(poItems.map((item) => (item.id === id ? { ...item, quantity } : item)));

  const updateItemPrice = (id: string, price: number) =>
    setPOItems(poItems.map((item) => (item.id === id ? { ...item, price } : item)));

  const isFormValid =
    !!selectedVendor &&
    !!selectedWarehouse &&
    !!expectedDate &&
    poItems.every((item) => item.product !== null);

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    addPurchaseOrder({
      id: crypto.randomUUID(),
      poNumber,
      vendorId: selectedVendor!.id,
      vendor: selectedVendor!,
      warehouseId: selectedWarehouse!.id,
      warehouse: selectedWarehouse!,
      orderDate: new Date(),
      expectedDate: new Date(expectedDate),
      status: "Draft",
      items: poItems.map((item, index) => ({
        id: `${index + 1}`,
        productId: item.product!.id,
        product: item.product!,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        total: item.quantity * item.price,
        receivedQuantity: 0,
      })),
      totalAmount: calculateTotal(),
      notes: notes || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    setIsSubmitting(false);
    router.push("/purchase-orders");
  };

  const handlePrint = () => {
    const content = document.getElementById("po-preview-inner");
    if (!content) return;
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Purchase Order - ${poNumber}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Helvetica Neue',Arial,sans-serif;color:#111;background:#fff;padding:40px;font-size:13px}
    .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #e5e7eb;padding-bottom:24px;margin-bottom:28px}
    .title{font-size:26px;font-weight:700;color:#1a1a2e;letter-spacing:-0.5px}
    .subtitle{font-size:11px;color:#6b7280;margin-top:4px}
    .po-num{text-align:right}
    .po-num .num{font-size:18px;font-weight:700;font-family:monospace;color:#2563eb}
    .po-num .dt{font-size:11px;color:#6b7280;margin-top:4px}
    .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px}
    .box{border:1px solid #e5e7eb;border-radius:8px;padding:14px}
    .box-label{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#9ca3af;margin-bottom:8px}
    .box-name{font-weight:600;font-size:14px;margin-bottom:3px}
    .box-line{font-size:12px;color:#6b7280;margin-bottom:2px}
    table{width:100%;border-collapse:collapse;margin-bottom:16px}
    thead tr{background:#f3f4f6}
    th{padding:9px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;border-bottom:1px solid #e5e7eb;font-weight:600}
    td{padding:9px 12px;border-bottom:1px solid #f3f4f6;font-size:12px;vertical-align:middle}
    .tr{text-align:right}
    .sku{font-family:monospace;font-size:11px;color:#6b7280}
    .total-row{display:flex;justify-content:flex-end;margin-bottom:20px}
    .total-box{border:1px solid #e5e7eb;border-radius:8px;padding:14px 20px;text-align:right;min-width:200px}
    .total-label{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#9ca3af}
    .total-amt{font-size:22px;font-weight:700;color:#2563eb;margin-top:4px}
    .notes{border:1px solid #e5e7eb;border-radius:8px;padding:14px;background:#f9fafb;margin-bottom:32px}
    .notes-label{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#9ca3af;margin-bottom:6px}
    .notes-text{font-size:12px;color:#374151}
    .sigs{display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:40px;padding-top:24px;border-top:1px solid #e5e7eb}
    .sig{text-align:center}
    .sig-line{border-top:1px solid #9ca3af;margin-top:52px;padding-top:6px;font-size:11px;color:#6b7280}
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">PURCHASE ORDER</div>
      <div class="subtitle">WMS Pro &mdash; Warehouse Management System</div>
    </div>
    <div class="po-num">
      <div class="num">${poNumber || "—"}</div>
      <div class="dt">Order Date: ${format(new Date(), "MMMM dd, yyyy")}</div>
    </div>
  </div>

  <div class="info-grid">
    <div class="box">
      <div class="box-label">Vendor</div>
      ${selectedVendor
        ? `<div class="box-name">${selectedVendor.name}</div>
           <div class="box-line">${selectedVendor.companyName}</div>
           <div class="box-line">${selectedVendor.address}, ${selectedVendor.city}</div>
           <div class="box-line">PIC: ${selectedVendor.picName} &bull; ${selectedVendor.phone}</div>`
        : `<div class="box-line" style="color:#9ca3af;font-style:italic">Not selected</div>`}
    </div>
    <div class="box">
      <div class="box-label">Deliver To</div>
      ${selectedWarehouse
        ? `<div class="box-name">${selectedWarehouse.name}</div>
           <div class="box-line">Code: ${selectedWarehouse.code}</div>
           <div class="box-line">${selectedWarehouse.address}</div>`
        : `<div class="box-line" style="color:#9ca3af;font-style:italic">Not selected</div>`}
      <div style="margin-top:12px;padding-top:10px;border-top:1px solid #f3f4f6">
        <div class="box-label">Expected Delivery</div>
        <div style="font-size:13px;font-weight:600;margin-top:2px">${expectedDate ? format(new Date(expectedDate), "MMMM dd, yyyy") : "—"}</div>
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:36px">#</th>
        <th>Product</th>
        <th class="tr" style="width:90px">Qty</th>
        <th class="tr" style="width:120px">Unit Price</th>
        <th class="tr" style="width:130px">Total</th>
      </tr>
    </thead>
    <tbody>
      ${poItems.length === 0 || poItems.every((i) => !i.product)
        ? `<tr><td colspan="5" style="text-align:center;padding:24px;color:#9ca3af;font-style:italic">No items added</td></tr>`
        : poItems
            .map(
              (item, idx) => `
      <tr>
        <td style="color:#9ca3af">${idx + 1}</td>
        <td>${item.product
          ? `<div style="font-weight:600;font-size:12px">${item.product.name}</div><div class="sku">${item.product.sku}</div>`
          : `<span style="color:#9ca3af;font-style:italic">—</span>`}</td>
        <td class="tr">${item.quantity} ${item.unit}</td>
        <td class="tr">Rp ${item.price.toLocaleString()}</td>
        <td class="tr" style="font-weight:600">Rp ${(item.quantity * item.price).toLocaleString()}</td>
      </tr>`,
            )
            .join("")}
    </tbody>
  </table>

  <div class="total-row">
    <div class="total-box">
      <div class="total-label">Total Amount</div>
      <div class="total-amt">Rp ${calculateTotal().toLocaleString()}</div>
    </div>
  </div>

  ${notes ? `<div class="notes"><div class="notes-label">Notes</div><div class="notes-text">${notes}</div></div>` : ""}

  <div class="sigs">
    <div class="sig"><div class="sig-line">Prepared by</div></div>
    <div class="sig"><div class="sig-line">Approved by</div></div>
  </div>
</body>
</html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 300);
  };

  const previewDate = expectedDate ? format(new Date(expectedDate), "MMMM dd, yyyy") : "—";
  const orderDateStr = format(new Date(), "MMMM dd, yyyy");

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Create Purchase Order
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Fill in the form and review the live preview before submitting
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_460px] gap-6 items-start">
        {/* ── LEFT: Form ── */}
        <div className="space-y-5">
          {/* PO Number */}
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">PO Number (Auto Generated)</p>
                <p className="text-xl font-bold font-mono text-primary">{poNumber || "—"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Vendor */}
                <div className="space-y-2">
                  <Label>Vendor <span className="text-destructive">*</span></Label>
                  <Select
                    onValueChange={(v) =>
                      setSelectedVendor(mockVendors.find((x) => x.id === v) ?? null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockVendors.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {v.name}
                            <Badge variant="outline" className="text-xs ml-1">
                              {v.vendorType}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedVendor && (
                    <div className="rounded-lg border p-3 text-sm bg-muted/30">
                      <p className="font-medium">{selectedVendor.companyName}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedVendor.address}, {selectedVendor.city}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PIC: {selectedVendor.picName}
                      </p>
                    </div>
                  )}
                </div>

                {/* Warehouse */}
                <div className="space-y-2">
                  <Label>Destination Warehouse <span className="text-destructive">*</span></Label>
                  <Select
                    onValueChange={(v) =>
                      setSelectedWarehouse(mockWarehouses.find((x) => x.id === v) ?? null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockWarehouses.map((w) => (
                        <SelectItem key={w.id} value={w.id}>
                          {w.name} ({w.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedWarehouse && (
                    <div className="rounded-lg border p-3 text-sm bg-muted/30">
                      <p className="font-medium">{selectedWarehouse.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedWarehouse.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Expected Date */}
              <div className="space-y-2">
                <Label>Expected Delivery Date <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    min={today}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold">Order Items</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addItemRow}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-4 w-[280px]">Product</TableHead>
                      <TableHead className="w-24">Qty</TableHead>
                      <TableHead className="w-20">Unit</TableHead>
                      <TableHead className="w-36">Price (Rp)</TableHead>
                      <TableHead className="w-32">Total</TableHead>
                      <TableHead className="w-12 pr-4" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {poItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="pl-4">
                          <Popover
                            open={skuSearchOpen === index}
                            onOpenChange={(open) => setSkuSearchOpen(open ? index : null)}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal h-9"
                              >
                                {item.product ? (
                                  <div className="flex items-center gap-2 truncate">
                                    <Package className="h-4 w-4 shrink-0 text-primary" />
                                    <span className="font-mono text-xs">{item.product.sku}</span>
                                    <span className="truncate">{item.product.name}</span>
                                  </div>
                                ) : (
                                  <span className="flex items-center gap-2 text-muted-foreground">
                                    <Search className="h-4 w-4" />
                                    Search SKU...
                                  </span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[420px] p-0" align="start">
                              <Command>
                                <CommandInput
                                  placeholder="Search SKU, barcode, or name..."
                                  value={skuSearchValue}
                                  onValueChange={setSkuSearchValue}
                                />
                                <CommandList>
                                  <CommandEmpty>No products found.</CommandEmpty>
                                  <CommandGroup heading="Products">
                                    {filteredProducts.map((p) => (
                                      <CommandItem
                                        key={p.id}
                                        value={`${p.sku} ${p.name} ${p.barcode}`}
                                        onSelect={() => updateItemProduct(item.id, p)}
                                      >
                                        <div className="flex items-center gap-3 w-full">
                                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                                            <Package className="h-4 w-4" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{p.name}</p>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                              <span className="font-mono">{p.sku}</span>
                                              <span>·</span>
                                              <span>Stock: {p.stock} {p.unit}</span>
                                              <span>·</span>
                                              <span className="text-primary font-medium">Rp {p.price.toLocaleString()}</span>
                                            </div>
                                          </div>
                                          <Badge variant="outline" className="text-xs shrink-0">
                                            {p.category}
                                          </Badge>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              updateItemQuantity(item.id, parseInt(e.target.value) || 1)
                            }
                            className="w-20 h-9"
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{item.unit || "—"}</span>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            value={item.price}
                            onChange={(e) =>
                              updateItemPrice(item.id, parseInt(e.target.value) || 0)
                            }
                            className="w-32 h-9"
                          />
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-sm">
                            Rp {(item.quantity * item.price).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="pr-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeItemRow(item.id)}
                            disabled={poItems.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end p-4 border-t">
                <div className="rounded-lg bg-muted/50 border px-6 py-3 text-right">
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">
                    Rp {calculateTotal().toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add notes for this purchase order..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pb-8">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Create Purchase Order
                </>
              )}
            </Button>
          </div>
        </div>

        {/* ── RIGHT: Live Preview ── */}
        <div className="xl:sticky xl:top-6 xl:self-start">
          <Card className="overflow-hidden">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-muted/30 border-b">
              <CardTitle className="text-sm font-semibold">Live Preview</CardTitle>
              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 h-8">
                <Printer className="h-3.5 w-3.5" />
                Print / Export
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-y-auto max-h-[calc(100vh-180px)]">
                {/* The printable preview area */}
                <div
                  id="po-preview-inner"
                  className="p-6 bg-white text-gray-900 text-[13px] leading-relaxed"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between pb-5 border-b-2 border-gray-200 mb-5">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        PURCHASE ORDER
                      </h1>
                      <p className="text-[11px] text-gray-500 mt-1">
                        WMS Pro — Warehouse Management System
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold font-mono text-blue-600">
                        {poNumber || "PO-XXXX-XXX"}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Order Date: {orderDateStr}
                      </p>
                    </div>
                  </div>

                  {/* Vendor & Warehouse */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2 font-semibold">
                        Vendor
                      </p>
                      {selectedVendor ? (
                        <>
                          <p className="font-semibold text-sm">{selectedVendor.name}</p>
                          <p className="text-xs text-gray-500">{selectedVendor.companyName}</p>
                          <p className="text-xs text-gray-500 mt-1">{selectedVendor.address}</p>
                          <p className="text-xs text-gray-500">{selectedVendor.city}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            PIC: {selectedVendor.picName}
                          </p>
                          <p className="text-xs text-gray-500">{selectedVendor.phone}</p>
                        </>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Not selected</p>
                      )}
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2 font-semibold">
                        Deliver To
                      </p>
                      {selectedWarehouse ? (
                        <>
                          <p className="font-semibold text-sm">{selectedWarehouse.name}</p>
                          <p className="text-xs text-gray-500">Code: {selectedWarehouse.code}</p>
                          <p className="text-xs text-gray-500 mt-1">{selectedWarehouse.address}</p>
                        </>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Not selected</p>
                      )}
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                          Expected Delivery
                        </p>
                        <p className="text-sm font-semibold mt-0.5">{previewDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items table */}
                  <table className="w-full text-xs border-collapse mb-4">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-200 w-7">
                          #
                        </th>
                        <th className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-200">
                          Product
                        </th>
                        <th className="text-right py-2 px-2 text-[10px] uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-200 w-16">
                          Qty
                        </th>
                        <th className="text-right py-2 px-2 text-[10px] uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-200 w-24">
                          Unit Price
                        </th>
                        <th className="text-right py-2 px-2 text-[10px] uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-200 w-24">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {poItems.every((i) => !i.product) ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center py-6 text-xs text-gray-400 italic"
                          >
                            No items added yet
                          </td>
                        </tr>
                      ) : (
                        poItems.map((item, idx) => (
                          <tr key={item.id} className="border-b border-gray-100">
                            <td className="py-2 px-2 text-gray-400">{idx + 1}</td>
                            <td className="py-2 px-2">
                              {item.product ? (
                                <>
                                  <p className="font-semibold text-[12px] text-gray-800">
                                    {item.product.name}
                                  </p>
                                  <p className="font-mono text-[10px] text-gray-500">
                                    {item.product.sku}
                                  </p>
                                </>
                              ) : (
                                <span className="text-gray-400 italic">—</span>
                              )}
                            </td>
                            <td className="py-2 px-2 text-right text-gray-700">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="py-2 px-2 text-right text-gray-700">
                              Rp {item.price.toLocaleString()}
                            </td>
                            <td className="py-2 px-2 text-right font-semibold text-gray-800">
                              Rp {(item.quantity * item.price).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* Total */}
                  <div className="flex justify-end mb-5">
                    <div className="border border-gray-200 rounded-lg px-4 py-3 text-right min-w-[180px]">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                        Total Amount
                      </p>
                      <p className="text-xl font-bold text-blue-600 mt-0.5">
                        Rp {calculateTotal().toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  {notes && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 mb-6">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                        Notes
                      </p>
                      <p className="text-xs text-gray-700">{notes}</p>
                    </div>
                  )}

                  {/* Signature */}
                  <div className="grid grid-cols-2 gap-8 mt-8 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="h-12 border-b border-gray-300 mb-2" />
                      <p className="text-[10px] text-gray-500">Prepared by</p>
                    </div>
                    <div className="text-center">
                      <div className="h-12 border-b border-gray-300 mb-2" />
                      <p className="text-[10px] text-gray-500">Approved by</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
