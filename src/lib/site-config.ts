import { readConfigJson, writeConfigJson } from './cos';

const SITE_CONFIG_JSON_KEY = 'site-config.json';

export type SiteConfig = {
  id: string;
  brandName: string;
  companyName: string;
  tel: string;
  contact: string;
  email: string;
  address: string;
  aboutUs: string;
};

/**
 * 读取站点配置
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    return await readConfigJson<SiteConfig>(SITE_CONFIG_JSON_KEY);
  } catch {
    // 如果文件不存在或无效，返回默认配置
    return {
      id: 'default',
      brandName: '康备尔净水',
      companyName: '杭州康备尔设计咨询有限公司',
      tel: '',
      contact: '',
      email: '',
      address: '',
      aboutUs: '',
    };
  }
}

/**
 * 更新站点配置
 */
export async function updateSiteConfig(config: Omit<SiteConfig, 'id'>): Promise<SiteConfig> {
  const updatedConfig: SiteConfig = {
    id: 'default',
    ...config,
  };
  
  await writeConfigJson(SITE_CONFIG_JSON_KEY, updatedConfig);
  
  return updatedConfig;
}
