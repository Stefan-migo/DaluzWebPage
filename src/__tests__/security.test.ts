/**
 * Security Tests - Verificación de mejoras de seguridad implementadas
 *
 * Estos tests verifican que las protecciones de seguridad están correctamente implementadas en el código.
 * NO requieren que el servidor esté corriendo.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("🔒 Security: Upload Endpoint Has Auth Check", () => {
  it("should verify authentication in upload route", () => {
    const uploadPath = join(process.cwd(), "src/app/api/upload/route.ts");
    const content = readFileSync(uploadPath, "utf-8");

    // Verificar que tiene verificación de auth
    expect(content).toContain("supabase.auth.getUser()");
    expect(content).toContain("Unauthorized");
    expect(content).toContain("401");
  });
});

describe("🔒 Security: Admin Products API Has Admin Check", () => {
  it("should verify admin role in admin products route", () => {
    const adminProductsPath = join(
      process.cwd(),
      "src/app/api/admin/products/route.ts",
    );
    const content = readFileSync(adminProductsPath, "utf-8");

    // Verificar que tiene función verifyAdminUser
    expect(content).toContain("verifyAdminUser");
    expect(content).toContain("is_admin");
    expect(content).toContain("Forbidden");
    expect(content).toContain("403");
  });
});

describe("🔒 Security: Debug Auth Has Production Block", () => {
  it("should block debug-auth in production", () => {
    const debugPath = join(process.cwd(), "src/app/api/debug-auth/route.ts");
    const content = readFileSync(debugPath, "utf-8");

    // Verificar que tiene check de producción
    expect(content).toContain("NODE_ENV");
    expect(content).toContain("production");
    expect(content).toContain("403");
  });
});

describe("🔒 Security: Middleware File Exists", () => {
  it("should have middleware.ts with route protection", () => {
    const middlewarePath = join(process.cwd(), "src/middleware.ts");
    const content = readFileSync(middlewarePath, "utf-8");

    // Verificar que protege rutas
    expect(content).toContain("/perfil");
    expect(content).toContain("/admin");
    expect(content).toContain("/checkout");
    expect(content).toContain("login");
    expect(content).toContain("X-Frame-Options");
  });
});

describe("🔒 Security: No Hardcoded Credentials Fallback", () => {
  it("should not have fallback credentials in lib/supabase.ts", () => {
    const supabasePath = join(process.cwd(), "src/lib/supabase.ts");
    const content = readFileSync(supabasePath, "utf-8");

    // No debe tener URLs de Supabase hardcodeadas como fallback
    expect(content).not.toContain("xdvemkyvgnfnibntfbwq.supabase.co");
    expect(content).not.toContain("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
    // Verificar que lanza error si faltan env vars
    expect(content).toContain("Missing required");
  });

  it("should not have fallback credentials in utils/supabase/server.ts", () => {
    const serverPath = join(process.cwd(), "src/utils/supabase/server.ts");
    const content = readFileSync(serverPath, "utf-8");

    // No debe tener URLs de Supabase hardcodeadas como fallback
    expect(content).not.toContain("xdvemkyvgnfnibntfbwq.supabase.co");
    expect(content).not.toContain("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
    // Verificar que lanza error si faltan env vars
    expect(content).toContain("Missing required");
  });
});

describe("🔒 Security: Rate Limiting Implementation", () => {
  it("should have rate limiting configured", () => {
    const middlewarePath = join(process.cwd(), "src/lib/api/middleware.ts");
    const content = readFileSync(middlewarePath, "utf-8");

    // Verificar configuración de rate limiting
    expect(content).toContain("rateLimitConfigs");
    expect(content).toContain("general");
    expect(content).toContain("auth");
    expect(content).toContain("payment");
  });

  it("should have suspicious activity tracking", () => {
    const middlewarePath = join(process.cwd(), "src/lib/api/middleware.ts");
    const content = readFileSync(middlewarePath, "utf-8");

    expect(content).toContain("trackSuspiciousActivity");
    expect(content).toContain("logSecurityEvent");
    expect(content).toContain("SecurityEventType");
  });
});
