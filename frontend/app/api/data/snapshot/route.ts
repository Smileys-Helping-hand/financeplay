import { NextRequest, NextResponse } from 'next/server';
import { prisma, getUserIdFromRequest, requireAuth } from '@/lib/server-utils';

export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const userId = getUserIdFromRequest(request)!;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { transactions: true, goals: true, bursaries: true, gamification: true, accounts: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User snapshot not found' }, { status: 404 });
    }

    const transactions = user.transactions.map((t) => ({
      id: t.id,
      userId: t.userId,
      accountId: t.accountId,
      amount: t.amount,
      category: t.category,
      description: t.description,
      date: t.date.toISOString()
    }));

    const spendingTotals: Record<string, number> = {};
    transactions.forEach((t) => {
      if (t.amount < 0) {
        const category = t.category || 'other';
        spendingTotals[category] = (spendingTotals[category] || 0) + Math.abs(t.amount);
      }
    });

    const savingsTotal = transactions
      .filter((t) => t.category === 'savings' && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const categories = Array.from(new Set(transactions.map((t) => t.category || 'other')));

    const goals = user.goals.map((g) => ({
      id: g.id,
      name: g.name,
      targetAmount: g.targetAmount,
      currentAmount: g.currentAmount,
      deadline: g.deadline.toISOString(),
      priority: g.priority
    }));

    const bursaries = user.bursaries.map((b) => ({
      id: b.id,
      provider: b.provider,
      monthlyAmount: b.monthlyAmount,
      nextPaymentDate: b.nextPaymentDate.toISOString(),
      notes: b.notes
    }));

    const accounts = user.accounts.map((a) => ({
      id: a.id,
      name: a.name,
      type: a.type,
      balance: a.balance,
      currency: a.currency,
      color: a.color,
      icon: a.icon
    }));

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
      transactions,
      goals,
      bursaries,
      accounts,
      gamification: user.gamification,
      spendingTotals: { total: Object.values(spendingTotals).reduce((a, b) => a + b, 0), byCategory: spendingTotals },
      savingsTotal,
      categories
    });
  } catch (error) {
    console.error('Snapshot error:', error);
    return NextResponse.json({ error: 'Failed to fetch snapshot' }, { status: 500 });
  }
}
