'use client'

import { Button } from "@/components/ui/button";
import { Trash2, Eye, EyeOff, Pencil } from "lucide-react";
import { deleteProduct, togglePublish } from "./actions";
import Link from "next/link";

export function ProductRowActions({ product }: { product: any }) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/admin/products/${product.id}/edit`}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      
      <form action={async () => {
        await togglePublish(product.id, product.isPublished);
      }}>
        <Button variant="ghost" size="icon" type="submit" title={product.isPublished ? "下架" : "发布"}>
          {product.isPublished ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-slate-400" />}
        </Button>
      </form>

      <form action={async () => {
        if (confirm('确定要删除这个产品吗？')) {
          await deleteProduct(product.id);
        }
      }}>
        <Button variant="ghost" size="icon" type="submit" className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
