"use client"

import { LoginForm } from "@/components/login-form"
import { GalleryVerticalEndIcon } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col gap-6 p-6 md:p-12 bg-gradient-to-br from-background to-background/95">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="flex size-30 items-center justify-center rounded-lg">
            <img src="/qed-logo.png" alt="Quest Logo" className="size-full rounded object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground">Quest Exploration Drilling</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Main Form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right side - Image with Enhanced Styling */}
      <div className="relative hidden lg:flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-10 z-0"
          style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(33, 150, 243, 0.1) 25%, rgba(33, 150, 243, 0.1) 26%, transparent 27%, transparent 74%, rgba(33, 150, 243, 0.1) 75%, rgba(33, 150, 243, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(33, 150, 243, 0.1) 25%, rgba(33, 150, 243, 0.1) 26%, transparent 27%, transparent 74%, rgba(33, 150, 243, 0.1) 75%, rgba(33, 150, 243, 0.1) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px'
          }}
        />

        {/* Main image */}
        <img
          src="/login-img.png"
          alt="Quest Exploration Drilling Equipment"
          className="absolute inset-0 h-full w-full object-cover z-5"
        />

        {/* Content Overlay */}
        <div className="relative z-20 text-center text-white px-6 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight drop-shadow-lg">
            QED - Portal
          </h2>
          <p className="text-white/70 text-lg max-w-md drop-shadow-md">
            Quest Exploration Drilling is a privately owned drilling company operating accross the Asia Pacific region.
            We remain committed to providing the best value service in the region for our customers.
          </p>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-20" />
      </div>
    </div>
  )
}
