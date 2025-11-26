'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useFinanceStore } from '../../lib/store';

const schema = z.object({ goalId: z.string().min(1), currentAmount: z.coerce.number() });
type FormData = z.infer<typeof schema>;

interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function UpdateGoalProgressModal({ open, onOpenChange }: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const updateGoalProgress = useFinanceStore((s) => s.updateGoalProgress);
  const goals = useFinanceStore((s) => s.goals);
  const form = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { goalId: '', currentAmount: 0 } });

  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const onSubmit = async (values: FormData) => {
    await updateGoalProgress(values.goalId, values.currentAmount);
    handleOpenChange(false);
    form.reset({ goalId: '', currentAmount: 0 });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">Update Goal Progress</Button>
      </DialogTrigger>
      <DialogContent>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm">Goal</label>
            <select {...form.register('goalId')} className="w-full rounded-md border border-slate-800 bg-slate-900 p-2 text-sm">
              <option value="">Select a goal</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm">Current Amount</label>
            <Input type="number" step="0.01" {...form.register('currentAmount', { valueAsNumber: true })} />
          </div>
          <Button type="submit" className="w-full">
            Update Progress
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
