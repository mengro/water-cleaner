import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, Settings, Home } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
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
