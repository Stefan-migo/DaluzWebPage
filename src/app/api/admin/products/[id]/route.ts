import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from '@/lib/auth/helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const serviceClient = getServiceClient();

    const { data: product, error } = await serviceClient
      .from("products")
      .select(`
        *,
        categories:category_id (
          id,
          name,
          slug
        ),
        product_variants (
          id,
          title,
          price,
          inventory_quantity,
          option1,
          option2,
          option3,
          is_default
        )
      `)
      .eq("id", params.id)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Admin products [id] GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const serviceClient = getServiceClient();
    
    // Safety: Remove sensitive or non-updatable fields
    const { id, created_at, ...updateData } = body;

    const { data: updatedProduct, error } = await serviceClient
      .from("products")
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      return NextResponse.json(
        { error: "Failed to update product" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Admin products [id] PUT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const serviceClient = getServiceClient();

    // Verify existence
    const { data: existing, error: checkError } = await serviceClient
      .from("products")
      .select("id, name")
      .eq("id", params.id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete variants first
    const { error: variantsError } = await serviceClient
      .from("product_variants")
      .delete()
      .eq("product_id", params.id);

    if (variantsError) {
      console.error("Error deleting variants:", variantsError);
    }

    // Delete the product
    const { error: deleteError } = await serviceClient
      .from("products")
      .delete()
      .eq("id", params.id);

    if (deleteError) {
      console.error("Error deleting product:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete product" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Product ${existing.name} deleted successfully`
    });
  } catch (error) {
    console.error("Admin products [id] DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
