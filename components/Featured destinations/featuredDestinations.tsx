"use client"

import { useRef, useState } from "react"
import Image, { type StaticImageData } from "next/image"
import Link from "next/link"

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Heart,
  MapPin,
  Star,
} from "lucide-react"

import image1 from "@/assets/destinations/image1.png"
import image2 from "@/assets/destinations/image2.png"
import image3 from "@/assets/destinations/image3.png"
import image4 from "@/assets/destinations/image4.png"
import image5 from "@/assets/destinations/image5.png"
import image6 from "@/assets/destinations/image6.png"
import { formatTaka } from "@/lib/format"

type Destination = {
  id: number
  image: StaticImageData
  country: string
  title: string
  price: number
  duration: string
  rating: number
}

// Edit this data to match your real destinations
const destinations: Destination[] = [
  { id: 1, image: image1, country: "Nepal", title: "Bali Paradise", price: 2700, duration: "7 Days/6 Nights", rating: 4.5 },
  { id: 2, image: image2, country: "Indonesia", title: "Bali Paradise", price: 2700, duration: "7 Days/6 Nights", rating: 4.5 },
  { id: 3, image: image3, country: "Indonesia", title: "Bali Paradise", price: 2700, duration: "7 Days/6 Nights", rating: 4.5 },
  { id: 4, image: image4, country: "Indonesia", title: "Bali Paradise", price: 2700, duration: "7 Days/6 Nights", rating: 4.5 },
  { id: 5, image: image5, country: "Indonesia", title: "Bali Paradise", price: 2700, duration: "7 Days/6 Nights", rating: 4.5 },
  { id: 6, image: image6, country: "Indonesia", title: "Bali Paradise", price: 2700, duration: "7 Days/6 Nights", rating: 4.5 },
]

export default function FeaturedDestinations() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [liked, setLiked] = useState<number[]>([])
  const total = destinations.length

  const getStep = () => {
    const track = trackRef.current
    const first = track?.firstElementChild as HTMLElement | undefined
    if (!track || !first) return 0
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    return first.offsetWidth + gap
  }

  const handleScroll = () => {
    const track = trackRef.current
    const step = getStep()
    if (!track || !step) return
    setIndex(Math.min(total - 1, Math.round(track.scrollLeft / step)))
  }

  const scrollByCard = (dir: 1 | -1) =>
    trackRef.current?.scrollBy({ left: dir * getStep(), behavior: "smooth" })

  const toggleLike = (id: number) =>
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-sky-50/60 px-4 py-20 lg:px-12 lg:py-28">
      {/* soft decorative glow */}
      <div className="pointer-events-none absolute -right-40 top-10 size-[420px] rounded-full bg-[#1a9fc0]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl">
              Featured Destinations
            </h2>
            <p className="mt-3 max-w-md text-sm text-neutral-600">
              Handpicked travel experiences for the adventure seekers
            </p>
          </div>

          <Link
            href="/destinations"
            className="group flex items-center gap-8 rounded-xl border border-[#1a9fc0] px-6 py-3 text-xs font-medium uppercase tracking-wider text-[#1a9fc0] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1a9fc0] hover:text-white hover:shadow-lg hover:shadow-[#1a9fc0]/30"
          >
            All Destinations
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </div>

        {/* Carousel track */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="-mx-2 mt-12 flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth px-2 pb-8 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {destinations.map((d) => {
            const isLiked = liked.includes(d.id)
            return (
              <article
                key={d.id}
                className="group w-[85%] shrink-0 snap-start rounded-3xl bg-white p-3 shadow-md shadow-black/5 ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#1a9fc0]/20 sm:w-[calc(50%-1rem)] lg:w-[calc(46%-1rem)]"
              >
                {/* Image */}
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-neutral-100">
                  <Image
                    src={d.image}
                    alt={`${d.title}, ${d.country}`}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 46vw, (min-width: 640px) 50vw, 85vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Wishlist */}
                  <button
                    type="button"
                    aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                    aria-pressed={isLiked}
                    onClick={() => toggleLike(d.id)}
                    className="absolute left-3 top-3 grid size-9 place-items-center rounded-full bg-white/80 text-neutral-800 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white"
                  >
                    <Heart
                      className={`size-4 transition-colors ${
                        isLiked ? "fill-rose-500 text-rose-500" : ""
                      }`}
                    />
                  </button>

                  {/* Rating */}
                  <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-xs font-semibold text-neutral-900 backdrop-blur-md">
                    {d.rating}
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  </div>

                  {/* Duration chip (slides up on hover) */}
                  <div className="absolute bottom-3 left-3 flex translate-y-2 items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <CalendarDays className="size-3.5" />
                    {d.duration}
                  </div>
                </div>

                {/* Details */}
                <div className="px-2 pb-2 pt-5">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-[#1a9fc0]">
                    <MapPin className="size-3.5" />
                    {d.country}
                  </p>

                  <div className="mt-2 flex items-baseline justify-between gap-4">
                    <h3 className="text-2xl font-medium text-neutral-900 transition-colors duration-300 group-hover:text-[#1a9fc0]">
                      {d.title}
                    </h3>
                    <p className="whitespace-nowrap text-2xl font-medium text-neutral-900">
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
                      className="group/book inline-flex items-center gap-2 rounded-full bg-[#1a9fc0]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#1a9fc0] transition-all duration-300 hover:bg-[#1a9fc0] hover:text-white"
                    >
                      Book Now
                      <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/book:-translate-y-0.5 group-hover/book:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center gap-6">
          <p className="text-xl font-medium tabular-nums text-neutral-900">
            {String(index + 1).padStart(2, "0")}
            <span className="text-neutral-400">/{String(total).padStart(2, "0")}</span>
          </p>

          <div className="relative h-px flex-1 bg-neutral-200">
            <div
              className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-[#1a9fc0] transition-all duration-500"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              aria-label="Previous destination"
              onClick={() => scrollByCard(-1)}
              disabled={index === 0}
              className="grid size-12 place-items-center rounded-full border border-neutral-300 bg-white text-neutral-600 transition-all duration-300 hover:scale-105 hover:border-[#1a9fc0] hover:bg-[#1a9fc0] hover:text-white disabled:pointer-events-none disabled:opacity-40"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next destination"
              onClick={() => scrollByCard(1)}
              disabled={index >= total - 1}
              className="grid size-12 place-items-center rounded-full border border-neutral-300 bg-white text-neutral-600 transition-all duration-300 hover:scale-105 hover:border-[#1a9fc0] hover:bg-[#1a9fc0] hover:text-white disabled:pointer-events-none disabled:opacity-40"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}