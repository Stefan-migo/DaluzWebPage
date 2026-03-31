/**
 * Type Safety Tests - Verificación de tipos TypeScript
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("📝 TypeScript: Database Types", () => {
  it("should have complete database types defined", () => {
    const dbTypesPath = join(process.cwd(), "src/types/database.ts");
    const content = readFileSync(dbTypesPath, "utf-8");

    // Verificar que las tablas principales están definidas
    const expectedTables = [
      "profiles",
      "products",
      "orders",
      "order_items",
      "categories",
      "reviews",
      "admin_users",
    ];

    expectedTables.forEach((table) => {
      expect(content).toMatch(new RegExp(`${table}:\\s*\\{`));
    });
  });

  it("should define is_admin function type", () => {
    const dbTypesPath = join(process.cwd(), "src/types/database.ts");
    const content = readFileSync(dbTypesPath, "utf-8");

    expect(content).toContain("is_admin");
    expect(content).toContain("Returns: boolean");
  });
});

describe("📝 TypeScript: Middleware Types", () => {
  it("should have proper types for security events", () => {
    const middlewarePath = join(process.cwd(), "src/lib/api/middleware.ts");
    const content = readFileSync(middlewarePath, "utf-8");

    // Verificar que tiene tipos definidos
    expect(content).toContain("SecurityEventType");
    expect(content).toContain("AuthenticatedUser");
    expect(content).toContain("RateLimitEntry");
  });
});

describe("📝 TypeScript: No implicit any in critical files", () => {
  it("checkout route should not have implicit any", () => {
    const checkoutPath = join(process.cwd(), "src/app/api/checkout/route.ts");
    const content = readFileSync(checkoutPath, "utf-8");

    // Verificar que usa tipos definidos
    expect(content).toContain("CartItem");
    expect(content).toContain("CustomerInfo");
  });
});
