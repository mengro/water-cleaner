import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">新增产品</h1>
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
