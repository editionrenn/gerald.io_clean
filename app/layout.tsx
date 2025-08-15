// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';

import Nav from '@/app/components/Nav';
import RightAuth from '@/app/components/RightAuth';

export const metadata: Metadata = {
  title: 'GERALD.io',
  description: 'AI-powered sales coach for reps',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Inline CSS vars with a type-safe cast so TS doesn’t complain
  const bodyStyle = {
    ['--main-color' as any]: '#011a01',
    ['--accent-color' as any]: '#C0FF00',
    backgroundColor: 'var(--main-color)',
  } as React.CSSProperties;

  return (
    <ClerkProvider>
      <html lang="en">
        <body style={bodyStyle} className="text-white antialiased">
          {/* Header */}
          <header className="sticky top-0 z-50 border-b" style={{ borderColor: '#1c2b1c' }}>
            <div className="mx-auto max-w-6xl px-4">
              <div className="flex h-16 items-center justify-between">
                {/* Left: Logo + BETA */}
                <div className="flex-shrink-0 leading-none">
                  <a href="/" className="font-bold tracking-wide block">
                    GERALD<span className="opacity-70">.io</span>
                  </a>
                  <span
                    className="mt-0.5 inline-block text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded"
                    style={{ backgroundColor: '#C0FF00', color: 'black' }}
                  >
                    BETA
                  </span>
                </div>

                {/* Center: Nav */}
                <div className="flex-1 flex justify-center">
                  <Nav />
                </div>

                {/* Right: Avatar + PRO badge */}
                <RightAuth />
              </div>
            </div>
          </header>

          {/* Main content */}
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
