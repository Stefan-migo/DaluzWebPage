/**
 * TypeScript types for Membership and Dynamic Links
 */

// ============================================================================
// Dynamic Links
// ============================================================================

export type LinkIcon =
  | "play"
  | "document"
  | "video"
  | "audio"
  | "image"
  | "external";

export interface DynamicLink {
  _key: string;
  label: string;
  url: string;
  icon?: LinkIcon;
  openInNewTab?: boolean;
  isActive?: boolean;
}

export interface DynamicLinksSection {
  _id: string;
  _type: "dynamicLinks";
  title: string;
  section: string;
  links: DynamicLink[];
  isActive: boolean;
}

// ============================================================================
// Membership - Relative Drip Content
// ============================================================================

export type Phase =
  | "despertar"
  | "purificacion"
  | "transformacion"
  | "integracion"
  | "manifestacion";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type DownloadType = "pdf" | "audio" | "video" | "image" | "other";

export interface Exercise {
  _key: string;
  title: string;
  instructions?: unknown[]; // Portable Text blocks
  estimatedTime?: number;
  difficulty?: Difficulty;
}

export interface Download {
  _key: string;
  title: string;
  description?: string;
  file?: {
    _type: string;
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
  type?: DownloadType;
}

export interface NutritionTip {
  _key: string;
  tip: string;
  explanation?: string;
}

export interface MembershipModule {
  _id: string;
  _type: "membershipContent";
  title: string;
  slug: {
    current: string;
  };
  moduleNumber: number;
  phase: Phase;
  description?: string;
  learningObjectives?: string[];
  content?: unknown[]; // Portable Text
  exercises?: Exercise[];
  downloads?: Download[];
  journalPrompts?: string[];
  affirmations?: string[];
  nutritionTips?: NutritionTip[];
  isLocked: boolean;
  dias_para_desbloqueo: number;
  releaseDate?: string;
  estimatedCompletionTime?: number;
  tags?: string[];
}

// ============================================================================
// Membership Access Calculation
// ============================================================================

export interface UserMembership {
  start_date: string | null; // ISO date string
  is_active: boolean;
}

export interface MembershipModuleWithAccess
  extends Omit<MembershipModule, "content" | "exercises" | "downloads"> {
  isAccessible: boolean;
  unlockReason?:
    | "available"
    | "locked_by_days"
    | "locked_by_date"
    | "locked_manual"
    | "no_start_date";
  daysUntilUnlock?: number | null;
}

// ============================================================================
// Sanity Document Types (raw from GROQ)
// ============================================================================

export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt?: string;
  _updatedAt?: string;
}

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
    url?: string;
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      };
      lqip?: string; // Low-quality image placeholder
    };
  };
  alt?: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

// ============================================================================
// Slug
// ============================================================================

export interface Slug {
  current: string;
}
