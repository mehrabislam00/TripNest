import { API_URL } from "@/lib/destinations"

export type BookingStatus = "confirmed" | "pending" | "cancelled"

export type Booking = {
  id: string
  destinationId?: string
  title: string
  image: string
  departureDate?: string // yyyy-mm-dd
  price: number
  status: BookingStatus
}

type Raw = Record<string, unknown>

const firstString = (...values: unknown[]) =>
  values.find((v): v is string => typeof v === "string" && v.trim() !== "")

/** Reads an id from a string, a number, or an object like { _id } / { id } / { $oid }. */
function idOf(value: unknown): string | undefined {
  if (typeof value === "string") return value.trim() || undefined
  if (typeof value === "number") return String(value)
  if (value && typeof value === "object") {
    const o = value as Raw
    return idOf(o._id ?? o.id ?? o.$oid)
  }
  return undefined
}

function normalizeStatus(value: unknown): BookingStatus {
  const s = typeof value === "string" ? value.toLowerCase() : ""
  if (s.includes("cancel")) return "cancelled"
  if (/(confirm|paid|booked|approved)/.test(s)) return "confirmed"
  return "pending"
}

/** Maps your backend's booking documents to the shape the UI uses. */
export function normalizeBooking(raw: Raw, index: number): Booking {
  const date = firstString(raw.departureDate, raw.date)
  return {
    id: String(raw._id ?? raw.id ?? index),
    // which destination this booking is for (the View button links to it)
    destinationId:
      idOf(raw.destinationId) ??
      idOf(raw.destination_id) ??
      idOf(raw.destination) ??
      idOf(raw.packageId) ??
      idOf(raw.tripId),
    title:
      firstString(raw.destinationName, raw.title, raw.name) ?? "Travel package",
    image: firstString(raw.imageUrl, raw.image, raw.img) ?? "",
    departureDate: date && /^\d{4}-\d{2}-\d{2}/.test(date) ? date.slice(0, 10) : undefined,
    price: Number(raw.totalPrice ?? raw.totalAmount ?? raw.price) || 0,
    status: normalizeStatus(raw.status),
  }
}

/**
 * Expects GET /bookings?userId=... to return an array (or { data: [...] }).
 * Adjust the endpoint here if your backend differs.
 */
export async function getBookings(userId: string): Promise<{
  bookings: Booking[]
  error: boolean
}> {
  try {
    const res = await fetch(
      `${API_URL}/bookings?userId=${encodeURIComponent(userId)}`,
      { cache: "no-store" }
    )
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)

    const json = await res.json()
    const list: Raw[] = Array.isArray(json) ? json : (json.data ?? json.bookings ?? [])

    const bookings = list.map(normalizeBooking).sort((a, b) => {
      // active bookings first (soonest departure on top), cancelled last
      if ((a.status === "cancelled") !== (b.status === "cancelled"))
        return a.status === "cancelled" ? 1 : -1
      return (a.departureDate ?? "9999").localeCompare(b.departureDate ?? "9999")
    })
    return { bookings, error: false }
  } catch (err) {
    console.error("Failed to load bookings:", err)
    return { bookings: [], error: true }
  }
}