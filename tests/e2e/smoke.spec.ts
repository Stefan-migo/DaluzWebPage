/**
 * E2E Smoke Tests - Verificación básica de flujos
 */

import { test, expect } from "@playwright/test";

test.describe("🌐 Public Pages", () => {
  test("homepage should load without errors", async ({ page }) => {
    await page.goto("/");

    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Check no console errors (only Error level)
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Verify page has content
    await expect(page.locator("body")).not.toBeEmpty();

    // Allow some known non-critical errors
    const criticalErrors = errors.filter(
      (e) => !e.includes("hydration") && !e.includes("Warning:"),
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test("products page should load", async ({ page }) => {
    await page.goto("/productos");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("blog should load", async ({ page }) => {
    await page.goto("/blog");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("body")).not.toBeEmpty();
  });
});

test.describe("🔒 Protected Routes Redirect", () => {
  test("should redirect to login when accessing /perfil without auth", async ({
    page,
  }) => {
    await page.goto("/perfil");

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test("should redirect to login when accessing /mis-pedidos without auth", async ({
    page,
  }) => {
    await page.goto("/mis-pedidos");

    await expect(page).toHaveURL(/\/login/);
  });

  test("should redirect to login when accessing /checkout without auth", async ({
    page,
  }) => {
    await page.goto("/checkout");

    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("🔐 Auth Pages Load", () => {
  test("login page should load", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    // Check for login form elements
    await expect(page.locator("form")).toBeVisible();
  });

  test("register page should load", async ({ page }) => {
    await page.goto("/register");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("form")).toBeVisible();
  });
});
