"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ResultsPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Health Analysis Results</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Here you'll see all your health scan results, analysis reports, and recommendations
            from DrGlance's AI model. Coming soon!
          </p>
          <div className="space-y-4">
            <div className="h-24 bg-linear-to-br from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center">
              <span className="text-teal-600 font-semibold">Results will appear here</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
