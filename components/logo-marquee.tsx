export function LogoMarquee() {
  const logos = [
    { name: "Swiss", icon: "✚" },
    { name: "KOBE", icon: "市" },
    { name: "On_Event", icon: "</>" },
    { name: "theo", icon: "✎" },
    { name: "oslo.", icon: "" },
    { name: "Imprintify", icon: "📊" },
    { name: "Berlin.", icon: "🏛️" },
    { name: "Urban", icon: "↻" },
  ]

  return (
    <section className="overflow-hidden border-y border-gray-200 bg-white py-6">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...logos, ...logos].map((logo, index) => (
          <div key={index} className="mx-8 flex items-center gap-2">
            <span className="text-lg">{logo.icon}</span>
            <span className="text-lg font-semibold text-gray-800">{logo.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
