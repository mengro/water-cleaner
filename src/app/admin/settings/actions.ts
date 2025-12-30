'use server'

import { revalidatePath } from "next/cache";
import { updateSiteConfig } from "@/lib/site-config";
import { auth } from "@/auth";

// Security helper: verify admin authentication
async function requireAuth() {
  let session;
  try {
    session = await auth();
  } catch (error) {
    console.error("[Security] Auth error in settings actions:", error);
    throw new Error("Authentication failed");
  }
  
  if (!session || !session.user) {
    console.warn("[Security] Unauthorized settings action attempt");
    throw new Error("Unauthorized");
  }
  
  return session;
}

export async function saveSiteConfig(formData: FormData) {
  await requireAuth();
  const brandName = formData.get('brandName') as string;
  const companyName = formData.get('companyName') as string;
  const tel = formData.get('tel') as string;
  const contact = formData.get('contact') as string;
  const email = formData.get('email') as string;
  const address = formData.get('address') as string;
  const aboutUs = formData.get('aboutUs') as string;
  
  const configData = {
    brandName: brandName || '',
    companyName: companyName || '',
    tel: tel || '',
    contact: contact || '',
    email: email || '',
    address: address || '',
    aboutUs: aboutUs || '',
  };

  await updateSiteConfig(configData);
  
  // 重新验证所有相关页面
  revalidatePath('/admin/settings');
  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/contact');
}
