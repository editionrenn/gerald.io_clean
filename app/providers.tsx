// app/layout.tsx
'use client';
import { ClerkProvider } from '@clerk/nextjs';
import Nav from './components/Nav';

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <header className="p-6 border-b border-gray-800">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
              <a href="/" className="text-2xl font-bold">GERALD<span className="text-sm">.io</span></a>
              <Nav />
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
