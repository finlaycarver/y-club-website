import { NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/email-provider";
import { isHoneypotFilled, rateLimit, rejectLargeRequest } from "@/lib/api-guards";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const sizeError = rejectLargeRequest(req);
    if (sizeError) return sizeError;

    const limitError = rateLimit(req, "newsletter", 8, 60_000);
    if (limitError) return limitError;

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    if (isHoneypotFilled(body)) {
      return NextResponse.json({ ok: true });
    }

    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const source = typeof body?.source === "string" ? body.source : "unknown";

    await subscribeToNewsletter({ email, source });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = process.env.NODE_ENV === "production"
      ? "Subscription failed"
      : err instanceof Error ? err.message : "Subscription failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
