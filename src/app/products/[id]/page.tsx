"use client";

import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ReactMarkdown from "react-markdown"
import categoriesJson from "@/data/categories.json"
import { CosImage } from "@/components/ui/cos-image"
import { useEffect, useState } from "react"
import type { Product } from "@/lib/products"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          setProduct(null);
          return;
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Failed to load product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    void loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-32 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-slate-200 rounded-lg aspect-square"></div>
            <div className="space-y-4">
              <div className="h-8 bg-slate-200 rounded w-24"></div>
              <div className="h-12 bg-slate-200 rounded w-3/4"></div>
              <div className="h-6 bg-slate-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product || !product.isPublished) {
    notFound();
  }

  const category = categoriesJson.find(cat => cat.id === product.categoryId);

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
        {/* Product Image */}
        <div className="bg-slate-100 rounded-lg aspect-square flex items-center justify-center text-slate-400">
          {product.images && product.images.length > 0 ? (
            <CosImage
              src={product.images[0]}
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
              {category?.name || '未分类'}
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
