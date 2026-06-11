"use client";

import * as React from "react";
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
import { ChartContainer, SimpleBarChart, SimpleLineChart } from "@/components/charts/chart-components";
import { stockByCategory, monthlyMovement } from "@/lib/mock-data";
import { useT } from "@/hooks/use-translations";
import type { Product } from "@/types";

interface InventoryReportProps {
  products: Product[];
}

export function InventoryReport({ products }: InventoryReportProps) {
  const t = useT();
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartContainer title="Stock by Category" description="Distribution of inventory">
          <SimpleBarChart
            data={stockByCategory}
            dataKeys={["value"]}
            height={250}
          />
        </ChartContainer>
        <ChartContainer title="Monthly Movement" description="Inbound vs Outbound trend">
          <SimpleLineChart
            data={monthlyMovement}
            dataKeys={["inbound", "outbound"]}
            height={250}
            area
          />
        </ChartContainer>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inventory Summary</CardTitle>
          <CardDescription>Current stock levels for all products</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.inventory.columns.sku}</TableHead>
                <TableHead>{t.inventory.columns.product}</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">{t.inventory.totalStock}</TableHead>
                <TableHead className="text-right">{t.inventory.columns.minStock}</TableHead>
                <TableHead>{t.common.status}</TableHead>
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
                  <TableCell className="text-right">{product.stock.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{product.minStock.toLocaleString()}</TableCell>
                  <TableCell>
                    {product.stock < product.minStock ? (
                      <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">{t.inventory.status.lowStock}</Badge>
                    ) : (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{t.inventory.status.inStock}</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
