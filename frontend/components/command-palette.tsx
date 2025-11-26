'use client';

import { useEffect, useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { useFinanceStore } from '../lib/store';
import { Dialog, DialogContent } from './ui/dialog';
import { CreditCard, PiggyBank, Notebook, PlusCircle, Target, History, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CommandPaletteProps {
  onOpenModal: (modal: ModalKey) => void;
}

export type ModalKey =
  | 'transaction'
  | 'income'
  | 'savings'
  | 'goal'
  | 'goalProgress'
  | 'diary'
  | 'envelopes'
  | 'history';

const actions: { key: ModalKey; label: string; icon: React.ComponentType<any> }[] = [
  { key: 'transaction', label: 'Add Transaction', icon: CreditCard },
  { key: 'income', label: 'Add Income', icon: Wallet },
  { key: 'savings', label: 'Add Savings Transfer', icon: PiggyBank },
  { key: 'goal', label: 'Add Goal', icon: Target },
  { key: 'goalProgress', label: 'Update Goal Progress', icon: PlusCircle },
  { key: 'diary', label: 'Add Diary Entry', icon: Notebook },
  { key: 'envelopes', label: 'Edit Budget Envelopes', icon: PiggyBank },
  { key: 'history', label: 'Open Transaction History', icon: History }
];

export function CommandPalette({ onOpenModal }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const loadSnapshot = useFinanceStore((s) => s.loadSnapshot);
  useEffect(() => {
    if (!open) return;
    loadSnapshot();
  }, [open, loadSnapshot]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 bg-slate-900 text-slate-50 border-slate-800">
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Quick actions">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <CommandItem
                    key={action.key}
                    onSelect={() => {
                      setOpen(false);
                      if (action.key === 'history') {
                        router.push('/history');
                        return;
                      }
                      onOpenModal(action.key);
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" /> {action.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
