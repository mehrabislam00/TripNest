import Image from "next/image"
import Link from "next/link"

import { Separator } from "@/components/ui/separator"


import logo from "@/assets/Wanderlast-1.png"
import NewsletterForm from "../Newsletterform/Newsletterform"

const linkGroups = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Destinations", href: "#destinations" },
      { label: "My Bookings", href: "/bookings" },
      { label: "My Profile", href: "/profile" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
  {
    title: "Contact Us",
    links: [
      { label: "786 901 1622", href: "tel:+7869011622" },
      { label: "info@wanderlast.com", href: "mailto:info@wanderlast.com" },
    ],
  },
]

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
  className: "size-[18px]",
} as const

const socials = [
  {
    label: "X (Twitter)",
    href: "https://x.com",
    icon: (
      <svg {...iconProps}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg {...iconProps}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg {...iconProps}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
]

const linkClass =
  "inline-block text-sm text-white/65 transition-all duration-300 hover:translate-x-1 hover:text-white focus-visible:text-white focus-visible:outline-none"

export default function Footer() {
  return (
    <footer className="bg-[#0b0b0b] px-6 pb-8 pt-16 text-white sm:px-10 lg:px-12 lg:pt-20">
      <div className="mx-auto max-w-[1400px]">
        {/* Brand */}
        <div>
          <Link href="/" aria-label="Wanderlast home" className="inline-block">
            <Image
              src={logo}
              alt="Wanderlast"
              placeholder="blur"
              className="h-auto w-56 sm:w-72 lg:w-96"
            />
          </Link>
          <p className="mt-4 max-w-md text-sm text-white/60 sm:text-base">
            Your gateway to extraordinary travel experiences around the world.
          </p>
        </div>

        {/* Columns */}
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-8">
          <div>
            <h3 className="text-sm font-light uppercase tracking-wider text-white">
              Newsletter
            </h3>
            <p className="mb-4 mt-2 text-xs text-white/55">
              Subscribe for exclusive travel deals and inspiration.
            </p>
            <NewsletterForm />
          </div>

          {linkGroups.map(({ title, links }) => (
            <nav key={title} aria-label={title}>
              <h3 className="text-sm font-light uppercase tracking-wider text-white">
                {title}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className={linkClass}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Separator className="mb-6 mt-14 bg-white/10 lg:mt-16" />

        {/* Bottom bar */}
        <div className="flex flex-col-reverse items-center justify-between gap-5 sm:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Wanderlast. All rights reserved.
          </p>

          <ul className="flex items-center gap-2">
            {socials.map(({ label, href, icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full text-white/80 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1a9fc0] hover:text-white hover:shadow-lg hover:shadow-[#1a9fc0]/40 focus-visible:ring-2 focus-visible:ring-[#1a9fc0] focus-visible:outline-none"
                >
                  {icon}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}