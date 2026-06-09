/**
 * Analytics Service for Family Wealth Custodians
 * Tracks booking funnel, user behavior, and conversion metrics
 * Integrates with Google Analytics, Mixpanel, Sentry
 */

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, string | number | boolean>;
  timestamp?: Date;
}

export interface FunnelStep {
  step: string;
  count: number;
  conversionRate: number;
}

export interface ConversionMetrics {
  totalVisitors: number;
  bookingPageViews: number;
  bookingsStarted: number;
  bookingsCompleted: number;
  bookingConversionRate: number; // completions / views
  averageTimeToComplete: number; // milliseconds
}

export type AnalyticsProvider = 'google-analytics' | 'mixpanel' | 'mock';

/**
 * Track a custom event
 */
export function trackEvent(event: AnalyticsEvent): void {
  try {
    const provider = getAnalyticsProvider();

    switch (provider) {
      case 'google-analytics':
        trackGoogleAnalytics(event);
        break;
      case 'mixpanel':
        trackMixpanel(event);
        break;
      default:
        console.log('[ANALYTICS]', event);
    }
  } catch (error) {
    console.error('[ANALYTICS ERROR]', error);
  }
}

/**
 * Booking Funnel Events
 */

export function trackBookingPageView(): void {
  trackEvent({
    event: 'booking_page_view',
    properties: {
      page: '/book-call',
    },
  });
}

export function trackBookingStep1View(): void {
  trackEvent({
    event: 'booking_step1_view',
    properties: {
      step: 1,
    },
  });
}

export function trackBookingStep2View(): void {
  trackEvent({
    event: 'booking_step2_view',
    properties: {
      step: 2,
    },
  });
}

export function trackBookingStep1Complete(data: { services: string[] }): void {
  trackEvent({
    event: 'booking_step1_complete',
    properties: {
      step: 1,
      servicesCount: data.services.length,
      services: data.services.join(','),
    },
  });
}

export function trackBookingStep2Complete(data: { date: string; time: string }): void {
  trackEvent({
    event: 'booking_step2_complete',
    properties: {
      step: 2,
      date: data.date,
      time: data.time,
    },
  });
}

export function trackBookingSubmit(): void {
  trackEvent({
    event: 'booking_submit',
    properties: {
      timestamp: Date.now(),
    },
  });
}

export function trackBookingSuccess(data: { email: string; date: string }): void {
  trackEvent({
    event: 'booking_success',
    properties: {
      email: hashEmail(data.email), // Don't send raw email
      date: data.date,
    },
  });
}

export function trackBookingError(error: string): void {
  trackEvent({
    event: 'booking_error',
    properties: {
      error,
    },
  });
}

export function trackBookingAbandonment(step: number): void {
  trackEvent({
    event: 'booking_abandonment',
    properties: {
      lastStep: step,
    },
  });
}

/**
 * Service Interest Tracking
 */

export function trackServiceInterest(services: string[]): void {
  trackEvent({
    event: 'service_interest',
    properties: {
      services: services.join(','),
      count: services.length,
    },
  });
}

/**
 * Page & Navigation Events
 */

export function trackPageView(pageName: string, path: string): void {
  trackEvent({
    event: 'page_view',
    properties: {
      page: pageName,
      path,
    },
  });
}

export function trackCTAClick(ctaText: string, location: string): void {
  trackEvent({
    event: 'cta_click',
    properties: {
      text: ctaText,
      location,
    },
  });
}

export function trackNavClick(navItem: string): void {
  trackEvent({
    event: 'nav_click',
    properties: {
      item: navItem,
    },
  });
}

/**
 * Error Tracking (Sentry)
 */

export function trackError(error: Error, context?: Record<string, any>): void {
  try {
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, { extra: context });
    } else {
      console.error('[ERROR TRACKING]', error, context);
    }
  } catch (e) {
    console.error('[ERROR TRACKING FAILED]', e);
  }
}

/**
 * Google Analytics Integration
 */

function trackGoogleAnalytics(event: AnalyticsEvent): void {
  try {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.event, {
        ...event.properties,
        timestamp: event.timestamp || new Date(),
      });
    }
  } catch (error) {
    console.error('[GOOGLE ANALYTICS] Error:', error);
  }
}

/**
 * Mixpanel Integration
 */

function trackMixpanel(event: AnalyticsEvent): void {
  try {
    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      (window as any).mixpanel.track(event.event, {
        ...event.properties,
        timestamp: event.timestamp || new Date(),
      });
    }
  } catch (error) {
    console.error('[MIXPANEL] Error:', error);
  }
}

/**
 * Analytics Query API (Backend)
 */

export async function getConversionMetrics(): Promise<ConversionMetrics> {
  try {
    const response = await fetch('/api/analytics/conversion-metrics');

    if (!response.ok) {
      throw new Error('Failed to fetch conversion metrics');
    }

    return (await response.json()) as ConversionMetrics;
  } catch (error) {
    console.error('[ANALYTICS] Failed to get metrics:', error);
    return {
      totalVisitors: 0,
      bookingPageViews: 0,
      bookingsStarted: 0,
      bookingsCompleted: 0,
      bookingConversionRate: 0,
      averageTimeToComplete: 0,
    };
  }
}

export async function getFunnelAnalytics(): Promise<FunnelStep[]> {
  try {
    const response = await fetch('/api/analytics/funnel');

    if (!response.ok) {
      throw new Error('Failed to fetch funnel analytics');
    }

    return (await response.json()) as FunnelStep[];
  } catch (error) {
    console.error('[ANALYTICS] Failed to get funnel:', error);
    return [];
  }
}

/**
 * Utility Functions
 */

function getAnalyticsProvider(): AnalyticsProvider {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_GA_ID) {
    return 'google-analytics';
  }
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    return 'mixpanel';
  }
  return 'mock';
}

function hashEmail(email: string): string {
  // Simple hash for privacy - don't send raw email
  return email.substring(0, 2) + '***' + email.substring(email.indexOf('@') - 2);
}

/**
 * Initialize Analytics
 * Call this on app startup
 */
export function initializeAnalytics(): void {
  // Google Analytics
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_ID) {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
    script.async = true;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(arguments);
    }
    (window as any).gtag = gtag;
    gtag('js', new Date());
    gtag('config', process.env.NEXT_PUBLIC_GA_ID);
  }

  // Mixpanel
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    const script = document.createElement('script');
    script.text = `(function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!=typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"undefined"!=typeof d&&"mixpanel"!=d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_tracking_cookie clear_opt_out_tracking_cookie".split(" ");for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!=typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f)}})(document,window.mixpanel||[]);`;
    document.head.appendChild(script);

    (window as any).mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);
  }

  // Sentry
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    const script = document.createElement('script');
    script.src = 'https://browser.sentry-cdn.com/7.0.0/bundle.min.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      (window as any).Sentry?.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV,
      });
    };
  }
}
