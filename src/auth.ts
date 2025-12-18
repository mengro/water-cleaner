import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        const adminUsername = process.env.ADMIN_USERNAME ?? 'admin'
        const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin'

        if (
          credentials.username === adminUsername &&
          credentials.password === adminPassword
        ) {
          return { id: 'admin', name: adminUsername }
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
