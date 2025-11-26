'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useFinanceStore } from '../../lib/store';

const schema = z.object({ name: z.string().min(1), targetAmount: z.coerce.number(), priority: z.enum(['high', 'medium', 'low']) });
type FormData = z.infer<typeof schema>;

interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddGoalModal({ open, onOpenChange }: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const addGoal = useFinanceStore((s) => s.addGoal);
  const form = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { priority: 'medium' } });

  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const onSubmit = async (values: FormData) => {
    await addGoal({ ...values, currentAmount: 0 });
    handleOpenChange(false);
    form.reset({ priority: 'medium' });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Goal</Button>
      </DialogTrigger>
      <DialogContent>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm">Name</label>
            <Input {...form.register('name')} />
          </div>
          <div>
            <label className="text-sm">Target Amount</label>
            <Input type="number" step="0.01" {...form.register('targetAmount', { valueAsNumber: true })} />
          </div>
          <div>
            <label className="text-sm">Priority</label>
            <select {...form.register('priority')} className="w-full rounded-md border border-slate-800 bg-slate-900 p-2 text-sm">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <Button type="submit" className="w-full">
            Create Goal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
