import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-linear-to-r from-slate-900 to-slate-800 px-6 py-20 text-white md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        {/* CTA Section */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Ready to Monitor Your Health?</h2>
          <p className="mx-auto mb-8 max-w-xl text-gray-300">
            Join thousands of people taking control of their oral and eye health with DrGlance's advanced AI analysis.
          </p>
          <Button className="group rounded-full bg-linear-to-r from-teal-500 to-blue-500 px-8 py-6 text-base text-white hover:from-teal-600 hover:to-blue-600">
            Get Started with DrGlance
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Footer Links */}
        <div className="grid gap-8 border-t border-gray-700/50 pt-12 md:grid-cols-5">
          {/* Logo */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-teal-500 to-blue-500">
                <span className="text-sm font-bold text-white">G</span>
              </div>
              <span className="text-lg font-semibold">DrGlance</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-gray-400">
              AI-powered health monitoring for your oral and eye health. Detect issues early and get professional guidance.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Medical Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-700/50 pt-8 text-sm text-gray-400 md:flex-row">
          <p>© 2025 DrGlance. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">
              Twitter
            </a>
            <a href="#" className="hover:text-white">
              LinkedIn
            </a>
            <a href="#" className="hover:text-white">
              Facebook
            </a>
            <a href="#" className="hover:text-white">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
