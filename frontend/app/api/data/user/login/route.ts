import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, firebaseUid } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    let user = await prisma.user.findFirst({ where: { email } });
    
    if (!user) {
      // If user authenticated with Firebase but doesn't exist in DB, create them
      if (firebaseUid) {
        console.log(`Creating database user for Firebase account: ${email}`);
        user = await prisma.user.create({
          data: { 
            email, 
            firebaseUid,
            name: email.split('@')[0] // Use email prefix as default name
          }
        });
        
        // Initialize gamification for new user
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
        
        console.log(`Successfully created database user: ${user.id}`);
      } else {
        return NextResponse.json({ error: 'Account not found. Please sign up first.' }, { status: 404 });
      }
    } else {
      // Update Firebase UID if not set
      if (firebaseUid && !user.firebaseUid) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { firebaseUid }
        });
      }
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
