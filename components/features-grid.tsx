import { Eye, Pill, BarChart3 } from "lucide-react"

export function FeaturesGrid() {
  return (
    <section className="bg-white px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Complete Health Intelligence
            <br />
            for You and Your Family
          </h2>
          <p className="mx-auto max-w-xl text-gray-600">
            From early detection to professional consultation guidance—DrGlance gives you complete control over your oral and eye health.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Feature 1 - Comprehensive Analysis */}
          <div className="group overflow-hidden rounded-2xl bg-linear-to-br from-blue-50 to-blue-100 p-1">
            <div className="h-full rounded-xl bg-linear-to-br from-blue-50 to-blue-100 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-cyan-600">
                <Eye className="h-6 w-6 text-white" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900">Comprehensive Eye Analysis</h3>
              <p className="mt-2 text-sm text-gray-600">
                Detect early signs of eye conditions including refractive errors, cataracts, and other concerns with our advanced AI.
              </p>
            </div>
          </div>

          {/* Feature 2 - Oral Health Screening */}
          <div className="group overflow-hidden rounded-2xl bg-linear-to-br from-teal-50 to-green-100 p-1">
            <div className="h-full rounded-xl bg-linear-to-br from-teal-50 to-green-100 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-teal-600 to-green-600">
                <Pill className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Oral Health Screening</h3>
              <p className="mt-2 text-sm text-gray-600">
                Identify dental issues like cavities, gum disease, and plaque buildup before they become serious problems.
              </p>
            </div>
          </div>

          {/* Feature 3 - Health Tracking */}
          <div className="group overflow-hidden rounded-2xl bg-linear-to-br from-purple-50 to-pink-100 p-1">
            <div className="h-full rounded-xl bg-linear-to-br from-purple-50 to-pink-100 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-600 to-pink-600">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900">Health Progress Tracking</h3>
              <p className="mt-2 text-sm text-gray-600">
                Monitor your health improvements over time with detailed analytics and monthly health reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
