import { NextResponse } from "next/server";
import { sendVenueHireEnquiry, type VenueHireEnquiry } from "@/lib/email-provider";

export const runtime = "nodejs";

function pickString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

    // Honeypot — bots fill this hidden field; humans don't
    if (typeof body?.company === "string" && body.company.length > 0) {
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
    const message = err instanceof Error ? err.message : "Enquiry failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
