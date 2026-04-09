import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "DrGlance has completely changed how I monitor my oral health. The instant feedback and professional reports help me take preventive care seriously.",
      author: "Dr. Priya Sharma",
      role: "Dentist",
      rating: 5,
    },
    {
      quote:
        "As someone with family history of eye issues, DrGlance gives me peace of mind. The accuracy of early detection is impressive and the app is so easy to use.",
      author: "Rajesh Patel",
      role: "Patient",
      rating: 5,
    },
    {
      quote:
        "We've integrated DrGlance into our clinic for patient preliminary screening. It's saving us time and helping us identify cases that need urgent attention.",
      author: "Dr. Meera Gupta",
      role: "Ophthalmologist",
      rating: 5,
    },
  ]

  return (
    <section className="bg-gray-50 px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">Trusted by Healthcare Professionals</h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-2xl bg-white p-6 shadow-sm">
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="mb-6 text-gray-700">"{testimonial.quote}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full">
                  <img
                    src={`/professional-team.png?height=40&width=40&query=professional ${testimonial.author} portrait`}
                    alt={testimonial.author}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
