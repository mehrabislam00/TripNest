"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, User, X } from "lucide-react"

const mainLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "My Bookings", href: "/bookings" },
  { label: "Admin", href: "/admin" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="absolute inset-x-4 top-4 z-30 lg:inset-x-8">
      <nav className="relative flex h-16 items-center justify-between rounded-2xl bg-white/90 px-5 shadow-lg shadow-black/10 ring-1 ring-black/5 backdrop-blur-md lg:h-[72px] lg:px-10">
        {/* Left: main links (desktop) */}
        <ul className="hidden items-center gap-9 lg:flex">
          {mainLinks.map((link) => {
            const active = pathname === link.href
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
                  {/* animated underline */}
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

        {/* Logo: centered on desktop, left on mobile */}
        <Link
          href="/"
          className="text-[26px] font-bold tracking-tight text-[#1a9fc0] transition-transform duration-300 hover:scale-105 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:hover:scale-105"
        >
          Wanderlast
        </Link>

        {/* Right: actions (desktop) */}
        <div className="hidden items-center gap-7 lg:flex">
          <Link
            href="/profile"
            className="flex items-center gap-2 text-[15px] font-medium text-neutral-700 transition-colors duration-300 hover:text-[#1a9fc0]"
          >
            <span className="grid size-8 place-items-center rounded-full bg-neutral-100 transition-colors duration-300 group-hover:bg-[#1a9fc0]/10">
              <User className="size-4" />
            </span>
            Profile
          </Link>
          <Link
            href="/login"
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
        <div className="mt-2 rounded-2xl bg-white/95 p-4 shadow-lg ring-1 ring-black/5 backdrop-blur-md lg:hidden">
          <ul className="flex flex-col gap-1">
            {[
              ...mainLinks,
              { label: "Profile", href: "/profile" },
              { label: "Login", href: "/login" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors hover:bg-[#1a9fc0]/10 hover:text-[#1a9fc0] ${
                    pathname === link.href
                      ? "text-[#1a9fc0]"
                      : "text-neutral-700"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-xl bg-[#1a9fc0] px-5 py-3 text-center text-[15px] font-medium text-white transition-colors hover:bg-[#168aa8]"
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  )
}