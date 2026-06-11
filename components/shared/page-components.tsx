"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="h-4 w-4" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: "default" | "primary" | "success" | "warning" | "info";
}

const iconBgVariants = {
  default: "bg-muted",
  primary: "bg-primary/20",
  success: "bg-emerald-500/20",
  warning: "bg-amber-500/20",
  info: "bg-primary/20",
};

const iconColorVariants = {
  default: "text-muted-foreground",
  primary: "text-primary",
  success: "text-emerald-500",
  warning: "text-amber-500",
  info: "text-primary",
};

export function SummaryCard({
  title,
  value,
  icon,
  description,
  trend,
  className,
  variant = "primary",
}: SummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 shadow-sm transition-all card-hover",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold">{value}</span>
            {trend && (
              <span
                className={cn(
                  "flex items-center gap-0.5 text-sm font-semibold",
                  trend.isPositive ? "text-emerald-500" : "text-destructive"
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className={cn(
          "rounded-xl p-3",
          iconBgVariants[variant]
        )}>
          <div className={cn("h-6 w-6", iconColorVariants[variant])}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "destructive" | "info" | "secondary";
}

const statusVariants: Record<string, StatusBadgeProps["variant"]> = {
  // PO Status
  Draft: "secondary",
  Approved: "info",
  "Partial Received": "warning",
  Completed: "success",
  Cancelled: "destructive",
  // DO Status
  Picking: "info",
  Packing: "warning",
  Shipped: "info",
  // General
  active: "success",
  inactive: "secondary",
  // Receiving Status
  Pending: "secondary",
  "In Progress": "warning",
  Received: "success",
  Partial: "warning",
  Rejected: "destructive",
  // Movement Types
  INBOUND: "success",
  OUTBOUND: "info",
  ADJUSTMENT: "warning",
  TRANSFER: "secondary",
};

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const resolvedVariant = variant || statusVariants[status] || "default";

  const variantStyles: Record<string, string> = {
    default: "bg-muted text-muted-foreground border-border",
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    destructive: "bg-destructive/10 text-destructive border-destructive/30",
    info: "bg-primary/10 text-primary border-primary/30",
    secondary: "bg-secondary text-secondary-foreground border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[resolvedVariant || "default"]
      )}
    >
      {status}
    </span>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 p-12 text-center">
      {icon && (
        <div className="rounded-xl bg-primary/10 p-4 text-primary">{icon}</div>
      )}
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function LoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface MiniCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export function MiniCard({ title, value, icon, trend, description }: MiniCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-4 card-hover">
      <div className="rounded-xl bg-primary/10 p-3">
        <div className="h-6 w-6 text-primary">{icon}</div>
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold">{value}</span>
          {trend && (
            <span
              className={cn(
                "flex items-center text-xs font-medium",
                trend.isPositive ? "text-emerald-500" : "text-destructive"
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="mr-0.5 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-0.5 h-3 w-3" />
              )}
              {trend.value}%
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
