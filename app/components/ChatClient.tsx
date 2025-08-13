'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';

type Msg = { id: string; role: 'user' | 'assistant'; content: string; ts: number };

function fmt(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const STORAGE_KEY = (uid: string | null) => `gerald:chat:${uid ?? 'guest'}`;

export default function ChatClient() {
  const { user } = useUser();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [toast, setToast] = useState<{ text: string; show: boolean }>({ text: '', show: false });
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const key = STORAGE_KEY(user?.id ?? null);
    const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    if (raw) {
      setMessages(JSON.parse(raw));
    } else {
      setMessages([
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            "Hey, I'm Gerald — your AI sales coach. Ask me about objection handling, scripts, or training plans.",
          ts: Date.now(),
        },
      ]);
    }
  }, [user?.id]);

  useEffect(() => {
    const key = STORAGE_KEY(user?.id ?? null);
    if (messages.length) localStorage.setItem(key, JSON.stringify(messages));
  }, [messages, user?.id]);

  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(() => setToast((s) => ({ ...s, show: false })), 1200);
    return () => clearTimeout(t);
  }, [toast.show]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function callBackend(text: string) {
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });
    const j = await r.json().catch(() => ({} as any));
    return (j?.reply as string) ?? 'Hmm, I had trouble replying. Try again?';
  }

  function typeIntoLastAssistantMessage(fullText: string) {
    const id = crypto.randomUUID();
    const start: Msg = { id, role: 'assistant', content: '', ts: Date.now() };
    setMessages((m) => [...m, start]);

    const speed = 18;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setMessages((m) =>
        m.map((msg) => (msg.id === id ? { ...msg, content: fullText.slice(0, i) } : msg)),
      );
      if (i >= fullText.length) clearInterval(interval);
    }, speed);
  }

  const onSend = async () => {
    const t = input.trim();
    if (!t || sending) return;
    setSending(true);

    const userMsg: Msg = { id: crypto.randomUUID(), role: 'user', content: t, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    try {
      const reply = await callBackend(t);
      typeIntoLastAssistantMessage(reply);
    } finally {
      setSending(false);
    }
  };

  const copyMsg = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ text: 'Copied!', show: true });
    } catch {
      setToast({ text: 'Copy failed', show: true });
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 min-h-[70vh]">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Chat with Gerald</h2>

      <div className="rounded-2xl border" style={{ borderColor: '#1f2a1f', backgroundColor: '#0c130c' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: '#1f2a1f' }}>
          <div className="text-sm tracking-wide text-white font-semibold">
            GERALD <span className="text-xs">.io</span>
          </div>
          <div className="text-xs" style={{ color: '#9aa59a' }}>AI-Led Dialogue Coach</div>
        </div>

        <div ref={listRef} className="h-[60vh] overflow-y-auto p-4 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {isUser ? (
                    <div className="w-8 h-8 rounded-full border border-[#2b352b] bg-black grid place-items-center text-xs text-white/80">U</div>
                  ) : (
                    <Image src="/gerald-avatar.png" alt="Gerald" width={32} height={32} className="rounded-full" />
                  )}

                  <div className="flex flex-col items-start gap-1">
                    <div
                      className={
                        'rounded-2xl px-3 py-2 text-sm leading-relaxed border whitespace-pre-wrap ' +
                        (isUser
                          ? 'bg-black text-white border-[#2b352b]'
                          : 'bg-[#0e1d0e] text-white border-[#203320]')
                      }
                    >
                      {m.content}
                    </div>

                    <div className={`flex items-center gap-2 ${isUser ? 'self-end' : 'self-start'}`}>
                      <span className="text-[10px]" style={{ color: '#9aa59a' }}>{fmt(m.ts)}</span>
                      <button
                        onClick={() => copyMsg(m.content)}
                        className="text-[10px] underline decoration-dotted hover:text-[var(--accent-color)]"
                        title="Copy message"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {sending && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                <Image src="/gerald-avatar.png" alt="Gerald" width={32} height={32} className="rounded-full" />
                <div className="rounded-2xl px-3 py-2 text-sm leading-relaxed border bg-[#0e1d0e] text-white border-[#203320]">
                  Gerald is typing…
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t" style={{ borderColor: '#1f2a1f' }}>
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              rows={1}
              placeholder="Ask Gerald anything…"
              className="flex-1 resize-none rounded-xl px-3 py-2 text-sm text-white border bg-black"
              style={{ borderColor: '#2b352b' }}
            />
            <button
              onClick={onSend}
              disabled={sending}
              className="rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent-color)', color: 'black' }}
            >
              Send
            </button>
          </div>
          <div className="mt-1 text-[10px]" style={{ color: '#9aa59a' }}>
            Shift+Enter for new line • Avoid sharing sensitive data
          </div>
        </div>
      </div>

      {/* Centered toast */}
      <div
        className={[
          'fixed left-1/2 top-16 -translate-x-1/2 z-[70] rounded-xl px-4 py-2 text-sm font-medium',
          'border',
          toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
          'transition-all duration-300',
        ].join(' ')}
        style={{
          backgroundColor: 'rgba(0,0,0,0.85)',
          borderColor: '#2b352b',
          color: 'white',
          pointerEvents: 'none',
        }}
        aria-live="polite"
      >
        {toast.text}
      </div>
    </main>
  );
}
