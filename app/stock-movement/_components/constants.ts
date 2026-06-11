import {
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  MoveRight,
} from "lucide-react";
import type { MovementType, SourceType, MovementStatus } from "@/types";

export const movementTypeConfig: Record<
  MovementType,
  { icon: React.ElementType; color: string; bgColor: string; label: string }
> = {
  INBOUND: {
    icon: ArrowDownRight,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    label: "Inbound",
  },
  OUTBOUND: {
    icon: ArrowUpRight,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    label: "Outbound",
  },
  ADJUSTMENT: {
    icon: RefreshCw,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    label: "Adjustment",
  },
  TRANSFER: {
    icon: MoveRight,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    label: "Transfer",
  },
};

export const sourceTypeLabels: Record<SourceType, string> = {
  MANUAL: "Manual Entry",
  PURCHASE_ORDER: "Purchase Order",
  DELIVERY_ORDER: "Delivery Order",
  ADJUSTMENT: "Stock Adjustment",
  TRANSFER: "Warehouse Transfer",
};

export const statusConfig: Record<MovementStatus, { color: string; bgColor: string }> = {
  Draft: { color: "text-slate-400", bgColor: "bg-slate-500/10" },
  Posted: { color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
  Cancelled: { color: "text-red-500", bgColor: "bg-red-500/10" },
};

export const COLORS = ["#d4af37", "#10b981", "#3b82f6", "#8b5cf6"];
