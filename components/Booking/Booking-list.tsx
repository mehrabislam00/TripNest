"use client"

import { useMemo, useState } from "react"

import type { Booking, BookingStatus } from "@/lib/Bookings"
import BookingCard from "./Booking-card"


type Filter = "all" | BookingStatus

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
]

export default function BookingList({ bookings }: { bookings: Booking[] }) {
  const [filter, setFilter] = useState<Filter>("all")

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: bookings.length,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
    }
    bookings.forEach((b) => c[b.status]++)
    return c
  }, [bookings])

  const visible =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter)

  return (
    <>
      {/* Status filter */}
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter bookings">
        {FILTERS.map((f) => {
          const active = filter === f.value
          return (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.value)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                active
                  ? "bg-[#1a9fc0] text-white shadow-md shadow-[#1a9fc0]/30"
                  : "bg-white text-neutral-600 ring-1 ring-black/5 hover:text-[#1a9fc0] hover:ring-[#1a9fc0]/40"
              }`}
            >
              {f.label}
              <span
                className={`rounded-full px-1.5 text-xs tabular-nums ${
                  active ? "bg-white/25" : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {counts[f.value]}
              </span>
            </button>
          )
        })}
      </div>

      {visible.length > 0 ? (
        <div className="space-y-5">
          {visible.map((b, i) => (
            <BookingCard key={b.id} booking={b} index={i} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-14 text-center text-sm text-neutral-500">
          No {filter} bookings.
        </p>
      )}
    </>
  )
}