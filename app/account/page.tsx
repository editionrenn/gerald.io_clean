import { currentUser } from '@clerk/nextjs/server';

export default async function AccountPage() {
  const user = await currentUser();

  const displayName =
    (user?.firstName || user?.lastName)
      ? [user?.firstName, user?.lastName].filter(Boolean).join(' ')
      : user?.username ?? '—';

  const email = user?.emailAddresses?.[0]?.emailAddress ?? '—';

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold mb-6 text-center">Account</h2>
      <div className="grid gap-6">
        <div className="p-5 rounded-2xl border" style={{ borderColor: '#2b352b', backgroundColor: '#0c130c' }}>
          <div className="text-sm text-gray-300">Name</div>
          <div className="text-lg font-semibold">{displayName}</div>
        </div>
        <div className="p-5 rounded-2xl border" style={{ borderColor: '#2b352b', backgroundColor: '#0c130c' }}>
          <div className="text-sm text-gray-300">Email</div>
          <div className="text-lg font-semibold">{email}</div>
        </div>
        <div className="flex gap-3">
          <a
            href="/"
            className="rounded-xl px-4 py-2 font-semibold"
            style={{ backgroundColor: 'var(--accent-color)', color: 'black' }}
          >
            Back home
          </a>
        </div>
      </div>
    </div>
  );
}
