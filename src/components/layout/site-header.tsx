"use client"

import Link from "next/link"
import { Menu, Phone, Home, Info, Package, Mail } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import type { SiteConfig } from "@/lib/site-config"

import { navLinks } from "@/config"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

// 导航图标映射
const navIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "/": Home,
  "/about": Info,
  "/products": Package,
  "/contact": Mail,
}

export function SiteHeader({ siteConfig }: { siteConfig: SiteConfig }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [islandExpanded, setIslandExpanded] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={sentinelRef} className="absolute top-0 h-px w-full pointer-events-none" aria-hidden="true" />
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-white/20 dark:bg-slate-900/80 dark:border-slate-700/30 shadow-lg'
          : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/100 border-b'
      }`}>
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <span
                className={`text-xl font-bold transition-all duration-200 ${
                  isScrolled
                    ? 'text-primary'
                    : 'text-primary'
                }`}
              >
                {siteConfig.brandName}
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-all duration-200 hover:text-primary hover:bg-white/50 dark:hover:bg-white/10 px-3 py-2 rounded-lg"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-200">
              <Phone className="h-4 w-4" />
              <span>{siteConfig.tel}</span>
            </div>
            
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">打开菜单</span>
              </Button>
              
              <SheetContent side="top" className="w-full h-auto max-h-[85vh] mx-auto rounded-b-3xl p-0 bg-gradient-to-br from-white/75 via-white/65 to-slate-50/70 backdrop-blur-2xl dark:from-slate-900/75 dark:via-slate-900/65 dark:to-slate-800/70 border-b border-white/30 dark:border-slate-700/40 shadow-2xl">
                <div className="flex flex-col p-6 space-y-4">
                  {/* Header - 灵动岛风格（可点击展开） */}
                  <div className="flex justify-center pb-4 border-b border-white/20 dark:border-slate-700/40">
                    <button
                      onClick={() => setIslandExpanded(!islandExpanded)}
                      className="relative overflow-hidden transition-all duration-500 ease-in-out"
                      style={{
                        animation: 'dynamicIsland 500ms ease-out forwards',
                      }}
                    >
                      <div className={`relative flex flex-col items-center justify-center border backdrop-blur-xl ${
                        islandExpanded
                          ? 'px-6 py-3 rounded-3xl bg-gradient-to-b from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70'
                          : 'px-5 py-2 rounded-full bg-gradient-to-b from-white/90 to-white/60 dark:from-slate-800/90 dark:to-slate-800/60'
                      } border-white/30 dark:border-slate-600/50`}>
                        {/* 光泽效果 */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent dark:from-white/10" />

                        {/* 企业名称 */}
                        <h2 className="relative text-base font-semibold text-slate-900 dark:text-white text-center">
                          {siteConfig.brandName}
                        </h2>

                        {/* Slogan - 展开时显示 */}
                        <div
                          className={`relative overflow-hidden transition-all duration-500 ease-in-out text-center ${
                            islandExpanded
                              ? 'max-h-8 opacity-100 mt-1.5'
                              : 'max-h-0 opacity-0'
                          }`}
                        >
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            专业净水材料供应商
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Navigation - 统一的玻璃面板 */}
                  <nav className="overflow-y-auto max-h-[55vh] -mx-2 px-2">
                    <div className="grid grid-cols-2 gap-3">
                      {navLinks.map((link, index) => {
                        const Icon = navIcons[link.href] || Package
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex flex-col items-center justify-center gap-3 rounded-2xl px-4 py-6 text-base font-medium text-slate-700 dark:text-slate-200 transition-all duration-200 hover:bg-white/50 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] hover:text-primary active:bg-primary/20 dark:hover:bg-white/10 dark:hover:shadow-xl dark:hover:shadow-black/20 border border-transparent hover:border-white/60 dark:hover:border-slate-600/40 animate-in fade-in slide-in-from-top-8 zoom-in-95 duration-500"
                            style={{
                              animationDelay: `${150 + index * 60}ms`,
                              animationFillMode: 'both'
                            }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-white/70 to-white/40 dark:from-white/15 dark:to-white/5 flex-shrink-0 shadow-sm">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <span className="font-medium text-center">{link.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </nav>

                  {/* Contact Info - 与导航项统一的轻量风格 */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/20 dark:border-slate-700/40">
                    <a
                      href={`tel:${siteConfig.tel}`}
                      className="flex items-center justify-center gap-3 rounded-2xl px-4 py-4 text-base transition-all duration-200 hover:bg-white/50 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:bg-primary/20 dark:hover:bg-white/10 dark:hover:shadow-xl dark:hover:shadow-black/20 border border-transparent hover:border-white/60 dark:hover:border-slate-600/40 animate-in fade-in slide-in-from-top-8 zoom-in-95 duration-500"
                      style={{
                        animationDelay: `${150 + navLinks.length * 60}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 dark:from-primary/25 dark:to-primary/10 flex-shrink-0 shadow-sm">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{siteConfig.tel}</div>
                    </a>
                    <div className="flex items-center justify-center gap-3 rounded-2xl px-4 py-4 border border-transparent animate-in fade-in slide-in-from-top-8 zoom-in-95 duration-500"
                      style={{
                        animationDelay: `${150 + navLinks.length * 60 + 60}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 dark:from-primary/25 dark:to-primary/10 flex-shrink-0 shadow-sm">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{siteConfig.contact}</div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  )
}
