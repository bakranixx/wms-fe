"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Warehouse } from "@/types";

interface CapacityUsageProps {
  warehouse: Warehouse;
}

export function CapacityUsage({ warehouse }: CapacityUsageProps) {
  const capacityPercent = Math.round((warehouse.usedCapacity / warehouse.capacity) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Capacity Usage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <svg className="h-full w-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${capacityPercent * 3.52} 352`}
                className={capacityPercent > 80 ? "text-destructive" : "text-primary"}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold">{capacityPercent}%</span>
              <span className="text-xs text-muted-foreground">Used</span>
            </div>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Used</span>
            <span className="font-medium">{warehouse.usedCapacity.toLocaleString()} units</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Available</span>
            <span className="font-medium">{(warehouse.capacity - warehouse.usedCapacity).toLocaleString()} units</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
