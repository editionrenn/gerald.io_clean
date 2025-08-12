import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // 1) Auth
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2) Plan gate (admin bypass supported via publicMetadata.admin = true)
    const user = await clerkClient.users.getUser(userId);
    const plan = (user.publicMetadata?.plan as string) || 'free';
    const isAdmin = Boolean(user.publicMetadata?.admin);
    const active = isAdmin || plan === 'pro' || plan === 'team';

    if (!active) {
      return NextResponse.json(
        { reply: 'Please subscribe to chat. Visit /pricing to activate your plan.' },
        { status: 402 }
      );
    }

    // 3) Input
    const body = await req.json().catch(() => ({}));
    const message = typeof body?.message === 'string' ? body.message : '';
    if (!message) {
      return NextResponse.json({ reply: 'No message provided.' }, { status: 400 });
    }

    // 4) Env
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('[CHAT] Missing OPENAI_API_KEY');
      return NextResponse.json({ reply: 'Server is missing OPENAI_API_KEY.' }, { status: 500 });
    }

    // 5) Call OpenAI
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              process.env.GERALD_SYSTEM_PROMPT ??
              'You are Gerald, an upbeat AI sales coach for automotive reps. Be concise and tactical.',
          },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      console.error('[CHAT] OpenAI error:', resp.status, text);
      return NextResponse.json(
        { reply: `Upstream error: ${resp.status} ${text.slice(0, 200)}` },
        { status: 500 }
      );
    }

    const data = await resp.json();
    const reply =
      data?.choices?.[0]?.message?.content ?? 'I had trouble forming a reply. Try again?';

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[CHAT] Internal error:', err);
    return NextResponse.json({ reply: 'Internal error while processing chat.' }, { status: 500 });
  }
}
