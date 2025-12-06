import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function ProductsPage() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        where: { isPublished: true },
        orderBy: { sortOrder: 'asc' }
      }
    },
    orderBy: { sortOrder: 'asc' }
  });

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">产品中心</h1>
      <div className="space-y-12">
        {categories.map((category) => (
          <div key={category.id} id={category.id}>
            <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
            <p className="text-muted-foreground mb-6">{category.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {category.products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description || "暂无描述"}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {category.products.length === 0 && (
                <p className="text-muted-foreground col-span-full">该分类下暂无产品</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
