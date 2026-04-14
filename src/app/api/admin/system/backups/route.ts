import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from "@/lib/auth/helpers";
import { BackupService, BackupValidationError } from "@/lib/services/backup.service";

/**
 * GET /api/admin/system/backups
 * List all available backups.
 *
 * GET /api/admin/system/backups?filename=xxx&action=details
 * Get details and signed download URL for a specific backup.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");
    const action = searchParams.get("action");

    const service = new BackupService(getServiceClient());

    if (filename && action === "details") {
      const details = await service.getBackupDetails(filename);
      return NextResponse.json(details);
    }

    const result = await service.listBackups();
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof BackupValidationError) {
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: 400 },
      );
    }
    
    // Check if the service key is unconfigured
    if (process.env.SUPABASE_SERVICE_ROLE_KEY?.includes('placeholder')) {
       return NextResponse.json({ success: true, count: 0, backups: [], message: 'Storage credentials not configured. Returning empty test data.' });
    }

    console.error("Error in backups GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/system/backups
 * Restore a specific backup.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const { backup_filename, create_safety_backup } = body;

    if (!backup_filename) {
      return NextResponse.json(
        { error: "backup_filename es requerido" },
        { status: 400 },
      );
    }

    const service = new BackupService(getServiceClient());
    const result = await service.restoreBackup(
      { backup_filename, create_safety_backup },
      auth.supabase,
      auth.user.email ?? "unknown",
    );

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof BackupValidationError) {
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: 400 },
      );
    }
    console.error("Error in restore backup API:", error);
    return NextResponse.json(
      {
        error: "Error al restaurar backup",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/system/backups?filename=xxx
 * Delete a specific backup file.
 */
export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(request.url);
    const backup_filename = searchParams.get("filename");

    if (!backup_filename) {
      return NextResponse.json(
        { error: "backup_filename es requerido" },
        { status: 400 },
      );
    }

    const service = new BackupService(getServiceClient());
    const result = await service.deleteBackup(
      backup_filename,
      auth.supabase,
      auth.user.email ?? "unknown",
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in delete backup API:", error);
    return NextResponse.json(
      {
        error: "Error al eliminar backup",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}
