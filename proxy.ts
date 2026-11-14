import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (session) return NextResponse.next()

  const signInUrl = request.nextUrl.clone()
  signInUrl.pathname = "/signIn"
  signInUrl.search = ""
  signInUrl.searchParams.set(
    "callbackUrl",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  )

  return NextResponse.redirect(signInUrl)
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/my-bookings/:path*",
    "/add-destination/:path*",
    "/admin/:path*",
  ],
}