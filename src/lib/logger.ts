import { createServiceRoleClient } from "@/lib/supabase";

// ============================================
// Types
// ============================================

type LogLevel = "debug" | "info" | "warn" | "error" | "critical";

interface LogContext {
  requestId?: string;
  source?: string;
  userId?: string;
  [key: string]: unknown;
}

// ============================================
// Logger
// ============================================

function log(
  level: LogLevel,
  message: string,
  error?: Error | null,
  context?: LogContext,
) {
  const consoleFn =
    level === "error" || level === "critical"
      ? console.error
      : level === "warn"
        ? console.warn
        : console.log;

  consoleFn(`[${level.toUpperCase()}] ${message}`, context ?? "");

  // Persist error & critical to system_logs (fire-and-forget)
  if (level === "error" || level === "critical") {
    persistToDb(level, message, error, context).catch(() => {
      // Swallow — never let logging failures cascade
    });
  }
}

async function persistToDb(
  level: LogLevel,
  message: string,
  error?: Error | null,
  context?: LogContext,
) {
  try {
    const supabase = createServiceRoleClient();
    await supabase.from("system_logs").insert({
      level,
      message,
      context: context ?? {},
      source: context?.source ?? null,
      error_stack: error?.stack ?? null,
    });
  } catch (err) {
    // Last resort — console only
    console.error("[Logger] Failed to persist log to DB:", err);
  }
}

// ============================================
// Public API
// ============================================

export const logger = {
  debug(message: string, context?: LogContext) {
    log("debug", message, null, context);
  },

  info(message: string, context?: LogContext) {
    log("info", message, null, context);
  },

  warn(message: string, context?: LogContext) {
    log("warn", message, null, context);
  },

  error(message: string, error?: Error, context?: LogContext) {
    log("error", message, error, context);
  },

  critical(message: string, error?: Error, context?: LogContext) {
    log("critical", message, error, context);
  },
};
