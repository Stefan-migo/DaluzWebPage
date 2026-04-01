import { NextResponse } from "next/server";
import { getTiendaSettings } from "@/lib/sanity/client";

export async function GET() {
  try {
    const settings = await getTiendaSettings();

    return NextResponse.json({
      settings,
    });
  } catch (error) {
    console.error("Error fetching tienda settings:", error);
    return NextResponse.json(
      { error: "Error fetching tienda settings" },
      { status: 500 },
    );
  }
}
