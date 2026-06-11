"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Plus, Truck, Calendar, Shirt, Search, Trash2, Package, Check, Loader2
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
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

interface CreateDODialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DeliveryOrder) => void;
}

export function CreateDODialog({ open, onOpenChange, onSubmit }: CreateDODialogProps) {
  const [doNumber, setDONumber] = React.useState("");
  React.useEffect(() => { setDONumber(generateDONumber()); }, [open]);
  const [selectedGarment, setSelectedGarment] = React.useState<Garment | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState<Warehouse | null>(null);
  const [deliveryDate, setDeliveryDate] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [doItems, setDOItems] = React.useState<DOItemForm[]>([]);
  const [skuSearchOpen, setSkuSearchOpen] = React.useState<number | null>(null);
  const [skuSearchValue, setSkuSearchValue] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const addItemRow = () => {
    setDOItems([...doItems, { id: crypto.randomUUID(), product: null, requestedQuantity: 1, availableStock: 0 }]);
  };

  const removeItemRow = (id: string) => {
    if (doItems.length > 1) {
      setDOItems(doItems.filter(item => item.id !== id));
    }
  };

  const updateItemProduct = (id: string, product: Product) => {
    setDOItems(doItems.map(item =>
      item.id === id
        ? { ...item, product, availableStock: product.stock }
        : item
    ));
    setSkuSearchOpen(null);
    setSkuSearchValue("");
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    setDOItems(doItems.map(item =>
      item.id === id ? { ...item, requestedQuantity: quantity } : item
    ));
  };

  const filteredProducts = mockProducts.filter(product =>
    (product.sku.toLowerCase().includes(skuSearchValue.toLowerCase()) ||
    product.name.toLowerCase().includes(skuSearchValue.toLowerCase()) ||
    product.barcode.includes(skuSearchValue)) &&
    product.stock > 0
  );

  const handleCreateDO = async () => {
    if (!selectedGarment || !selectedWarehouse || !deliveryDate || doItems.some(item => !item.product)) {
      return;
    }

    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const newDO: DeliveryOrder = {
      id: crypto.randomUUID(),
      doNumber,
      garmentId: selectedGarment.id,
      garment: selectedGarment,
      warehouseId: selectedWarehouse.id,
      warehouse: selectedWarehouse,
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

    onSubmit(newDO);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Create Delivery Order
          </DialogTitle>
          <DialogDescription>
            Create a new delivery order to client. DO number is auto-generated.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">DO Number (Auto Generated)</p>
              <p className="text-xl font-bold font-mono text-primary">{doNumber}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Client (Garment) <span className="text-destructive">*</span></Label>
              <Select onValueChange={(value) => setSelectedGarment(mockGarments.find(g => g.id === value) || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {mockGarments.map((garment) => (
                    <SelectItem key={garment.id} value={garment.id}>
                      <div className="flex items-center gap-2">
                        <Shirt className="h-4 w-4 text-muted-foreground" />
                        <span>{garment.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">{garment.productionType}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedGarment && (
                <Card className="mt-2">
                  <CardContent className="p-3 text-sm">
                    <p className="font-medium">{selectedGarment.brand}</p>
                    <p className="text-muted-foreground">{selectedGarment.address}</p>
                    <p className="text-muted-foreground">PIC: {selectedGarment.picName}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-2">
              <Label>Source Warehouse <span className="text-destructive">*</span></Label>
              <Select onValueChange={(value) => setSelectedWarehouse(mockWarehouses.find(w => w.id === value) || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {mockWarehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name} ({warehouse.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Delivery Date <span className="text-destructive">*</span></Label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Order Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItemRow}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[350px]">Product (SKU Search)</TableHead>
                    <TableHead className="w-[120px]">Available</TableHead>
                    <TableHead className="w-[120px]">Requested Qty</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doItems.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Popover open={skuSearchOpen === index} onOpenChange={(open) => setSkuSearchOpen(open ? index : null)}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              {item.product ? (
                                <div className="flex items-center gap-2 truncate">
                                  <Package className="h-4 w-4 text-primary" />
                                  <span className="font-mono text-xs">{item.product.sku}</span>
                                  <span className="truncate">{item.product.name}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Search className="h-4 w-4" />
                                  Search SKU or product...
                                </div>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0" align="start">
                            <Command>
                              <CommandInput
                                placeholder="Search by SKU, barcode, or name..."
                                value={skuSearchValue}
                                onValueChange={setSkuSearchValue}
                              />
                              <CommandList>
                                <CommandEmpty>No products found with stock.</CommandEmpty>
                                <CommandGroup heading="Available Products">
                                  {filteredProducts.map((product) => (
                                    <CommandItem
                                      key={product.id}
                                      value={`${product.sku} ${product.name} ${product.barcode}`}
                                      onSelect={() => updateItemProduct(item.id, product)}
                                    >
                                      <div className="flex items-center gap-3 w-full">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                          <Package className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium truncate">{product.name}</p>
                                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="font-mono">{product.sku}</span>
                                            <span>|</span>
                                            <span className="text-emerald-500 font-medium">Stock: {product.stock} {product.unit}</span>
                                          </div>
                                        </div>
                                        <Badge variant="outline">{product.category}</Badge>
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
                        <span className={`font-medium ${item.availableStock > 0 ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                          {item.availableStock > 0 ? item.availableStock : "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          max={item.availableStock}
                          value={item.requestedQuantity}
                          onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        {item.product && (
                          <Badge variant={item.requestedQuantity <= item.availableStock ? "default" : "destructive"}>
                            {item.requestedQuantity <= item.availableStock ? "OK" : "Insufficient"}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
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

            <div className="flex justify-end">
              <div className="rounded-lg border bg-muted/50 p-4 text-right">
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-primary">{doItems.filter(i => i.product).length} Products</p>
                <p className="text-sm text-muted-foreground">
                  {doItems.reduce((sum, i) => sum + i.requestedQuantity, 0)} Units
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Add notes for this delivery order..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateDO}
            disabled={!selectedGarment || !selectedWarehouse || !deliveryDate || doItems.some(item => !item.product) || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Create DO
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
