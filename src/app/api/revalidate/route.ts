import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

// Function to verify Sanity webhook signature
function verifySignature(body: string, signature: string): boolean {
  if (!SANITY_WEBHOOK_SECRET) {
    // SECURITY: In production, missing secret = reject. In dev, allow.
    if (process.env.NODE_ENV === 'production') {
      console.error('SANITY_WEBHOOK_SECRET not configured in production — rejecting webhook');
      return false;
    }
    console.warn('⚠️ SANITY_WEBHOOK_SECRET not configured, skipping signature verification (dev only)');
    return true;
  }

  const computedSignature = crypto
    .createHmac('sha256', SANITY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(computedSignature, 'hex'),
    Buffer.from(signature, 'hex')
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('sanity-webhook-signature') || '';

    // SECURITY: Always verify webhook signature
    if (!verifySignature(body, signature)) {
      console.error('❌ Invalid Sanity webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);
    console.log('🎣 Sanity webhook received:', {
      type: payload._type,
      operation: payload.transition,
      id: payload._id,
      timestamp: new Date().toISOString()
    });

    // Log webhook receipt
    try {
      await supabaseAdmin.from('webhook_logs').insert({
        webhook_type: 'sanity',
        event_type: payload._type || 'unknown',
        payload: payload,
        status: 'pending',
        processed_at: null
      });
    } catch (logError) {
      console.error('Error logging webhook:', logError);
    }

    // Handle different document types
    switch (payload._type) {
      case 'post':
        // Revalidate blog pages
        await revalidateBlogPages(payload);
        break;
      
      case 'category':
        // Revalidate blog and category pages
        await revalidateBlogPages(payload);
        break;
      
      case 'author':
        // Revalidate blog pages with author content
        await revalidateBlogPages(payload);
        break;
      
      case 'productContent':
        // Revalidate product pages
        await revalidateProductPages(payload);
        break;
      
      default:
        console.log(`📝 Document type ${payload._type} - performing general revalidation`);
        await generalRevalidation();
    }

    // Update webhook log to success
    try {
      await supabaseAdmin
        .from('webhook_logs')
        .update({
          status: 'success',
          response_code: 200,
          processed_at: new Date().toISOString()
        })
        .eq('webhook_type', 'sanity')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);
    } catch (logError) {
      console.error('Error updating webhook log:', logError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Cache revalidated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in revalidation webhook:', error);
    
    // Update webhook log to failed
    try {
      await supabaseAdmin
        .from('webhook_logs')
        .update({
          status: 'failed',
          response_code: 500,
          error_message: error instanceof Error ? error.message : 'Unknown error',
          processed_at: new Date().toISOString()
        })
        .eq('webhook_type', 'sanity')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);
    } catch (logError) {
      console.error('Error updating webhook log:', logError);
    }
    
    return NextResponse.json({ 
      error: 'Failed to revalidate cache' 
    }, { status: 500 });
  }
}

async function revalidateBlogPages(payload: any) {
  console.log('🔄 Revalidating blog pages...');
  
  // Revalidate all blog-related pages
  await Promise.all([
    revalidatePath('/blog'),
    revalidatePath('/blog/[slug]', 'page'),
    revalidatePath('/', 'page'), // For blog posts in homepage
    revalidatePath('/', 'layout'), // For blog posts in navigation
  ]);

  // Revalidate specific post if slug exists
  if (payload.slug?.current) {
    await revalidatePath(`/blog/${payload.slug.current}`);
    console.log(`✅ Revalidated specific post: /blog/${payload.slug.current}`);
  }

  // Revalidate using tags for more granular control
  await Promise.all([
    revalidateTag('blog-posts'),
    revalidateTag('homepage-posts'),
    revalidateTag('latest-posts'),
    revalidateTag('blog-categories'),
    revalidateTag('blog-authors'),
    revalidateTag('sanity-content'),
  ]);

  console.log('✅ Blog pages revalidated successfully');
}

async function revalidateProductPages(payload: any) {
  console.log('🔄 Revalidating product pages...');
  
  await Promise.all([
    revalidatePath('/tienda'),
    revalidatePath('/tienda/categoria/[slug]', 'page'),
    revalidatePath('/producto/[slug]', 'page'),
  ]);

  if (payload.slug?.current) {
    await revalidatePath(`/producto/${payload.slug.current}`);
    console.log(`✅ Revalidated specific product: /producto/${payload.slug.current}`);
  }

  await revalidateTag('products');
  console.log('✅ Product pages revalidated successfully');
}

async function generalRevalidation() {
  console.log('🔄 Performing general revalidation...');
  
  await Promise.all([
    revalidatePath('/'),
    revalidatePath('/blog'),
    revalidatePath('/tienda'),
    revalidateTag('sanity-content'),
  ]);

  console.log('✅ General revalidation completed');
}

// GET endpoint for testing the webhook
export async function GET() {
  return NextResponse.json({
    message: 'Sanity revalidation webhook endpoint is active',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasSecret: !!SANITY_WEBHOOK_SECRET
  });
}
