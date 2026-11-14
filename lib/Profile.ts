import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { API_URL } from "@/lib/destinations"

export type Profile = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  avatar: string
  memberSince?: string // ISO date
}

export type ProfileStats = {
  totalBookings: number
  countriesVisited: number
  upcomingTrips: number
  totalSpent: number
}

type Raw = Record<string, unknown>

const str = (v: unknown) =>
  typeof v === "string" && v.trim() !== "" ? v.trim() : undefined

/** Current logged-in user from Better Auth, or null. Server only. */
export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

async function getJson(path: string): Promise<unknown | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" })
    return res.ok ? await res.json() : null
  } catch {
    return null
  }
}

/**
 * Session data (name, email, image, createdAt) merged with the extra fields
 * stored in your `userProfiles` collection (phone, address, avatar).
 */
export async function getProfile(
  user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>>
): Promise<Profile> {
  const extra = ((await getJson(`/user/${encodeURIComponent(user.id)}`)) ?? {}) as Raw

  return {
    id: user.id,
    name: str(extra.name) ?? user.name,
    email: user.email,
    phone: str(extra.phone) ?? "",
    address: str(extra.address) ?? "",
    avatar: str(extra.avatar) ?? user.image ?? "",
    memberSince: user.createdAt
      ? new Date(user.createdAt as Date | string).toISOString()
      : undefined,
  }
}

/**
 * Travel statistics computed from the user's bookings.
 * Expects GET /bookings?email=... to return an array (or { data: [...] }).
 * Adjust the endpoint / field names here if your backend differs.
 */
export async function getProfileStats(email: string): Promise<ProfileStats> {
  const json = (await getJson(`/bookings?email=${encodeURIComponent(email)}`)) as
    | Raw[]
    | { data?: Raw[] }
    | null
  const all = Array.isArray(json) ? json : (json?.data ?? [])
  const bookings = all.filter((b) => str(b.status)?.toLowerCase() !== "cancelled")

  const today = new Date().toISOString().slice(0, 10)

  return {
    totalBookings: bookings.length,
    countriesVisited: new Set(
      bookings.map((b) => str(b.country)?.toLowerCase()).filter(Boolean)
    ).size,
    upcomingTrips: bookings.filter((b) => {
      const date = str(b.departureDate) ?? str(b.date)
      return date ? date.slice(0, 10) >= today : false
    }).length,
    totalSpent: bookings.reduce(
      (sum, b) => sum + (Number(b.totalPrice ?? b.totalAmount ?? b.price) || 0),
      0
    ),
  }
}