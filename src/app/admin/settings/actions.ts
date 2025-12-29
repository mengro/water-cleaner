'use server'

import { revalidatePath } from "next/cache";
import { updateSiteConfig } from "@/lib/site-config";

export async function saveSiteConfig(formData: FormData) {
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
