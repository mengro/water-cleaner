"use client"

import Link from "next/link"
import { Menu, Phone } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import type { SiteConfig } from "@/lib/site-config"

import { navLinks } from "@/config"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export function SiteHeader({ siteConfig }: { siteConfig: SiteConfig }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 当哨兵元素不可见时，说明页面已滚动
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
      {/* 哨兵元素：用于检测页面滚动状态 */}
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
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6">
              <nav className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <div key={link.href} className="border-b pb-4 last:border-0">
                    <Link
                      href={link.href}
                      className="text-lg font-medium block w-full hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">联系电话</p>
                  <a href={`tel:${siteConfig.tel}`} className="text-lg font-bold text-primary flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {siteConfig.tel}
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    </>
  )
}
