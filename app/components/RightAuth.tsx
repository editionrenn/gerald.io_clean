'use client';

import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

export default function RightAuth() {
  const { user } = useUser();

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
        <div className="relative inline-block">
          {isPro && (
            <span
              className="absolute -top-3 -right-6 z-20 rounded-full bg-[#C0FF00] px-2 py-[2px] text-[10px] font-bold text-black shadow-md"
            >
              PRO
            </span>
          )}
          <div className="z-10">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
