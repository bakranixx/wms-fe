"use client";

import { ArrowUpFromLine } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ShipConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doOrder: { doNumber: string } | null;
  onConfirm: () => void;
}

export function ShipConfirmDialog({
  open,
  onOpenChange,
  doOrder,
  onConfirm,
}: ShipConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <ArrowUpFromLine className="h-5 w-5 text-primary" />
            Confirm Shipment
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to mark <strong>{doOrder?.doNumber}</strong> as shipped?
            <br /><br />
            This action will:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Update DO status to <strong>Shipped</strong></li>
              <li>Create <strong>OUTBOUND</strong> stock movement entries</li>
              <li>Deduct stock from inventory</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            <ArrowUpFromLine className="mr-2 h-4 w-4" />
            Confirm Shipment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
