import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';
import { buildWeeklySummary } from '../utils/report-builder';
import { buildSnapshot } from '../utils/snapshot';

export default function reportRouter(prisma: PrismaClient) {
  const router = Router();

  router.get('/weekly', async (_req: Request, res: Response) => {
    try {
      const snapshot = await buildSnapshot(prisma);
      const summary = buildWeeklySummary(snapshot);
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="financeplay-report.pdf"');
        res.send(pdfBuffer);
      });

      doc.fontSize(18).fillColor('#0f172a').text('FinancePlay Weekly Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).fillColor('#111827').text(summary.title);
      doc.moveDown();
      summary.sections.forEach((section) => {
        doc.fontSize(14).fillColor('#0f172a').text(section.heading);
        doc.fontSize(11).fillColor('#111827').list(section.points);
        doc.moveDown();
      });
      doc.end();
    } catch (err) {
      res.status(500).json({ error: 'Failed to generate report' });
    }
  });

  return router;
}
