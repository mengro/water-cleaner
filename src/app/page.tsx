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

// 强制动态渲染，确保每次请求都从 COS 读取最新数据
export const dynamic = 'force-dynamic';

export default async function Home() {
  const config = await getSiteConfig();
  const allProducts = await getAllProducts();
  const publishedProducts = allProducts.filter(p => p.isPublished);
  
  type CategoryWithProducts = typeof categoriesData[0] & { products: Product[] };
  
  const categories: CategoryWithProducts[] = categoriesData.map(category => ({
    ...category,
    products: publishedProducts
      .filter(p => p.categoryIds?.includes(category.id))
      .slice(0, 3)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  })).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      {/* Hero Section - 工业风大图背景 */}
      <section className="relative bg-slate-900 py-12 sm:py-16 md:py-24 overflow-hidden">
        {/* 背景图片层 */}
        {publishedProducts.length > 0 && publishedProducts[0].images && publishedProducts[0].images.length > 0 ? (
          <div className="absolute inset-0">
            <CosImage
              src={publishedProducts[0].images[0]}
              alt="产品背景"
              className="w-full h-full object-cover"
            />
            {/* 深色遮罩 - 确保文字可读 */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/70" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-cyan-600/20" />
        )}

        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 sm:mb-8 drop-shadow-lg">
            专业水处理材料
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>
            <span className="text-red-500">一站式供应商</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-200 mb-8 sm:mb-10 max-w-3xl mx-auto px-4 leading-relaxed drop-shadow-md">
            专注净水领域20年，提供聚氯化铝、活性炭、滤料等全系列水处理产品。<br className="hidden sm:block" />
            <span className="text-red-400 font-semibold">源头工厂</span>，品质保证。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4 sm:px-0">
            <Button
              size="lg"
              asChild
              className="text-base sm:text-lg h-12 sm:h-14 px-8 sm:px-10 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/contact">立即咨询</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-base sm:text-lg h-12 sm:h-14 px-8 sm:px-10 bg-transparent text-white border-2 border-white hover:bg-white hover:text-slate-900 font-semibold"
            >
              <Link href="/products">浏览产品</Link>
            </Button>
          </div>

          {/* 联系方式 */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-white/90">
            <div className="flex items-center gap-2 text-base sm:text-lg">
              <span className="drop-shadow-md">📞</span>
              <span className="drop-shadow-md font-medium">咨询热线：{config.tel}</span>
            </div>
            {config.email && (
              <>
                <div className="hidden sm:block w-px h-6 bg-white/30"></div>
                <div className="flex items-center gap-2 text-base sm:text-lg">
                  <span className="drop-shadow-md">✉️</span>
                  <span className="drop-shadow-md">{config.email}</span>
                </div>
              </>
            )}
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
                        {/* 产品缩略图 - 增大到120x120 */}
                        {product.images && product.images.length > 0 ? (
                          <div className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] flex-shrink-0 rounded overflow-hidden bg-slate-100 border border-slate-200 ring-1 ring-black/5">
                            <CosImage
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] flex-shrink-0 rounded bg-slate-100 border border-slate-200 flex items-center justify-center">
                            <Package className="h-8 w-8 text-slate-400" />
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

      {/* Features Section - 选择我们的理由 */}
      <section className="py-8 sm:py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">为什么选择我们</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              专业、可靠、高效，为您提供最优质的服务体验
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
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
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
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
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
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

      {/* 推荐产品区块 - 工业风大容量展示（16-20个产品） */}
      <section className="py-8 sm:py-12 md:py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">热销推荐产品</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              精选热销产品，品质保证，深受客户信赖
            </p>
          </div>

          {/* 显示前16个产品，如果产品数量多于16个则显示更多 */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
            {publishedProducts.slice(0, 16).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
              >
                <Card className="h-full transition-all hover:shadow-lg hover:border-primary/30 active:scale-[0.98] overflow-hidden">
                  <div className="aspect-square bg-slate-100 relative overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <CosImage
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-16 w-16 text-slate-300" />
                      </div>
                    )}
                    {/* 热销标签 */}
                    <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                      热销
                    </Badge>
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/products" className="group">
                查看更多产品
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 客户案例区块 - 参考霍尔德的成功案例 */}
      <section className="py-8 sm:py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">客户案例</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              服务数千家企业，值得信赖的水处理材料供应商
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: "某市政污水处理厂",
                description: "使用我司聚氯化铝产品，日处理量5万吨，出水水质稳定达标。",
                category: "市政工程"
              },
              {
                title: "某大型造纸企业",
                description: "采购聚丙烯酰胺系列产品，解决废水处理难题，降低运营成本30%。",
                category: "工业废水"
              },
              {
                title: "某自来水公司",
                description: "长期供应活性炭滤料，提升饮用水质量，获得客户一致好评。",
                category: "饮用水处理"
              },
              {
                title: "某化工园区",
                description: "提供全套水处理解决方案，实现废水零排放，通过环保验收。",
                category: "工业园区"
              },
              {
                title: "某印染企业",
                description: "定制化絮凝剂方案，COD去除率提升至95%以上，达标排放。",
                category: "印染废水"
              },
              {
                title: "某电镀厂",
                description: "专业重金属处理方案，使用聚合氯化铝铁，水质稳定达标。",
                category: "电镀废水"
              }
            ].map((caseItem, index) => (
              <Card key={index} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{caseItem.category}</Badge>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <CardTitle className="text-lg">{caseItem.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {caseItem.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link href="/contact">
                联系我们，获取解决方案
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 资质荣誉区块 - 参考"参考1"的证书展示 */}
      <section className="py-8 sm:py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">资质荣誉</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              专业资质认证，品质保证，值得信赖
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                title: "质量管理体系认证",
                description: "ISO9001:2015",
                icon: "🏆",
                category: "体系认证"
              },
              {
                title: "环境管理体系认证",
                description: "ISO14001:2015",
                icon: "🌿",
                category: "体系认证"
              },
              {
                title: "职业健康安全管理体系",
                description: "ISO45001:2018",
                icon: "🛡️",
                category: "体系认证"
              },
              {
                title: "高新技术企业证书",
                description: "国家级高新技术企业",
                icon: "⭐",
                category: "企业荣誉"
              },
              {
                title: "产品质量检测报告",
                description: "国家权威机构检测",
                icon: "📋",
                category: "产品认证"
              },
              {
                title: "环保产品认证",
                description: "中国环境保护产品认证",
                icon: "♻️",
                category: "产品认证"
              },
              {
                title: "实用新型专利",
                description: "多项水处理技术专利",
                icon: "💡",
                category: "知识产权"
              },
              {
                title: "行业领先企业",
                description: "水处理行业协会会员",
                icon: "🎖️",
                category: "行业荣誉"
              }
            ].map((cert, index) => (
              <Card key={index} className="transition-all hover:shadow-md text-center">
                <CardHeader className="pb-3">
                  <div className="text-4xl sm:text-5xl mb-3">{cert.icon}</div>
                  <Badge variant="outline" className="mb-2 mx-auto w-fit">
                    {cert.category}
                  </Badge>
                  <CardTitle className="text-base sm:text-lg line-clamp-1">
                    {cert.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {cert.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link href="/contact">
                了解更多认证信息
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 工厂实景/企业实力展示 - 参考"参考1" */}
      <section className="py-8 sm:py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">企业实力</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              自有生产基地，专业研发团队，现代化仓储物流
            </p>
          </div>

          {/* 使用产品图片展示企业实力 */}
          {publishedProducts.length >= 3 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
              {publishedProducts.slice(0, 3).map((product, index) => (
                <div key={product.id} className="relative group overflow-hidden rounded-lg shadow-md">
                  <div className="aspect-[4/3] bg-slate-100">
                    {product.images && product.images.length > 0 ? (
                      <CosImage
                        src={product.images[0]}
                        alt={`企业实力 ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Factory className="h-16 w-16 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-semibold text-lg mb-1">
                        {index === 0 ? "生产基地" : index === 1 ? "研发中心" : "仓储物流"}
                      </h3>
                      <p className="text-sm text-white/80">
                        {index === 0 && "现代化生产车间，日产能500吨"}
                        {index === 1 && "专业研发团队，持续技术创新"}
                        {index === 2 && "智能仓储系统，快速响应发货"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 如果产品不够3个，使用占位符 */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
              {[0, 1, 2].map((index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg shadow-md bg-slate-100 aspect-[4/3] flex items-center justify-center">
                  <Factory className="h-16 w-16 text-slate-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-slate-600">
                    <h3 className="font-semibold text-lg mb-1">
                      {index === 0 ? "生产基地" : index === 1 ? "研发中心" : "仓储物流"}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {index === 0 && "现代化生产车间"}
                      {index === 1 && "专业研发团队"}
                      {index === 2 && "智能仓储系统"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 企业实力数据 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8">
            {[
              { value: "20+", label: "年行业经验", icon: "🎖️" },
              { value: "5000+", label: "服务客户", icon: "👥" },
              { value: "100+", label: "产品品种", icon: "📦" },
              { value: "50+", label: "专利技术", icon: "💡" }
            ].map((stat, index) => (
              <Card key={index} className="text-center border-none bg-slate-50">
                <CardContent className="pt-6">
                  <div className="text-3xl sm:text-4xl mb-2">{stat.icon}</div>
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
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
