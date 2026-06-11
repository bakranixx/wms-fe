"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Search,
  Bell,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  HelpCircle,
  ChevronDown,
  Menu,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchStore, useNotificationStore, useThemeStore, useSidebarStore } from "@/stores/ui-store";

const mockNotifications = [
  { id: 1, title: "Low Stock Alert", message: "T-Shirt Blank - White is below minimum stock", time: "5 min ago", unread: true },
  { id: 2, title: "PO Approved", message: "PO-2024-003 has been approved", time: "1 hour ago", unread: true },
  { id: 3, title: "Delivery Completed", message: "DO-2024-003 successfully delivered", time: "2 hours ago", unread: false },
  { id: 4, title: "New Receiving", message: "Items from PO-2024-002 received", time: "3 hours ago", unread: false },
  { id: 5, title: "Stock Adjustment", message: "Inventory count completed for Zone A", time: "5 hours ago", unread: false },
];

export function TopNavbar() {
  const { isCollapsed, setCollapsed } = useSidebarStore();
  const { query, setQuery, isOpen: searchOpen, setOpen: setSearchOpen } = useSearchStore();
  const { unreadCount, isOpen: notifOpen, setOpen: setNotifOpen, markAllRead } = useNotificationStore();
  const { theme, setTheme } = useThemeStore();

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  return (
    <>
      <header
        style={{ marginLeft: isCollapsed ? 72 : 260 }}
        className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 transition-[margin] duration-200"
      >
        {/* Left Section - Hamburger & Welcome */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            onClick={() => setCollapsed(!isCollapsed)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-foreground">
              Welcome back, Admin!
            </h1>
            <p className="text-sm text-muted-foreground">
              Here&apos;s what&apos;s happening with your warehouse today.
            </p>
          </div>
        </div>

        {/* Right Section - Search, Actions, Profile */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative hidden lg:flex">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search anything..."
              className="w-64 pl-9 bg-secondary/50 border-border/50 focus:bg-background"
              onClick={() => setSearchOpen(true)}
              readOnly
            />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-primary" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-primary hover:text-primary"
                    onClick={markAllRead}
                  >
                    Mark all read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-80">
                {mockNotifications.map((notif) => (
                  <DropdownMenuItem
                    key={notif.id}
                    className={cn(
                      "flex cursor-pointer flex-col items-start gap-1 p-3",
                      notif.unread && "bg-primary/5"
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-medium">{notif.title}</span>
                      {notif.unread && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {notif.message}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {notif.time}
                    </span>
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Range */}
          <Button variant="outline" className="hidden xl:flex gap-2 h-9 px-3 border-border/50 bg-secondary/30">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm">
              {format(weekAgo, "MMM d")} - {format(today, "MMM d, yyyy")}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 h-10 px-2 hover:bg-secondary/50">
                <Avatar className="h-8 w-8 border-2 border-primary/30">
                  <AvatarImage src="/avatars/admin.png" />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">AM</AvatarFallback>
                </Avatar>
                <div className="hidden xl:flex flex-col items-start text-left">
                  <span className="text-sm font-semibold">Alex Morgan</span>
                  <span className="text-xs text-muted-foreground">Administrator</span>
                </div>
                <ChevronDown className="hidden xl:block h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products, orders, vendors..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
            {query && (
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Searching for &quot;{query}&quot;...
                </p>
              </div>
            )}
            {!query && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Quick Links</p>
                <div className="grid grid-cols-2 gap-2">
                  {["Products", "Inventory", "Purchase Orders", "Delivery Orders"].map((item) => (
                    <Button
                      key={item}
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        setSearchOpen(false);
                      }}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
