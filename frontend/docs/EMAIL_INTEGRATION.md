# Email Integration Setup Guide

## Overview

The Family Wealth Custodians booking system uses email templates and transactional emails to confirm bookings, send reminders, and follow up with clients.

### What's Included

- ✅ **Booking Confirmation Email** - Sent immediately after booking
- ✅ **Reminder Email** - Sent 24 hours before the call
- ✅ **Follow-up Email** - Sent after the call completes
- ✅ **Admin Notification** - Internal notification of new bookings

---

## Architecture

```
User Books Call
    ↓
[POST /api/bookings/confirm]
    ↓
Validate & Save to DB
    ↓
Send Confirmation Email (via Resend/SendGrid)
    ├─→ Client receives booking confirmation
    └─→ Admin receives notification
    ↓
Schedule Reminder (24 hours before)
    ↓
Send Follow-up (after call completes)
```

---

## Email Service Setup

Choose **ONE** email service below:

### Option 1: Resend (Recommended for Next.js)

**Why:** Built for Next.js, simple API, good deliverability, free tier available.

**Setup:**

1. Create account at https://resend.com
2. Get API key from dashboard
3. Add to `.env.local`:
   ```
   RESEND_API_KEY="re_1234567890abcdef"
   ```

**Verified Sender Domain:**
- Default: `noreply@familywealthcustodians.co.za`
- You'll need to verify this domain in Resend dashboard
- Or use Resend's sandbox: `onboarding@resend.dev`

**Implementation:** The code already supports Resend. Just add your API key and it works.

---

### Option 2: SendGrid

**Why:** Industry standard, excellent templates, advanced features.

**Setup:**

1. Create account at https://sendgrid.com
2. Go to Settings → API Keys
3. Create new key with "Mail Send" permission
4. Add to `.env.local`:
   ```
   SENDGRID_API_KEY="SG.1234567890abcdef"
   ```

**Verified Sender:**
- Create sender in Settings → Sender Authentication
- Use: `noreply@familywealthcustodians.co.za`

**Implementation:** Already supported in `lib/email-service.ts`

---

### Option 3: SMTP (Gmail, Outlook, etc.)

For development/testing with your own email:

```
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

**Note:** Requires additional implementation. Basic template provided in email-service.ts.

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
# Email service choice
RESEND_API_KEY="your-key-here"

# Email configuration
NEXT_PUBLIC_SENDER_EMAIL="noreply@familywealthcustodians.co.za"
NEXT_PUBLIC_ADMIN_EMAIL="info@familywealthcustodians.co.za"

# Database
DATABASE_URL="postgresql://..."

# Calendar (Phase 3.2)
# CALCOM_API_KEY="..."
# ZOOM_CLIENT_ID="..."
```

---

## Testing Email Sending

### Development Mode

In development (no API key configured), emails are logged to console:

```
[EMAIL DEBUG] {
  to: "client@example.com",
  subject: "Your Exploration Call is Confirmed...",
  from: "noreply@familywealthcustodians.co.za"
}
```

### Production Testing

1. **Test with Real Email:**
   ```bash
   curl -X POST http://localhost:3005/api/bookings/confirm \
     -H "Content-Type: application/json" \
     -d '{
       "fullName": "Test User",
       "email": "your-email@example.com",
       "phone": "+27123456789",
       "country": "za",
       "services": ["estate", "retirement"],
       "goal": "Test goal",
       "preferredDate": "2025-06-20",
       "preferredTime": "14:00"
     }'
   ```

2. **Check Email Logs:**
   - Resend: https://resend.com/dashboard (view sent emails)
   - SendGrid: https://sendgrid.com/solutions/email-api/v3-ui-mail-send

---

## Email Templates

### Files

- `lib/email-templates.tsx` - React components for each email type
- `lib/email-service.ts` - Service layer for sending

### Template Types

1. **BookingConfirmationEmail**
   - Sent: Immediately after booking
   - Recipients: Client + Admin
   - Contains: Call details, Zoom link (when available)

2. **BookingReminderEmail**
   - Sent: 24 hours before call
   - Recipients: Client only
   - Contains: Quick details + join link

3. **BookingFollowUpEmail**
   - Sent: After call completion
   - Recipients: Client only
   - Contains: Next steps, resources

---

## Scheduling Reminder Emails

Currently, the reminder email scheduling is a placeholder. To implement:

### Option A: Cron Job (Simple)

Use a service like EasyCron or your server's cron:

```bash
# Every hour, check for bookings happening in 24 hours
0 * * * * curl http://localhost:3005/api/bookings/send-reminders
```

### Option B: Job Queue (Recommended)

Use Bull or Agenda with Redis/MongoDB:

```typescript
import Queue from 'bull';

const emailQueue = new Queue('email-reminders', process.env.REDIS_URL);

// When booking is created
await emailQueue.add(
  { bookingId },
  {
    delay: calculateDelay(bookingDate - 24 hours),
    attempts: 3,
  }
);
```

### Option C: Resend Scheduled Emails

Resend has a scheduled email feature (enterprise). Contact Resend for pricing.

---

## Email Deliverability

### Domain Setup (Important!)

1. **SPF Record:**
   ```
   TXT v=spf1 include:resend.com ~all
   ```

2. **DKIM:** Resend auto-configures
3. **DMARC:** Add DMARC policy
   ```
   TXT v=DMARC1; p=quarantine; rua=mailto:admin@familywealthcustodians.co.za
   ```

**Without these, emails may go to spam.**

---

## Monitoring & Analytics

### Resend Dashboard
- View sent/failed emails
- Click tracking
- Bounce rates
- Webhook logs

### SendGrid Dashboard
- Detailed delivery analytics
- Click-through rates
- Spam score

### Email Status in DB

Query booking status:
```sql
SELECT email, status, confirmationSentAt, reminderSentAt FROM Booking
WHERE email = 'client@example.com';
```

---

## Common Issues

### Emails Going to Spam

**Solution:**
- ✅ Set up SPF/DKIM/DMARC
- ✅ Use authentication (Resend/SendGrid handles this)
- ✅ Verify sender domain
- ✅ Test with MailTester: https://mailtester.com

### API Key Not Working

**Check:**
```bash
# In development, confirm env var is loaded
echo $RESEND_API_KEY

# In production, verify in hosting provider's env vars
```

### Booking Not Saving

**Solution:**
- Verify DATABASE_URL is correct
- Run Prisma migrations: `npx prisma migrate dev`
- Check database logs

### Email Template Not Rendering

**Solution:**
- React components must render valid HTML
- Test template: `npm run test:email`
- Check for missing props in email component calls

---

## Next Steps

1. **Choose email service** (Resend recommended)
2. **Set up domain authentication** (SPF/DKIM/DMARC)
3. **Add API key to .env.local**
4. **Test booking flow** with test email
5. **Monitor delivery** in service dashboard
6. **Implement reminder scheduling** (Phase 3.2)

---

## Additional Resources

- Resend Docs: https://resend.com/docs
- SendGrid Docs: https://sendgrid.com/docs
- Email Authentication Guide: https://postmark.com/guides/spf-dkim-dmarc
- Transactional Email Best Practices: https://www.campaignmonitor.com/resources/knowledge-base/

