// =====================================================
// API Route: /api/treasures/content
// Purpose: Get Sanity content filtered by user's treasure access
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createSanityClient } from "@sanity/client";
import { groq } from "next-sanity";

// Initialize Sanity client
const sanityClient = createSanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
});

export const runtime = "edge";

/**
 * GET /api/treasures/content
 * Query params:
 *   - linea (optional): Filter by specific line (e.g., 'umbral', 'ecos')
 *   - type (optional): Filter by content type ('video', 'audio', 'pdf', 'text')
 *
 * Returns Sanity tesoro content that the user has access to
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", content: [] },
        { status: 401 },
      );
    }

    // 2. Get user's treasures
    const { data: profile } = await supabase
      .from("profiles")
      .select("treasures")
      .eq("id", user.id)
      .single();

    const userTreasures = profile?.treasures || [];

    // Always include general access
    const accessIds =
      userTreasures.length > 0
        ? [
            "tesoro-gral",
            ...userTreasures.filter((t: string) => t !== "tesoro-gral"),
          ]
        : [];

    if (accessIds.length === 0) {
      return NextResponse.json({
        success: true,
        content: [],
        accessIds: [],
        message: "No treasures access found",
      });
    }

    // 3. Parse query params
    const { searchParams } = new URL(request.url);
    const lineaFilter = searchParams.get("linea");
    const typeFilter = searchParams.get("type");

    // 4. Build GROQ query for Sanity
    // Fetch content where required_id is in user's access list
    let query = groq`
      *[_type == "tesoroContent" && required_id in $accessIds] | order(sort_order asc, _createdAt desc) {
        _id,
        title,
        slug,
        description,
        required_id,
        content_type,
        video_url,
        audio_file,
        pdf_file,
        rich_text,
        linea,
        kit,
        sort_order,
        duration_minutes,
        "created_at": _createdAt,
        "updated_at": _updatedAt
      }
    `;

    // Add filters if specified
    if (lineaFilter) {
      query = groq`
        *[_type == "tesoroContent" && required_id in $accessIds && linea == $lineaFilter] | order(sort_order asc, _createdAt desc) {
          _id,
          title,
          slug,
          description,
          required_id,
          content_type,
          video_url,
          audio_file,
          pdf_file,
          rich_text,
          linea,
          kit,
          sort_order,
          duration_minutes,
          "created_at": _createdAt,
          "updated_at": _updatedAt
        }
      `;
    }

    if (typeFilter) {
      const filterCondition = lineaFilter
        ? "&& required_id in $accessIds && linea == $lineaFilter && content_type == $typeFilter"
        : "&& required_id in $accessIds && content_type == $typeFilter";

      query = groq`
        *[_type == "tesoroContent" ${filterCondition}] | order(sort_order asc, _createdAt desc) {
          _id,
          title,
          slug,
          description,
          required_id,
          content_type,
          video_url,
          audio_file,
          pdf_file,
          rich_text,
          linea,
          kit,
          sort_order,
          duration_minutes,
          "created_at": _createdAt,
          "updated_at": _updatedAt
        }
      `;
    }

    // 5. Execute Sanity query
    const params: Record<string, any> = { accessIds };
    if (lineaFilter) params.lineaFilter = lineaFilter;
    if (typeFilter) params.typeFilter = typeFilter;

    const content = await sanityClient.fetch(query, params);

    return NextResponse.json({
      success: true,
      content,
      accessIds,
      filters: {
        linea: lineaFilter || null,
        type: typeFilter || null,
      },
    });
  } catch (error) {
    console.error("Treasures content API error:", error);
    return NextResponse.json(
      { error: "Internal server error", content: [] },
      { status: 500 },
    );
  }
}
