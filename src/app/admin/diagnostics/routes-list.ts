export interface AdminRouteMetadata {
  path: string;
  label: string;
  category: string;
  methods: ('GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE')[];
  defaultPayload?: any;
  description?: string;
}

export const ROUTE_CATEGORIES = [
  'Dashboard & Auth',
  'Products',
  'Orders',
  'Customers',
  'Reviews',
  'Support',
  'System',
  'Shipping',
  'Public',
] as const;

export type RouteCategory = (typeof ROUTE_CATEGORIES)[number];

export const ADMIN_ROUTES: AdminRouteMetadata[] = [
  // ── Dashboard & Auth ──
  { path: '/api/admin/dashboard', label: 'Main Dashboard', category: 'Dashboard & Auth', methods: ['GET'], description: 'Stats, revenue and recent activity' },
  { path: '/api/admin/analytics/dashboard', label: 'Analytics Dashboard', category: 'Dashboard & Auth', methods: ['GET'], description: 'Detailed analytics overview' },
  { path: '/api/admin/analytics/funnel', label: 'Analytics Funnel', category: 'Dashboard & Auth', methods: ['GET'], description: 'Conversion funnel data' },
  { path: '/api/admin/check-status', label: 'Auth Check', category: 'Dashboard & Auth', methods: ['GET'], description: 'Verify admin authentication status' },
  { path: '/api/admin/notifications', label: 'Notifications', category: 'Dashboard & Auth', methods: ['GET', 'PATCH'], description: 'Admin notification feed' },
  { path: '/api/admin/ab-tests', label: 'A/B Tests', category: 'Dashboard & Auth', methods: ['GET', 'POST'], defaultPayload: { experiment_name: "TestExp", variant_control: {}, variant_test: {} } },

  // ── Products ──
  { path: '/api/admin/products', label: 'Products List', category: 'Products', methods: ['GET', 'POST'], defaultPayload: { name: "Test Product", description: "Diagnostics test", price: 100, status: "draft", category_id: null }, description: 'List all products or create one' },
  { path: '/api/admin/products/[id]', label: 'Individual Product', category: 'Products', methods: ['GET', 'PUT', 'DELETE'], defaultPayload: { name: "Updated Test Product", price: 150 }, description: 'Get, update or delete a single product' },
  { path: '/api/admin/products/stats', label: 'Product Stats', category: 'Products', methods: ['GET'], description: 'Inventory counts and status breakdown' },
  { path: '/api/admin/products/search', label: 'Product Search', category: 'Products', methods: ['GET'], description: 'Search products by query params (?q=)' },
  { path: '/api/admin/products/bulk', label: 'Bulk Products', category: 'Products', methods: ['GET', 'POST'], description: 'Bulk operations on products' },

  // ── Orders ──
  { path: '/api/admin/orders', label: 'Orders List', category: 'Orders', methods: ['GET', 'POST', 'DELETE'], defaultPayload: { action: "get_stats" }, description: 'List orders or get stats' },
  { path: '/api/admin/orders/[id]', label: 'Individual Order', category: 'Orders', methods: ['GET', 'PATCH', 'DELETE'], description: 'Get, update or delete a single order' },

  // ── Customers ──
  { path: '/api/admin/customers', label: 'Customers List', category: 'Customers', methods: ['GET', 'POST'], defaultPayload: { first_name: "Test", last_name: "User", email: "test@example.com" }, description: 'List or create customers' },
  { path: '/api/admin/customers/[id]', label: 'Individual Customer', category: 'Customers', methods: ['GET', 'PUT'], description: 'Get or update a single customer' },
  { path: '/api/admin/customers/search', label: 'Customer Search', category: 'Customers', methods: ['GET'], description: 'Search customers (?q=)' },

  // ── Reviews ──
  { path: '/api/admin/reviews', label: 'Reviews List', category: 'Reviews', methods: ['GET'], description: 'List all product reviews' },

  // ── Support ──
  { path: '/api/admin/support/tickets', label: 'Support Tickets', category: 'Support', methods: ['GET', 'POST'], description: 'List or create support tickets' },
  { path: '/api/admin/support/tickets/[id]', label: 'Individual Ticket', category: 'Support', methods: ['GET', 'PUT', 'DELETE'], description: 'Get, update or delete a ticket' },
  { path: '/api/admin/support/categories', label: 'Support Categories', category: 'Support', methods: ['GET', 'POST'], description: 'Support category management' },
  { path: '/api/admin/support/templates', label: 'Support Templates', category: 'Support', methods: ['GET', 'POST', 'PUT'], description: 'Response templates for tickets' },

  // ── System ──
  { path: '/api/admin/system/config', label: 'System Config', category: 'System', methods: ['GET', 'POST', 'PUT'], defaultPayload: { config_key: "test_key", config_value: "test_value", category: "general" }, description: 'Global system configuration' },
  { path: '/api/admin/system/seo/config', label: 'SEO Config', category: 'System', methods: ['GET', 'PUT'], defaultPayload: { title: "Test Page", description: "SEO Test Description" }, description: 'SEO metadata configuration' },
  { path: '/api/admin/system/health', label: 'System Health', category: 'System', methods: ['GET', 'POST'], description: 'Supabase and service health checks' },
  { path: '/api/admin/system/backups', label: 'Backups', category: 'System', methods: ['GET', 'POST', 'DELETE'], description: 'Backup management (list, create, delete)' },
  { path: '/api/admin/system/email-templates', label: 'Email Templates', category: 'System', methods: ['GET', 'POST'], description: 'Transactional email templates' },
  { path: '/api/admin/system/webhooks/status', label: 'Webhook Status', category: 'System', methods: ['GET'], description: 'MercadoPago webhook health' },
  { path: '/api/admin/system/maintenance', label: 'Maintenance Mode', category: 'System', methods: ['POST'], description: 'Toggle maintenance mode' },

  // ── Shipping ──
  { path: '/api/admin/system/shipping/carriers', label: 'Shipping Carriers', category: 'Shipping', methods: ['GET', 'POST', 'PUT', 'DELETE'], defaultPayload: { name: "Test Carrier", code: "TEST01", is_active: true }, description: 'Carrier management' },
  { path: '/api/admin/system/shipping/rates', label: 'Shipping Rates', category: 'Shipping', methods: ['GET', 'POST'], defaultPayload: { name: "Standard", zone_id: "replace-with-id", rate_type: "flat", price: 500 }, description: 'Rate configuration' },
  { path: '/api/admin/system/shipping/zones', label: 'Shipping Zones', category: 'Shipping', methods: ['GET', 'POST'], description: 'Geographic shipping zones' },

  // ── Public ──
  { path: '/api/health', label: 'Health Check', category: 'Public', methods: ['GET'], description: 'Basic API health ping' },
  { path: '/api/mercadopago/public-key', label: 'MP Public Key', category: 'Public', methods: ['GET'], description: 'MercadoPago public key (cached)' },
  { path: '/api/public/config', label: 'Public Config', category: 'Public', methods: ['GET'], description: 'Public system config values (cached)' },
  { path: '/api/categories', label: 'Categories', category: 'Public', methods: ['GET', 'POST'], description: 'Product categories (cached GET)' },
  { path: '/api/checkout', label: 'Checkout', category: 'Public', methods: ['GET', 'POST'], description: 'Checkout flow (requires auth for GET)' },
];
