import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/auth';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Try to count users
    const userCount = await prisma.user.count();
    
    return NextResponse.json({ 
      status: 'ok',
      database: 'connected',
      userCount,
      databaseUrl: process.env.DATABASE_URL ? 'set' : 'NOT SET'
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error',
      message: error.message,
      databaseUrl: process.env.DATABASE_URL ? 'set' : 'NOT SET'
    }, { status: 500 });
  }
}
