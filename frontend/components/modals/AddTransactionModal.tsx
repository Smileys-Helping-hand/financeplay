'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useFinanceStore } from '../../lib/store';

const schema = z.object({
  amount: z.coerce.number(),
  category: z.string().min(1),
  type: z.enum(['expense', 'income', 'savings']),
  note: z.string().optional()
});

type FormData = z.infer<typeof schema>;

interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddTransactionModal({ open, onOpenChange }: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const form = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { type: 'expense', category: 'food', amount: 0 } });

  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const onSubmit = async (values: FormData) => {
    await addTransaction({ ...values, date: new Date().toISOString() });
    handleOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default">New Transaction</Button>
      </DialogTrigger>
      <DialogContent>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm">Amount</label>
            <Input type="number" step="0.01" {...form.register('amount', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="text-sm">Category</label>
            <Input {...form.register('category')} />
          </div>
          <div>
            <label className="text-sm">Type</label>
            <select {...form.register('type')} className="w-full rounded-md border border-slate-800 bg-slate-900 p-2 text-sm">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="savings">Savings</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Note</label>
            <Input {...form.register('note')} />
          </div>
          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
