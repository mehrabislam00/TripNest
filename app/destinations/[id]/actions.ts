"use server"

import {
  deleteDestination as deleteDestinationAction,
  updateDestination as updateDestinationAction,
} from "@/lib/Actions"
import type { DestinationValues } from "@/lib/Destination-form"

export async function updateDestination(
  id: string,
  values: DestinationValues
): Promise<{ error?: string }> {
  return updateDestinationAction(id, values)
}

export async function deleteDestination(
  id: string
): Promise<{ error: string } | void> {
  return deleteDestinationAction(id)
}
