// Shared by page.tsx and loading.tsx, so the heading never moves or re-renders
// when the skeleton is replaced by real content.
export default function DestinationsPageShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-svh bg-gradient-to-b from-sky-50/70 to-white px-4 pb-20 pt-28 sm:pt-36 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-10">
          <h1 className="text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl">
            Explore All Destinations
          </h1>
          <p className="mt-3 text-sm text-neutral-600">
            Find your perfect travel experience from our curated collection
          </p>
        </header>

        {children}
      </div>
    </main>
  )
}