import { revalidateTag, updateTag } from "next/cache"

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
  departureDate?: string // yyyy-mm-dd
  highlights?: string[] // optional list shown on the details page
  reviewCount?: number
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
export function normalizeDestination(
  raw: Raw,
  fallbackId: number | string
): Destination {
  const rating = Number(raw.rating ?? raw.averageRating)
  const reviewCount = Array.isArray(raw.reviews)
    ? raw.reviews.length
    : Number(raw.reviewCount ?? raw.reviews)
  const date = firstString(raw.departureDate, raw.date)

  return {
    id: String(raw._id ?? raw.id ?? fallbackId),
    title: firstString(raw.name, raw.title, raw.destinationName) ?? "Untitled",
    country: firstString(raw.country) ?? "",
    category: firstString(raw.category) ?? "Other",
    price: Number(raw.price) || 0,
    duration: firstString(raw.duration) ?? "",
    image: firstString(raw.imageUrl, raw.image, raw.img) ?? "",
    rating: rating > 0 ? rating : undefined,
    description: firstString(raw.description),
    departureDate: date && /^\d{4}-\d{2}-\d{2}/.test(date) ? date.slice(0, 10) : undefined,
    highlights: Array.isArray(raw.highlights)
      ? raw.highlights.filter((h): h is string => typeof h === "string" && h.trim() !== "")
      : undefined,
    reviewCount: reviewCount > 0 ? reviewCount : undefined,
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

/** Fetches one destination. `destination: null` + `error: false` means 404. */
export async function getDestination(id: string): Promise<{
  destination: Destination | null
  error: boolean
}> {
  try {
    const res = await fetch(`${API_URL}/destinations/${encodeURIComponent(id)}`, {
      cache: "force-cache",
      next: {
        revalidate: DESTINATIONS_CACHE_SECONDS,
        tags: [DESTINATIONS_CACHE_TAG],
      },
    })
    if (res.status === 404) return { destination: null, error: false }
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)

    const json = await res.json()
    // supports { ... }, { data: { ... } } and { destination: { ... } }
    const raw: Raw = json.data ?? json.destination ?? json
    return { destination: normalizeDestination(raw, id), error: false }
  } catch (err) {
    console.error(`Failed to load destination ${id}:`, err)
    return { destination: null, error: true }
  }
}

/**
 * Invalidates cached destinations after a successful destination mutation.
 * Call this from a Server Action or Route Handler, not a Client Component.
 */
export function invalidateDestinationsCache() {
  revalidateTag(DESTINATIONS_CACHE_TAG, "max")
}

/**
 * Expires cached destinations immediately (read-your-writes), so the next
 * render after an edit or delete shows fresh data. Server Actions only.
 */
export function refreshDestinationsNow() {
  updateTag(DESTINATIONS_CACHE_TAG)
}