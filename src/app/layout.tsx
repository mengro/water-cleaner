import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { prisma } from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const config = await prisma.siteConfig.findUnique({ where: { id: "default" } });
  return {
    title: `${config?.brandName || "康备尔净水"} - 专业净水材料供应商`,
    description: "提供优质聚氯化铝、聚丙烯酰胺、活性炭等水处理材料。专注水处理20年。",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteConfig, categories] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { id: "default" } }),
    prisma.category.findMany({ 
      include: { products: { take: 5 } },
      orderBy: { sortOrder: 'asc' }
    })
  ]);

  const config = siteConfig || {
    brandName: "康备尔净水",
    companyName: "杭州康备尔设计咨询有限公司",
    tel: "",
    contact: "",
    email: "",
    address: ""
  };

  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader siteConfig={config} />
          <main className="flex-1">{children}</main>
          <SiteFooter siteConfig={config} categories={categories} />
        </div>
      </body>
    </html>
  );
}
