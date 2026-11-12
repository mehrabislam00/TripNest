import Image from "next/image"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import shieldCheck from "@/assets/ShieldCheck.png"
import mapTrifold from "@/assets/MapTrifold.png"
import headset from "@/assets/Headset.png"

const features = [
  {
    icon: shieldCheck,
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
  },
  {
    icon: mapTrifold,
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
  },
  {
    icon: headset,
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
  },
]

export default function WhyChoose() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-cyan-50 px-4 py-20 lg:px-12 lg:py-28">
      {/* soft decorative glows */}
      <div className="pointer-events-none absolute -left-32 top-0 size-96 rounded-full bg-[#1a9fc0]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-96 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl">
            Why Choose Wanderlast
          </h2>
          <p className="mt-4 text-sm text-neutral-600 sm:text-base">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-8">
          {features.map(({ icon, title, description }) => (
            <Card
              key={title}
              className="group relative gap-0 overflow-hidden rounded-2xl border-0 bg-white py-0 shadow-sm ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#1a9fc0]/20"
            >
              {/* accent bar that grows on hover */}
              <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#1a9fc0] transition-transform duration-500 group-hover:scale-x-100" />

              <CardHeader className="gap-0 p-8">
                {/* icon tile: fills teal, icon turns white on hover */}
                <div className="grid size-14 place-items-center rounded-2xl bg-[#1a9fc0]/10 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-[#1a9fc0] group-hover:shadow-lg group-hover:shadow-[#1a9fc0]/40">
                  <Image
                    src={icon}
                    alt=""
                    aria-hidden
                    className="size-7 object-contain transition-all duration-500 group-hover:brightness-0 group-hover:invert"
                  />
                </div>

                <CardTitle className="mt-6 text-2xl font-medium text-neutral-900 transition-colors duration-300 group-hover:text-[#1a9fc0]">
                  {title}
                </CardTitle>
                <CardDescription className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}