import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { PrismaClient, Transaction as TxModel } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { parseCSV, parsePDF, parseXLSX } from '../utils/statement-parser';
import { learnAndCategorize, categorizeByKeywords } from '../utils/keyword-categorizer';
import { categorizeWithAI } from '../utils/ai-categorizer';

type SnapshotCategoryTotals = Record<string, number>;
type SnapshotTransaction = Omit<TxModel, 'date' | 'createdAt'> & { date: string };
type SnapshotGoal = { id: string; name: string; targetAmount: number; currentAmount: number; deadline: string; priority: string };
type SnapshotAccount = { id: string; name: string; type: string; balance: number; currency: string; color?: string | null; icon?: string | null };
type SnapshotLoan = {
  id: string; name: string; loanType: string; totalAmount: number; remainingBalance: number;
  interestRate: number; monthlyPayment: number; startDate: string; endDate?: string | null;
  purpose?: string | null; lender?: string | null; isIslamic: boolean; notes?: string | null;
  payments: { id: string; amount: number; date: string; notes?: string | null }[];
};
type SnapshotPayload = {
  user: { id: string; email: string; name?: string | null };
  transactions: SnapshotTransaction[];
  goals: SnapshotGoal[];
  bursaries: { id: string; provider: string; monthlyAmount: number; nextPaymentDate: string; notes?: string | null }[];
  accounts: SnapshotAccount[];
  loans: SnapshotLoan[];
  gamification: unknown;
  spendingTotals: { total: number; byCategory: SnapshotCategoryTotals };
  savingsTotal: number;
  categories: string[];
};

export default function dataRouter(prisma: PrismaClient) {
  const router = Router();

  // File upload middleware
  const upload = multer();

  // Import bank statement (CSV, PDF, XLSX)
  router.post('/import-statement', authenticate, upload.single('statement'), async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const file = req.file;
      if (!file) return res.status(400).json({ error: 'No file uploaded' });

      const ext = path.extname(file.originalname).toLowerCase();
      let transactions: any[] = [];
      if (ext === '.csv') {
        transactions = await parseCSV(file.buffer);
      } else if (ext === '.pdf') {
        await parsePDF(file.buffer);
        return res.status(501).json({ error: 'PDF parsing not yet implemented' });
      } else if (ext === '.xlsx' || ext === '.xls') {
        transactions = parseXLSX(file.buffer);
      } else {
        return res.status(400).json({ error: 'Unsupported file type' });
      }

      const keywordMap = await learnAndCategorize(prisma, userId);

      const created = [];
      for (const tx of transactions) {
        if (!tx.date || !tx.amount) continue;

        let category = tx.category || categorizeByKeywords(tx.description || '', keywordMap);
        if (!category || category === 'other') {
          try {
            category = await categorizeWithAI(tx.description || '', parseFloat(tx.amount), tx.date);
          } catch {
            category = 'other';
          }
        }

        const createdTx = await prisma.transaction.create({
          data: {
            userId,
            date: new Date(tx.date),
            description: tx.description || '',
            amount: parseFloat(tx.amount),
            category: category || 'other'
          }
        });

        created.push(createdTx);
      }

      res.json({ imported: created.length });
    } catch (err) {
      console.error('Import statement error:', err);
      res.status(500).json({ error: 'Failed to import statement' });
    }
  });

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
      // Cast to any because Loan/LoanPayment/Budget models exist in schema.prisma
      // but migration hasn't been run yet — runtime works fine, types don't reflect it
      const user = await (prisma as any).user.findUnique({
        where: { id: req.userId },
        include: { 
          transactions: true, 
          goals: true, 
          bursaries: true, 
          gamification: true, 
          accounts: true,
          loans: { include: { payments: true }, orderBy: { createdAt: 'desc' } }
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User snapshot not found' });
      }

      const transactions: SnapshotTransaction[] = user.transactions.map((t: any) => ({
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
        .map((g: any) => ({
          id: g.id,
          name: g.name,
          targetAmount: g.targetAmount,
          currentAmount: g.currentAmount,
          deadline: g.deadline.toISOString(),
          priority: g.priority ?? 'medium'
        }))
        .sort((a: any, b: any) => (priorityRank[b.priority] ?? 0) - (priorityRank[a.priority] ?? 0));

      const payload: SnapshotPayload = {
        user: { id: user.id, email: user.email, name: user.name },
        transactions,
        goals: withPriorityFallback,
        bursaries: user.bursaries.map((b: any) => ({
          id: b.id,
          provider: b.provider,
          monthlyAmount: b.monthlyAmount,
          nextPaymentDate: b.nextPaymentDate.toISOString(),
          notes: b.notes
        })),
        loans: (user.loans || []).map((l: any) => ({
          id: l.id,
          name: l.name,
          loanType: l.loanType,
          totalAmount: l.totalAmount,
          remainingBalance: l.remainingBalance,
          interestRate: l.interestRate,
          monthlyPayment: l.monthlyPayment,
          startDate: l.startDate.toISOString(),
          endDate: l.endDate?.toISOString() ?? null,
          purpose: l.purpose,
          lender: l.lender,
          isIslamic: l.isIslamic,
          notes: l.notes,
          payments: l.payments.map((p: any) => ({
            id: p.id,
            amount: p.amount,
            date: p.date.toISOString(),
            notes: p.notes
          }))
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
      const { amount, category, description, date, accountId, halalStatus, loanId, isRecurring } = req.body;
      const userId = req.userId!;

      const parsedAmount = parseFloat(amount);

      // Create transaction — cast to any because loanId/halalStatus/isRecurring
      // exist in schema.prisma but migration hasn't been applied yet
      const transaction = await (prisma as any).transaction.create({
        data: {
          userId,
          accountId: accountId || null,
          loanId: loanId || null,
          amount: parsedAmount,
          category,
          description,
          date: new Date(date),
          halalStatus: halalStatus || null,
          isRecurring: isRecurring || false
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

  // ─── Loan endpoints ───────────────────────────────────────────────────────

  router.get('/loans', authenticate, async (req: AuthRequest, res) => {
    try {
      const loans = await (prisma as any).loan.findMany({
        where: { userId: req.userId },
        include: { payments: { orderBy: { date: 'desc' } } },
        orderBy: { createdAt: 'desc' }
      });
      res.json(loans);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch loans' });
    }
  });

  router.post('/loans', authenticate, async (req: AuthRequest, res) => {
    try {
      const { name, loanType, totalAmount, remainingBalance, interestRate, monthlyPayment,
              startDate, endDate, purpose, lender, isIslamic, notes } = req.body;
      const userId = req.userId!;

      const loan = await (prisma as any).loan.create({
        data: {
          userId,
          name,
          loanType: loanType || 'personal',
          totalAmount: parseFloat(totalAmount),
          remainingBalance: parseFloat(remainingBalance ?? totalAmount),
          interestRate: parseFloat(interestRate || 0),
          monthlyPayment: parseFloat(monthlyPayment),
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          purpose: purpose || null,
          lender: lender || null,
          isIslamic: isIslamic || false,
          notes: notes || null
        },
        include: { payments: true }
      });
      res.json(loan);
    } catch (err) {
      console.error('Create loan error:', err);
      res.status(500).json({ error: 'Failed to create loan' });
    }
  });

  router.put('/loans/:id', authenticate, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const existing = await (prisma as any).loan.findFirst({ where: { id: req.params.id, userId } });
      if (!existing) return res.status(404).json({ error: 'Loan not found' });
      
      const { name, loanType, totalAmount, remainingBalance, interestRate, monthlyPayment,
              startDate, endDate, purpose, lender, isIslamic, notes } = req.body;
      
      const loan = await (prisma as any).loan.update({
        where: { id: req.params.id },
        data: {
          name: name ?? existing.name,
          loanType: loanType ?? existing.loanType,
          totalAmount: totalAmount != null ? parseFloat(totalAmount) : existing.totalAmount,
          remainingBalance: remainingBalance != null ? parseFloat(remainingBalance) : existing.remainingBalance,
          interestRate: interestRate != null ? parseFloat(interestRate) : existing.interestRate,
          monthlyPayment: monthlyPayment != null ? parseFloat(monthlyPayment) : existing.monthlyPayment,
          startDate: startDate ? new Date(startDate) : existing.startDate,
          endDate: endDate ? new Date(endDate) : existing.endDate,
          purpose: purpose ?? existing.purpose,
          lender: lender ?? existing.lender,
          isIslamic: isIslamic ?? existing.isIslamic,
          notes: notes ?? existing.notes
        },
        include: { payments: true }
      });
      res.json(loan);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update loan' });
    }
  });

  router.delete('/loans/:id', authenticate, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const loan = await (prisma as any).loan.findFirst({ where: { id: req.params.id, userId } });
      if (!loan) return res.status(404).json({ error: 'Loan not found' });
      await (prisma as any).loan.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete loan' });
    }
  });

  // Loan payment endpoints
  router.post('/loans/:id/payments', authenticate, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const loan = await (prisma as any).loan.findFirst({ where: { id: req.params.id, userId } });
      if (!loan) return res.status(404).json({ error: 'Loan not found' });

      const { amount, date, notes } = req.body;
      const parsedAmount = parseFloat(amount);

      const payment = await (prisma as any).loanPayment.create({
        data: { loanId: req.params.id, amount: parsedAmount, date: new Date(date), notes: notes || null }
      });

      // Reduce remaining balance
      const newBalance = Math.max(0, loan.remainingBalance - parsedAmount);
      await (prisma as any).loan.update({
        where: { id: req.params.id },
        data: { remainingBalance: newBalance }
      });

      res.json({ payment, newBalance });
    } catch (err) {
      res.status(500).json({ error: 'Failed to record payment' });
    }
  });

  router.delete('/loans/:id/payments/:paymentId', authenticate, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const loan = await (prisma as any).loan.findFirst({ where: { id: req.params.id, userId } });
      if (!loan) return res.status(404).json({ error: 'Loan not found' });

      const payment = await (prisma as any).loanPayment.findFirst({
        where: { id: req.params.paymentId, loanId: req.params.id }
      });
      if (!payment) return res.status(404).json({ error: 'Payment not found' });

      await (prisma as any).loanPayment.delete({ where: { id: req.params.paymentId } });

      // Restore remaining balance
      await (prisma as any).loan.update({
        where: { id: req.params.id },
        data: { remainingBalance: loan.remainingBalance + payment.amount }
      });

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete payment' });
    }
  });

  // ─── Budget endpoints ─────────────────────────────────────────────────────

  router.get('/budgets', authenticate, async (req: AuthRequest, res) => {
    try {
      const month = (req.query.month as string) || new Date().toISOString().slice(0, 7);
      const budgets = await (prisma as any).budget.findMany({
        where: { userId: req.userId, month },
        orderBy: { category: 'asc' }
      });
      res.json(budgets);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch budgets' });
    }
  });

  router.post('/budgets', authenticate, async (req: AuthRequest, res) => {
    try {
      const { category, monthlyLimit, month } = req.body;
      const userId = req.userId!;
      const budget = await (prisma as any).budget.upsert({
        where: { userId_category_month: { userId, category, month } },
        update: { monthlyLimit: parseFloat(monthlyLimit) },
        create: { userId, category, monthlyLimit: parseFloat(monthlyLimit), month }
      });
      res.json(budget);
    } catch (err) {
      res.status(500).json({ error: 'Failed to save budget' });
    }
  });

  router.delete('/budgets/:id', authenticate, async (req: AuthRequest, res) => {
    try {
      await (prisma as any).budget.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete budget' });
    }
  });

  // ─── Gamification XP update ───────────────────────────────────────────────

  router.put('/gamification', authenticate, async (req: AuthRequest, res) => {
    try {
      const { xp, level, streak, persona, badges, dailyChallenge } = req.body;
      const userId = req.userId!;
      const gamification = await prisma.gamification.upsert({
        where: { userId },
        update: {
          xp: xp != null ? xp : undefined,
          level: level != null ? level : undefined,
          streak: streak != null ? streak : undefined,
          persona: persona ?? undefined,
          badges: badges != null ? (typeof badges === 'string' ? badges : JSON.stringify(badges)) : undefined,
          dailyChallenge: dailyChallenge ?? undefined
        },
        create: {
          userId, xp: xp || 0, level: level || 1, streak: streak || 0,
          persona: persona || 'friendly',
          dailyChallenge: dailyChallenge || 'Add your first transaction',
          badges: typeof badges === 'string' ? badges : JSON.stringify(badges || [])
        }
      });
      res.json(gamification);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update gamification' });
    }
  });

  // ─── User profile update ──────────────────────────────────────────────────

  router.put('/user/profile', authenticate, async (req: AuthRequest, res) => {
    try {
      const { name } = req.body;
      const userId = req.userId!;
      const user = await prisma.user.update({
        where: { id: userId },
        data: { name: name ?? undefined }
      });
      res.json({ user });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  return router;
}
