"use client";

import * as React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StockMovement } from "@/types";

interface IncomingReportProps {
  movements: StockMovement[];
}

export function IncomingReport({ movements }: IncomingReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Incoming Goods Report</CardTitle>
        <CardDescription>All inbound stock movements</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell className="font-mono">{movement.transactionId}</TableCell>
                <TableCell className="font-medium">{movement.product.name}</TableCell>
                <TableCell className="text-right text-emerald-500">+{movement.quantity}</TableCell>
                <TableCell>{movement.warehouse.name}</TableCell>
                <TableCell>{movement.userName}</TableCell>
                <TableCell>{format(movement.timestamp, "MMM dd, yyyy")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
