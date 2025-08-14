'use client';
import { UserProfile } from '@clerk/nextjs';

export default function AccountClient() {
  // Clerk’s UI handles verification/re-auth for sensitive changes
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-6">Account</h1>
      <UserProfile routing="hash" />
    </div>
  );
}
