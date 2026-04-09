export function TestimonialQuote() {
  return (
    <section className="bg-gray-50 px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-4xl text-center">
        <blockquote className="mb-8 text-2xl font-medium leading-relaxed text-gray-900 md:text-3xl lg:text-4xl">
          "DrGlance empowers users to monitor their health with AI-powered insights, making preventive care accessible and effortless."
        </blockquote>
        <div className="flex items-center justify-center gap-4">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-linear-to-br from-blue-500 to-teal-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">DG</span>
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-900">DrGlance Team</div>
            <div className="text-sm text-gray-500">Health Innovation Platform</div>
          </div>
        </div>
      </div>
    </section>
  )
}
