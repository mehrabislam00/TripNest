import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Compass } from "lucide-react"

import { Button } from "@/components/ui/button"

import ctaImage from "@/assets/CTA.png"

type CTAProps = {
  bookHref?: string
  exploreHref?: string
}

export default function CTA({
  bookHref = "#",
  exploreHref = "#destinations",
}: CTAProps) {
  return (
    <section className="group relative isolate flex min-h-[480px] w-full items-center justify-center overflow-hidden sm:min-h-[520px] lg:min-h-[600px]">
      {/* Background image covers the whole section */}
      <Image
        src={ctaImage}
        alt=""
        aria-hidden
        fill
        placeholder="blur"
        sizes="100vw"
        className="-z-20 object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
      />

      {/* Overlays: contrast for text + subtle brand tint */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/35 to-black/70" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(26,159,192,0.22),transparent_65%)]" />

      {/* Content */}
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center">
        <h2 className="text-balance text-4xl font-light tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
          Ready To Start Your Journey?
        </h2>

        <p className="mt-5 max-w-xl text-pretty text-sm text-white/85 drop-shadow sm:text-base">
          Join thousands of travelers who have discovered the world with us
        </p>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
          <Button
            variant="default"
            size="lg"
            render={<Link href={bookHref} />}
            className="group/btn h-14 w-full gap-3 whitespace-nowrap rounded-full bg-white px-8 text-sm font-semibold uppercase tracking-wider text-neutral-900 shadow-xl shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1a9fc0] hover:text-white hover:shadow-2xl hover:shadow-[#1a9fc0]/50 active:translate-y-0 focus-visible:ring-4 focus-visible:ring-white/40 sm:w-auto"
          >
            Book Your Trip Today
            <ArrowRight className="size-4 shrink-0 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            render={<Link href={exploreHref} />}
            className="group/btn h-14 w-full gap-3 whitespace-nowrap rounded-full border-white/40 bg-white/10 px-8 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white hover:bg-white/20 hover:text-white active:translate-y-0 focus-visible:ring-4 focus-visible:ring-white/40 sm:w-auto"
          >
            <Compass className="size-4 shrink-0 transition-transform duration-500 group-hover/btn:rotate-45" />
            Explore Destinations
          </Button>
        </div>
      </div>
    </section>
  )
}