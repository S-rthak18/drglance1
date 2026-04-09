import { Camera, Zap, Heart, FileText } from "lucide-react"

export function BentoFeatures() {
  return (
    <section className="bg-white px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Advanced Health Monitoring
            <br />
            Made Simple
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Large Card - Photo Capture */}
          <div className="rounded-2xl bg-linear-to-br from-blue-50 to-blue-100 p-8">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-teal-600">
              <Camera className="h-7 w-7 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Instant Photo Analysis</h3>
            <p className="text-gray-600">
              Simply capture a photo using your DrGlance device or smartphone. Our device makes it easy to get accurate images for analysis.
            </p>
          </div>

          {/* Large Card - Local AI Processing */}
          <div className="rounded-2xl bg-linear-to-br from-teal-50 to-cyan-100 p-8">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-teal-600 to-cyan-600">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Local AI Processing</h3>
            <p className="text-gray-600">
              Runs on-device AI models ensure privacy and instant results. Your health data never leaves your device—maximum security and speed.
            </p>
          </div>

          {/* Small Cards Row */}
          <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
            {/* Health Insights */}
            <div className="rounded-2xl bg-linear-to-br from-red-50 to-pink-100 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-red-500 to-pink-500">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">Health Recommendations</h4>
              <p className="text-sm text-gray-600">
                Get instant, personalized health advice based on your oral and eye analysis with actionable preventive measures.
              </p>
            </div>

            {/* Professional Reports */}
            <div className="rounded-2xl bg-linear-to-br from-purple-50 to-indigo-100 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-600 to-indigo-600">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">Consultation Reports</h4>
              <p className="text-sm text-gray-600">
                Generate detailed reports you can share with dentists, ophthalmologists, or healthcare professionals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
