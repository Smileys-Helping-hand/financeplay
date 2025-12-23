import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserIdFromRequest } from '@/lib/server-utils';

const prisma = new PrismaClient();

// Forward all /data/* requests  
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path?.join('/') || '';
  
  // Snapshot endpoint
  if (path === 'snapshot') {
    return handleSnapshot(request);
  }
  
  // Accounts endpoint
  if (path === 'accounts') {
    return handleGetAccounts(request);
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path?.join('/') || '';
  const body = await request.json();
  
  // Transactions endpoint
  if (path === 'transactions') {
    return handleCreateTransaction(request, body);
  }
  
  // Goals endpoint
  if (path === 'goals') {
    return handleCreateGoal(request, body);
  }
  
  // Bursaries endpoint
  if (path === 'bursaries') {
    return handleCreateBursary(request, body);
  }
  
  // Accounts endpoint
  if (path === 'accounts') {
    return handleCreateAccount(request, body);
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path || [];
  const body = await request.json();
  
  // Goals update endpoint
  if (path[0] === 'goals' && path[1]) {
    return handleUpdateGoal(request, path[1], body);
  }
  
  // Accounts update endpoint
  if (path[0] === 'accounts' && path[1]) {
    return handleUpdateAccount(request, path[1], body);
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path || [];
  
  // Transactions delete endpoint
  if (path[0] === 'transactions' && path[1]) {
    return handleDeleteTransaction(request, path[1]);
  }
  
  // Goals delete endpoint
  if (path[0] === 'goals' && path[1]) {
    return handleDeleteGoal(request, path[1]);
  }
  
  // Bursaries delete endpoint
  if (path[0] === 'bursaries' && path[1]) {
    return handleDeleteBursary(request, path[1]);
  }
  
  // Accounts delete endpoint
  if (path[0] === 'accounts' && path[1]) {
    return handleDeleteAccount(request, path[1]);
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

// Handler functions
async function handleSnapshot(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { transactions: true, goals: true, bursaries: true, gamification: true, accounts: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
      transactions,
      goals: user.goals.map((g) => ({
        id: g.id,
        name: g.name,
        targetAmount: g.targetAmount,
        currentAmount: g.currentAmount,
        deadline: g.deadline.toISOString(),
        priority: g.priority
      })),
      bursaries: user.bursaries.map((b) => ({
        id: b.id,
        provider: b.provider,
        monthlyAmount: b.monthlyAmount,
        nextPaymentDate: b.nextPaymentDate.toISOString(),
        notes: b.notes
      })),
      accounts: user.accounts,
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

async function handleGetAccounts(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const accounts = await prisma.account.findMany({ where: { userId } });
    return NextResponse.json({ accounts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

async function handleCreateTransaction(request: NextRequest, body: any) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { amount, category, description, date, accountId } = body;
    
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        accountId: accountId || null,
        amount: parseFloat(amount),
        category,
        description: description || '',
        date: new Date(date)
      }
    });

    if (accountId) {
      await prisma.account.update({
        where: { id: accountId },
        data: { balance: { increment: parseFloat(amount) } }
      });
    }

    return NextResponse.json({ transaction });
  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

async function handleDeleteTransaction(request: NextRequest, id: string) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction || transaction.userId !== userId) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (transaction.accountId) {
      await prisma.account.update({
        where: { id: transaction.accountId },
        data: { balance: { decrement: transaction.amount } }
      });
    }

    await prisma.transaction.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}

async function handleCreateGoal(request: NextRequest, body: any) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const goal = await prisma.goal.create({
      data: { ...body, userId, deadline: new Date(body.deadline) }
    });
    return NextResponse.json({ goal });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}

async function handleUpdateGoal(request: NextRequest, id: string, body: any) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const goal = await prisma.goal.findUnique({ where: { id } });
    if (!goal || goal.userId !== userId) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: body.deadline ? { ...body, deadline: new Date(body.deadline) } : body
    });
    return NextResponse.json({ goal: updatedGoal });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
  }
}

async function handleDeleteGoal(request: NextRequest, id: string) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const goal = await prisma.goal.findUnique({ where: { id } });
    if (!goal || goal.userId !== userId) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    await prisma.goal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 });
  }
}

async function handleCreateBursary(request: NextRequest, body: any) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const bursary = await prisma.bursary.create({
      data: { ...body, userId, nextPaymentDate: new Date(body.nextPaymentDate) }
    });
    return NextResponse.json({ bursary });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create bursary' }, { status: 500 });
  }
}

async function handleDeleteBursary(request: NextRequest, id: string) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const bursary = await prisma.bursary.findUnique({ where: { id } });
    if (!bursary || bursary.userId !== userId) {
      return NextResponse.json({ error: 'Bursary not found' }, { status: 404 });
    }

    await prisma.bursary.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete bursary' }, { status: 500 });
  }
}

async function handleCreateAccount(request: NextRequest, body: any) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const account = await prisma.account.create({
      data: { ...body, userId }
    });
    return NextResponse.json({ account });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}

async function handleUpdateAccount(request: NextRequest, id: string, body: any) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const account = await prisma.account.findUnique({ where: { id } });
    if (!account || account.userId !== userId) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const updatedAccount = await prisma.account.update({
      where: { id },
      data: body
    });
    return NextResponse.json({ account: updatedAccount });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
  }
}

async function handleDeleteAccount(request: NextRequest, id: string) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const account = await prisma.account.findUnique({ where: { id } });
    if (!account || account.userId !== userId) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    await prisma.account.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
