"use client"

import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

/** Page wrapper: centered heading + card, with a soft entrance animation. */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-gradient-to-b from-sky-50/80 to-white px-4 pb-16 pt-32">
      <div className="pointer-events-none absolute -left-32 top-24 size-96 rounded-full bg-[#1a9fc0]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 size-96 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="animate-in fade-in slide-in-from-bottom-3 relative w-full max-w-md duration-500 motion-reduce:animate-none">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-neutral-600">{subtitle}</p>
        </header>

        <Card className="rounded-2xl border-0 bg-white py-0 shadow-xl shadow-black/5 ring-1 ring-black/5">
          <CardContent className="p-6 sm:p-8">{children}</CardContent>
        </Card>
      </div>
    </main>
  )
}

/** Label + input with a leading icon (+ show/hide toggle for passwords). */
export function AuthInput({
  id,
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  disabled,
}: {
  id: string
  label: string
  icon: LucideIcon
  type?: "text" | "email" | "password"
  value: string
  onChange: (value: string) => void
  placeholder: string
  error?: string
  autoComplete?: string
  disabled?: boolean
}) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === "password"

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-neutral-900">
        {label}
      </Label>
      <div className="group relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400 transition-colors duration-200 group-focus-within:text-[#1a9fc0]" />
        <Input
          id={id}
          type={isPassword && visible ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={!!error}
          className={`h-11 border-transparent bg-neutral-100/80 pl-10 text-sm shadow-none transition-all duration-200 placeholder:text-neutral-400 hover:bg-neutral-100 focus-visible:border-[#1a9fc0] focus-visible:bg-white focus-visible:ring-[#1a9fc0]/25 aria-invalid:border-red-400 ${
            isPassword ? "pr-11" : ""
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-200/60 hover:text-neutral-700"
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export function SubmitButton({
  pending,
  idle,
  busy,
}: {
  pending: boolean
  idle: string
  busy: string
}) {
  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 w-full gap-2 bg-[#1a9fc0] text-sm font-medium shadow-md shadow-[#1a9fc0]/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#168aa8] hover:shadow-lg hover:shadow-[#1a9fc0]/40 active:translate-y-0"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? busy : idle}
    </Button>
  )
}

export function FormError({ message }: { message: string }) {
  if (!message) return null
  return (
    <p
      role="alert"
      className="animate-in fade-in rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-200"
    >
      {message}
    </p>
  )
}

export function OrDivider({ text }: { text: string }) {
  return (
    <div className="relative my-6 flex items-center">
      <span className="h-px flex-1 bg-neutral-200" />
      <span className="px-3 text-xs text-neutral-500">{text}</span>
      <span className="h-px flex-1 bg-neutral-200" />
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-4" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z" />
      <path fill="#FBBC05" d="M10.5 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.1.8-4.6l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  )
}

export function GoogleButton({
  label,
  onError,
  disabled,
}: {
  label: string
  onError: (message: string) => void
  disabled?: boolean
}) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      // redirects to Google; needs the "google" provider in your Better Auth server config
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      })
      if (error) onError(error.message ?? "Google sign-in failed")
    } catch {
      onError("Google sign-in failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={disabled || loading}
      className="h-11 w-full gap-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-md"
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon />}
      {label}
    </Button>
  )
}