"use client";

import * as React from "react";
import { BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from "@/types";

interface LowStockReportProps {
  products: Product[];
}

export function LowStockReport({ products }: LowStockReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Low Stock Alert Report</CardTitle>
        <CardDescription>Products below minimum stock level</CardDescription>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-emerald-500/10 p-4 text-emerald-500">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">All Stock Levels Normal</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No products are currently below minimum stock level.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Current Stock</TableHead>
                <TableHead className="text-right">Min Stock</TableHead>
                <TableHead className="text-right">Shortage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono">{product.sku}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-amber-500 font-medium">
                    {product.stock.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">{product.minStock.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-destructive font-medium">
                    -{(product.minStock - product.stock).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
