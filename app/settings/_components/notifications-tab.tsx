"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { useT } from "@/hooks/use-translations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface NotificationsTabProps {
  notifications: {
    email: boolean;
    lowStock: boolean;
    orderUpdates: boolean;
    reports: boolean;
  };
  onToggle: (key: string, value: boolean) => void;
  onSave: () => void;
}

export function NotificationsTab({ notifications, onToggle, onSave }: NotificationsTabProps) {
  const t = useT();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.settings.notifications.title}</CardTitle>
        <CardDescription>{t.settings.notifications.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t.settings.notifications.email}</Label>
            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
          </div>
          <Switch
            checked={notifications.email}
            onCheckedChange={(checked) => onToggle("email", checked)}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t.settings.notifications.lowStock}</Label>
            <p className="text-sm text-muted-foreground">Get notified when stock falls below minimum</p>
          </div>
          <Switch
            checked={notifications.lowStock}
            onCheckedChange={(checked) => onToggle("lowStock", checked)}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t.settings.notifications.orderUpdates}</Label>
            <p className="text-sm text-muted-foreground">Receive updates on PO and DO status changes</p>
          </div>
          <Switch
            checked={notifications.orderUpdates}
            onCheckedChange={(checked) => onToggle("orderUpdates", checked)}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t.settings.notifications.reports}</Label>
            <p className="text-sm text-muted-foreground">Receive weekly inventory summary reports</p>
          </div>
          <Switch
            checked={notifications.reports}
            onCheckedChange={(checked) => onToggle("reports", checked)}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={onSave}>{t.settings.notifications.save}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
