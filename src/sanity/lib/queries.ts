/**
 * Sanity GROQ Queries for Membership and Dynamic Links
 */

import { client } from "./client";

// ============================================================================
// Types for Queries
// ============================================================================

import type {
  DynamicLink,
  DynamicLinksSection,
  MembershipModule,
  UserMembership,
  MembershipModuleWithAccess,
} from "@/types/membership";

// ============================================================================
// Dynamic Links Queries
// ============================================================================

/**
 * Get all dynamic links filtered by section
 */
export async function getDynamicLinksBySection(
  section: string,
): Promise<DynamicLinksSection | null> {
  const query = `*[_type == "dynamicLinks" && section == $section && isActive == true][0] {
    _id,
    _type,
    title,
    section,
    isActive,
    "links": links[isActive == true] | order(_key asc) {
      _key,
      label,
      url,
      icon,
      openInNewTab,
      isActive
    }
  }`;

  return client.fetch<DynamicLinksSection | null>(query, { section });
}

/**
 * Get all dynamic links grouped by section
 */
export async function getAllDynamicLinks(): Promise<DynamicLinksSection[]> {
  const query = `*[_type == "dynamicLinks" && isActive == true] | order(section asc) {
    _id,
    _type,
    title,
    section,
    isActive,
    "links": links[isActive == true] | order(_key asc) {
      _key,
      label,
      url,
      icon,
      openInNewTab,
      isActive
    }
  }`;

  return client.fetch<DynamicLinksSection[]>(query);
}

// ============================================================================
// Membership Queries
// ============================================================================

/**
 * Get all membership modules ordered by module number
 */
export async function getAllMembershipModules(): Promise<MembershipModule[]> {
  const query = `*[_type == "membershipContent"] | order(moduleNumber asc) {
    _id,
    _type,
    title,
    slug,
    moduleNumber,
    phase,
    description,
    isLocked,
    dias_para_desbloqueo,
    releaseDate,
    estimatedCompletionTime,
    tags
  }`;

  return client.fetch<MembershipModule[]>(query);
}

/**
 * Get a single membership module by module number
 */
export async function getMembershipModuleByNumber(
  moduleNumber: number,
): Promise<MembershipModule | null> {
  const query = `*[_type == "membershipContent" && moduleNumber == $moduleNumber][0] {
    _id,
    _type,
    title,
    slug,
    moduleNumber,
    phase,
    description,
    learningObjectives,
    content,
    exercises,
    downloads,
    journalPrompts,
    affirmations,
    nutritionTips,
    isLocked,
    dias_para_desbloqueo,
    releaseDate,
    estimatedCompletionTime,
    tags
  }`;

  return client.fetch<MembershipModule | null>(query, { moduleNumber });
}

/**
 * Get membership modules that are accessible based on user's start_date
 * This combines the modules with access calculation
 */
export async function getAccessibleMembershipModules(
  userMembership: UserMembership,
): Promise<MembershipModuleWithAccess[]> {
  const modules = await getAllMembershipModules();
  return modules.map((module) => calculateModuleAccess(module, userMembership));
}

/**
 * Get membership modules filtered by phase
 */
export async function getMembershipModulesByPhase(
  phase: string,
): Promise<MembershipModule[]> {
  const query = `*[_type == "membershipContent" && phase == $phase] | order(moduleNumber asc) {
    _id,
    _type,
    title,
    slug,
    moduleNumber,
    phase,
    description,
    isLocked,
    dias_para_desbloqueo,
    releaseDate,
    estimatedCompletionTime,
    tags
  }`;

  return client.fetch<MembershipModule[]>(query, { phase });
}

// ============================================================================
// Access Calculation Utilities
// ============================================================================

/**
 * Calculate if a membership module is accessible for a user
 */
export function calculateModuleAccess(
  module: MembershipModule,
  userMembership: UserMembership,
): MembershipModuleWithAccess {
  // If user doesn't have a start date, they can't access anything
  if (!userMembership.start_date) {
    return {
      ...module,
      isAccessible: false,
      unlockReason: "no_start_date",
      daysUntilUnlock: null,
    };
  }

  // If module is not locked, it's available
  if (!module.isLocked) {
    return {
      ...module,
      isAccessible: true,
      unlockReason: "available",
      daysUntilUnlock: 0,
    };
  }

  // Calculate days since user started
  const startDate = new Date(userMembership.start_date);
  const today = new Date();
  const daysSinceStart = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // If releaseDate is set and has passed, module is available
  if (module.releaseDate) {
    const releaseDate = new Date(module.releaseDate);
    if (releaseDate <= today) {
      return {
        ...module,
        isAccessible: true,
        unlockReason: "available",
        daysUntilUnlock: 0,
      };
    }
  }

  // Check if days since start >= dias_para_desbloqueo
  if (daysSinceStart >= module.dias_para_desbloqueo) {
    return {
      ...module,
      isAccessible: true,
      unlockReason: "available",
      daysUntilUnlock: 0,
    };
  }

  // Module is locked
  const daysRemaining = module.dias_para_desbloqueo - daysSinceStart;
  return {
    ...module,
    isAccessible: false,
    unlockReason: "locked_by_days",
    daysUntilUnlock: daysRemaining,
  };
}

/**
 * Get days until a module is unlocked
 */
export function getDaysUntilUnlock(
  dias_para_desbloqueo: number,
  start_date: string | null,
): number | null {
  if (!start_date) {
    return null;
  }

  const startDate = new Date(start_date);
  const today = new Date();
  const daysSinceStart = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const remaining = dias_para_desbloqueo - daysSinceStart;
  return remaining > 0 ? remaining : 0;
}

// ============================================================================
// Legacy queries for compatibility
// ============================================================================

/**
 * Get membership content (legacy - returns full content)
 */
export async function getMembershipContent(): Promise<MembershipModule[]> {
  const query = `*[_type == "membershipContent"] | order(moduleNumber asc)`;
  return client.fetch<MembershipModule[]>(query);
}

/**
 * Get membership content by slug (legacy)
 */
export async function getMembershipContentBySlug(
  slug: string,
): Promise<MembershipModule | null> {
  const query = `*[_type == "membershipContent" && slug.current == $slug][0]`;
  return client.fetch<MembershipModule | null>(query, { slug });
}
