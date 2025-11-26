'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Minimize2, Send, Sparkles } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import axios from 'axios';
import { useFinanceStore } from '../../lib/store';
import { Insight } from '../../lib/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

interface CoachMessage {
  role: 'assistant' | 'user';
  content: string;
}

const starterMessages: CoachMessage[] = [
  { role: 'assistant', content: 'Hi! I am your FinancePlay AI coach. Ask me for a spending challenge or goal strategy.' }
];

export function AiCoachPanel() {
  const [open, setOpen] = useState(true);
  const insights = useFinanceStore((s) => s.insights);
  const persona = useFinanceStore((s) => s.gamification.persona);
  const setPersona = useFinanceStore((s) => s.setPersona);
  const [messages, setMessages] = useState<CoachMessage[]>(starterMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const challengeOptions = useMemo(
    () => [
      'Spend R50 less on takeaways this week',
      '3 no-Uber days',
      'Save all cash-back into your emergency fund'
    ],
    []
  );

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage: CoachMessage = { role: 'user', content: input };
    setMessages((m) => [...m, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const history = [...messages.slice(-4), userMessage];
      const { data } = await axios.post('/api/ai/coach', {
        prompt: userMessage.content,
        persona,
        history
      });
      setMessages((m) => [...m, { role: 'assistant', content: data.reply || 'Here to help!' }]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', content: 'I could not reach the AI service, showing fallback tips.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.section
        className="fixed bottom-4 right-4 z-40 w-full max-w-sm"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
      >
        <div className="card shadow-2xl border border-slate-800/70">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm font-semibold">AI Coach</div>
                <p className="text-xs text-slate-400">Smart nudges + challenges</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setOpen((o) => !o)}>
              {open ? <Minimize2 className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
            </Button>
          </header>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-3 mt-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  Persona:
                  {(['friendly', 'strict', 'humorous'] as const).map((p) => (
                    <Button key={p} size="xs" variant={persona === p ? 'secondary' : 'ghost'} onClick={() => setPersona(p)}>
                      {p}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {insights.map((insight: Insight) => (
                    <Badge key={insight.title} label={insight.title} className="bg-primary/10 text-primary" />
                  ))}
                </div>
                <div className="space-y-2 text-xs">
                  <p className="text-slate-400">AI Challenge Suggestions</p>
                  <div className="flex flex-wrap gap-2">
                    {challengeOptions.map((challenge) => (
                      <Button key={challenge} variant="outline" size="xs" onClick={() => setInput(challenge)}>
                        {challenge}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={
                        message.role === 'assistant'
                          ? 'bg-slate-900/70 rounded-2xl px-3 py-2 text-sm text-slate-50'
                          : 'text-right text-sm text-slate-200'
                      }
                    >
                      {message.content}
                    </div>
                  ))}
                  {loading && <div className="text-xs text-slate-400">Thinking...</div>}
                </div>
                <form onSubmit={sendMessage} className="flex gap-2">
                  <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask for a savings challenge" />
                  <Button type="submit" disabled={loading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
