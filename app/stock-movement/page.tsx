"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Download,
  Plus,
  Package,
  User,
  MapPin,
  Eye,
  MoreHorizontal,
  Filter,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/shared/page-components";
import { DataTable, DataTableColumnHeader } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  mockStockMovements,
  movementAnalytics,
} from "@/lib/mock-data";
import type { StockMovement, MovementType } from "@/types";
import { movementTypeConfig, sourceTypeLabels, statusConfig } from "./_components/constants";
import { AddMovementDialog } from "./_components/add-movement-dialog";
import { MovementDetailSheet } from "./_components/movement-detail-sheet";
import { MovementStats } from "./_components/movement-stats";
import { MovementCharts } from "./_components/movement-charts";

export default function StockMovementPage() {
  const [movements, setMovements] = React.useState<StockMovement[]>(mockStockMovements);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [selectedMovement, setSelectedMovement] = React.useState<StockMovement | null>(null);
  const [filterType, setFilterType] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");

  // Filtered movements
  const filteredMovements = React.useMemo(() => {
    let result = movements;
    if (filterType !== "all") {
      result = result.filter((m) => m.movementType === filterType);
    }
    if (filterStatus !== "all") {
      result = result.filter((m) => m.status === filterStatus);
    }
    return result;
  }, [movements, filterType, filterStatus]);

  // Movement stats
  const stats = React.useMemo(() => {
    const posted = movements.filter((m) => m.status === "Posted");
    return {
      totalMovements: movements.length,
      inbound: posted.filter((m) => m.movementType === "INBOUND").reduce((acc, m) => acc + m.quantity, 0),
      outbound: posted.filter((m) => m.movementType === "OUTBOUND").reduce((acc, m) => acc + m.quantity, 0),
      adjustments: posted.filter((m) => m.movementType === "ADJUSTMENT").length,
      transfers: posted.filter((m) => m.movementType === "TRANSFER").length,
      drafts: movements.filter((m) => m.status === "Draft").length,
    };
  }, [movements]);

  // Movement type distribution for pie chart
  const typeDistribution = React.useMemo(() => {
    return [
      { name: "Inbound", value: movements.filter((m) => m.movementType === "INBOUND").length },
      { name: "Outbound", value: movements.filter((m) => m.movementType === "OUTBOUND").length },
      { name: "Adjustment", value: movements.filter((m) => m.movementType === "ADJUSTMENT").length },
      { name: "Transfer", value: movements.filter((m) => m.movementType === "TRANSFER").length },
    ];
  }, [movements]);

  // Submit handler
  const handleSubmit = (newMovement: StockMovement) => {
    setMovements([newMovement, ...movements]);
    setIsDialogOpen(false);
  };

  // View detail
  const viewDetail = (movement: StockMovement) => {
    setSelectedMovement(movement);
    setIsDetailOpen(true);
  };

  // Table columns
  const columns: ColumnDef<StockMovement>[] = [
    {
      accessorKey: "transactionId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Transaction ID" />,
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium text-primary">
          {row.getValue("transactionId")}
        </span>
      ),
    },
    {
      accessorKey: "movementType",
      header: "Movement Type",
      cell: ({ row }) => {
        const type = row.getValue("movementType") as MovementType;
        const config = movementTypeConfig[type];
        const Icon = config.icon;
        return (
          <div className="flex items-center gap-2">
            <div className={`rounded-full p-1.5 ${config.bgColor}`}>
              <Icon className={`h-3.5 w-3.5 ${config.color}`} />
            </div>
            <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "sourceType",
      header: "Source",
      cell: ({ row }) => {
        const source = row.original.sourceType;
        return (
          <Badge variant="outline" className="text-xs">
            {sourceTypeLabels[source]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "product.name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Product" />,
      cell: ({ row }) => {
        const product = row.original.product;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.sku}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "product.category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-xs">
          {row.original.product.category}
        </Badge>
      ),
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Qty" />,
      cell: ({ row }) => {
        const qty = row.original.quantity;
        const type = row.original.movementType;
        const isPositive = type === "INBOUND" || (type === "ADJUSTMENT" && qty > 0) || type === "TRANSFER";
        return (
          <div className="flex items-center gap-1">
            <span
              className={`font-mono text-sm font-bold ${
                isPositive ? "text-emerald-500" : "text-amber-500"
              }`}
            >
              {isPositive ? "+" : ""}
              {Math.abs(qty).toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">{row.original.product.unit}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "warehouse.name",
      header: "Warehouse",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm">{row.original.warehouse.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const config = statusConfig[status];
        return (
          <Badge className={`${config.bgColor} ${config.color} border-0`}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "userName",
      header: "Created By",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-3 w-3 text-primary" />
          </div>
          <span className="text-sm">{row.original.userName}</span>
        </div>
      ),
    },
    {
      accessorKey: "timestamp",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: ({ row }) => (
        <div className="text-sm">
          <p className="font-medium">{format(row.original.timestamp, "MMM dd, yyyy")}</p>
          <p className="text-xs text-muted-foreground">{format(row.original.timestamp, "HH:mm")}</p>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => viewDetail(row.original)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {row.original.status === "Draft" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-emerald-500">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Post Movement
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Stock Movement"
        description="Centralized inventory transaction management - record inbound, outbound, adjustments and transfers"
        breadcrumbs={[{ label: "Stock Movement" }]}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-border/50">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Movement
            </Button>
          </div>
        }
      />

      <MovementStats stats={stats} />
      <MovementCharts movementAnalytics={movementAnalytics} typeDistribution={typeDistribution} />

      {/* Movement History Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Movement History</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-36 h-9">
                  <Filter className="mr-2 h-3.5 w-3.5" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="INBOUND">Inbound</SelectItem>
                  <SelectItem value="OUTBOUND">Outbound</SelectItem>
                  <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                  <SelectItem value="TRANSFER">Transfer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Posted">Posted</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredMovements}
            searchPlaceholder="Search transactions..."
          />
        </CardContent>
      </Card>

      <AddMovementDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        onReset={() => {}}
      />
      <MovementDetailSheet
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        movement={selectedMovement}
      />
    </DashboardLayout>
  );
}
