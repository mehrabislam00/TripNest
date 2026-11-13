import { Skeleton } from "@/components/ui/skeleton"

export default function DestinationDetailsSkeleton() {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading destination…</span>

      <Skeleton className="h-5 w-44" />
      <Skeleton className="mt-6 aspect-[16/9] w-full rounded-3xl sm:aspect-[21/9]" />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-5 w-64" />
          <Skeleton className="mt-6 h-7 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-[420px] rounded-2xl" />
      </div>
    </div>
  )
}