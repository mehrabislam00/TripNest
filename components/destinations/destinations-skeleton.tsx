import { Skeleton } from "@/components/ui/skeleton"

/**
 * Mirrors DestinationCard exactly (same padding, radii and row heights),
 * so swapping skeleton -> real card causes zero layout shift:
 *   location row  = h-4  (text-xs, 16px)
 *   title row     = h-7  (text-xl, 28px)
 *   footer        = mt-4 + border + pt-4 + 32px button
 */
export function CardSkeleton() {
  return (
    <div className="rounded-3xl bg-white p-3 shadow-md shadow-black/5 ring-1 ring-black/5">
      <Skeleton className="aspect-[3/2] w-full rounded-2xl" />

      <div className="px-2 pb-2 pt-5">
        <Skeleton className="h-4 w-20" />

        <div className="mt-2 flex h-7 items-center justify-between gap-3">
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="h-5 w-20" />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default function DestinationsSkeleton() {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading destinations…</span>

      {/* filter bar: same size as the real one */}
      <div className="grid divide-y divide-neutral-100 overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/5 ring-1 ring-black/5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex h-[76px] items-center gap-4 px-6">
            <Skeleton className="size-11 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>

      {/* result count row: same box as the real one (mt-5 + min-h-9) */}
      <div className="mt-5 flex min-h-9 items-center">
        <Skeleton className="h-4 w-44" />
      </div>

      {/* grid: 2 cards on mobile, 4 on tablet, 6 on desktop */}
      <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={
              i >= 4 ? "hidden lg:block" : i >= 2 ? "hidden sm:block" : undefined
            }
          >
            <CardSkeleton />
          </div>
        ))}
      </div>
    </div>
  )
}