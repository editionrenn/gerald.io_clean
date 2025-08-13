'use client';

import Link from 'next/link';
import { SignedIn, SignedOut } from '@clerk/nextjs';

export default function Nav() {
  const item =
    'whitespace-nowrap px-2 transition-colors duration-200 hover:text-[#C0FF00]';

  return (
    <nav aria-label="Primary" className="flex items-center">
      <ul className="flex items-center gap-6">
        <li><a href="/#features" className={item}>Features</a></li>
        <li><a href="/#how" className={item}>How It Works</a></li>
        <li><a href="/#pricing" className={item}>Pricing</a></li>
        <li><a href="/#contact" className={item}>Contact</a></li>

        {/* Chat routes: logged-in -> /chat, logged-out -> /sign-in */}
        <SignedIn>
          <li><Link href="/chat" className={item}>Chat</Link></li>
        </SignedIn>
        <SignedOut>
          <li><Link href="/sign-in" className={item}>Chat</Link></li>
        </SignedOut>
      </ul>
    </nav>
  );
}
