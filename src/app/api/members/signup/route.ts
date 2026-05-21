import { NextResponse } from "next/server";
import { registerMember } from "@/lib/email-provider";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    await registerMember({ email });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signup failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
