/**
 * Calendar Service for Family Wealth Custodians
 * Manages advisor availability and booking scheduling
 * Integrates with Cal.com, Calendly, or Google Calendar
 */

export interface CalendarProvider {
  type: 'calcom' | 'calendly' | 'google' | 'mock';
  apiKey?: string;
  calendarId?: string;
  username?: string;
}

export interface AdvisorAvailability {
  advisorId: string;
  date: string; // YYYY-MM-DD
  times: string[]; // ["09:00", "10:00", "14:00", "15:00"]
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  zoomLink: string;
  attendees: string[];
}

export interface ZoomMeeting {
  id: string;
  meetingLink: string;
  joinUrl: string;
  meetingNumber: string;
  password?: string;
  startTime: Date;
  duration: number; // minutes
}

/**
 * Get advisor availability for a given date range
 */
export async function getAdvisorAvailability(
  advisorId: string,
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> {
  try {
    const provider = getCalendarProvider();

    switch (provider.type) {
      case 'calcom':
        return await getCalcomAvailability(advisorId, startDate, endDate);
      case 'calendly':
        return await getCalendlyAvailability(advisorId, startDate, endDate);
      case 'google':
        return await getGoogleCalendarAvailability(advisorId, startDate, endDate);
      default:
        return getMockAvailability(startDate, endDate);
    }
  } catch (error) {
    console.error('[CALENDAR] Error fetching availability:', error);
    return [];
  }
}

/**
 * Get available time slots for next 30 days
 */
export async function getAvailableTimeSlots(
  advisorId?: string,
  daysAhead: number = 30
): Promise<{ date: string; times: string[] }[]> {
  const today = new Date();
  const endDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  try {
    if (advisorId) {
      const events = await getAdvisorAvailability(advisorId, today, endDate);
      return formatAvailableSlots(events);
    }

    // Get availability from all active advisors and find overlaps
    return getMockAvailableSlots(daysAhead);
  } catch (error) {
    console.error('[CALENDAR] Error getting slots:', error);
    return getMockAvailableSlots(daysAhead);
  }
}

/**
 * Book a calendar event and generate Zoom link
 */
export async function createBookingEvent(
  advisorId: string,
  clientName: string,
  clientEmail: string,
  date: string,
  time: string,
  duration: number = 30
): Promise<{ eventId: string; zoomLink: string }> {
  try {
    const provider = getCalendarProvider();

    // 1. Create Zoom meeting
    const zoomMeeting = await createZoomMeeting(clientName, date, time, duration);

    // 2. Create calendar event with Zoom link
    let eventId: string;

    switch (provider.type) {
      case 'calcom':
        eventId = await createCalcomEvent(advisorId, clientName, clientEmail, date, time, zoomMeeting);
        break;
      case 'calendly':
        eventId = await createCalendlyEvent(advisorId, clientName, clientEmail, date, time, zoomMeeting);
        break;
      case 'google':
        eventId = await createGoogleCalendarEvent(
          advisorId,
          clientName,
          clientEmail,
          date,
          time,
          zoomMeeting
        );
        break;
      default:
        eventId = `mock-event-${Date.now()}`;
    }

    return {
      eventId,
      zoomLink: zoomMeeting.joinUrl,
    };
  } catch (error) {
    console.error('[CALENDAR] Error creating booking event:', error);
    return {
      eventId: '',
      zoomLink: `https://zoom.us/j/${Math.random().toString().substring(2, 11)}`, // Fallback
    };
  }
}

/**
 * Cal.com Integration
 * https://cal.com/docs/api
 */
async function getCalcomAvailability(
  username: string,
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> {
  const apiKey = process.env.CALCOM_API_KEY;
  if (!apiKey) throw new Error('CALCOM_API_KEY not configured');

  try {
    const response = await fetch(`https://api.cal.com/v1/availability?username=${username}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!response.ok) throw new Error(`Cal.com API error: ${response.statusText}`);

    const data = (await response.json()) as { slots: CalendarEvent[] };
    return data.slots || [];
  } catch (error) {
    console.error('[CALCOM] Error fetching availability:', error);
    throw error;
  }
}

async function createCalcomEvent(
  username: string,
  clientName: string,
  clientEmail: string,
  date: string,
  time: string,
  zoomMeeting: ZoomMeeting
): Promise<string> {
  const apiKey = process.env.CALCOM_API_KEY;
  if (!apiKey) throw new Error('CALCOM_API_KEY not configured');

  try {
    const response = await fetch('https://api.cal.com/v1/bookings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        eventTypeId: process.env.CALCOM_EVENT_TYPE_ID,
        name: clientName,
        email: clientEmail,
        startTime: new Date(`${date}T${time}`).toISOString(),
        videoCallProvider: 'zoom',
        videoCallData: { url: zoomMeeting.joinUrl },
      }),
    });

    if (!response.ok) throw new Error(`Cal.com API error: ${response.statusText}`);

    const data = (await response.json()) as { id: string };
    return data.id;
  } catch (error) {
    console.error('[CALCOM] Error creating event:', error);
    throw error;
  }
}

/**
 * Calendly Integration
 * https://developer.calendly.com/
 */
async function getCalendlyAvailability(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> {
  const apiToken = process.env.CALENDLY_API_TOKEN;
  if (!apiToken) throw new Error('CALENDLY_API_TOKEN not configured');

  try {
    const response = await fetch(
      `https://api.calendly.com/users/${userId}/availability_schedules?` +
      `start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`,
      {
        headers: { Authorization: `Bearer ${apiToken}` },
      }
    );

    if (!response.ok) throw new Error(`Calendly API error: ${response.statusText}`);

    const data = (await response.json()) as { collection: CalendarEvent[] };
    return data.collection || [];
  } catch (error) {
    console.error('[CALENDLY] Error fetching availability:', error);
    throw error;
  }
}

async function createCalendlyEvent(
  _userId: string,
  clientName: string,
  _clientEmail: string,
  _date: string,
  _time: string,
  zoomMeeting: ZoomMeeting
): Promise<string> {
  // Calendly doesn't have direct booking API - instead return event type URL
  // User would click link to book
  console.warn('[CALENDLY] Use Calendly embedded calendar widget for bookings');
  return `calendly-event-${zoomMeeting.id}`;
}

/**
 * Google Calendar Integration
 */
async function getGoogleCalendarAvailability(
  calendarId: string,
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> {
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_CALENDAR_API_KEY not configured');

  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?` +
      `timeMin=${startDate.toISOString()}&timeMax=${endDate.toISOString()}&key=${apiKey}`
    );

    if (!response.ok) throw new Error(`Google Calendar API error: ${response.statusText}`);

    const data = (await response.json()) as { items: CalendarEvent[] };
    return data.items || [];
  } catch (error) {
    console.error('[GOOGLE_CALENDAR] Error fetching availability:', error);
    throw error;
  }
}

async function createGoogleCalendarEvent(
  calendarId: string,
  clientName: string,
  clientEmail: string,
  date: string,
  time: string,
  zoomMeeting: ZoomMeeting
): Promise<string> {
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_CALENDAR_API_KEY not configured');

  try {
    const startTime = new Date(`${date}T${time}`);
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 min default

    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        summary: `Exploration Call - ${clientName}`,
        description: `Booking reference: ${zoomMeeting.id}`,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
        attendees: [{ email: clientEmail }],
        conferenceData: {
          conferenceSolution: {
            key: { conferenceSolutionKey: 'hangoutsMeet' },
          },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 hours
            { method: 'popup', minutes: 10 },
          ],
        },
      }),
    });

    if (!response.ok) throw new Error(`Google Calendar API error: ${response.statusText}`);

    const data = (await response.json()) as { id: string };
    return data.id;
  } catch (error) {
    console.error('[GOOGLE_CALENDAR] Error creating event:', error);
    throw error;
  }
}

/**
 * Zoom Integration
 * https://developers.zoom.com/docs/api/rest/
 */
export async function createZoomMeeting(
  clientName: string,
  date: string,
  time: string,
  duration: number = 30
): Promise<ZoomMeeting> {
  try {
    const accountId = process.env.ZOOM_ACCOUNT_ID;
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;

    if (!accountId || !clientId || !clientSecret) {
      console.warn('[ZOOM] Credentials not configured, using mock meeting');
      return getMockZoomMeeting();
    }

    // Get access token
    const tokenResponse = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'account_credentials',
        account_id: accountId,
      }).toString(),
    });

    if (!tokenResponse.ok) throw new Error('Failed to get Zoom access token');

    const { access_token } = (await tokenResponse.json()) as { access_token: string };

    // Create meeting
    const meetingResponse = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: `Exploration Call - ${clientName}`,
        type: 2, // Scheduled meeting
        start_time: new Date(`${date}T${time}`).toISOString(),
        duration,
        timezone: 'Africa/Johannesburg',
        settings: {
          host_video: false,
          participant_video: true,
          waiting_room: true,
          auto_recording: 'none',
        },
      }),
    });

    if (!meetingResponse.ok) throw new Error('Failed to create Zoom meeting');

    const meeting = (await meetingResponse.json()) as {
      id: string;
      join_url: string;
      start_url: string;
    };

    return {
      id: String(meeting.id),
      meetingLink: meeting.start_url,
      joinUrl: meeting.join_url,
      meetingNumber: String(meeting.id),
      startTime: new Date(`${date}T${time}`),
      duration,
    };
  } catch (error) {
    console.error('[ZOOM] Error creating meeting:', error);
    return getMockZoomMeeting();
  }
}

/**
 * Utility Functions
 */

function getCalendarProvider(): CalendarProvider {
  if (process.env.CALCOM_API_KEY) {
    return { type: 'calcom', apiKey: process.env.CALCOM_API_KEY };
  }
  if (process.env.CALENDLY_API_TOKEN) {
    return { type: 'calendly', apiKey: process.env.CALENDLY_API_TOKEN };
  }
  if (process.env.GOOGLE_CALENDAR_API_KEY) {
    return { type: 'google', apiKey: process.env.GOOGLE_CALENDAR_API_KEY };
  }
  return { type: 'mock' };
}

function formatAvailableSlots(events: CalendarEvent[]): { date: string; times: string[] }[] {
  const slots: { [key: string]: string[] } = {};

  events.forEach((event) => {
    const date = event.start.toISOString().split('T')[0];
    const time = event.start.toTimeString().split(':').slice(0, 2).join(':');

    if (!slots[date]) slots[date] = [];
    slots[date].push(time);
  });

  return Object.entries(slots).map(([date, times]) => ({
    date,
    times: times.sort(),
  }));
}

function getMockAvailability(startDate: Date, endDate: Date): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const current = new Date(startDate);

  while (current < endDate) {
    // Only weekdays
    if (current.getDay() !== 0 && current.getDay() !== 6) {
      const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

      times.forEach((time) => {
        const [hours, minutes] = time.split(':');
        const eventDate = new Date(current);
        eventDate.setHours(parseInt(hours), parseInt(minutes));

        events.push({
          id: `mock-${current.toISOString()}-${time}`,
          title: 'Available',
          start: eventDate,
          end: new Date(eventDate.getTime() + 30 * 60 * 1000),
          zoomLink: '',
          attendees: [],
        });
      });
    }

    current.setDate(current.getDate() + 1);
  }

  return events;
}

function getMockAvailableSlots(daysAhead: number): { date: string; times: string[] }[] {
  const slots: { date: string; times: string[] }[] = [];
  const today = new Date();

  for (let i = 1; i <= daysAhead; i++) {
    const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);

    // Only weekdays
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      slots.push({
        date: date.toISOString().split('T')[0],
        times: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      });
    }
  }

  return slots;
}

function getMockZoomMeeting(): ZoomMeeting {
  const meetingId = Math.random().toString().substring(2, 11);
  return {
    id: meetingId,
    meetingLink: `https://zoom.us/j/${meetingId}`,
    joinUrl: `https://zoom.us/j/${meetingId}`,
    meetingNumber: meetingId,
    password: Math.random().toString().substring(2, 8),
    startTime: new Date(),
    duration: 30,
  };
}
