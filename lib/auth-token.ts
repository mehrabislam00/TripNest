import { headers } from "next/headers"

import { auth } from "@/lib/auth"

export async function getAuthToken(): Promise<string> {
  const { token } = await auth.api.getToken({ headers: await headers() })

  if (!token) {
    throw new Error("Authentication token was not returned")
  }

  return token
}
