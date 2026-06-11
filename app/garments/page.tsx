"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, Eye, MoreHorizontal, Shirt } from "lucide-react";
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
import { mockGarments } from "@/lib/mock-data";
import type { Garment } from "@/types";
import {
  GarmentFormDialog,
  defaultGarmentValues,
} from "./_components/garment-form-dialog";
import type { GarmentFormValues } from "./_components/garment-form-dialog";
import { GarmentDetailSheet } from "./_components/garment-detail-sheet";
import { DeleteGarmentDialog } from "./_components/delete-garment-dialog";

export default function GarmentsPage() {
  const [garments, setGarments] = React.useState<Garment[]>(mockGarments);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [selectedGarment, setSelectedGarment] = React.useState<Garment | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [formInitialValues, setFormInitialValues] = React.useState<GarmentFormValues>(defaultGarmentValues);

  const openCreateForm = () => {
    setFormInitialValues(defaultGarmentValues);
    setSelectedGarment(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const openEditForm = (garment: Garment) => {
    setFormInitialValues({
      code: garment.code,
      name: garment.name,
      brand: garment.brand,
      picName: garment.picName,
      email: garment.email,
      phone: garment.phone,
      address: garment.address,
      productionType: garment.productionType,
      status: garment.status,
    });
    setSelectedGarment(garment);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const openDetail = (garment: Garment) => {
    setSelectedGarment(garment);
    setIsDetailOpen(true);
  };

  const openDelete = (garment: Garment) => {
    setSelectedGarment(garment);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (values: GarmentFormValues) => {
    if (isEditing && selectedGarment) {
      setGarments((prev) =>
        prev.map((g) =>
          g.id === selectedGarment.id
            ? { ...g, ...values, updatedAt: new Date() }
            : g
        )
      );
      toast.success("Garment updated successfully");
    } else {
      const newGarment: Garment = {
        id: `${Date.now()}`,
        ...values,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setGarments((prev) => [newGarment, ...prev]);
      toast.success("Garment created successfully");
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (selectedGarment) {
      setGarments((prev) => prev.filter((g) => g.id !== selectedGarment.id));
      toast.success("Garment deleted successfully");
      setIsDeleteOpen(false);
      setSelectedGarment(null);
    }
  };

  const columns: ColumnDef<Garment>[] = [
    {
      accessorKey: "code",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.getValue("code")}</span>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Client Name" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Shirt className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{row.getValue("name")}</p>
            <p className="text-xs text-muted-foreground">{row.original.brand}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "productionType",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Production Type" />,
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("productionType")}</Badge>
      ),
    },
    {
      accessorKey: "picName",
      header: "PIC",
      cell: ({ row }) => (
        <div>
          <p className="text-sm">{row.getValue("picName")}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const garment = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openDetail(garment)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditForm(garment)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openDelete(garment)}
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
        title="Garments"
        description="Manage your garment clients and production partners"
        breadcrumbs={[{ label: "Garments" }]}
        actions={
          <Button onClick={openCreateForm}>
            <Plus className="mr-2 h-4 w-4" />
            Add Garment
          </Button>
        }
      />

      {garments.length === 0 ? (
        <EmptyState
          icon={<Shirt className="h-8 w-8" />}
          title="No garments found"
          description="Get started by adding your first garment client."
          action={
            <Button onClick={openCreateForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Garment
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={garments}
          searchPlaceholder="Search garments..."
        />
      )}

      <GarmentFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        isEditing={isEditing}
        initialValues={formInitialValues}
        onSubmit={handleFormSubmit}
      />

      <GarmentDetailSheet
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        garment={selectedGarment}
        onEdit={openEditForm}
        onDelete={openDelete}
      />

      <DeleteGarmentDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        garment={selectedGarment}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}
