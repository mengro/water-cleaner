import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { getAllProducts } from "@/lib/products"
import categoriesJson from "@/data/categories.json"

export default async function ProductsPage() {
  const allProducts = await getAllProducts();
  const publishedProducts = allProducts.filter(p => p.isPublished);
  
  const categories = categoriesJson
    .map(category => ({
      ...category,
      products: publishedProducts
        .filter(p => p.categoryId === category.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4 pb-24 md:pb-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">产品中心</h1>
      <div className="space-y-8 sm:space-y-12">
        {categories.map((category) => (
          <div key={category.id} id={category.id} className="scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{category.name}</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{category.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {category.products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all active:scale-[0.98]">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base sm:text-lg">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {product.description || "暂无描述"}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {category.products.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-full py-8 text-center">该分类下暂无产品</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
