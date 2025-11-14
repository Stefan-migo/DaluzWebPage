import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://daluzconsciente.com';
  
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /api/

Sitemap: ${baseUrl}/api/sitemap.xml
`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

