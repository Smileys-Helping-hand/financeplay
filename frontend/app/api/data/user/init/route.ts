import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, name, firebaseUid } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    let user = await prisma.user.findFirst({ where: { email } });
    
    if (user) {
      console.log(`User already exists: ${email}`);
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }
    
    // Create user in database
    user = await prisma.user.create({
      data: { email, name, firebaseUid }
    });
    
    console.log(`Created new user: ${user.id} - ${email}`);
    
    // Initialize gamification
    await prisma.gamification.create({
      data: {
        userId: user.id,
        level: 1,
        xp: 0,
        streak: 0,
        persona: 'friendly',
        dailyChallenge: 'Add your first transaction',
        badges: JSON.stringify([])
      }
    });
    
    return NextResponse.json({ userId: user.id, user });
  } catch (err) {
    console.error('User init error:', err);
    return NextResponse.json({ error: 'Failed to initialize user' }, { status: 500 });
  }
}
