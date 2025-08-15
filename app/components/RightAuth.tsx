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
    <div className="relative flex items-center gap-3">
      {/* PRO badge sits just to the left/top of the avatar */}
      {isPro && (
        <span
          className="absolute -top-2 -right-2 text-[10px] font-extrabold tracking-widest"
          style={{ color: '#C0FF00' }}
          aria-label="Pro subscriber"
        >
          PRO
        </span>
      )}

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
        <div className="relative">
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </div>
  );
}
