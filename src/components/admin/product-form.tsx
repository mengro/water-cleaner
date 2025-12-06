'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveProduct } from "@/app/admin/products/actions";
import { useRouter } from "next/navigation";

export function ProductForm({ categories, initialData }: { categories: any[], initialData?: any }) {
  const router = useRouter();

  return (
    <form action={async (formData) => {
      await saveProduct(formData);
      router.push('/admin/products');
    }} className="space-y-6 max-w-2xl">
      {initialData && <input type="hidden" name="id" value={initialData.id} />}
      
      <div className="space-y-2">
        <Label htmlFor="name">产品名称</Label>
        <Input id="name" name="name" defaultValue={initialData?.name} required placeholder="请输入产品名称" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">所属分类</Label>
        <Select name="categoryId" defaultValue={initialData?.categoryId} required>
          <SelectTrigger>
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">简短描述</Label>
        <Textarea id="description" name="description" defaultValue={initialData?.description} placeholder="用于列表页展示的简短介绍" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">图片链接 (JSON格式，暂时代替上传)</Label>
        <Input id="images" name="images" defaultValue={initialData?.images} placeholder='["/images/product1.jpg"]' />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">详细介绍 (Markdown)</Label>
        <Textarea id="content" name="content" defaultValue={initialData?.content} className="min-h-[200px]" placeholder="支持 Markdown 格式的详细介绍" />
      </div>

      <div className="flex gap-4">
        <Button type="submit">保存产品</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>取消</Button>
      </div>
    </form>
  );
}
