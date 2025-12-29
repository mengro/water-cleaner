import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getSiteConfig } from "@/lib/site-config"

export default async function ContactPage() {
  const config = await getSiteConfig();

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">联系我们</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-bold mb-4">联系方式</h2>
          <div className="space-y-4 text-slate-600">
            <p>如果您有任何产品需求或技术问题，欢迎随时联系我们。</p>
            <div className="pt-4 space-y-2">
              <p><strong>电话：</strong>{config.tel}</p>
              <p><strong>联系人：</strong>{config.contact}</p>
              <p><strong>邮箱：</strong>{config.email}</p>
              <p><strong>地址：</strong>{config.address}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">在线留言</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">姓名</label>
                <Input id="name" placeholder="您的姓名" />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">电话</label>
                <Input id="phone" placeholder="联系电话" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">邮箱</label>
              <Input id="email" placeholder="电子邮箱" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">留言内容</label>
              <Textarea id="message" placeholder="请输入您的留言内容..." className="min-h-[150px]" />
            </div>
            <Button type="submit" className="w-full">提交留言</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
