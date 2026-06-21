// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
    providers: [
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID!,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
            tenantId: "common",
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false

            try {
                const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login-auth`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ EmailAddress: user.email }),
                })

                const data = await res.json().catch(() => null)

                // Block only if explicitly failed (inactive / no portal access)
                if (!res.ok) return false

                // Check for failed status from BC
                if (data?.Status === 'Failed') {
                    const blockedMessages = [
                        "User is not allowed to access the portal.",
                        "User is inactive.",
                    ]
                    if (blockedMessages.includes(data?.Message)) return false
                }

                if (data?.Status === 'Successful' || data?.success) {
                    // Found in BC/Portal — store userId
                    user.id = data.UserId ?? data.userId
                    user.role = data.Role ?? data.role
                    user.email = data.Email ?? data.email ?? user.email
                    return true
                }
                // If not found (401 with "Email not found") — still allow through, just no userId
                return res.ok && data?.Status !== 'Failed'
            } catch {
                return false
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.userId = user.id
                token.email = user.email ?? undefined
            }
            return token
        },
        async session({ session, token }) {
            session.user.email = token.email as string
            session.user.userId = token.userId
            session.user.role = token.role as string
            return session
        },
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }