import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export { prisma };

export async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  const userId = request.headers.get('authorization')?.replace('Bearer ', '') || 
                 request.headers.get('x-user-id');
  return userId || null;
}

export async function authenticateRequest(request: NextRequest): Promise<{ userId: string } | { error: string; status: number }> {
  const userId = await getUserIdFromRequest(request);

  if (!userId) {
    return { error: 'Authentication required. Please provide user ID.', status: 401 };
  }

  // Verify user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user) {
    return { error: 'Invalid user ID', status: 401 };
  }

  return { userId };
}
