"use client";

import Image from "next/image";
import Link from "next/link";
import {
  InstagramIcon,
  TikTokIcon,
  FacebookIcon,
} from "@/components/icons";

const NAV_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Venue Hire",     href: "#venue-hire"     },
  { label: "Careers",        href: "#careers"        },
  { label: "FAQs",           href: "#faqs"           },
];

const SOCIAL_LINKS = [
  { Icon: InstagramIcon, href: "https://instagram.com/yclubguildford", label: "Instagram" },
  { Icon: TikTokIcon,   href: "#",                                     label: "TikTok"    },
  { Icon: FacebookIcon, href: "#",                                     label: "Facebook"  },
];

export function SiteFooter() {
  return (
    <footer className="footer-grain" style={{ background: "#000", color: "#FAFAFA" }}>

      {/* ── MAIN BODY ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 px-6 pt-10 pb-8 md:px-16 md:pt-16 md:pb-14" style={{ alignItems: "start" }}>

        {/* LEFT — Logo + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <Link href="/" aria-label="Y home" style={{ display: "inline-block" }}>
            <Image src="/images/logo/y-white-no-background.webp" alt="Y" width={72} height={54} style={{ height: "54px", width: "auto" }} />
          </Link>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: "1.6", maxWidth: "320px" }}>
            Guildford's Late-Night Quarter — three venues, a short walk apart.
          </p>
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
            Events, new nights, and what's coming next.
          </p>
          <form onSubmit={(e) => e.preventDefault()} noValidate style={{ display: "flex" }}>
            <input
              type="email"
              placeholder="Your email address"
              aria-label="Email address"
              autoComplete="email"
              className="flex-1 border border-white/25 focus:border-white/70 focus:outline-none transition-[border-color] duration-200 motion-reduce:transition-none placeholder:text-white/30"
              style={{ height: "50px", background: "transparent", color: "#FAFAFA", fontFamily: "haas, Arial, sans-serif", fontSize: "15px", borderRadius: 0, padding: "0 16px", minWidth: 0 }}
            />
            <button
              type="submit"
              className="hover:bg-white hover:text-black transition-colors duration-300 motion-reduce:transition-none shrink-0"
              style={{ height: "50px", padding: "0 28px", border: "1px solid rgba(255,255,255,0.6)", borderLeft: "none", borderRadius: 0, background: "transparent", color: "#FAFAFA", fontSize: "14px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", fontFamily: "haas, Arial, sans-serif", whiteSpace: "nowrap" }}
            >
              Subscribe
            </button>
          </form>
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

        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
          Y &copy; 2026. All rights reserved.
        </p>

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
