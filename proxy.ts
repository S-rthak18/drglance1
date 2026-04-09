import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
])

const isPublicRoute = createRouteMatcher([
  "/",
  "/login",
  "/signup",
])

export default clerkMiddleware(async (auth, req) => {
  // Protect dashboard and account routes
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest))(?:.*)|[^?]*\\.(?:js(?!on)|css|woff2?|gif|webp|jpg|jpeg|png|svg)$)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
