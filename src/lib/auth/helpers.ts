import { NextResponse } from "next/server";
import { createClient, createServiceRoleClient } from "@/utils/supabase/server";
import type { User } from "@supabase/supabase-js";

// ============================================
// Auth Result Types
// ============================================

/**
 * Represents the result of an auth check.
 * On success: { user, supabase } — the authenticated user and the Supabase client.
 * On failure: { response } — a ready-to-return NextResponse with the appropriate error.
 */
export type AuthResult =
  | { ok: true; user: User; supabase: Awaited<ReturnType<typeof createClient>> }
  | { ok: false; response: NextResponse };

export type AdminAuthResult =
  | { ok: true; user: User; supabase: Awaited<ReturnType<typeof createClient>> }
  | { ok: false; response: NextResponse };

// ============================================
// requireAuth — For user-facing endpoints
// ============================================

/**
 * Verifies that the request comes from an authenticated user.
 *
 * Usage:
 * ```ts
 * const auth = await requireAuth();
 * if (!auth.ok) return auth.response;
 * const { user, supabase } = auth;
 * ```
 */
export async function requireAuth(): Promise<AuthResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        ),
      };
    }

    return { ok: true, user, supabase };
  } catch (error) {
    console.error("[Auth] Unexpected error in requireAuth:", error);
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Authentication service error" },
        { status: 500 }
      ),
    };
  }
}

// ============================================
// requireAdmin — For admin-only endpoints
// ============================================

/**
 * Verifies that the request comes from an authenticated admin user.
 * Performs auth check + `is_admin` RPC verification in a single call.
 *
 * Usage:
 * ```ts
 * const auth = await requireAdmin();
 * if (!auth.ok) return auth.response;
 * const { user, supabase } = auth;
 * ```
 */
export async function requireAdmin(): Promise<AdminAuthResult> {
  // Step 1: Verify authentication
  const authResult = await requireAuth();
  if (!authResult.ok) return authResult;

  const { user, supabase } = authResult;

  try {
    // Step 2: Verify admin role via RPC
    const { data: isAdmin, error: adminError } = await supabase.rpc(
      "is_admin",
      { user_id: user.id }
    );

    if (adminError) {
      console.error("[Auth] Admin verification RPC error:", adminError);
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Admin verification failed" },
          { status: 500 }
        ),
      };
    }

    if (!isAdmin) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Admin access required" },
          { status: 403 }
        ),
      };
    }

    return { ok: true, user, supabase };
  } catch (error) {
    console.error("[Auth] Unexpected error in requireAdmin:", error);
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Authorization service error" },
        { status: 500 }
      ),
    };
  }
}

// ============================================
// getServiceClient — Convenience re-export
// ============================================

/**
 * Creates a Supabase service-role client that bypasses RLS.
 * Use only for operations that require elevated privileges (e.g., creating users).
 */
export { createServiceRoleClient as getServiceClient } from "@/utils/supabase/server";
