import { fetchSnapshot, fetchAccounts } from './api';
import { useFinanceStore } from './store';
import { Gamification, FinancialHealth, Insight } from './types';

// Calculate financial health score based on transactions and goals
export function calculateFinancialHealth(
  transactions: any[],
  goals: any[],
  spendingTotals: any
): FinancialHealth {
  let score = 50; // Base score
  
  // Factor 1: Savings ratio (0-30 points)
  const totalIncome = transactions
    .filter(t => t.category === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = spendingTotals.total || 0;
  const totalSavings = transactions
    .filter(t => t.category === 'savings')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  if (totalIncome > 0) {
    const savingsRate = (totalSavings / totalIncome) * 100;
    if (savingsRate >= 20) score += 30;
    else if (savingsRate >= 10) score += 20;
    else if (savingsRate >= 5) score += 10;
    
    // Spending ratio (0-20 points)
    const spendingRate = (totalExpenses / totalIncome) * 100;
    if (spendingRate <= 60) score += 20;
    else if (spendingRate <= 80) score += 10;
    else if (spendingRate > 100) score -= 10; // Overspending penalty
  }
  
  // Factor 2: Goal progress (0-20 points)
  if (goals.length > 0) {
    const avgProgress = goals.reduce((sum, g) => {
      return sum + (g.currentAmount / g.targetAmount) * 100;
    }, 0) / goals.length;
    
    if (avgProgress >= 50) score += 20;
    else if (avgProgress >= 25) score += 10;
    else if (avgProgress > 0) score += 5;
  }
  
  // Cap score between 0-100
  score = Math.max(0, Math.min(100, score));
  
  // Determine category
  let category: 'poor' | 'fair' | 'good';
  if (score >= 70) category = 'good';
  else if (score >= 40) category = 'fair';
  else category = 'poor';
  
  // Generate summary
  let summary = '';
  if (category === 'good') {
    summary = `Great job! You're saving consistently and making progress on your goals.`;
  } else if (category === 'fair') {
    summary = `You're on track, but there's room for improvement. Try reducing spending or increasing savings.`;
  } else {
    summary = `Your finances need attention. Focus on tracking expenses and creating a budget.`;
  }
  
  return { score, category, summary };
}

// Generate AI-powered insights based on spending patterns
export function generateInsights(
  transactions: any[],
  goals: any[],
  spendingTotals: any,
  gamification: Gamification
): Insight[] {
  const insights: Insight[] = [];
  
  // Get recent transactions (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentTransactions = transactions.filter(t => 
    new Date(t.date) >= thirtyDaysAgo
  );
  
  // Insight 1: Spending pattern
  if (spendingTotals.byCategory) {
    const categories = Object.entries(spendingTotals.byCategory) as [string, number][];
    categories.sort((a, b) => b[1] - a[1]);
    
    if (categories.length > 0) {
      const topCategory = categories[0];
      const percentage = ((topCategory[1] / spendingTotals.total) * 100).toFixed(0);
      insights.push({
        title: `${topCategory[0].charAt(0).toUpperCase() + topCategory[0].slice(1)} is your top expense`,
        description: `You've spent R${topCategory[1].toFixed(0)} on ${topCategory[0]} (${percentage}% of total spending). Consider setting a budget limit for this category.`,
        action: `Set a monthly ${topCategory[0]} budget`
      });
    }
  }
  
  // Insight 2: Goal progress
  const activeGoals = goals.filter(g => {
    const deadline = new Date(g.deadline);
    return deadline > new Date();
  });
  
  if (activeGoals.length > 0) {
    const closestGoal = activeGoals.reduce((closest, goal) => {
      const closestProgress = (closest.currentAmount / closest.targetAmount) * 100;
      const goalProgress = (goal.currentAmount / goal.targetAmount) * 100;
      
      if (goalProgress > closestProgress && goalProgress < 100) {
        return goal;
      }
      return closest;
    }, activeGoals[0]);
    
    const progress = ((closestGoal.currentAmount / closestGoal.targetAmount) * 100).toFixed(0);
    const remaining = closestGoal.targetAmount - closestGoal.currentAmount;
    
    insights.push({
      title: `${closestGoal.name} is ${progress}% complete`,
      description: `You need R${remaining.toFixed(0)} more to reach your goal. Keep up the great work!`,
      action: `Add R${Math.min(remaining, 200).toFixed(0)} to ${closestGoal.name}`
    });
  }
  
  // Insight 3: Gamification motivation
  if (gamification) {
    const xpNeeded = (gamification.level * 500) - gamification.xp;
    if (xpNeeded <= 200) {
      insights.push({
        title: `Level ${gamification.level + 1} is within reach!`,
        description: `You're only ${xpNeeded} XP away from leveling up. Complete transactions or reach goals to earn XP.`,
        action: `Add a transaction to earn XP`
      });
    } else if (gamification.streak >= 5) {
      insights.push({
        title: `🔥 ${gamification.streak}-day streak!`,
        description: `You're on fire! Keep tracking your finances daily to maintain your streak and earn bonus XP.`,
        action: `Continue your streak tomorrow`
      });
    }
  }
  
  // Ensure we always have at least one insight
  if (insights.length === 0) {
    insights.push({
      title: 'Start tracking your finances',
      description: 'Add transactions to get personalized insights about your spending habits and financial health.',
      action: 'Add your first transaction'
    });
  }
  
  return insights.slice(0, 3); // Return max 3 insights
}

// Load all data from backend and update store
export async function loadAllData() {
  try {
    const snapshot = await fetchSnapshot();
    const accounts = await fetchAccounts();
    
    // Calculate derived data
    const health = calculateFinancialHealth(
      snapshot.transactions,
      snapshot.goals,
      snapshot.spendingTotals
    );
    
    const insights = generateInsights(
      snapshot.transactions,
      snapshot.goals,
      snapshot.spendingTotals,
      snapshot.gamification
    );
    
    // Parse gamification badges
    const gamification = snapshot.gamification ? {
      ...snapshot.gamification,
      badges: typeof snapshot.gamification.badges === 'string' 
        ? JSON.parse(snapshot.gamification.badges || '[]')
        : (snapshot.gamification.badges || []),
      xpToNext: (snapshot.gamification.level * 500) - snapshot.gamification.xp
    } : {
      userId: snapshot.user.id,
      level: 1,
      xp: 0,
      xpToNext: 100,
      streak: 0,
      persona: 'friendly' as const,
      dailyChallenge: 'Add your first transaction',
      badges: []
    };
    
    // Update store with all data
    useFinanceStore.setState({
      user: snapshot.user,
      transactions: snapshot.transactions,
      goals: snapshot.goals,
      bursaries: snapshot.bursaries,
      gamification,
      insights,
      health
    });
    
    return snapshot;
  } catch (error) {
    console.error('Failed to load data:', error);
    throw error;
  }
}
