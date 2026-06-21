import { cookies } from "next/headers";
import { verifySession, createSession } from "./session";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { SessionUser } from "@/types/bc-types";

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_session")?.value;

  // 1. Try your own OTP session first
  if (token) {
    try {
      return (await verifySession(token)) as SessionUser;
    } catch { }
  }

  // 2. Fall back to NextAuth (Microsoft login)
  const nextAuthSession = await getServerSession(authOptions)

  if (nextAuthSession?.user?.email) {
    return {
      UserId: nextAuthSession.user.userId ?? null,
      user: {
        Email: nextAuthSession.user.email ?? null,
        UserId: nextAuthSession.user.userId ?? null,
        Role: nextAuthSession.user.role ?? null,
      },
    }
  }

  return null;
}