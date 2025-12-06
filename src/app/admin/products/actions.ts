'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id }
  });
  revalidatePath('/admin/products');
}

export async function togglePublish(id: string, currentState: boolean) {
  await prisma.product.update({
    where: { id },
    data: { isPublished: !currentState }
  });
  revalidatePath('/admin/products');
}

export async function saveProduct(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;
  const content = formData.get('content') as string;
  const images = formData.get('images') as string;
  
  const data = {
    name,
    description,
    categoryId,
    content,
    images,
  };

  if (id) {
    await prisma.product.update({
      where: { id },
      data
    });
  } else {
    await prisma.product.create({
      data: {
        ...data,
        isPublished: true
      }
    });
  }
  
  revalidatePath('/admin/products');
}
