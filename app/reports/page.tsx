"use client";

import * as React from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/shared/page-components";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProducts, mockStockMovements } from "@/lib/mock-data";
import { toast } from "sonner";
import { useT } from "@/hooks/use-translations";
import { ReportFilters } from "./_components/report-filters";
import { InventoryReport } from "./_components/inventory-report";
import { IncomingReport } from "./_components/incoming-report";
import { OutgoingReport } from "./_components/outgoing-report";
import { LowStockReport } from "./_components/lowstock-report";

export default function ReportsPage() {
  const t = useT();
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [reportType, setReportType] = React.useState("inventory");

  const lowStockProducts = mockProducts.filter((p) => p.stock < p.minStock);
  const inboundMovements = mockStockMovements.filter((m) => m.movementType === "INBOUND");
  const outboundMovements = mockStockMovements.filter((m) => m.movementType === "OUTBOUND");

  const handleExport = (format: "csv" | "excel") => {
    toast.success(`Exporting report as ${format.toUpperCase()}...`);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title={t.reports.title}
        description={t.reports.description}
        breadcrumbs={[{ label: t.reports.title }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport("csv")}>
              <Download className="mr-2 h-4 w-4" />
              {t.reports.exportCSV}
            </Button>
            <Button onClick={() => handleExport("excel")}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              {t.reports.exportExcel}
            </Button>
          </div>
        }
      />

      <ReportFilters
        reportType={reportType}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onReportTypeChange={setReportType}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onGenerate={() => {}}
      />

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inventory">{t.reports.tabs.inventory}</TabsTrigger>
          <TabsTrigger value="incoming">{t.reports.tabs.incoming}</TabsTrigger>
          <TabsTrigger value="outgoing">{t.reports.tabs.outgoing}</TabsTrigger>
          <TabsTrigger value="lowstock">{t.reports.tabs.lowStock}</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          <InventoryReport products={mockProducts} />
        </TabsContent>

        <TabsContent value="incoming" className="space-y-6">
          <IncomingReport movements={inboundMovements} />
        </TabsContent>

        <TabsContent value="outgoing" className="space-y-6">
          <OutgoingReport movements={outboundMovements} />
        </TabsContent>

        <TabsContent value="lowstock" className="space-y-6">
          <LowStockReport products={lowStockProducts} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
