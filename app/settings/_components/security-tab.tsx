"use client";

import * as React from "react";
import { Shield } from "lucide-react";
import { useT } from "@/hooks/use-translations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SecurityTabProps {
  onSave: () => void;
}

export function SecurityTab({ onSave }: SecurityTabProps) {
  const t = useT();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.settings.security.title}</CardTitle>
        <CardDescription>{t.settings.security.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">Change Password</h4>
          <div className="grid gap-4 sm:max-w-md">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{t.settings.security.currentPassword}</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t.settings.security.newPassword}</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.settings.security.confirmPassword}</Label>
              <Input id="confirmPassword" type="password" />
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h4 className="font-medium">Two-Factor Authentication</h4>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account by enabling two-factor authentication.
          </p>
          <Button variant="outline">Enable 2FA</Button>
        </div>
        <Separator />
        <div className="space-y-4">
          <h4 className="font-medium">Sessions</h4>
          <p className="text-sm text-muted-foreground">
            Manage your active sessions and sign out from other devices.
          </p>
          <Button variant="outline">View Active Sessions</Button>
        </div>
        <div className="flex justify-end">
          <Button onClick={onSave}>{t.settings.security.save}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
