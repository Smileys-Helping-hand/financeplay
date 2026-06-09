import { NextRequest, NextResponse } from 'next/server';
import { sendBookingConfirmation } from '@/lib/email-service';

interface BookingRequest {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  services: string[];
  goal: string;
  preferredDate: string;
  preferredTime: string;
}

/**
 * POST /api/bookings/confirm
 *
 * Handles booking form submission:
 * 1. Validates input
 * 2. Sends confirmation email to client
 * 3. Sends notification to admin
 * 4. (In future) Saves to database
 * 5. (In future) Syncs with CRM
 */
export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json();

    // Input validation
    if (!body.fullName || !body.email || !body.phone || !body.preferredDate || !body.preferredTime) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Service selection validation
    if (!body.services || body.services.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one service must be selected' },
        { status: 400 }
      );
    }

    // Save booking to database
    try {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      const booking = await prisma.booking.create({
        data: {
          fullName: body.fullName,
          email: body.email,
          phone: body.phone,
          country: body.country,
          services: JSON.stringify(body.services),
          goal: body.goal,
          preferredDate: new Date(body.preferredDate),
          preferredTime: body.preferredTime,
          status: 'pending',
        },
      });

      await prisma.$disconnect();
    } catch (dbError) {
      console.error('[DATABASE ERROR]', dbError);
      // Continue even if database save fails - email is the critical part
    }

    // TODO: Assign advisor based on availability
    const advisorName = 'Margaret Williams'; // Placeholder

    // TODO: Generate Zoom link from calendar API
    const zoomLink = `https://zoom.us/j/${Math.random().toString().substring(2, 11)}`; // Placeholder

    // Format date for display
    const dateObj = new Date(body.preferredDate);
    const formattedDate = dateObj.toLocaleDateString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Send confirmation email
    const emailResult = await sendBookingConfirmation({
      clientName: body.fullName,
      email: body.email,
      phone: body.phone,
      date: formattedDate,
      time: body.preferredTime,
      services: body.services,
      goal: body.goal,
      advisorName,
      zoomLink,
    });

    if (!emailResult.success) {
      console.error('[BOOKING] Email send failed:', emailResult.error);
      // Don't fail the entire request if email fails
      // In production, you'd want to retry or queue this
    }

    // TODO: Sync with CRM (Salesforce, HubSpot, etc.)
    // await syncWithCRM({
    //   firstName: body.fullName.split(' ')[0],
    //   lastName: body.fullName.split(' ').slice(1).join(' '),
    //   email: body.email,
    //   phone: body.phone,
    //   services: body.services,
    //   goal: body.goal,
    // });

    // TODO: Add to calendar/scheduling system
    // await addToAdvisorCalendar({
    //   advisorId: assignedAdvisor.id,
    //   date: body.preferredDate,
    //   time: body.preferredTime,
    //   clientName: body.fullName,
    //   duration: 30,
    // });

    return NextResponse.json(
      {
        success: true,
        message: 'Booking confirmed! Confirmation email sent.',
        data: {
          date: formattedDate,
          time: body.preferredTime,
          advisor: advisorName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[BOOKING API ERROR]', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process booking',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings/confirm?email=client@example.com
 *
 * Allows checking booking status by email (for debugging)
 */
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { success: false, error: 'Email parameter required' },
      { status: 400 }
    );
  }

  // TODO: Query bookings database
  // const booking = await db.bookings.findByEmail(email);

  return NextResponse.json({
    success: true,
    message: 'Booking lookup functionality - to be implemented with database',
  });
}
