import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="min-h-svh bg-gradient-to-b from-sky-50/70 to-white px-4 pb-20 pt-28 sm:pt-36 lg:px-12">
      <div role="status" aria-busy="true" className="mx-auto max-w-[900px]">
        <span className="sr-only">Loading your bookings…</span>

        <header className="mb-8">
          <h1 className="text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl">
            My Bookings
          </h1>
          <p className="mt-3 text-sm text-neutral-600">
            Manage and view your upcoming travel plans
          </p>
        </header>

        <div className="mb-6 flex gap-2">
          {[64, 96, 84, 92].map((w, i) => (
            <Skeleton key={i} style={{ width: w }} className="h-10 rounded-full" />
          ))}
        </div>

        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 sm:flex-row sm:gap-5"
            >
              <Skeleton className="aspect-[16/9] shrink-0 rounded-xl sm:aspect-auto sm:h-[120px] sm:w-[200px]" />
              <div className="flex flex-1 flex-col justify-between gap-3 py-1">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-2/5" />
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-3.5 w-32" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-7 w-24" />
                  <Skeleton className="h-9 w-40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}