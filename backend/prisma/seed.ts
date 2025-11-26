import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'pilot@financeplay.africa' },
    update: {},
    create: { email: 'pilot@financeplay.africa', name: 'FinancePlay Pilot' }
  });

  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.income.deleteMany({ where: { userId: user.id } });
  await prisma.savingsTransfer.deleteMany({ where: { userId: user.id } });
  await prisma.goal.deleteMany({ where: { userId: user.id } });
  await prisma.diaryEntry.deleteMany({ where: { userId: user.id } });
  await prisma.budgetCategory.deleteMany({ where: { userId: user.id } });
  await prisma.bursary.deleteMany({ where: { userId: user.id } });
  await prisma.gamification.deleteMany({ where: { userId: user.id } });

  await prisma.income.createMany({
    data: [
      { userId: user.id, source: 'NSFAS Allowance', amount: 1800, note: 'Monthly living allowance' },
      { userId: user.id, source: 'Tutoring', amount: 650, note: 'Side hustle' }
    ]
  });

  await prisma.savingsTransfer.createMany({
    data: [
      { userId: user.id, amount: 400, from: 'Cheque', to: 'Emergency Fund' },
      { userId: user.id, amount: 250, from: 'Cheque', to: 'Travel Fund' }
    ]
  });

  const today = new Date();
  await prisma.transaction.createMany({
    data: [
      { userId: user.id, amount: 120, category: 'food', type: 'expense', note: 'Groceries', date: today },
      { userId: user.id, amount: 45, category: 'transport', type: 'expense', note: 'Bus rides', date: today },
      { userId: user.id, amount: 300, category: 'rent', type: 'expense', note: 'Student housing', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2) },
      { userId: user.id, amount: 200, category: 'education', type: 'expense', note: 'Books', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4) },
      { userId: user.id, amount: 1800, category: 'income', type: 'income', note: 'NSFAS disbursement', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6) },
      { userId: user.id, amount: 100, category: 'savings', type: 'savings', note: 'Emergency top-up', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1) }
    ]
  });

  await prisma.goal.createMany({
    data: [
      { userId: user.id, name: 'Emergency Fund', targetAmount: 5000, currentAmount: 2400, priority: 'high' },
      { userId: user.id, name: 'New Laptop', targetAmount: 1500, currentAmount: 850, priority: 'medium' },
      { userId: user.id, name: 'Cape Town Trip', targetAmount: 2000, currentAmount: 300, priority: 'low' }
    ]
  });

  await prisma.diaryEntry.createMany({
    data: [
      { userId: user.id, title: 'Win!', body: 'Stuck to my budget for three days.', emotion: 'motivated' },
      { userId: user.id, title: 'Note', body: 'Need to cut down on takeaways.', emotion: 'focused' }
    ]
  });

  await prisma.budgetCategory.createMany({
    data: [
      { userId: user.id, name: 'Food', limit: 1200, icon: 'utensils' },
      { userId: user.id, name: 'Transport', limit: 600, icon: 'bus' },
      { userId: user.id, name: 'Rent', limit: 2500, icon: 'home' }
    ]
  });

  await prisma.bursary.createMany({
    data: [
      { userId: user.id, provider: 'NSFAS', monthlyAmount: 1500, nextPaymentDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10) },
      { userId: user.id, provider: 'STEM Excellence', monthlyAmount: 1000, nextPaymentDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 20) }
    ]
  });

  await prisma.gamification.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      level: 6,
      xp: 3120,
      streak: 12,
      persona: 'friendly',
      dailyChallenge: 'Spend R50 less on takeaways this week',
      badges: ['Budget Ninja', 'Savings Sprinter', 'Streak Keeper', 'Budget Master', 'Savings Hero']
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
