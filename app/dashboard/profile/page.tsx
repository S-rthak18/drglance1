"use client"

import { useAuth, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ProfilePage() {
  const { userId, isLoaded } = useAuth()
  const { user } = useUser()
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
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <p className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-gray-50">
                {user?.firstName} {user?.lastName}
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <p className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-gray-50">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <p className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-gray-50">
                {user?.phoneNumbers?.[0]?.phoneNumber || "Not provided"}
              </p>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
              <p className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-gray-50">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>

            {/* Edit Button */}
            <div className="pt-4">
              <Button
                disabled
                className="bg-linear-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 w-full opacity-60 cursor-not-allowed"
              >
                Edit Profile (Coming Soon)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
