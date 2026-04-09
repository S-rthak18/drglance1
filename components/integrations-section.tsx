import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function IntegrationsSection() {
  const integrations = [
    { name: "Google Fit", color: "bg-blue-50" },
    { name: "Apple Health", color: "bg-gray-50" },
    { name: "Samsung Health", color: "bg-indigo-50" },
    { name: "Fitbit", color: "bg-orange-50" },
    { name: "Garmin", color: "bg-red-50" },
    { name: "Telegram", color: "bg-sky-50" },
    { name: "WhatsApp", color: "bg-green-50" },
    { name: "Email", color: "bg-purple-50" },
  ]

  return (
    <section className="bg-linear-to-b from-white to-gray-50 px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Sync With Your
            <br />
            Favorite Health Apps
          </h2>
          <Button variant="outline" className="group rounded-full bg-transparent">
            Learn about integrations
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className={`flex aspect-square flex-col items-center justify-center rounded-2xl ${integration.color} p-4 transition-transform hover:scale-105`}
            >
              <div className="h-12 w-12 rounded-lg bg-linear-to-br from-teal-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                {integration.name[0]}
              </div>
              <span className="mt-2 text-xs font-medium text-gray-700">{integration.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
