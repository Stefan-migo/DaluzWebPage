import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/helpers";
import { writeClient } from "@/lib/sanity/client";

function ensureWriteToken() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Sanity write token not configured (SANITY_API_WRITE_TOKEN)" },
      { status: 500 }
    );
  }
  return null;
}

// PATCH /api/admin/blogs/:id — update post fields (e.g. status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const tokenError = ensureWriteToken();
    if (tokenError) return tokenError;

    const body = await request.json().catch(() => ({}));
    const patchSet: Record<string, unknown> = {};

    if (body?.status === "pendiente" || body?.status === "publicado") {
      patchSet.status = body.status;
      if (body.status === "publicado") {
        patchSet.publishedAt = new Date().toISOString();
      }
    }

    if (Object.keys(patchSet).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updated = await writeClient
      .patch(params.id)
      .set(patchSet)
      .commit();

    return NextResponse.json({ post: updated });
  } catch (error) {
    console.error("[admin/blogs/:id] PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blogs/:id — delete a post document
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const tokenError = ensureWriteToken();
    if (tokenError) return tokenError;

    await writeClient.delete(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/blogs/:id] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
