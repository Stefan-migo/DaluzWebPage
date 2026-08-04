import { readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { isAllowedImageHost } from "@/lib/email/allowed-hosts";

export const runtime = "nodejs";

const PLACEHOLDER_PATH = path.join(
  process.cwd(),
  "public",
  "images",
  "email-placeholder.jpg",
);

const CACHE_HEADERS = {
  "Content-Type": "image/jpeg",
  // La imagen de un pedido ya emitido no cambia nunca.
  "Cache-Control": "public, max-age=31536000, immutable",
};

async function placeholderResponse(): Promise<Response> {
  try {
    const file = await readFile(PLACEHOLDER_PATH);
    return new Response(new Uint8Array(file), {
      status: 200,
      headers: CACHE_HEADERS,
    });
  } catch {
    // Ultimo recurso. Nunca un 5xx: un error aca seria un hueco roto en el
    // mail del cliente.
    return new Response(null, { status: 204 });
  }
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src");
  const width = Math.min(
    Math.max(parseInt(searchParams.get("w") || "128", 10) || 128, 16),
    600,
  );

  if (!src || !isAllowedImageHost(src)) return placeholderResponse();

  try {
    const upstream = await fetch(src, { signal: AbortSignal.timeout(8000) });
    if (!upstream.ok) return placeholderResponse();

    const input = Buffer.from(await upstream.arrayBuffer());
    // Siempre JPEG: Outlook no renderiza webp. Y redimensionado, porque las
    // fotos de producto son de pagina y un mail con varias se iria a MB.
    const output = await sharp(input)
      .resize(width, width, { fit: "cover" })
      .jpeg({ quality: 72 })
      .toBuffer();

    return new Response(new Uint8Array(output), {
      status: 200,
      headers: CACHE_HEADERS,
    });
  } catch {
    return placeholderResponse();
  }
}
