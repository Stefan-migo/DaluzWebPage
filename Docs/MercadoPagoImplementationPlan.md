# Mercado Pago Implementation Plan
## DA LUZ CONSCIENTE - Complete Integration Roadmap

---

## 📊 **Current Implementation Status Analysis**

### ✅ **IMPLEMENTED (75% Complete)**

**Core Infrastructure:**
- ✅ Mercado Pago SDK integration (`/web/src/lib/mercadopago.ts`)
- ✅ Argentina-specific configuration with ARS currency support
- ✅ Comprehensive payment method support (credit/debit cards, bank transfers, cash payments)
- ✅ Installment payment configuration (up to 12 cuotas)

**API Routes:**
- ✅ Checkout API route (`/api/checkout`) with preference creation
- ✅ Webhook handler (`/api/webhooks/mercadopago`) for payment notifications
- ✅ Order creation and preference ID tracking

**Frontend Implementation:**
- ✅ Complete checkout page with customer information forms
- ✅ Mercado Pago Wallet component integration
- ✅ Order summary and cart integration
- ✅ Success/failure redirect pages

**Database Integration:**
- ✅ Database migration for Mercado Pago fields (`mercadopago_preference_id`, `mercadopago_payment_id`)
- ✅ Order creation with Supabase integration
- ✅ Payment status tracking

**Security & Configuration:**
- ✅ Webhook signature verification code (exists but commented out)
- ✅ Error handling framework
- ✅ Environment variable structure

### ❌ **MISSING/INCOMPLETE (25% Remaining)**

**Critical Configuration:**
- ❌ Environment variables not configured (using placeholder values)
- ❌ Mercado Pago account setup and API credentials
- ❌ Webhook URL configuration in Mercado Pago dashboard

**Core Functionality Gaps:**
- ❌ Order items table population (only orders table is created)
- ❌ Webhook signature verification not active
- ❌ Complete payment status synchronization
- ❌ Inventory updates after successful payments

**Advanced Features:**
- ❌ Subscription system for 7-month program
- ❌ Email notification system for orders
- ❌ Membership payment handling
- ❌ Complete error handling and edge cases

**Production Readiness:**
- ❌ Testing and validation framework
- ❌ Security audit completion
- ❌ Production deployment configuration

---

## 🎯 **Implementation Plan: 7 Phases**

### **Phase 1: Environment Setup & Configuration** 
**Priority: CRITICAL | Duration: 1 day**

#### 1.1 Mercado Pago Account Setup
- [ ] **Create/configure Mercado Pago business account**
  - Register business in Argentina with CUIT/CUIL
  - Complete identity verification process
  - Link Argentine bank account for fund transfers

- [ ] **Generate API credentials**
  - Create application in Mercado Pago dashboard
  - Generate test credentials (sandbox environment)
  - Generate production credentials (live environment)
  - Document credential security protocols

#### 1.2 Environment Variables Configuration
```bash
# Test Environment
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxx-sandbox-token
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-xxxx-public-key
MERCADOPAGO_WEBHOOK_SECRET=test_webhook_secret_key

# Production Environment  
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxx-production-token
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxx-public-key
MERCADOPAGO_WEBHOOK_SECRET=production_webhook_secret
```

#### 1.3 Webhook URL Configuration
- [ ] **Configure webhook endpoints in Mercado Pago dashboard**
  - Test URL: `https://daluz-web-page.vercel.app/api/webhooks/mercadopago`
  - Production URL: `https://daluzconsciente.com/api/webhooks/mercadopago`
  - Enable payment, subscription, and invoice events

#### 1.4 Initial Testing
- [ ] **Validate API connectivity**
  - Test preference creation with sample data
  - Verify webhook endpoint accessibility
  - Confirm order creation in database

**Deliverables:**
- ✅ Functional Mercado Pago account
- ✅ Valid API credentials configured
- ✅ Webhook endpoints registered
- ✅ Basic API connectivity confirmed

---

### **Phase 2: Core Payment Flow Completion**
**Priority: HIGH | Duration: 1-2 days**

#### 2.1 Order Items Implementation
- [ ] **Complete order_items table population**
```sql
-- Fix order items creation in checkout process
INSERT INTO order_items (order_id, product_id, variant_id, quantity, unit_price, total_price)
VALUES (?, ?, ?, ?, ?, ?);
```

- [ ] **Update checkout API route**
```typescript
// Add order items creation after order creation
const orderItems = items.map(item => ({
  order_id: order.id,
  product_id: item.productId,
  variant_id: item.variantId,
  quantity: item.quantity,
  unit_price: item.price,
  total_price: item.price * item.quantity
}));

await supabaseAdmin.from('order_items').insert(orderItems);
```

#### 2.2 Webhook Signature Verification
- [ ] **Implement active signature verification**
```typescript
// Uncomment and fix signature verification in webhook
const isValidSignature = verifySignature(req, rawBody);
if (!isValidSignature) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
}
```

#### 2.3 Payment Status Synchronization
- [ ] **Complete payment status mapping**
```typescript
const statusMapping = {
  'approved': 'completed',
  'pending': 'pending',
  'rejected': 'failed',
  'cancelled': 'cancelled',
  'refunded': 'refunded'
};
```

- [ ] **Add comprehensive status updates**
```typescript
await supabaseAdmin
  .from('orders')
  .update({
    status: statusMapping[paymentInfo.status] || 'pending',
    mercadopago_payment_id: paymentId,
    payment_method: paymentInfo.payment_method_id,
    installments: paymentInfo.installments,
    transaction_amount: paymentInfo.transaction_amount,
    net_received_amount: paymentInfo.net_received_amount,
    updated_at: new Date().toISOString()
  })
  .eq('id', orderId);
```

#### 2.4 Error Handling Enhancement
- [ ] **Add comprehensive error handling**
- [ ] **Implement retry mechanisms for failed requests**
- [ ] **Add logging for debugging and monitoring**

**Deliverables:**
- ✅ Complete order and order_items creation
- ✅ Active webhook signature verification
- ✅ Proper payment status synchronization
- ✅ Enhanced error handling

**Testing Checklist:**
- [ ] Test successful payment flow end-to-end
- [ ] Test failed payment handling
- [ ] Test webhook delivery and processing
- [ ] Verify order and order_items data integrity

---

### **Phase 3: Order Management System Completion**
**Priority: HIGH | Duration: 1 day**

#### 3.1 Inventory Management
- [ ] **Implement stock updates after successful payments**
```typescript
// Update product inventory after successful payment
const updateInventory = async (orderItems) => {
  for (const item of orderItems) {
    await supabaseAdmin
      .from('products')
      .update({ 
        stock_quantity: stock_quantity - item.quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', item.product_id);
  }
};
```

#### 3.2 Order Lifecycle Management
- [ ] **Add order status transitions**
```typescript
const ORDER_STATES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed', 
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};
```

- [ ] **Implement status transition validation**
- [ ] **Add order tracking functionality**

#### 3.3 Order History Integration
- [ ] **Connect real orders to user dashboard**
- [ ] **Replace mock data in `/mis-pedidos` page**
- [ ] **Add order detail views**

**Deliverables:**
- ✅ Automatic inventory updates
- ✅ Complete order lifecycle management
- ✅ Real order history in user dashboard
- ✅ Order tracking functionality

---

### **Phase 4: Security & Production Readiness**
**Priority: MEDIUM | Duration: 1 day**

#### 4.1 Security Hardening
- [ ] **Implement comprehensive webhook signature verification**
- [ ] **Add rate limiting to payment endpoints**
- [ ] **Implement IP allowlisting for webhooks**
- [ ] **Add request logging and monitoring**

#### 4.2 Error Monitoring
- [ ] **Set up error tracking (e.g., Sentry)**
- [ ] **Implement payment failure notifications**
- [ ] **Add alerting for critical payment issues**

#### 4.3 Data Validation
- [ ] **Add input validation for all payment data**
- [ ] **Implement data sanitization**
- [ ] **Add schema validation for webhook payloads**

**Deliverables:**
- ✅ Hardened security measures
- ✅ Comprehensive monitoring and alerting
- ✅ Validated and sanitized data flows

---

### **Phase 5: Subscription System Implementation** 
**Priority: MEDIUM | Duration: 2-3 days**

#### 5.1 Subscription Preferences
- [ ] **Implement Mercado Pago subscription plans**
```typescript
const subscriptionPlan = {
  reason: "DA LUZ ALKIMYA CONSCIENTE - Programa de 7 meses",
  auto_recurring: {
    frequency: 1,
    frequency_type: "months",
    repetitions: 7,
    currency_id: "ARS",
    transaction_amount: 25000,
  },
  payment_methods_allowed: {
    payment_types: [
      { id: "credit_card" },
      { id: "debit_card" },
      { id: "bank_transfer" }
    ],
    payment_methods: [
      { id: "visa" },
      { id: "master" },
      { id: "amex" }
    ]
  },
  back_url: `${process.env.NEXT_PUBLIC_APP_URL}/membresia/activada`
};
```

#### 5.2 Subscription Management API
- [ ] **Create subscription management routes**
```typescript
// /api/subscriptions/create
// /api/subscriptions/[id]/cancel
// /api/subscriptions/[id]/pause
// /api/subscriptions/[id]/resume
```

#### 5.3 Membership Integration
- [ ] **Connect subscriptions to membership system**
- [ ] **Implement access control for program content**
- [ ] **Add subscription status tracking**

**Deliverables:**
- ✅ Functional subscription system
- ✅ 7-month program payment handling
- ✅ Membership access control
- ✅ Subscription management interface

---

### **Phase 6: Email Notifications & Customer Experience**
**Priority: MEDIUM | Duration: 1-2 days**

#### 6.1 Order Confirmation Emails
- [ ] **Implement order confirmation templates**
- [ ] **Add payment receipt generation**
- [ ] **Create shipping confirmation emails**

#### 6.2 Payment Notification System
- [ ] **Payment success notifications**
- [ ] **Payment failure alerts**
- [ ] **Subscription renewal reminders**

#### 6.3 Customer Support Integration
- [ ] **Order status update emails**
- [ ] **Customer service contact templates**
- [ ] **Refund and cancellation notifications**

**Deliverables:**
- ✅ Complete email notification system
- ✅ Professional order confirmation process
- ✅ Customer communication templates

---

### **Phase 7: Testing, Validation & Production Deployment**
**Priority: HIGH | Duration: 1 day**

#### 7.1 Comprehensive Testing
- [ ] **End-to-end payment flow testing**
  - Test all payment methods (credit, debit, bank transfer, cash)
  - Test installment payments (3, 6, 12 months)
  - Test subscription sign-up and billing
  - Test payment failures and edge cases

#### 7.2 Performance Testing
- [ ] **Load testing for high-traffic scenarios**
- [ ] **Payment processing performance validation**
- [ ] **Database optimization for order queries**

#### 7.3 Production Deployment
- [ ] **Production environment configuration**
- [ ] **SSL certificate validation**
- [ ] **DNS configuration for custom domain**
- [ ] **Production monitoring setup**

#### 7.4 Go-Live Checklist
- [ ] **All test payments successful**
- [ ] **Webhook delivery confirmed**
- [ ] **Email notifications working**
- [ ] **Order management functional**
- [ ] **Customer support processes ready**

**Deliverables:**
- ✅ Fully tested payment system
- ✅ Production-ready deployment
- ✅ Complete monitoring and alerting
- ✅ Go-live approval checklist completed

---

## 📋 **Implementation Timeline**

### **Sprint Breakdown**
```
Week 1 (Days 1-5):
├── Day 1: Phase 1 - Environment Setup
├── Day 2-3: Phase 2 - Core Payment Flow  
├── Day 4: Phase 3 - Order Management
└── Day 5: Phase 4 - Security & Production Readiness

Week 2 (Days 6-10):
├── Day 6-8: Phase 5 - Subscription System
├── Day 9: Phase 6 - Email Notifications
└── Day 10: Phase 7 - Testing & Deployment
```

### **Critical Path Dependencies**
1. **Phase 1** → **Phase 2** (Environment must be ready before payment testing)
2. **Phase 2** → **Phase 3** (Core payments must work before order management)
3. **Phase 4** → **Phase 7** (Security must be ready before production)

### **Risk Mitigation**
- **High Risk**: Environment setup delays (Mercado Pago account approval)
  - **Mitigation**: Start account setup immediately, have backup test environment
- **Medium Risk**: Webhook delivery issues
  - **Mitigation**: Implement retry mechanisms and manual fallback processes

---

## 🎯 **Success Criteria**

### **Phase Completion Criteria**
1. **Phase 1**: Successful test payment creation
2. **Phase 2**: Complete checkout → payment → confirmation flow
3. **Phase 3**: Orders appear correctly in user dashboard
4. **Phase 4**: Security audit passes, monitoring active
5. **Phase 5**: Subscription payments working for 7-month program  
6. **Phase 6**: All email notifications sending correctly
7. **Phase 7**: Production deployment live and stable

### **Final Acceptance Criteria**
- [ ] Customer can complete purchase with all payment methods
- [ ] Orders are accurately tracked and managed
- [ ] Subscriptions process correctly for membership program
- [ ] Email confirmations send reliably
- [ ] Admin can monitor and manage all transactions
- [ ] System handles payment failures gracefully
- [ ] Security standards met for production use

---

## 📞 **Next Steps & Immediate Actions**

### **Immediate Next Steps (Today)**
1. **Start Phase 1**: Mercado Pago account setup and credential generation
2. **Configure environment variables** with test credentials
3. **Test basic API connectivity** with existing code
4. **Verify webhook endpoint** accessibility

### **Tomorrow**
1. **Complete Phase 1 validation**
2. **Begin Phase 2**: Order items implementation and webhook fixes
3. **Set up proper testing framework**

### **This Week**
1. **Complete Phases 1-4** for basic revenue generation capability
2. **Begin testing** with real test payments
3. **Validate** complete checkout → confirmation flow

---

## 📝 **Notes & Considerations**

### **Argentina-Specific Requirements**
- CUIT/CUIL registration required for business account
- Tax compliance for digital products
- Consumer protection law compliance (Ley de Defensa del Consumidor)

### **Technical Considerations**
- Mercado Pago rate limits: 8,000 requests per hour
- Webhook retry policy: 25 attempts over 48 hours
- Payment methods: Full support for Argentine banking system

### **Business Considerations**
- Commission fees: ~4.99% + $0.99 per transaction
- Settlement time: 14-21 days for new accounts, 1-3 days for established accounts
- Chargeback protection available with proper documentation

---

**Document Version**: 1.0  
**Last Updated**: January 15, 2025  
**Next Review**: Upon completion of Phase 1

**Contact**: Implementation team  
**Status**: Ready to begin Phase 1 implementation
