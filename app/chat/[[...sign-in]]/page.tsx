export const dynamic = 'force-dynamic';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ChatClient from '../../../components/ChatClient';

export default async function ChatPage() {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');

  const user = await currentUser();
  const plan = (user?.publicMetadata?.plan as string) || 'free';
  const active = plan === 'pro' || plan === 'team';
  if (!active) redirect('/pricing?reason=subscribe');

  return <ChatClient />;
}
