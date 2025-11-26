'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useFinanceStore } from '../../lib/store';

const schema = z.object({ title: z.string().optional(), body: z.string().min(1), emotion: z.string().optional() });
type FormData = z.infer<typeof schema>;

interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddDiaryEntryModal({ open, onOpenChange }: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const addDiaryEntry = useFinanceStore((s) => s.addDiaryEntry);
  const form = useForm<FormData>({ resolver: zodResolver(schema) });

  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const onSubmit = async (values: FormData) => {
    await addDiaryEntry({ ...values, date: new Date().toISOString() });
    handleOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Diary Entry</Button>
      </DialogTrigger>
      <DialogContent>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm">Title</label>
            <Input {...form.register('title')} />
          </div>
          <div>
            <label className="text-sm">Body</label>
            <textarea
              {...form.register('body')}
              className="w-full rounded-md border border-slate-800 bg-slate-900 p-2 text-sm"
              rows={4}
            />
          </div>
          <div>
            <label className="text-sm">Emotion</label>
            <Input {...form.register('emotion')} />
          </div>
          <Button type="submit" className="w-full">
            Save Entry
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
