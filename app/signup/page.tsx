"use client"

import { SignUp } from "@clerk/nextjs"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-teal-600">
              <span className="text-sm font-bold text-white">G</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">DrGlance</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join DrGlance and start monitoring your health</p>
        </div>

        {/* Clerk SignUp Component */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-white shadow-none border-0 p-0",
                formButtonPrimary:
                  "bg-linear-to-r from-blue-600 to-teal-600 text-white font-semibold py-2.5 rounded-lg hover:from-blue-700 hover:to-teal-700 w-full transition-all",
                formFieldInput:
                  "border border-gray-300 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full",
                formFieldLabel: "text-gray-700 font-medium text-sm mb-2",
                socialButtonsBlockButton:
                  "border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 w-full transition-colors",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-500 text-sm",
                footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
                formResendCodeLink: "text-blue-600 hover:text-blue-700 font-medium",
                alternativeMethods: "flex gap-2 justify-center mt-4",
                form: "space-y-4",
                formFieldInputShowPasswordButton: "text-blue-600 hover:text-blue-700",
              },
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "blockButton",
              },
            }}
            routing="hash"
            redirectUrl="/dashboard"
          />
        </div>

        {/* Footer Link */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-semibold hover:text-blue-700">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  )
}
