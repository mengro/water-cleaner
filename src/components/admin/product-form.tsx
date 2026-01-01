"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { saveProduct } from "@/app/admin/products/actions";
import { useRouter } from "next/navigation";
import { CosImage } from "@/components/ui/cos-image";

export function ProductForm({
  categories,
  initialData,
}: {
  categories: { id: string; name: string; sortOrder?: number }[];
  initialData?: {
    id: string;
    name: string;
    categoryIds: string[];
    description?: string;
    content?: string;
    images?: string[];
  };
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.categoryIds || []
  );
  const [imageUrls, setImageUrls] = useState<string[]>(() => {
    if (initialData?.images && Array.isArray(initialData.images)) {
      return initialData.images;
    }
    return [];
  });

  const imagesJson = useMemo(() => JSON.stringify(imageUrls), [imageUrls]);

  useEffect(() => {
    if (!initialData?.images) return;
    if (Array.isArray(initialData.images)) {
      setImageUrls(initialData.images);
    }
  }, [initialData?.images]);

  async function handleUpload(file: File) {
    setUploadError(null);
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/uploads/cos", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Upload failed");
      }

      if (!data?.url) {
        throw new Error("Upload succeeded but missing url");
      }

      setImageUrls((prev) => {
        if (prev.includes(data.url)) return prev;
        return [...prev, data.url];
      });
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleCategoryChange(categoryId: string, checked: boolean) {
    if (checked) {
      setSelectedCategories((prev) => [...prev, categoryId]);
    } else {
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
    }
  }

  return (
    <form
      action={async (formData) => {
        // 添加选中的分类到 formData
        selectedCategories.forEach((catId) => {
          formData.append("categoryIds", catId);
        });
        await saveProduct(formData);
        router.push("/admin/products");
      }}
      className="space-y-6 max-w-2xl"
    >
      {initialData && <input type="hidden" name="id" value={initialData.id} />}

      <div className="space-y-2">
        <Label htmlFor="name">产品名称</Label>
        <Input
          id="name"
          name="name"
          defaultValue={initialData?.name}
          required
          placeholder="请输入产品名称"
        />
      </div>

      <div className="space-y-3">
        <Label>所属分类（可多选）</Label>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${cat.id}`}
                checked={selectedCategories.includes(cat.id)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(cat.id, checked === true)
                }
              />
              <Label
                htmlFor={`category-${cat.id}`}
                className="cursor-pointer font-normal"
              >
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
        {selectedCategories.length === 0 && (
          <p className="text-sm text-red-600">请至少选择一个分类</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">简短描述</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initialData?.description}
          placeholder="用于列表页展示的简短介绍"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="images_upload">产品图片</Label>
        <Input
          ref={fileInputRef}
          id="images_upload"
          type="file"
          accept="image/*"
          disabled={isUploading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            void handleUpload(f);
          }}
        />

        <input type="hidden" name="images" value={imagesJson} />

        {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {imageUrls.map((url) => (
              <div key={url} className="border rounded-md p-2 space-y-2">
                <CosImage
                  src={url}
                  alt="product"
                  className="w-full h-24 object-cover rounded"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    setImageUrls((prev) => prev.filter((u) => u !== url))
                  }
                  disabled={isUploading}
                >
                  删除
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">详细介绍 (Markdown)</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={initialData?.content}
          className="min-h-[200px]"
          placeholder="支持 Markdown 格式的详细介绍"
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={selectedCategories.length === 0}
        >
          保存产品
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          取消
        </Button>
      </div>
    </form>
  );
}
