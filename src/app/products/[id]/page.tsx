"use client";

import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Phone, MessageCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"
import categoriesJson from "@/data/categories.json"
import { CosImage } from "@/components/ui/cos-image"
import { useEffect, useState } from "react"
import type { Product } from "@/lib/products"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-slate-200 rounded w-24 sm:w-32 mb-6 sm:mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            <div className="bg-slate-200 rounded-lg aspect-square"></div>
            <div className="space-y-4">
              <div className="h-6 sm:h-8 bg-slate-200 rounded w-20 sm:w-24"></div>
              <div className="h-8 sm:h-12 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 sm:h-6 bg-slate-200 rounded w-full"></div>
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
  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <div className="pb-24 md:pb-0">
      <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4">
        <div className="mb-6 sm:mb-8">
          <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary -ml-2">
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="text-sm sm:text-base">返回产品列表</span>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Product Image Gallery */}
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-slate-100 rounded-lg aspect-square flex items-center justify-center text-slate-400 overflow-hidden">
              {images.length > 0 ? (
                <CosImage
                  src={images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-base sm:text-lg">暂无图片</span>
              )}
            </div>
            
            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <CosImage
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                {category?.name || '未分类'}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{product.name}</h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                {product.description}
              </p>
            </div>

            <div className="prose prose-slate prose-sm sm:prose-base max-w-none mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">产品介绍</h3>
              <ReactMarkdown>{product.content || "暂无详细介绍"}</ReactMarkdown>
            </div>

            {/* Desktop Contact Section */}
            <div className="hidden md:block border-t pt-6 sm:pt-8">
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">咨询购买</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                如需了解更多产品信息或获取报价，请联系我们的销售团队。
              </p>
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/contact">立即联系</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 p-3 md:hidden shadow-lg">
        <div className="flex items-center gap-3 max-w-screen-sm mx-auto">
          <Button
            asChild
            size="lg"
            className="flex-1 h-12"
          >
            <a href="tel:">
              <Phone className="h-5 w-5 mr-2" />
              立即咨询
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex-1 h-12"
          >
            <Link href="/contact">
              <MessageCircle className="h-5 w-5 mr-2" />
              在线留言
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
