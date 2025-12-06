import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } })
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">编辑产品</h1>
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <ProductForm categories={categories} initialData={product} />
      </div>
    </div>
  );
}
