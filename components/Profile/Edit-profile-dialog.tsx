"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Camera, Loader2, Save, Trash2, Upload, X } from "lucide-react"


import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { ProfileValues, updateProfile } from "@/lib/Actions-Profile"
import { Profile } from "@/lib/Profile"
import { Avatar } from "./Profile-avatar"
import { fileToAvatarDataUrl, MAX_AVATAR_MB } from "@/lib/Image"


const inputClass =
  "h-10 border-transparent bg-neutral-100/80 text-sm shadow-none transition-all duration-200 placeholder:text-neutral-400 hover:bg-neutral-100 focus-visible:border-[#1a9fc0] focus-visible:bg-white focus-visible:ring-[#1a9fc0]/25 aria-invalid:border-red-400 disabled:opacity-60"

type Errors = Partial<Record<keyof ProfileValues, string>>

const toValues = (p: Profile): ProfileValues => ({
  name: p.name,
  phone: p.phone,
  address: p.address,
  avatar: p.avatar,
})

function validate(v: ProfileValues): Errors {
  const e: Errors = {}
  if (!v.name.trim()) e.name = "Name is required"
  if (v.phone && !/^[+\d][\d\s()-]{5,19}$/.test(v.phone.trim()))
    e.phone = "Enter a valid phone number"
  return e
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-neutral-700">
        {label}
      </Label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default function EditProfileDialog({
  profile,
  open,
  onOpenChange,
}: {
  profile: Profile
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [values, setValues] = useState<ProfileValues>(() => toValues(profile))
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState("")
  const [processing, setProcessing] = useState(false) // resizing the chosen photo
  const [dragging, setDragging] = useState(false)
  const [pending, startTransition] = useTransition()

  // reopen from the saved values (discards unsaved edits)
  useEffect(() => {
    if (open) {
      setValues(toValues(profile))
      setErrors({})
      setFormError("")
    }
  }, [open, profile])

  const busy = pending || processing

  const set =
    (key: keyof ProfileValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [key]: e.target.value }))
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
    }

  const handleFile = async (file?: File) => {
    if (!file) return
    setErrors((prev) => ({ ...prev, avatar: undefined }))
    setProcessing(true)
    try {
      const dataUrl = await fileToAvatarDataUrl(file)
      setValues((prev) => ({ ...prev, avatar: dataUrl }))
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        avatar: err instanceof Error ? err.message : "Couldn't use that image.",
      }))
    } finally {
      setProcessing(false)
      if (fileRef.current) fileRef.current.value = "" // allow re-picking the same file
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setFormError("")
    startTransition(async () => {
      const res = await updateProfile(values)
      if (res.error) return setFormError(res.error)

      // keep the Better Auth session (navbar name / photo) in sync
      await authClient.updateUser({
        name: values.name.trim(),
        image: values.avatar.trim() || null,
      })
      router.refresh()
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !busy && onOpenChange(v)}>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-2xl">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader className="px-6 pb-4 pt-6">
            <DialogTitle className="text-xl font-medium text-neutral-900">
              Edit Profile
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              Update your photo and personal details
            </DialogDescription>
          </DialogHeader>

          {/* Body: photo on the left, fields on the right (stacked on mobile) */}
          <div className="grid max-h-[calc(100svh-13rem)] gap-6 overflow-y-auto overflow-x-hidden px-6 pb-6 sm:grid-cols-[190px_1fr]">
            {/* Photo uploader */}
            <div className="flex items-center gap-4 sm:flex-col sm:gap-3 sm:border-r sm:border-neutral-100 sm:pr-6">
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragging(false)
                  handleFile(e.dataTransfer.files?.[0])
                }}
                className="relative shrink-0"
              >
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={busy}
                  aria-label="Upload profile photo"
                  className={`group relative block rounded-full transition-all duration-300 ${
                    dragging ? "scale-105 ring-4 ring-[#1a9fc0]/40" : "ring-4 ring-neutral-100"
                  }`}
                >
                  <Avatar
                    key={values.avatar}
                    src={values.avatar}
                    name={values.name || profile.name}
                    className="size-24 text-4xl sm:size-32 sm:text-5xl"
                  />
                  <span
                    className={`absolute inset-0 grid place-items-center rounded-full bg-black/45 text-white transition-opacity duration-300 ${
                      processing ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {processing ? (
                      <Loader2 className="size-6 animate-spin" />
                    ) : (
                      <Camera className="size-6" />
                    )}
                  </span>
                </button>
              </div>

              <div className="flex min-w-0 flex-col items-start gap-2 sm:items-center">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  tabIndex={-1}
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={() => fileRef.current?.click()}
                  className="h-9 gap-2 transition-all duration-300 hover:border-[#1a9fc0] hover:bg-[#1a9fc0]/10 hover:text-[#1a9fc0]"
                >
                  <Upload className="size-3.5" />
                  Upload photo
                </Button>

                {values.avatar && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setValues((p) => ({ ...p, avatar: "" }))}
                    className="flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-red-600"
                  >
                    <Trash2 className="size-3.5" />
                    Remove photo
                  </button>
                )}

                <p className="text-[11px] leading-snug text-neutral-500 sm:text-center">
                  JPG, PNG or WebP
                  <br />
                  up to {MAX_AVATAR_MB} MB
                </p>
                {errors.avatar && (
                  <p role="alert" className="text-xs text-red-600 sm:text-center">
                    {errors.avatar}
                  </p>
                )}
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <Field id="name" label="Full Name" error={errors.name}>
                <Input
                  id="name"
                  value={values.name}
                  onChange={set("name")}
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  className={inputClass}
                />
              </Field>

              <Field id="email" label="Email (can't be changed)">
                <Input id="email" value={profile.email} disabled className={inputClass} />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="phone" label="Phone" error={errors.phone}>
                  <Input
                    id="phone"
                    type="tel"
                    value={values.phone}
                    onChange={set("phone")}
                    placeholder="+880 1XXX-XXXXXX"
                    aria-invalid={!!errors.phone}
                    className={inputClass}
                  />
                </Field>
                <Field id="address" label="Location">
                  <Input
                    id="address"
                    value={values.address}
                    onChange={set("address")}
                    placeholder="City, Country"
                    className={inputClass}
                  />
                </Field>
              </div>

              {formError && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-200"
                >
                  {formError}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 bg-neutral-50/70 px-6 py-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => onOpenChange(false)}
              className="h-10 gap-2 border-red-300 bg-white px-5 text-red-500 transition-all duration-300 hover:border-red-500 hover:bg-red-500 hover:text-white"
            >
              <X className="size-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={busy}
              className="group h-10 gap-2 bg-[#1a9fc0] px-5 shadow-md shadow-[#1a9fc0]/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#168aa8] hover:shadow-lg hover:shadow-[#1a9fc0]/40"
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4 transition-transform duration-300 group-hover:scale-110" />
              )}
              {pending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}