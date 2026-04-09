"use client"

import { useState } from "react"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      name: "Basic Plan",
      description: "For personal health monitoring",
      price: isYearly ? 8 : 9.99,
      features: [
        "10 monthly analyses",
        "Oral & eye health screening",
        "Basic health recommendations",
        "PDF report generation",
        "Email support",
      ],
      featured: false,
    },
    {
      name: "Pro Plan",
      description: "For regular users & families",
      price: isYearly ? 19 : 24.99,
      features: [
        "Unlimited analyses",
        "Advanced AI diagnostics",
        "Detailed health reports",
        "Family member profiles",
        "Professional consultation guides",
        "Priority email & chat support",
      ],
      featured: true,
    },
    {
      name: "Clinic Plan",
      description: "For healthcare professionals",
      price: isYearly ? 79 : 99,
      features: [
        "Everything in Pro +",
        "Multi-user access",
        "Patient database management",
        "Advanced analytics & insights",
        "API integration",
        "24/7 priority support",
      ],
      featured: false,
    },
  ]

  return (
    <section className="bg-white px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">Simple, Transparent Pricing</h2>
          <p className="mx-auto max-w-xl text-gray-600">
            Choose a plan that fits your health monitoring needs. Start free and upgrade anytime for advanced features.
          </p>

          {/* Toggle - Updated toggle color to match original violet */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={`text-sm ${!isYearly ? "font-semibold text-gray-900" : "text-gray-500"}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                isYearly ? "bg-[#7c5cff]" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  isYearly ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className={`text-sm ${isYearly ? "font-semibold text-gray-900" : "text-gray-500"}`}>
              Yearly{" "}
              <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                20% off
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards - Updated featured card gradient to match original violet */}
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 ${
                plan.featured
                  ? "bg-linear-to-br from-teal-600 to-blue-600 text-white"
                  : "border border-gray-200 bg-white"
              }`}
            >
              <h3 className={`text-lg font-semibold ${plan.featured ? "text-white" : "text-gray-900"}`}>{plan.name}</h3>
              <p className={`mt-1 text-sm ${plan.featured ? "text-teal-100" : "text-gray-500"}`}>
                {plan.description}
              </p>

              <div className="mt-6">
                <span className={`text-4xl font-bold ${plan.featured ? "text-white" : "text-gray-900"}`}>
                  ${plan.price}
                </span>
                <span className={`text-sm ${plan.featured ? "text-violet-100" : "text-gray-500"}`}>/month</span>
              </div>

              <Button
                className={`mt-6 w-full rounded-full ${
                  plan.featured
                    ? "bg-white text-teal-600 hover:bg-gray-100"
                    : "bg-linear-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700"
                }`}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="mt-6">
                <p className={`mb-4 text-sm font-medium ${plan.featured ? "text-white" : "text-gray-900"}`}>
                  Included features:
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className={`h-4 w-4 ${plan.featured ? "text-teal-200" : "text-teal-600"}`} />
                      <span className={plan.featured ? "text-teal-100" : "text-gray-600"}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
