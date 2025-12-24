'use server'

import { revalidatePath } from "next/cache";
import { 
  createProduct, 
  updateProduct, 
  deleteProduct as deleteProductData,
  toggleProductPublish as toggleProductPublishData 
} from "@/lib/products";

export async function deleteProduct(id: string) {
  await deleteProductData(id);
  revalidatePath('/admin/products');
}

export async function togglePublish(id: string) {
  await toggleProductPublishData(id);
  revalidatePath('/admin/products');
}

export async function saveProduct(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;
  const content = formData.get('content') as string;
  const imagesJson = formData.get('images') as string;
  
  let images: string[] = [];
  try {
    images = JSON.parse(imagesJson || '[]');
  } catch {
    images = [];
  }
  
  const productData = {
    name,
    categoryId,
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
}
