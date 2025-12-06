import { baseInfo } from "@/config"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">关于我们</h1>
      <div className="prose max-w-none text-slate-700 leading-relaxed space-y-6">
        <p>
          <strong>{baseInfo.companyName}</strong>集科研、生产、经营、服务于一体，是从事水处理剂的开发、生产、经营及从事水处理工程的设计、研发、运营及各类废水，噪音治理的专业企业。
        </p>
        <p>
          本公司与多所高等院校及化工科研单位合作，研制生产出“田邦”“中禹”牌絮凝剂系列产品：聚氯化铝、聚氯化铝铁，等并提供聚丙烯酰胺和具有阻垢、分散、缓蚀、杀菌、除油，混凝等多种性能的几十种药剂及各种水处理化工配料，产品广泛用于饮用水，工业用水循环水及各类污水。
        </p>
        <p>
          本公司积极推广《质量管理和质量保证》标准，实施品牌战略。公司拥有一支技术过硬的队伍，其中技术管理人员30余人，施工销售人员100多人，公司精心为用户分析水样，改进用户水处理设备，针对不同的水质特点将水处理工艺和药剂进行计术处理，为用户提供最佳处理工艺及处理方法，使用户运行成本明显降低，收到显著的社会效益和经济效益。
        </p>
        <p>
          公司本着“满足顾客需求是田邦人永恒追求”的质量方针，遵循“田邦科技，让您满意”的宗旨，坚持一流管理、一流品质、一流服务。新世纪，让绿色成为永恒是我们的目标，本公司将一如既往为环保产业的发展作出自己的贡献。
        </p>
        <p className="font-bold text-lg text-primary mt-8">
          敬业 团队 创新 诚信服务
        </p>
      </div>
    </div>
  )
}
