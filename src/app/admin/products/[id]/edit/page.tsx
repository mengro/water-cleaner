import { ProductForm } from "@/components/admin/product-form";
import { notFound } from "next/navigation";
import categoriesJson from "@/data/categories.json";
import { getProductById } from "@/lib/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }
  
  const categories = [...categoriesJson].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">编辑产品</h1>
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <ProductForm categories={categories} initialData={product} />
      </div>
    </div>
  );
}
