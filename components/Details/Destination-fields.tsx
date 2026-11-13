"use client"

import { useState } from "react"
import { ImageIcon } from "lucide-react"

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
import {
  CATEGORIES,
  MAX_DESCRIPTION,
  type DestinationErrors,
  type DestinationValues,
} from "@/lib/Destination-form"

// soft fill, teal focus ring
export const inputClass =
  "h-11 border-transparent bg-neutral-100/80 text-sm shadow-none transition-all duration-200 placeholder:text-neutral-400 hover:bg-neutral-100 focus-visible:border-[#1a9fc0] focus-visible:bg-white focus-visible:ring-[#1a9fc0]/25 aria-invalid:border-red-400"

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  hint?: React.ReactNode
  children: React.ReactNode
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

export default function DestinationFields({
  values,
  errors,
  onChange,
  showImagePreview = false,
}: {
  values: DestinationValues
  errors: DestinationErrors
  onChange: <K extends keyof DestinationValues>(
    key: K,
    value: DestinationValues[K]
  ) => void
  showImagePreview?: boolean
}) {
  const [failedUrl, setFailedUrl] = useState("")
  const imageFailed = failedUrl === values.imageUrl
  const showPreview = !!values.imageUrl && !errors.imageUrl && !imageFailed

  // keep an existing value selectable even if it isn't in the default list
  const categories =
    values.category && !CATEGORIES.includes(values.category)
      ? [...CATEGORIES, values.category]
      : CATEGORIES

  return (
    <div className="space-y-6">
      <Field label="Destination Name" htmlFor="name" error={errors.name}>
        <Input
          id="name"
          placeholder="Bali Paradise"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
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
            onChange={(e) => onChange("country", e.target.value)}
            aria-invalid={!!errors.country}
            className={inputClass}
          />
        </Field>

        <Field label="Category" htmlFor="category" error={errors.category}>
          <Select
            value={values.category}
            onValueChange={(v) => {
              if (v !== null) onChange("category", v)
            }}
          >
            <SelectTrigger
              id="category"
              aria-invalid={!!errors.category}
              className={`${inputClass} w-full data-[placeholder]:text-neutral-400`}
            >
              <SelectValue placeholder="Select category">
                {values.category || undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Price (BDT)" htmlFor="price" error={errors.price}>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
              ৳
            </span>
            <Input
              id="price"
              type="number"
              inputMode="decimal"
              min={0}
              placeholder="e.g., 1299"
              value={values.price}
              onChange={(e) => onChange("price", e.target.value)}
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
            onChange={(e) => onChange("duration", e.target.value)}
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
          onChange={(e) => onChange("departureDate", e.target.value)}
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
          onChange={(e) => onChange("imageUrl", e.target.value)}
          aria-invalid={!!errors.imageUrl}
          className={inputClass}
        />
        {showImagePreview && (
          <div className="relative mt-3 grid aspect-[16/7] place-items-center overflow-hidden rounded-xl border border-dashed border-neutral-200 bg-neutral-50 text-neutral-400">
            {showPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={values.imageUrl}
                alt="Destination preview"
                onError={() => setFailedUrl(values.imageUrl)}
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
        )}
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
          onChange={(e) => onChange("description", e.target.value)}
          aria-invalid={!!errors.description}
          className={`${inputClass} h-auto min-h-32 resize-none py-3`}
        />
      </Field>
    </div>
  )
}