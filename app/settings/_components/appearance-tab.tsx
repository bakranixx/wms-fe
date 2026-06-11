"use client";

import * as React from "react";
import { Sun, Moon, Settings, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface AppearanceTabProps {
  theme: "light" | "dark" | "system";
  onThemeChange: (theme: "light" | "dark" | "system") => void;
}

export function AppearanceTab({ theme, onThemeChange }: AppearanceTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>Customize how the application looks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Theme</Label>
          <div className="grid gap-4 sm:grid-cols-3">
            <button
              onClick={() => onThemeChange("light")}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                theme === "light" ? "border-primary" : "border-border hover:border-muted-foreground"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-black shadow">
                <Sun className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Light</span>
            </button>
            <button
              onClick={() => onThemeChange("dark")}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                theme === "dark" ? "border-primary" : "border-border hover:border-muted-foreground"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-900 text-white shadow">
                <Moon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Dark</span>
            </button>
            <button
              onClick={() => onThemeChange("system")}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                theme === "system" ? "border-primary" : "border-border hover:border-muted-foreground"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-white to-zinc-900 shadow">
                <Settings className="h-6 w-6 text-gray-500" />
              </div>
              <span className="text-sm font-medium">System</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
