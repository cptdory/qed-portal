"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { sileo } from "sileo"
import { signIn } from "next-auth/react"
type Step = "email" | "otp"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRequestOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email) {
      setError("Email address is required.")
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const res = await fetch("/api/login-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ EmailAddress: email }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok || data?.Status !== "Successful") {
        const message = data?.Message || "Login failed. Please try again."
        setError(message)
        sileo.error({ title: "Login Failed " + message,  fill: "#171717" })
        return
      }

      sileo.success({ title: "Verification code sent.", description: `Check ${email} for your code.`, fill: "#171717" })
      setOtp("")
      setStep("otp")
    } catch (err) {
      console.error(err)
      const message = "An unexpected error occurred."
      setError(message)
      sileo.error({ title: "Login Failed", description: message, fill: "#171717" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!otp || otp.length !== 6) {
      setError("Enter the 6-digit code sent to your email.")
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const res = await fetch("/api/otp-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ EmailAddress: email, OTP: otp }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok || !data?.success) {
        const message = data?.error || "Invalid or expired code."
        setError(message)
        sileo.error({ title: "Verification Failed", description: message, fill: "#171717" })
        return
      }

      sileo.success({ title: `Welcome back${data.user?.Email ? `, ${data.user.Email}` : ""}.`, fill: "#171717" })
      router.push("/dashboard")
    } catch (err) {
      console.error(err)
      const message = "An unexpected error occurred."
      setError(message)
      sileo.error({ title: "Verification Failed", description: message, fill: "#171717" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (submitting) return
    try {
      setSubmitting(true)
      setError(null)

      const res = await fetch("/api/login-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ EmailAddress: email }),
      })
      const data = await res.json().catch(() => null)

      if (!res.ok || !data?.success) {
        const message = data?.error || "Unable to resend code."
        sileo.error({ title: "Resend Failed", description: message, fill: "#171717" })
        return
      }

      setOtp("")
      sileo.success({ title: "A new code has been sent.", fill: "#171717" })
    } catch (err) {
      console.error(err)
      sileo.error({ title: "Resend Failed", description: "An unexpected error occurred.", fill: "#171717" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChangeEmail = () => {
    setStep("email")
    setOtp("")
    setError(null)
  }

  return (
    <form
      className={cn("flex flex-col gap-7", className)}
      onSubmit={step === "email" ? handleRequestOtp : handleVerifyOtp}
      {...props}
    >
      <FieldGroup className="gap-7">

        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight leading-tight">
              {step === "email" ? "Welcome back" : "Check your email"}
            </h1>
            <p className="text-base text-muted-foreground/75 text-balance">
              {step === "email"
                ? "Sign in to access portal"
                : `Enter the 6-digit code we sent to ${email}`}
            </p>
          </div>
        </div>

        {step === "email" ? (
          <>
            {/* Microsoft SSO — primary CTA */}
            <Field>
              <Button
                variant="outline"
                type="button"
                onClick={() => signIn("azure-ad", { callbackUrl: "/dashboard" })}
                className="w-full ..."
              >
                {/* Official Microsoft 4-square icon */}
                <svg
                  className="shrink-0"
                  width="20"
                  height="20"
                  viewBox="0 0 21 21"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                </svg>
                Continue with Microsoft
              </Button>
            </Field>

            {/* Divider with better styling */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border" />
              <span className="text-xs font-medium text-muted-foreground/60 px-2">or</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border" />
            </div>

            {/* Email input */}
            <Field>
              <FieldLabel
                htmlFor="email"
                className="text-xs font-bold text-foreground uppercase tracking-widest mb-2.5"
              >
                Email address
              </FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="h-13 mt-1 bg-background/40 border-border/50 text-base placeholder:text-muted-foreground/35 focus:bg-background focus:border-primary/50 focus:shadow-md focus:shadow-primary/15 transition-all duration-250 rounded-lg"
              />
            </Field>

            {/* Submit Button */}
            <Field>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-13 font-bold text-base bg-gradient-to-r from-primary via-primary to-primary/95 hover:shadow-xl hover:shadow-primary/25 shadow-lg shadow-primary/20 transition-all duration-300 rounded-lg group disabled:opacity-70"
              >
                {submitting ? "Sending code..." : "Continue"}
                {!submitting && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="ml-2 group-hover:translate-x-0.5 transition-transform duration-300"
                  >
                    <path
                      d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </Button>
            </Field>
          </>
        ) : (
          <>
            {/* OTP input */}
            <Field>
              <FieldLabel
                htmlFor="otp"
                className="text-xs font-bold text-foreground uppercase tracking-widest mb-2.5"
              >
                Verification code
              </FieldLabel>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="123456"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                disabled={submitting}
                className="h-13 mt-1 bg-background/40 border-border/50 text-center text-2xl tracking-[0.5em] placeholder:text-muted-foreground/35 placeholder:tracking-[0.5em] focus:bg-background focus:border-primary/50 focus:shadow-md focus:shadow-primary/15 transition-all duration-250 rounded-lg"
              />
            </Field>

            {/* Submit Button */}
            <Field>
              <Button
                type="submit"
                disabled={submitting || otp.length !== 6}
                className="w-full h-13 font-bold text-base bg-gradient-to-r from-primary via-primary to-primary/95 hover:shadow-xl hover:shadow-primary/25 shadow-lg shadow-primary/20 transition-all duration-300 rounded-lg disabled:opacity-70"
              >
                {submitting ? "Verifying..." : "Verify & Sign In"}
              </Button>
            </Field>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleChangeEmail}
                disabled={submitting}
                className="font-semibold text-muted-foreground/75 hover:text-foreground transition-colors"
              >
                ← Use a different email
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={submitting}
                className="font-semibold text-foreground/80 hover:text-foreground transition-colors underline underline-offset-2"
              >
                Resend code
              </button>
            </div>
          </>
        )}

        {/* Divider before footer */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/65 leading-relaxed">
          By continuing, you agree to our{" "}
          <a href="/terms" className="font-semibold text-foreground/80 hover:text-foreground transition-colors underline underline-offset-2 hover:underline-offset-1">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="font-semibold text-foreground/80 hover:text-foreground transition-colors underline underline-offset-2 hover:underline-offset-1">
            Privacy
          </a>
        </p>

      </FieldGroup>
    </form>
  )
}