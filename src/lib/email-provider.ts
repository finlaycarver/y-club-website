/**
 * Email-provider stub. Logs submissions server-side and returns success.
 *
 * Wire to a real provider (Resend / Mailchimp / Brevo) by replacing the
 * implementations below and reading API keys from env. Each function
 * should throw on real failure so the API route returns a 4xx/5xx.
 */

export interface NewsletterPayload {
  email: string;
  source: string; // e.g. "footer", "members-page"
}

export interface MemberSignupPayload {
  email: string;
}

export interface VenueHireEnquiry {
  name: string;
  email: string;
  phone?: string;
  eventType: string;
  preferredVenue?: string;
  date?: string;
  guests?: string;
  message?: string;
}

const isEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function subscribeToNewsletter(payload: NewsletterPayload): Promise<void> {
  if (!payload.email || !isEmail(payload.email)) {
    throw new Error("Invalid email address");
  }
  // TODO(fin): replace with Resend / Mailchimp call
  console.info("[newsletter]", {
    email: payload.email,
    source: payload.source,
    receivedAt: new Date().toISOString(),
  });
}

export async function registerMember(payload: MemberSignupPayload): Promise<void> {
  if (!payload.email || !isEmail(payload.email)) {
    throw new Error("Invalid email address");
  }
  // TODO(fin): create member record in CRM / send welcome email
  console.info("[members:signup]", {
    email: payload.email,
    receivedAt: new Date().toISOString(),
  });
}

export async function sendVenueHireEnquiry(payload: VenueHireEnquiry): Promise<void> {
  if (!payload.name || !payload.email || !payload.eventType) {
    throw new Error("Name, email and event type are required");
  }
  if (!isEmail(payload.email)) {
    throw new Error("Invalid email address");
  }
  // TODO(fin): forward to barmanager@dreamoyster.com via Resend / SES
  console.info("[venue-hire:enquiry]", {
    ...payload,
    receivedAt: new Date().toISOString(),
  });
}
