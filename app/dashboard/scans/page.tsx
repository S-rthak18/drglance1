"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ScansPage() {
  const { userId, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/login")
    }
  }, [isLoaded, userId, router])

  if (!isLoaded) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="ghost"
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Health Scans</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Perform a Health Scan</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            This feature will allow you to capture images and run health analysis using DrGlance's
            advanced AI model. Coming soon!
          </p>
          <div className="h-32 bg-linear-to-br from-blue-100 to-teal-100 rounded-lg mb-8 flex items-center justify-center">
            <span className="text-blue-600 font-semibold">Camera / Image Upload Area</span>
          </div>
          <Button className="bg-linear-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700">
            Coming Soon
          </Button>
        </div>
      </div>
    </div>
  )
}
