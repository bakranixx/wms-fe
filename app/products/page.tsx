"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, Eye, MoreHorizontal, Package } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader, StatusBadge, EmptyState } from "@/components/shared/page-components";
import { DataTable, DataTableColumnHeader } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/lib/mock-data";
import type { Product } from "@/types";
import {
  ProductFormDialog,
  type ProductFormValues,
  defaultProductValues,
} from "./_components/product-form-dialog";
import { ProductDetailSheet } from "./_components/product-detail-sheet";
import { DeleteProductDialog } from "./_components/delete-product-dialog";

export default function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>(mockProducts);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [formInitialValues, setFormInitialValues] =
    React.useState<ProductFormValues>(defaultProductValues);

  const openCreateForm = () => {
    setFormInitialValues(defaultProductValues);
    setSelectedProduct(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setFormInitialValues({
      sku: product.sku,
      barcode: product.barcode,
      name: product.name,
      category: product.category,
      unit: product.unit,
      color: product.color,
      size: product.size,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      status: product.status,
    });
    setSelectedProduct(product);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const openDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const openDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (values: ProductFormValues) => {
    if (isEditing && selectedProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id ? { ...p, ...values, updatedAt: new Date() } : p,
        ),
      );
      toast.success("Product updated successfully");
    } else {
      const newProduct: Product = {
        id: `${Date.now()}`,
        ...values,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      toast.success("Product created successfully");
    }
  };

  const handleDelete = () => {
    if (!selectedProduct) return;
    setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
    toast.success("Product deleted successfully");
    setIsDeleteOpen(false);
    setSelectedProduct(null);
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "sku",
      header: ({ column }) => <DataTableColumnHeader column={column} title="SKU" />,
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.getValue("sku")}</span>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Product Name" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Package className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{row.getValue("name")}</p>
            <p className="text-xs text-muted-foreground">{row.original.barcode}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
    },
    {
      accessorKey: "stock",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number;
        const isLow = stock < row.original.minStock;
        return (
          <span className={isLow ? "text-amber-500 font-medium" : ""}>
            {stock.toLocaleString()}
            {isLow && " (Low)"}
          </span>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Unit Price" />,
      cell: ({ row }) => (
        <span className="font-medium">
          Rp {(row.getValue("price") as number).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "unit",
      header: "Unit",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openDetail(product)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditForm(product)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openDelete(product)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Products"
        description="Manage your product catalog and inventory items"
        breadcrumbs={[{ label: "Products" }]}
        actions={
          <Button onClick={openCreateForm}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        }
      />

      {products.length === 0 ? (
        <EmptyState
          icon={<Package className="h-8 w-8" />}
          title="No products found"
          description="Get started by adding your first product to the catalog."
          action={
            <Button onClick={openCreateForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          }
        />
      ) : (
        <DataTable columns={columns} data={products} searchPlaceholder="Search products..." />
      )}

      <ProductFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        isEditing={isEditing}
        initialValues={formInitialValues}
        onSubmit={handleSubmit}
      />

      <ProductDetailSheet
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        product={selectedProduct}
        onEdit={openEditForm}
        onDelete={openDelete}
      />

      <DeleteProductDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        product={selectedProduct}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}
