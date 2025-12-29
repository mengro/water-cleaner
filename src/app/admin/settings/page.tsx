import { getSiteConfig } from "@/lib/site-config";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const siteConfig = await getSiteConfig();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">网站配置</h1>
        <p className="text-muted-foreground mt-2">
          管理网站的基本信息和配置
        </p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <SettingsForm initialData={siteConfig} />
      </div>
    </div>
  );
}
