"use client";

import { cn } from "@/lib/utils";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Package,
  TruckIcon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Warehouse,
  Tag,
} from "lucide-react";
import type { MovementType, MovementStatus } from "@/types";

// Movement Type Badge
export function MovementTypeBadge({ type }: { type: MovementType }) {
  const config = {
    INBOUND: {
      label: "Inbound",
      icon: ArrowDownIcon,
      className: "badge-success",
    },
    OUTBOUND: {
      label: "Outbound",
      icon: ArrowUpIcon,
      className: "badge-danger",
    },
    ADJUSTMENT: {
      label: "Adjustment",
      icon: Package,
      className: "badge-gold",
    },
    TRANSFER: {
      label: "Transfer",
      icon: TruckIcon,
      className: "badge-info",
    },
  };

  const { label, icon: Icon, className } = config[type];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md",
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

// Status Badge
export function StatusBadge({ status }: { status: MovementStatus | string }) {
  const config: Record<string, { icon: React.ElementType; className: string }> = {
    Completed: { icon: CheckCircle2, className: "badge-success" },
    Approved: { icon: CheckCircle2, className: "badge-gold" },
    Pending: { icon: Clock, className: "badge-gold" },
    Draft: { icon: Clock, className: "badge-muted" },
    Cancelled: { icon: XCircle, className: "badge-danger" },
    "Partial Received": { icon: AlertTriangle, className: "badge-gold" },
    "In Progress": { icon: Clock, className: "badge-info" },
    Picking: { icon: Package, className: "badge-info" },
    Packing: { icon: Package, className: "badge-gold" },
    Shipped: { icon: TruckIcon, className: "badge-info" },
    active: { icon: CheckCircle2, className: "badge-success" },
    inactive: { icon: XCircle, className: "badge-muted" },
  };

  const { icon: Icon, className } = config[status] || {
    icon: Clock,
    className: "badge-muted",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md capitalize",
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

// Category Badge
export function CategoryBadge({
  category,
  code,
}: {
  category: string;
  code?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md badge-gold">
      <Tag className="h-3 w-3" />
      {code ? `[${code}] ` : ""}
      {category}
    </span>
  );
}

// Warehouse Badge
export function WarehouseBadge({
  warehouse,
  code,
}: {
  warehouse: string;
  code?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md badge-info">
      <Warehouse className="h-3 w-3" />
      {code ? `${code} - ` : ""}
      {warehouse}
    </span>
  );
}

// Stock Level Indicator
export function StockLevelIndicator({
  current,
  minimum,
  showLabel = true,
}: {
  current: number;
  minimum: number;
  showLabel?: boolean;
}) {
  const percentage = Math.min((current / minimum) * 100, 100);
  const isLow = current < minimum;
  const isCritical = current < minimum * 0.5;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden min-w-[60px]">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isCritical
              ? "bg-destructive"
              : isLow
              ? "bg-warning"
              : "progress-gold"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span
          className={cn(
            "text-xs font-medium tabular-nums",
            isCritical
              ? "text-destructive"
              : isLow
              ? "text-warning"
              : "text-muted-foreground"
          )}
        >
          {current.toLocaleString()}
        </span>
      )}
    </div>
  );
}

// Premium Stat Card
interface PremiumStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function PremiumStatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: PremiumStatCardProps) {
  return (
    <div
      className={cn(
        "stat-card rounded-xl p-5 relative overflow-hidden group",
        className
      )}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                trend.isPositive
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {trend.isPositive ? (
                <ArrowUpIcon className="h-3 w-3" />
              ) : (
                <ArrowDownIcon className="h-3 w-3" />
              )}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Transaction Card
interface TransactionCardProps {
  title: string;
  transactionNumber: string;
  date: Date;
  status: MovementStatus | string;
  type: "inbound" | "outbound";
  vendor?: string;
  garment?: string;
  totalItems: number;
  totalQuantity: number;
  onClick?: () => void;
}

export function TransactionCard({
  title,
  transactionNumber,
  date,
  status,
  type,
  vendor,
  garment,
  totalItems,
  totalQuantity,
  onClick,
}: TransactionCardProps) {
  return (
    <div
      className={cn(
        "glass-card glass-card-hover rounded-xl p-4 cursor-pointer",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-muted-foreground">{transactionNumber}</p>
          <p className="font-medium text-foreground">{title}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            {type === "inbound" ? "Vendor" : "Client"}
          </span>
          <span className="text-foreground font-medium">
            {vendor || garment || "-"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Date</span>
          <span className="text-foreground">
            {date.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Items / Qty</span>
          <span className="text-foreground font-medium">
            {totalItems} items / {totalQuantity.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl",
          type === "inbound" ? "bg-success/50" : "bg-primary/50"
        )}
      />
    </div>
  );
}

// Glow Chart Card Wrapper
interface GlowChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function GlowChartCard({
  title,
  description,
  children,
  className,
  action,
}: GlowChartCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-5 relative overflow-hidden",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="chart-glow">{children}</div>
    </div>
  );
}

// Analytics Card
interface AnalyticsCardProps {
  title: string;
  items: Array<{
    label: string;
    value: number | string;
    percentage?: number;
    color?: string;
  }>;
  className?: string;
}

export function AnalyticsCard({ title, items, className }: AnalyticsCardProps) {
  return (
    <div className={cn("glass-card rounded-xl p-5", className)}>
      <h3 className="font-semibold text-foreground mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color || "var(--primary)" }}
              />
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {typeof item.value === "number"
                  ? item.value.toLocaleString()
                  : item.value}
              </span>
              {item.percentage !== undefined && (
                <span className="text-xs text-muted-foreground">
                  ({item.percentage}%)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Empty State
interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = Package,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="p-4 rounded-full bg-muted mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-medium text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

// Loading Skeleton
export function LoadingSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse bg-muted rounded-md shimmer", className)}
      {...props}
    />
  );
}
