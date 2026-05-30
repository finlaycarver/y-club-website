import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * The site has a lot of inline styles (audited and approved as part of the
 * brand system) and uses dangerouslySetInnerHTML to emit JSON-LD structured
 * data. Both require `'unsafe-inline'` for now.
 *
 * `'unsafe-eval'` is included only because Next.js dev mode (Turbopack +
 * React Fast Refresh) evaluates code at runtime. It's gated to development
 * so production stays without it.
 */
const isProd = process.env.NODE_ENV === "production";
const plausibleHost = (process.env.NEXT_PUBLIC_PLAUSIBLE_HOST ?? "https://plausible.io").replace(/\/$/, "");

const cspDirectives = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    ...(isProd ? [] : ["'unsafe-eval'"]),
    "https://plausible.io",
    "https://*.plausible.io",
    plausibleHost,
  ],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "blob:"],
  "font-src": ["'self'", "data:"],
  "media-src": ["'self'"],
  "connect-src": [
    "'self'",
    "https://plausible.io",
    "https://*.plausible.io",
    plausibleHost,
    // Webpack HMR + Next.js websocket in dev
    ...(isProd ? [] : ["ws:", "wss:"]),
  ],
  "frame-src": ["'self'", "https://www.google.com", "https://maps.google.com"],
  "frame-ancestors": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "object-src": ["'none'"],
  "upgrade-insecure-requests": [],
};

const cspString = Object.entries(cspDirectives)
  .map(([directive, values]) => (values.length ? `${directive} ${values.join(" ")}` : directive))
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy",  value: cspString },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options",          value: "DENY" },
  { key: "X-Content-Type-Options",   value: "nosniff" },
  { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",       value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control",   value: "on" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
