"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Loader2, Save, X } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  emptyValues,
  validateDestination,
  type DestinationErrors,
  type DestinationValues,
} from "@/lib/Destination-form"
import DestinationFields from "../Details/Destination-fields"

export default function AddDestinationForm() {
  const router = useRouter()
  const [values, setValues] = useState<DestinationValues>(emptyValues)
  const [errors, setErrors] = useState<DestinationErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = <K extends keyof DestinationValues>(
    key: K,
    value: DestinationValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
    if (success) setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found = validateDestination(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    try {
      // TODO: replace with your real API call, e.g.
      // await fetch("/api/destinations", { method: "POST", body: JSON.stringify(toApiPayload(values)) })
      await new Promise((r) => setTimeout(r, 900))
      setValues(emptyValues)
      setSuccess(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="rounded-2xl border-0 bg-white py-0 shadow-xl shadow-black/5 ring-1 ring-black/5">
      <CardContent className="p-6 sm:p-10">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {success && (
            <div
              role="status"
              className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200"
            >
              <CheckCircle2 className="size-5 shrink-0" />
              Travel package added successfully.
            </div>
          )}

          <DestinationFields
            values={values}
            errors={errors}
            onChange={set}
            showImagePreview
          />

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={submitting}
              className="h-11 gap-2 border-red-300 px-6 text-red-500 transition-all duration-300 hover:border-red-500 hover:bg-red-500 hover:text-white"
            >
              <X className="size-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="group h-11 gap-2 bg-[#1a9fc0] px-6 shadow-md shadow-[#1a9fc0]/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#168aa8] hover:shadow-lg hover:shadow-[#1a9fc0]/40"
            >
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4 transition-transform duration-300 group-hover:scale-110" />
              )}
              {submitting ? "Adding..." : "Add Travel Package"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}