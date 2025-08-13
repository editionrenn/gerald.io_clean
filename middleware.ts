import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  publicRoutes: ['/', '/pricing', '/sign-in(.*)'],
});

export const config = {
  matcher: [
    // run on everything except static assets and Next internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp)$).*)',
  ],
};
