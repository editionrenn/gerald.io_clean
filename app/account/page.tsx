import { currentUser } from '@clerk/nextjs/server';
import AccountClient from './AccountClient';

export const dynamic = 'force-dynamic'; // avoids prerender issues with auth

export default async function AccountPage() {
  // Optional: keep this check so logged-out visitors don’t hit this page
  const user = await currentUser();
  if (!user) {
    // If you prefer, you can redirect to /sign-in here
    return (
      <div className="max-w-lg mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
        <a
          href="/sign-in"
          className="inline-block rounded-xl px-4 py-2 font-semibold"
          style={{ backgroundColor: 'var(--accent-color)', color: 'black' }}
        >
          Go to Sign In
        </a>
      </div>
    );
  }

  return <AccountClient />;
}
