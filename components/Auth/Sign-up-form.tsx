"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Lock, Mail, User } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import {
  AuthInput,
  AuthShell,
  FormError,
  SubmitButton,
} from "./Auth-parts"

type Values = { name: string; email: string; password: string; confirm: string }
type Errors = Partial<Record<keyof Values, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(v: Values): Errors {
  const e: Errors = {}
  if (!v.name.trim()) e.name = "Please enter your name"
  if (!v.email.trim()) e.email = "Email is required"
  else if (!EMAIL_RE.test(v.email)) e.email = "Enter a valid email address"
  if (v.password.length < 8) e.password = "Password must be at least 8 characters"
  else if (v.password.length > 128) e.password = "Password must be 128 characters or fewer"
  if (!v.confirm) e.confirm = "Please confirm your password"
  else if (v.confirm !== v.password) e.confirm = "Passwords don't match"
  return e
}

export default function SignUpForm() {
  const router = useRouter()
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    password: "",
    confirm: "",
  })
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState("")
  const [pending, setPending] = useState(false)

  const set = (key: keyof Values) => (value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
    if (serverError) setServerError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setPending(true)
    setServerError("")
    try {
      const { error } = await authClient.signUp.email({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        callbackURL: "/",
      })
      if (error) {
        setServerError(error.message ?? "Couldn't create your account.")
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
      title="Create Account"
      subtitle="Start your adventure with Wanderlust"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <AuthInput
          id="name"
          label="Full Name"
          icon={User}
          value={values.name}
          onChange={set("name")}
          placeholder="Enter your name"
          autoComplete="name"
          error={errors.name}
          disabled={pending}
        />
        <AuthInput
          id="email"
          label="Email Address"
          type="email"
          icon={Mail}
          value={values.email}
          onChange={set("email")}
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
          value={values.password}
          onChange={set("password")}
          placeholder="Create a password"
          autoComplete="new-password"
          error={errors.password}
          disabled={pending}
        />
        <AuthInput
          id="confirm"
          label="Confirm Password"
          type="password"
          icon={Lock}
          value={values.confirm}
          onChange={set("confirm")}
          placeholder="Confirm your password"
          autoComplete="new-password"
          error={errors.confirm}
          disabled={pending}
        />

        <FormError message={serverError} />

        <SubmitButton pending={pending} idle="Create Account" busy="Creating account..." />
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        Already have an account?{" "}
        <Link
          href="/signIn"
          className="font-semibold text-[#1a9fc0] underline-offset-4 transition-colors hover:text-[#168aa8] hover:underline"
        >
          Sign In
        </Link>
      </p>
    </AuthShell>
  )
}