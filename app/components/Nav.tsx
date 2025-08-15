'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

export default function Nav() {
  const { user } = useUser();
  const isPro = (user?.publicMetadata as any)?.plan === 'pro';

  const linkCls = 'px-2 transition-colors duration-200 hover:text-[#C0FF00]';

  return (
    <nav className="flex items-center gap-6 text-sm font-medium">
      <a href="/#features" className={linkCls}>Features</a>
      <a href="/#how" className={linkCls}>How It Works</a>
      <a href="/#pricing" className={linkCls}>Pricing</a>
      <a href="/#contact" className={linkCls}>Contact</a>

      <SignedIn>
        <Link href="/chat" className={linkCls}>Chat</Link>
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in" className={linkCls}>Chat</Link>
      </SignedOut>

      {/* Avatar + PRO badge */}
      <SignedIn>
        <div className="relative flex items-center">
          <UserButton afterSignOutUrl="/" />
          {isPro && (
            <sup
              className="
                absolute -right-3 -top-2
                text-[9px] font-extrabold tracking-widest
                px-1.5 py-[1px] rounded
              "
              style={{ color: '#C0FF00' }} // accent green
              aria-label="PRO"
              title="PRO"
            >
              PRO
            </sup>
          )}
        </div>
      </SignedIn>

      <SignedOut>
        <Link href="/sign-in" className={linkCls}>Login</Link>
      </SignedOut>
    </nav>
  );
}
