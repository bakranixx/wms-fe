"use client";

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

interface Garment {
  id: string;
  name: string;
}

interface DeleteGarmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  garment: Garment | null;
  onConfirm: () => void;
}

export function DeleteGarmentDialog({
  open,
  onOpenChange,
  garment,
  onConfirm,
}: DeleteGarmentDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Garment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{garment?.name}&quot;? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
