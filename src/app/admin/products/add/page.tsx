import ProductForm from "@/components/admin/products/ProductForm";

export const metadata = {
  title: "Agregar Producto | Admin DaLuz",
  description: "Agregar nuevo producto al catálogo",
};

export default function AddProductPage() {
  return <ProductForm mode="add" />;
}
