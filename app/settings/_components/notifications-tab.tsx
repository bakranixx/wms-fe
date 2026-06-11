"use client";

import * as React from "react";
import { Bell } from "lucide-react";
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Configure how you receive notifications.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
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
            <Label>Low Stock Alerts</Label>
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
            <Label>Order Updates</Label>
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
            <Label>Weekly Reports</Label>
            <p className="text-sm text-muted-foreground">Receive weekly inventory summary reports</p>
          </div>
          <Switch
            checked={notifications.reports}
            onCheckedChange={(checked) => onToggle("reports", checked)}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={onSave}>Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
}
