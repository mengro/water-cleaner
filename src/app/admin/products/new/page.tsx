import { ProductForm } from "@/components/admin/product-form";
import categoriesJson from "@/data/categories.json";

export default async function NewProductPage() {
  const categories = [...categoriesJson].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">新增产品</h1>
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
