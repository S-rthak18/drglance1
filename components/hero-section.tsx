"use client"

import { ArrowRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTypingAnimation } from "@/hooks/use-typing-animation"

export function HeroSection() {
  const typedText = useTypingAnimation({
    texts: [
      "Your Health Care is Our Priority",
      "AI-Powered Health Monitoring",
      "Early Detection Saves Lives",
    ],
    speed: 50,
    delayBetweenTexts: 2500,
    loop: true,
  })

  return (
    <section className="relative overflow-hidden bg-linear-to-r from-slate-50 via-blue-50 to-slate-100 min-h-screen">
      {/* Doctor Image Background - Positioned absolutely */}
      <div className="absolute inset-0 hidden lg:block">
        <img
          src="/docimage.png"
          alt="Doctor"
          className="absolute right-0 top-0 h-full object-cover"
          style={{ width: "55%" }}
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-linear-to-r from-slate-50 via-blue-50/80 to-transparent" />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 md:px-12 lg:px-20">
        <div className="flex items-center gap-2">
          <img
            src="/DrGlancefevicon.png"
            alt="DrGlance Logo"
            className="h-8 w-8 object-contain"
          />
          <span className="text-lg font-semibold text-gray-900">DrGlance</span>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Features
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
            How It Works
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Pricing
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Contact
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="/login">
            <Button variant="ghost" className="hidden text-sm md:inline-flex text-gray-600 hover:text-gray-900">
              Log in
            </Button>
          </a>
          <a href="/signup">
            <Button className="rounded-full bg-linear-to-r from-blue-600 to-teal-600 px-5 text-sm text-white hover:from-blue-700 hover:to-teal-700">
              Get Started
            </Button>
          </a>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-300/50 bg-blue-50/70 px-4 py-2 backdrop-blur-sm">
                <span className="rounded-full bg-linear-to-r from-blue-600 to-teal-600 px-2.5 py-0.5 text-xs font-medium text-white">
                  Smart Device
                </span>
                <span className="text-sm text-blue-700">AI-Powered Health Monitoring</span>
              </div>

              {/* Animated Heading */}
              <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-5xl leading-tight min-h-20">
                {typedText}
                <span className="ml-1 animate-pulse text-blue-600">|</span>
              </h1>

              {/* Subheading */}
              <p className="mb-8 text-lg text-gray-600 max-w-lg">
                We work to take care of your health and body. DrGlance provides instant health insights and professional consultation guidance with advanced AI analysis.
              </p>

              {/* CTA Button */}
              <Button className="group rounded-lg bg-linear-to-r from-blue-600 to-teal-600 px-6 py-3 text-base font-semibold text-white hover:from-blue-700 hover:to-teal-700 shadow-lg">
                Start Your Health Journey
              </Button>
            </div>

            {/* Right Side - Empty (Image in background handles it) */}
            <div className="hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  )
}

