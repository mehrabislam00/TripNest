"use client"

import { useState, type FormEvent } from "react"
import { ArrowUpRight, Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Status = "idle" | "loading" | "success" | "error"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error")
      return
    }
    setStatus("loading")
    // TODO: replace with your real subscribe endpoint / server action
    await new Promise((resolve) => setTimeout(resolve, 800))
    setStatus("success")
    setEmail("")
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-xs">
      <div className="relative">
        <Input
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status !== "idle") setStatus("idle")
          }}
          placeholder="Enter email"
          autoComplete="email"
          aria-label="Email address"
          aria-invalid={status === "error"}
          aria-describedby="newsletter-feedback"
          disabled={status === "loading"}
          className="h-11 rounded-none border-0 bg-white/10 pr-12 text-sm text-white placeholder:text-white/50 transition-colors focus-visible:bg-white/15 focus-visible:ring-2 focus-visible:ring-[#1a9fc0]"
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          aria-label="Subscribe"
          disabled={status === "loading"}
          className="group absolute right-0 top-0 size-11 rounded-none text-white hover:bg-[#1a9fc0] hover:text-white"
        >
          {status === "loading" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : status === "success" ? (
            <Check className="size-4" />
          ) : (
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          )}
        </Button>
      </div>

      <p
        id="newsletter-feedback"
        role="status"
        aria-live="polite"
        className={`mt-2 min-h-4 text-xs ${
          status === "error" ? "text-red-400" : "text-[#1a9fc0]"
        }`}
      >
        {status === "error" && "Please enter a valid email address."}
        {status === "success" && "Thanks for subscribing!"}
      </p>
    </form>
  )
}