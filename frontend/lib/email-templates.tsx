/**
 * Email Templates for Family Wealth Custodians
 * These are React components that render HTML emails
 * Can be used with Resend, SendGrid, or other email services
 */

interface BookingConfirmationProps {
  clientName: string;
  email: string;
  date: string;
  time: string;
  advisorName: string;
  zoomLink?: string;
}

export function BookingConfirmationEmail({
  clientName,
  email,
  date,
  time,
  advisorName,
  zoomLink,
}: BookingConfirmationProps) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#F9F8F5', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#FFFFFF' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#1A2332', color: '#F9F8F5', padding: '40px', textAlign: 'center' }}>
          <h1 style={{ margin: '0', fontSize: '32px', fontFamily: 'Playfair Display, serif', fontWeight: '700' }}>
            Family Wealth Custodians
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: '0.9' }}>
            Your Exploration Call is Confirmed
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '24px', color: '#1A2332', marginTop: '0', fontFamily: 'Playfair Display, serif' }}>
            {`Hi ${clientName},`}
          </h2>

          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1A1A1A', marginBottom: '24px' }}>
            {`Thank you for scheduling your exploration call! We're excited to discuss your family's wealth management goals.`}
          </p>

          {/* Details Box */}
          <div
            style={{
              backgroundColor: '#EFEBE6',
              border: '1px solid #D4C4B8',
              borderRadius: '6px',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A2332', margin: '0 0 16px 0' }}>
              Call Details
            </h3>

            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#B0B0B0', margin: '0 0 4px 0', fontWeight: '500' }}>
                  DATE
                </p>
                <p style={{ fontSize: '16px', color: '#1A1A1A', margin: '0', fontWeight: '500' }}>{date}</p>
              </div>

              <div>
                <p style={{ fontSize: '12px', color: '#B0B0B0', margin: '0 0 4px 0', fontWeight: '500' }}>
                  TIME
                </p>
                <p style={{ fontSize: '16px', color: '#1A1A1A', margin: '0', fontWeight: '500' }}>
                  {time} SAST (South African Standard Time)
                </p>
              </div>

              <div>
                <p style={{ fontSize: '12px', color: '#B0B0B0', margin: '0 0 4px 0', fontWeight: '500' }}>
                  ADVISOR
                </p>
                <p style={{ fontSize: '16px', color: '#1A1A1A', margin: '0', fontWeight: '500' }}>{advisorName}</p>
              </div>

              <div>
                <p style={{ fontSize: '12px', color: '#B0B0B0', margin: '0 0 4px 0', fontWeight: '500' }}>
                  DURATION
                </p>
                <p style={{ fontSize: '16px', color: '#1A1A1A', margin: '0' }}>30 minutes • Zoom Video Call</p>
              </div>
            </div>
          </div>

          {/* Join Button */}
          {zoomLink && (
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <a
                href={zoomLink}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#1A2332',
                  color: '#F9F8F5',
                  padding: '16px 32px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '16px',
                  transition: 'background-color 200ms',
                }}
              >
                Join Your Zoom Call
              </a>
            </div>
          )}

          {/* Preparation Tips */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A2332', marginTop: '0', marginBottom: '12px' }}>
              Before Your Call
            </h3>
            <ul style={{ fontSize: '14px', lineHeight: '1.8', color: '#1A1A1A', paddingLeft: '20px', margin: '0' }}>
              <li>Have a quiet, private space ready</li>
              <li>Consider your primary wealth concerns or goals</li>
              <li>Gather any relevant documents (optional)</li>
              <li>Test your internet connection beforehand</li>
            </ul>
          </div>

          {/* Support */}
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666666', marginBottom: '32px' }}>
            Questions before your call? {`Don't`} hesitate to reach out:
          </p>

          <div
            style={{
              backgroundColor: '#F5F3F0',
              border: '1px solid #E0DCD7',
              borderRadius: '6px',
              padding: '16px',
              marginBottom: '32px',
              fontSize: '14px',
              color: '#1A1A1A',
            }}
          >
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Phone:</strong> +27 (0)21 888 3388
            </p>
            <p style={{ margin: '0' }}>
              <strong>Email:</strong> info@familywealthcustodians.co.za
            </p>
          </div>

          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#1A1A1A', marginTop: '32px', marginBottom: '0' }}>
            {`We're`} looking forward to speaking with you.
          </p>

          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#1A1A1A', marginTop: '8px', marginBottom: '0' }}>
            Best regards,
            <br />
            <strong>The Family Wealth Custodians Team</strong>
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: '#1A2332',
            color: '#F9F8F5',
            padding: '32px 40px',
            textAlign: 'center',
            fontSize: '12px',
            borderTop: '1px solid #E0DCD7',
          }}
        >
          <p style={{ margin: '0 0 8px 0', opacity: '0.9' }}>
            © 2025 Family Wealth Custodians. All rights reserved.
          </p>
          <p style={{ margin: '0', opacity: '0.7' }}>
            Paarl, South Africa | +27 (0)21 888 3388 | info@familywealthcustodians.co.za
          </p>
        </div>
      </div>
    </div>
  );
}

interface ReminderEmailProps {
  clientName: string;
  date: string;
  time: string;
  advisorName: string;
  zoomLink: string;
  hoursUntilCall: number;
}

export function BookingReminderEmail({
  clientName,
  date,
  time,
  advisorName,
  zoomLink,
  hoursUntilCall,
}: ReminderEmailProps) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#F9F8F5', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#FFFFFF' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#A89968', color: '#F9F8F5', padding: '32px 40px', textAlign: 'center' }}>
          <h1 style={{ margin: '0', fontSize: '28px', fontFamily: 'Playfair Display, serif', fontWeight: '700' }}>
            {`Your Call is ${hoursUntilCall === 24 ? 'Tomorrow' : 'Today'}!`}
          </h1>
        </div>

        {/* Content */}
        <div style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '22px', color: '#1A2332', marginTop: '0', fontFamily: 'Playfair Display, serif' }}>
            {`Hi ${clientName},`}
          </h2>

          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1A1A1A', marginBottom: '24px' }}>
            Just a friendly reminder that your exploration call with {advisorName} is coming up!
          </p>

          {/* Quick Details */}
          <div style={{ backgroundColor: '#EFEBE6', padding: '20px', borderRadius: '6px', marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', color: '#1A1A1A', margin: '0 0 8px 0' }}>
              <strong>{date}</strong> at <strong>{time} SAST</strong>
            </p>
            <p style={{ fontSize: '14px', color: '#666666', margin: '0' }}>30-minute Zoom call</p>
          </div>

          {/* Join Button */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <a
              href={zoomLink}
              style={{
                display: 'inline-block',
                backgroundColor: '#1A2332',
                color: '#F9F8F5',
                padding: '14px 28px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px',
              }}
            >
              Click Here to Join
            </a>
          </div>

          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666666', marginBottom: '24px' }}>
            See you soon! If you need to reschedule, please contact us at info@familywealthcustodians.co.za or +27 (0)21 888 3388.
          </p>

          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#1A1A1A' }}>
            Best,
            <br />
            The FWC Team
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: '#1A2332',
            color: '#F9F8F5',
            padding: '24px 40px',
            textAlign: 'center',
            fontSize: '11px',
            opacity: '0.8',
          }}
        >
          <p style={{ margin: '0' }}>Family Wealth Custodians | Paarl, South Africa</p>
        </div>
      </div>
    </div>
  );
}

interface FollowUpEmailProps {
  clientName: string;
  advisorName: string;
}

export function BookingFollowUpEmail({ clientName, advisorName }: FollowUpEmailProps) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#F9F8F5', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#FFFFFF' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#1A2332', color: '#F9F8F5', padding: '40px', textAlign: 'center' }}>
          <h1 style={{ margin: '0', fontSize: '28px', fontFamily: 'Playfair Display, serif', fontWeight: '700' }}>
            Thank You!
          </h1>
        </div>

        {/* Content */}
        <div style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '22px', color: '#1A2332', marginTop: '0', fontFamily: 'Playfair Display, serif' }}>
            {`We Appreciated Speaking with You, ${clientName}`}
          </h2>

          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#1A1A1A', marginBottom: '24px' }}>
            Thank you for taking the time to meet with {advisorName}. {`We're`} excited about the possibility of working together to build and protect your family{`'`}s wealth.
          </p>

          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A2332', marginTop: '32px', marginBottom: '12px' }}>
            Next Steps
          </h3>

          <ol style={{ fontSize: '16px', lineHeight: '1.8', color: '#1A1A1A', paddingLeft: '20px', margin: '0' }}>
            <li>{advisorName} will send you a detailed proposal within 2 business days</li>
            <li>Review the proposal and reach out with any questions</li>
            <li>{`We'll`} schedule a follow-up call to discuss next steps</li>
          </ol>

          {/* Resources */}
          <div style={{ backgroundColor: '#EFEBE6', padding: '24px', borderRadius: '6px', marginTop: '32px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1A2332', marginTop: '0' }}>
              Resources to Explore
            </h3>
            <ul style={{ fontSize: '14px', lineHeight: '1.8', color: '#1A1A1A', paddingLeft: '20px', margin: '12px 0 0 0' }}>
              <li>
                <a href="https://familywealthcustodians.co.za/insights" style={{ color: '#5A7A8A', textDecoration: 'none' }}>
                  Read Our Latest Insights
                </a>
              </li>
              <li>
                <a href="https://familywealthcustodians.co.za/services" style={{ color: '#5A7A8A', textDecoration: 'none' }}>
                  Learn More About Our Services
                </a>
              </li>
            </ul>
          </div>

          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666666', marginTop: '32px', marginBottom: '0' }}>
            Questions in the meantime? Feel free to reach out anytime.
          </p>

          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#1A1A1A', marginTop: '24px', marginBottom: '0' }}>
            {`We're`} here to help,
            <br />
            <strong>The Family Wealth Custodians Team</strong>
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: '#1A2332',
            color: '#F9F8F5',
            padding: '32px 40px',
            textAlign: 'center',
            fontSize: '12px',
          }}
        >
          <p style={{ margin: '0 0 8px 0', opacity: '0.9' }}>
            © 2025 Family Wealth Custodians
          </p>
          <p style={{ margin: '0', fontSize: '11px', opacity: '0.7' }}>
            info@familywealthcustodians.co.za | +27 (0)21 888 3388
          </p>
        </div>
      </div>
    </div>
  );
}
