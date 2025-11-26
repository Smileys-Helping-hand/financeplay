import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/reports/weekly`);
    if (!res.ok) {
      return NextResponse.json({ error: 'Report service unavailable' }, { status: res.status });
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="financeplay-report.pdf"'
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
