"use client"

import { useState } from "react"

// Profile photo with an initials fallback (also used if the image URL is broken)
export function Avatar({
  src,
  name,
  className = "",
}: {
  src?: string
  name: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const initial = (name.trim()[0] ?? "?").toUpperCase()

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className={`rounded-full object-cover ${className}`}
      />
    )
  }
  return (
    <span
      aria-label={name}
      className={`grid place-items-center rounded-full bg-gradient-to-br from-[#1a9fc0] to-cyan-400 font-medium text-white ${className}`}
    >
      {initial}
    </span>
  )
}