"use client";

import { Package, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/use-translations";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/page-components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Location } from "@/types";

interface StorageLocationsProps {
  locations: Location[];
}

export function StorageLocations({ locations }: StorageLocationsProps) {
  const t = useT();
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{t.warehouse.locations.title}</CardTitle>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {locations.length === 0 ? (
          <EmptyState
            icon={<Package className="h-8 w-8" />}
            title="No locations found"
            description="Add storage locations to this warehouse."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bin Code</TableHead>
                <TableHead>{t.warehouse.locations.zone}</TableHead>
                <TableHead>{t.warehouse.locations.rack}</TableHead>
                <TableHead>Shelf</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => {
                const usagePercent = Math.round((location.usedCapacity / location.capacity) * 100);
                return (
                  <TableRow key={location.id}>
                    <TableCell className="font-mono font-medium">{location.binCode}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Zone {location.zone}</Badge>
                    </TableCell>
                    <TableCell>{location.rack}</TableCell>
                    <TableCell>{location.shelf}</TableCell>
                    <TableCell>{location.capacity} units</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={usagePercent} className="h-2 w-20" />
                        <span className="text-sm text-muted-foreground">{usagePercent}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
