import Link from "next/link"
import { navLinks } from "@/config"
import type { SiteConfig } from "@/lib/site-config"
import type categoriesData from "@/data/categories.json"

type Category = typeof categoriesData[0];

export function SiteFooter({ siteConfig, categories }: { siteConfig: SiteConfig, categories: Category[] }) {
  return (
    <footer className="bg-gradient-to-b from-white/80 to-slate-100/80 backdrop-blur-xl border-t border-white/30 dark:from-slate-900/80 dark:to-slate-800/80 dark:border-slate-700/30">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Company Info - 玻璃卡片 */}
          <div className="space-y-4 p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-white/40 dark:bg-white/5 dark:border-slate-700/40 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
              {siteConfig.brandName}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {siteConfig.companyName}
            </p>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                <span>电话：{siteConfig.tel}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                <span>联系人：{siteConfig.contact}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                <span>邮箱：{siteConfig.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                <span>地址：{siteConfig.address}</span>
              </div>
            </div>
          </div>

          {/* Quick Links - 玻璃卡片 */}
          <div className="p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-white/40 dark:bg-white/5 dark:border-slate-700/40 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">快速链接</h4>
            <ul className="space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-all duration-200 hover:pl-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products - 玻璃卡片 */}
          <div className="col-span-1 md:col-span-2 p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-white/40 dark:bg-white/5 dark:border-slate-700/40 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">产品中心</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {categories.map((category) => (
                <div key={category.id} className="group">
                  <Link
                    href={`/products?category=${category.id}`}
                    className="font-medium text-slate-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-primary transition-all duration-200 group-hover:pl-1 block"
                  >
                    {category.name}
                  </Link>
                  <p className="text-slate-500 dark:text-slate-500 text-xs leading-relaxed">
                    {category.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部版权 - 毛玻璃条 */}
        <div className="mt-8 pt-6 text-center text-sm text-slate-600 dark:text-slate-400 border-t border-white/30 dark:border-slate-700/30 bg-white/30 dark:bg-white/5 backdrop-blur-sm rounded-xl">
          <p>© {new Date().getFullYear()} {siteConfig.companyName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
