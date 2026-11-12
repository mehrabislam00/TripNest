"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, ImageIcon, Loader2, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const CATEGORIES = [
  "Beach",
  "Mountain",
  "City",
  "Adventure",
  "Cultural",
  "Wildlife",
  "Luxury",
]

const MAX_DESCRIPTION = 500

const initialValues = {
  name: "",
  country: "",
  category: "",
  price: "",
  duration: "",
  departureDate: "",
  imageUrl: "",
  description: "",
}

type Values = typeof initialValues
type Errors = Partial<Record<keyof Values, string>>

function validate(v: Values): Errors {
  const e: Errors = {}
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

// small helper to keep field + label + error markup in one place
function Field({
  label,
  htmlFor,
  error,
  children,
  hint,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
  hint?: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={htmlFor} className="text-sm font-medium text-neutral-900">
          {label}
        </Label>
        {hint}
      </div>
      {children}
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

// shared input styling: soft fill, teal focus ring
const inputClass =
  "h-11 border-transparent bg-neutral-100/80 text-sm shadow-none transition-all duration-200 placeholder:text-neutral-400 hover:bg-neutral-100 focus-visible:border-[#1a9fc0] focus-visible:bg-white focus-visible:ring-[#1a9fc0]/25 aria-invalid:border-red-400"

export default function AddDestinationForm() {
  const router = useRouter()
  const [values, setValues] = useState<Values>(initialValues)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [imageFailed, setImageFailed] = useState(false)

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
    if (success) setSuccess(false)
    if (submissionError) setSubmissionError(null)
    if (key === "imageUrl") setImageFailed(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    setSubmissionError(null)
    try {
      const res = await fetch("http://localhost:5000/add_destination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || "Failed to add destination")
      }
      setSuccess(true)
      setValues(initialValues)
      router.push("/add-destination")
    } catch (error) {
      setSubmissionError(
        error instanceof Error ? error.message : "Failed to add destination",
      )
    } finally {
      setSubmitting(false)
    }
  }

  const showPreview = values.imageUrl && !errors.imageUrl && !imageFailed



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

          {submissionError && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200"
            >
              {submissionError}
            </div>
          )}

          <Field label="Destination Name" htmlFor="name" error={errors.name}>
            <Input
              id="name"
              placeholder="Bali Paradise"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              aria-invalid={!!errors.name}
              className={inputClass}
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Country" htmlFor="country" error={errors.country}>
              <Input
                id="country"
                placeholder="Indonesia"
                value={values.country}
                onChange={(e) => set("country", e.target.value)}
                aria-invalid={!!errors.country}
                className={inputClass}
              />
            </Field>

            <Field label="Category" htmlFor="category" error={errors.category}>
              <Select
                value={values.category}
                onValueChange={(v) => set("category", v ?? "")}
              >
                <SelectTrigger
                  id="category"
                  aria-invalid={!!errors.category}
                  className={`${inputClass} w-full data-[placeholder]:text-neutral-400`}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Price (USD)" htmlFor="price" error={errors.price}>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  placeholder="e.g., 1299"
                  value={values.price}
                  onChange={(e) => set("price", e.target.value)}
                  aria-invalid={!!errors.price}
                  className={`${inputClass} pl-7`}
                />
              </div>
            </Field>

            <Field label="Duration" htmlFor="duration" error={errors.duration}>
              <Input
                id="duration"
                placeholder="e.g., 7 Days/6 Nights"
                value={values.duration}
                onChange={(e) => set("duration", e.target.value)}
                aria-invalid={!!errors.duration}
                className={inputClass}
              />
            </Field>
          </div>

          <Field
            label="Departure Date"
            htmlFor="departureDate"
            error={errors.departureDate}
          >
            <Input
              id="departureDate"
              type="date"
              value={values.departureDate}
              onChange={(e) => set("departureDate", e.target.value)}
              aria-invalid={!!errors.departureDate}
              className={inputClass}
            />
          </Field>

          <Field label="Image URL" htmlFor="imageUrl" error={errors.imageUrl}>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={values.imageUrl}
              onChange={(e) => set("imageUrl", e.target.value)}
              aria-invalid={!!errors.imageUrl}
              className={inputClass}
            />
            {/* live preview */}
            <div className="relative mt-3 grid aspect-[16/7] place-items-center overflow-hidden rounded-xl border border-dashed border-neutral-200 bg-neutral-50 text-neutral-400">
              {showPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={values.imageUrl}
                  alt="Destination preview"
                  onError={() => setImageFailed(true)}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-xs">
                  <ImageIcon className="size-6" />
                  {imageFailed
                    ? "Couldn't load this image"
                    : "Image preview will appear here"}
                </div>
              )}
            </div>
          </Field>

          <Field
            label="Description"
            htmlFor="description"
            error={errors.description}
            hint={
              <span className="text-xs tabular-nums text-neutral-400">
                {values.description.length}/{MAX_DESCRIPTION}
              </span>
            }
          >
            <Textarea
              id="description"
              rows={5}
              maxLength={MAX_DESCRIPTION}
              placeholder="Describe the travel experience..."
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
              aria-invalid={!!errors.description}
              className={`${inputClass} h-auto min-h-32 resize-none py-3`}
            />
          </Field>

          {/* Actions */}
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