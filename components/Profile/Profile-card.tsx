"use client"

import { useState } from "react"
import { Camera, MapPin, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Profile } from "@/lib/Profile"
import { Avatar } from "./Profile-avatar"
import EditProfileDialog from "./Edit-profile-dialog"


const memberSince = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC", // same output on server and client
      })
    : "—"

export default function ProfileCard({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false)

  const rows = [
    { label: "Member since", value: memberSince(profile.memberSince) },
    { label: "Email", value: profile.email },
    ...(profile.phone ? [{ label: "Phone", value: profile.phone }] : []),
  ]

  return (
    <>
      <Card className="gap-0 rounded-2xl border-0 bg-white py-0 shadow-lg shadow-black/5 ring-1 ring-black/5">
        <CardContent className="p-6">
          {/* Avatar */}
          <div className="relative mx-auto size-36">
            <Avatar
              src={profile.avatar}
              name={profile.name}
              className="size-36 text-5xl ring-4 ring-white shadow-lg shadow-black/10"
            />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Change profile photo"
              className="absolute bottom-1 right-1 grid size-9 place-items-center rounded-full bg-[#1a9fc0] text-white shadow-md ring-2 ring-white transition-all duration-300 hover:scale-110 hover:bg-[#168aa8]"
            >
              <Camera className="size-4" />
            </button>
          </div>

          <h2 className="mt-5 text-center text-xl font-medium text-neutral-900">
            {profile.name}
          </h2>
          <p className="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-neutral-500">
            <MapPin className="size-3.5" />
            {profile.address || "Add your location"}
          </p>

          <dl className="mt-6 space-y-3 border-t border-neutral-100 pt-5 text-sm">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-4">
                <dt className="shrink-0 text-xs text-neutral-500">{r.label}</dt>
                <dd className="min-w-0 truncate text-xs font-semibold text-neutral-900">
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>

          <Button
            onClick={() => setOpen(true)}
            className="group mt-6 h-11 w-full gap-2 bg-[#1a9fc0] shadow-md shadow-[#1a9fc0]/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#168aa8] hover:shadow-lg hover:shadow-[#1a9fc0]/40"
          >
            <Pencil className="size-4 transition-transform duration-300 group-hover:rotate-12" />
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      <EditProfileDialog profile={profile} open={open} onOpenChange={setOpen} />
    </>
  )
}