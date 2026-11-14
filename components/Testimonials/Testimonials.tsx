"use client"

import { useEffect, useState } from "react"
import Image, { type StaticImageData } from "next/image"
import { ArrowLeft, ArrowRight, MapPin, Quote, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

import person1 from "@/assets/person1.png"
import person2 from "@/assets/person2.png"

type Testimonial = {
  name: string
  location: string
  quote: string
  rating: number
  image?: StaticImageData // optional: falls back to an initials panel
}

// Add more entries here and the carousel will pick them up automatically
const testimonials: Testimonial[] = [
  {
    name: "Michael Chen",
    location: "Dhaka, Bangladesh",
    quote:
      "We spent five days in Ubud and finished by the coast in Jimbaran. The itinerary gave us plenty of time to explore without making the trip feel rushed.",
    rating: 5,
    image: person1,
  },
  {
    name: "Sarah Johnson",
    location: "Chattogram, Bangladesh",
    quote:
      "The Swiss Alps itinerary was exactly what we needed. The train connections were easy to follow, and our guide found quiet viewpoints away from the busiest spots.",
    rating: 5,
    image: person2,
  },
  {
    name: "Emma Rodriguez",
    location: "Sylhet, Bangladesh",
    quote:
      "Kyoto was a great mix of temples, small restaurants, and free afternoons. The neighborhood suggestions were especially useful when we wanted to get away from the crowds.",
    rating: 5,
  },
  {
    name: "Daniel Okafor",
    location: "Rajshahi, Bangladesh",
    quote:
      "Our family safari was well organized from airport pickup to the last game drive. The guide was patient with our children, and the lodge was comfortable and clean.",
    rating: 4,
  },
  {
    name: "Aisha Rahman",
    location: "Khulna, Bangladesh",
    quote:
      "The price was clear from the beginning, and the support team replied quickly when our flight changed. Having the transfers rearranged for us made a big difference.",
    rating: 5,
  },
]

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

export default function Testimonials() {
  const [api, setApi] = useState<CarouselApi>()
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  useEffect(() => {
    if (!api) return
    const update = () => {
      setCanPrev(api.canScrollPrev())
      setCanNext(api.canScrollNext())
    }
    update()
    api.on("select", update).on("reInit", update)
    return () => {
      api.off("select", update)
      api.off("reInit", update)
    }
  }, [api])

  return (
    <section className="bg-white px-4 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl">
              What Travelers Say
            </h2>
            <p className="mt-3 text-sm text-neutral-600">
              Real experiences from our happy travelers
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous testimonial"
              onClick={() => api?.scrollPrev()}
              disabled={!canPrev}
              className="group size-12 rounded-full border-neutral-300 bg-white transition-all duration-300 hover:scale-110 hover:border-[#1a9fc0] hover:bg-[#1a9fc0] hover:text-white hover:shadow-lg hover:shadow-[#1a9fc0]/40 active:scale-95 focus-visible:ring-[#1a9fc0]/40 disabled:opacity-40"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next testimonial"
              onClick={() => api?.scrollNext()}
              disabled={!canNext}
              className="group size-12 rounded-full border-neutral-300 bg-white transition-all duration-300 hover:scale-110 hover:border-[#1a9fc0] hover:bg-[#1a9fc0] hover:text-white hover:shadow-lg hover:shadow-[#1a9fc0]/40 active:scale-95 focus-visible:ring-[#1a9fc0]/40 disabled:opacity-40"
            >
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          opts={{ align: "start" }}
          className="mt-12"
        >
          <CarouselContent className="-ml-6 py-3">
            {testimonials.map((t) => (
              <CarouselItem key={t.name} className="pl-6 lg:basis-1/2">
                <Card className="group h-full flex-col gap-0 overflow-hidden rounded-2xl border-0 bg-white p-4 shadow-sm ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#1a9fc0]/15 sm:flex-row sm:gap-6">
                  {/* Text */}
                  <div className="relative flex flex-1 flex-col p-2 sm:p-4">
                    <Quote className="size-9 fill-[#1a9fc0]/15 text-[#1a9fc0]/40 transition-colors duration-500 group-hover:fill-[#1a9fc0]/30 group-hover:text-[#1a9fc0]" />

                    <div
                      className="mt-4 flex gap-0.5"
                      role="img"
                      aria-label={`${t.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-4 ${
                            i < t.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-neutral-300"
                          }`}
                        />
                      ))}
                    </div>

                    <blockquote className="mt-4 flex-1 text-lg leading-snug text-neutral-900 sm:text-xl">
                      “{t.quote}”
                    </blockquote>

                    <div className="mt-6 flex items-center gap-3">
                      <span className="h-px w-6 bg-[#1a9fc0]" />
                      <div>
                        <p className="text-sm font-semibold text-[#1a9fc0]">
                          {t.name}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-neutral-500">
                          <MapPin className="size-3" />
                          {t.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Photo */}
                  <div className="relative order-first aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl sm:order-last sm:aspect-auto sm:w-[40%]">
                    {t.image ? (
                      <Image
                        src={t.image}
                        alt={`Portrait of ${t.name}`}
                        fill
                        placeholder="blur"
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 35vw, 90vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div
                        aria-hidden
                        className="grid size-full min-h-40 place-items-center bg-gradient-to-br from-[#1a9fc0] via-cyan-400 to-sky-300 transition-transform duration-700 ease-out group-hover:scale-105"
                      >
                        <span className="text-5xl font-light tracking-wide text-white/90">
                          {getInitials(t.name)}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}