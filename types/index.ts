// Product Types
export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  unit: string;
  color: string;
  size: string;
  price: number;
  stock: number;
  minStock: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Warehouse & Location Types
export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  capacity: number;
  usedCapacity: number;
  status: 'active' | 'inactive';
}

export interface Location {
  id: string;
  warehouseId: string;
  zone: string;
  rack: string;
  shelf: string;
  binCode: string;
  capacity: number;
  usedCapacity: number;
}

// Inventory Types
export interface InventoryItem {
  id: string;
  productId: string;
  product: Product;
  warehouseId: string;
  warehouse: Warehouse;
  locationId: string;
  location: Location;
  availableStock: number;
  reservedStock: number;
  incomingStock: number;
  outgoingStock: number;
  lastUpdated: Date;
}

// Stock Movement Types
export type MovementType = 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT' | 'TRANSFER';
export type SourceType = 'MANUAL' | 'PURCHASE_ORDER' | 'DELIVERY_ORDER' | 'ADJUSTMENT' | 'TRANSFER';
export type MovementStatus = 'Draft' | 'Posted' | 'Cancelled';

export interface StockMovement {
  id: string;
  transactionId: string;
  productId: string;
  product: Product;
  movementType: MovementType;
  sourceType: SourceType;
  quantity: number;
  warehouseId: string;
  warehouse: Warehouse;
  locationId?: string;
  location?: Location;
  referenceNumber?: string;
  vendorId?: string;
  vendor?: Vendor;
  garmentId?: string;
  garment?: Garment;
  purchaseOrderId?: string;
  purchaseOrder?: PurchaseOrder;
  deliveryOrderId?: string;
  deliveryOrder?: DeliveryOrder;
  adjustmentReason?: string;
  userId: string;
  userName: string;
  status: MovementStatus;
  timestamp: Date;
  notes?: string;
}

// Vendor Types
export type VendorType = 
  | 'Fabric Supplier'
  | 'Accessories Supplier'
  | 'Printing Vendor'
  | 'Embroidery Vendor'
  | 'Packaging Vendor'
  | 'General Supplier';

export interface Vendor {
  id: string;
  code: string;
  name: string;
  companyName: string;
  picName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  vendorType: VendorType;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Garment/Client Types
export type ProductionType = 
  | 'Jersey'
  | 'Hoodie'
  | 'T-Shirt'
  | 'Polo'
  | 'Jacket'
  | 'Custom Apparel';

export interface Garment {
  id: string;
  code: string;
  name: string;
  brand: string;
  picName: string;
  email: string;
  phone: string;
  address: string;
  productionType: ProductionType;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Purchase Order Types
export type POStatus = 
  | 'Draft'
  | 'Approved'
  | 'Partial Received'
  | 'Completed'
  | 'Cancelled';

export interface POItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unit: string;
  price: number;
  total: number;
  receivedQuantity: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendor: Vendor;
  warehouseId: string;
  warehouse: Warehouse;
  orderDate: Date;
  expectedDate: Date;
  status: POStatus;
  items: POItem[];
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Delivery Order Types
export type DOStatus = 
  | 'Draft'
  | 'Picking'
  | 'Packing'
  | 'Shipped'
  | 'Completed'
  | 'Cancelled';

export interface DOItem {
  id: string;
  productId: string;
  product: Product;
  availableStock: number;
  requestedQuantity: number;
  allocatedQuantity: number;
}

export interface DeliveryOrder {
  id: string;
  doNumber: string;
  garmentId: string;
  garment: Garment;
  warehouseId: string;
  warehouse: Warehouse;
  deliveryDate: Date;
  status: DOStatus;
  items: DOItem[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Receiving Types
export interface ReceivingItem {
  id: string;
  poItemId: string;
  productId: string;
  product: Product;
  expectedQuantity: number;
  receivedQuantity: number;
  rejectedQuantity: number;
  status: 'Pending' | 'Received' | 'Partial' | 'Rejected';
}

export interface Receiving {
  id: string;
  purchaseOrderId: string;
  purchaseOrder: PurchaseOrder;
  receivingDate: Date;
  receiverName: string;
  items: ReceivingItem[];
  status: 'Pending' | 'In Progress' | 'Completed';
  notes?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalStock: number;
  incomingGoods: number;
  outgoingGoods: number;
  activePO: number;
  activeDO: number;
  lowStockAlerts: number;
  warehouseCapacity: number;
  warehouseUsed: number;
}

export interface RecentActivity {
  id: string;
  type: 'inbound' | 'outbound' | 'adjustment' | 'po_created' | 'do_created';
  description: string;
  timestamp: Date;
  user: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

// Table Types
export interface TableFilter {
  field: string;
  value: string;
}

export interface TableSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}
