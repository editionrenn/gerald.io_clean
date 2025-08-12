import './globals.css';
import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'GERALD.io',
  description: 'Guided Education for Reps using AI-Led Dialogue',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="p-6 border-b border-gray-800 flex items-center">
          {/* Left: logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold tracking-wide">
              GERALD<span className="text-sm align-super">.io</span>
            </Link>
          </div>

          {/* Center: menu */}
          <Nav />

          {/* Right: account */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <SignedOut>
              <Link href="/sign-in" className="transition-colors hover:text-[#C0FF00]">Login</Link>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </header>

        {children}

        <footer className="text-center text-sm text-gray-500 py-6 border-t border-gray-800">
          © {new Date().getFullYear()} GERALD.io
        </footer>
      </body>
    </html>
  );
}
