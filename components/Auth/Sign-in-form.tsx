"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Lock, Mail } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import {
  AuthInput,
  AuthShell,
  FormError,
  SubmitButton,
} from "./Auth-parts"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [serverError, setServerError] = useState("")
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const found: typeof errors = {}
    if (!email.trim()) found.email = "Email is required"
    else if (!EMAIL_RE.test(email)) found.email = "Enter a valid email address"
    if (!password) found.password = "Password is required"
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setPending(true)
    setServerError("")
    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        rememberMe,
        callbackURL: "/",
      })
      if (error) {
        setServerError(error.message ?? "Invalid email or password.")
        return
      }
      router.push("/")
      router.refresh() // so the navbar picks up the new session
    } catch {
      setServerError("Something went wrong. Please try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Resume your adventure with Wanderlust"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <AuthInput
          id="email"
          label="Email Address"
          type="email"
          icon={Mail}
          value={email}
          onChange={(v) => {
            setEmail(v)
            setErrors((p) => ({ ...p, email: undefined }))
            setServerError("")
          }}
          placeholder="Enter your email"
          autoComplete="email"
          error={errors.email}
          disabled={pending}
        />
        <AuthInput
          id="password"
          label="Password"
          type="password"
          icon={Lock}
          value={password}
          onChange={(v) => {
            setPassword(v)
            setErrors((p) => ({ ...p, password: undefined }))
            setServerError("")
          }}
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password}
          disabled={pending}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(c) => setRememberMe(c === true)}
              disabled={pending}
            />
            <Label
              htmlFor="remember"
              className="cursor-pointer text-sm font-normal text-neutral-700"
            >
              Remember me
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[#1a9fc0] underline-offset-4 transition-colors hover:text-[#168aa8] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <FormError message={serverError} />

        <SubmitButton pending={pending} idle="Sign In" busy="Signing in..." />
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[#1a9fc0] underline-offset-4 transition-colors hover:text-[#168aa8] hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </AuthShell>
  )
}