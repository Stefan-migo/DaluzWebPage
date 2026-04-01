/**
 * Admin Module Type Definitions
 * Centralized types for the admin dashboard
 */

// ============================================
// PRODUCT TYPES
// ============================================

export type ProductStatus = "active" | "draft" | "archived";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: ProductStatus;
  inventory_quantity: number;
  category?: { name: string };
  categories?: { name: string };
  is_featured: boolean;
  featured?: boolean;
  title?: string;
  description?: string;
  images?: string[];
  category_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface ProductFilters {
  searchTerm: string;
  categoryFilter: string;
  statusFilter: ProductStatus | "all";
  showLowStockOnly: boolean;
}

export interface BulkOperationResult {
  success: boolean;
  operation: string;
  affected_count: number;
  results: Array<{ id: string; success: boolean; error?: string }>;
}

export interface BulkOperation {
  operation:
    | "update_status"
    | "update_category"
    | "update_pricing"
    | "update_inventory"
    | "delete";
  product_ids: string[];
  updates?: Record<string, unknown>;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  lowStockCount: number;
  totalValue: number;
}

// ============================================
// ORDER TYPES
// ============================================

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled"
  | "refunded";
export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";
export type PaymentMethod =
  | "transfer"
  | "credit_card"
  | "debit_card"
  | "cash"
  | "mercadopago";

export interface OrderItem {
  id?: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  variant_title?: string;
}

export interface ShippingInfo {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  subtotal?: number;
  shipping_cost?: number;
  discount?: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  created_at: string;
  updated_at?: string;
  order_items?: OrderItem[];
  items_count?: number;
  mp_payment_id?: string;
  mp_payment_method?: string;
  shipping?: ShippingInfo;
  notes?: string;
}

export interface OrderFilters {
  searchTerm: string;
  statusFilter: OrderStatus | "all";
  paymentStatusFilter: PaymentStatus | "all";
  dateFrom?: string;
  dateTo?: string;
}

// ============================================
// CUSTOMER TYPES
// ============================================

export type MembershipTier = "free" | "basic" | "premium" | "vip";
export type CustomerSegment =
  | "new"
  | "returning"
  | "vip"
  | "at_risk"
  | "inactive";

export interface CustomerAnalytics {
  totalSpent: number;
  orderCount: number;
  lastOrderDate?: string;
  avgOrderValue: number;
  segment: CustomerSegment;
  lifetimeValue: number;
}

export interface Customer {
  id: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  email: string;
  phone?: string;
  membership_tier: MembershipTier;
  is_member: boolean;
  created_at: string;
  updated_at?: string;
  orders?: Order[];
  analytics?: CustomerAnalytics;
  shipping_info?: {
    address_1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    phone?: string;
  };
}

export interface CustomerStats {
  totalCustomers: number;
  activeMembers: number;
  newCustomersThisMonth: number;
  membershipDistribution: Record<MembershipTier, number>;
}

export interface CustomerFilters {
  searchTerm: string;
  membershipFilter: MembershipTier | "all";
  segmentFilter: CustomerSegment | "all";
}

// ============================================
// SYSTEM CONFIG TYPES
// ============================================

export type ConfigValueType = "string" | "number" | "boolean" | "json";
export type ConfigCategory =
  | "general"
  | "payment"
  | "shipping"
  | "email"
  | "seo"
  | "security"
  | "features";

export interface SystemConfig {
  id: string;
  config_key: string;
  config_value: unknown;
  description?: string;
  category: ConfigCategory;
  is_public: boolean;
  is_sensitive: boolean;
  value_type: ConfigValueType;
  validation_rules?: Record<string, unknown>;
  updated_at: string;
  created_at?: string;
  last_modified_by?: string;
}

// ============================================
// HEALTH & MONITORING TYPES
// ============================================

export type HealthStatusType = "healthy" | "warning" | "critical";

export interface HealthMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  category: string;
  is_healthy: boolean;
  collected_at: string;
  threshold_warning?: number;
  threshold_critical?: number;
}

export interface HealthStatus {
  status: HealthStatusType;
  warnings: number;
  criticals: number;
  warning_metrics: HealthMetric[];
  critical_metrics: HealthMetric[];
  last_check: number | null;
}

// ============================================
// BACKUP TYPES
// ============================================

export interface BackupInfo {
  backup_id: string;
  backup_file: string;
  download_url: string | null;
  download_url_expires_at: string | null;
  tables_count: number;
  total_records: number;
  backup_size_mb: string;
  duration_seconds: string;
  created_at?: string;
}

export interface BackupResult extends BackupInfo {
  success: boolean;
  error?: string;
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface RevenueKPIs {
  current: number;
  previous: number;
  change: number;
  currency: string;
}

export interface OrdersKPIs {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

export interface ProductsKPIs {
  total: number;
  lowStock: number;
  outOfStock: number;
}

export interface CustomersKPIs {
  total: number;
  new: number;
  returning: number;
}

export interface DashboardKPIs {
  revenue: RevenueKPIs;
  orders: OrdersKPIs;
  products: ProductsKPIs;
  customers: CustomersKPIs;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface DashboardCharts {
  revenueTrend: ChartDataPoint[];
  ordersStatus: Record<string, number>;
  topProducts: ChartDataPoint[];
}

export interface DashboardData {
  kpis: DashboardKPIs;
  recentOrders: Order[];
  lowStockProducts: Product[];
  charts: DashboardCharts;
}

// ============================================
// PAGINATION TYPES
// ============================================

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationState;
}

// ============================================
// FORM TYPES (for CreateManualOrderForm)
// ============================================

export interface ManualOrderFormData {
  email: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  total_amount: number;
  notes?: string;
  shipping: ShippingInfo;
  items: OrderItem[];
}

export interface CustomerSearchResult {
  id: string;
  name: string;
  email: string;
  phone?: string;
  shipping_info?: ShippingInfo;
}

export interface ProductSearchResult {
  id: string;
  name: string;
  price: number;
  inventory_quantity: number;
  status: ProductStatus;
}

// ============================================
// UI STATE TYPES
// ============================================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DialogState {
  open: boolean;
  title?: string;
  description?: string;
  data?: unknown;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
