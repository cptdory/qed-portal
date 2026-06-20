import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = await cookies()

  // Your custom session
  cookieStore.set("auth_session", "", {
    expires: new Date(0),
    path: "/",
  })

  // NextAuth session cookies
  cookieStore.set("next-auth.session-token", "", {
    expires: new Date(0),
    path: "/",
  })
  cookieStore.set("__Secure-next-auth.session-token", "", {
    expires: new Date(0),
    path: "/",
  })

  return NextResponse.json({ success: true, message: "Logged out" })
}