import { SupabaseClient } from "@supabase/supabase-js";

// ============================================
// Custom Errors
// ============================================

/** Thrown for client-side validation failures (maps to HTTP 400). */
export class BackupValidationError extends Error {
  constructor(message: string, public details?: string) {
    super(message);
    this.name = "BackupValidationError";
  }
}

// ============================================
// Types
// ============================================

export interface BackupListItem {
  id: string;
  filename: string;
  size: number;
  size_mb: string;
  created_at: string | null;
  updated_at: string | null;
  last_accessed_at: string | null;
}

export interface BackupDetails {
  success: true;
  backup_id: string;
  backup_file: string;
  download_url: string | null;
  download_url_expires_at: string | null;
  tables_count: number;
  total_records: number;
  backup_size_mb: string;
  created_at: string | undefined;
  created_by: string;
}

export interface RestoreParams {
  backup_filename: string;
  create_safety_backup?: boolean;
}

interface TableRestoreResult {
  status: "success" | "partial" | "error" | "skipped";
  records_restored?: number;
  records_total?: number;
  errors?: number;
  delete_errors?: number;
  error_message?: string;
  problematic_records?: Array<{
    record: Record<string, unknown>;
    error: string;
    details: string;
  }>;
  note?: string;
  reason?: string;
  error?: string;
}

export interface RestoreResult {
  success: true;
  message: string;
  backup_file: string;
  backup_id: string;
  safety_backup_id: string | null;
  tables_restored: number;
  total_records_restored: number;
  errors: number;
  restore_results: Record<string, TableRestoreResult>;
  duration_seconds: string;
}

/** Shape of the parsed backup JSON file. */
interface BackupData {
  backup_id?: string;
  created_at?: string;
  created_by?: string;
  type?: string;
  tables?: Record<string, { data: Record<string, unknown>[]; record_count: number }>;
}

// ============================================
// Helpers
// ============================================

const TABLES_TO_BACKUP = [
  "products",
  "categories",
  "orders",
  "order_items",
  "profiles",
  "admin_users",
  "system_config",
] as const;

/** FK-respecting restore order. */
const RESTORE_ORDER = [
  "categories",
  "profiles",
  "admin_users",
  "system_config",
  "products",
  "orders",
  "order_items",
] as const;

// ============================================
// Service
// ============================================

export class BackupService {
  constructor(private supabaseService: SupabaseClient) {}

  // ------------------------------------------
  // Public API
  // ------------------------------------------

  /**
   * List all available backups from Supabase Storage.
   */
  async listBackups(): Promise<{
    success: true;
    backups: BackupListItem[];
    count: number;
  }> {
    const { data: files, error: listError } = await this.supabaseService.storage
      .from("database-backups")
      .list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (listError) {
      console.error("Error listing backups:", listError);
      throw new Error("Error al listar backups");
    }

    const backups: BackupListItem[] = (files || []).map((file) => {
      const backupIdMatch = file.name.match(/^(backup_[^\.]+)/);
      const backupId = backupIdMatch
        ? backupIdMatch[1]
        : file.name.replace(".json", "");

      return {
        id: backupId,
        filename: file.name,
        size: file.metadata?.size || file.metadata?.size_bytes || 0,
        size_mb: (
          (file.metadata?.size || file.metadata?.size_bytes || 0) /
          1024 /
          1024
        ).toFixed(2),
        created_at: file.created_at,
        updated_at: file.updated_at,
        last_accessed_at: file.last_accessed_at,
      };
    });

    return { success: true, backups, count: backups.length };
  }

  /**
   * Get metadata and a signed download URL for a specific backup file.
   */
  async getBackupDetails(filename: string): Promise<BackupDetails> {
    const { data: backupFile, error: downloadError } =
      await this.supabaseService.storage
        .from("database-backups")
        .download(filename);

    if (downloadError || !backupFile) {
      throw new Error(
        `Error al descargar backup: ${downloadError?.message ?? "archivo no encontrado"}`,
      );
    }

    const backupText = await backupFile.text();
    let backupData: BackupData;
    try {
      backupData = JSON.parse(backupText) as BackupData;
    } catch {
      throw new BackupValidationError(
        "Error al parsear archivo de backup",
        "El archivo no es un JSON válido",
      );
    }

    const { data: fileInfo } = await this.supabaseService.storage
      .from("database-backups")
      .list("", { search: filename });

    const file = fileInfo?.[0];
    const fileSize = file?.metadata?.size || file?.metadata?.size_bytes || 0;

    const { data: signedUrlData, error: signedUrlError } =
      await this.supabaseService.storage
        .from("database-backups")
        .createSignedUrl(filename, 3600);

    if (signedUrlError) {
      console.error("Error creating signed URL:", signedUrlError);
    }

    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

    const totalRecords = backupData.tables
      ? Object.values(backupData.tables).reduce(
          (sum, table) => sum + (table.record_count || 0),
          0,
        )
      : 0;

    const tablesCount = backupData.tables
      ? Object.keys(backupData.tables).length
      : 0;

    return {
      success: true,
      backup_id: backupData.backup_id ?? filename.replace(".json", ""),
      backup_file: filename,
      download_url: signedUrlData?.signedUrl ?? null,
      download_url_expires_at: signedUrlData?.signedUrl ? expiresAt : null,
      tables_count: tablesCount,
      total_records: totalRecords,
      backup_size_mb: (fileSize / 1024 / 1024).toFixed(2),
      created_at: backupData.created_at ?? file?.created_at,
      created_by: backupData.created_by ?? "Unknown",
    };
  }

  /**
   * Restore a backup, optionally creating a safety backup first.
   * Passes `userSupabase` only for audit logging — all data ops use the service client.
   */
  async restoreBackup(
    params: RestoreParams,
    userSupabase: SupabaseClient,
    userEmail: string,
  ): Promise<RestoreResult> {
    const { backup_filename, create_safety_backup = true } = params;
    const restoreStartTime = new Date();

    console.log(
      `🔄 Starting backup restoration: ${backup_filename} by ${userEmail}`,
    );

    // Step 1: Optional safety backup
    let safetyBackupId: string | null = null;
    if (create_safety_backup) {
      safetyBackupId = await this.createSafetyBackup(userEmail);
    }

    // Step 2: Download the backup to restore
    const { data: backupFile, error: downloadError } =
      await this.supabaseService.storage
        .from("database-backups")
        .download(backup_filename);

    if (downloadError || !backupFile) {
      console.error("Error downloading backup:", downloadError);
      throw new Error(
        `Error al descargar backup: ${downloadError?.message ?? "archivo no encontrado"}`,
      );
    }

    // Step 3: Parse backup JSON
    const backupText = await backupFile.text();
    let backupData: BackupData;
    try {
      backupData = JSON.parse(backupText) as BackupData;
    } catch {
      throw new BackupValidationError(
        "Error al parsear archivo de backup",
        "El archivo no es un JSON válido",
      );
    }

    if (!backupData.tables) {
      throw new BackupValidationError(
        "Backup inválido",
        "El archivo de backup no contiene datos de tablas",
      );
    }

    // Step 4: Restore tables in FK-safe order
    const restoreResults: Record<string, TableRestoreResult> = {};
    let totalRestored = 0;
    let totalErrors = 0;

    for (const tableName of RESTORE_ORDER) {
      const tableEntry = backupData.tables[tableName];

      if (!tableEntry?.data) {
        restoreResults[tableName] = {
          status: "skipped",
          reason: "No data in backup",
        };
        continue;
      }

      const tableData = tableEntry.data;
      if (!Array.isArray(tableData) || tableData.length === 0) {
        restoreResults[tableName] = {
          status: "skipped",
          reason: "Empty table in backup",
        };
        continue;
      }

      try {
        const result = await this.restoreTable(tableName, tableData);
        restoreResults[tableName] = result;
        totalRestored += result.records_restored ?? 0;
        if (result.status === "error" || (result.errors ?? 0) > 0) {
          totalErrors++;
        }
      } catch (error) {
        console.error(`Error restoring table ${tableName}:`, error);
        restoreResults[tableName] = {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        };
        totalErrors++;
      }
    }

    const restoreEndTime = new Date();
    const restoreDuration =
      (restoreEndTime.getTime() - restoreStartTime.getTime()) / 1000;

    // Step 5: Audit log
    await userSupabase.rpc("log_admin_activity", {
      action: "maintenance_restore_database",
      resource_type: "system",
      resource_id: null,
      details: {
        action: "restore_database",
        backup_file: backup_filename,
        backup_id: backupData.backup_id,
        safety_backup_id: safetyBackupId,
        tables_restored: Object.keys(restoreResults).length,
        total_records_restored: totalRestored,
        errors: totalErrors,
        restore_results: restoreResults,
        duration_seconds: restoreDuration,
        initiated_by: userEmail,
      },
    });

    return {
      success: true,
      message: `Restauración completada: ${totalRestored} registros restaurados`,
      backup_file: backup_filename,
      backup_id: backupData.backup_id ?? backup_filename.replace(".json", ""),
      safety_backup_id: safetyBackupId,
      tables_restored: Object.keys(restoreResults).length,
      total_records_restored: totalRestored,
      errors: totalErrors,
      restore_results: restoreResults,
      duration_seconds: restoreDuration.toFixed(2),
    };
  }

  /**
   * Delete a backup file from storage.
   */
  async deleteBackup(
    filename: string,
    userSupabase: SupabaseClient,
    userEmail: string,
  ): Promise<{ success: true; message: string }> {
    console.log(`🗑️ Deleting backup: ${filename} by ${userEmail}`);

    const { error: deleteError } = await this.supabaseService.storage
      .from("database-backups")
      .remove([filename]);

    if (deleteError) {
      console.error("Error deleting backup:", deleteError);
      throw new Error(`Error al eliminar backup: ${deleteError.message}`);
    }

    await userSupabase.rpc("log_admin_activity", {
      action: "maintenance_delete_backup",
      resource_type: "system",
      resource_id: null,
      details: {
        action: "delete_backup",
        backup_file: filename,
        initiated_by: userEmail,
      },
    });

    return {
      success: true,
      message: `Backup ${filename} eliminado exitosamente`,
    };
  }

  // ------------------------------------------
  // Private helpers
  // ------------------------------------------

  /**
   * Takes a point-in-time snapshot of all tables and uploads it to storage.
   * Returns the safety backup ID.
   */
  private async createSafetyBackup(userEmail: string): Promise<string> {
    console.log("📦 Creating safety backup before restoration...");

    const startTime = new Date();
    const safetyBackupId = `safety_backup_${startTime.toISOString().replace(/[:.]/g, "-")}`;

    const safetyBackupData: BackupData = {
      backup_id: safetyBackupId,
      created_at: startTime.toISOString(),
      created_by: userEmail,
      type: "safety_backup_before_restore",
      tables: {},
    };

    for (const tableName of TABLES_TO_BACKUP) {
      const { data, error } = await this.supabaseService
        .from(tableName)
        .select("*");

      if (!error && data) {
        safetyBackupData.tables![tableName] = {
          data: data as Record<string, unknown>[],
          record_count: data.length,
        };
      }
    }

    const safetyBackupJson = JSON.stringify(safetyBackupData, null, 2);
    const safetyBackupBuffer = Buffer.from(safetyBackupJson, "utf-8");

    await this.supabaseService.storage
      .from("database-backups")
      .upload(`${safetyBackupId}.json`, safetyBackupBuffer, {
        contentType: "application/json",
        cacheControl: "3600",
        upsert: false,
      });

    console.log("✅ Safety backup created:", safetyBackupId);
    return safetyBackupId;
  }

  /**
   * Clears and re-inserts all rows for a single table.
   * Uses UPSERT for `products` (FK constraints), DELETE+INSERT for others.
   */
  private async restoreTable(
    tableName: string,
    tableData: Record<string, unknown>[],
  ): Promise<TableRestoreResult> {
    const DELETE_BATCH = 500;
    const INSERT_BATCH = 100;
    let deleteErrors = 0;
    let totalDeleted = 0;

    // --- Deletion phase ---
    if (tableName === "products") {
      const backupProductIds = tableData
        .map((row) => row.id)
        .filter((id) => id != null);

      if (backupProductIds.length > 0) {
        console.log(
          `Deleting ${backupProductIds.length} specific products from backup...`,
        );
        for (let i = 0; i < backupProductIds.length; i += DELETE_BATCH) {
          const batch = backupProductIds.slice(i, i + DELETE_BATCH);
          const { error } = await this.supabaseService
            .from(tableName)
            .delete()
            .in("id", batch);

          if (error) {
            console.error(`Error deleting specific products:`, error);
            deleteErrors++;
          } else {
            totalDeleted += batch.length;
          }
        }
      }
    } else {
      let hasMore = true;
      let offset = 0;
      const FETCH_LIMIT = 1000;

      while (hasMore) {
        const { data: existingData, error: fetchError } =
          await this.supabaseService
            .from(tableName)
            .select("id")
            .range(offset, offset + FETCH_LIMIT - 1);

        if (fetchError) {
          console.error(`Error fetching IDs from ${tableName}:`, fetchError);
          deleteErrors++;
          break;
        }

        if (!existingData || existingData.length === 0) {
          hasMore = false;
          break;
        }

        for (let i = 0; i < existingData.length; i += DELETE_BATCH) {
          const ids = existingData
            .slice(i, i + DELETE_BATCH)
            .map((row) => row.id)
            .filter((id) => id != null);

          if (ids.length > 0) {
            const { error } = await this.supabaseService
              .from(tableName)
              .delete()
              .in("id", ids);

            if (error) {
              console.error(`Error deleting batch from ${tableName}:`, error);
              deleteErrors++;
            } else {
              totalDeleted += ids.length;
            }
          }
        }

        hasMore = existingData.length === FETCH_LIMIT;
        offset += FETCH_LIMIT;
      }
    }

    console.log(
      `Deleted ${totalDeleted} records from ${tableName} before restore`,
    );

    // --- FK validation for products ---
    const mutableTableData = [...tableData];
    if (tableName === "products") {
      const categoryIds = [
        ...new Set(
          mutableTableData
            .map((row) => row.category_id)
            .filter((id) => id != null),
        ),
      ];

      if (categoryIds.length > 0) {
        const { data: existingCategories } = await this.supabaseService
          .from("categories")
          .select("id")
          .in("id", categoryIds);

        const existingCategoryIds = new Set(
          (existingCategories || []).map((c: { id: unknown }) => c.id),
        );

        const invalidCount = mutableTableData.filter(
          (row) => row.category_id && !existingCategoryIds.has(row.category_id),
        ).length;

        if (invalidCount > 0) {
          console.warn(
            `Found ${invalidCount} products with invalid category_id — setting to null.`,
          );
          mutableTableData.forEach((row) => {
            if (row.category_id && !existingCategoryIds.has(row.category_id)) {
              row.category_id = null;
            }
          });
        }
      }
    }

    // --- Insertion phase ---
    let inserted = 0;
    let insertErrors = 0;
    const errorDetails: string[] = [];
    const problematicRecords: Array<{
      record: Record<string, unknown>;
      error: string;
      details: string;
    }> = [];

    for (let i = 0; i < mutableTableData.length; i += INSERT_BATCH) {
      const rawBatch = mutableTableData.slice(i, i + INSERT_BATCH);

      const cleanBatch = rawBatch
        .map((row) => {
          const clean: Record<string, unknown> = {};
          for (const key of Object.keys(row)) {
            if (row[key] != null) clean[key] = row[key];
          }

          if (tableName === "products") {
            if (
              clean.status &&
              !["draft", "active", "archived"].includes(clean.status as string)
            ) {
              clean.status = "draft";
            }
            if (
              clean.inventory_policy &&
              !["continue", "deny"].includes(clean.inventory_policy as string)
            ) {
              clean.inventory_policy = "deny";
            }
            if (!clean.currency) clean.currency = "ARS";
            if (clean.track_inventory === undefined)
              clean.track_inventory = true;
            if (clean.inventory_quantity === undefined)
              clean.inventory_quantity = 0;
            if (clean.low_stock_threshold === undefined)
              clean.low_stock_threshold = 5;
            if (clean.is_featured === undefined) clean.is_featured = false;
            if (clean.is_digital === undefined) clean.is_digital = false;
            if (clean.requires_shipping === undefined)
              clean.requires_shipping = true;
          }

          return clean;
        })
        .filter((row) => Object.keys(row).length > 0);

      if (cleanBatch.length === 0) continue;

      const { error: batchError } =
        tableName === "products"
          ? await this.supabaseService
              .from(tableName)
              .upsert(cleanBatch, { onConflict: "id", ignoreDuplicates: false })
          : await this.supabaseService.from(tableName).insert(cleanBatch);

      if (!batchError) {
        inserted += cleanBatch.length;
        continue;
      }

      // Batch failed — retry one-by-one to isolate problematic rows
      console.error(`Error inserting batch into ${tableName}:`, batchError);
      errorDetails.push(
        batchError.message || batchError.code || "Unknown error",
      );

      if (cleanBatch.length > 1) {
        console.log(
          `Batch insert failed, trying one by one for ${tableName}...`,
        );
        for (const record of cleanBatch) {
          const { error: singleError } =
            tableName === "products"
              ? await this.supabaseService
                  .from(tableName)
                  .upsert(record, { onConflict: "id", ignoreDuplicates: false })
              : await this.supabaseService.from(tableName).insert(record);

          if (singleError) {
            insertErrors++;
            problematicRecords.push({
              record,
              error: singleError.message || singleError.code || "Unknown error",
              details: singleError.details || singleError.hint || "",
            });
            console.error(
              `Failed to insert record in ${tableName}:`,
              singleError,
            );
          } else {
            inserted++;
          }
        }
      } else {
        insertErrors++;
        problematicRecords.push({
          record: cleanBatch[0],
          error: batchError.message || batchError.code || "Unknown error",
          details: batchError.details || batchError.hint || "",
        });
      }
    }

    // --- Determine final status ---
    const allRestored = inserted === mutableTableData.length;
    const hasInsertErrors = insertErrors > 0;

    let status: TableRestoreResult["status"];
    if (allRestored && !hasInsertErrors) {
      status = "success";
    } else if (inserted > 0) {
      status = "partial";
    } else {
      status = "error";
    }

    return {
      status,
      records_restored: inserted,
      records_total: mutableTableData.length,
      errors: insertErrors,
      delete_errors: deleteErrors,
      error_message:
        errorDetails.length > 0 && hasInsertErrors
          ? errorDetails[0]
          : undefined,
      problematic_records:
        problematicRecords.length > 0
          ? problematicRecords.slice(0, 3)
          : undefined,
      note:
        deleteErrors > 0 && allRestored && !hasInsertErrors
          ? "Restauración exitosa. Algunos registros no se pudieron eliminar antes de restaurar (probablemente por referencias), pero se actualizaron correctamente."
          : undefined,
    };
  }
}
