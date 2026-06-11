"use client";

import * as React from "react";
import { Settings, User, Bell, Shield, Database, Palette, Moon, Sun } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useT } from "@/hooks/use-translations";
import { PageHeader } from "@/components/shared/page-components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useThemeStore } from "@/stores/ui-store";
import { toast } from "sonner";
import { ProfileTab } from "./_components/profile-tab";
import { NotificationsTab } from "./_components/notifications-tab";
import { AppearanceTab } from "./_components/appearance-tab";
import { SecurityTab } from "./_components/security-tab";

export default function SettingsPage() {
  const t = useT();
  const { theme, setTheme } = useThemeStore();
  const [notifications, setNotifications] = React.useState({
    email: true,
    lowStock: true,
    orderUpdates: true,
    reports: false,
  });

  const handleToggle = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast.success(t.settings.saveSuccess);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title={t.settings.title}
        description={t.settings.description}
        breadcrumbs={[{ label: t.settings.title }]}
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            {t.settings.tabs.profile}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            {t.settings.tabs.notifications}
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            {t.settings.tabs.appearance}
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            {t.settings.tabs.security}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab onSave={handleSave} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab
            notifications={notifications}
            onToggle={handleToggle}
            onSave={handleSave}
          />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceTab theme={theme} onThemeChange={setTheme} />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab onSave={handleSave} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
