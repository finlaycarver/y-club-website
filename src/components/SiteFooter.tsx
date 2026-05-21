"use client";

import { useState } from "react";
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
    <footer className="footer-grain" style={{ background: "#000", color: "#FAFAFA" }}>

      {/* ── MAIN BODY ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 px-6 pt-10 pb-8 md:px-16 md:pt-16 md:pb-14" style={{ alignItems: "start" }}>

        {/* LEFT — Logo + tagline + contact */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <Link href="/" aria-label="Y home" style={{ display: "inline-block" }}>
            <Image src="/images/logo/y-white-no-background.webp" alt="Y Guildford" width={72} height={54} style={{ height: "54px", width: "auto" }} />
          </Link>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: "1.6", maxWidth: "320px" }}>
            Guildford&apos;s Late-Night Quarter — three venues, a short walk apart.
          </p>

          {/* Contact — sitewide phone + email so visitors don't have to dig
              into the hire page to reach the team. */}
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
          </div>
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
              <button
                type="submit"
                disabled={state === "submitting"}
                className="hover:bg-white hover:text-black transition-colors duration-300 motion-reduce:transition-none shrink-0 disabled:opacity-60"
                style={{ height: "50px", padding: "0 28px", border: "1px solid rgba(255,255,255,0.6)", borderLeft: "none", borderRadius: 0, background: "transparent", color: "#FAFAFA", fontSize: "14px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", cursor: state === "submitting" ? "wait" : "pointer", fontFamily: "haas, Arial, sans-serif", whiteSpace: "nowrap" }}
              >
                {state === "submitting" ? "Sending…" : "Subscribe"}
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
      <div className="px-6 py-6 md:px-16 md:py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <nav aria-label="Footer navigation">
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: "32px", flexWrap: "wrap" }}>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="relative pb-px after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-white/50 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:ease-out motion-reduce:after:transition-none"
                  style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: 450, textDecoration: "none", letterSpacing: "0.02em" }}
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
        </div>

        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {SOCIAL_LINKS.map(({ Icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
              className="opacity-40 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-200 motion-reduce:transition-none"
              style={{ display: "flex", alignItems: "center" }}>
              <Icon style={{ width: "22px", height: "22px", fill: "#FAFAFA" }} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
