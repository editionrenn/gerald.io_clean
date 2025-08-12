'use client';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="flex-1 flex justify-center">
      <div className="flex items-center gap-6 text-sm font-medium">
        <a href="/#features" className="transition-colors hover:text-[#C0FF00]">Features</a>
        <a href="/#how" className="transition-colors hover:text-[#C0FF00]">How It Works</a>
        <a href="/#pricing" className="transition-colors hover:text-[#C0FF00]">Pricing</a>
        <a href="/#contact" className="transition-colors hover:text-[#C0FF00]">Contact</a>

        <SignedIn>
          <Link href="/chat" className="transition-colors hover:text-[#C0FF00]">Chat</Link>
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in" className="transition-colors hover:text-[#C0FF00]">Chat</Link>
        </SignedOut>
      </div>
    </nav>
  );
}
