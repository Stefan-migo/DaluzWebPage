// =====================================================
// Types for Tesoros Da Luz system
// =====================================================

export type TreasureAccessType = "general" | "linea" | "kit";

export type TreasureSourceType =
  | "purchase"
  | "manual"
  | "membership"
  | "promotion";

export interface UserTreasure {
  id: string;
  user_id: string;
  access_id: string;
  access_type: TreasureAccessType;
  granted_at: string;
  source_type: TreasureSourceType;
  source_id: string | null;
}

export interface TreasureContent {
  _id: string;
  _type: "tesoroContent";
  title: string;
  slug: string;
  description?: string;
  required_id: string; // Access ID required to view (e.g., 'tesoro-gral', 'linea-umbral')
  content_type: "video" | "audio" | "pdf" | "text";
  // Media fields
  video_url?: string; // Bunny.net URL
  audio_file?: {
    url: string;
    duration?: number;
  };
  pdf_file?: {
    url: string;
    name: string;
  };
  // Content
  rich_text?: any[]; // Portable Text
  // Metadata
  linea?: string; // e.g., 'ecos', 'umbral', 'jade'
  kit?: string; // e.g., 'alkimya', ' despertar'
  sort_order?: number;
  duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

// Result of granting treasure access
export interface GrantTreasureResult {
  access_id: string;
  granted: boolean;
  message: string;
}

// User treasures state
export interface TreasuresState {
  treasures: string[]; // Array of access_ids
  loading: boolean;
  error: Error | null;
  hasAccess: (requiredId: string) => boolean;
}

// Lineas y Kits predefinidos según el documento del cliente
export const TESOROS_CONFIG = {
  // Acceso general - cualquier compra
  GENERAL_ACCESS: "tesoro-gral",

  // Líneas de productos (5)
  LINEAS: [
    { id: "linea-ecos", name: "Ecos", description: "Capilar", emoji: "💧" },
    { id: "linea-umbral", name: "Umbral", description: "Cuerpo", emoji: "🌿" },
    {
      id: "linea-prisma",
      name: "Prism.a / Utópica",
      description: "Maquillaje",
      emoji: "✨",
    },
    { id: "linea-jade", name: "Jade", description: "Tratamiento", emoji: "💎" },
    {
      id: "linea-alma-terra",
      name: "Alma Terra",
      description: "Aromaterapia",
      emoji: "🌺",
    },
  ] as const,

  // Kits (11) - se van definiendo
  KITS: [
    { id: "kit-alkimya", name: "Kit Alkimya", description: "Viaje Alquímico" },
  ] as const,
} as const;

export type LineaId = (typeof TESOROS_CONFIG.LINEAS)[number]["id"];
export type KitId = (typeof TESOROS_CONFIG.KITS)[number]["id"];
export type AccessId = typeof TESOROS_CONFIG.GENERAL_ACCESS | LineaId | KitId;
