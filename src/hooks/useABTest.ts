"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";

export type ExperimentVariant = "control" | "variant";

export interface Experiment {
  id: string;
  name: string;
  description?: string;
  variant: ExperimentVariant;
  isActive: boolean;
}

export interface UseABTestOptions {
  experimentName: string;
  defaultVariant?: ExperimentVariant;
  forceVariant?: ExperimentVariant; // Para testing
  persistInLocalStorage?: boolean;
}

/**
 * Hook simple para A/B Testing
 *
 * @example
 * ```tsx
 * const { variant, isControl, trackConversion } = useABTest({
 *   experimentName: 'guest_checkout',
 *   defaultVariant: 'control',
 * });
 *
 * return (
 *   <div>
 *     {isControl ? <CheckoutWithLogin /> : <GuestCheckout />}
 *     <button onClick={() => trackConversion('click_cta')}>
 *       Continuar
 *     </button>
 *   </div>
 * );
 * ```
 */
export function useABTest({
  experimentName,
  defaultVariant = "control",
  forceVariant,
  persistInLocalStorage = true,
}: UseABTestOptions) {
  const { user } = useAuth();
  const [variant, setVariant] = useState<ExperimentVariant>(defaultVariant);
  const [isLoading, setIsLoading] = useState(true);

  // Deterministically assign variant based on user ID or random
  const assignVariant = useCallback((): ExperimentVariant => {
    // Si hay forcing (para testing), usarlo
    if (forceVariant) return forceVariant;

    // Intentar obtener de localStorage (para persistencia)
    const storageKey = `ab_test_${experimentName}`;
    if (persistInLocalStorage && typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored === "control" || stored === "variant") {
        return stored;
      }
    }

    // Asignación determinística basada en user ID o random
    let hash: number;
    if (user?.id) {
      // Hash del user ID + experiment name para consistencia entre sesiones
      hash = hashCode(`${user.id}_${experimentName}`);
    } else {
      // Para usuarios no logueados, usar random simple
      hash = Math.floor(Math.random() * 100);
    }

    const assignedVariant = hash % 2 === 0 ? "control" : "variant";

    // Guardar en localStorage para persistencia
    if (persistInLocalStorage && typeof window !== "undefined") {
      localStorage.setItem(storageKey, assignedVariant);
    }

    return assignedVariant;
  }, [
    experimentName,
    defaultVariant,
    forceVariant,
    persistInLocalStorage,
    user?.id,
  ]);

  useEffect(() => {
    const assigned = assignVariant();
    setVariant(assigned);
    setIsLoading(false);

    // Track experiment view
    trackExperimentView(experimentName, assigned);
  }, [assignVariant, experimentName]);

  const isControl = variant === "control";
  const isVariant = variant === "variant";

  return {
    variant,
    isControl,
    isVariant,
    isLoading,
    trackConversion: (goal: string) =>
      trackConversion(experimentName, variant, goal),
  };
}

// Hash function for deterministic assignment
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Track experiment view event
async function trackExperimentView(
  experimentName: string,
  variant: ExperimentVariant,
) {
  try {
    const { supabase } = await import("@/lib/supabase");

    await supabase.rpc("track_ab_experiment", {
      p_experiment_name: experimentName,
      p_variant: variant,
      p_event_type: "view",
    });
  } catch (error) {
    // Silent fail - A/B tracking should never break the app
    console.error("[A/B Test] Failed to track view:", error);
  }
}

// Track conversion event
async function trackConversion(
  experimentName: string,
  variant: ExperimentVariant,
  goal: string,
) {
  try {
    const { supabase } = await import("@/lib/supabase");

    await supabase.rpc("track_ab_experiment", {
      p_experiment_name: experimentName,
      p_variant: variant,
      p_event_type: "conversion",
      p_goal: goal,
    });
  } catch (error) {
    console.error("[A/B Test] Failed to track conversion:", error);
  }
}

/**
 * Función para determinar si un experimento está activo
 * Consultará a Supabase para obtener experimentos activos
 */
export async function getActiveExperiments(): Promise<Experiment[]> {
  try {
    const { supabase } = await import("@/lib/supabase");

    const { data, error } = await supabase
      .from("research_metrics")
      .select("experiment_name, variant, status")
      .eq("status", "running")
      .limit(10);

    if (error) throw error;

    return (data || []).map((row) => ({
      id: row.experiment_name,
      name: row.experiment_name,
      variant: row.variant as ExperimentVariant,
      isActive: true,
    }));
  } catch (error) {
    console.error("[A/B Test] Failed to get active experiments:", error);
    return [];
  }
}

/**
 * Función para obtener el valor de un experimento activo para un usuario
 */
export async function getExperimentVariant(
  userId: string,
  experimentName: string,
): Promise<ExperimentVariant | null> {
  try {
    const { supabase } = await import("@/lib/supabase");

    const { data, error } = await supabase
      .from("research_metrics")
      .select("variant")
      .eq("experiment_name", experimentName)
      .eq("status", "running")
      .single();

    if (error || !data) return null;
    return data.variant as ExperimentVariant;
  } catch (error) {
    console.error("[A/B Test] Failed to get experiment variant:", error);
    return null;
  }
}
