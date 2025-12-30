import Link from "next/link"
import { ArrowRight, CheckCircle2, Factory, ShieldCheck, Truck, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CosImage } from "@/components/ui/cos-image"
import { getSiteConfig } from "@/lib/site-config"
import categoriesData from "@/data/categories.json"
import { getAllProducts, type Product } from "@/lib/products"
import { MobileQuickActions } from "@/components/layout/mobile-quick-actions"

export default async function Home() {
  const config = await getSiteConfig();
  const allProducts = await getAllProducts();
  const publishedProducts = allProducts.filter(p => p.isPublished);
  
  type CategoryWithProducts = typeof categoriesData[0] & { products: Product[] };
  
  const categories: CategoryWithProducts[] = categoriesData.map(category => ({
    ...category,
    products: publishedProducts
      .filter(p => p.categoryId === category.id)
      .slice(0, 3)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  })).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="relative bg-slate-900 py-12 sm:py-16 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 sm:mb-6">
            专业水处理材料
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>
            一站式供应商
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            专注净水领域20年，提供聚氯化铝、活性炭、滤料等全系列水处理产品。
            源头工厂，品质保证。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-base sm:text-lg h-11 sm:h-12 px-6 sm:px-8 bg-transparent text-white border-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/products">浏览产品</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-base sm:text-lg h-11 sm:h-12 px-6 sm:px-8 bg-transparent text-white border-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/contact">联系我们</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <Card className="border-none shadow-md">
              <CardHeader className="pb-3">
                <Factory className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
                <CardTitle className="text-lg sm:text-xl">源头工厂</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground">
                  自有生产基地，省去中间环节，为您提供最具竞争力的价格。
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md">
              <CardHeader className="pb-3">
                <ShieldCheck className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
                <CardTitle className="text-lg sm:text-xl">品质保证</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground">
                  严格执行国家标准，每批次产品均经过实验室检测，确保质量稳定。
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md">
              <CardHeader className="pb-3">
                <Truck className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
                <CardTitle className="text-lg sm:text-xl">闪电发货</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground">
                  常备库存充足，专业物流团队，确保货物快速安全送达。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-8 sm:py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">核心产品系列</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              我们提供全方位的水处理解决方案，满足工业废水、生活饮用水等多种场景需求。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group"
              >
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/30 active:scale-[0.98] overflow-hidden">
                  <CardHeader className="p-4 pb-3 border-b bg-gradient-to-br from-slate-50/50 to-transparent">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base group-hover:text-primary transition-colors line-clamp-1 flex-1">
                        {category.name}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {category.products.length}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5">
                      {category.description}
                    </p>
                  </CardHeader>
                  <CardContent className="p-3 space-y-2">
                    {/* 产品列表 - 最多显示3个 */}
                    {category.products.slice(0, 3).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 transition-colors group/item"
                      >
                        {/* 产品缩略图 120x120 */}
                        {product.images && product.images.length > 0 ? (
                          <div className="relative w-[60px] h-[60px] flex-shrink-0 rounded overflow-hidden bg-slate-100 border border-slate-200 ring-1 ring-black/5">
                            <CosImage
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="w-[60px] h-[60px] flex-shrink-0 rounded bg-slate-100 border border-slate-200 flex items-center justify-center">
                            <Package className="h-6 w-6 text-slate-400" />
                          </div>
                        )}
                        
                        {/* 产品名称 */}
                        <span className="text-sm text-slate-700 group-hover/item:text-primary transition-colors line-clamp-2 flex-1 leading-snug">
                          {product.name}
                        </span>
                      </div>
                    ))}
                    
                    {/* 更多产品提示 */}
                    {category.products.length > 3 && (
                      <div className="text-xs text-primary/70 pt-1 px-2 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-primary/50"></span>
                        还有 {category.products.length - 3} 个产品
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link href="/products" className="group">
                查看所有产品
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-8 sm:py-12 md:py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">
                关于 {config.brandName}
              </h2>
              <p className="text-sm sm:text-base text-slate-200 mb-4 sm:mb-6 leading-relaxed">
                {config.companyName}
                集科研、生产、经营、服务于一体，是从事水处理剂的开发、生产、经营及从事水处理工程的设计、研发、运营及各类废水，噪音治理的专业企业。
              </p>
              <p className="text-sm sm:text-base text-slate-200 mb-6 sm:mb-8 leading-relaxed">
                本公司与多所高等院校及化工科研单位合作，研制生产出"田邦""中禹"牌絮凝剂系列产品：聚氯化铝、聚氯化铝铁等，并提供聚丙烯酰胺和具有阻垢、分散、缓蚀、杀菌、除油，混凝等多种性能的几十种药剂。
              </p>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/about">了解更多</Link>
              </Button>
            </div>
            <div className="relative h-48 sm:h-64 md:h-96 bg-slate-800 rounded-lg overflow-hidden">
              {/* Placeholder for factory image */}
              <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                <Factory className="h-16 w-16 sm:h-20 sm:w-20 opacity-20" />
                <span className="sr-only">Factory Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Quick Actions */}
      <MobileQuickActions siteConfig={config} />
    </div>
  );
}
