import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/page-components";
import { mockPurchaseOrders, mockVendors, mockProducts } from "@/lib/mock-data";

// Static order counts per vendor (avoids Math.random() hydration issues)
const vendorOrderCounts: Record<string, number> = {
  "1": 8,
  "2": 5,
  "3": 3,
  "4": 7,
  "5": 2,
};

function PurchaseOrdersTable() {
  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Purchase Orders</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary text-xs h-8">
          View all
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">PO Number</TableHead>
              <TableHead className="text-xs">Vendor</TableHead>
              <TableHead className="text-xs">Date</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPurchaseOrders.slice(0, 5).map((po) => (
              <TableRow key={po.id} className="text-sm">
                <TableCell className="font-medium py-2.5">{po.poNumber}</TableCell>
                <TableCell className="py-2.5">{po.vendor.name}</TableCell>
                <TableCell className="py-2.5">
                  {format(po.createdAt, "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="py-2.5">
                  <StatusBadge status={po.status} />
                </TableCell>
                <TableCell className="text-right py-2.5 text-primary font-medium">
                  Rp {(po.totalAmount / 1000).toFixed(0)}K
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function VendorsTable() {
  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Vendors</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary text-xs h-8">
          View all
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Vendor</TableHead>
              <TableHead className="text-xs">PIC</TableHead>
              <TableHead className="text-xs">Type</TableHead>
              <TableHead className="text-xs text-right">Orders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockVendors.slice(0, 5).map((vendor) => (
              <TableRow key={vendor.id} className="text-sm">
                <TableCell className="font-medium py-2.5">{vendor.name}</TableCell>
                <TableCell className="py-2.5 text-muted-foreground">
                  {vendor.picName}
                </TableCell>
                <TableCell className="py-2.5 text-muted-foreground text-xs">
                  {vendor.vendorType}
                </TableCell>
                <TableCell className="text-right py-2.5 font-medium">
                  {vendorOrderCounts[vendor.id] ?? 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-3 border-t border-border">
          <Button variant="outline" size="sm" className="w-full text-xs border-dashed">
            + Add New Vendor
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductsTable() {
  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Products</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary text-xs h-8">
          View all
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Product</TableHead>
              <TableHead className="text-xs">Category</TableHead>
              <TableHead className="text-xs">Price</TableHead>
              <TableHead className="text-xs text-right">Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProducts.slice(0, 5).map((product) => (
              <TableRow key={product.id} className="text-sm">
                <TableCell className="font-medium py-2.5">{product.name}</TableCell>
                <TableCell className="py-2.5 text-muted-foreground">
                  {product.category}
                </TableCell>
                <TableCell className="py-2.5">
                  Rp {(product.price / 1000).toFixed(0)}K
                </TableCell>
                <TableCell className="text-right py-2.5">
                  <span
                    className={
                      product.stock < product.minStock ? "text-amber-500 font-medium" : ""
                    }
                  >
                    {product.stock}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-3 border-t border-border">
          <Button variant="outline" size="sm" className="w-full text-xs border-dashed">
            + Add New Product
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function DataTablesSection() {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-3">
      <PurchaseOrdersTable />
      <VendorsTable />
      <ProductsTable />
    </div>
  );
}
