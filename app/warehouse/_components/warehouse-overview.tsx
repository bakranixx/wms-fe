"use client";

import { Warehouse as WarehouseIcon, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/page-components";
import { useT } from "@/hooks/use-translations";
import type { Warehouse, Location } from "@/types";

interface WarehouseOverviewProps {
  warehouse: Warehouse;
  locations: Location[];
}

export function WarehouseOverview({ warehouse, locations }: WarehouseOverviewProps) {
  const t = useT();
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>{t.warehouse.overview.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <WarehouseIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">{warehouse.name}</p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {warehouse.address}
              </p>
            </div>
          </div>
          <StatusBadge status={warehouse.status} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Warehouse Code</p>
            <p className="mt-1 font-mono text-lg font-semibold">{warehouse.code}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">{t.warehouse.overview.capacityUsed}</p>
            <p className="mt-1 text-lg font-semibold">{warehouse.capacity.toLocaleString()} units</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">{t.warehouse.overview.totalLocations}</p>
            <p className="mt-1 text-lg font-semibold">{locations.length} bins</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
