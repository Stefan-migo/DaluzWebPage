import { NextRequest, NextResponse } from 'next/server';
import { client, queries } from '@/lib/sanity/client';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '2');

    console.log('🔄 Fetching latest blog posts for header...');
    
    // Fetch latest posts with caching and revalidation
    const posts = await client.fetch(
      `*[_type == "post"] | order(publishedAt desc)[0...${limit}] {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        "mainImage": {
          "asset": {"url": mainImage.asset->url},
          "alt": mainImage.alt
        },
        author->{
          name, 
          "image": {"asset": {"url": image.asset->url}}
        },
        categories[]->{title, color}
      }`,
      {},
      {
        next: { 
          revalidate: 60, // Cache and revalidate every 60 seconds
          tags: ['blog-posts', 'latest-posts'] 
        }
      }
    );

    console.log(`✅ Fetched ${posts?.length || 0} latest posts`);

    return NextResponse.json({
      posts: posts || [],
      timestamp: new Date().toISOString(),
      count: posts?.length || 0
    });

  } catch (error) {
    console.error('❌ Error fetching latest posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest posts' },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
