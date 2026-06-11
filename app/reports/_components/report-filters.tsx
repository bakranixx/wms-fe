"use client";

import * as React from "react";
import { Filter, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useT } from "@/hooks/use-translations";

interface ReportFiltersProps {
  reportType: string;
  dateFrom: string;
  dateTo: string;
  onReportTypeChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onGenerate: () => void;
}

export function ReportFilters({
  reportType,
  dateFrom,
  dateTo,
  onReportTypeChange,
  onDateFromChange,
  onDateToChange,
  onGenerate,
}: ReportFiltersProps) {
  const t = useT();
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Filter className="h-5 w-5" />
          Report Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="space-y-2">
            <Label>{t.reports.filters.reportType}</Label>
            <Select value={reportType} onValueChange={onReportTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inventory">{t.reports.inventoryReport.title}</SelectItem>
                <SelectItem value="incoming">Incoming Report</SelectItem>
                <SelectItem value="outgoing">Outgoing Report</SelectItem>
                <SelectItem value="lowstock">{t.reports.lowStock.title}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t.reports.filters.dateFrom}</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => onDateFromChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t.reports.filters.dateTo}</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => onDateToChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={onGenerate}>
              <BarChart3 className="mr-2 h-4 w-4" />
              {t.reports.filters.generate}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
