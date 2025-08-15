'use client';

import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

export default function RightAuth() {
  const { user } = useUser();

  // Read plan from public metadata; fall back to unsafeMetadata (client-safe)
  const plan =
    (user?.publicMetadata as any)?.plan ??
    (user?.unsafeMetadata as any)?.plan;

  const isPro = plan === 'pro';

  return (
  <div className="relative flex items-center">
    <SignedOut>
      <a
        href="/sign-in"
        className="rounded-md px-3 py-1 text-sm font-semibold"
        style={{ background: '#0e1d0e', border: '1px solid #203320' }}
      >
        Login
      </a>
    </SignedOut>

    <SignedIn>
      {/* Avatar wrapper is relative; no overflow */}
      <div className="relative inline-block">
        {/* PRO badge sits above the avatar with higher z-index */}
        {isPro && (
          <span
            className="absolute -top-2 -right-2 z-20 rounded-full px-1.5 py-[2px] text-[10px] font-extrabold tracking-widest"
            style={{ color: '#C0FF00', background: 'transparent' }}
            aria-label="Pro subscriber"
          >
            PRO
          </span>
        )}
        {/* Keep avatar below the badge */}
        <div className="z-10">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </SignedIn>
  </div>
);
