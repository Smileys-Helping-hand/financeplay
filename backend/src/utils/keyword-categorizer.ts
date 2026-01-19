// Utility for keyword learning and auto-categorization
import { PrismaClient } from '@prisma/client';

export async function learnAndCategorize(prisma: PrismaClient, userId: string) {
  // Get all user transactions
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    select: { id: true, description: true, category: true },
  });

  // Build keyword-category map
  const keywordMap: Record<string, string> = {};
  for (const tx of transactions) {
    const words = tx.description.toLowerCase().split(/\W+/).filter(Boolean);
    for (const word of words) {
      if (!keywordMap[word]) keywordMap[word] = tx.category;
    }
  }
  return keywordMap;
}

export function categorizeByKeywords(description: string, keywordMap: Record<string, string>): string {
  const words = description.toLowerCase().split(/\W+/).filter(Boolean);
  for (const word of words) {
    if (keywordMap[word]) return keywordMap[word];
  }
  return 'other';
}
