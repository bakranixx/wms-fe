"use client";

import { Shirt, Pencil, Trash2, Mail, Phone, MapPin } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/page-components";
import type { Garment } from "@/types";

interface GarmentDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  garment: Garment | null;
  onEdit: (garment: Garment) => void;
  onDelete: (garment: Garment) => void;
}

export function GarmentDetailSheet({
  open,
  onOpenChange,
  garment,
  onEdit,
  onDelete,
}: GarmentDetailSheetProps) {
  if (!garment) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Garment Details</SheetTitle>
          <SheetDescription>
            View detailed information about this garment client.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shirt className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{garment.name}</h3>
              <p className="text-sm text-muted-foreground">{garment.code}</p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Brand</p>
                <p className="text-sm font-medium">{garment.brand}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Production Type</p>
                <Badge variant="outline" className="mt-1">{garment.productionType}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">PIC Name</p>
                <p className="text-sm">{garment.picName}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Status</p>
                <StatusBadge status={garment.status} />
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3 w-3" />
                Email
              </div>
              <p className="text-sm">{garment.email}</p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                Phone
              </div>
              <p className="text-sm">{garment.phone}</p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                Address
              </div>
              <p className="text-sm">{garment.address}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                onEdit(garment);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                onDelete(garment);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
