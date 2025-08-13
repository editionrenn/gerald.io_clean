// middleware.ts (Clerk v4)
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/', '/pricing', '/sign-in(.*)'],
  // Don't auth-protect Stripe webhooks:
  ignoredRoutes: ['/api/stripe/webhook'],
});

export const config = {
  matcher: [
    // exclude _next and all files with an extension
    '/((?!_next|.*\\..*).*)',
    // include API routes
    '/api/(.*)',
  ],
};
