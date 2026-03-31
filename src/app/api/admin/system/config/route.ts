import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceRoleClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";
    const public_only = searchParams.get("public_only") === "true";

    const supabase = await createClient();

    // Check admin authorization
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const { data: isAdmin } = await supabase.rpc("is_admin", {
      user_id: user.id,
    });
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    // Build the query
    let query = supabase.from("system_config").select("*");

    // Apply basic filters
    if (public_only) {
      query = query.eq("is_public", true);
    }

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data: configs, error } = await query
      .order("category", { ascending: true })
      .order("config_key", { ascending: true });

    if (error) {
      console.error("Error fetching system config:", error);
      return NextResponse.json(
        { error: "Failed to fetch system config" },
        { status: 500 },
      );
    }

    // Parse JSON values safely
    const parsedConfigs =
      configs?.map((config) => {
        let parsedValue = config.config_value;

        // Try to parse as JSON if it's a string
        if (typeof config.config_value === "string") {
          try {
            parsedValue = JSON.parse(config.config_value);
          } catch {
            // If JSON parsing fails, keep the original string value
            parsedValue = config.config_value;
          }
        }

        return {
          ...config,
          config_value: parsedValue,
        };
      }) || [];

    return NextResponse.json({ configs: parsedConfigs });
  } catch (error) {
    console.error("Error in system config API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      config_key,
      config_value,
      description,
      category = "general",
      is_public = false,
      is_sensitive = false,
      value_type = "string",
      validation_rules,
    } = body;

    const supabase = await createClient();

    // Check admin authorization (only super admin can create config)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const { data: isAdmin } = await supabase.rpc("is_admin", {
      user_id: user.id,
    });
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    // Validate input
    if (!config_key || config_value === undefined) {
      return NextResponse.json(
        {
          error: "Config key and value are required",
        },
        { status: 400 },
      );
    }

    // Validate value type
    const validTypes = ["string", "number", "boolean", "json", "array"];
    if (!validTypes.includes(value_type)) {
      return NextResponse.json(
        { error: "Invalid value type" },
        { status: 400 },
      );
    }

    // Create the config
    const { data: config, error: configError } = await supabase
      .from("system_config")
      .insert({
        config_key,
        config_value: JSON.stringify(config_value),
        description,
        category,
        is_public,
        is_sensitive,
        value_type,
        validation_rules: validation_rules
          ? JSON.stringify(validation_rules)
          : null,
        last_modified_by: user.id,
      })
      .select()
      .single();

    if (configError) {
      console.error("Error creating system config:", configError);
      return NextResponse.json(
        { error: "Failed to create system config" },
        { status: 500 },
      );
    }

    // Parse the config value safely
    let parsedConfigValue = config.config_value;
    try {
      parsedConfigValue = JSON.parse(config.config_value);
    } catch {
      // Keep original string value if parsing fails
    }

    return NextResponse.json({
      config: {
        ...config,
        config_value: parsedConfigValue,
      },
    });
  } catch (error) {
    console.error("Error in create system config API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updates = body.updates;

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Updates must be an array" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Check admin authorization
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const { data: isAdmin } = await supabase.rpc("is_admin", {
      user_id: user.id,
    });
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const results = [];

    for (const update of updates) {
      const { config_key, config_value } = update;

      if (!config_key || config_value === undefined) {
        results.push({ config_key, error: "Key and value are required" });
        continue;
      }

      try {
        // Get existing config to check permissions
        const { data: existingConfig, error: checkError } = await supabase
          .from("system_config")
          .select("is_sensitive, category, value_type")
          .eq("config_key", config_key)
          .maybeSingle();

        if (checkError) {
          results.push({
            config_key,
            error: `Failed to check config: ${checkError.message}`,
          });
          continue;
        }

        // Determine if config is sensitive (for new configs, infer from key)
        const isSensitive =
          existingConfig?.is_sensitive ??
          (config_key.includes("token") ||
            config_key.includes("secret") ||
            config_key.includes("key"));

        // For sensitive configs, use service role client to bypass RLS
        const dbClient = isSensitive ? createServiceRoleClient() : supabase;

        // If config doesn't exist, create it (upsert behavior)
        if (!existingConfig) {
          // Determine category and value type from config_key
          let category = "general";
          let valueType = "string";
          let configIsSensitive =
            config_key.includes("token") ||
            config_key.includes("secret") ||
            config_key.includes("key");

          if (config_key.startsWith("mercadopago_")) {
            category = "payments";
            if (
              config_key.includes("test_mode") ||
              config_key.includes("auto_return") ||
              config_key.includes("binary_mode")
            ) {
              valueType = "boolean";
              configIsSensitive = false;
            } else if (config_key.includes("max_installments")) {
              valueType = "number";
              configIsSensitive = false;
            } else if (config_key.includes("payment_methods")) {
              valueType = "array";
              configIsSensitive = false;
            }
            if (
              config_key.includes("test_access_token") ||
              config_key.includes("test_public_key") ||
              config_key.includes("test_webhook_secret")
            ) {
              configIsSensitive = true;
            }
          }

          // Create the config (use service role client for sensitive configs)
          const insertClient = configIsSensitive
            ? createServiceRoleClient()
            : supabase;
          const { data: newConfig, error: createError } = await insertClient
            .from("system_config")
            .insert({
              config_key,
              config_value: JSON.stringify(config_value),
              category,
              value_type: valueType,
              is_sensitive: configIsSensitive,
              last_modified_by: user.id,
            })
            .select()
            .single();

          if (createError) {
            results.push({
              config_key,
              error: `Failed to create config: ${createError.message}`,
            });
            continue;
          }

          // Parse the created config value safely
          let parsedValue = newConfig.config_value;
          try {
            parsedValue = JSON.parse(newConfig.config_value);
          } catch {
            // Keep original string value if parsing fails
          }

          results.push({
            config_key,
            success: true,
            config: {
              ...newConfig,
              config_value: parsedValue,
            },
          });
          continue;
        }

        // Update the config (use service role client for sensitive configs to bypass RLS)
        const { data: updatedConfig, error: updateError } = await dbClient
          .from("system_config")
          .update({
            config_value: JSON.stringify(config_value),
            last_modified_by: user.id,
            updated_at: new Date().toISOString(),
          })
          .eq("config_key", config_key)
          .select()
          .maybeSingle();

        if (updateError) {
          results.push({ config_key, error: updateError.message });
          continue;
        }

        if (!updatedConfig) {
          results.push({
            config_key,
            error: "Config not found or could not be updated",
          });
          continue;
        }

        // Parse the updated config value safely
        let parsedUpdatedValue = updatedConfig.config_value;
        try {
          parsedUpdatedValue = JSON.parse(updatedConfig.config_value);
        } catch {
          // Keep original string value if parsing fails
        }

        results.push({
          config_key,
          success: true,
          config: {
            ...updatedConfig,
            config_value: parsedUpdatedValue,
          },
        });
      } catch (error) {
        results.push({ config_key, error: `Unexpected error: ${error}` });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error in update system config API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
