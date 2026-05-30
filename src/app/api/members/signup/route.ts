import { NextResponse } from "next/server";
import { registerMember } from "@/lib/email-provider";
import { isHoneypotFilled, rateLimit, rejectLargeRequest } from "@/lib/api-guards";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const sizeError = rejectLargeRequest(req);
    if (sizeError) return sizeError;

    const limitError = rateLimit(req, "members-signup", 8, 60_000);
    if (limitError) return limitError;

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    if (isHoneypotFilled(body)) {
      return NextResponse.json({ ok: true });
    }

    const email = typeof body?.email === "string" ? body.email.trim() : "";

    await registerMember({ email });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = process.env.NODE_ENV === "production"
      ? "Signup failed"
      : err instanceof Error ? err.message : "Signup failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
