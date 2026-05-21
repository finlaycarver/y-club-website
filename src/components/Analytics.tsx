import Script from "next/script";

/**
 * Plausible analytics — only renders when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
 * is set. Renders nothing locally / in preview unless the env is wired,
 * which keeps the dev experience clean and prevents accidental tracking.
 *
 * To self-host Plausible, also set `NEXT_PUBLIC_PLAUSIBLE_HOST` to your
 * stats endpoint (e.g. https://stats.example.com).
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  const host = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST ?? "https://plausible.io";
  const src = `${host.replace(/\/$/, "")}/js/script.js`;

  return (
    <Script
      defer
      data-domain={domain}
      src={src}
      strategy="afterInteractive"
    />
  );
}
