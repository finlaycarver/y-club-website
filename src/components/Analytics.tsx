"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "y-cookie-consent-v1";

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
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => {
      try {
        setEnabled(window.localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted");
      } catch {
        setEnabled(false);
      }
    };
    const id = window.setTimeout(() => {
      sync();
    }, 0);
    window.addEventListener("storage", sync);
    window.addEventListener("y-cookie-consent-change", sync);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("storage", sync);
      window.removeEventListener("y-cookie-consent-change", sync);
    };
  }, []);

  if (!domain) return null;
  if (!enabled) return null;

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
