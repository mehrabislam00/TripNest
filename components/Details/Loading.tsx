import DestinationDetailsSkeleton from "./Destination-details-skeleton";


export default function Loading() {
  return (
    <main className="min-h-svh bg-white px-4 pb-20 pt-28 sm:pt-36 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <DestinationDetailsSkeleton />
      </div>
    </main>
  )
}