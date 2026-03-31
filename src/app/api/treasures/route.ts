// =====================================================
// API Route: /api/treasures
// Purpose: Get user's treasures and check access
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "edge"; // Use edge runtime for better performance

/**
 * GET /api/treasures
 * Returns the current user's treasures (access IDs)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", treasures: [] },
        { status: 401 },
      );
    }

    // Get user's treasures from profile (denormalized for speed)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("treasures")
      .eq("id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error fetching profile:", profileError);
      return NextResponse.json(
        { error: "Failed to fetch treasures", treasures: [] },
        { status: 500 },
      );
    }

    const treasures = profile?.treasures || [];

    // Ensure general access is included if user has any treasures
    const treasuresWithGeneral =
      treasures.length > 0
        ? [
            "tesoro-gral",
            ...treasures.filter((t: string) => t !== "tesoro-gral"),
          ]
        : treasures;

    return NextResponse.json({
      success: true,
      treasures: treasuresWithGeneral,
      userId: user.id,
    });
  } catch (error) {
    console.error("Treasures API error:", error);
    return NextResponse.json(
      { error: "Internal server error", treasures: [] },
      { status: 500 },
    );
  }
}
