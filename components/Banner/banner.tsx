import Image from "next/image"
import { ArrowRight, Calendar, MapPin, Search, Users, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import bannerImage from "@/assets/Banner.png"

const searchFields = [
  { label: "Location", placeholder: "Address, City Or Zip", icon: MapPin },
  { label: "Date/Duration", placeholder: "Anytime/3 Days", icon: Calendar },
  { label: "Budget", placeholder: "$0-$3000", icon: Wallet },
  { label: "People", placeholder: "5-10", icon: Users },
]

export default function Banner() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden text-white">
      <Image
        src={bannerImage}
        alt="Coastal village on a turquoise bay"
        fill
        priority
        className="object-cover"
      />
      {/* Overlays for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      {/* Hero content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-28 pb-10 text-center">
        <h1 className="text-5xl font-light leading-[1.05] tracking-tight drop-shadow-lg sm:text-7xl lg:text-8xl">
          Discover Your
          <br />
          Next Adventure
        </h1>

        <p className="mt-7 max-w-lg text-base leading-relaxed text-white/90 drop-shadow">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            className="group h-12 gap-5 rounded-xl bg-[#1a9fc0] px-6 text-sm font-medium uppercase tracking-wide shadow-lg shadow-[#1a9fc0]/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#168aa8] hover:shadow-xl hover:shadow-[#1a9fc0]/40"
          >
            Explore Now
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="h-12 rounded-xl border border-white/30 bg-white/15 px-6 text-sm font-medium uppercase tracking-wide text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-neutral-900"
          >
            View Destination
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative z-10 mx-4 mb-4 overflow-hidden rounded-2xl border border-white/25 shadow-2xl shadow-black/30 lg:mx-8 lg:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
          {searchFields.map((field) => {
            const Icon = field.icon
            return (
              <label
                key={field.label}
                className="group flex cursor-text items-center gap-3 border-b border-white/20 bg-white/20 px-5 py-4 backdrop-blur-xl transition-colors duration-300 hover:bg-white/30 focus-within:bg-white/35 sm:border-r lg:border-b-0"
              >
                <Icon className="size-5 shrink-0 text-white/80 transition-colors duration-300 group-hover:text-white" />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-semibold">{field.label}</span>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/75"
                  />
                </span>
              </label>
            )
          })}
          <button
            type="button"
            className="group flex items-center justify-center gap-2 bg-[#1a9fc0] px-12 py-5 text-base font-semibold transition-colors duration-300 hover:bg-[#168aa8] sm:col-span-2 lg:col-span-1"
          >
            <Search className="size-5 transition-transform duration-300 group-hover:scale-110" />
            Search
          </button>
        </div>
      </div>
    </section>
  )
}