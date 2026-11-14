"use server"

import { revalidatePath } from "next/cache"

import { API_URL } from "@/lib/destinations"
import { getSessionUser } from "./Profile"


export type ProfileValues = {
  name: string
  phone: string
  address: string
  avatar: string
}

export async function updateProfile(
  values: ProfileValues
): Promise<{ error?: string }> {
  // the user id comes from the session, never from the client
  const user = await getSessionUser()
  if (!user) return { error: "Your session has expired. Please sign in again." }

  if (!values.name.trim()) return { error: "Name is required." }

  // avatar: empty, an uploaded image (data URL from the browser) or an https link
  const avatar = values.avatar.trim()
  const validAvatar =
    avatar === "" ||
    /^https?:\/\//.test(avatar) ||
    /^data:image\/(jpeg|png|webp);base64,/.test(avatar)
  if (!validAvatar || avatar.length > 200_000) {
    return { error: "That profile photo isn't supported. Try a smaller JPG or PNG." }
  }

  try {
    const res = await fetch(`${API_URL}/user/${encodeURIComponent(user.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      // send every field your PATCH route $sets; undefined would be saved as null.
      // Email stays as-is. Passwords are NOT sent: Better Auth manages them.
      body: JSON.stringify({
        name: values.name.trim(),
        email: user.email,
        phone: values.phone.trim(),
        address: values.address.trim(),
        avatar,
      }),
    })
    if (!res.ok) return { error: `Couldn't save your profile (status ${res.status}).` }
  } catch {
    return { error: "Couldn't reach the server. Please try again." }
  }

  revalidatePath("/profile")
  return {}
}