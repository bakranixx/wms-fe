"use client";

import * as React from "react";
import { User } from "lucide-react";
import { useT } from "@/hooks/use-translations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileTabProps {
  onSave: () => void;
}

export function ProfileTab({ onSave }: ProfileTabProps) {
  const t = useT();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.settings.profile.title}</CardTitle>
        <CardDescription>{t.settings.profile.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/avatars/admin.png" />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">AD</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button variant="outline">Change Photo</Button>
            <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" defaultValue="Admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" defaultValue="User" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t.settings.profile.email}</Label>
            <Input id="email" type="email" defaultValue="admin@warehouse.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t.settings.profile.phone}</Label>
            <Input id="phone" defaultValue="+62812345678" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">{t.settings.profile.role}</Label>
          <Input id="role" defaultValue="Administrator" disabled />
        </div>
        <div className="flex justify-end">
          <Button onClick={onSave}>{t.settings.profile.save}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
