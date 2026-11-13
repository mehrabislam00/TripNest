"use server"

import { redirect } from "next/navigation"

import {
  toApiPayload,
  validateDestination,
  type DestinationValues,
} from "@/lib/Destination-form"
import { API_URL, refreshDestinationsNow } from "@/lib/destinations"

const url = (id: string) =>
  `${API_URL}/destinations/${encodeURIComponent(id)}`

// Runs on the server, so there are no CORS issues with your API.
export async function updateDestination(
  id: string,
  values: DestinationValues
): Promise<{ error?: string }> {
  if (Object.keys(validateDestination(values)).length > 0) {
    return { error: "Please check the form and try again." }
  }

  try {
    const res = await fetch(url(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toApiPayload(values)),
    })
    if (!res.ok) return { error: `Couldn't save changes (status ${res.status}).` }
  } catch {
    return { error: "Couldn't reach the server. Please try again." }
  }

  refreshDestinationsNow() // the page shows the new data immediately
  return {}
}

export async function deleteDestination(
  id: string
): Promise<{ error: string } | void> {
  try {
    const res = await fetch(url(id), { method: "DELETE" })
    if (!res.ok && res.status !== 404) {
      return { error: `Couldn't delete this destination (status ${res.status}).` }
    }
  } catch {
    return { error: "Couldn't reach the server. Please try again." }
  }

  refreshDestinationsNow()
  redirect("/destinations")
}