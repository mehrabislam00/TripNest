"use server"

import { revalidatePath } from "next/cache"

import { getSessionUser } from "@/lib/Profile"
import { API_URL } from "@/lib/api"
import { getAuthToken } from "@/lib/auth-token"


export async function cancelBooking(id: string): Promise<{ error?: string }> {
  const user = await getSessionUser()
  if (!user) return { error: "Your session has expired. Please sign in again." }

  try {
    const token = await getAuthToken()
    const res = await fetch(`${API_URL}/bookings/${encodeURIComponent(id)}`, {
      method: "PATCH", // marks it cancelled and keeps the history
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "cancelled" }),
    })
    if (!res.ok) return { error: `Couldn't cancel this booking (status ${res.status}).` }
  } catch {
    return { error: "Couldn't reach the server. Please try again." }
  }

  revalidatePath("/my-bookings")
  return {}
}