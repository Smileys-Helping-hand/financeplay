'use client';

import * as CommandPrimitive from 'cmdk';
import { cn } from '../../lib/utils';

export const Command = ({ className, ...props }: CommandPrimitive.CommandProps) => (
  <CommandPrimitive.Command className={cn('flex h-full w-full flex-col overflow-hidden rounded-lg bg-slate-900 text-slate-100', className)} {...props} />
);

export const CommandInput = ({ className, ...props }: CommandPrimitive.CommandInputProps) => (
  <CommandPrimitive.CommandInput className={cn('w-full border-b border-slate-800 bg-slate-900 px-4 py-3 outline-none', className)} {...props} />
);

export const CommandList = CommandPrimitive.CommandList;
export const CommandEmpty = CommandPrimitive.CommandEmpty;
export const CommandGroup = CommandPrimitive.CommandGroup;
export const CommandItem = ({ className, ...props }: CommandPrimitive.CommandItemProps) => (
  <CommandPrimitive.CommandItem className={cn('flex cursor-pointer items-center px-4 py-2 text-sm hover:bg-slate-800', className)} {...props} />
);
