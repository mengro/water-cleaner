import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllProducts } from "@/lib/products";
import categoriesData from "@/data/categories.json";
import siteConfigData from "@/config/site-config.json";

export default async function AdminDashboard() {
  const products = await getAllProducts();
  const productCount = products.length;
  const categoryCount = categoriesData.length;
  const config = siteConfigData;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">后台管理系统</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>产品总数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{productCount}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>分类总数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{categoryCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>公司名称</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{config?.companyName}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
