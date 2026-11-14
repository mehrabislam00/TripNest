import { Globe, Plane, TrendingUp } from "lucide-react"

import { Card } from "@/components/ui/card"
import { formatTaka } from "@/lib/format"
import { ProfileStats } from "@/lib/Profile"


export default function ProfileStatsGrid({ stats }: { stats: ProfileStats }) {
  const items = [
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: <Plane className="size-5" />,
      tone: "bg-sky-50 text-sky-500 group-hover:bg-sky-500",
    },
    {
      label: "Countries Visited",
      value: stats.countriesVisited,
      icon: <Globe className="size-5" />,
      tone: "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500",
    },
    {
      label: "Upcoming Trips",
      value: stats.upcomingTrips,
      icon: <TrendingUp className="size-5" />,
      tone: "bg-orange-50 text-orange-500 group-hover:bg-orange-500",
    },
    {
      label: "Total Spent",
      value: formatTaka(stats.totalSpent),
      icon: <span className="text-lg font-semibold leading-none">৳</span>,
      tone: "bg-fuchsia-50 text-fuchsia-500 group-hover:bg-fuchsia-500",
    },
  ]

  return (
    <section>
      <h2 className="text-xl font-medium text-neutral-900">Travel Statistics</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {items.map((item, i) => (
          <Card
            key={item.label}
            style={{ animationDelay: `${i * 70}ms` }}
            className="group animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex-row items-center justify-between gap-4 rounded-2xl border-0 bg-white p-6 shadow-sm ring-1 ring-black/5 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 motion-reduce:animate-none"
          >
            <div>
              <p className="text-sm text-neutral-500">{item.label}</p>
              <p className="mt-2 text-2xl font-medium tabular-nums text-neutral-900">
                {item.value}
              </p>
            </div>
            <div
              className={`grid size-12 shrink-0 place-items-center rounded-full transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:text-white ${item.tone}`}
            >
              {item.icon}
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}