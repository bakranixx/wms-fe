"use client";

import * as React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  MoveRight,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Stats {
  totalMovements: number;
  inbound: number;
  outbound: number;
  adjustments: number;
  transfers: number;
  drafts: number;
}

interface MovementStatsProps {
  stats: Stats;
}

export function MovementStats({ stats }: MovementStatsProps) {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Inbound
              </p>
              <p className="mt-1 text-2xl font-bold text-emerald-500">
                +{stats.inbound.toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-emerald-500/10 p-3">
              <ArrowDownRight className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Outbound
              </p>
              <p className="mt-1 text-2xl font-bold text-amber-500">
                -{stats.outbound.toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-amber-500/10 p-3">
              <ArrowUpRight className="h-5 w-5 text-amber-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Adjustments
              </p>
              <p className="mt-1 text-2xl font-bold text-blue-500">{stats.adjustments}</p>
            </div>
            <div className="rounded-full bg-blue-500/10 p-3">
              <RefreshCw className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Transfers
              </p>
              <p className="mt-1 text-2xl font-bold text-purple-500">{stats.transfers}</p>
            </div>
            <div className="rounded-full bg-purple-500/10 p-3">
              <MoveRight className="h-5 w-5 text-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Pending Drafts
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-400">{stats.drafts}</p>
            </div>
            <div className="rounded-full bg-slate-500/10 p-3">
              <FileText className="h-5 w-5 text-slate-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
