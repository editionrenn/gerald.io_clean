'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

export default function RightAuth() {
  const { user } = useUser();
  const isPro = (user?.publicMetadata as any)?.plan === 'pro';

  return (
    <div className="flex items-center">
      <SignedOut>
        <Link
          href="/sign-in"
          className="px-3 py-1.5 rounded-lg text-sm font-semibold hover:text-[#C0FF00] transition-colors"
        >
          Login
        </Link>
      </SignedOut>

      <SignedIn>
        {/* Group wrapper lets us animate both avatar and badge together */}
        <div className="relative inline-flex items-center group">
          {/* Avatar with hover scale */}
          <div className="transition-transform duration-200 ease-out will-change-transform group-hover:scale-110">
            <UserButton />
          </div>

          {/* PRO pill – stays to the top-right and animates on hover too */}
          {isPro && (
            <span
              className="
                pointer-events-none select-none
                absolute -top-3 -right-4
                rounded-full bg-[#C0FF00] px-2 py-[2px]
                text-[10px] font-extrabold leading-none text-black
                shadow-md ring-1 ring-black/10
                transition-transform duration-200 ease-out will-change-transform
                group-hover:scale-110 group-hover:-translate-y-1 group-hover:translate-x-1
              "
            >
              PRO
            </span>
          )}
        </div>
      </SignedIn>
    </div>
  );
}
