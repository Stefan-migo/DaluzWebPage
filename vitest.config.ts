import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  // El codigo usa imports absolutos "@/..." en todos lados. Sin este alias,
  // vitest no puede cargar ningun modulo que los use.
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "*.config.*", "**/*.d.ts"],
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
