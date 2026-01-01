import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getSiteConfig } from "@/lib/site-config"

// 强制动态渲染，确保每次请求都从 COS 读取最新配置
export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const config = await getSiteConfig();

  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4 pb-24 md:pb-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">联系我们</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
        <div>
          <h2 className="text-lg sm:text-xl font-bold mb-4">联系方式</h2>
          <div className="space-y-4 text-sm sm:text-base text-slate-600">
            <p>如果您有任何产品需求或技术问题，欢迎随时联系我们。</p>
            <div className="pt-4 space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="font-semibold text-slate-900 min-w-[4rem]">电话：</div>
                <a href={`tel:${config.tel}`} className="text-primary hover:underline">{config.tel}</a>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="font-semibold text-slate-900 min-w-[4rem]">联系人：</div>
                <div>{config.contact}</div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="font-semibold text-slate-900 min-w-[4rem]">邮箱：</div>
                <a href={`mailto:${config.email}`} className="text-primary hover:underline break-all">{config.email}</a>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="font-semibold text-slate-900 min-w-[4rem]">地址：</div>
                <div className="flex-1">{config.address}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 p-4 sm:p-6 rounded-lg">
          <h2 className="text-lg sm:text-xl font-bold mb-4">在线留言</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">姓名 <span className="text-red-500">*</span></label>
                <Input id="name" placeholder="您的姓名" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">电话 <span className="text-red-500">*</span></label>
                <Input id="phone" placeholder="联系电话" type="tel" required />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">邮箱</label>
              <Input id="email" placeholder="电子邮箱" type="email" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">留言内容 <span className="text-red-500">*</span></label>
              <Textarea id="message" placeholder="请输入您的留言内容..." className="min-h-[120px] sm:min-h-[150px]" required />
            </div>
            <Button type="submit" className="w-full h-11 sm:h-12 text-base" size="lg">提交留言</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
