import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="min-h-svh bg-gradient-to-b from-sky-50/70 to-white px-4 pb-20 pt-28 sm:pt-36 lg:px-12">
      <div role="status" aria-busy="true" className="mx-auto max-w-[1100px]">
        <span className="sr-only">Loading profile…</span>

        <header className="mb-10">
          <h1 className="text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl">
            My Profile
          </h1>
          <p className="mt-3 text-sm text-neutral-600">
            Manage your account settings and travel preferences
          </p>
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-[300px_1fr]">
          <div className="rounded-2xl bg-white p-6 shadow-lg shadow-black/5 ring-1 ring-black/5">
            <Skeleton className="mx-auto size-36 rounded-full" />
            <Skeleton className="mx-auto mt-5 h-6 w-40" />
            <Skeleton className="mx-auto mt-3 h-4 w-28" />
            <div className="mt-6 space-y-3 border-t border-neutral-100 pt-5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="mt-6 h-11 w-full" />
          </div>

          <div>
            <Skeleton className="h-7 w-44" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[100px] rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}