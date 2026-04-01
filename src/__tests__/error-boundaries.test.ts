/**
 * Error Boundary Tests - Verificación de Error Boundaries
 */

import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

describe("🎯 Error Boundaries: Required Error Files Exist", () => {
  const requiredErrorFiles = [
    "src/app/error.tsx",
    "src/app/(auth)/error.tsx",
    "src/app/(account)/error.tsx",
    "src/app/(commerce)/error.tsx",
    "src/app/admin/error.tsx",
  ];

  requiredErrorFiles.forEach((filePath) => {
    it(`should have error boundary at ${filePath}`, () => {
      const fullPath = join(process.cwd(), filePath);
      expect(() => readFileSync(fullPath, "utf-8")).not.toThrow();
    });
  });
});

describe("🎯 Error Boundaries: Error Component is Client Component", () => {
  const errorFiles = [
    "src/app/(auth)/error.tsx",
    "src/app/(account)/error.tsx",
    "src/app/(commerce)/error.tsx",
    "src/app/admin/error.tsx",
  ];

  errorFiles.forEach((filePath) => {
    it(`${filePath} should have 'use client' directive`, () => {
      const fullPath = join(process.cwd(), filePath);
      const content = readFileSync(fullPath, "utf-8");

      // Check for use client directive (either single or double quotes)
      expect(content).toMatch(/use client/);
    });
  });
});

describe("🎯 Error Boundaries: Reusable Component Exists", () => {
  it("should have reusable ErrorBoundary component", () => {
    const componentPath = join(
      process.cwd(),
      "src/components/ui/error-boundary.tsx",
    );
    const content = readFileSync(componentPath, "utf-8");

    expect(content).toContain("ErrorBoundary");
    expect(content).toContain("reset");
    expect(content).toContain("error");
  });
});
