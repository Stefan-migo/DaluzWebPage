export interface AdminRouteMetadata {
  path: string;
  label: string;
  methods: ('GET' | 'POST' | 'PUT' | 'DELETE')[];
  defaultPayload?: any;
}

export const ADMIN_ROUTES: AdminRouteMetadata[] = [
  { 
    path: '/api/admin/dashboard', 
    label: 'Main Dashboard', 
    methods: ['GET'] 
  },
  { 
    path: '/api/admin/products', 
    label: 'Products', 
    methods: ['GET', 'POST'],
    defaultPayload: { name: "Test Product", description: "Diagnostics test", price: 100, status: "draft", category_id: null }
  },
  { 
    path: '/api/admin/products/[id]', 
    label: 'Individual Product', 
    methods: ['GET', 'PUT', 'DELETE'],
    defaultPayload: { name: "Updated Test Product", price: 150 }
  },
  { 
    path: '/api/admin/products/stats', 
    label: 'Product Stats', 
    methods: ['GET'] 
  },
  { 
    path: '/api/admin/orders', 
    label: 'Orders', 
    methods: ['GET', 'POST'],
    defaultPayload: { customer_name: "Test User", total: 0, status: "pending" }
  },
  { 
    path: '/api/admin/customers', 
    label: 'Customers', 
    methods: ['GET', 'POST'],
    defaultPayload: { first_name: "Test", last_name: "User", email: "test@example.com" }
  },
  { 
    path: '/api/admin/system/config', 
    label: 'System Config', 
    methods: ['GET', 'POST', 'PUT'],
    defaultPayload: { config_key: "test_key", config_value: "test_value", category: "general" }
  },
  { 
    path: '/api/admin/system/seo/config', 
    label: 'SEO Config', 
    methods: ['GET', 'PUT'],
    defaultPayload: { title: "Test Page", description: "SEO Test Description" }
  },
  { 
    path: '/api/admin/system/shipping/carriers', 
    label: 'Shipping Carriers', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    defaultPayload: { name: "Test Carrier", code: "TEST01", is_active: true }
  },
  { 
    path: '/api/admin/system/shipping/rates', 
    label: 'Shipping Rates', 
    methods: ['GET', 'POST'],
    defaultPayload: { name: "Standard", zone_id: "replace-with-id", rate_type: "flat", price: 500 }
  },
  { 
    path: '/api/admin/system/health', 
    label: 'System Health', 
    methods: ['GET', 'POST'] 
  },
  { 
    path: '/api/admin/ab-tests', 
    label: 'A/B Tests', 
    methods: ['GET', 'POST'],
    defaultPayload: { experiment_name: "TestExp", variant_control: {}, variant_test: {} }
  },
  { 
    path: '/api/admin/check-status', 
    label: 'Auth Check', 
    methods: ['GET'] 
  }
];
