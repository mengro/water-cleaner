export const baseInfo = {
  brandName: "康备尔净水",
  companyName: "杭州康备尔设计咨询有限公司",
  shortName: "康备尔设计咨询",
  tel: "18258831947",
  contact: "孙女士",
  email: "contact@kangbeier.com",
  address: "浙江省杭州市...",
};

export const navLinks = [
  { name: "首页", href: "/" },
  { name: "产品中心", href: "/products" },
  { name: "关于我们", href: "/about" },
  { name: "联系我们", href: "/contact" },
];

export const productCategories = [
  {
    id: "agents",
    name: "净水药剂",
    description: "高效絮凝，快速沉淀",
    products: [
      { name: "聚氯化铝 (PAC)", id: "pac" },
      { name: "聚丙烯酰胺 (PAM)", id: "pam" },
      { name: "聚合氯化铝铁", id: "pafc" },
    ]
  },
  {
    id: "filter-media",
    name: "滤料系列",
    description: "优质滤料，层层过滤（含活性炭）",
    products: [
      { name: "石英砂", id: "quartz-sand" },
      { name: "无烟煤", id: "anthracite" },
      { name: "锰砂", id: "manganese-sand" },
      { name: "椰壳活性炭", id: "coconut-carbon" },
      { name: "果壳活性炭", id: "shell-carbon" },
      { name: "粉状活性炭", id: "powder-carbon" },
      { name: "柱状活性炭", id: "columnar-carbon" },
    ]
  },
  {
    id: "fillers",
    name: "填料系列",
    description: "环保填料，提高效率",
    products: [
      { name: "蜂窝斜管", id: "honeycomb" },
      { name: "纤维球", id: "fiber-ball" },
    ]
  },
  {
    id: "bio-culture",
    name: "生物菌种",
    description: "高效菌种，生物降解",
    products: [
      { name: "硝化细菌", id: "nitrifying-bacteria" },
      { name: "反硝化细菌", id: "denitrifying-bacteria" },
      { name: "光合细菌", id: "photosynthetic-bacteria" },
      { name: "复合益生菌", id: "compound-probiotics" },
    ]
  },
  {
    id: "integrated-equipment",
    name: "一体化污水处理",
    description: "成套设备，一站式解决方案",
    products: [
      { name: "一体化污水处理设备", id: "integrated-equipment" },
      { name: "MBR膜污水处理设备", id: "mbr-equipment" },
      { name: "气浮机", id: "daf-machine" },
    ]
  },
];
