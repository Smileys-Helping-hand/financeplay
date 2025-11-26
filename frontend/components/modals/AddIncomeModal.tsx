'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useFinanceStore } from '../../lib/store';

const schema = z.object({ source: z.string().min(1), amount: z.coerce.number(), note: z.string().optional() });
type FormData = z.infer<typeof schema>;

interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddIncomeModal({ open, onOpenChange }: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const addIncome = useFinanceStore((s) => s.addIncome);
  const form = useForm<FormData>({ resolver: zodResolver(schema) });

  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const onSubmit = async (values: FormData) => {
    await addIncome({ ...values, date: new Date().toISOString() });
    handleOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Income</Button>
      </DialogTrigger>
      <DialogContent>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm">Source</label>
            <Input {...form.register('source')} />
          </div>
          <div>
            <label className="text-sm">Amount</label>
            <Input type="number" step="0.01" {...form.register('amount', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="text-sm">Note</label>
            <Input {...form.register('note')} />
          </div>
          <Button type="submit" className="w-full">
            Save Income
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
