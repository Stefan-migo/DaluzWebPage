import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createServiceRoleClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Verify user is authenticated
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {
            // API routes don't set cookies
          },
        },
      },
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized: Authentication required" },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 },
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 },
      );
    }

    // Use the service role client for uploads
    const supabaseAdmin = createServiceRoleClient();

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Try different bucket names in order of preference
    const bucketNames = ["product-images", "images", "uploads", "public"];
    let uploadResult = null;
    let bucketUsed = null;

    for (const bucketName of bucketNames) {
      const { data, error } = await supabaseAdmin.storage
        .from(bucketName)
        .upload(filePath, buffer, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (!error) {
        uploadResult = data;
        bucketUsed = bucketName;
        break;
      } else {
        console.log(`Bucket ${bucketName} not available:`, error.message);
      }
    }

    if (!uploadResult) {
      console.error("No available storage buckets found");
      return NextResponse.json(
        {
          error:
            "No storage buckets available. Please configure storage in Supabase.",
          availableBuckets: bucketNames,
        },
        { status: 500 },
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucketUsed!)
      .getPublicUrl(uploadResult.path);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: uploadResult.path,
      bucket: bucketUsed,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
