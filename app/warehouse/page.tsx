"use client";

import * as React from "react";
import { Warehouse as WarehouseIcon, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/shared/page-components";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockWarehouses, mockLocations } from "@/lib/mock-data";
import type { Warehouse, Location } from "@/types";
import { WarehouseOverview } from "./_components/warehouse-overview";
import { CapacityUsage } from "./_components/capacity-usage";
import { StorageLocations } from "./_components/storage-locations";

export default function WarehousePage() {
  const [warehouses] = React.useState<Warehouse[]>(mockWarehouses);
  const [locations] = React.useState<Location[]>(mockLocations);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState<string>(warehouses[0]?.id || "");

  return (
    <DashboardLayout>
      <PageHeader
        title="Warehouse"
        description="Manage warehouse locations and capacity"
        breadcrumbs={[{ label: "Warehouse" }]}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Warehouse
          </Button>
        }
      />

      <Tabs value={selectedWarehouse} onValueChange={setSelectedWarehouse} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
          {warehouses.map((wh) => (
            <TabsTrigger key={wh.id} value={wh.id} className="gap-2">
              <WarehouseIcon className="h-4 w-4" />
              {wh.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {warehouses.map((warehouse) => {
          const whLocations = locations.filter((loc) => loc.warehouseId === warehouse.id);

          return (
            <TabsContent key={warehouse.id} value={warehouse.id} className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <WarehouseOverview warehouse={warehouse} locations={whLocations} />
                <CapacityUsage warehouse={warehouse} />
              </div>
              <StorageLocations locations={whLocations} />
            </TabsContent>
          );
        })}
      </Tabs>
    </DashboardLayout>
  );
}
