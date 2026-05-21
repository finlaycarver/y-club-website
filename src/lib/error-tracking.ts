/**
 * Error tracking — dependency-free scaffold.
 *
 * Currently logs caught errors to the server console (visible in Vercel
 * function logs). To activate Sentry:
 *
 *   1. `npm install @sentry/nextjs`
 *   2. Set `SENTRY_DSN` (server) and `NEXT_PUBLIC_SENTRY_DSN` (client)
 *      in Vercel env
 *   3. Swap the `captureError` body below for `Sentry.captureException(error)`
 *
 * The error boundary at `src/app/error.tsx` already calls this on render.
 */

export function captureError(error: unknown, context?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") {
    // TODO(fin): replace with Sentry.captureException once @sentry/nextjs is wired
    console.error("[error-tracking]", error, context ?? {});
  } else {
    console.error("[error-tracking dev]", error, context ?? {});
  }
}
