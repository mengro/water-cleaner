import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, Settings, Home, LogOut } from "lucide-react";
import { handleSignOut } from "@/app/lib/actions";

// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fail-safe authentication check
  let session;
  try {
    session = await auth();
  } catch (error) {
    console.error("[Security] Auth error in admin layout:", error);
    // CRITICAL: On error, deny access (fail-closed)
    redirect("/login?error=auth_error");
  }
  
  // Verify session exists and has valid user
  if (!session || !session.user) {
    console.warn("[Security] No valid session in admin layout");
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white p-6 md:min-h-screen">
        <div className="mb-8">
          <h2 className="text-xl font-bold">后台管理</h2>
        </div>
        <nav className="space-y-2">
          <Button asChild variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
            <Link href="/admin">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              概览
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
            <Link href="/admin/products">
              <Package className="mr-2 h-4 w-4" />
              产品管理
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
            <Link href="/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              网站配置
            </Link>
          </Button>
          <div className="pt-4 mt-4 border-t border-slate-800">
            <Button asChild variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
              <Link href="/" target="_blank">
                <Home className="mr-2 h-4 w-4" />
                返回首页
              </Link>
            </Button>
            <form action={handleSignOut}>
              <Button 
                type="submit" 
                variant="ghost" 
                className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </Button>
            </form>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 bg-slate-50">
        {children}
      </main>
    </div>
  );
}
