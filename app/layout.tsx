import type { Metadata } from 'next';
import "./globals.css";
import Providers from './providers';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'GERALD.io',
  description: 'Guided Education for Reps using AI-Led Dialogue',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <header className="p-6 border-b border-gray-800 flex items-center">
            {/* Left: Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold tracking-wide">
                <a href="/">GERALD<span className="text-sm align-super">.io</span></a>
              </h1>
            </div>

            {/* Center: Nav (client-side, handles auth state) */}
            <div className="flex-grow flex justify-center">
              <Nav />
            </div>

            {/* Right: empty (Nav shows UserButton internally) */}
            <div className="flex-shrink-0" />
          </header>

          {children}

          <footer className="text-center text-sm text-gray-500 py-6 border-t border-gray-800">
            © {new Date().getFullYear()} GERALD.io
          </footer>
        </Providers>
      </body>
    </html>
  );
}
