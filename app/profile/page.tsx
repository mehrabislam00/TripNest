import { redirect } from "next/navigation"

import ProfileCard from "@/components/Profile/Profile-card"
import ProfileStatsGrid from "@/components/Profile/Profile-stats"
import { getProfile, getProfileStats, getSessionUser } from "@/lib/Profile"

export const metadata = {
  title: "My Profile | Wanderlast",
}

export default async function Profile() {
  const user = await getSessionUser()
  if (!user) redirect("/signIn")

  const [profile, stats] = await Promise.all([
    getProfile(user),
    getProfileStats(user.email),
  ])

  return (
    <main className="min-h-svh bg-gradient-to-b from-sky-50/70 to-white px-4 pb-20 pt-28 sm:pt-36 lg:px-12">
      <div className="mx-auto max-w-[1100px]">
        <header className="mb-10">
          <h1 className="text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl">
            My Profile
          </h1>
          <p className="mt-3 text-sm text-neutral-600">
            Manage your account settings and travel preferences
          </p>
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-[300px_1fr]">
          <ProfileCard profile={profile} />
          <ProfileStatsGrid stats={stats} />
        </div>
      </div>
    </main>
  )
}