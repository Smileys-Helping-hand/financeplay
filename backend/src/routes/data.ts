import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { buildSnapshot } from '../utils/snapshot';

export default function dataRouter(prisma: PrismaClient) {
  const router = Router();

  router.get('/snapshot', async (_req, res) => {
    try {
      const snapshot = await buildSnapshot(prisma);
      res.json(snapshot);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load snapshot' });
    }
  });

  return router;
}
