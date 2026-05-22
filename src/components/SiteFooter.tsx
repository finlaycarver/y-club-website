"use client";

import { useState, useEffect, useCallback } from "react";
import { FindUsBottomSheet } from "@/components/FindUsBottomSheet";
import Image from "next/image";
import Link from "next/link";
import {
  InstagramIcon,
  TikTokIcon,
  FacebookIcon,
} from "@/components/icons";
import { BRAND, COMPANY } from "@/lib/site";

const NAV_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy"  },
  { label: "Terms",          href: "/terms"           },
  { label: "Venue Hire",     href: "/venue-hire"      },
  { label: "Careers",        href: "/about#careers"   },
  { label: "FAQs",           href: "/faqs"            },
];

// Real social handles sourced from ybar.uk:
// Instagram: @y_bar_  ·  Facebook: guildford.y.bar  ·  TikTok: @y_bar_ (best guess — verify)
const SOCIAL_LINKS = [
  { Icon: InstagramIcon, href: "https://instagram.com/y_bar_",            label: "Instagram" },
  { Icon: TikTokIcon,    href: "https://tiktok.com/@y_bar_",              label: "TikTok"    },
  { Icon: FacebookIcon,  href: "https://facebook.com/guildford.y.bar",    label: "Facebook"  },
];

type SubscribeState = "idle" | "submitting" | "success" | "error";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubscribeState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [findUsOpen, setFindUsOpen] = useState(false);
  const closeFindUs = useCallback(() => setFindUsOpen(false), []);

  // Web Share API — only available in secure contexts on mobile browsers
  const [canShare, setCanShare] = useState(false);
  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  async function handleShare() {
    try {
      await navigator.share({
        title: "Y — Guildford's Late-Night Quarter",
        text: "Three venues on one short walk. Cocktails, terrace, club.",
        url: window.location.origin,
      });
    } catch {
      // User cancelled or API unsupported — silent fail
    }
  }

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "submitting" || !email) return;

    setState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Subscription failed");
      }

      setState("success");
      setEmail("");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <>
    <footer className="footer-grain" style={{ background: "#000", color: "#FAFAFA" }}>

      {/* ── MAIN BODY ─────────────────────────────────────────────── */}
      {/* Column gap tightened from gap-20 → gap-12 on tablet+: the previous
          80px gap left the right column feeling unmoored from the left. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 px-6 pt-10 pb-8 md:px-16 md:pt-16 md:pb-14" style={{ alignItems: "start" }}>

        {/* LEFT — Logo + tagline + contact */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <Link href="/" aria-label="Y home" style={{ display: "inline-block" }}>
            {/* Logo: 36px on mobile (was 54px), 54px on md+ */}
            <Image src="/images/logo/y-white-no-background.webp" alt="Y Guildford" width={72} height={54} className="h-[36px] md:h-[54px] w-auto" style={{ height: undefined, width: "auto" }} />
          </Link>
          {/* Marquee tagline — slow horizontal scroll on mobile gives the
              footer a quiet sense of motion without being distracting.
              Disabled under prefers-reduced-motion (static text). */}
          <div className="footer-marquee-wrap overflow-hidden" style={{ maxWidth: "320px" }}>
            <p className="footer-marquee-track motion-reduce:animate-none" style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: "1.6", whiteSpace: "nowrap" }}>
              Onslow Street to The Quadrant. Three venues on one short walk.&nbsp;&nbsp;·&nbsp;&nbsp;Onslow Street to The Quadrant. Three venues on one short walk.
            </p>
          </div>

          {/* Contact — sitewide phone + email + brand-level hours so
              visitors don't have to dig into the hire page to reach the
              team or check when we're open. */}
          <div className="flex flex-col gap-1.5">
            <p style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "4px" }}>
              Contact
            </p>
            <a
              href={`tel:${BRAND.phone}`}
              className="hover:opacity-100 transition-opacity duration-200 motion-reduce:transition-none"
              style={{ fontSize: "15px", color: "rgba(255,255,255,0.75)", textDecoration: "none", letterSpacing: "-0.005em" }}
            >
              {BRAND.phoneDisplay}
            </a>
            <a
              href={`mailto:${BRAND.email}`}
              className="hover:opacity-100 transition-opacity duration-200 motion-reduce:transition-none"
              style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", textDecoration: "none" }}
            >
              {BRAND.email}
            </a>
            {/* Brand-level opening hours — visible without navigating to a
                venue page. Per-venue hours live on the individual venue
                routes. */}
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", marginTop: "4px" }}>
              {BRAND.hoursDisplay}
            </p>
          </div>

          {/* "Find us" — opens the venue address sheet with tap-to-directions */}
          <button
            onClick={() => setFindUsOpen(true)}
            className="inline-flex items-center gap-1.5 group hover:opacity-100 transition-opacity duration-200 motion-reduce:transition-none"
            style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", opacity: 0.65 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="border-b border-white/30 group-hover:border-white transition-colors duration-200" style={{ fontSize: "14px", fontWeight: 600, color: "#FAFAFA", letterSpacing: "0.04em" }}>
              Find us
            </span>
          </button>
        </div>

        {/* RIGHT — Newsletter */}
        <div>
          <p style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "14px" }}>
            Join our community
          </p>
          <h3 style={{ fontSize: "38px", fontWeight: 700, lineHeight: "1.1", color: "#FAFAFA", marginBottom: "8px" }}>
            Stay in the know.
          </h3>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", marginBottom: "28px", lineHeight: "1.6" }}>
            Events, new nights, and what&apos;s coming next.
          </p>
          {state === "success" ? (
            <div
              role="status"
              aria-live="polite"
              style={{
                padding: "16px 20px",
                border: "1px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <p style={{ fontSize: "15px", color: "#FAFAFA", fontWeight: 600, marginBottom: "4px" }}>
                You&apos;re on the list.
              </p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>
                Check your inbox to confirm — we&apos;ll be in touch.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} noValidate style={{ display: "flex" }}>
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email address"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={state === "submitting"}
                className="flex-1 border border-white/25 focus:border-white/70 focus:outline-none transition-[border-color] duration-200 motion-reduce:transition-none placeholder:text-white/30 disabled:opacity-60"
                style={{ height: "50px", background: "transparent", color: "#FAFAFA", fontFamily: "haas, Arial, sans-serif", fontSize: "15px", borderRadius: 0, padding: "0 16px", minWidth: 0 }}
              />
              {/* Subscribe button — ties into the hero CTA accent treatment:
                  a left-to-right sweep shimmer on hover plus a colour fill.
                  Matches the visual vocabulary of the rest of the page so
                  the newsletter doesn't read as a separate widget. */}
              <button
                type="submit"
                disabled={state === "submitting"}
                className="group relative overflow-hidden hover:bg-white hover:text-black transition-colors duration-300 motion-reduce:transition-none shrink-0 disabled:opacity-60"
                style={{ height: "50px", padding: "0 28px", border: "1px solid rgba(255,255,255,0.6)", borderLeft: "none", borderRadius: 0, background: "transparent", color: "#FAFAFA", fontSize: "14px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", cursor: state === "submitting" ? "wait" : "pointer", fontFamily: "haas, Arial, sans-serif", whiteSpace: "nowrap" }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out pointer-events-none motion-reduce:hidden"
                  style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)" }}
                />
                <span className="relative z-10">
                  {state === "submitting" ? "Sending…" : "Subscribe"}
                </span>
              </button>
            </form>
          )}
          {state === "error" && (
            <p
              role="alert"
              style={{ fontSize: "13px", color: "rgba(255,200,200,0.85)", marginTop: "10px" }}
            >
              {errorMsg || "Couldn't subscribe — please try again."}
            </p>
          )}
        </div>
      </div>

      {/* ── BOTTOM BAR ────────────────────────────────────────────── */}
      {/* Mobile: flex-col stack so nav wraps cleanly at 320px without
          squashing copyright + social into one cramped row.
          gap-y on the nav ul lets links wrap to 2 rows without
          overlapping at very narrow viewports. */}
      <div className="px-6 py-6 md:px-16 md:py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <nav aria-label="Footer navigation">
          <ul className="footer-nav-list" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: "20px", flexWrap: "wrap", rowGap: "10px" }}>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                {/* Hover underline disabled on touch — @media (hover: none) in
                    globals.css removes the after-pseudo underline so tap
                    targets don't flash a half-rendered line on iOS. */}
                <Link
                  href={href}
                  className="footer-nav-link relative pb-px after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-white/50 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:ease-out motion-reduce:after:transition-none"
                  style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 450, textDecoration: "none", letterSpacing: "0.02em" }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
            Y &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
          {/*
            Company registration line — only renders once the env vars are
            set in Vercel (NEXT_PUBLIC_COMPANY_LEGAL_NAME, NEXT_PUBLIC_COMPANY_NUMBER,
            NEXT_PUBLIC_VAT_NUMBER). Keeps the footer clean until real data lands.
          */}
          {(COMPANY.legalName || COMPANY.registrationNumber) && (
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
              {COMPANY.legalName && <>{COMPANY.legalName}</>}
              {COMPANY.legalName && COMPANY.registrationNumber && <> · </>}
              {COMPANY.registrationNumber && <>Company No. {COMPANY.registrationNumber}</>}
              {COMPANY.vatNumber && (COMPANY.legalName || COMPANY.registrationNumber) && <> · </>}
              {COMPANY.vatNumber && <>VAT No. {COMPANY.vatNumber}</>}
            </p>
          )}
          {/* Portfolio attribution. Tiny, low-contrast — present but not loud. */}
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
            Designed by{" "}
            <a
              href="https://first-aid.agency"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors duration-200 motion-reduce:transition-none"
              style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
            >
              First AI.D
            </a>
          </p>
        </div>

        {/* Social icons at 44×44 tap targets — icon is 22px, the
            extra area is invisible padding for thumb accuracy. */}
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          {SOCIAL_LINKS.map(({ Icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
              className="opacity-40 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-200 motion-reduce:transition-none inline-flex items-center justify-center"
              style={{ width: "44px", height: "44px" }}>
              <Icon style={{ width: "22px", height: "22px", fill: "#FAFAFA" }} />
            </a>
          ))}
          {/* Native share button — only rendered when Web Share API is
              available (iOS Safari, Chrome Android). */}
          {canShare && (
            <button
              onClick={handleShare}
              aria-label="Share Y Guildford"
              className="opacity-40 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-200 motion-reduce:transition-none inline-flex items-center justify-center bg-transparent border-0 cursor-pointer"
              style={{ width: "44px", height: "44px" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </footer>

    {/* "Find us" venue address sheet */}
    <FindUsBottomSheet open={findUsOpen} onClose={closeFindUs} />
    </>
  );
}
