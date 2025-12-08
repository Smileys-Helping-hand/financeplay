import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Authentication middleware that extracts userId from headers
 * In production, this should validate JWT tokens or session cookies
 */
export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // Get userId from Authorization header or x-user-id header
    const userId = req.headers.authorization?.replace('Bearer ', '') || req.headers['x-user-id'] as string;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required. Please provide user ID.' });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid user ID' });
    }

    // Attach userId to request
    req.userId = userId;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Authentication failed' });
  }
}

/**
 * Optional authentication - doesn't fail if no user, but sets userId if present
 */
export async function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.headers.authorization?.replace('Bearer ', '') || req.headers['x-user-id'] as string;
    
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        req.userId = userId;
      }
    }
    
    next();
  } catch (err) {
    next();
  }
}
