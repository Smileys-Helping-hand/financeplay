import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple authentication middleware for Next.js
export function getUserIdFromRequest(request: NextRequest): string | null {
  const userId = request.headers.get('x-user-id');
  return userId;
}

export function requireAuth(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export { prisma };
