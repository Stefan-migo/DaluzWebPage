---
name: daluz-testing
description: Guía para testing automatizado de DA LUZ. Usar al escribir tests unitarios, de integración o E2E para el e-commerce, checkout, autenticación o cualquier módulo de DaLuz.
---

# Testing - Guía de Desarrollo

## Alcance

Testing automatizado para todos los módulos de DaLuz: unit tests, integration tests, E2E con Playwright. Cubre e-commerce, checkout, autenticación, reviews, membresía y más.

---

## Stack de Testing

| Tipo        | Herramienta                    | Propósito                          |
| ----------- | ------------------------------ | ---------------------------------- |
| Unit        | Vitest                         | Funciones puras, lógica de negocio |
| Integration | Vitest + React Testing Library | Componentes, hooks, APIs           |
| E2E         | Playwright                     | Flujos completos de usuario        |
| Coverage    | V8 (built-in de Vitest)        | Reports de coverage                |

---

## Estructura de Tests

```
src/
├── lib/
│   ├── utils.ts
│   └── utils.test.ts          # Unit tests junto al código
├── components/
│   └── ui/
│       ├── button.tsx
│       └── button.test.tsx    # Tests junto al componente
└── test/
    ├── setup.ts              # Setup global
    └── mocks/                # Mocks globales

e2e/
├── homepage.spec.ts
├── checkout.spec.ts
└── auth.spec.ts
```

---

## Unit Tests (60%)

### Ejemplo: utils.test.ts

```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles undefined", () => {
    expect(cn("foo", undefined, "bar")).toBe("foo bar");
  });

  it("overrides with last value", () => {
    expect(cn("text-red", "text-blue")).toBe("text-blue");
  });
});
```

### Ejemplo: CartContext logic

```typescript
// src/lib/cart/cart.test.ts
import { describe, it, expect, vi } from "vitest";
import { calculateCartTotal } from "./cart";

describe("calculateCartTotal", () => {
  it("returns 0 for empty cart", () => {
    expect(calculateCartTotal([])).toBe(0);
  });

  it("calculates total with single item", () => {
    const items = [{ price: 100, quantity: 2 }];
    expect(calculateCartTotal(items)).toBe(200);
  });

  it("calculates total with multiple items", () => {
    const items = [
      { price: 100, quantity: 2 },
      { price: 50, quantity: 3 },
    ];
    expect(calculateCartTotal(items)).toBe(350);
  });
});
```

---

## Integration Tests (30%)

### Ejemplo: ProductCard

```typescript
// src/components/product/product-card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './product-card';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Aceite de Argán',
    price: 15000,
    image_url: '/images/argan.jpg',
    slug: 'aceite-de-argan',
  };

  it('displays product info correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Aceite de Argán')).toBeInTheDocument();
    expect(screen.getByText('$15.000')).toBeInTheDocument();
  });

  it('calls onAddToCart when button clicked', () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    fireEvent.click(screen.getByRole('button', { name: /agregar/i }));
    expect(onAddToCart).toHaveBeenCalledWith('1');
  });
});
```

### Ejemplo: Checkout API

```typescript
// src/app/api/checkout/test/route.test.ts
import { describe, it, expect } from "vitest";

describe("Checkout API", () => {
  it("validates empty cart", async () => {
    const response = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ items: [], customerInfo: {} }),
    });

    expect(response.status).toBe(400);
  });

  it("creates order with valid data", async () => {
    const response = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({
        items: [{ productId: "1", quantity: 2, price: 100 }],
        customerInfo: {
          firstName: "Juan",
          lastName: "Pérez",
          email: "juan@example.com",
        },
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.orderId).toBeDefined();
  });
});
```

---

## E2E Tests (10%)

### Ejemplo: Checkout Flow

```typescript
// e2e/checkout.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Checkout Flow", () => {
  test("completes purchase successfully", async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "password123");
    await page.click('[type="submit"]');

    // Add to cart
    await page.goto("/productos/aceite-de-argan");
    await page.click('button:has-text("Agregar al carrito")');

    // Checkout
    await page.click("text=Ver carrito");
    await page.click("text=Proceder al pago");

    // Mock MercadoPago redirect
    await page.goto("/checkout/success?payment_id=mock123");

    // Verify success
    await expect(page.locator("text=¡Compra exitosa!")).toBeVisible();

    // Verify order in account
    await page.goto("/mis-pedidos");
    await expect(page.locator("text=mock123")).toBeInTheDocument();
  });

  test("shows validation errors for empty checkout", async ({ page }) => {
    await page.goto("/checkout");

    await page.click("text=Proceder al pago");
    await expect(page.locator("text=Tu carrito está vacío")).toBeVisible();
  });
});
```

### Ejemplo: Auth Flow

```typescript
// e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("login with valid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "password123");
    await page.click('[type="submit"]');

    await expect(page).toHaveURL("/");
    await expect(page.locator("text=Cerrar sesión")).toBeVisible();
  });

  test("login with invalid credentials shows error", async ({ page }) => {
    await page.goto("/login");
    await page.fill('[name="email"]', "wrong@example.com");
    await page.fill('[name="password"]', "wrongpassword");
    await page.click('[type="submit"]');

    await expect(page.locator("text=Credenciales inválidas")).toBeVisible();
  });

  test("signup with email and password", async ({ page }) => {
    await page.goto("/signup");
    await page.fill('[name="email"]', "newuser@example.com");
    await page.fill('[name="password"]', "securepassword123");
    await page.fill('[name="confirmPassword"]', "securepassword123");
    await page.click('[type="submit"]');

    await expect(page).toHaveURL("/");
  });
});
```

---

## Mocks Comunes

### Setup Global (src/test/setup.ts)

```typescript
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => "/",
}));

// Mock Supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null }),
    }),
  }),
}));

// Mock MercadoPago
vi.mock("@mercadopago/sdk-react", () => ({
  initMercadoPago: vi.fn(),
  Wallet: vi.fn(() => null),
}));
```

### Mock Data

```typescript
// Mock user
const mockUser = {
  id: "123",
  email: "test@example.com",
  user_metadata: { full_name: "Test User" },
};

// Mock product
const mockProduct = {
  id: "prod_1",
  name: "Aceite de Argán",
  price: 15000,
  image_url: "/images/argan.jpg",
  slug: "aceite-de-argan",
  inventory_quantity: 10,
};

// Mock cart
const mockCart = {
  items: [{ product: mockProduct, quantity: 2, variantId: null }],
  total: 30000,
};

// Mock order
const mockOrder = {
  id: "order_123",
  status: "pending",
  total: 30000,
  created_at: new Date().toISOString(),
};
```

---

## Configuración

### Vitest Config

```typescript
// vite.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/test/", "**/*.d.ts", "**/*.config.*"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

---

## Comandos

```bash
# Unit + Integration tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E headed (visual)
npm run test:e2e:headed

# Playwright setup
npx playwright install chromium
```

---

## Coverage Targets

| Layer                | Target |
| -------------------- | ------ |
| Unit (lib/utils)     | 80%+   |
| Components           | 60%+   |
| Integration (API)    | 50%+   |
| E2E (critical flows) | 100%   |

### Flujos Críticos E2E

1. Login/Logout
2. Registro
3. Navegación producto
4. Añadir al carrito
5. Checkout completo
6. Mi cuenta / Pedidos

---

## Patrones por Módulo

### E-commerce (daluz-ecommerce)

```typescript
// CartContext
describe("CartContext", () => {
  it("adds item to cart", () => {
    // Test addItem logic
  });

  it("updates quantity correctly", () => {
    // Test updateQuantity logic
  });

  it("removes item from cart", () => {
    // Test removeItem logic
  });
});

// ProductCard
describe("ProductCard", () => {
  it("displays product with correct price");
  it("calls onAddToCart when clicked");
  it("shows out of stock when inventory is 0");
});
```

### Checkout (daluz-checkout-pagos)

```typescript
// Checkout flow E2E
test.describe("Checkout", () => {
  it("creates MercadoPago preference");
  it("handles payment success");
  it("handles payment failure");
  it("updates inventory on success");
});
```

### Auth (daluz-autenticacion)

```typescript
// Auth flow E2E
test.describe("Auth", () => {
  it("logs in with email/password");
  it("logs in with Google OAuth");
  it("signs up new user");
  it("resets password");
  it("logs out");
});
```

### Reviews (daluz-reviews)

```typescript
describe("ReviewForm", () => {
  it("validates rating 1-5");
  it("submits review successfully");
  it("shows error for empty comment");
});

describe("ReviewList", () => {
  it("displays reviews sorted by date");
  it("pagination works correctly");
});
```

---

## Best Practices

### DO

- ✅ Tests junto al código fuente
- ✅ Nombres descriptivos (should [action] when [condition])
- ✅ Un concepto por test
- ✅ Mocks de dependencias externas
- ✅ Testear comportamiento, no implementación
- ✅ Arrange-Act-Assert pattern

### DON'T

- ❌ Tests que dependen de otros tests
- ❌ Hardcoded dates/times
- ❌ Mocks excesivos que no reflejan realidad
- ❌ Testear implementación (private methods)
- ❌ Coverage > quality
- ❌ Tests sin aserción (tautologies)

---

## Naming Conventions

```typescript
describe("ComponentName", () => {
  it("should [action] when [condition]", () => {});
  it("should display [element] when [state]", () => {});
  it("should call [function] when [event]", () => {});
  it("should show [error] when [invalid input]", () => {});
});
```

---

## Checklist Pre-Commit

- [ ] `npm run test` pasa sin errores
- [ ] Coverage se mantiene dentro de targets
- [ ] Tests nuevos acompañan cambios de código
- [ ] Mock data es realista
- [ ] No hay tests comentados o skippeados sin razón
- [ ] E2E critical paths funcionan

---

## Integración con CI/CD

```yaml
# .github/workflows/test.yml
name: Tests

on: [pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx playwright install chromium
      - run: npm run test:e2e
```

---

## Referencias

- **Agent testing:** `.opencode/agents/testing.md`
- **Vitest docs:** https://vitest.dev/
- **React Testing Library:** https://testing-library.com/docs/react-testing-library/intro/
- **Playwright:** https://playwright.dev/
