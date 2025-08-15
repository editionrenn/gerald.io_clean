'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

export default function RightAuth() {
  const { user } = useUser();

  // your plan flag – adjust to your metadata if needed
  const isPro =
    user?.publicMetadata?.plan === 'pro' ||
    user?.privateMetadata?.plan === 'pro';

  return (
    <div className="flex items-center">
      <SignedOut>
        <Link
          href="/sign-in"
          className="rounded-xl px-3 py-1 font-semibold"
          style={{ backgroundColor: 'var(--accent-color)', color: 'black' }}
        >
          Login
        </Link>
      </SignedOut>

      <SignedIn>
        <div className="relative">
          {isPro && (
            <span
              className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-extrabold tracking-widest"
              style={{ color: '#C0FF00' }}
              aria-label="PRO subscriber"
              title="PRO subscriber"
            >
              PRO
            </span>
          )}
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </div>
  );
}
