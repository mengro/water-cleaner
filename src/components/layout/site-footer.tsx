import Link from "next/link"
import { navLinks } from "@/config"

export function SiteFooter({ siteConfig, categories }: { siteConfig: any, categories: any[] }) {
  return (
    <footer className="bg-slate-800 text-slate-200">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">{siteConfig.brandName}</h3>
            <p className="text-sm text-slate-400">
              {siteConfig.companyName}
            </p>
            <div className="text-sm text-slate-400 space-y-1">
              <p>电话：{siteConfig.tel}</p>
              <p>联系人：{siteConfig.contact}</p>
              <p>邮箱：{siteConfig.email}</p>
              <p>地址：{siteConfig.address}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-bold text-white mb-4">产品中心</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {categories.map((category) => (
                <div key={category.id}>
                  <h5 className="font-medium text-white mb-2">{category.name}</h5>
                  <ul className="space-y-1 text-slate-300">
                    {category.products.slice(0, 3).map((product) => (
                      <li key={product.id}>
                        <Link href={`/products?category=${category.id}`} className="hover:text-white transition-colors">
                          {product.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-12 pt-8 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} {siteConfig.companyName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
