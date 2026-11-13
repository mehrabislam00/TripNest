import Link from "next/link"
import { CloudOff, Plus } from "lucide-react"


import { API_URL, getDestinations } from "@/lib/destinations"
import DestinationsPageShell from "@/components/destinations/Destinations-page-shell"
import DestinationsExplorer from "@/components/destinations/destination-explorer"

export const metadata = {
  title: "Explore All Destinations | Wanderlast",
}

function Message({
  icon,
  title,
  text,
  action,
}: {
  icon: React.ReactNode
  title: string
  text: string
  action: React.ReactNode
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-white px-6 text-center duration-500 motion-reduce:animate-none">
      <div className="grid size-14 place-items-center rounded-2xl bg-[#1a9fc0]/10 text-[#1a9fc0]">
        {icon}
      </div>
      <h2 className="mt-5 text-xl font-medium text-neutral-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-neutral-600">{text}</p>
      <div className="mt-6">{action}</div>
    </div>
  )
}

// loading.tsx covers the wait for this fetch (skeleton). With a warm cache
// the data resolves immediately, so real cards render with no skeleton at all.
export default async function Destinations() {
  const { destinations, error } = await getDestinations()

  return (
    <DestinationsPageShell>
      {error ? (
        <Message
          icon={<CloudOff className="size-6" />}
          title="Couldn't load destinations"
          text={`Make sure your server is running at ${API_URL} and try again.`}
          action={
            <Link
              href="/destinations"
              className="inline-flex items-center justify-center rounded-md bg-[#1a9fc0] px-4 py-2 text-sm font-medium text-white hover:bg-[#168aa8]"
            >
              Try again
            </Link>
          }
        />
      ) : destinations.length === 0 ? (
        <Message
          icon={<Plus className="size-6" />}
          title="No destinations yet"
          text="Add your first travel package and it will show up here."
          action={
            <Link
              href="/add-destination"
              className="inline-flex items-center justify-center rounded-md bg-[#1a9fc0] px-4 py-2 text-sm font-medium text-white hover:bg-[#168aa8]"
            >
              Add destination
            </Link>
          }
        />
      ) : (
        <DestinationsExplorer destinations={destinations} />
      )}
    </DestinationsPageShell>
  )
}