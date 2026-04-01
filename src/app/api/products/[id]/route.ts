import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const supabase = createServiceRoleClient();
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const includeArchived = searchParams.get("include_archived") === "true";

    // Check if this is an admin request
    let isAdminRequest = false;
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: isAdmin } = await (supabase as any).rpc("is_admin", {
          user_id: user.id,
        });
        isAdminRequest = isAdmin;
      }
    } catch (error) {
      // If auth check fails, treat as non-admin request
      console.log("Auth check failed, treating as non-admin request");
    }

    let query = supabase
      .from("products")
      .select(
        `
        *,
        categories:category_id (
          id,
          name,
          slug,
          description
        ),
        product_variants (
          id,
          title,
          price,
          compare_at_price,
          inventory_quantity,
          weight,
          barcode,
          image_url,
          option1,
          option2,
          option3,
          position,
          is_default
        )
      `,
      )
      .eq("id", id);

    // Only filter by active status for non-admin requests or when not explicitly including archived
    if (!isAdminRequest && !includeArchived) {
      query = query.eq("status", "active");
    }

    const { data: product, error } = await query.single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }
      console.error("Error fetching product:", error);
      return NextResponse.json(
        { error: "Failed to fetch product" },
        { status: 500 },
      );
    }

    // Fetch review data for the product
    const { data: reviews } = await supabase
      .from("reviews" as any)
      .select("rating")
      .eq("product_id", product.id)
      .eq("is_approved", true);

    const reviewCount = reviews?.length || 0;
    const averageRating =
      reviewCount > 0 && reviews
        ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) /
          reviewCount
        : 0;

    // Add review data to product
    const productWithReviews = {
      ...product,
      reviewCount,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    };

    return NextResponse.json({ product: productWithReviews });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const supabase = createServiceRoleClient();
    const { id } = params;
    const body = await request.json();

    // Validate required fields
    if (
      !body.name ||
      !body.price ||
      body.inventory_quantity === undefined ||
      body.inventory_quantity === null
    ) {
      return NextResponse.json(
        { error: "Missing required fields: name, price, inventory_quantity" },
        { status: 400 },
      );
    }

    // Validate category_id if provided (must be valid UUID or null)
    if (
      body.category_id &&
      body.category_id !== null &&
      body.category_id !== ""
    ) {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(body.category_id)) {
        return NextResponse.json(
          {
            error: "Invalid category_id format. Must be a valid UUID or null.",
          },
          { status: 400 },
        );
      }
    }

    // Log the incoming data for debugging
    console.log("📝 Updating product with data:", {
      id,
      body: JSON.stringify(body, null, 2),
    });

    // Update the product - only include fields that exist in the database
    const updateData: any = {
      name: body.name,
      slug: body.slug,
      short_description: body.short_description,
      description: body.description,
      price: body.price,
      compare_at_price: body.compare_at_price,
      category_id:
        body.category_id && body.category_id !== "" ? body.category_id : null,
      sku: body.sku,
      inventory_quantity: body.inventory_quantity,
      weight: body.weight,
      dimensions: body.dimensions,
      package_characteristics: body.package_characteristics,
      featured_image: body.featured_image,
      gallery: body.gallery || [],
      skin_type: body.skin_type,
      benefits: body.benefits,
      certifications: body.certifications,
      ingredients: body.ingredients,
      usage_instructions: body.usage_instructions,
      precautions: body.precautions,
      is_featured: body.is_featured,
      status: body.status,
      updated_at: new Date().toISOString(),
      // Nuevos campos de la migración
      promotional_tag: body.promotional_tag || "none",
      discount_transfer_percent: body.discount_transfer_percent
        ? parseFloat(body.discount_transfer_percent)
        : null,
      discount_cash_percent: body.discount_cash_percent
        ? parseFloat(body.discount_cash_percent)
        : null,
      access_id: body.access_id || null,
    };

    // Remove any undefined or null values that might cause issues
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    console.log("📝 Cleaned update data:", JSON.stringify(updateData, null, 2));

    const { data: product, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("❌ Error updating product:", error);
      console.error("❌ Error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return NextResponse.json(
        {
          error: "Failed to update product",
          details: error.message,
          code: error.code,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const supabase = createServiceRoleClient();
    const { id } = params;

    // Check if product exists
    const { data: existingProduct, error: checkError } = await supabase
      .from("products")
      .select("id, name")
      .eq("id", id)
      .single();

    if (checkError) {
      if (checkError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }
      console.error("Error checking product:", checkError);
      return NextResponse.json(
        { error: "Failed to check product" },
        { status: 500 },
      );
    }

    // Soft delete: Update status to 'archived' instead of hard delete
    // This preserves order history and prevents issues with foreign key references
    const { data: product, error } = await supabase
      .from("products")
      .update({
        status: "archived",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json(
        { error: "Failed to delete product", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Product deleted successfully",
      product: {
        id: product.id,
        name: existingProduct.name,
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
