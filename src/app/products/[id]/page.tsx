import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  });

  if (!product || !product.isPublished) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回产品列表
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image Placeholder */}
        <div className="bg-slate-100 rounded-lg aspect-square flex items-center justify-center text-slate-400">
          {product.images ? (
             // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={JSON.parse(product.images)[0]} 
              alt={product.name} 
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-lg">暂无图片</span>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              {product.category.name}
            </span>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-xl text-muted-foreground">
              {product.description}
            </p>
          </div>

          <div className="prose prose-slate max-w-none mb-8">
            <h3 className="text-lg font-bold mb-4">产品介绍</h3>
            <ReactMarkdown>{product.content || "暂无详细介绍"}</ReactMarkdown>
          </div>

          <div className="border-t pt-8">
            <h3 className="text-lg font-bold mb-4">咨询购买</h3>
            <p className="text-muted-foreground mb-4">
              如需了解更多产品信息或获取报价，请联系我们的销售团队。
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">立即联系</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
