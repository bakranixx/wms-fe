"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Truck,
  Building2,
  Calendar,
  Shirt,
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
import { Separator } from "@/components/ui/separator";
import { mockGarments, mockWarehouses, mockProducts } from "@/lib/mock-data";
import type { DeliveryOrder, Garment, Warehouse, Product } from "@/types";

const generateDONumber = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 900) + 100;
  return `DO-${year}-${randomNum}`;
};

interface DOItemForm {
  id: string;
  product: Product | null;
  requestedQuantity: number;
  availableStock: number;
}

export default function CreateDeliveryOrderPage() {
  const router = useRouter();

  const [doNumber, setDONumber] = React.useState("");
  React.useEffect(() => { setDONumber(generateDONumber()); }, []);

  const [selectedGarment, setSelectedGarment] = React.useState<Garment | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState<Warehouse | null>(null);
  const [deliveryDate, setDeliveryDate] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [doItems, setDOItems] = React.useState<DOItemForm[]>([
    { id: crypto.randomUUID(), product: null, requestedQuantity: 1, availableStock: 0 },
  ]);
  const [skuSearchOpen, setSkuSearchOpen] = React.useState<number | null>(null);
  const [skuSearchValue, setSkuSearchValue] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const today = format(new Date(), "yyyy-MM-dd");

  const filteredProducts = mockProducts.filter(
    (p) =>
      (p.sku.toLowerCase().includes(skuSearchValue.toLowerCase()) ||
      p.name.toLowerCase().includes(skuSearchValue.toLowerCase()) ||
      p.barcode.includes(skuSearchValue)) &&
      p.stock > 0
  );

  const totalItems = doItems.filter(i => i.product).length;
  const totalUnits = doItems.reduce((sum, i) => sum + i.requestedQuantity, 0);

  const addItemRow = () =>
    setDOItems([...doItems, { id: crypto.randomUUID(), product: null, requestedQuantity: 1, availableStock: 0 }]);

  const removeItemRow = (id: string) => {
    if (doItems.length > 1) setDOItems(doItems.filter((i) => i.id !== id));
  };

  const updateItemProduct = (id: string, product: Product) => {
    setDOItems(doItems.map((item) =>
      item.id === id ? { ...item, product, availableStock: product.stock } : item
    ));
    setSkuSearchOpen(null);
    setSkuSearchValue("");
  };

  const updateItemQuantity = (id: string, quantity: number) =>
    setDOItems(doItems.map((item) => (item.id === id ? { ...item, requestedQuantity: quantity } : item)));

  const isFormValid =
    !!selectedGarment &&
    !!selectedWarehouse &&
    !!deliveryDate &&
    doItems.every((item) => item.product !== null);

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newDO: DeliveryOrder = {
      id: crypto.randomUUID(),
      doNumber,
      garmentId: selectedGarment!.id,
      garment: selectedGarment!,
      warehouseId: selectedWarehouse!.id,
      warehouse: selectedWarehouse!,
      deliveryDate: new Date(deliveryDate),
      status: "Draft",
      items: doItems.map((item, index) => ({
        id: `${index + 1}`,
        productId: item.product!.id,
        product: item.product!,
        availableStock: item.availableStock,
        requestedQuantity: item.requestedQuantity,
        allocatedQuantity: 0,
      })),
      notes: notes || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In a real app, you'd persist to a store. Here we pass via sessionStorage.
    const existing = JSON.parse(sessionStorage.getItem("deliveryOrders") || "[]");
    sessionStorage.setItem("deliveryOrders", JSON.stringify([newDO, ...existing]));

    setIsSubmitting(false);
    router.push("/delivery-orders");
  };

  const handlePrint = () => {
    const content = document.getElementById("do-preview-inner");
    if (!content) return;
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    const clientInfo = selectedGarment
      ? `
        <div class="box">
          <div class="box-label">Client</div>
          <div class="box-name">${selectedGarment.name}</div>
          <div class="box-line">Brand: ${selectedGarment.brand}</div>
          <div class="box-line">${selectedGarment.address}</div>
          <div class="box-line">PIC: ${selectedGarment.picName} &bull; ${selectedGarment.phone}</div>
          <div class="box-line">Production: ${selectedGarment.productionType}</div>
        </div>`
      : `<div class="box"><div class="box-label">Client</div><div class="box-line" style="color:#9ca3af;font-style:italic">Not selected</div></div>`;

    const whInfo = selectedWarehouse
      ? `
        <div class="box">
          <div class="box-label">Source Warehouse</div>
          <div class="box-name">${selectedWarehouse.name}</div>
          <div class="box-line">Code: ${selectedWarehouse.code}</div>
          <div class="box-line">${selectedWarehouse.address}</div>
        </div>`
      : `<div class="box"><div class="box-label">Source Warehouse</div><div class="box-line" style="color:#9ca3af;font-style:italic">Not selected</div></div>`;

    const itemsHtml = doItems.length === 0 || doItems.every((i) => !i.product)
      ? `<tr><td colspan="6" style="text-align:center;padding:24px;color:#9ca3af;font-style:italic">No items added</td></tr>`
      : doItems
          .map(
            (item, idx) => `
      <tr>
        <td style="color:#9ca3af">${idx + 1}</td>
        <td>${item.product
          ? `<div style="font-weight:600;font-size:12px">${item.product.name}</div><div class="sku">${item.product.sku}</div>`
          : `<span style="color:#9ca3af;font-style:italic">—</span>`}</td>
        <td class="tr">${item.availableStock > 0 ? item.availableStock.toLocaleString() : "-"}</td>
        <td class="tr">${item.requestedQuantity.toLocaleString()}</td>
        <td class="tr" style="font-weight:600">${item.requestedQuantity.toLocaleString()}</td>
        <td class="tr">${item.product
          ? (item.requestedQuantity <= item.availableStock
            ? `<span style="color:#10b981">OK</span>`
            : `<span style="color:#ef4444">Insufficient</span>`)
          : `<span style="color:#9ca3af">—</span>`}</td>
      </tr>`
          )
          .join("");

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Delivery Order - ${doNumber}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Helvetica Neue',Arial,sans-serif;color:#111;background:#fff;padding:40px;font-size:13px}
    .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #e5e7eb;padding-bottom:24px;margin-bottom:28px}
    .title{font-size:26px;font-weight:700;color:#1a1a2e;letter-spacing:-0.5px}
    .subtitle{font-size:11px;color:#6b7280;margin-top:4px}
    .do-num{text-align:right}
    .do-num .num{font-size:18px;font-weight:700;font-family:monospace;color:#2563eb}
    .do-num .dt{font-size:11px;color:#6b7280;margin-top:4px}
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
      <div class="title">DELIVERY ORDER</div>
      <div class="subtitle">WMS Pro &mdash; Warehouse Management System</div>
    </div>
    <div class="do-num">
      <div class="num">${doNumber || "—"}</div>
      <div class="dt">Order Date: ${format(new Date(), "MMMM dd, yyyy")}</div>
    </div>
  </div>

  <div class="info-grid">
    ${clientInfo}
    ${whInfo}
  </div>

  <div style="margin-bottom:20px">
    <div class="box-label" style="margin-bottom:6px">Delivery Date</div>
    <div style="font-size:14px;font-weight:600">${deliveryDate ? format(new Date(deliveryDate), "MMMM dd, yyyy") : "—"}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:36px">#</th>
        <th>Product</th>
        <th class="tr" style="width:90px">Available</th>
        <th class="tr" style="width:90px">Requested</th>
        <th class="tr" style="width:90px">Allocated</th>
        <th class="tr" style="width:80px">Status</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>

  <div class="total-row">
    <div class="total-box">
      <div class="total-label">Total Items</div>
      <div class="total-amt">${totalItems} Products</div>
      <div style="font-size:12px;color:#6b7280;margin-top:4px">${totalUnits} Units</div>
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

  const previewDate = deliveryDate ? format(new Date(deliveryDate), "MMMM dd, yyyy") : "—";
  const orderDateStr = format(new Date(), "MMMM dd, yyyy");

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            Create Delivery Order
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Fill in the form and review the live preview before submitting
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_460px] gap-6 items-start">
        {/* ── LEFT: Form ── */}
        <div className="space-y-5">
          {/* DO Number */}
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">DO Number (Auto Generated)</p>
                <p className="text-xl font-bold font-mono text-primary">{doNumber || "—"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Client (Garment) <span className="text-destructive">*</span></Label>
                  <Select
                    onValueChange={(v) =>
                      setSelectedGarment(mockGarments.find((x) => x.id === v) ?? null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockGarments.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          <div className="flex items-center gap-2">
                            <Shirt className="h-4 w-4 text-muted-foreground" />
                            {g.name}
                            <Badge variant="outline" className="text-xs ml-1">
                              {g.productionType}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedGarment && (
                    <div className="rounded-lg border p-3 text-sm bg-muted/30">
                      <p className="font-medium">{selectedGarment.brand}</p>
                      <p className="text-xs text-muted-foreground">{selectedGarment.address}</p>
                      <p className="text-xs text-muted-foreground">PIC: {selectedGarment.picName}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Source Warehouse <span className="text-destructive">*</span></Label>
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

              <div className="space-y-2">
                <Label>Delivery Date <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
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
                      <TableHead className="pl-4 w-[280px]">Product (SKU Search)</TableHead>
                      <TableHead className="w-20 text-right">Available</TableHead>
                      <TableHead className="w-24 text-right">Requested Qty</TableHead>
                      <TableHead className="w-20 text-center">Status</TableHead>
                      <TableHead className="w-12 pr-4" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doItems.map((item, index) => (
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
                                  <CommandEmpty>No products found with stock.</CommandEmpty>
                                  <CommandGroup heading="Available Products">
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
                                              <span className="text-emerald-500 font-medium">Stock: {p.stock} {p.unit}</span>
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
                        <TableCell className="text-right">
                          <span className={`font-medium ${item.availableStock > 0 ? "text-emerald-500" : "text-muted-foreground"}`}>
                            {item.availableStock > 0 ? item.availableStock.toLocaleString() : "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={1}
                            max={item.availableStock || undefined}
                            value={item.requestedQuantity}
                            onChange={(e) =>
                              updateItemQuantity(item.id, parseInt(e.target.value) || 1)
                            }
                            className="w-24 h-9 ml-auto"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          {item.product && (
                            <Badge
                              variant={item.requestedQuantity <= item.availableStock ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {item.requestedQuantity <= item.availableStock ? "OK" : "Insufficient"}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="pr-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeItemRow(item.id)}
                            disabled={doItems.length === 1}
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
                  <p className="text-xs text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold text-primary">{totalItems} Products</p>
                  <p className="text-sm text-muted-foreground">{totalUnits} Units</p>
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
                placeholder="Add notes for this delivery order..."
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
                  Create Delivery Order
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
                <div
                  id="do-preview-inner"
                  className="p-6 bg-white text-gray-900 text-[13px] leading-relaxed"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between pb-5 border-b-2 border-gray-200 mb-5">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        DELIVERY ORDER
                      </h1>
                      <p className="text-[11px] text-gray-500 mt-1">
                        WMS Pro — Warehouse Management System
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold font-mono text-blue-600">
                        {doNumber || "DO-XXXX-XXX"}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Order Date: {orderDateStr}
                      </p>
                    </div>
                  </div>

                  {/* Client & Warehouse */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2 font-semibold">
                        Client
                      </p>
                      {selectedGarment ? (
                        <>
                          <p className="font-semibold text-sm">{selectedGarment.name}</p>
                          <p className="text-xs text-gray-500">Brand: {selectedGarment.brand}</p>
                          <p className="text-xs text-gray-500 mt-1">{selectedGarment.address}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            PIC: {selectedGarment.picName}
                          </p>
                          <p className="text-xs text-gray-500">{selectedGarment.phone}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Production: {selectedGarment.productionType}
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Not selected</p>
                      )}
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2 font-semibold">
                        Source Warehouse
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
                          Delivery Date
                        </p>
                        <p className="text-sm font-semibold mt-0.5">{previewDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items table */}
                  <table className="w-full text-xs border-collapse mb-4">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-200 w-7">#</th>
                        <th className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-200">Product</th>
                        <th className="text-right py-2 px-2 text-[10px] uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-200 w-16">Available</th>
                        <th className="text-right py-2 px-2 text-[10px] uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-200 w-16">Requested</th>
                        <th className="text-right py-2 px-2 text-[10px] uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-200 w-16">Allocated</th>
                        <th className="text-right py-2 px-2 text-[10px] uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-200 w-16">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doItems.every((i) => !i.product) ? (
                        <tr>
                          <td colSpan={6} className="text-center py-6 text-xs text-gray-400 italic">
                            No items added yet
                          </td>
                        </tr>
                      ) : (
                        doItems.map((item, idx) => (
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
                              {item.availableStock > 0 ? item.availableStock.toLocaleString() : "-"}
                            </td>
                            <td className="py-2 px-2 text-right text-gray-700">
                              {item.requestedQuantity.toLocaleString()}
                            </td>
                            <td className="py-2 px-2 text-right font-semibold text-gray-800">
                              {item.requestedQuantity.toLocaleString()}
                            </td>
                            <td className="py-2 px-2 text-right">
                              {item.product ? (
                                <span className={`text-xs font-medium ${item.requestedQuantity <= item.availableStock ? "text-emerald-600" : "text-red-600"}`}>
                                  {item.requestedQuantity <= item.availableStock ? "OK" : "Insufficient"}
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
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
                        Total Items
                      </p>
                      <p className="text-xl font-bold text-blue-600 mt-0.5">
                        {totalItems} Products
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{totalUnits} Units</p>
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
