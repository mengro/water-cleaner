import Link from "next/link"
import { ArrowRight, CheckCircle2, Factory, ShieldCheck, Truck, Package, Phone, Mail, Award, Users, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

  // 统计数据
  const stats = [
    { value: "20+", label: "年行业经验", icon: Award },
    { value: "5000+", label: "合作企业", icon: Users },
    { value: "100+", label: "产品种类", icon: Package },
    { value: "30+", label: "出口国家", icon: Globe },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0 bg-white selection:bg-blue-500/20">
      {/* Hero Section - 商务严谨风格 */}
      <section className="relative h-[600px] flex items-center bg-slate-900 border-b border-white/10">
        {/* 背景图片层 */}
        {publishedProducts.length > 0 && publishedProducts[0].images && publishedProducts[0].images.length > 0 ? (
          <>
            <div className="absolute inset-0 z-0">
              <CosImage
                src={publishedProducts[0].images[0]}
                alt="工业背景"
                className="w-full h-full object-cover opacity-60 mix-blend-overlay"
              />
            </div>
            {/* 深色遮罩 - 增加稳重感 */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/60" />
          </>
        ) : (
          <div className="absolute inset-0 z-0 bg-slate-900" />
        )}

        <div className="container relative mx-auto px-4 z-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <ShieldCheck className="w-4 h-4" />
              <span>专注净水领域二十载 · 值得信赖的合作伙伴</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              专业水处理材料
              <br/>
              <span className="text-blue-500">一站式供应链服务商</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
              我们为全球客户提供高质量的聚氯化铝、活性炭、聚丙烯酰胺等全系列水处理产品。
              <br className="hidden sm:block" />
              自有工厂直供，严格执行ISO质量标准，助力企业降本增效。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="rounded-sm text-base h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all hover:scale-105"
              >
                <Link href="/products">浏览产品目录</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-sm text-base h-14 px-8 bg-transparent text-white border-white/30 hover:bg-white hover:text-slate-900 font-semibold transition-all hover:border-white"
              >
                <Link href="/contact">联系业务经理</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar - 数据展示 */}
      <div className="border-b border-slate-100 bg-white relative z-20 -mt-0">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 border-x border-slate-100">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 md:p-8 flex flex-col items-center justify-center text-center group hover:bg-slate-50 transition-colors">
                <stat.icon className="w-8 h-8 text-blue-600 mb-3 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                <div className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Brief - 此时展示更合适 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                中国领先的水处理材料生产商
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  {config.companyName} 是一家集研发、生产、销售为一体的现代化水处理企业。我们在河南拥有两大生产基地，年产能超过10万吨。
                </p>
                <p>
                  依托强大的供应链整合能力和专业的技术服务团队，我们为市政污水、工业废水、造纸印染等多个领域提供定制化解决方案。无论是单一产品的采购，还是复杂水质的处理方案，我们都能为您提供专业的支持。
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-sm bg-blue-50 flex items-center justify-center shrink-0">
                    <VerifyIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">源头工厂</h4>
                    <p className="text-sm text-slate-500 mt-1">无中间环节，价格更有优势</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-sm bg-blue-50 flex items-center justify-center shrink-0">
                    <ShipIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">极速发货</h4>
                    <p className="text-sm text-slate-500 mt-1">常备库存，物流网络覆盖全国</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] bg-slate-100 rounded-sm overflow-hidden">
               {/* 替换为工厂或实验室图片 */}
               {publishedProducts.length > 2 && publishedProducts[0]?.images?.[0] ? (
                  <CosImage 
                    src={publishedProducts[0].images[0]} 
                    alt="工厂实景" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                  />
               ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200">
                    <Factory className="w-20 h-20 text-slate-400" />
                  </div>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Products - 稳重的卡片设计 */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Our Products</span>
              <h2 className="text-3xl font-bold text-slate-900">核心产品系列</h2>
            </div>
            <Button variant="outline" asChild className="hidden md:flex rounded-sm">
              <Link href="/products">
                查看全部产品 <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div key={category.id} className="group bg-white rounded-sm border border-slate-200 hover:border-blue-500/30 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 group-hover:bg-blue-50/10 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-sm flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                       {/* 简单的分类图标逻辑 */}
                       {category.id === '1' ? <Factory className="w-6 h-6 text-slate-600 group-hover:text-white" /> : 
                        category.id === '2' ? <ShieldCheck className="w-6 h-6 text-slate-600 group-hover:text-white" /> :
                        <Package className="w-6 h-6 text-slate-600 group-hover:text-white" />}
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-0 rounded-sm">
                      {category.products.length} 款产品
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{category.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{category.description}</p>
                </div>
                
                <div className="p-6 flex-1 flex flex-col gap-3">
                   {category.products.slice(0, 3).map(product => (
                     <Link key={product.id} href={`/products/${product.id}`} className="flex items-center gap-3 group/item">
                        <div className="w-10 h-10 rounded-sm bg-slate-100 overflow-hidden shrink-0">
                           {product.images?.[0] && (
                             <CosImage src={product.images[0]} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                           )}
                        </div>
                        <span className="text-sm font-medium text-slate-700 group-hover/item:text-blue-600 transition-colors line-clamp-1">{product.name}</span>
                        <ArrowRight className="w-3 h-3 text-slate-300 ml-auto group-hover/item:text-blue-500 opacity-0 group-hover/item:opacity-100 transition-all transform -translate-x-2 group-hover/item:translate-x-0" />
                     </Link>
                   ))}
                </div>
                
                <div className="p-4 pt-0 mt-auto">
                  <Button variant="ghost" asChild className="w-full justify-between text-slate-500 hover:text-blue-700 hover:bg-transparent px-2">
                    <Link href={`/products?category=${category.id}`}>
                      浏览该系列 <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 md:hidden">
            <Button variant="outline" asChild className="w-full rounded-sm">
              <Link href="/products">
                查看全部产品 <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us - 工业风 Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">为什么选择我们</h2>
            <p className="text-slate-500">
              我们坚持以质量求生存，以信誉求发展。做客户最放心的供应商。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-slate-100 hover:border-slate-200 rounded-sm hover:shadow-xl transition-all duration-300 bg-white">
              <div className="w-14 h-14 bg-blue-50 rounded-sm flex items-center justify-center mb-6">
                <Factory className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">实力源头工厂</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                自有两座生产基地，全套自动化生产设备，日产量高，供货稳定。砍掉中间环节，直面终端客户，提供极具竞争力的出厂价格。
              </p>
            </div>
            
            <div className="p-8 border border-slate-100 hover:border-slate-200 rounded-sm hover:shadow-xl transition-all duration-300 bg-white">
              <div className="w-14 h-14 bg-blue-50 rounded-sm flex items-center justify-center mb-6">
                <CheckCircle2 className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">多重品质检测</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                配备专业实验室，每批次产品出厂前需经过3道严格检测。严格执行GB/ISO标准，随货提供质检单，质量不达标无条件退换。
              </p>
            </div>

            <div className="p-8 border border-slate-100 hover:border-slate-200 rounded-sm hover:shadow-xl transition-all duration-300 bg-white">
              <div className="w-14 h-14 bg-blue-50 rounded-sm flex items-center justify-center mb-6">
                <Truck className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">专业售后服务</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                30+专业技术人员，提供7*24小时技术咨询。针对疑难水质，可免费提供寄样分析及选型服务，确保处理效果达标。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies - 列表式展示，更显专业 */}
      <section className="py-16 md:py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
           <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">服务案例</h2>
              <p className="text-slate-400 max-w-xl">
                 我们在市政、化工、造纸、制药等领域拥有丰富的实战经验。
              </p>
            </div>
            <Button variant="outline" className="hidden md:flex border-slate-700 text-slate-300 hover:bg-white hover:text-slate-900 rounded-sm">
               <Link href="/contact">索取更多案例</Link>
            </Button>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {[
              {
                title: "某省级市政污水处理厂",
                desc: "日处理量20万吨，采用我司高纯聚合氯化铝，在低温低浊环境下依然保持优异的絮凝效果，出水达国家一级A标准。",
                tag: "市政工程"
              },
              {
                title: "大型上市造纸集团",
                desc: "针对造纸废水COD高、色度大的特点，定制阳离子聚丙烯酰胺方案，污泥脱水效率提升20%，药剂成本降低15%。",
                tag: "工业废水"
              },
              {
                title: "国家级化工园区",
                desc: "长期供应全套水处理药剂，包括杀菌灭藻剂、缓蚀阻垢剂等，保障园区循环水系统长期稳定运行。",
                tag: "循环水处理"
              }
             ].map((item, idx) => (
               <div key={idx} className="bg-slate-800/50 p-6 rounded-sm border border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition-all group">
                 <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-blue-900/50 text-blue-300 border-blue-800/50 rounded-sm">{item.tag}</Badge>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                 </div>
                 <h3 className="text-lg font-bold mb-3 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                 <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
               </div>
             ))}
           </div>
           
           <div className="mt-8 md:hidden">
              <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-white hover:text-slate-900 rounded-sm">
               <Link href="/contact">索取更多案例</Link>
              </Button>
           </div>
        </div>
      </section>

      {/* Certifications - 纯净展示 */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">资质与荣誉</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 opacity-70">
            {/* 模拟Logo展示，实际项目中替换为图片 */}
            {['ISO 9001', 'ISO 14001', 'ISO 45001', '高新技术企业', '其它专利', '行业协会'].map((item, idx) => (
              <div key={idx} className="h-20 border border-slate-200 rounded-sm flex items-center justify-center bg-slate-50 font-semibold text-slate-500 text-sm hover:bg-white hover:shadow-md transition-all cursor-default">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - 商务结尾 */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">准备好优化您的水处理方案了吗？</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            请联系我们的技术顾问，获取免费的样品和定制化报价方案。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button size="lg" className="h-14 px-8 text-base bg-blue-600 hover:bg-blue-700 rounded-sm text-white hover:-translate-y-1 transition-all shadow-lg shadow-blue-600/20">
               <Link href="/contact" className="flex items-center">
                 <Phone className="w-4 h-4 mr-2" /> 
                 获取报价
               </Link>
             </Button>
             <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-white border-slate-300 text-slate-700 hover:bg-slate-50 rounded-sm hover:-translate-y-1 transition-all">
               <Link href="mailto:contact@example.com" className="flex items-center">
                 <Mail className="w-4 h-4 mr-2" />
                 发送邮件
               </Link>
             </Button>
          </div>
        </div>
      </section>

      <MobileQuickActions siteConfig={config} />
    </div>
  );
}

// 辅助图标组件
function VerifyIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function ShipIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 17h20" />
      <path d="M15 17v-8l-8-5v13" />
      <path d="M9 17v-4l-5-4" />
      <circle cx="4" cy="17" r="1" />
      <circle cx="20" cy="17" r="1" />
    </svg>
  )
}
