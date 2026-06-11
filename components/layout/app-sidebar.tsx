"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ClipboardList,
  Users,
  Shirt,
  FileText,
  Truck,
  PackageCheck,
  ArrowLeftRight,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebarStore, useLanguageStore } from "@/stores/ui-store";
import { getTranslations } from "@/lib/translations";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface MenuCategory {
  label: string;
  items: MenuItem[];
}

const menuCategories: MenuCategory[] = [
  {
    label: "main",
    items: [
      { name: "dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "masterData",
    items: [
      { name: "products", href: "/products", icon: Package },
      { name: "categories", href: "/categories", icon: Tag },
      { name: "vendors", href: "/vendors", icon: Users },
      { name: "garments", href: "/garments", icon: Shirt },
      { name: "warehouse", href: "/warehouse", icon: Warehouse },
    ],
  },
  {
    label: "transactions",
    items: [
      { name: "purchaseOrders", href: "/purchase-orders", icon: FileText },
      { name: "deliveryOrders", href: "/delivery-orders", icon: Truck },
      { name: "stockMovement", href: "/stock-movement", icon: ArrowLeftRight },
    ],
  },
  {
    label: "inventory",
    items: [
      { name: "currentStock", href: "/inventory", icon: ClipboardList },
      { name: "receiving", href: "/receiving", icon: PackageCheck },
    ],
  },
  {
    label: "analytics",
    items: [
      { name: "reports", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    label: "system",
    items: [
      { name: "settings", href: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isCollapsed, setCollapsed } = useSidebarStore();
  const { language } = useLanguageStore();
  const t = getTranslations(language);

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar"
      >
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <ShieldCheck className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-primary">{t.sidebar.wmsPro}</span>
                  <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">{t.sidebar.warehouseSystem}</span>
                </div>
              </motion.div>
            )}
            {isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary mx-auto"
              >
                <ShieldCheck className="h-5 w-5 text-primary-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(true)}
              className="h-7 w-7 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        <ScrollArea className="h-[calc(100vh-4rem)]">
          <nav className="flex flex-col gap-1 p-3">
            {menuCategories.map((category, categoryIndex) => (
              <div key={category.label} className={cn(categoryIndex > 0 && "mt-4")}>
                {/* Category Label */}
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mb-2 px-3"
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                        {t.sidebar[category.label as keyof typeof t.sidebar]}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {isCollapsed && categoryIndex > 0 && (
                  <div className="mx-3 mb-2 border-t border-sidebar-border" />
                )}

                {/* Menu Items */}
                <div className="flex flex-col gap-0.5">
                  {category.items.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    const linkContent = (
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        )}
                      >
                        <Icon className={cn(
                          "h-5 w-5 shrink-0 transition-colors",
                          isActive ? "text-primary-foreground" : "text-sidebar-foreground/50 group-hover:text-primary"
                        )} />
                        <AnimatePresence mode="wait">
                          {!isCollapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              className="flex-1 truncate"
                            >
                              {t.sidebar[item.name as keyof typeof t.sidebar]}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {!isCollapsed && !isActive && (
                          <Eye className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-50" />
                        )}
                      </Link>
                    );

                    if (isCollapsed) {
                      return (
                        <Tooltip key={item.href}>
                          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                          <TooltipContent side="right" className="font-medium">
                            {t.sidebar[item.name as keyof typeof t.sidebar]}
                          </TooltipContent>
                        </Tooltip>
                      );
                    }

                    return <div key={item.href}>{linkContent}</div>;
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Expand Button when collapsed */}
          {isCollapsed && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(false)}
                className="h-8 w-8 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </ScrollArea>
      </motion.aside>
    </TooltipProvider>
  );
}

export function MobileSidebarTrigger() {
  const { setOpen, isOpen } = useSidebarStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      onClick={() => setOpen(!isOpen)}
    >
      <LayoutDashboard className="h-5 w-5" />
    </Button>
  );
}
