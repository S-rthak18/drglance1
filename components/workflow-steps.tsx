import { Image, Brain, Lightbulb } from "lucide-react"

export function WorkflowSteps() {
  const steps = [
    {
      number: "01",
      title: "Capture Your Image",
      description: "Use our DrGlance device or smartphone to capture clear photos of your oral or eye area.",
      icon: Image,
      color: "bg-blue-100",
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Our advanced local AI model analyzes the image in seconds to identify potential health concerns.",
      icon: Brain,
      color: "bg-teal-100",
    },
    {
      number: "03",
      title: "Get Recommendations",
      description: "Receive instant health advice, preventive measures, and consultation recommendations from experts.",
      icon: Lightbulb,
      color: "bg-green-100",
    },
  ]

  return (
    <section className="bg-white px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">How DrGlance Works</h2>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${step.color}`}>
                <step.icon className="h-7 w-7 text-gray-700" />
              </div>
              <div className="mb-2 text-sm font-medium text-teal-600">{step.number}</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Connected Integrations */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-sm text-gray-500">Share results with healthcare professionals:</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {["Dentists", "Ophthalmologists", "Doctors", "Clinics", "Hospitals", "Healthcare Apps"].map((tool) => (
              <div key={tool} className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                <span className="text-xs font-semibold text-gray-700">{tool[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
