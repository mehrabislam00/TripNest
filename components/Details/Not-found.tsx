import Link from "next/link"
import { MapPinOff } from "lucide-react"


export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center bg-white px-4 pt-28">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-[#1a9fc0]/10 text-[#1a9fc0]">
          <MapPinOff className="size-6" />
        </div>
        <h1 className="mt-5 text-2xl font-medium text-neutral-900">
          Destination not found
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          This travel package may have been removed or the link is incorrect.
        </p>
        <Link
          href="/destinations"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white bg-[#1a9fc0] hover:bg-[#168aa8]"
        >
          Browse all destinations
        </Link>
      </div>
    </main>
  )
}