# 🧪 Mercado Pago Payment Testing Checklist
## DA LUZ CONSCIENTE - Complete Testing Guide

---

## 🎯 **Pre-Test Setup** (5 minutes)

### ✅ Database Migration Applied
- [ ] **Applied SQL migration** in Supabase dashboard
- [ ] **Verified** `decrease_product_stock` function exists
- [ ] **Confirmed** `stock_movements` table created

### ✅ Test Credentials Ready
- [ ] **Mercado Pago test credentials** configured in environment
- [ ] **Test credit card numbers** available (see test cards below)

---

## 📋 **Test Cases to Execute**

### **Test Case 1: Successful Payment Flow** ⭐ PRIORITY
**Expected Duration:** 5-7 minutes

#### Step 1: Add Products to Cart
- [ ] Go to: https://daluz-web-page.vercel.app/productos
- [ ] **Add "Crema Hidratante de Rosa Mosqueta"** ($12,500) - Qty: 1
- [ ] **Add "Aceite Corporal de Lavanda"** ($8,900) - Qty: 2  
- [ ] **Verify cart total**: $30,300 (12,500 + 8,900 × 2)
- [ ] **Check cart count** in header navigation

#### Step 2: Checkout Process
- [ ] Go to: https://daluz-web-page.vercel.app/checkout
- [ ] **Fill customer information**:
  ```
  Nombre: Juan
  Apellido: Pérez
  Email: test@daluzconsciente.com
  Teléfono: +54 9 11 1234-5678
  Calle: Av. Corrientes
  Número: 1234
  Ciudad: Buenos Aires
  Provincia: CABA
  Código Postal: 1043
  ```
- [ ] **Verify order summary** shows correct items and total
- [ ] **Click "Continuar con el pago"**
- [ ] **Check**: Order created in database (orders table)
- [ ] **Check**: Order items created (order_items table)

#### Step 3: Mercado Pago Payment
- [ ] **Mercado Pago Wallet loads** successfully
- [ ] **Use test credit card**:
  ```
  Card Number: 4509 9535 6623 3704
  Expiry: 11/25
  CVV: 123
  Name: APRO (for approved)
  DNI: 12345678
  ```
- [ ] **Complete payment process**
- [ ] **Redirected to success page**

#### Step 4: Verify Results
**Database Checks:**
- [ ] **Order status** = 'completed' (was 'pending')
- [ ] **mercadopago_payment_id** populated
- [ ] **payment_method** recorded
- [ ] **transaction_amount** recorded

**Inventory Checks:**
- [ ] **Crema Rosa Mosqueta stock**: 45 → 44 (decreased by 1)
- [ ] **Aceite Lavanda stock**: 52 → 50 (decreased by 2)
- [ ] **stock_movements table** has audit entries

---

### **Test Case 2: Failed Payment Flow** 
**Expected Duration:** 3-5 minutes

#### Step 1: Repeat Checkout Process
- [ ] **Add products to cart** (different quantities)
- [ ] **Fill checkout form** with same customer info
- [ ] **Click "Continuar con el pago"**

#### Step 2: Mercado Pago Failed Payment
- [ ] **Use test card for failure**:
  ```
  Card Number: 4509 9535 6623 3704
  Expiry: 11/25  
  CVV: 123
  Name: CONT (for rejected)
  DNI: 12345678
  ```
- [ ] **Payment should be rejected**
- [ ] **Redirected to failure page**

#### Step 3: Verify Results
- [ ] **Order status** = 'failed' (not completed)
- [ ] **Inventory unchanged** (no stock reduction)
- [ ] **No stock_movements entries** for this order

---

### **Test Case 3: Webhook Testing**
**Expected Duration:** 2-3 minutes

#### Manual Webhook Test
```bash
# Test GET endpoint
curl -X GET https://daluz-web-page.vercel.app/api/webhooks/mercadopago

# Expected response:
{
  "message": "Mercado Pago webhook endpoint is active",
  "timestamp": "2025-01-15T...",
  "environment": "production"
}
```

#### Webhook Security Test
- [ ] **Webhook only processes valid signatures** (in production)
- [ ] **Invalid webhooks rejected** with 401 status
- [ ] **Webhook logs payments correctly**

---

## 🔧 **Troubleshooting Guide**

### Common Issues & Solutions

#### ❌ "Failed to create order"
**Cause:** Database connection or permissions issue
**Solution:** 
- Check Supabase connection
- Verify user is authenticated
- Check order table permissions

#### ❌ "Failed to create payment preference"
**Cause:** Mercado Pago API credentials issue
**Solution:**
- Verify environment variables set correctly
- Check MP credentials are valid test credentials
- Ensure public key matches access token

#### ❌ Order created but no order_items
**Cause:** order_items insertion failed
**Solution:**
- Check console logs for specific error
- Verify order_items table schema
- Check variant_id field handling

#### ❌ Inventory not updating
**Cause:** Database function not applied or webhook not firing
**Solution:**
- Apply migration SQL in Supabase dashboard
- Check webhook delivery in MP dashboard
- Verify webhook signature validation

#### ❌ Mercado Pago Wallet not loading
**Cause:** Frontend configuration issue
**Solution:**
- Verify NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
- Check preference_id is received from API
- Look for JavaScript console errors

---

## 🎯 **Test Data Reference**

### **Mercado Pago Test Cards**

#### ✅ Approved Payments
```
Visa: 4509 9535 6623 3704
Mastercard: 5031 7557 3453 0604
Expiry: 11/25
CVV: 123
Name: APRO
```

#### ❌ Rejected Payments
```
Card: 4509 9535 6623 3704
Expiry: 11/25
CVV: 123
Name: CONT (for rejected)
```

#### ⏳ Pending Payments
```
Card: 4509 9535 6623 3704
Expiry: 11/25
CVV: 123
Name: CALL (for pending)
```

### **Test Customer Data**
```
Name: Juan Pérez
Email: test@daluzconsciente.com
Phone: +54 9 11 1234-5678
Address: Av. Corrientes 1234, Buenos Aires, CABA, 1043
```

---

## 📊 **Success Criteria**

### ✅ Payment Flow Complete When:
- [ ] **Orders created** with correct totals
- [ ] **Order items recorded** with product details  
- [ ] **Payments processed** through Mercado Pago
- [ ] **Order status updated** via webhooks
- [ ] **Inventory automatically reduced** for successful payments
- [ ] **Stock movements logged** for audit trail
- [ ] **Failed payments** don't affect inventory
- [ ] **Webhook security** working in production

### 🎉 **System Ready for Revenue When:**
- [ ] **All test cases pass** without errors
- [ ] **Database functions working** correctly
- [ ] **Webhook delivery confirmed** 
- [ ] **Payment status synchronization** accurate
- [ ] **Inventory management** automatic
- [ ] **Error handling** graceful

---

## 📞 **Next Steps After Testing**

### If All Tests Pass ✅
1. **Switch to production credentials** in environment
2. **Test with small real payment** (optional)
3. **Set up monitoring and alerts**
4. **Begin marketing pages development**
5. **Launch announcement preparation**

### If Tests Fail ❌
1. **Document specific errors** encountered
2. **Check database logs** in Supabase
3. **Review webhook delivery** in MP dashboard  
4. **Debug with console logs** and network tab
5. **Iterate fixes** and retest

---

**Testing Status**: ⏳ Pending
**Last Updated**: January 15, 2025
**Next Review**: After test completion
