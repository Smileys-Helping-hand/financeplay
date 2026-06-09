import { NextRequest, NextResponse } from 'next/server';
import { getAvailableTimeSlots } from '@/lib/calendar-service';

/**
 * GET /api/calendar/availability
 *
 * Returns available time slots for the next 30 days
 * Used by booking form to populate date/time pickers
 */
export async function GET(request: NextRequest) {
  try {
    const advisorId = request.nextUrl.searchParams.get('advisorId');
    const daysAhead = parseInt(request.nextUrl.searchParams.get('daysAhead') || '30', 10);

    if (daysAhead < 1 || daysAhead > 365) {
      return NextResponse.json(
        { success: false, error: 'daysAhead must be between 1 and 365' },
        { status: 400 }
      );
    }

    const slots = await getAvailableTimeSlots(advisorId || undefined, daysAhead);

    // Cache for 1 hour (availability doesn't change frequently)
    return NextResponse.json(
      { success: true, data: slots },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error) {
    console.error('[CALENDAR AVAILABILITY ERROR]', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch availability',
      },
      { status: 500 }
    );
  }
}
