import Link from "next/link"
import { CloudOff, Plane } from "lucide-react"
import { redirect } from "next/navigation"


import { API_URL } from "@/lib/destinations"
import { getSessionUser } from "@/lib/Profile"
import { cn } from "@/lib/utils"
import { getBookings } from "@/lib/Bookings"
import { buttonVariants } from "@/components/ui/button"
import BookingList from "@/components/Booking/Booking-list"

export const metadata = {
  title: "My Bookings | Wanderlast",
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
    <div className="animate-in fade-in slide-in-from-bottom-2 flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-white px-6 text-center duration-500 motion-reduce:animate-none">
      <div className="grid size-14 place-items-center rounded-2xl bg-[#1a9fc0]/10 text-[#1a9fc0]">
        {icon}
      </div>
      <h2 className="mt-5 text-xl font-medium text-neutral-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-neutral-600">{text}</p>
      <div className="mt-6">{action}</div>
    </div>
  )
}

export default async function MyBookingsPage() {
  const user = await getSessionUser()
  if (!user) redirect("/signIn")

  const { bookings, error } = await getBookings(user.id)

  return (
    <main className="min-h-svh bg-gradient-to-b from-sky-50/70 to-white px-4 pb-20 pt-28 sm:pt-36 lg:px-12">
      <div className="mx-auto max-w-[900px]">
        <header className="mb-8">
          <h1 className="text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl">
            My Bookings
          </h1>
          <p className="mt-3 text-sm text-neutral-600">
            Manage and view your upcoming travel plans
          </p>
        </header>

        {error ? (
          <Message
            icon={<CloudOff className="size-6" />}
            title="Couldn't load your bookings"
            text={`Make sure your server is running at ${API_URL} and try again.`}
            action={
              <Link
                href="/my-bookings"
                className={cn(buttonVariants(), "bg-[#1a9fc0] hover:bg-[#168aa8]")}
              >
                Try again
              </Link>
            }
          />
        ) : bookings.length === 0 ? (
          <Message
            icon={<Plane className="size-6" />}
            title="No bookings yet"
            text="When you book a trip, it will show up here."
            action={
              <Link
                href="/destinations"
                className={cn(buttonVariants(), "bg-[#1a9fc0] hover:bg-[#168aa8]")}
              >
                Browse destinations
              </Link>
            }
          />
        ) : (
          <BookingList bookings={bookings} />
        )}
      </div>
    </main>
  )
}