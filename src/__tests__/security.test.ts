/**
 * Security Tests — Verifies that security protections are correctly implemented in the code.
 * These are static analysis tests (read source files); they do NOT require the server to be running.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function readSrc(relativePath: string): string {
  const fullPath = join(process.cwd(), relativePath);
  if (!existsSync(fullPath)) throw new Error(`File not found: ${fullPath}`);
  return readFileSync(fullPath, "utf-8");
}

// ---------------------------------------------------------------------------
// 1. Upload endpoint must require authentication
// ---------------------------------------------------------------------------
describe("Upload endpoint has auth check", () => {
  it("should verify authentication in upload route", () => {
    const content = readSrc("src/app/api/upload/route.ts");
    expect(content).toContain("auth.getUser()");
    expect(content).toContain("Unauthorized");
    expect(content).toContain("401");
  });
});

// ---------------------------------------------------------------------------
// 2. Admin API routes use requireAdmin()
// ---------------------------------------------------------------------------
describe("Admin API routes use requireAdmin()", () => {
  const adminRoutes = [
    "src/app/api/admin/products/route.ts",
    "src/app/api/admin/orders/route.ts",
    "src/app/api/admin/customers/route.ts",
    "src/app/api/admin/dashboard/route.ts",
    "src/app/api/admin/system/config/route.ts",
    "src/app/api/admin/products/json-template/route.ts",
  ];

  for (const route of adminRoutes) {
    it(`${route} should call requireAdmin()`, () => {
      const content = readSrc(route);
      expect(content).toContain("requireAdmin");
    });
  }
});

// ---------------------------------------------------------------------------
// 3. Category/Product mutation endpoints require auth
// ---------------------------------------------------------------------------
describe("Public mutation endpoints require admin auth", () => {
  it("categories PUT/DELETE should require requireAdmin()", () => {
    const content = readSrc("src/app/api/categories/[id]/route.ts");
    expect(content).toContain("requireAdmin");
  });

  it("categories POST should require requireAdmin()", () => {
    const content = readSrc("src/app/api/categories/route.ts");
    expect(content).toContain("requireAdmin");
  });

  it("products PUT/DELETE should require requireAdmin()", () => {
    const content = readSrc("src/app/api/products/[id]/route.ts");
    expect(content).toContain("requireAdmin");
  });
});

// ---------------------------------------------------------------------------
// 4. Debug auth endpoint blocks production access
// ---------------------------------------------------------------------------
describe("Debug auth has production block", () => {
  it("should block debug-auth in production", () => {
    const content = readSrc("src/app/api/debug-auth/route.ts");
    expect(content).toContain("NODE_ENV");
    expect(content).toContain("production");
    expect(content).toContain("403");
  });
});

// ---------------------------------------------------------------------------
// 5. Middleware protections
// ---------------------------------------------------------------------------
describe("Middleware file has expected protections", () => {
  it("should protect routes and use getUser()", () => {
    const content = readSrc("src/middleware.ts");
    expect(content).toContain("/perfil");
    expect(content).toContain("/admin");
    expect(content).toContain("/checkout");
    expect(content).toContain("X-Frame-Options");
    // Must use getUser, NOT getSession
    expect(content).toContain("auth.getUser()");
    expect(content).not.toContain("auth.getSession()");
  });

  it("should verify admin role for admin routes", () => {
    const content = readSrc("src/middleware.ts");
    expect(content).toContain("is_admin");
  });
});

// ---------------------------------------------------------------------------
// 6. No hardcoded credentials
// ---------------------------------------------------------------------------
describe("No hardcoded credentials", () => {
  it("should not have fallback credentials in lib/supabase.ts", () => {
    const content = readSrc("src/lib/supabase.ts");
    expect(content).not.toMatch(/xdvemkyvgnfnibntfbwq\.supabase\.co/);
    expect(content).not.toMatch(/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/);
    expect(content).toContain("Missing");
  });

  it("should not have fallback credentials in utils/supabase/server.ts", () => {
    const content = readSrc("src/utils/supabase/server.ts");
    expect(content).not.toMatch(/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/);
    expect(content).toContain("Missing required");
  });
});

// ---------------------------------------------------------------------------
// 7. Rate limiting infrastructure exists
// ---------------------------------------------------------------------------
describe("Rate limiting implementation", () => {
  it("should have rate limiting configured in API middleware", () => {
    const content = readSrc("src/lib/api/middleware.ts");
    expect(content).toContain("rateLimitConfigs");
    expect(content).toContain("auth");
    expect(content).toContain("payment");
  });

  it("should have rate limiting on contact form", () => {
    const content = readSrc("src/app/api/contact/route.ts");
    expect(content).toContain("429");
    expect(content).toContain("checkContactRateLimit");
  });
});

// ---------------------------------------------------------------------------
// 8. Webhook signature verification is not environment-gated
// ---------------------------------------------------------------------------
describe("Webhook signature is always verified", () => {
  it("MercadoPago webhook should not skip verification based on NODE_ENV", () => {
    const content = readSrc("src/app/api/webhooks/mercadopago/route.ts");
    // Should NOT contain the old pattern of only checking in production
    expect(content).not.toMatch(/if\s*\(\s*process\.env\.NODE_ENV\s*===\s*["']production["']\s*\)\s*\{[\s\S]*?verifySignature/);
  });

  it("Sanity revalidation webhook should not skip verification based on NODE_ENV", () => {
    const content = readSrc("src/app/api/revalidate/route.ts");
    expect(content).not.toMatch(/NODE_ENV.*===.*production.*&&.*!verifySignature/);
  });
});

// ---------------------------------------------------------------------------
// 9. Security headers in next.config.js
// ---------------------------------------------------------------------------
describe("Security headers in next.config.js", () => {
  it("should have CSP, HSTS, and standard security headers", () => {
    const content = readSrc("next.config.js");
    expect(content).toContain("Content-Security-Policy");
    expect(content).toContain("Strict-Transport-Security");
    expect(content).toContain("X-Frame-Options");
    expect(content).toContain("X-Content-Type-Options");
    expect(content).toContain("Permissions-Policy");
  });
});

// ---------------------------------------------------------------------------
// 10. Checkout does not leak internal errors
// ---------------------------------------------------------------------------
describe("Checkout does not leak internal error details", () => {
  it("should not expose error.message to client in catch blocks", () => {
    const content = readSrc("src/app/api/checkout/route.ts");
    // Should not contain patterns that pass raw error messages to the response
    expect(content).not.toMatch(/details:\s*error(Message|\.message|\?\.(message|msg))/);
  });
});

// ---------------------------------------------------------------------------
// 11. Environment validation exists
// ---------------------------------------------------------------------------
describe("Environment validation (fail-fast)", () => {
  it("should have env validation module", () => {
    const content = readSrc("src/lib/env.ts");
    expect(content).toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(content).toContain("validateEnv");
  });

  it("should be imported in root layout", () => {
    const content = readSrc("src/app/layout.tsx");
    expect(content).toContain("@/lib/env");
  });
});
