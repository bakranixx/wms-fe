"use client";

import * as React from "react";
import { ArrowDownToLine, AlertTriangle } from "lucide-react";
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

interface ConfirmReceiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  poNumber: string | null;
  totalReceived: number;
  totalRejected: number;
  onConfirm: () => void;
}

export function ConfirmReceiveDialog({
  open,
  onOpenChange,
  poNumber,
  totalReceived,
  totalRejected,
  onConfirm,
}: ConfirmReceiveDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <ArrowDownToLine className="h-5 w-5 text-primary" />
            Confirm Receiving
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to receive goods from <strong>{poNumber}</strong>?
            <br /><br />
            This action will:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Create receiving record with <strong>{totalReceived}</strong> units received</li>
              <li>Create <strong>INBOUND</strong> stock movement entries</li>
              <li>Add stock to inventory</li>
              <li>Update PO status</li>
            </ul>
            {totalRejected > 0 && (
              <div className="mt-3 flex items-center gap-2 text-amber-500">
                <AlertTriangle className="h-4 w-4" />
                <span>{totalRejected} units will be marked as rejected</span>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            Confirm Receive
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
