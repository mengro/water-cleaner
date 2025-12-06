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
    id: "carbon",
    name: "活性炭系列",
    description: "强力吸附，深度净化",
    products: [
      { name: "椰壳活性炭", id: "coconut-carbon" },
      { name: "果壳活性炭", id: "shell-carbon" },
      { name: "粉状活性炭", id: "powder-carbon" },
    ]
  },
  {
    id: "filter-media",
    name: "滤料系列",
    description: "优质滤料，层层过滤",
    products: [
      { name: "石英砂", id: "quartz-sand" },
      { name: "无烟煤", id: "anthracite" },
      { name: "锰砂", id: "manganese-sand" },
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
];
