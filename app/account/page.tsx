import { auth, currentUser } from '@clerk/nextjs';
import Link from 'next/link';

export default async function AccountPage(){
  const { userId } = auth();
  if(!userId){
    return <div className="min-h-[60vh] flex items-center justify-center p-8">Please <Link href="/sign-in" className="underline">sign in</Link> to view your account.</div>;
  }
  const user = await currentUser();
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold mb-6 text-center">Account</h2>
      <div className="grid gap-6">
        <div className="p-5 rounded-2xl border" style={{ borderColor: '#2b352b', backgroundColor: '#0c130c' }}>
          <div className="text-sm text-gray-300">Name</div>
          <div className="text-lg font-semibold">{user?.fullName || user?.username || '—'}</div>
        </div>
        <div className="p-5 rounded-2xl border" style={{ borderColor: '#2b352b', backgroundColor: '#0c130c' }}>
          <div className="text-sm text-gray-300">Email</div>
          <div className="text-lg font-semibold">{user?.primaryEmailAddress?.emailAddress || '—'}</div>
        </div>
        <div className="flex gap-3">
          <Link href="/user" className="rounded-xl px-4 py-2 font-semibold border" style={{ borderColor: '#2b352b' }}>Manage profile</Link>
          <Link href="/user/billing" className="rounded-xl px-4 py-2 font-semibold" style={{ backgroundColor: 'var(--accent-color)', color: '#000' }}>Manage billing</Link>
        </div>
      </div>
    </main>
  );
}
