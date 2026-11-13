"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"

export default function DestinationImage({
  src,
  alt,
  priority = false,
}: {
  src: string
  alt: string
  priority?: boolean
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className="grid size-full place-items-center bg-gradient-to-br from-[#1a9fc0] via-cyan-400 to-sky-300">
        <MapPin className="size-10 text-white/80" />
      </div>
    )
  }

  return (
    <>
      {/* shimmer shown until the image is ready */}
      {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        unoptimized // remote URLs from your API; remove if you configure images.remotePatterns
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
        // cached images can finish before hydration, so check .complete too
        ref={(img) => {
          if (img?.complete && img.naturalWidth > 0) setLoaded(true)
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`object-cover transition-all duration-700 ease-out group-hover:scale-110 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  )
}