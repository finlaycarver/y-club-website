import { NextResponse } from "next/server";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    forwardedFor ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function rejectLargeRequest(req: Request, maxBytes = 64 * 1024): NextResponse | null {
  const length = req.headers.get("content-length");
  if (length && Number(length) > maxBytes) {
    return NextResponse.json(
      { ok: false, error: "Request body too large" },
      { status: 413 },
    );
  }
  return null;
}

export function rateLimit(
  req: Request,
  scope: string,
  limit = 10,
  windowMs = 60_000,
): NextResponse | null {
  const now = Date.now();
  const key = `${scope}:${getClientIp(req)}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  return null;
}

export function isHoneypotFilled(body: Record<string, unknown>): boolean {
  return typeof body.company === "string" && body.company.trim().length > 0;
}
