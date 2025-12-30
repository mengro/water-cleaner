import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth(async (req) => {
  const { pathname } = req.nextUrl
  
  // Protect /admin routes with fail-safe mechanism
  if (pathname.startsWith("/admin")) {
    try {
      // Double check: verify auth is properly initialized
      const isLoggedIn = !!req.auth
      
      if (!isLoggedIn) {
        console.warn(`[Security] Unauthorized access attempt to ${pathname}`)
        const loginUrl = new URL("/login", req.url)
        loginUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(loginUrl)
      }
      
      // Additional verification: ensure auth object has required properties
      if (!req.auth?.user) {
        console.error(`[Security] Invalid auth state for ${pathname}`)
        const loginUrl = new URL("/login", req.url)
        loginUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(loginUrl)
      }
    } catch (error) {
      // CRITICAL: If auth check fails, deny access by default (fail-closed)
      console.error(`[Security] Auth middleware error for ${pathname}:`, error)
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      loginUrl.searchParams.set("error", "auth_error")
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect logged-in users away from login page
  if (pathname === "/login") {
    try {
      const isLoggedIn = !!req.auth
      if (isLoggedIn) {
        return NextResponse.redirect(new URL("/admin", req.url))
      }
    } catch (error) {
      // If there's an error checking login status, allow access to login page
      console.error("[Auth] Error checking login status:", error)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/login"],
}
