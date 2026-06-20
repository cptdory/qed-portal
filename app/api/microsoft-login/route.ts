import { NextResponse } from "next/server"
import { createSession } from "@/lib/session" // whatever you use to create auth_session

export async function POST(req: Request) {
  const { EmailAddress } = await req.json()

  if (!EmailAddress) {
    return NextResponse.json({ success: false, error: "Email is required." }, { status: 400 })
  }

  // Call your existing BC LoginAuth API
  const bcRes = await fetch(`api/login-auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ EmailAddress }),
  })

  const bcData = await bcRes.json().catch(() => null)

  if (!bcRes.ok || !bcData?.success) {
    return NextResponse.json(
      { success: false, error: bcData?.error || "User not found." },
      { status: 401 }
    )
  }

  // User exists in BC — create your own auth_session cookie just like OTP flow does
  const token = await createSession(bcData.user)
  
  const response = NextResponse.json({ success: true, user: bcData.user })
  response.cookies.set("auth_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })

  return response
}