"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Loader2, LogOut, Menu, X } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { authClient } from "@/lib/auth-client"

const mainLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "My Bookings", href: "/my-bookings" },

]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  // Better Auth: reactive session (isPending = still checking)
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setOpen(false)
            router.push("/signIn")
            router.refresh()
          },
        },
      })
    } finally {
      setLoggingOut(false)
    }
  }

  const initial = (user?.name?.trim()?.[0] ?? user?.email?.[0] ?? "?").toUpperCase()

  const renderLogout = (className: string) => (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loggingOut}
      className={className}
    >
      {loggingOut ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <LogOut className="size-4" />
      )}
      Logout
    </button>
  )

  return (
    <header className="absolute inset-x-4 top-4 z-30 lg:inset-x-8">
      <nav className="relative flex h-16 items-center justify-between rounded-2xl bg-white/90 px-5 shadow-lg shadow-black/10 ring-1 ring-black/5 backdrop-blur-md lg:h-[72px] lg:px-10">
        {/* Left: main links (desktop) */}
        <ul className="hidden items-center gap-9 lg:flex">
          {mainLinks.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`group relative py-2 text-[15px] font-medium transition-colors duration-300 ${
                    active
                      ? "text-[#1a9fc0]"
                      : "text-neutral-700 hover:text-[#1a9fc0]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-[#1a9fc0] transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Logo */}
        <Link
          href="/"
          className="text-[26px] font-bold tracking-tight text-[#1a9fc0] transition-transform duration-300 hover:scale-105 lg:absolute lg:left-1/2 lg:-translate-x-1/2"
        >
          Wanderlast
        </Link>

        {/* Right: auth area (desktop) */}
        <div className="hidden items-center gap-5 lg:flex">
          {isPending ? (
            <Skeleton className="h-10 w-44 rounded-xl" />
          ) : user ? (
            <>
              <Link
                href="/profile"
                title={user.name}
                className={`group flex items-center gap-2.5 text-[15px] font-medium transition-colors duration-300 ${
                  pathname.startsWith("/profile")
                    ? "text-[#1a9fc0]"
                    : "text-neutral-700 hover:text-[#1a9fc0]"
                }`}
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt=""
                    className="size-9 rounded-full object-cover ring-2 ring-[#1a9fc0]/20 transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <span className="grid size-9 place-items-center rounded-full bg-[#1a9fc0]/10 text-sm font-semibold text-[#1a9fc0] ring-2 ring-[#1a9fc0]/20 transition-transform duration-300 group-hover:scale-110">
                    {initial}
                  </span>
                )}
                Profile
              </Link>
              {renderLogout("group flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-[15px] font-medium text-neutral-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-60")}
            </>
          ) : (
            <>
              <Link
                href="/signIn"
                className="text-[15px] font-medium text-neutral-700 transition-colors duration-300 hover:text-[#1a9fc0]"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-[#1a9fc0] px-5 py-2.5 text-[15px] font-medium text-white shadow-md shadow-[#1a9fc0]/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#168aa8] hover:shadow-lg hover:shadow-[#1a9fc0]/40"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-lg text-neutral-800 transition-colors hover:bg-neutral-100 lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="animate-in fade-in slide-in-from-top-2 mt-2 rounded-2xl bg-white/95 p-4 shadow-lg ring-1 ring-black/5 backdrop-blur-md duration-200 lg:hidden">
          <ul className="flex flex-col gap-1">
            {mainLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors hover:bg-[#1a9fc0]/10 hover:text-[#1a9fc0] ${
                    pathname === link.href ? "text-[#1a9fc0]" : "text-neutral-700"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-3 border-t border-neutral-100 pt-3">
            {isPending ? (
              <Skeleton className="h-11 w-full rounded-xl" />
            ) : user ? (
              <div className="space-y-3">
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-[15px] font-medium text-neutral-800 transition-colors hover:bg-[#1a9fc0]/10"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-[#1a9fc0]/10 text-sm font-semibold text-[#1a9fc0]">
                    {initial}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate">{user.name}</span>
                    <span className="block truncate text-xs font-normal text-neutral-500">
                      {user.email}
                    </span>
                  </span>
                </Link>
                {renderLogout("flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-[15px] font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60")}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/signIn"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-neutral-200 px-5 py-3 text-center text-[15px] font-medium text-neutral-700 transition-colors hover:border-[#1a9fc0] hover:text-[#1a9fc0]"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-[#1a9fc0] px-5 py-3 text-center text-[15px] font-medium text-white transition-colors hover:bg-[#168aa8]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}