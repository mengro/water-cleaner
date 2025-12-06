import { productCategories } from "@/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProductsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">产品中心</h1>
      <div className="space-y-12">
        {productCategories.map((category) => (
          <div key={category.id} id={category.id}>
            <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
            <p className="text-muted-foreground mb-6">{category.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {category.products.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">产品详情即将上线...</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
