# Phase 3: Complete Integration Guide

## Overview

Phase 3 completes the wealth management booking system with four critical integrations:

1. **Phase 3.1: Email Integration** ✅ (Booking confirmations & reminders)
2. **Phase 3.2: Calendar & Zoom** (Advisor scheduling & meeting links)
3. **Phase 3.3: CRM Sync** (Salesforce/HubSpot lead management)
4. **Phase 3.4: Analytics** (Conversion funnel tracking)

---

## Phase 3.2: Calendar & Zoom Integration

### Overview
Connects advisor calendars to the booking system and generates Zoom meeting links.

### Supported Providers

#### Cal.com (Recommended)
- **Ease:** Easy - simple API, UI for managing availability
- **Cost:** Free tier available
- **Setup:** https://cal.com/docs

```bash
# .env.local
CALCOM_API_KEY="your-key"
CALCOM_EVENT_TYPE_ID="your-event-id"
```

#### Calendly
- **Ease:** Easy - embedded widget or API
- **Cost:** Paid plans ($12+/month)
- **Setup:** https://developer.calendly.com

```bash
CALENDLY_API_TOKEN="your-token"
CALENDLY_EVENT_TYPE_UUID="your-uuid"
```

#### Google Calendar
- **Ease:** Medium - requires OAuth setup
- **Cost:** Free
- **Setup:** Google Cloud Console

```bash
GOOGLE_CALENDAR_ID="your-calendar-id@gmail.com"
GOOGLE_CALENDAR_API_KEY="your-api-key"
```

### Zoom Setup

1. Create Zoom app at https://marketplace.zoom.us/develop/create
2. Get credentials:
   ```bash
   ZOOM_ACCOUNT_ID="your-account-id"
   ZOOM_CLIENT_ID="your-client-id"
   ZOOM_CLIENT_SECRET="your-secret"
   ```
3. Test meeting creation with `POST /api/calendar/availability`

### Implementation

**API Endpoints:**
- `GET /api/calendar/availability` - Get available time slots
- Used by booking form for date/time picker

**Flow:**
```
User Books Call
    ↓
GET /api/calendar/availability (gets free slots)
    ↓
User Selects Date + Time
    ↓
POST /api/bookings/confirm
    ├─→ Create Zoom meeting (createZoomMeeting)
    ├─→ Add to calendar (createCalcomEvent, etc.)
    ├─→ Send confirmation email with Zoom link
    └─→ Return to user
```

**Key Functions:**
- `getAvailableTimeSlots()` - Fetch free slots for next 30 days
- `createZoomMeeting()` - Generate Zoom meeting link
- `createBookingEvent()` - Add event to advisor calendar

---

## Phase 3.3: CRM Integration

### Overview
Syncs new bookings to CRM as leads and creates sales opportunities.

### Supported CRMs

#### Salesforce
- **For:** Enterprise sales teams
- **Cost:** $165+/month
- **Setup:** https://developer.salesforce.com

```bash
SALESFORCE_INSTANCE_URL="https://your-instance.salesforce.com"
SALESFORCE_CLIENT_ID="your-client-id"
SALESFORCE_CLIENT_SECRET="your-secret"
SALESFORCE_USERNAME="your-username"
SALESFORCE_PASSWORD="your-password"
```

**What Gets Synced:**
- Lead record with contact details
- Description: Services interested + wealth goal
- Opportunity for sales pipeline

#### HubSpot
- **For:** SMBs and growing companies
- **Cost:** Free tier, paid from $45/month
- **Setup:** https://developers.hubspot.com

```bash
HUBSPOT_API_KEY="pat-na1-your-key"
HUBSPOT_PORTAL_ID="your-portal-id"
```

**What Gets Synced:**
- Contact record
- Tags for service interests
- Deal in pipeline
- Activity timeline

### Implementation

**API Flow:**
```
POST /api/bookings/confirm
    ↓
Save booking to database
    ├─→ Call syncBookingToCrm() (Phase 3.1 updated)
    ├─→ Creates Lead in Salesforce or HubSpot
    ├─→ Tags with service interests
    └─→ Creates Opportunity
```

**Key Functions:**
- `syncBookingToCrm()` - Create/update lead
- `createBookingOpportunity()` - Create sales opportunity
- `addHubSpotTags()` - Tag for automation

### Recommended Setup

**Salesforce:**
1. Create custom Lead fields for services/goal
2. Create Lead assignment rules
3. Set up automatic Opportunity creation

**HubSpot:**
1. Create custom contact properties
2. Set up workflows for new leads
3. Create deal pipeline stages

---

## Phase 3.4: Analytics & Monitoring

### Overview
Tracks booking funnel, user behavior, and conversion metrics.

### Supported Platforms

#### Google Analytics (Recommended)
- **Free**
- **Setup:** https://analytics.google.com

```bash
NEXT_PUBLIC_GA_ID="GA-YOUR-ID"
```

**Track:**
- Booking page views
- Funnel abandonment
- Service interests
- Form completion time

#### Mixpanel
- **Paid:** $995+/month
- **Setup:** https://mixpanel.com

```bash
NEXT_PUBLIC_MIXPANEL_TOKEN="your-token"
```

**Advantages:** Custom funnels, cohort analysis, A/B testing

#### Sentry (Error Tracking)
- **Free tier available**
- **Setup:** https://sentry.io

```bash
NEXT_PUBLIC_SENTRY_DSN="your-dsn"
```

**Tracks:** JS errors, form validation failures, API errors

### Booking Funnel Events

```
Page View (/book-call)
    ↓ (tracked: booking_page_view)
Step 1 View
    ↓ (tracked: booking_step1_view)
Select Services + Goal
    ↓ (tracked: booking_step1_complete)
Step 2 View
    ↓ (tracked: booking_step2_view)
Select Date + Time
    ↓ (tracked: booking_step2_complete)
Submit Form
    ↓ (tracked: booking_submit)
Success / Error
    ↓ (tracked: booking_success / booking_error)
```

### Dashboard Metrics

Query via `/api/analytics/conversion-metrics`:
```json
{
  "totalVisitors": 15234,
  "bookingPageViews": 2341,
  "bookingsStarted": 567,
  "bookingsCompleted": 89,
  "bookingConversionRate": 3.8,
  "averageTimeToComplete": 342000
}
```

---

## Integration Checklist

### Phase 3.2: Calendar

- [ ] Choose calendar provider (Cal.com recommended)
- [ ] Create account and get API key
- [ ] Add API key to .env.local
- [ ] Choose Zoom setup (OAuth or direct API)
- [ ] Create Zoom app and get credentials
- [ ] Test booking flow with calendar integration
- [ ] Verify Zoom links work in confirmation email

### Phase 3.3: CRM

- [ ] Choose CRM (Salesforce or HubSpot)
- [ ] Create account
- [ ] Get API credentials
- [ ] Add to .env.local
- [ ] Test lead creation from booking
- [ ] Set up automation/workflows in CRM
- [ ] Verify opportunity pipeline works

### Phase 3.4: Analytics

- [ ] Choose analytics provider (Google Analytics recommended)
- [ ] Create account and property
- [ ] Add tracking code
- [ ] Test tracking on booking flow
- [ ] Set up goals/funnels in analytics dashboard
- [ ] Monitor conversion metrics daily

---

## Testing Each Integration

### Calendar
```bash
# Test availability endpoint
curl "http://localhost:3005/api/calendar/availability?daysAhead=30"

# Should return available slots for next 30 days
```

### CRM
```bash
# Make a booking - should sync to CRM
curl -X POST http://localhost:3005/api/bookings/confirm \
  -H "Content-Type: application/json" \
  -d '{...booking data...}'

# Check CRM dashboard for new lead
```

### Analytics
```javascript
// In browser console
window.gtag?.('event', 'test_event', { test: true });

// Check Google Analytics Real Time report
// Should see event within 60 seconds
```

---

## Monitoring & Troubleshooting

### Email (Phase 3.1)
- Check email delivery: `https://resend.com/dashboard` or `https://sendgrid.com/statistics`
- Verify sender domain DNS records
- Check error logs for failed sends

### Calendar (Phase 3.2)
- Cal.com: Check available slots in UI
- Zoom: Check meeting created in zoom.us/signin
- Look for "zoomLink" in booking confirmation emails

### CRM (Phase 3.3)
- Salesforce: Check Leads section in Setup
- HubSpot: Check Contacts + Deals pages
- Verify custom fields are mapping correctly

### Analytics (Phase 3.4)
- Google Analytics: Real Time → Events
- Check booking_page_view within 1 minute of page visit
- Monitor conversion funnel for drop-off points

---

## Next Steps

1. **This Week:**
   - [ ] Set up Cal.com for advisor scheduling
   - [ ] Configure Zoom API
   - [ ] Test booking → calendar → email flow

2. **Next Week:**
   - [ ] Integrate Salesforce or HubSpot
   - [ ] Set up CRM workflows/automation
   - [ ] Configure Google Analytics

3. **Ongoing:**
   - [ ] Monitor conversion metrics daily
   - [ ] Optimize booking form based on funnel data
   - [ ] Adjust CRM pipeline stages based on advisor feedback

---

## Support & Resources

- **Calendar:** https://cal.com/docs
- **Zoom:** https://developers.zoom.com/docs/api/
- **Salesforce:** https://developer.salesforce.com/
- **HubSpot:** https://developers.hubspot.com/
- **Google Analytics:** https://support.google.com/analytics
- **Email:** See `docs/EMAIL_INTEGRATION.md`

