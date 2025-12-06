import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null
        
        // 简单起见，这里直接硬编码一个初始管理员账号
        // 实际生产中应该查询数据库并比对哈希密码
        // 既然是轻量级官网，我们可以先做一个简单的硬编码认证，或者查询 AdminUser 表
        
        // 方案1：查询数据库（推荐）
        const user = await prisma.adminUser.findUnique({
          where: { username: credentials.username as string }
        })

        if (!user) return null

        // 注意：这里为了演示方便，假设数据库里存的是明文密码
        // 生产环境必须使用 bcrypt.compare(credentials.password, user.password)
        if (user.password === credentials.password) {
          return { id: user.id, name: user.username }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
  },
})
