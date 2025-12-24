'use server'

import { signIn, signOut } from "@/auth"

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirectTo: "/admin",
    })
  } catch (error: any) {
    if (error.type === 'CredentialsSignin') {
      return '用户名或密码错误。'
    }
    throw error
  }
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/login" })
}
