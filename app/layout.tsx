// app/layout.tsx
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import Nav from './components/Nav';

export const metadata: Metadata = {
  title: 'GERALD.io',
  description: 'Guided Education for Reps using AI-Led Dialogue',
};

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          style={{
            // theme vars
            ['--main-color' as any]: '#011a01',
            ['--accent-color' as any]: '#C0FF00',
            backgroundColor: 'var(--main-color)',
            color: 'white',
            fontFamily: 'Poppins, sans-serif',
            backgroundImage: 'radial-gradient(rgba(192,255,0,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <header className="p-6 border-b border-gray-800">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <a href="/" className="text-2xl font-bold tracking-wide">
                GERALD<span className="text-sm">.io</span>
              </a>
              <div className="flex-1" />
              <div className="flex-1 flex justify-center">
                <Nav />
              </div>
              <div className="flex-1" />
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="text-center text-sm text-gray-500 py-6 border-t border-gray-800">
            © {new Date().getFullYear()} GERALD.io. All rights reserved.
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
