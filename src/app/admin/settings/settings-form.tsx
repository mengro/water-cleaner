"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveSiteConfig } from "./actions";
import { useRouter } from "next/navigation";
import type { SiteConfig } from "@/lib/site-config";

export function SettingsForm({
  initialData,
}: {
  initialData: SiteConfig;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  return (
    <form
      action={async (formData) => {
        setIsSaving(true);
        setSaveSuccess(false);
        try {
          await saveSiteConfig(formData);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
          router.refresh();
        } catch (error) {
          console.error('保存失败:', error);
          alert('保存失败，请重试');
        } finally {
          setIsSaving(false);
        }
      }}
      className="space-y-6 max-w-2xl"
    >
      <div className="space-y-2">
        <Label htmlFor="brandName">品牌名称</Label>
        <Input
          id="brandName"
          name="brandName"
          defaultValue={initialData.brandName}
          required
          placeholder="请输入品牌名称"
        />
        <p className="text-sm text-muted-foreground">
          显示在网站头部和标题中
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName">公司全称</Label>
        <Input
          id="companyName"
          name="companyName"
          defaultValue={initialData.companyName}
          placeholder="请输入公司全称"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tel">联系电话</Label>
        <Input
          id="tel"
          name="tel"
          type="tel"
          defaultValue={initialData.tel}
          placeholder="请输入联系电话"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact">联系人</Label>
        <Input
          id="contact"
          name="contact"
          defaultValue={initialData.contact}
          placeholder="请输入联系人姓名"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">联系邮箱</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={initialData.email}
          placeholder="请输入联系邮箱"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">公司地址</Label>
        <Input
          id="address"
          name="address"
          defaultValue={initialData.address}
          placeholder="请输入公司地址"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="aboutUs">关于我们</Label>
        <Textarea
          id="aboutUs"
          name="aboutUs"
          defaultValue={initialData.aboutUs}
          className="min-h-[200px]"
          placeholder="请输入公司简介、关于我们等详细信息"
        />
        <p className="text-sm text-muted-foreground">
          支持 Markdown 格式
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? '保存中...' : '保存配置'}
        </Button>
        {saveSuccess && (
          <span className="text-sm text-green-600">保存成功！</span>
        )}
      </div>
    </form>
  );
}
