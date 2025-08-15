'use client';

import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

export default function RightAuth() {
  const { user } = useUser();

  // Treat either publicMetadata.plan or unsafeMetadata.plan === 'pro' as paid
  const isPro =
    (user?.publicMetadata as any)?.plan === 'pro' ||
    (user?.unsafeMetadata as any)?.plan === 'pro';

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
        {/* Avatar wrapper */}
        <div className="relative inline-block">
          {/* PRO badge */}
          {isPro && (
            <span
              className="absolute -top-2 -right-2 z-20 rounded-full px-1.5 py-[2px] text-[10px] font-extrabold tracking-widest"
              style={{ color: '#C0FF00' }}
              aria-label="Pro subscriber"
            >
              PRO
            </span>
          )}
          {/* Avatar (below the badge) */}
          <div className="z-10">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
