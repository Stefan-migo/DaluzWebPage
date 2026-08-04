import { describe, it, expect, beforeEach } from "vitest";
import { isAllowedImageHost } from "./allowed-hosts";

describe("isAllowedImageHost", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://xdvemk.supabase.co";
    process.env.NEXT_PUBLIC_APP_URL = "https://daluzconsciente.com";
  });

  it("acepta el host de supabase storage", () => {
    expect(
      isAllowedImageHost(
        "https://xdvemk.supabase.co/storage/v1/object/public/x.jpg",
      ),
    ).toBe(true);
  });

  it("acepta el dominio propio", () => {
    expect(isAllowedImageHost("https://daluzconsciente.com/images/x.jpg")).toBe(
      true,
    );
  });

  it("rechaza un host externo", () => {
    expect(isAllowedImageHost("https://evil.example.com/x.jpg")).toBe(false);
  });

  it("rechaza direcciones internas (SSRF)", () => {
    expect(isAllowedImageHost("http://169.254.169.254/latest/meta-data/")).toBe(
      false,
    );
    expect(isAllowedImageHost("http://localhost:3000/secret")).toBe(false);
  });

  it("rechaza esquemas que no son http(s)", () => {
    expect(isAllowedImageHost("file:///C:/fotos/x.jpg")).toBe(false);
    expect(isAllowedImageHost("data:image/png;base64,AAAA")).toBe(false);
  });

  it("rechaza una URL invalida sin lanzar", () => {
    expect(isAllowedImageHost("no-es-una-url")).toBe(false);
  });
});
