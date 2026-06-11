"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, Eye, MoreHorizontal, Building2, Mail, Phone, MapPin } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { mockVendors } from "@/lib/mock-data";
import type { Vendor } from "@/types";
import {
  VendorFormDialog,
  type VendorFormValues,
  defaultVendorValues,
} from "./_components/vendor-form-dialog";
import { DeleteVendorDialog } from "./_components/delete-vendor-dialog";

export default function VendorsPage() {
  const [vendors, setVendors] = React.useState<Vendor[]>(mockVendors);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [selectedVendor, setSelectedVendor] = React.useState<Vendor | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [formInitialValues, setFormInitialValues] =
    React.useState<VendorFormValues>(defaultVendorValues);

  const openCreateForm = () => {
    setFormInitialValues(defaultVendorValues);
    setSelectedVendor(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const openEditForm = (vendor: Vendor) => {
    setFormInitialValues({
      code: vendor.code,
      name: vendor.name,
      companyName: vendor.companyName,
      picName: vendor.picName,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      city: vendor.city,
      vendorType: vendor.vendorType,
      status: vendor.status,
    });
    setSelectedVendor(vendor);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const openDetail = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsDetailOpen(true);
  };

  const openDelete = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsDeleteOpen(true);
  };

  const onSubmit = (values: VendorFormValues) => {
    if (isEditing && selectedVendor) {
      setVendors((prev) =>
        prev.map((v) =>
          v.id === selectedVendor.id
            ? { ...v, ...values, updatedAt: new Date() }
            : v
        )
      );
      toast.success("Vendor updated successfully");
    } else {
      const newVendor: Vendor = {
        id: `${Date.now()}`,
        ...values,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setVendors((prev) => [newVendor, ...prev]);
      toast.success("Vendor created successfully");
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (selectedVendor) {
      setVendors((prev) => prev.filter((v) => v.id !== selectedVendor.id));
      toast.success("Vendor deleted successfully");
      setIsDeleteOpen(false);
      setSelectedVendor(null);
    }
  };

  const columns: ColumnDef<Vendor>[] = [
    {
      accessorKey: "code",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.getValue("code")}</span>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Vendor Name" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{row.getValue("name")}</p>
            <p className="text-xs text-muted-foreground">{row.original.companyName}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "vendorType",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("vendorType")}</Badge>
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
      accessorKey: "city",
      header: "City",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const vendor = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openDetail(vendor)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditForm(vendor)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openDelete(vendor)}
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
        title="Vendors"
        description="Manage your suppliers and vendor relationships"
        breadcrumbs={[{ label: "Vendors" }]}
        actions={
          <Button onClick={openCreateForm}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        }
      />

      {vendors.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-8 w-8" />}
          title="No vendors found"
          description="Get started by adding your first vendor to the system."
          action={
            <Button onClick={openCreateForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={vendors}
          searchPlaceholder="Search vendors..."
        />
      )}

      <VendorFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        isEditing={isEditing}
        initialValues={formInitialValues}
        onSubmit={onSubmit}
      />

      {/* Vendor Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Vendor Details</SheetTitle>
            <SheetDescription>
              View detailed information about this vendor.
            </SheetDescription>
          </SheetHeader>
          {selectedVendor && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedVendor.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedVendor.code}</p>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Company Name</p>
                  <p className="text-sm">{selectedVendor.companyName}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Vendor Type</p>
                  <Badge variant="outline" className="mt-1">{selectedVendor.vendorType}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">PIC Name</p>
                    <p className="text-sm">{selectedVendor.picName}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <StatusBadge status={selectedVendor.status} />
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    Email
                  </div>
                  <p className="text-sm">{selectedVendor.email}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    Phone
                  </div>
                  <p className="text-sm">{selectedVendor.phone}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    Address
                  </div>
                  <p className="text-sm">{selectedVendor.address}</p>
                  <p className="text-sm text-muted-foreground">{selectedVendor.city}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsDetailOpen(false);
                    openEditForm(selectedVendor);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    setIsDetailOpen(false);
                    openDelete(selectedVendor);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <DeleteVendorDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        vendor={selectedVendor}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}
