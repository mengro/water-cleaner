"use client"

import { Phone, MessageCircle, ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import type { SiteConfig } from "@/lib/site-config"

export function MobileQuickActions({ siteConfig }: { siteConfig: SiteConfig }) {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* 移动端快速拨号按钮 */}
      <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-3 md:hidden">
        {/* 返回顶部 */}
        {showScrollTop && (
          <Button
            size="icon"
            onClick={scrollToTop}
            className="h-12 w-12 rounded-full shadow-lg bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            aria-label="返回顶部"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        )}
        
        {/* 快速拨号 */}
        <a
          href={`tel:${siteConfig.tel}`}
          className="flex items-center justify-center h-14 w-14 rounded-full shadow-lg bg-primary text-white hover:bg-primary/90 transition-all hover:scale-110 active:scale-95"
          aria-label="拨打电话"
        >
          <Phone className="h-6 w-6" />
        </a>
      </div>

      {/* 移动端底部联系栏（可选） */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 p-3 md:hidden shadow-lg">
        <div className="flex items-center justify-between gap-3 max-w-screen-sm mx-auto">
          <a
            href={`tel:${siteConfig.tel}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 active:bg-primary/80 transition-colors"
          >
            <Phone className="h-5 w-5" />
            <span>立即咨询</span>
          </a>
          <a
            href="/contact"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 active:bg-slate-300 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <span>在线留言</span>
          </a>
        </div>
      </div>
    </>
  )
}
