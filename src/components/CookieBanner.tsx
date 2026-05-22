"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "y-cookie-consent-v1";

/**
 * Lightweight, GDPR-aware consent banner. Shows once on first visit,
 * persists the user's choice in localStorage, and bows out gracefully
 * once handled. Pair with analytics (gtag/Plausible/etc.) by reading
 * the stored value before initialising trackers.
 */
export function CookieBanner() {
  // Start hidden — only reveal after we know the user hasn't yet decided.
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        // localStorage is only available on the client, so we read it
        // post-mount. The cascading render is intentional and one-shot.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShow(true);
      }
    } catch {
      // Storage blocked — fail closed (don't show banner)
    }
  }, []);

  // Body data-attribute — lets CSS add padding-bottom to <main> on mobile
  // so the fixed banner doesn't overlap the address/entry section content.
  useEffect(() => {
    if (show) {
      document.body.dataset.cookieBanner = "1";
    } else {
      delete document.body.dataset.cookieBanner;
    }
    return () => { delete document.body.dataset.cookieBanner; };
  }, [show]);

  function setConsent(value: "accepted" | "declined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore storage errors
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    // Positioned at the bottom of the viewport so it never overlaps
    // above-the-fold CTAs (was top: 0, which blocked the /whats-on
    // featured event CTA on the first viewport).
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed left-0 right-0 z-50 px-4 md:px-6"
      style={{
        bottom: 0,
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
        paddingTop: "16px",
        pointerEvents: "none",
      }}
    >
      <div
        className="mx-auto flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
        style={{
          maxWidth: "960px",
          background: "rgba(8,8,8,0.96)",
          color: "#FAFAFA",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: "20px 24px",
          pointerEvents: "auto",
        }}
      >
        <p style={{ fontSize: "14px", lineHeight: 1.55, color: "rgba(255,255,255,0.75)", flex: 1 }}>
          We use cookies to make the site work and to understand how it&apos;s used.
          See our{" "}
          <Link href="/privacy-policy" className="underline underline-offset-2 hover:opacity-70">
            privacy policy
          </Link>{" "}
          for details.
        </p>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setConsent("declined")}
            className="hover:opacity-70 transition-opacity duration-200 motion-reduce:transition-none cursor-pointer"
            style={{
              fontSize: "13px",
              fontWeight: 500,
              padding: "10px 14px",
              background: "transparent",
              color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 0,
              letterSpacing: "0.02em",
            }}
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => setConsent("accepted")}
            className="hover:bg-white/90 transition-colors duration-200 motion-reduce:transition-none cursor-pointer"
            style={{
              fontSize: "13px",
              fontWeight: 700,
              padding: "10px 18px",
              background: "#FAFAFA",
              color: "#080808",
              border: "1px solid #FAFAFA",
              borderRadius: 0,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
