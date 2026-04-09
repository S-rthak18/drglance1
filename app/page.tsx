import { HeroSection } from "@/components/hero-section"
import { LogoMarquee } from "@/components/logo-marquee"
import { FeaturesGrid } from "@/components/features-grid"
import { WorkflowSteps } from "@/components/workflow-steps"
import { IntegrationsSection } from "@/components/integrations-section"
import { TestimonialQuote } from "@/components/testimonial-quote"
import { BentoFeatures } from "@/components/bento-features"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PricingSection } from "@/components/pricing-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <LogoMarquee />
      <FeaturesGrid />
      <WorkflowSteps />
      <IntegrationsSection />
      <TestimonialQuote />
      <BentoFeatures />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </main>
  )
}
