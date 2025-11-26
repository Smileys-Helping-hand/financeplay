'use client';

import { useState } from 'react';
import { useFinanceStore } from '../../lib/store';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditBudgetEnvelopesSheet({ open, onOpenChange }: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const categories = useFinanceStore((s) => s.budgetCategories);

  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Budget Envelopes</Button>
      </DialogTrigger>
      <DialogContent className="space-y-3">
        <h3 className="text-lg font-semibold">Budget Envelopes</h3>
        {categories.length === 0 && <p className="text-sm text-slate-400">No envelopes yet.</p>}
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-2">
            <Input defaultValue={cat.name} className="flex-1" readOnly />
            <Input defaultValue={cat.limit ?? ''} className="w-32" readOnly />
          </div>
        ))}
        <p className="text-xs text-slate-500">Full editing will sync with the backend envelopes API.</p>
      </DialogContent>
    </Dialog>
  );
}
