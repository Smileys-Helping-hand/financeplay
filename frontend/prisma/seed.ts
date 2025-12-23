import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'pilot@financeplay.africa' },
    update: {},
    create: { email: 'pilot@financeplay.africa', name: 'FinancePlay Pilot' }
  });

  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.goal.deleteMany({ where: { userId: user.id } });
  await prisma.bursary.deleteMany({ where: { userId: user.id } });
  await prisma.gamification.deleteMany({ where: { userId: user.id } });

  const txSeed = Array.from({ length: 18 }).map((_, idx) => ({
    userId: user.id,
    amount: Math.floor(Math.random() * 180) + 20,
    category: idx % 6 === 0 ? 'rent' : idx % 5 === 0 ? 'education' : 'food',
    description: idx % 6 === 0 ? 'Student housing' : 'Daily spend',
    date: new Date(`2024-03-${String((idx % 27) + 1).padStart(2, '0')}`)
  }));
  await prisma.transaction.createMany({ data: txSeed });

  await prisma.goal.createMany({
    data: [
      { userId: user.id, name: 'Emergency Fund', targetAmount: 5000, currentAmount: 2400, deadline: new Date('2024-12-31'), priority: 'high' },
      { userId: user.id, name: 'New Laptop', targetAmount: 1500, currentAmount: 800, deadline: new Date('2024-08-15'), priority: 'medium' },
      { userId: user.id, name: 'Cape Town Trip', targetAmount: 2000, currentAmount: 300, deadline: new Date('2025-01-05'), priority: 'low' }
    ]
  });

  await prisma.bursary.createMany({
    data: [
      { userId: user.id, provider: 'NSFAS', monthlyAmount: 1500, nextPaymentDate: new Date('2024-03-15'), notes: 'Accommodation and food' },
      { userId: user.id, provider: 'STEM Excellence Scholarship', monthlyAmount: 1000, nextPaymentDate: new Date('2024-03-28'), notes: 'Book allowance upcoming' }
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
      badges: JSON.stringify(['Budget Ninja', 'Savings Sprinter', 'Streak Keeper', 'Budget Master', 'Savings Hero'])
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
