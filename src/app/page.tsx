import Link from "next/link"
import { ArrowRight, CheckCircle2, Factory, ShieldCheck, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import siteConfigData from "@/config/site-config.json"
import categoriesData from "@/data/categories.json"
import { getAllProducts, type Product } from "@/lib/products"

export default async function Home() {
  const config = siteConfigData;
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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-slate-900 py-16 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            专业水处理材料
            <br className="md:hidden" />
            一站式供应商
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            专注净水领域20年，提供聚氯化铝、活性炭、滤料等全系列水处理产品。
            源头工厂，品质保证。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-8 sm:px-0">
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg h-12 px-8 bg-transparent text-white border-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/products">浏览产品</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg h-12 px-8 bg-transparent text-white border-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/contact">联系我们</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="border-none shadow-md">
              <CardHeader>
                <Factory className="h-10 w-10 text-primary mb-2" />
                <CardTitle>源头工厂</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  自有生产基地，省去中间环节，为您提供最具竞争力的价格。
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md">
              <CardHeader>
                <ShieldCheck className="h-10 w-10 text-primary mb-2" />
                <CardTitle>品质保证</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  严格执行国家标准，每批次产品均经过实验室检测，确保质量稳定。
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md">
              <CardHeader>
                <Truck className="h-10 w-10 text-primary mb-2" />
                <CardTitle>闪电发货</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  常备库存充足，专业物流团队，确保货物快速安全送达。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl font-bold mb-4">核心产品系列</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
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
                <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    <ul className="space-y-2">
                      {category.products.map((product) => (
                        <li
                          key={product.id}
                          className="flex items-center text-sm text-slate-600"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-2 text-primary/60" />
                          {product.name}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/products" className="group">
                查看所有产品
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-12 md:py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">
                关于 {config.brandName}
              </h2>
              <p className="text-slate-200 mb-6 leading-relaxed">
                {config.companyName}
                集科研、生产、经营、服务于一体，是从事水处理剂的开发、生产、经营及从事水处理工程的设计、研发、运营及各类废水，噪音治理的专业企业。
              </p>
              <p className="text-slate-200 mb-8 leading-relaxed">
                本公司与多所高等院校及化工科研单位合作，研制生产出“田邦”“中禹”牌絮凝剂系列产品：聚氯化铝、聚氯化铝铁等，并提供聚丙烯酰胺和具有阻垢、分散、缓蚀、杀菌、除油，混凝等多种性能的几十种药剂。
              </p>
              <Button asChild>
                <Link href="/about">了解更多</Link>
              </Button>
            </div>
            <div className="relative h-64 md:h-96 bg-slate-800 rounded-lg overflow-hidden">
              {/* Placeholder for factory image */}
              <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                <Factory className="h-20 w-20 opacity-20" />
                <span className="sr-only">Factory Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
