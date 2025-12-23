import { Router } from 'express';
import { PrismaClient, Transaction as TxModel } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

type SnapshotCategoryTotals = Record<string, number>;
type SnapshotTransaction = Omit<TxModel, 'date' | 'createdAt'> & { date: string };
type SnapshotGoal = { id: string; name: string; targetAmount: number; currentAmount: number; deadline: string; priority: string };
type SnapshotAccount = { id: string; name: string; type: string; balance: number; currency: string; color?: string | null; icon?: string | null };
type SnapshotPayload = {
  user: { id: string; email: string; name?: string | null };
  transactions: SnapshotTransaction[];
  goals: SnapshotGoal[];
  bursaries: { id: string; provider: string; monthlyAmount: number; nextPaymentDate: string; notes?: string | null }[];
  accounts: SnapshotAccount[];
  gamification: unknown;
  spendingTotals: { total: number; byCategory: SnapshotCategoryTotals };
  savingsTotal: number;
  categories: string[];
};

export default function dataRouter(prisma: PrismaClient) {
  const router = Router();

  // Login - find existing user by email
  router.post('/user/login', async (req, res) => {
    try {
      const { email, firebaseUid } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      let user = await prisma.user.findFirst({ where: { email } });
      
      if (!user) {
        // If user authenticated with Firebase but doesn't exist in DB, create them
        if (firebaseUid) {
          console.log(`Creating database user for Firebase account: ${email}`);
          user = await prisma.user.create({
            data: { 
              email, 
              firebaseUid,
              name: email.split('@')[0] // Use email prefix as default name
            }
          });
          
          // Initialize gamification for new user
          await prisma.gamification.create({
            data: {
              userId: user.id,
              level: 1,
              xp: 0,
              streak: 0,
              persona: 'friendly',
              dailyChallenge: 'Add your first transaction',
              badges: JSON.stringify([])
            }
          });
          
          console.log(`Successfully created database user: ${user.id}`);
        } else {
          return res.status(404).json({ error: 'Account not found. Please sign up first.' });
        }
      } else {
        // Update Firebase UID if not set
        if (firebaseUid && !user.firebaseUid) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { firebaseUid }
          });
        }
      }
      
      res.json({ user });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  });

  // Initialize or get user (signup)
  router.post('/user/init', async (req, res) => {
    try {
      const { email, name, firebaseUid } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      
      let user = await prisma.user.findFirst({ where: { email } });
      
      if (user) {
        console.log(`User already exists: ${email}`);
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }
      
      // Create user in database
      user = await prisma.user.create({
        data: { email, name, firebaseUid }
      });
      
      console.log(`Created new user: ${user.id} - ${email}`);
      
      // Initialize gamification
      await prisma.gamification.create({
        data: {
          userId: user.id,
          level: 1,
          xp: 0,
          streak: 0,
          persona: 'friendly',
          dailyChallenge: 'Add your first transaction',
          badges: JSON.stringify([])
        }
      });
      
      res.json({ userId: user.id, user });
    } catch (err) {
      console.error('User init error:', err);
      res.status(500).json({ error: 'Failed to initialize user' });
    }
  });

  router.get('/snapshot', authenticate, async (req: AuthRequest, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        include: { transactions: true, goals: true, bursaries: true, gamification: true, accounts: true }
      });

      if (!user) {
        return res.status(404).json({ error: 'User snapshot not found' });
      }

      const transactions: SnapshotTransaction[] = user.transactions.map((t) => ({
        id: t.id,
        userId: t.userId,
        accountId: t.accountId,
        amount: t.amount,
        category: t.category,
        description: t.description,
        date: t.date.toISOString()
      }));

      const spendingTotals: SnapshotCategoryTotals = {};
      transactions.forEach((t) => {
        if (t.category === 'income' || t.category === 'savings') return;
        spendingTotals[t.category] = (spendingTotals[t.category] ?? 0) + Math.abs(t.amount);
      });

      const savingsTotal = transactions
        .filter((t) => t.category === 'savings')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const priorityRank: Record<string, number> = { high: 3, medium: 2, low: 1 };
      const withPriorityFallback: SnapshotGoal[] = user.goals
        .map((g) => ({
          id: g.id,
          name: g.name,
          targetAmount: g.targetAmount,
          currentAmount: g.currentAmount,
          deadline: g.deadline.toISOString(),
          priority: g.priority ?? 'medium'
        }))
        .sort((a, b) => (priorityRank[b.priority] ?? 0) - (priorityRank[a.priority] ?? 0));

      const payload: SnapshotPayload = {
        user: { id: user.id, email: user.email, name: user.name },
        transactions,
        goals: withPriorityFallback,
        bursaries: user.bursaries.map((b) => ({
          id: b.id,
          provider: b.provider,
          monthlyAmount: b.monthlyAmount,
          nextPaymentDate: b.nextPaymentDate.toISOString(),
          notes: b.notes
        })),
        gamification: user.gamification ?? null,
        accounts: user.accounts || [],
        spendingTotals: { total: Object.values(spendingTotals).reduce((sum, val) => sum + val, 0), byCategory: spendingTotals },
        savingsTotal,
        categories: Object.keys(spendingTotals)
      };

      res.json(payload);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load snapshot' });
    }
  });

  // Transaction endpoints
  router.post('/transactions', authenticate, async (req: AuthRequest, res) => {
    try {
      const { amount, category, description, date, accountId } = req.body;
      const userId = req.userId!;

      const parsedAmount = parseFloat(amount);

      // Create transaction
      const transaction = await prisma.transaction.create({
        data: {
          userId,
          accountId: accountId || null,
          amount: parsedAmount,
          category,
          description,
          date: new Date(date)
        }
      });

      // Update account balance if account is linked
      if (accountId) {
        const account = await prisma.account.findFirst({ 
          where: { id: accountId, userId } // Verify account belongs to user
        });
        if (account) {
          // Income adds to balance, expenses subtract from balance
          const balanceChange = category === 'income' ? parsedAmount : -parsedAmount;
          await prisma.account.update({
            where: { id: accountId },
            data: { balance: account.balance + balanceChange }
          });
        }
      }

      res.json(transaction);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  });

  router.delete('/transactions/:id', authenticate, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      
      // Get transaction before deleting to reverse account balance
      const transaction = await prisma.transaction.findFirst({ 
        where: { id: req.params.id, userId }, // Verify transaction belongs to user
        include: { user: { include: { accounts: true } } }
      });

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      if (transaction.accountId) {
        const account = await prisma.account.findFirst({ 
          where: { id: transaction.accountId, userId } // Verify account belongs to user
        });
        if (account) {
          // Reverse the transaction: income is subtracted, expenses are added back
          const balanceChange = transaction.category === 'income' ? -transaction.amount : transaction.amount;
          await prisma.account.update({
            where: { id: transaction.accountId },
            data: { balance: account.balance + balanceChange }
          });
        }
      }

      await prisma.transaction.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete transaction' });
    }
  });

  // Goal endpoints
  router.post('/goals', authenticate, async (req: AuthRequest, res) => {
    try {
      const { name, targetAmount, currentAmount, deadline, priority } = req.body;
      const userId = req.userId!;

      const goal = await prisma.goal.create({
        data: {
          userId,
          name,
          targetAmount: parseFloat(targetAmount),
          currentAmount: parseFloat(currentAmount || 0),
          deadline: new Date(deadline),
          priority: priority || 'medium'
        }
      });

      res.json(goal);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create goal' });
    }
  });

  router.put('/goals/:id', authenticate, async (req: AuthRequest, res) => {
    try {
      const { currentAmount } = req.body;
      const userId = req.userId!;
      
      // Verify goal belongs to user
      const existingGoal = await prisma.goal.findFirst({
        where: { id: req.params.id, userId }
      });
      
      if (!existingGoal) {
        return res.status(404).json({ error: 'Goal not found' });
      }
      
      const goal = await prisma.goal.update({
        where: { id: req.params.id },
        data: { currentAmount: parseFloat(currentAmount) }
      });
      res.json(goal);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update goal' });
    }
  });

  router.delete('/goals/:id', authenticate, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      
      // Verify goal belongs to user
      const goal = await prisma.goal.findFirst({
        where: { id: req.params.id, userId }
      });
      
      if (!goal) {
        return res.status(404).json({ error: 'Goal not found' });
      }
      
      await prisma.goal.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete goal' });
    }
  });

  // Bursary endpoints
  router.post('/bursaries', authenticate, async (req: AuthRequest, res) => {
    try {
      const { provider, monthlyAmount, nextPaymentDate, notes } = req.body;
      const userId = req.userId!;

      const bursary = await prisma.bursary.create({
        data: {
          userId,
          provider,
          monthlyAmount: parseFloat(monthlyAmount),
          nextPaymentDate: new Date(nextPaymentDate),
          notes
        }
      });

      res.json(bursary);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create bursary' });
    }
  });

  router.delete('/bursaries/:id', authenticate, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      
      // Verify bursary belongs to user
      const bursary = await prisma.bursary.findFirst({
        where: { id: req.params.id, userId }
      });
      
      if (!bursary) {
        return res.status(404).json({ error: 'Bursary not found' });
      }
      
      await prisma.bursary.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete bursary' });
    }
  });

  // Account endpoints
  router.get('/accounts', authenticate, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;

      const accounts = await prisma.account.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      res.json(accounts);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch accounts' });
    }
  });

  router.post('/accounts', authenticate, async (req: AuthRequest, res) => {
    try {
      const { name, type, balance, currency, color, icon } = req.body;
      const userId = req.userId!;

      const account = await prisma.account.create({
        data: {
          userId,
          name,
          type,
          balance: parseFloat(balance || 0),
          currency: currency || 'ZAR',
          color,
          icon
        }
      });

      res.json(account);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create account' });
    }
  });

  router.put('/accounts/:id', authenticate, async (req: AuthRequest, res) => {
    try {
      const { balance } = req.body;
      const userId = req.userId!;
      
      // Verify account belongs to user
      const existingAccount = await prisma.account.findFirst({
        where: { id: req.params.id, userId }
      });
      
      if (!existingAccount) {
        return res.status(404).json({ error: 'Account not found' });
      }
      
      const account = await prisma.account.update({
        where: { id: req.params.id },
        data: { balance: parseFloat(balance) }
      });
      res.json(account);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update account' });
    }
  });

  router.delete('/accounts/:id', authenticate, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      
      // Verify account belongs to user
      const account = await prisma.account.findFirst({
        where: { id: req.params.id, userId }
      });
      
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }
      
      await prisma.account.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete account' });
    }
  });

  return router;
}
