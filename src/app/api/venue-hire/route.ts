import { NextResponse } from "next/server";
import { sendVenueHireEnquiry, type VenueHireEnquiry } from "@/lib/email-provider";
import { isHoneypotFilled, rateLimit, rejectLargeRequest } from "@/lib/api-guards";

export const runtime = "nodejs";

function pickString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: Request) {
  try {
    const sizeError = rejectLargeRequest(req);
    if (sizeError) return sizeError;

    const limitError = rateLimit(req, "venue-hire", 5, 60_000);
    if (limitError) return limitError;

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

    // Honeypot — bots fill this hidden field; humans don't
    if (isHoneypotFilled(body)) {
      return NextResponse.json({ ok: true }); // silently accept then drop
    }

    const enquiry: VenueHireEnquiry = {
      name: pickString(body.name),
      email: pickString(body.email),
      phone: pickString(body.phone),
      eventType: pickString(body.eventType),
      preferredVenue: pickString(body.preferredVenue),
      date: pickString(body.date),
      guests: pickString(body.guests),
      message: pickString(body.message),
    };

    await sendVenueHireEnquiry(enquiry);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = process.env.NODE_ENV === "production"
      ? "Enquiry failed"
      : err instanceof Error ? err.message : "Enquiry failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
