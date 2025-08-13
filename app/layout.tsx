// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import Nav from './components/Nav';

export const metadata: Metadata = {
  title: 'GERALD.io',
  description: 'AI-led dialogue coach for sales reps',
};

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className="min-h-screen text-white"
          style={{
            // theme vars
            '--main-color': '#011a01',
            '--accent-color': '#C0FF00',
            backgroundColor: 'var(--main-color)',
          } as React.CSSProperties}
        >
          {/* Single, global header */}
          <header className="sticky top-0 z-40 border-b border-[#1f2a1f] bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/30">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              {/* Left: brand */}
              <Link href="/" className="text-sm tracking-wide font-semibold">
                GERALD<span className="text-xs">.io</span>
              </Link>

              {/* Center: nav */}
              <div className="flex-1 flex justify-center">
                <Nav />
              </div>

              {/* Right: auth */}
              <div className="w-[40px] flex justify-end">
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                  <Link
                    href="/sign-in"
                    className="text-sm hover:text-[var(--accent-color)] transition"
                  >
                    Login
                  </Link>
                </SignedOut>
              </div>
            </div>
          </header>

          <main className="max-w-6xl mx-auto px-4">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
