import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CalendarDays, Check, CloudOff, MapPin, Star } from "lucide-react"
import { getDestination } from "@/lib/Destination"
import { API_URL } from "@/lib/destinations"
import BookingCard from "@/components/Details/BookingCard"
import DestinationActions from "@/components/Details/Destination-actions"
import DestinationImage from "@/components/destinations/destination-image"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const { destination } = await getDestination(id) // deduped with the page's fetch
  return {
    title: destination
      ? `${destination.title} | Wanderlast`
      : "Destination | Wanderlast",
  }
}

export default async function DestinationDetails({ params }: Props) {
  const { id } = await params
  const { destination: d, error } = await getDestination(id)

  if (error) {
    return (
      <main className="grid min-h-svh place-items-center bg-white px-4 pt-28">
        <div className="flex max-w-md flex-col items-center text-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-[#1a9fc0]/10 text-[#1a9fc0]">
            <CloudOff className="size-6" />
          </div>
          <h1 className="mt-5 text-2xl font-medium text-neutral-900">
            Couldn&apos;t load this destination
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Make sure your server is running at {API_URL} and try again.
          </p>
          <Link
            href={`/destinations/${id}`}
            className="mt-6 inline-flex items-center justify-center rounded-md bg-[#1a9fc0] px-4 py-2 text-sm font-medium text-white hover:bg-[#168aa8]"
          >
            Try again
          </Link>
        </div>
      </main>
    )
  }

  if (!d) notFound()

  return (
    <main className="min-h-svh bg-white px-4 pb-24 pt-28 sm:pt-36 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        {/* Top bar: back link + admin actions */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/destinations"
            className="group inline-flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-[#1a9fc0]"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Destinations
          </Link>

          <DestinationActions destination={d} />
        </div>

        {/* Hero image */}
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-3xl bg-neutral-100 shadow-xl shadow-black/10 sm:aspect-[21/9]">
          <DestinationImage src={d.image} alt={`${d.title}, ${d.country}`} priority />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
          {/* Left: content */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 motion-reduce:animate-none">
            <div className="flex flex-wrap items-center gap-3">
              {d.country && (
                <p className="flex items-center gap-1.5 text-sm font-medium text-[#1a9fc0]">
                  <MapPin className="size-4" />
                  {d.country}
                </p>
              )}
              <span className="rounded-full bg-[#1a9fc0]/10 px-3 py-1 text-xs font-medium text-[#1a9fc0]">
                {d.category}
              </span>
            </div>

            <h1 className="mt-3 text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl">
              {d.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-600">
              <span className="flex items-center gap-1.5">
                {d.rating ? (
                  <>
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    <strong className="font-semibold text-neutral-900">
                      {d.rating.toFixed(1)}
                    </strong>
                    {d.reviewCount && (
                      <span className="text-neutral-500">
                        ({d.reviewCount} reviews)
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <Star className="size-4 text-neutral-400" />
                    New
                  </>
                )}
              </span>
              {d.duration && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4" />
                  {d.duration}
                </span>
              )}
            </div>

            <section className="mt-10">
              <h2 className="text-2xl font-medium text-neutral-900">Overview</h2>
              <p className="mt-3 max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-neutral-600">
                {d.description ?? "More details about this package are coming soon."}
              </p>
            </section>

            {d.highlights && d.highlights.length > 0 && (
              <section className="mt-10">
                <h2 className="text-2xl font-medium text-neutral-900">Highlights</h2>
                <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {d.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-sm text-neutral-700">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                        <Check className="size-3.5" />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right: sticky booking card */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <BookingCard
              title={d.title}
              price={d.price}
              defaultDate={d.departureDate}
            />
          </aside>
        </div>
      </div>
    </main>
  )
}