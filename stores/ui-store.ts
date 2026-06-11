import { create } from 'zustand';
import { mockPurchaseOrders } from '@/lib/mock-data';
import type { PurchaseOrder, POStatus } from '@/types';

// Purchase Orders Store (shared between list and create pages)
interface PurchaseOrdersState {
  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (po: PurchaseOrder) => void;
  approvePurchaseOrder: (id: string) => void;
}

export const usePurchaseOrdersStore = create<PurchaseOrdersState>((set) => ({
  purchaseOrders: mockPurchaseOrders,
  addPurchaseOrder: (po) =>
    set((state) => ({ purchaseOrders: [po, ...state.purchaseOrders] })),
  approvePurchaseOrder: (id) =>
    set((state) => ({
      purchaseOrders: state.purchaseOrders.map((p) =>
        p.id === id ? { ...p, status: 'Approved' as POStatus, updatedAt: new Date() } : p,
      ),
    })),
}));

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  isCollapsed: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
}));

interface SearchState {
  query: string;
  isOpen: boolean;
  setQuery: (query: string) => void;
  setOpen: (open: boolean) => void;
  clear: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  isOpen: false,
  setQuery: (query) => set({ query }),
  setOpen: (open) => set({ isOpen: open }),
  clear: () => set({ query: '', isOpen: false }),
}));

interface NotificationState {
  unreadCount: number;
  isOpen: boolean;
  setUnreadCount: (count: number) => void;
  setOpen: (open: boolean) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 5,
  isOpen: false,
  setUnreadCount: (count) => set({ unreadCount: count }),
  setOpen: (open) => set({ isOpen: open }),
  markAllRead: () => set({ unreadCount: 0 }),
}));

interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
}));

type Language = 'en' | 'id';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),
}));
