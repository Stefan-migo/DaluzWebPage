import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/helpers";
import { client, writeClient } from "@/lib/sanity/client";

const LIST_QUERY = `*[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc) {
  _id,
  title,
  "slug": slug.current,
  status,
  publishedAt,
  _createdAt,
  _updatedAt,
  "authorName": author->name
}`;

function ensureWriteToken() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Sanity write token not configured (SANITY_API_WRITE_TOKEN)" },
      { status: 500 }
    );
  }
  return null;
}

// GET /api/admin/blogs — list all posts for admin management
export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const posts = await client.fetch(LIST_QUERY);
    return NextResponse.json({ posts: posts || [] });
  } catch (error) {
    console.error("[admin/blogs] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST /api/admin/blogs — create a new post (defaults to status="pendiente")
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const tokenError = ensureWriteToken();
    if (tokenError) return tokenError;

    const body = await request.json().catch(() => ({}));
    const title: string = (body?.title || "Nuevo artículo").toString();

    const slugSource = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 96) || `post-${Date.now()}`;

    const created = await writeClient.create({
      _type: "post",
      title,
      slug: { _type: "slug", current: `${slugSource}-${Date.now().toString(36)}` },
      status: "pendiente",
      publishedAt: new Date().toISOString(),
    });

    return NextResponse.json({ post: created }, { status: 201 });
  } catch (error) {
    console.error("[admin/blogs] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
