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
import { useT } from "@/hooks/use-translations";
import type { Product } from "@/types";

interface LowStockReportProps {
  products: Product[];
}

export function LowStockReport({ products }: LowStockReportProps) {
  const t = useT();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t.reports.lowStock.title}</CardTitle>
        <CardDescription>{t.reports.lowStock.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-emerald-500/10 p-4 text-emerald-500">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{t.reports.lowStock.noData}</h3>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.inventory.columns.sku}</TableHead>
                <TableHead>{t.inventory.columns.product}</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">{t.inventory.totalStock}</TableHead>
                <TableHead className="text-right">{t.inventory.columns.minStock}</TableHead>
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
