import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CosImage } from "@/components/ui/cos-image"
import { Package } from "lucide-react"
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
            {/* 分类标题 */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold">{category.name}</h2>
                <Badge variant="secondary" className="text-xs">
                  {category.products.length} 个产品
                </Badge>
              </div>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{category.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="group">
                  <Card className="h-full hover:shadow-md hover:border-primary/30 transition-all duration-200 active:scale-[0.98] overflow-hidden">
                    <div className="flex gap-3 p-3">
                      {/* 产品图片 120x120 */}
                      <div className="relative w-[120px] h-[120px] flex-shrink-0 bg-gradient-to-br from-slate-50 to-slate-100 rounded overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <>
                            <CosImage
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* 悬停遮罩 */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-12 w-12 text-slate-300 group-hover:text-slate-400 transition-colors" />
                          </div>
                        )}
                        
                        {/* 多图标识 */}
                        {product.images && product.images.length > 1 && (
                          <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                            {product.images.length}
                          </div>
                        )}
                      </div>
                      
                      {/* 产品信息 */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
              {category.products.length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-3">
                    <Package className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">该分类下暂无产品</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
