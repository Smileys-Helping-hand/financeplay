import { NextRequest, NextResponse } from 'next/server';
import { prisma, authenticateRequest } from '@/lib/server/auth';
import { buildWeeklySummary } from '@/lib/server/report-builder';
import PDFDocument from 'pdfkit';

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      include: { transactions: true, goals: true, bursaries: true, gamification: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User snapshot not found' }, { status: 404 });
    }

    const summary = buildWeeklySummary(user);
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];
    
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    
    const pdfPromise = new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
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

    const pdfBuffer = await pdfPromise;
    
    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="financeplay-report.pdf"'
      }
    });
  } catch (err) {
    console.error('Report generation error:', err);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
