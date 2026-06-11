"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Gold-themed colors matching the design
const COLORS = [
  "oklch(0.75 0.14 75)",  // Primary gold
  "oklch(0.7 0.12 55)",   // Warm gold
  "oklch(0.65 0.1 35)",   // Orange gold
  "oklch(0.6 0.08 95)",   // Soft gold
  "oklch(0.8 0.1 65)",    // Light gold
];

interface ChartContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  viewAllHref?: string;
}

export function ChartContainer({ 
  title, 
  description, 
  children, 
  className,
  action,
  viewAllHref,
}: ChartContainerProps) {
  return (
    <Card className={cn("card-hover", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {description && <CardDescription className="text-xs mt-0.5">{description}</CardDescription>}
        </div>
        {action}
        {viewAllHref && (
          <Button variant="ghost" size="sm" className="text-primary text-xs h-8">
            View all
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-2">{children}</CardContent>
    </Card>
  );
}

interface BarChartProps {
  data: { name: string; [key: string]: string | number }[];
  dataKeys: string[];
  xAxisKey?: string;
  height?: number;
  stacked?: boolean;
}

export function SimpleBarChart({
  data,
  dataKeys,
  xAxisKey = "name",
  height = 300,
  stacked = false,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 75)" vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          stroke="oklch(0.5 0 0)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="oklch(0.5 0 0)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "oklch(0.16 0.008 75)",
            border: "1px solid oklch(0.25 0.01 75)",
            borderRadius: "8px",
            color: "oklch(0.9 0 0)",
          }}
          labelStyle={{ color: "oklch(0.9 0 0)" }}
          itemStyle={{ color: "oklch(0.75 0.14 75)" }}
        />
        <Legend 
          wrapperStyle={{ fontSize: "12px" }}
        />
        {dataKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={COLORS[index % COLORS.length]}
            radius={[4, 4, 0, 0]}
            stackId={stacked ? "stack" : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

interface LineChartProps {
  data: { name: string; [key: string]: string | number }[];
  dataKeys: string[];
  xAxisKey?: string;
  height?: number;
  area?: boolean;
}

export function SimpleLineChart({
  data,
  dataKeys,
  xAxisKey = "name",
  height = 300,
  area = false,
}: LineChartProps) {
  const ChartComponent = area ? AreaChart : LineChart;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ChartComponent data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          {dataKeys.map((key, index) => (
            <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 75)" vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          stroke="oklch(0.5 0 0)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="oklch(0.5 0 0)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "oklch(0.16 0.008 75)",
            border: "1px solid oklch(0.25 0.01 75)",
            borderRadius: "8px",
            color: "oklch(0.9 0 0)",
          }}
          labelStyle={{ color: "oklch(0.9 0 0)" }}
          itemStyle={{ color: "oklch(0.75 0.14 75)" }}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        {dataKeys.map((key, index) =>
          area ? (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[index % COLORS.length]}
              fill={`url(#gradient-${key})`}
              strokeWidth={2}
            />
          ) : (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          )
        )}
      </ChartComponent>
    </ResponsiveContainer>
  );
}

interface PieChartProps {
  data: { name: string; value: number }[];
  height?: number;
  innerRadius?: number;
  showLabel?: boolean;
  showLegend?: boolean;
  centerText?: { label: string; value: string };
}

export function SimplePieChart({
  data,
  height = 300,
  innerRadius = 60,
  showLabel = false,
  showLegend = true,
  centerText,
}: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={
            showLabel
              ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`
              : undefined
          }
          innerRadius={innerRadius}
          outerRadius={innerRadius + 30}
          fill="#8884d8"
          dataKey="value"
          paddingAngle={2}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "oklch(0.16 0.008 75)",
            border: "1px solid oklch(0.25 0.01 75)",
            borderRadius: "8px",
            color: "oklch(0.9 0 0)",
          }}
          formatter={(value: number) => [
            `Rp ${value.toLocaleString()}`,
            ""
          ]}
        />
        {showLegend && (
          <Legend 
            layout="vertical" 
            align="right" 
            verticalAlign="middle"
            wrapperStyle={{ fontSize: "11px", paddingLeft: "10px" }}
            formatter={(value, entry) => {
              const item = data.find(d => d.name === value);
              const percent = item ? ((item.value / total) * 100).toFixed(1) : 0;
              return (
                <span style={{ color: "oklch(0.7 0 0)" }}>
                  {value} ({percent}%)
                </span>
              );
            }}
          />
        )}
        {centerText && (
          <text
            x="40%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            <tspan x="40%" dy="-0.5em" fontSize="24" fontWeight="bold" fill="oklch(0.75 0.14 75)">
              Rp {parseInt(centerText.value).toLocaleString()}
            </tspan>
            <tspan x="40%" dy="1.5em" fontSize="12" fill="oklch(0.6 0 0)">
              {centerText.label}
            </tspan>
          </text>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}

interface ProgressChartProps {
  data: { name: string; used: number; available: number }[];
  height?: number;
}

export function CapacityChart({ data, height = 300 }: ProgressChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 75)" horizontal={false} />
        <XAxis
          type="number"
          stroke="oklch(0.5 0 0)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          stroke="oklch(0.5 0 0)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "oklch(0.16 0.008 75)",
            border: "1px solid oklch(0.25 0.01 75)",
            borderRadius: "8px",
            color: "oklch(0.9 0 0)",
          }}
          labelStyle={{ color: "oklch(0.9 0 0)" }}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        <Bar dataKey="used" fill={COLORS[0]} stackId="capacity" radius={[0, 0, 0, 0]} name="Used" />
        <Bar
          dataKey="available"
          fill="oklch(0.3 0.02 75)"
          stackId="capacity"
          radius={[0, 4, 4, 0]}
          name="Available"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface ServiceItemProps {
  name: string;
  value: number;
  color?: string;
  index?: number;
}

export function ServiceItem({ name, value, index = 0 }: ServiceItemProps) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/50 transition-colors">
      <div className="flex items-center gap-3">
        <div 
          className="w-1 h-6 rounded-full" 
          style={{ backgroundColor: COLORS[index % COLORS.length] }}
        />
        <span className="text-sm">{name}</span>
      </div>
      <span className="text-sm font-semibold text-primary">
        Rp {value.toLocaleString()}
      </span>
    </div>
  );
}
