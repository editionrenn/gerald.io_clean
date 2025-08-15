'use client';

import Link from 'next/link';
import { SignedIn, SignedOut } from '@clerk/nextjs';

export default function Nav() {
  const linkCls = 'px-2 transition-colors duration-200 hover:text-[#C0FF00]';

  return (
    <nav className="flex items-center gap-6 text-sm font-medium">
      <a href="/#features" className={linkCls}>Features</a>
      <a href="/#how" className={linkCls}>How It Works</a>
      <a href="/#pricing" className={linkCls}>Pricing</a>
      <a href="/#contact" className={linkCls}>Contact</a>
      <SignedIn><Link href="/chat" className={linkCls}>Chat</Link></SignedIn>
      <SignedOut><Link href="/sign-in" className={linkCls}>Chat</Link></SignedOut>
    </nav>
  );
}
