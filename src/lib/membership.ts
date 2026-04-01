/**
 * Membership Content Access Utilities
 * Calculates whether a user has access to membership content
 * based on dias_para_desbloqueo and their start_date
 */

import type {
  MembershipModule,
  UserMembership,
  MembershipModuleWithAccess,
} from "@/types/membership";

/**
 * Calculate if a membership module is accessible for a user
 *
 * Logic:
 * - If no start_date → not accessible
 * - If isLocked == false → accessible (manually unlocked)
 * - If releaseDate exists and passed → accessible (date-based unlock)
 * - If (today - start_date) >= dias_para_desbloqueo → accessible (relative drip)
 * - Otherwise → locked
 */
export function calculateModuleAccess(
  module: Pick<
    MembershipModule,
    "isLocked" | "dias_para_desbloqueo" | "releaseDate"
  >,
  userMembership: UserMembership,
): MembershipModuleWithAccess {
  // If user doesn't have a start date, they can't access anything
  if (!userMembership.start_date) {
    return {
      ...module,
      isAccessible: false,
      unlockReason: "no_start_date",
      daysUntilUnlock: null,
    } as MembershipModuleWithAccess;
  }

  // If module is not locked manually, it's available
  if (!module.isLocked) {
    return {
      ...module,
      isAccessible: true,
      unlockReason: "available",
      daysUntilUnlock: 0,
    } as MembershipModuleWithAccess;
  }

  // Calculate days since user started
  const startDate = new Date(userMembership.start_date);
  const today = new Date();
  const daysSinceStart = calculateDaysBetween(startDate, today);

  // If releaseDate is set and has passed, module is available
  if (module.releaseDate) {
    const releaseDate = new Date(module.releaseDate);
    if (releaseDate <= today) {
      return {
        ...module,
        isAccessible: true,
        unlockReason: "available",
        daysUntilUnlock: 0,
      } as MembershipModuleWithAccess;
    }
  }

  // Check if days since start >= dias_para_desbloqueo (relative drip content)
  if (daysSinceStart >= module.dias_para_desbloqueo) {
    return {
      ...module,
      isAccessible: true,
      unlockReason: "available",
      daysUntilUnlock: 0,
    } as MembershipModuleWithAccess;
  }

  // Module is still locked
  const daysRemaining = module.dias_para_desbloqueo - daysSinceStart;
  return {
    ...module,
    isAccessible: false,
    unlockReason: "locked_by_days",
    daysUntilUnlock: daysRemaining,
  } as MembershipModuleWithAccess;
}

/**
 * Get the reason why a module is locked or available
 */
export function getUnlockReason(
  module: Pick<
    MembershipModule,
    "isLocked" | "dias_para_desbloqueo" | "releaseDate"
  >,
  userMembership: UserMembership,
): MembershipModuleWithAccess["unlockReason"] {
  if (!userMembership.start_date) {
    return "no_start_date";
  }

  if (!module.isLocked) {
    return "available";
  }

  const today = new Date();

  if (module.releaseDate) {
    const releaseDate = new Date(module.releaseDate);
    if (releaseDate <= today) {
      return "available";
    }
  }

  const startDate = new Date(userMembership.start_date);
  const daysSinceStart = calculateDaysBetween(startDate, today);

  if (daysSinceStart >= module.dias_para_desbloqueo) {
    return "available";
  }

  return "locked_by_days";
}

/**
 * Calculate days between two dates
 */
export function calculateDaysBetween(startDate: Date, endDate: Date): number {
  return Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
}

/**
 * Calculate days until a module is unlocked
 * Returns null if user has no start_date, 0 if already unlocked
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
  const daysSinceStart = calculateDaysBetween(startDate, today);

  const remaining = dias_para_desbloqueo - daysSinceStart;
  return remaining > 0 ? remaining : 0;
}

/**
 * Format days until unlock for display
 */
export function formatDaysUntilUnlock(daysUntilUnlock: number | null): string {
  if (daysUntilUnlock === null) {
    return "Fecha de inicio no configurada";
  }

  if (daysUntilUnlock === 0) {
    return "Disponible ahora";
  }

  if (daysUntilUnlock === 1) {
    return "Desbloquea mañana";
  }

  return `Desbloquea en ${daysUntilUnlock} días`;
}

/**
 * Get progress percentage for a user's membership journey
 */
export function getMembershipProgress(
  currentModule: number,
  totalModules: number,
): number {
  if (totalModules === 0) return 0;
  return Math.round((currentModule / totalModules) * 100);
}

/**
 * Check if user can access a specific phase
 */
export function canAccessPhase(
  phase: string,
  userMembership: UserMembership,
  allModules: Pick<
    MembershipModule,
    "phase" | "isLocked" | "dias_para_desbloqueo" | "releaseDate"
  >[],
): boolean {
  // Get modules in this phase
  const phaseModules = allModules.filter((m) => m.phase === phase);

  if (phaseModules.length === 0) {
    return false;
  }

  // User can access phase if at least one module is accessible
  return phaseModules.some((module) => {
    const access = calculateModuleAccess(module, userMembership);
    return access.isAccessible;
  });
}
