"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  Hash,
  Loader2,
  Trash2,
  XCircle,
} from "lucide-react"


import DestinationImage from "@/components/destinations/destination-image"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import type { Booking, BookingStatus } from "@/lib/Bookings"
import { cancelBooking } from "@/lib/Actions-Booking"
import { formatTaka } from "@/lib/format"

const STATUS: Record<
  BookingStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  confirmed: {
    label: "Confirmed",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: <CheckCircle2 className="size-3.5" />,
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: <Clock className="size-3.5" />,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-600 ring-red-200",
    icon: <XCircle className="size-3.5" />,
  },
}

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC", // same output on server and client
      })
    : "To be announced"

const ENTER =
  "animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500 ease-out motion-reduce:animate-none"

export default function BookingCard({
  booking: b,
  index = 0,
}: {
  booking: Booking
  index?: number
}) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")
  const [pending, startTransition] = useTransition()

  const status = STATUS[b.status]
  const cancelled = b.status === "cancelled"
  const href = b.destinationId ? `/destinations/${b.destinationId}` : "/destinations"
  const delay = { animationDelay: `${Math.min(index, 6) * 70}ms` }

  const confirmCancel = () => {
    setError("")
    startTransition(async () => {
      const res = await cancelBooking(b.id)
      if (res.error) setError(res.error)
      else setOpen(false) // the page re-renders with the new status
    })
  }

  return (
    <>
      <article
        className={`group flex flex-col gap-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1a9fc0]/10 sm:flex-row sm:gap-5 ${
          cancelled ? "opacity-75" : ""
        }`}
      >
        {/* Image (static shell, like the destination cards) */}
        <Link
          href={href}
          className="relative block aspect-[16/9] shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:aspect-auto sm:h-[120px] sm:w-[200px]"
        >
          <DestinationImage src={b.image} alt={b.title} />
          {cancelled && <div className="absolute inset-0 bg-white/40" />}
        </Link>

        {/* Details */}
        <div
          className={`flex min-w-0 flex-1 flex-col justify-between gap-3 py-1 sm:pr-2 ${ENTER}`}
          style={delay}
        >
          <div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${status.className}`}
            >
              {status.icon}
              {status.label}
            </span>

            <h2 className="mt-2 line-clamp-1 text-xl font-medium text-neutral-900 transition-colors duration-300 group-hover:text-[#1a9fc0]">
              {b.title}
            </h2>

            <div className="mt-2 space-y-1 text-xs text-neutral-600">
              <p className="flex items-center gap-2">
                <CalendarDays className="size-3.5 shrink-0" />
                Departure: {formatDate(b.departureDate)}
              </p>
              <p className="flex items-center gap-2">
                <Hash className="size-3.5 shrink-0" />
                Booking ID: {b.id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-2xl font-medium text-[#1a9fc0]">
              {formatTaka(b.price)}
            </p>

            <div className="flex items-center gap-2">
              {!cancelled && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(true)}
                  className="group/btn h-9 gap-2 border-red-300 px-4 text-red-500 transition-all duration-300 hover:border-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="size-3.5" />
                  Cancel
                </Button>
              )}
              <Link
                href={href}
                className="group/btn inline-flex h-9 items-center gap-2 rounded-lg bg-[#1a9fc0] px-4 text-sm font-medium text-white shadow-md shadow-[#1a9fc0]/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#168aa8] hover:shadow-lg hover:shadow-[#1a9fc0]/35"
              >
                <Eye className="size-3.5" />
                View
              </Link>
            </div>
          </div>
        </div>
      </article>

      <AlertDialog open={open} onOpenChange={(v) => !pending && setOpen(v)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Your booking for {b.title} will be cancelled. Please check the
              cancellation policy for any refund details.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Keep booking</AlertDialogCancel>
            <Button
              type="button"
              onClick={confirmCancel}
              disabled={pending}
              className="gap-2 bg-red-500 text-white hover:bg-red-600"
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              {pending ? "Cancelling..." : "Yes, cancel booking"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}