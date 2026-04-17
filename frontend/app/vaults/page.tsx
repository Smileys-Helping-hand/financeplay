'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import { Lock, Users, CheckCircle2, Plus } from 'lucide-react';
import { DreamVault, VaultMilestone } from '../../lib/types';
import { cn } from '../../lib/utils';

// ── Milestone helpers ─────────────────────────────────────────────────────

const MILESTONES: { key: VaultMilestone; label: string; badge: string }[] = [
  { key: '25',  label: '25%',  badge: '🥉 Quarter Way' },
  { key: '50',  label: '50%',  badge: '🥈 Halfway'     },
  { key: '75',  label: '75%',  badge: '🥇 Almost There' },
  { key: '100', label: '100%', badge: '🏆 COMPLETE!'   },
];

function milestonesUnlocked(vault: DreamVault): VaultMilestone[] {
  const pct = vault.targetAmount > 0 ? (vault.currentAmount / vault.targetAmount) * 100 : 0;
  return MILESTONES.filter((m) => pct >= Number(m.key)).map((m) => m.key);
}

// ── Circular progress ring ────────────────────────────────────────────────

function ProgressRing({ pct, size = 80, stroke = 7 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (Math.min(pct, 100) / 100) * circumference;
  const color = pct >= 100 ? '#FFD700' : pct >= 75 ? '#00FF6A' : pct >= 50 ? '#00D4FF' : '#6F7CFF';

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#27272A" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease', filter: `drop-shadow(0 0 6px ${color})` }}
      />
      <text
        x="50%" y="50%"
        textAnchor="middle" dominantBaseline="middle"
        className="rotate-90 origin-center"
        fill="white" fontSize={size * 0.18} fontWeight="bold"
        style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%' }}
      >
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

// ── Vault card ────────────────────────────────────────────────────────────

interface VaultCardProps {
  vault: DreamVault;
  onFund: (vault: DreamVault) => void;
}

function VaultCard({ vault, onFund }: VaultCardProps) {
  const pct = vault.targetAmount > 0 ? (vault.currentAmount / vault.targetAmount) * 100 : 0;
  const unlocked = milestonesUnlocked(vault);
  const nextMilestone = MILESTONES.find((m) => !unlocked.includes(m.key));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'card relative flex flex-col gap-4',
        pct >= 100 ? 'card-glow-gold' : 'card-glow-blue'
      )}
    >
      {/* Vault header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{vault.emoji}</span>
          <div>
            <h3 className="font-black text-white text-lg leading-tight">{vault.title}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              {vault.locked && (
                <span className="flex items-center gap-1 text-[10px] text-neon-amber font-bold uppercase">
                  <Lock className="h-3 w-3" /> Locked
                </span>
              )}
              {vault.isMultiplayer && (
                <span className="flex items-center gap-1 text-[10px] text-neon-blue font-bold uppercase">
                  <Users className="h-3 w-3" /> Squad Quest
                </span>
              )}
            </div>
          </div>
        </div>
        <ProgressRing pct={pct} />
      </div>

      {/* Amounts */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-zinc-500">Funded</p>
          <p className="text-xl font-black text-neon-green">
            R{vault.currentAmount.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500">Target</p>
          <p className="text-xl font-black text-zinc-300">
            R{vault.targetAmount.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Milestone badges */}
      <div className="flex flex-wrap gap-1.5">
        {MILESTONES.map((m) => (
          <span
            key={m.key}
            className={cn(
              'text-xs px-2 py-0.5 rounded-full border font-semibold transition-all',
              unlocked.includes(m.key)
                ? 'bg-neon-gold/10 border-neon-gold/50 text-neon-gold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-600'
            )}
          >
            {m.badge}
          </span>
        ))}
      </div>

      {/* Next milestone hint */}
      {nextMilestone && (
        <p className="text-xs text-zinc-500">
          Next milestone: <span className="text-neon-blue font-semibold">{nextMilestone.label}</span>
          {' '}(R{((Number(nextMilestone.key) / 100) * vault.targetAmount - vault.currentAmount).toLocaleString('en-ZA', { maximumFractionDigits: 0 })} to go)
        </p>
      )}

      {/* Fund button */}
      {!vault.locked && pct < 100 && (
        <button
          onClick={() => onFund(vault)}
          className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-neon-blue/10 border border-neon-blue/30 text-neon-blue font-bold py-2.5 text-sm hover:bg-neon-blue/20 transition-colors active:scale-95"
        >
          <Plus className="h-4 w-4" /> Fund Vault
        </button>
      )}

      {pct >= 100 && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-neon-gold/10 border border-neon-gold/30 text-neon-gold font-bold py-2.5 text-sm">
          <CheckCircle2 className="h-4 w-4" /> Quest Complete!
        </div>
      )}
    </motion.div>
  );
}

// ── Fund Modal ────────────────────────────────────────────────────────────

interface FundModalProps {
  vault: DreamVault;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

function FundModal({ vault, onClose, onConfirm }: FundModalProps) {
  const [input, setInput] = useState('');
  const amount = parseFloat(input) || 0;
  const remaining = vault.targetAmount - vault.currentAmount;
  const maxFund = Math.min(remaining, 100_000);

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="relative z-10 w-full max-w-sm card m-4 space-y-4"
      >
        <h2 className="text-lg font-black text-white">Fund &quot;{vault.title}&quot;</h2>
        <p className="text-xs text-zinc-500">
          R{vault.currentAmount.toLocaleString('en-ZA', { maximumFractionDigits: 0 })} funded of R{vault.targetAmount.toLocaleString('en-ZA', { maximumFractionDigits: 0 })} — R{remaining.toLocaleString('en-ZA', { maximumFractionDigits: 0 })} remaining
        </p>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">R</span>
          <input
            type="number"
            min="1"
            max={maxFund}
            value={input}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '' || (parseFloat(v) <= maxFund && parseFloat(v) >= 0)) setInput(v);
            }}
            placeholder="0"
            aria-label="Amount to fund"
            className="w-full rounded-xl bg-zinc-900 border border-zinc-700 text-white text-2xl font-black pl-8 pr-4 py-3 outline-none focus:border-neon-blue transition-colors"
            autoFocus
          />
        </div>
        {amount > maxFund && (
          <p className="text-xs text-neon-red">Max you can fund: R{maxFund.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}</p>
        )}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-zinc-700 text-zinc-400 py-2.5 font-bold hover:border-zinc-500 transition-colors">
            Cancel
          </button>
          <button
            disabled={amount <= 0 || amount > maxFund}
            onClick={() => onConfirm(amount)}
            className="flex-1 rounded-xl bg-neon-green/90 text-zinc-950 py-2.5 font-black hover:bg-neon-green transition-colors disabled:opacity-40"
          >
            +Fund
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Vaults Page ──────────────────────────────────────────────────────

const DEMO_VAULTS: DreamVault[] = [
  {
    id: 'v1', userId: 'demo', title: 'Bali 2026', emoji: '🌴',
    targetAmount: 15000, currentAmount: 6000,
    isMultiplayer: false, locked: false, milestonesBadges: [],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'v2', userId: 'demo', title: 'Emergency Fund', emoji: '🛡️',
    targetAmount: 5000, currentAmount: 4800,
    isMultiplayer: false, locked: true, milestonesBadges: [],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'v3', userId: 'demo', title: 'New Laptop', emoji: '💻',
    targetAmount: 8000, currentAmount: 2000,
    isMultiplayer: true, locked: false, milestonesBadges: [],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

export default function VaultsPage() {
  const [vaults, setVaults] = useState<DreamVault[]>(DEMO_VAULTS);
  const [fundTarget, setFundTarget] = useState<DreamVault | null>(null);
  const [celebrateMilestone, setCelebrateMilestone] = useState<string | null>(null);
  const [isFunding, setIsFunding] = useState(false);

  const handleFund = useCallback((vault: DreamVault) => setFundTarget(vault), []);

  const handleConfirmFund = useCallback(
    async (amount: number) => {
      if (!fundTarget) return;
      setIsFunding(true);
      try {
        // Optimistic update first
        setVaults((prev) =>
          prev.map((v) => {
            if (v.id !== fundTarget.id) return v;
            const updated: DreamVault = {
              ...v,
              currentAmount: Math.min(v.currentAmount + amount, v.targetAmount),
              updatedAt: new Date().toISOString(),
            };
            const prevUnlocked = milestonesUnlocked(v);
            const newUnlocked  = milestonesUnlocked(updated);
            const fresh = newUnlocked.filter((m) => !prevUnlocked.includes(m));
            if (fresh.length > 0) {
              const badge = MILESTONES.find((m) => m.key === fresh[fresh.length - 1])!.badge;
              setCelebrateMilestone(badge);
              setTimeout(() => setCelebrateMilestone(null), 4500);
            }
            return updated;
          })
        );
        setFundTarget(null);

        // Persist to API
        const res = await fetch('/api/data/vaults', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: fundTarget.id, amount }),
        });
        if (!res.ok) throw new Error('API error');
        const serverVault = await res.json();
        // Reconcile with authoritative server state
        setVaults((prev) =>
          prev.map((v) =>
            v.id === fundTarget.id
              ? { ...v, currentAmount: serverVault.currentAmount, milestonesBadges: serverVault.milestonesBadges, updatedAt: serverVault.updatedAt }
              : v
          )
        );
      } catch {
        // Revert optimistic update on failure
        setVaults((prev) =>
          prev.map((v) =>
            v.id === fundTarget.id
              ? { ...v, currentAmount: v.currentAmount - amount }
              : v
          )
        );
      } finally {
        setIsFunding(false);
      }
    },
    [fundTarget]
  );

  return (
    <>
      {/* Confetti — z-index above modal (z-[60]) */}
      {celebrateMilestone && (
        <ReactConfetti
          numberOfPieces={350}
          recycle={false}
          colors={['#FFD700', '#00FF6A', '#00D4FF', '#FF3B5C', '#6F7CFF']}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}
        />
      )}

      <div className="space-y-6 pb-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Dream <span className="text-neon-gold">Vaults</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Your savings quests. Fund them. Complete them. Win.</p>
        </div>

        {/* Milestone toast */}
        <AnimatePresence>
          {celebrateMilestone && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card card-glow-gold text-center py-5"
              role="status"
              aria-live="polite"
            >
              <p className="text-3xl mb-2">{celebrateMilestone.split(' ')[0]}</p>
              <p className="text-xl font-black text-neon-gold">Milestone Unlocked!</p>
              <p className="text-sm text-zinc-300 mt-1">{celebrateMilestone}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vault cards or empty state */}
        {vaults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4">🏦</span>
            <p className="text-lg font-black text-zinc-400">No Vaults Yet</p>
            <p className="text-sm text-zinc-600 mt-1 max-w-xs">Create your first Dream Vault to start saving towards a goal. Each vault is a quest waiting to be completed.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {vaults.map((vault) => (
              <VaultCard key={vault.id} vault={vault} onFund={handleFund} />
            ))}
          </div>
        )}

        {/* New vault CTA */}
        <button
          aria-label="Create a new Dream Vault"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-700 text-zinc-500 hover:border-neon-blue hover:text-neon-blue py-5 text-sm font-bold transition-colors"
        >
          <Plus className="h-4 w-4" /> Create New Vault
        </button>
      </div>

      {/* Fund modal */}
      <AnimatePresence>
        {fundTarget && (
          <FundModal
            vault={fundTarget}
            onClose={() => setFundTarget(null)}
            onConfirm={handleConfirmFund}
          />
        )}
      </AnimatePresence>
    </>
  );
}
