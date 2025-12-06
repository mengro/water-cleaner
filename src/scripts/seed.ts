import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. 初始化公司信息
  const config = await prisma.siteConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      brandName: "康备尔净水",
      companyName: "杭州康备尔设计咨询有限公司",
      tel: "18258831947",
      contact: "孙女士",
      email: "contact@kangbeier.com",
      address: "浙江省杭州市...",
      aboutUs: "杭州康备尔设计咨询有限公司集科研、生产、经营、服务于一体..."
    }
  })
  console.log('Site Config initialized:', config)

  // 2. 初始化产品分类
  const categories = [
    { name: "净水药剂", slug: "agents", description: "高效絮凝，快速沉淀" },
    { name: "活性炭系列", slug: "carbon", description: "强力吸附，深度净化" },
    { name: "滤料系列", slug: "filter-media", description: "优质滤料，层层过滤" },
    { name: "填料系列", slug: "fillers", description: "环保填料，提高效率" }
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    })
  }
  console.log('Categories initialized')

  // 3. 初始化示例产品 (以净水药剂为例)
  const agentCategory = await prisma.category.findUnique({ where: { slug: 'agents' } })
  if (agentCategory) {
    const products = [
      { name: "聚氯化铝 (PAC)", description: "高效净水剂" },
      { name: "聚丙烯酰胺 (PAM)", description: "高分子絮凝剂" },
      { name: "聚合氯化铝铁", description: "新型复合混凝剂" }
    ]

    for (const prod of products) {
      // 简单检查是否已存在，避免重复添加
      const existing = await prisma.product.findFirst({
        where: { name: prod.name, categoryId: agentCategory.id }
      })
      
      if (!existing) {
        await prisma.product.create({
          data: {
            name: prod.name,
            description: prod.description,
            categoryId: agentCategory.id,
            isPublished: true
          }
        })
      }
    }
    console.log('Example products initialized')
  }

  // 4. 初始化管理员账号
  const admin = await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: '123456' // ⚠️ 生产环境请务必修改密码或使用哈希
    }
  })
  console.log('Admin user initialized: admin / 123456')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
