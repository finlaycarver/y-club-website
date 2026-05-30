import { BRAND } from "@/lib/site";

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

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function enquiriesInbox(): string {
  return process.env.ENQUIRIES_INBOX || BRAND.email;
}

function fromAddress(): string {
  return process.env.EMAIL_FROM || "Y Guildford <onboarding@resend.dev>";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function rows(data: Record<string, string | undefined>): string {
  return Object.entries(data)
    .filter(([, value]) => value && value.trim().length > 0)
    .map(([label, value]) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;color:#555;font-weight:600;">${escapeHtml(label)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;color:#111;">${escapeHtml(value ?? "")}</td>
      </tr>
    `)
    .join("");
}

async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.VERCEL_ENV === "production") {
      throw new Error("Email provider is not configured");
    }
    console.info("[email:dry-run]", {
      to,
      subject,
      replyTo,
      receivedAt: new Date().toISOString(),
    });
    return;
  }

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress(),
      to,
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Email provider failed (${res.status})${body ? `: ${body}` : ""}`);
  }
}

export async function subscribeToNewsletter(payload: NewsletterPayload): Promise<void> {
  if (!payload.email || !isEmail(payload.email)) {
    throw new Error("Invalid email address");
  }
  await sendEmail({
    to: enquiriesInbox(),
    subject: "New Y newsletter signup",
    replyTo: payload.email,
    html: `
      <h1 style="font-family:Arial,sans-serif;font-size:20px;">New newsletter signup</h1>
      <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
        ${rows({
          Email: payload.email,
          Source: payload.source,
        })}
      </table>
    `,
  });
}

export async function registerMember(payload: MemberSignupPayload): Promise<void> {
  if (!payload.email || !isEmail(payload.email)) {
    throw new Error("Invalid email address");
  }
  await sendEmail({
    to: enquiriesInbox(),
    subject: "New Y member signup",
    replyTo: payload.email,
    html: `
      <h1 style="font-family:Arial,sans-serif;font-size:20px;">New member signup</h1>
      <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
        ${rows({ Email: payload.email })}
      </table>
    `,
  });
  await sendEmail({
    to: payload.email,
    subject: "Welcome to Y Members",
    html: `
      <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#111;">
        <h1 style="font-size:22px;">You're in.</h1>
        <p>Thanks for joining Y Members. Show this email at the bar to unlock member perks.</p>
        <p>We'll send monthly drink offers and event drops to this address.</p>
      </div>
    `,
  });
}

export async function sendVenueHireEnquiry(payload: VenueHireEnquiry): Promise<void> {
  if (!payload.name || !payload.email || !payload.eventType) {
    throw new Error("Name, email and event type are required");
  }
  if (!isEmail(payload.email)) {
    throw new Error("Invalid email address");
  }
  await sendEmail({
    to: enquiriesInbox(),
    subject: `Venue hire enquiry: ${payload.eventType}`,
    replyTo: payload.email,
    html: `
      <h1 style="font-family:Arial,sans-serif;font-size:20px;">New venue hire enquiry</h1>
      <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
        ${rows({
          Name: payload.name,
          Email: payload.email,
          Phone: payload.phone,
          "Event type": payload.eventType,
          "Preferred venue": payload.preferredVenue,
          Date: payload.date,
          Guests: payload.guests,
          Message: payload.message,
        })}
      </table>
    `,
  });
}
