'use client';

import { useState } from 'react';
import { CommandPalette, ModalKey } from './command-palette';
import { AddTransactionModal } from './modals/AddTransactionModal';
import { AddIncomeModal } from './modals/AddIncomeModal';
import { AddSavingsModal } from './modals/AddSavingsModal';
import { AddGoalModal } from './modals/AddGoalModal';
import { UpdateGoalProgressModal } from './modals/UpdateGoalProgressModal';
import { AddDiaryEntryModal } from './modals/AddDiaryEntryModal';
import { EditBudgetEnvelopesSheet } from './modals/EditBudgetEnvelopesSheet';

export function GlobalActions() {
  const [activeModal, setActiveModal] = useState<ModalKey | null>(null);

  const modalProps = (key: ModalKey) => ({
    open: activeModal === key,
    onOpenChange: (open: boolean) => setActiveModal(open ? key : null)
  });

  return (
    <>
      <div className="fixed top-4 right-6 z-40 flex items-center gap-2">
        <CommandPalette onOpenModal={setActiveModal} />
      </div>
      <AddTransactionModal {...modalProps('transaction')} />
      <AddIncomeModal {...modalProps('income')} />
      <AddSavingsModal {...modalProps('savings')} />
      <AddGoalModal {...modalProps('goal')} />
      <UpdateGoalProgressModal {...modalProps('goalProgress')} />
      <AddDiaryEntryModal {...modalProps('diary')} />
      <EditBudgetEnvelopesSheet {...modalProps('envelopes')} />
    </>
  );
}
