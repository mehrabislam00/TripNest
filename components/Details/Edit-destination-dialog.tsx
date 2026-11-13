"use client"

import { useState, useTransition } from "react"
import { Loader2, Save, X } from "lucide-react"

import { updateDestination } from "@/app/destinations/[id]/actions"
import DestinationFields from "./Destination-fields"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  validateDestination,
  valuesFromDestination,
  type DestinationErrors,
  type DestinationValues,
} from "@/lib/Destination-form"
import type { Destination } from "@/lib/destinations"

export default function EditDestinationDialog({
  destination,
  open,
  onOpenChange,
}: {
  destination: Destination
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [values, setValues] = useState<DestinationValues>(() =>
    valuesFromDestination(destination)
  )
  const [errors, setErrors] = useState<DestinationErrors>({})
  const [formError, setFormError] = useState("")
  const [pending, startTransition] = useTransition()

  const set = <K extends keyof DestinationValues>(
    key: K,
    value: DestinationValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const found = validateDestination(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setFormError("")
    startTransition(async () => {
      const res = await updateDestination(destination.id, values)
      if (res.error) setFormError(res.error)
      else onOpenChange(false) // page data refreshes automatically
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !pending && onOpenChange(v)}>
      <DialogContent className="max-h-[92svh] gap-0 overflow-y-auto rounded-2xl p-0 sm:max-w-xl">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader className="px-6 pb-4 pt-6 sm:px-8">
            <DialogTitle className="text-xl font-medium text-neutral-900">
              Update Travel Package
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              Make changes to the travel package details below
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 pb-2 sm:px-8">
            <DestinationFields
              values={values}
              errors={errors}
              onChange={set}
            />
            {formError && (
              <p
                role="alert"
                className="mt-5 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-200"
              >
                {formError}
              </p>
            )}
          </div>

          <DialogFooter className="flex-col-reverse gap-3 px-6 pb-6 pt-6 sm:flex-row sm:px-8">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => onOpenChange(false)}
              className="h-11 gap-2 border-red-300 px-6 text-red-500 transition-all duration-300 hover:border-red-500 hover:bg-red-500 hover:text-white"
            >
              <X className="size-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="group h-11 gap-2 bg-[#1a9fc0] px-6 shadow-md shadow-[#1a9fc0]/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#168aa8] hover:shadow-lg hover:shadow-[#1a9fc0]/40"
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4 transition-transform duration-300 group-hover:scale-110" />
              )}
              {pending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}