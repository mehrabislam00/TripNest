import { revalidateTag } from "next/cache"

export type Destination = {
  id: string
  title: string
  country: string
  category: string
  price: number
  duration: string
  image: string // image URL from your API
  rating?: number // average rating; the card shows "New" when missing
  description?: string
}

export const API_URL = process.env.API_URL ?? "http://localhost:5000"
export const DESTINATIONS_CACHE_TAG = "destinations"
export const DESTINATIONS_CACHE_SECONDS = 60

type Raw = Record<string, unknown>

const firstString = (...values: unknown[]) =>
  values.find((v): v is string => typeof v === "string" && v.trim() !== "")

/**
 * Maps whatever your backend returns into the shape the UI uses.
 * Handles common field names (name/title, imageUrl/image, _id/id).
 * If your API uses different names, add them here, in one place.
 */
export function normalizeDestination(raw: Raw, index: number): Destination {
  const rating = Number(raw.rating ?? raw.averageRating)
  return {
    id: String(raw._id ?? raw.id ?? index),
    title: firstString(raw.name, raw.title, raw.destinationName) ?? "Untitled",
    country: firstString(raw.country) ?? "",
    category: firstString(raw.category) ?? "Other",
    price: Number(raw.price) || 0,
    duration: firstString(raw.duration) ?? "",
    image: firstString(raw.imageUrl, raw.image, raw.img) ?? "",
    rating: rating > 0 ? rating : undefined,
    description: firstString(raw.description),
  }
}

export async function getDestinations(): Promise<{
  destinations: Destination[]
  error: boolean
}> {
  try {
    const res = await fetch(`${API_URL}/destinations`, {
      cache: "force-cache",
      next: {
        revalidate: DESTINATIONS_CACHE_SECONDS,
        tags: [DESTINATIONS_CACHE_TAG],
      },
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)

    const json = await res.json()
    // supports [..], { data: [..] } and { destinations: [..] }
    const list: Raw[] = Array.isArray(json)
      ? json
      : (json.data ?? json.destinations ?? [])

    return { destinations: list.map(normalizeDestination), error: false }
  } catch (err) {
    console.error("Failed to load destinations:", err)
    return { destinations: [], error: true }
  }
}

/**
 * Invalidates cached destinations after a successful destination mutation.
 * Call this from a Server Action or Route Handler, not a Client Component.
 */
export function invalidateDestinationsCache() {
  revalidateTag(DESTINATIONS_CACHE_TAG, "max")
}