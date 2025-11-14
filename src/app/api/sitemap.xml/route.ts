import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://daluzconsciente.com';

    // Get all products
    const { data: products } = await supabase
      .from('products')
      .select('id, slug, updated_at')
      .eq('is_active', true);

    // Get all blog posts (from Sanity - would need to query Sanity here)
    // For now, we'll just include static pages

    const urls: Array<{ loc: string; changefreq: string; priority: string; lastmod?: string }> = [
      { loc: `${baseUrl}`, changefreq: 'daily', priority: '1.0' },
      { loc: `${baseUrl}/tienda`, changefreq: 'daily', priority: '0.9' },
      { loc: `${baseUrl}/blog`, changefreq: 'daily', priority: '0.8' },
    ];

    // Add product URLs
    products?.forEach(product => {
      if (product.slug) {
        urls.push({
          loc: `${baseUrl}/producto/${product.slug}`,
          changefreq: 'weekly',
          priority: '0.7',
          lastmod: product.updated_at ? new Date(product.updated_at).toISOString() : undefined
        });
      }
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return NextResponse.json({ error: 'Failed to generate sitemap' }, { status: 500 });
  }
}

