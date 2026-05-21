import { NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/email-provider";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const source = typeof body?.source === "string" ? body.source : "unknown";

    await subscribeToNewsletter({ email, source });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Subscription failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
