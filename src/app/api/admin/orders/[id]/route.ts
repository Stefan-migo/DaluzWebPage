import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, getServiceClient } from '@/lib/auth/helpers';
import { EmailNotificationService } from '@/lib/email/notifications';
import { computeStockDelta } from '@/lib/admin/orderStock';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const body = await request.json();
    const {
      status,
      payment_status,
      tracking_number,
      carrier,
      shipping,
      items,
      notes,
      subtotal,
      total_amount,
    } = body;

    console.log('📝 Updating order with:', {
      status,
      payment_status,
      tracking_number,
      carrier,
      hasShipping: !!shipping,
      itemsCount: Array.isArray(items) ? items.length : null,
    });

    // Get current order to check status changes
    const { data: currentOrder } = await supabase
      .from('orders')
      .select('status, shipped_at, delivered_at')
      .eq('id', params.id)
      .single();

    // Build update object dynamically to only update provided fields
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (status !== undefined) {
      updateData.status = status;
      
      // Set timestamps for status changes
      if (status === 'shipped' && !currentOrder?.shipped_at) {
        updateData.shipped_at = new Date().toISOString();
      }
      if (status === 'delivered' && !currentOrder?.delivered_at) {
        updateData.delivered_at = new Date().toISOString();
      }
    }

    if (payment_status !== undefined) {
      updateData.payment_status = payment_status;
    }

    if (tracking_number !== undefined) {
      updateData.tracking_number = tracking_number;
    }

    if (carrier !== undefined) {
      updateData.carrier = carrier;
    }

    if (notes !== undefined) {
      updateData.customer_notes = notes;
    }

    if (subtotal !== undefined) {
      updateData.subtotal = subtotal;
    }

    if (total_amount !== undefined) {
      updateData.total_amount = total_amount;
    }

    if (shipping && typeof shipping === 'object') {
      const allowedShipping = [
        'first_name',
        'last_name',
        'address_1',
        'address_2',
        'city',
        'state',
        'postal_code',
        'phone',
      ] as const;
      for (const key of allowedShipping) {
        if (shipping[key] !== undefined) {
          updateData[`shipping_${key}`] = shipping[key];
        }
      }
    }

    // Items replacement + stock adjustment
    let stockDelta: Record<string, number> = {};
    let oldItems: Array<{ id: string; product_id: string | null; quantity: number }> = [];
    if (Array.isArray(items)) {
      // Validate item shape
      for (const it of items) {
        if (
          typeof it !== 'object' ||
          it === null ||
          typeof it.product_name !== 'string' ||
          it.product_name.trim() === '' ||
          typeof it.quantity !== 'number' ||
          !Number.isFinite(it.quantity) ||
          it.quantity < 1 ||
          typeof it.unit_price !== 'number' ||
          !Number.isFinite(it.unit_price) ||
          it.unit_price < 0
        ) {
          return NextResponse.json(
            { error: 'Invalid item payload' },
            { status: 400 },
          );
        }
        if (!it.product_id || typeof it.product_id !== 'string') {
          return NextResponse.json(
            {
              error: 'Cada item debe tener product_id',
              product_name: it.product_name,
            },
            { status: 400 },
          );
        }
      }

      // Read current items for delta calculation
      const { data: existingItems, error: existingItemsError } = await supabase
        .from('order_items')
        .select('id, product_id, quantity')
        .eq('order_id', params.id);

      if (existingItemsError) {
        console.error('❌ Error reading existing items:', existingItemsError);
        return NextResponse.json(
          { error: 'Failed to read existing items' },
          { status: 500 },
        );
      }
      oldItems = existingItems || [];

      // Compute delta and validate stock
      stockDelta = computeStockDelta(
        oldItems.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
        items.map((i: any) => ({ product_id: i.product_id ?? null, quantity: i.quantity })),
      );

      const productIdsToCheck = Object.entries(stockDelta)
        .filter(([, d]) => d > 0)
        .map(([id]) => id);

      if (productIdsToCheck.length > 0) {
        const { data: productsForCheck, error: productsError } = await supabase
          .from('products')
          .select('id, name, inventory_quantity')
          .in('id', productIdsToCheck);

        if (productsError) {
          console.error('❌ Error reading products for stock check:', productsError);
          return NextResponse.json(
            { error: 'Failed to verify stock' },
            { status: 500 },
          );
        }

        for (const product of productsForCheck || []) {
          const need = stockDelta[product.id];
          const available = product.inventory_quantity ?? 0;
          if (available < need) {
            return NextResponse.json(
              {
                error: 'Stock insuficiente',
                product_id: product.id,
                product_name: product.name,
                available,
              },
              { status: 409 },
            );
          }
        }
      }
    }

    // Update the order
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          variant_title,
          quantity,
          unit_price,
          total_price
        )
      `)
      .single();

    if (updateError) {
      console.error('❌ Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    console.log('✅ Order updated successfully');

    // If items were provided, replace order_items and adjust stock
    if (Array.isArray(items)) {
      const { error: deleteItemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', params.id);

      if (deleteItemsError) {
        console.error('❌ Error deleting old order items:', deleteItemsError);
        return NextResponse.json(
          { error: 'Failed to replace order items' },
          { status: 500 },
        );
      }

      if (items.length > 0) {
        const itemsToInsert = items.map((it: any) => ({
          order_id: params.id,
          product_id: it.product_id,
          product_name: it.product_name,
          variant_title: it.variant_title ?? null,
          quantity: it.quantity,
          unit_price: it.unit_price,
          total_price: it.quantity * it.unit_price,
        }));

        const { error: insertItemsError } = await supabase
          .from('order_items')
          .insert(itemsToInsert);

        if (insertItemsError) {
          console.error('❌ Error inserting new order items:', insertItemsError);
          console.error('❌ Items payload:', JSON.stringify(itemsToInsert, null, 2));
          return NextResponse.json(
            {
              error: 'Failed to insert new order items',
              details: insertItemsError.message,
              code: insertItemsError.code,
            },
            { status: 500 },
          );
        }
      }

      // Apply stock deltas: subtract delta from inventory_quantity
      for (const [productId, delta] of Object.entries(stockDelta)) {
        const { data: prod, error: readErr } = await supabase
          .from('products')
          .select('inventory_quantity')
          .eq('id', productId)
          .single();
        if (readErr || !prod) {
          console.error('⚠️ Could not read product for stock adjustment:', productId, readErr);
          continue;
        }
        const newQty = (prod.inventory_quantity ?? 0) - delta;
        const { error: updErr } = await supabase
          .from('products')
          .update({ inventory_quantity: newQty })
          .eq('id', productId);
        if (updErr) {
          console.error('⚠️ Could not update product inventory:', productId, updErr);
        }
      }
    }

    // Send email notifications based on status changes
    if (status && status !== currentOrder?.status) {
      try {
        const supabaseAdmin = getServiceClient();
        
        // Get full order details for email
        const { data: fullOrder } = await supabaseAdmin
          .from('orders')
          .select(`
            *,
            order_items (
              id,
              product_name,
              variant_title,
              quantity,
              unit_price,
              total_price
            ),
            profiles (
              full_name,
              email
            )
          `)
          .eq('id', params.id)
          .single();

        if (fullOrder) {
          // Prepare order data for email service
          const emailOrder = {
            id: fullOrder.id,
            order_number: fullOrder.order_number,
            user_email: fullOrder.email,
            email: fullOrder.email,
            customer_name: fullOrder.shipping_first_name && fullOrder.shipping_last_name
              ? `${fullOrder.shipping_first_name} ${fullOrder.shipping_last_name}`
              : fullOrder.profiles?.full_name || 'Cliente',
            items: fullOrder.order_items?.map((item: any) => ({
              id: item.id,
              name: item.product_name,
              quantity: item.quantity,
              price: item.unit_price,
              variant_title: item.variant_title
            })) || [],
            total_amount: fullOrder.total_amount,
            payment_method: fullOrder.mp_payment_method || 'MercadoPago',
            status: fullOrder.status,
            created_at: fullOrder.created_at,
            payment_id: fullOrder.mp_payment_id,
            tracking_number: fullOrder.tracking_number,
            carrier: fullOrder.carrier,
            shipped_at: fullOrder.shipped_at,
            delivered_at: fullOrder.delivered_at,
            profiles: fullOrder.profiles
          };

          // Send appropriate email based on status
          if (status === 'shipped') {
            await EmailNotificationService.sendShippingNotification(emailOrder);
            console.log('📧 Shipping notification email sent');
          } else if (status === 'delivered') {
            await EmailNotificationService.sendDeliveryConfirmation(emailOrder);
            console.log('📧 Delivery confirmation email sent');
          }
        }
      } catch (emailError) {
        console.error('⚠️ Error sending status change email (non-critical):', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder
    });

  } catch (error) {
    console.error('❌ Admin order update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          variant_title,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq('id', params.id)
      .single();

    if (orderError) {
      console.error('❌ Error fetching order:', orderError);
      return NextResponse.json(
        { error: 'Failed to fetch order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('❌ Admin order fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    // First, delete all order items for this order
    console.log('🗑️ Deleting order items for order:', params.id);
    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', params.id);

    if (itemsError) {
      console.error('❌ Error deleting order items:', itemsError);
      return NextResponse.json(
        { error: 'Failed to delete order items', details: itemsError.message },
        { status: 500 }
      );
    }

    // Then, delete the order
    console.log('🗑️ Deleting order:', params.id);
    const { error: orderError } = await supabase
      .from('orders')
      .delete()
      .eq('id', params.id);

    if (orderError) {
      console.error('❌ Error deleting order:', orderError);
      return NextResponse.json(
        { error: 'Failed to delete order', details: orderError.message },
        { status: 500 }
      );
    }

    console.log('✅ Order deleted successfully:', params.id);
    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('❌ Admin order delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}