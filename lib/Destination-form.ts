import type { Destination } from "@/lib/destinations"

// Shared by the Add form, the Update dialog and the server actions.
export const CATEGORIES = [
  "Beach",
  "Mountain",
  "City",
  "Adventure",
  "Cultural",
  "Wildlife",
  "Luxury",
]

export const MAX_DESCRIPTION = 500

export type DestinationValues = {
  name: string
  country: string
  category: string
  price: string
  duration: string
  departureDate: string
  imageUrl: string
  description: string
}

export type DestinationErrors = Partial<Record<keyof DestinationValues, string>>

export const emptyValues: DestinationValues = {
  name: "",
  country: "",
  category: "",
  price: "",
  duration: "",
  departureDate: "",
  imageUrl: "",
  description: "",
}

export function valuesFromDestination(d: Destination): DestinationValues {
  return {
    name: d.title,
    country: d.country,
    category: d.category,
    price: d.price ? String(d.price) : "",
    duration: d.duration,
    departureDate: d.departureDate ?? "",
    imageUrl: d.image,
    description: d.description ?? "",
  }
}

export function validateDestination(v: DestinationValues): DestinationErrors {
  const e: DestinationErrors = {}
  if (!v.name.trim()) e.name = "Destination name is required"
  if (!v.country.trim()) e.country = "Country is required"
  if (!v.category) e.category = "Please choose a category"
  if (!v.price) e.price = "Price is required"
  else if (Number(v.price) <= 0) e.price = "Price must be greater than 0"
  if (!v.duration.trim()) e.duration = "Duration is required"
  if (!v.departureDate) e.departureDate = "Departure date is required"
  if (v.imageUrl) {
    try {
      new URL(v.imageUrl)
    } catch {
      e.imageUrl = "Enter a valid URL (https://...)"
    }
  }
  if (v.description.trim().length < 20)
    e.description = "Description should be at least 20 characters"
  return e
}

/** Body sent to your API. Rename keys here if your backend expects others. */
export function toApiPayload(v: DestinationValues) {
  return {
    name: v.name.trim(),
    country: v.country.trim(),
    category: v.category,
    price: Number(v.price),
    duration: v.duration.trim(),
    departureDate: v.departureDate,
    imageUrl: v.imageUrl.trim(),
    description: v.description.trim(),
  }
}