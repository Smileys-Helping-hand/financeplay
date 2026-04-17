'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinanceStore, XP_AWARDS } from '../../lib/store';
import { nanoid } from 'nanoid';
import { CheckCircle2, Delete } from 'lucide-react';

// ── Category tiles ────────────────────────────────────────────────────────

const CATEGORIES = [
  { emoji: '🍔', label: 'Food',      key: 'food'          },
  { emoji: '🚕', label: 'Transport', key: 'transport'     },
  { emoji: '🍻', label: 'Social',    key: 'fun'           },
  { emoji: '☕', label: 'Coffee',    key: 'coffee'        },
  { emoji: '🛍️', label: 'Shopping',  key: 'shopping'      },
  { emoji: '🎮', label: 'Gaming',    key: 'entertainment' },
  { emoji: '📱', label: 'Phone',     key: 'phone'         },
  { emoji: '💡', label: 'Utilities', key: 'utilities'     },
  { emoji: '📚', label: 'Education', key: 'education'     },
  { emoji: '🏠', label: 'Rent',      key: 'rent'          },
  { emoji: '🏥', label: 'Health',    key: 'other'         },
  { emoji: '🎯', label: 'Other',     key: 'other'         },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]['key'];

// ── Numpad ────────────────────────────────────────────────────────────────

const KEYS = ['7','8','9','4','5','6','1','2','3','0','.',undefined] as const;

function Numpad({ onKey, onDelete }: { onKey: (k: string) => void; onDelete: () => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {KEYS.map((k, i) =>
        k === undefined ? (
          <button
            key={`del-${i}`}
            onClick={onDelete}
            className="flex items-center justify-center h-14 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 active:scale-95 transition-all"
          >
            <Delete className="h-5 w-5" />
          </button>
        ) : (
          <button
            key={k}
            onClick={() => onKey(k)}
            className="flex items-center justify-center h-14 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-2xl font-bold hover:bg-zinc-800 active:scale-95 transition-all"
          >
            {k}
          </button>
        )
      )}
    </div>
  );
}

// ── Main Log Loot page ────────────────────────────────────────────────────

export default function LogPage() {
  const [amount, setAmount] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [done, setDone] = useState(false);

  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const registerXpGain = useFinanceStore((s) => s.registerXpGain);

  const handleKey = useCallback((k: string) => {
    setAmount((prev) => {
      if (k === '.' && prev.includes('.')) return prev;
      if (prev === '0' && k !== '.') return k;
      const next = prev + k;
      // Cap at 6 digits before decimal
      const [int] = next.split('.');
      if (int.length > 6) return prev;
      return next;
    });
  }, []);

  const handleDelete = useCallback(() => {
    setAmount((prev) => {
      const next = prev.slice(0, -1);
      return next === '' || next === '-' ? '0' : next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const num = parseFloat(amount);
    if (!num || num <= 0 || !selectedCategory) return;
    const cat = CATEGORIES.find((c) => c.key === selectedCategory)!;
    addTransaction({
      id: nanoid(),
      userId: '',
      date: new Date().toISOString().slice(0, 10),
      amount: num,
      category: cat.key,
      description: `${cat.emoji} ${cat.label}`,
    });
    registerXpGain(XP_AWARDS.LOG_EXPENSE); // +50 XP for logging
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setAmount('0');
      setSelectedCategory(null);
    }, 1500);
  }, [amount, selectedCategory, addTransaction, registerXpGain]);

  const numericAmount = parseFloat(amount) || 0;
  const canSubmit = numericAmount > 0 && selectedCategory !== null;

  return (
    <div className="flex flex-col gap-5 max-w-sm mx-auto pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Log <span className="text-neon-green">Loot</span></h1>
        <p className="text-xs text-zinc-500 mt-0.5">2 taps. That&apos;s all it takes.</p>
      </div>

      {/* Amount display */}
      <div className="card text-center py-6">
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Amount</p>
        <motion.p
          key={amount}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          className="text-5xl font-black text-white tracking-tight"
        >
          R{amount === '0' ? '0' : parseFloat(amount).toLocaleString('en-ZA', { minimumFractionDigits: amount.includes('.') ? 2 : 0, maximumFractionDigits: 2 })}
        </motion.p>
        {selectedCategory && (
          <p className="text-sm text-neon-blue font-semibold mt-2">
            {CATEGORIES.find((c) => c.key === selectedCategory)?.emoji}{' '}
            {CATEGORIES.find((c) => c.key === selectedCategory)?.label}
          </p>
        )}
      </div>

      {/* Category grid */}
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Category</p>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.key;
            return (
              <button
                key={`${cat.key}-${cat.emoji}`}
                onClick={() => setSelectedCategory(cat.key as CategoryKey)}
                className={`flex flex-col items-center gap-1 rounded-xl border py-3 transition-all active:scale-95 ${
                  active
                    ? 'border-neon-green bg-neon-green/10 shadow-[0_0_12px_rgba(0,255,106,0.25)]'
                    : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                }`}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className={`text-[10px] font-semibold ${active ? 'text-neon-green' : 'text-zinc-400'}`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Numpad */}
      <Numpad onKey={handleKey} onDelete={handleDelete} />

      {/* Submit button */}
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 rounded-xl bg-neon-green/10 border border-neon-green/30 text-neon-green font-black py-4 text-lg"
          >
            <CheckCircle2 className="h-5 w-5" />
            Loot Logged! +{XP_AWARDS.LOG_EXPENSE} XP
          </motion.div>
        ) : (
          <motion.button
            key="submit"
            onClick={handleSubmit}
            disabled={!canSubmit}
            whileTap={{ scale: 0.97 }}
            className={`rounded-xl py-4 text-lg font-black transition-all ${
              canSubmit
                ? 'bg-neon-green text-zinc-950 shadow-[0_0_20px_rgba(0,255,106,0.4)] hover:shadow-[0_0_30px_rgba(0,255,106,0.6)]'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
          >
            Log It
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
