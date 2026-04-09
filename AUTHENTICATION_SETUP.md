# DrGlance Authentication Setup Guide

## Overview
This guide explains how to set up and use the Clerk authentication system for DrGlance.

## Prerequisites
- Clerk account (https://clerk.com)
- Node.js and npm installed

## Setup Steps

### 1. Get Your Clerk API Keys
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your **Publishable Key** and **Secret Key**

### 2. Set Environment Variables
Create or update the `.env.local` file in your project root with:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here

# Clerk URLs (optional)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 3. Install Dependencies
Clerk dependencies are already installed. If needed, run:
```bash
npm install @clerk/nextjs
```

### 4. Update Your Middleware (Already Done)
The middleware is configured at `middleware.ts` to protect dashboard routes.

## File Structure

### Authentication Pages
- `/app/login/page.tsx` - Login page with Clerk SignIn component
- `/app/signup/page.tsx` - Signup page with Clerk SignUp component

### Dashboard Pages (Protected)
- `/app/dashboard/page.tsx` - Main dashboard with user info
- `/app/dashboard/scans/page.tsx` - Health scans page
- `/app/dashboard/results/page.tsx` - Results page
- `/app/dashboard/profile/page.tsx` - User profile page
- `/app/dashboard/settings/page.tsx` - Settings page

### Configuration
- `/app/layout.tsx` - ClerkProvider wrapper
- `middleware.ts` - Route protection middleware
- `.env.local` - Environment variables (add your keys here)

## Features Implemented

### 1. User Registration (Signup)
- Email/password signup
- Social authentication ready
- Customized styling matching DrGlance theme
- Automatic redirect to dashboard after signup

### 2. User Login
- Email/password login
- Social authentication ready
- Session management
- Automatic redirect to dashboard after login

### 3. Protected Dashboard
- Authenticated users can access `/dashboard`
- Unauthenticated users redirected to `/login`
- User profile information display
- Sign out functionality
- Quick links to health features

### 4. Route Protection
- Middleware protects `/dashboard/*` routes
- Automatic redirection to login for unauthenticated users
- Session validation on each request

### 5. User Data Display
Shows:
- User's full name
- Email address
- Member since date
- User ID

## Customization

### Styling
Edit the `appearance` object in `SignIn` and `SignUp` components to customize colors:

```tsx
appearance={{
  elements: {
    formButtonPrimary: "bg-linear-to-r from-blue-600 to-teal-600 text-white...",
    // Add more customizations
  },
}}
```

### Redirects
Change redirect URLs in `.env.local`:
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` - Where users go after login
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` - Where users go after signup

## Testing

### Test the Auth Flow:
1. Start the dev server: `npm run dev`
2. Visit `http://localhost:3000`
3. Click "Get Started" → Go to signup page
4. Create a test account
5. Should redirect to `/dashboard`
6. Click "Sign Out" to logout

### Test Protected Routes:
1. Visit `http://localhost:3000/dashboard` without logging in
2. Should redirect to login page

## Common Issues & Solutions

### Issue: "API Keys not found"
**Solution:** Make sure you've added your Clerk keys to `.env.local` and restarted the dev server.

### Issue: "ClerkProvider not found"
**Solution:** Ensure the layout.tsx has `ClerkProvider` wrapper around children.

### Issue: Redirect loops
**Solution:** Check middleware.ts and make sure routes are configured correctly.

### Issue: Social auth not working
**Solution:** Enable social providers in Clerk Dashboard → Credentials → Social Connections

## Next Steps

1. Add your Clerk API keys to `.env.local`
2. Test the authentication flow
3. Customize login/signup pages as needed
4. Build out dashboard features (scans, results, etc.)
5. Add email verification (available in Clerk)
6. Set up custom user metadata for health profiles

## Useful Resources
- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Customization Guide](https://clerk.com/docs/customize/overview)
