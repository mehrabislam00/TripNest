"use client"

import { useEffect, useState } from "react"
import { ArrowRight, CalendarDays, Check, CheckCircle2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatTaka } from "@/lib/format"
import { API_URL } from "@/lib/api"
import { authClient } from "@/lib/auth-client"
import { Destination } from "@/lib/Destination"

// Edit these to match your real booking policy
const PERKS = [
  "Free cancellation up to 7 days",
  "Travel insurance included",
  "24/7 customer support",
]

async function getAuthorizationHeaders(): Promise<Record<string, string>> {
  const sessionResponse = await fetch("/api/auth/get-session", {
    credentials: "include",
    cache: "no-store",
  })
  if (!sessionResponse.ok) {
    throw new Error(`Session token request failed (${sessionResponse.status})`)
  }

  const token = sessionResponse.headers.get("set-auth-jwt")
  if (!token) {
    throw new Error("Session token was not returned by Better Auth")
  }

  return { Authorization: `Bearer ${token}` }
}

export default function BookingCard({
  destination,
  title,
  price,
  defaultDate = "",
}: {
  destination: Destination
  title: string
  price: number
  defaultDate?: string
}) {
  const { data: session } = authClient.useSession()
  const user = session?.user
  const [date, setDate] = useState(defaultDate)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [booked, setBooked] = useState(false)
  const [bookingStatus, setBookingStatus] = useState<"pending" | "confirmed" | null>(null)

  useEffect(() => {
    if (!user) return

    let active = true
    getAuthorizationHeaders()
      .then((headers) =>
        fetch(
          `${API_URL}/bookings?userId=${encodeURIComponent(user.id)}&destinationId=${encodeURIComponent(destination.id)}`,
          { headers, cache: "no-store" }
        )
      )
      .then(async (response) => {
        if (!response.ok) throw new Error(`Booking status failed (${response.status})`)
        return (await response.json()) as Array<{
          status?: string
          departureDate?: string
        }>
      })
      .then((bookings) => {
        const existing = bookings.find(
          (booking) => booking.status?.toLowerCase() !== "cancelled"
        )
        if (!active || !existing) return

        setBooked(true)
        setBookingStatus(
          existing.status?.toLowerCase() === "confirmed" ? "confirmed" : "pending"
        )
        if (existing.departureDate) setDate(existing.departureDate)
      })
      .catch(() => {
        if (active) setError("Couldn't check your booking status. Please try again.")
      })

    return () => {
      active = false
    }
  }, [destination.id, user])

  const handleBook = async () => {
    const today = new Date().toISOString().slice(0, 10)
    if (!date) return setError("Please choose a departure date")
    if (date < today) return setError("Departure date can't be in the past")
    if (!user) return setError("Please sign in before booking")

    setError("")
    setLoading(true)
    try {
      const booking = {
        userId: user.id,
        destinationId: destination.id,
        username: user.name,
        email: user.email,
        image: user.image ?? "",
        name: destination.title,
        country: destination.country,
        category: destination.category,
        price: destination.price,
        duration: destination.duration,
        departureDate: date,
        imageUrl: destination.image,
        description: destination.description ?? "",
        bookingDate: new Date().toISOString(),
        status: "pending",
      }
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(await getAuthorizationHeaders()),
        },
        body: JSON.stringify(booking),
      })
      if (!res.ok) throw new Error(`Booking failed (status ${res.status})`)

      await new Promise((r) => setTimeout(r, 900))
      setBooked(true)
      setBookingStatus("pending")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="gap-0 rounded-2xl border-0 bg-white py-0 shadow-xl shadow-black/5 ring-1 ring-black/5">
      <CardContent className="p-6">
        <p className="text-xs text-neutral-500">Starting from</p>
        <p className="mt-1 text-4xl font-medium tracking-tight text-[#1a9fc0]">
          {formatTaka(price)}
        </p>
        <p className="mt-1 text-xs text-neutral-500">per person</p>

        <div className="mt-6 space-y-2">
          <Label
            htmlFor="departure"
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-700"
          >
            <CalendarDays className="size-3.5" />
            Departure date
          </Label>
          <Input
            id="departure"
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
              setError("")
              setBooked(false)
              setBookingStatus(null)
            }}
            aria-invalid={!!error}
            className="h-11 border-transparent bg-neutral-100/80 shadow-none transition-all focus-visible:border-[#1a9fc0] focus-visible:bg-white focus-visible:ring-[#1a9fc0]/25"
          />
          {error && (
            <p role="alert" className="text-xs text-red-600">
              {error}
            </p>
          )}
        </div>

        <Button
          onClick={handleBook}
          disabled={loading || booked}
          className={`group mt-5 h-12 w-full gap-2 text-sm font-medium shadow-md transition-all duration-300 ${
            booked
              ? "bg-emerald-500 shadow-emerald-500/30 hover:bg-emerald-500"
              : "bg-[#1a9fc0] shadow-[#1a9fc0]/30 hover:-translate-y-0.5 hover:bg-[#168aa8] hover:shadow-lg hover:shadow-[#1a9fc0]/40"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Booking...
            </>
          ) : booked ? (
            <>
              <CheckCircle2 className="size-4" />
              Booked
            </>
          ) : (
            <>
              Book Now
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </Button>

        {booked && (
          <div
            role="status"
            className="animate-in fade-in slide-in-from-bottom-1 mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs text-emerald-800 ring-1 ring-emerald-200"
          >
            <CheckCircle2 className="size-4 shrink-0" />
            Booking request sent for {title}.{" "}
            <span className="font-semibold">
              {bookingStatus === "confirmed" ? "Confirmed" : "Pending"}
            </span>
          </div>
        )}

        <ul className="mt-6 space-y-3 border-t border-neutral-100 pt-5">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-center gap-2.5 text-xs text-neutral-600">
              <Check className="size-4 shrink-0 text-emerald-500" />
              {perk}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}