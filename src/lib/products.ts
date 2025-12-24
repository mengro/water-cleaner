import { readConfigJson, writeConfigJson } from './cos';
import { createId } from '@paralleldrive/cuid2';

const PRODUCTS_JSON_KEY = 'products.json';

export type Product = {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  content?: string;
  images?: string[];
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type ProductsData = {
  products: Product[];
};

async function readProducts(): Promise<ProductsData> {
  try {
    return await readConfigJson<ProductsData>(PRODUCTS_JSON_KEY);
  } catch {
    // If file doesn't exist or is invalid, return empty products array
    return { products: [] };
  }
}

async function writeProducts(data: ProductsData): Promise<void> {
  await writeConfigJson(PRODUCTS_JSON_KEY, data);
}

export async function getAllProducts(): Promise<Product[]> {
  const data = await readProducts();
  return data.products.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getProductById(id: string): Promise<Product | null> {
  const data = await readProducts();
  return data.products.find(p => p.id === id) || null;
}

export async function createProduct(input: {
  name: string;
  categoryId: string;
  description?: string;
  content?: string;
  images?: string[];
}): Promise<Product> {
  const data = await readProducts();
  
  const now = new Date().toISOString();
  const newProduct: Product = {
    id: createId(),
    name: input.name,
    categoryId: input.categoryId,
    description: input.description,
    content: input.content,
    images: input.images || [],
    isPublished: true,
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
  };
  
  data.products.push(newProduct);
  await writeProducts(data);
  
  return newProduct;
}

export async function updateProduct(
  id: string,
  input: {
    name: string;
    categoryId: string;
    description?: string;
    content?: string;
    images?: string[];
  }
): Promise<Product | null> {
  const data = await readProducts();
  const index = data.products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedProduct: Product = {
    ...data.products[index],
    name: input.name,
    categoryId: input.categoryId,
    description: input.description,
    content: input.content,
    images: input.images || [],
    updatedAt: new Date().toISOString(),
  };
  
  data.products[index] = updatedProduct;
  await writeProducts(data);
  
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const data = await readProducts();
  const initialLength = data.products.length;
  
  data.products = data.products.filter(p => p.id !== id);
  
  if (data.products.length === initialLength) {
    return false;
  }
  
  await writeProducts(data);
  return true;
}

export async function toggleProductPublish(id: string): Promise<Product | null> {
  const data = await readProducts();
  const index = data.products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return null;
  }
  
  data.products[index] = {
    ...data.products[index],
    isPublished: !data.products[index].isPublished,
    updatedAt: new Date().toISOString(),
  };
  
  await writeProducts(data);
  return data.products[index];
}
