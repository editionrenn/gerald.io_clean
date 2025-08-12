'use client';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Nav(){
  return (
    <nav className="space-x-6 text-sm font-medium">
      <a href="/#features" className="transition-colors duration-200">Features</a>
      <a href="/#how" className="transition-colors duration-200">How It Works</a>
      <a href="/#pricing" className="transition-colors duration-200">Pricing</a>
      <a href="/#contact" className="transition-colors duration-200">Contact</a>

      {/* Chat: send logged-out users to sign-in */}
      <SignedIn>
        <Link href="/chat" className="transition-colors duration-200">Chat</Link>
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in" className="transition-colors duration-200">Chat</Link>
      </SignedOut>

      <SignedOut>
        <Link href="/sign-in" className="transition-colors duration-200">Login</Link>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </nav>
  );
}
