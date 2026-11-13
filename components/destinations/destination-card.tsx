import Link from "next/link"
import { ArrowUpRight, CalendarDays, MapPin, Star } from "lucide-react"
import DestinationImage from "./destination-image"
import type { Destination } from "@/lib/destinations"
import { formatTaka } from "@/lib/format"

// Subtle fade + 8px rise (opacity/transform only = GPU friendly).
// fill-mode-both keeps the text hidden until its staggered turn.
const ENTER =
  "animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500 ease-out motion-reduce:animate-none"

export default function DestinationCard({
  destination: d,
  priority = false,
  index = 0,
}: {
  destination: Destination
  priority?: boolean
  index?: number // position in the grid, drives the stagger
}) {
  // 70ms per card, capped so late cards never feel slow
  const delay = { animationDelay: `${Math.min(index, 8) * 70}ms` }

  return (
    // The card shell is NOT animated: it looks identical to the skeleton
    // shell, so there is never a blank moment between skeleton and card.
    <article className="group rounded-3xl bg-white p-3 shadow-md shadow-black/5 ring-1 ring-black/5 transition-[transform,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#1a9fc0]/20">
      {/* Image (shimmer -> fade-in is handled inside DestinationImage) */}
      <Link
        href={`/destinations/${d.id}`}
        className="relative block aspect-[3/2] overflow-hidden rounded-2xl bg-neutral-100"
      >
        <DestinationImage
          src={d.image}
          alt={`${d.title}, ${d.country}`}
          priority={priority}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Rating badge: always visible ("New" until the first rating exists) */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-sm transition-transform duration-300 group-hover:scale-105">
          {d.rating ? (
            <>
              {d.rating.toFixed(1)}
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
            </>
          ) : (
            <>
              <Star className="size-3.5 text-neutral-400" />
              New
            </>
          )}
        </div>

        <span className="absolute bottom-3 left-3 translate-y-2 rounded-full bg-black/50 px-3 py-1 text-xs text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {d.category}
        </span>
      </Link>

      {/* Details: fades in and rises, staggered per card */}
      <div className={`px-2 pb-2 pt-5 ${ENTER}`} style={delay}>
        <p className="flex items-center gap-1.5 text-xs font-medium text-[#1a9fc0]">
          <MapPin className="size-3.5" />
          {d.country}
        </p>

        <div className="mt-2 flex items-baseline justify-between gap-3">
          <h3 className="line-clamp-1 text-xl font-medium text-neutral-900 transition-colors duration-300 group-hover:text-[#1a9fc0]">
            {d.title}
          </h3>
          <p className="whitespace-nowrap text-xl font-medium text-neutral-900">
            {formatTaka(d.price)}
            <span className="text-[11px] font-normal text-neutral-500">
              /Person
            </span>
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
          <p className="flex items-center gap-1.5 text-xs text-neutral-600">
            <CalendarDays className="size-3.5" />
            {d.duration}
          </p>

          <Link
            href={`/destinations/${d.id}`}
            className="group/book inline-flex items-center gap-2 rounded-full bg-[#1a9fc0]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#1a9fc0] transition-colors duration-300 hover:bg-[#1a9fc0] hover:text-white"
          >
            Book Now
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/book:-translate-y-0.5 group-hover/book:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}