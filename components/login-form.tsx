"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-7", className)} {...props}>
      <FieldGroup className="gap-7">

        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight leading-tight">
              Welcome back
            </h1>
            <p className="text-base text-muted-foreground/75 text-balance">
              Sign in to access portal
            </p>
          </div>
        </div>

        {/* Microsoft SSO — primary CTA */}
        <Field>
          <Button
            variant="outline"
            type="button"
            className="w-full h-13 gap-3 font-semibold text-base border border-border/60 bg-background/50 hover:bg-background hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/15 rounded-lg"
          >
            {/* Official Microsoft 4-square icon */}
            <svg
              className="shrink-0"
              width="20"
              height="20"
              viewBox="0 0 21 21"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="1"  y="1"  width="9" height="9" fill="#F25022" />
              <rect x="11" y="1"  width="9" height="9" fill="#7FBA00" />
              <rect x="1"  y="11" width="9" height="9" fill="#00A4EF" />
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
            className="h-13 mt-1 bg-background/40 border-border/50 text-base placeholder:text-muted-foreground/35 focus:bg-background focus:border-primary/50 focus:shadow-md focus:shadow-primary/15 transition-all duration-250 rounded-lg"
          />
        </Field>

        {/* Submit Button */}
        <Field>
          <Button
            type="submit"
            className="w-full h-13 font-bold text-base bg-gradient-to-r from-primary via-primary to-primary/95 hover:shadow-xl hover:shadow-primary/25 shadow-lg shadow-primary/20 transition-all duration-300 rounded-lg group"
          >
            Continue
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
          </Button>
        </Field>

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