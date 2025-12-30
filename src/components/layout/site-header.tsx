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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/100">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <span 
                className={`text-xl font-bold transition-all duration-200 ${
                  isScrolled 
                    ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' 
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
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground">
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
              
              <SheetContent side="right" className="w-[85vw] sm:w-[380px] bg-white dark:bg-slate-900 p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <SheetHeader className="border-b bg-slate-50 dark:bg-slate-800 px-6 py-5">
                    <SheetTitle className="text-xl">{siteConfig.brandName}</SheetTitle>
                    <SheetDescription className="text-base">
                      专业净水材料供应商
                    </SheetDescription>
                  </SheetHeader>
                  
                  {/* Navigation */}
                  <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <div className="space-y-1">
                      {navLinks.map((link) => {
                        const Icon = navIcons[link.href] || Package
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-4 rounded-lg px-4 py-3.5 text-base font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-primary/10 hover:text-primary active:bg-primary/20"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span>{link.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </nav>
                  
                  {/* Contact Info */}
                  <div className="border-t bg-slate-50 dark:bg-slate-800 px-3 py-4 space-y-3">
                    <a 
                      href={`tel:${siteConfig.tel}`} 
                      className="flex items-center gap-4 rounded-lg px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">联系电话</div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{siteConfig.tel}</div>
                      </div>
                    </a>
                    <div className="flex items-center gap-4 rounded-lg px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">联系人</div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{siteConfig.contact}</div>
                      </div>
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
