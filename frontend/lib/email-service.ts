/**
 * Email Service for Family Wealth Custodians
 * Supports Resend, SendGrid, and SMTP
 * Currently configured for Resend (recommended for Next.js)
 */

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  tags?: string[];
}

export interface BookingConfirmationData {
  clientName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  services: string[];
  goal: string;
  advisorName?: string;
  zoomLink?: string;
}

// Default sender email - configure in environment variables
const DEFAULT_FROM_EMAIL = process.env.NEXT_PUBLIC_SENDER_EMAIL || 'noreply@familywealthcustodians.co.za';
const DEFAULT_ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'info@familywealthcustodians.co.za';

/**
 * Send email via the configured provider
 * Currently uses Resend, but can be swapped for SendGrid, SMTP, etc.
 */
export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Check if we're in a test/development environment without email setup
    if (process.env.NODE_ENV === 'development' && !process.env.RESEND_API_KEY) {
      console.log('[EMAIL DEBUG]', {
        to: payload.to,
        subject: payload.subject,
        from: payload.from || DEFAULT_FROM_EMAIL,
      });
      return { success: true, messageId: 'dev-mode' };
    }

    // If using Resend (recommended for Next.js)
    if (process.env.RESEND_API_KEY) {
      return await sendViaResend(payload);
    }

    // If using SendGrid
    if (process.env.SENDGRID_API_KEY) {
      return await sendViaSendGrid(payload);
    }

    // Fallback: log to console (development)
    console.warn('[EMAIL] No email service configured. Email would have been sent to:', payload.to);
    return { success: true, messageId: 'mock' };
  } catch (error) {
    console.error('[EMAIL ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error',
    };
  }
}

/**
 * Send email via Resend
 * Requires RESEND_API_KEY environment variable
 */
async function sendViaResend(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: payload.from || DEFAULT_FROM_EMAIL,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        reply_to: payload.replyTo || DEFAULT_ADMIN_EMAIL,
        tags: payload.tags || [],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || `Resend API error: ${response.statusText}`,
      };
    }

    const data = (await response.json()) as { id: string };
    return { success: true, messageId: data.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Resend API error',
    };
  }
}

/**
 * Send email via SendGrid
 * Requires SENDGRID_API_KEY environment variable
 */
async function sendViaSendGrid(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: payload.to }],
            subject: payload.subject,
          },
        ],
        from: { email: payload.from || DEFAULT_FROM_EMAIL },
        content: [
          {
            type: 'text/html',
            value: payload.html,
          },
        ],
        reply_to: {
          email: payload.replyTo || DEFAULT_ADMIN_EMAIL,
        },
        categories: payload.tags || [],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || `SendGrid API error: ${response.statusText}`,
      };
    }

    // SendGrid returns 202 on success with no body
    const messageId = response.headers.get('x-message-id') || 'sendgrid-sent';
    return { success: true, messageId };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'SendGrid API error',
    };
  }
}

/**
 * Send booking confirmation email to client
 */
export async function sendBookingConfirmation(data: BookingConfirmationData): Promise<{ success: boolean; error?: string }> {
  try {
    const { BookingConfirmationEmail } = await import('./email-templates');

    const html = BookingConfirmationEmail({
      clientName: data.clientName,
      email: data.email,
      date: data.date,
      time: data.time,
      advisorName: data.advisorName || 'Our Team',
      zoomLink: data.zoomLink,
    });

    // Convert React component to string
    const { renderToStaticMarkup } = await import('react-dom/server');
    const htmlString = renderToStaticMarkup(html as any);

    const result = await sendEmail({
      to: data.email,
      subject: 'Your Exploration Call is Confirmed - Family Wealth Custodians',
      html: htmlString,
      tags: ['booking', 'confirmation'],
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to send confirmation email');
    }

    // Also send admin notification
    await sendAdminNotification(data);

    return { success: true };
  } catch (error) {
    console.error('[BOOKING CONFIRMATION ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send confirmation email',
    };
  }
}

/**
 * Send admin notification when new booking is received
 */
async function sendAdminNotification(data: BookingConfirmationData): Promise<void> {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Booking Received</h2>
        <p><strong>Client Name:</strong> ${data.clientName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Scheduled Date:</strong> ${data.date}</p>
        <p><strong>Scheduled Time:</strong> ${data.time} SAST</p>
        <p><strong>Services Interested:</strong> ${data.services.join(', ')}</p>
        <p><strong>Wealth Goal:</strong> ${data.goal}</p>
        <hr />
        <p>Log in to admin dashboard to manage this booking.</p>
      </div>
    `;

    await sendEmail({
      to: DEFAULT_ADMIN_EMAIL,
      subject: `New Booking: ${data.clientName} - ${data.date}`,
      html,
      tags: ['booking', 'admin', 'internal'],
    });
  } catch (error) {
    console.error('[ADMIN NOTIFICATION ERROR]', error);
  }
}

/**
 * Schedule a reminder email for 24 hours before the booking
 * This would need to be called from a background job/cron service
 */
export async function scheduleReminderEmail(bookingId: string, data: BookingConfirmationData): Promise<void> {
  try {
    // This would integrate with a job queue like Bull, Agenda, or AWS SQS
    // For now, logging the requirement
    console.log('[SCHEDULER] Reminder email scheduled for:', bookingId, data.date);

    // In a production system:
    // 1. Save booking with scheduled reminder flag
    // 2. Use a job queue to send reminder 24 hours before
    // 3. Use Resend's scheduled email feature or cron service

    // Example implementation with cron would look like:
    // await scheduleJob(new Date(bookingDate - 24 hours), () => {
    //   sendReminderEmail(bookingId, data)
    // })
  } catch (error) {
    console.error('[SCHEDULER ERROR]', error);
  }
}
