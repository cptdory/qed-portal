import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      userId?: string
      role?: string
      email?: string | undefined
    }
  }

  interface User {
    userId?: string
   email?: string | undefined
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string
    email?: string
    role?: string
  }
}