import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Providers from './providers';
import Nav from './components/Nav';

export const metadata: Metadata = {
  title: 'GERALD.io',
  description: 'Guided Education for Reps using AI-Led Dialogue',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          // theme vars
          // @ts-expect-error CSS vars
          '--main-color': '#011a01',
          '--accent-color': '#C0FF00',
          backgroundColor: 'var(--main-color)',
          color: 'white',
        } as React.CSSProperties}
        className="min-h-screen"
      >
        <Providers>
          {/* HEADER: left logo, center menu, right account */}
          <header className="border-b border-gray-800">
            <div className="mx-auto max-w-6xl grid grid-cols-3 items-center px-6 py-4">
              {/* Left: logo */}
              <div className="justify-self-start">
                <Link href="/" className="text-2xl font-bold tracking-wide">
                  GERALD<span className="text-sm">.io</span>
                </Link>
              </div>

              {/* Center: main nav */}
              <div className="justify-self-center">
                <Nav />
              </div>

              {/* Right: auth controls */}
              <div className="justify-self-end flex items-center gap-3">
                <SignedOut>
                  <Link
                    href="/sign-in"
                    className="text-sm font-medium transition-colors hover:text-[#C0FF00]"
                  >
                    Login
                  </Link>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </div>
          </header>

          <main className="min-h-[70vh]">{children}</main>

          <footer className="text-center text-sm text-gray-500 py-6 border-t border-gray-800">
            © {new Date().getFullYear()} GERALD.io. All rights reserved.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
