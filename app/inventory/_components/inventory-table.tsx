"use client";

import * as React from "react";
import { format } from "date-fns";
import { Package, Warehouse as WarehouseIcon, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@/components/shared/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useT } from "@/hooks/use-translations";
import type { InventoryItem, Warehouse } from "@/types";

interface InventoryTableProps {
  data: InventoryItem[];
  warehouses: Warehouse[];
}

export function InventoryTable({ data, warehouses }: InventoryTableProps) {
  const t = useT();
  const [filterWarehouse, setFilterWarehouse] = React.useState<string>("all");

  const filteredItems = React.useMemo(() => {
    if (filterWarehouse === "all") return data;
    return data.filter((item) => item.warehouseId === filterWarehouse);
  }, [data, filterWarehouse]);

  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "product.sku",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.inventory.columns.sku} />,
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.product.sku}</span>
      ),
    },
    {
      accessorKey: "product.name",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.inventory.columns.product} />,
      cell: ({ row }) => {
        const product = row.original.product;
        const isLowStock = row.original.availableStock < product.minStock;
        return (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.category}</p>
            </div>
            {isLowStock && (
              <Badge variant="outline" className="border-amber-500 text-amber-500">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Low
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "warehouse.name",
      header: t.inventory.columns.warehouse,
      cell: ({ row }) => row.original.warehouse.name,
    },
    {
      accessorKey: "location.binCode",
      header: "Location",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.location.binCode}</span>
      ),
    },
    {
      accessorKey: "availableStock",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t.inventory.columns.available} />,
      cell: ({ row }) => {
        const available = row.original.availableStock;
        const minStock = row.original.product.minStock;
        return (
          <span className={available < minStock ? "text-amber-500 font-medium" : "font-medium"}>
            {available.toLocaleString()}
          </span>
        );
      },
    },
    {
      accessorKey: "reservedStock",
      header: t.inventory.columns.reserved,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.reservedStock.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "incomingStock",
      header: t.inventory.columns.incoming,
      cell: ({ row }) => (
        <span className="text-emerald-500">+{row.original.incomingStock.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "outgoingStock",
      header: t.inventory.columns.outgoing,
      cell: ({ row }) => (
        <span className="text-primary">-{row.original.outgoingStock.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "lastUpdated",
      header: "Last Updated",
      cell: ({ row }) => format(row.original.lastUpdated, "MMM dd, HH:mm"),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={filteredItems}
      searchPlaceholder={t.inventory.searchPlaceholder}
      filterComponent={
        <Select value={filterWarehouse} onValueChange={setFilterWarehouse}>
          <SelectTrigger className="w-48">
            <WarehouseIcon className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter warehouse" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warehouses</SelectItem>
            {warehouses.map((wh) => (
              <SelectItem key={wh.id} value={wh.id}>
                {wh.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    />
  );
}
