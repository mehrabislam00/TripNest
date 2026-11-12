import { Outfit } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar/navbar";
import { Footer } from "react-day-picker";

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Outfit({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", outfit.variable)}
    >
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
