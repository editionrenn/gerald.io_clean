'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function Nav() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-1 items-center">
      <nav className="mx-auto flex items-center gap-6 text-sm font-medium">
        <a href="/#features" className="transition-colors hover:text-[#C0FF00]">Features</a>
        <a href="/#how" className="transition-colors hover:text-[#C0FF00]">How It Works</a>
        <a href="/#pricing" className="transition-colors hover:text-[#C0FF00]">Pricing</a>
        <a href="/#contact" className="transition-colors hover:text-[#C0FF00]">Contact</a>

        {mounted ? (
          <>
            <SignedIn>
              <Link href="/chat" className="transition-colors hover:text-[#C0FF00]">Chat</Link>
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" className="transition-colors hover:text-[#C0FF00]">Chat</Link>
            </SignedOut>
          </>
        ) : (
          <Link href="/sign-in" className="transition-colors hover:text-[#C0FF00]">Chat</Link>
        )}
      </nav>

      <div className="flex items-center gap-4">
        {mounted ? (
          <>
            <SignedOut>
              <Link href="/sign-in" className="transition-colors hover:text-[#C0FF00]">Login</Link>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </>
        ) : (
          <Link href="/sign-in" className="transition-colors hover:text-[#C0FF00]">Login</Link>
        )}
      </div>
    </div>
  );
}
