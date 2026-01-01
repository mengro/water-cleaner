'use server'

import { revalidatePath } from "next/cache";
import { 
  createProduct, 
  updateProduct, 
  deleteProduct as deleteProductData,
  toggleProductPublish as toggleProductPublishData 
} from "@/lib/products";
import { auth } from "@/auth";

// Security helper: verify admin authentication
async function requireAuth() {
  let session;
  try {
    session = await auth();
  } catch (error) {
    console.error("[Security] Auth error in product actions:", error);
    throw new Error("Authentication failed");
  }
  
  if (!session || !session.user) {
    console.warn("[Security] Unauthorized action attempt");
    throw new Error("Unauthorized");
  }
  
  return session;
}

export async function deleteProduct(id: string) {
  await requireAuth();
  await deleteProductData(id);
  revalidatePath('/admin/products');
}

export async function togglePublish(id: string) {
  await requireAuth();
  await toggleProductPublishData(id);
  revalidatePath('/admin/products');
}

export async function saveProduct(formData: FormData) {
  await requireAuth();
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const content = formData.get('content') as string;
  const imagesJson = formData.get('images') as string;

  // 获取所有选中的分类ID（多个同名字段）
  const categoryIds = formData.getAll('categoryIds') as string[];

  let images: string[] = [];
  try {
    images = JSON.parse(imagesJson || '[]');
  } catch {
    images = [];
  }

  if (categoryIds.length === 0) {
    throw new Error('请至少选择一个分类');
  }

  const productData = {
    name,
    categoryIds,
    description: description || undefined,
    content: content || undefined,
    images,
  };

  if (id) {
    await updateProduct(id, productData);
  } else {
    await createProduct(productData);
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
}
