import ProductForm from "@/components/admin/products/ProductForm";
import { Suspense } from "react";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditProductPageProps) {
  const resolvedParams = await params;
  return {
    title: `Editar Producto | Admin DaLuz`,
    description: "Editar producto del catálogo",
  };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-[#E5DFD3] rounded w-64"></div>
            <div className="h-96 bg-[#E5DFD3] rounded"></div>
          </div>
        </div>
      }
    >
      <ProductForm mode="edit" productId={productId} />
    </Suspense>
  );
}
