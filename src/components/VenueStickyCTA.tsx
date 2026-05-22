"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { EventItem } from "@/data/events";
import { BRAND } from "@/lib/site";

interface Props {
  /** Next event at this venue — primary CTA links to its ticket URL. */
  nextEvent?: EventItem;
  /** Pre-filtered What's On URL for this venue (e.g. /whats-on?venue=Y+Club). */
  whatsOnHref: string;
}

/**
 * Mobile-only sticky bar for venue detail pages.
 *
 * Renders at z-40 (above the sitewide MobileCtaBar z-30) — effectively
 * replaces it with venue-specific actions when visible:
 *   - Primary: "Get tickets" → next event ticket URL (or filtered What's On)
 *   - Secondary: "Call us" → tel: link
 *
 * Appears after the hero scrolls out of view; disappears when the footer
 * comes into view. md:hidden keeps it mobile-only.
 */
export function VenueStickyCTA({ nextEvent, whatsOnHref }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero   = document.querySelector<HTMLElement>("main section:first-child");
    const footer = document.querySelector<HTMLElement>("footer");

    let heroGone    = false;
    let footerClose = false;

    function update() { setVisible(heroGone && !footerClose); }

    const heroObs = new IntersectionObserver(
      ([e]) => { heroGone = !(e?.isIntersecting ?? true); update(); },
      { threshold: 0 },
    );
    const footerObs = new IntersectionObserver(
      ([e]) => { footerClose = e?.isIntersecting ?? false; update(); },
      { threshold: 0.05 },
    );

    if (hero)   heroObs.observe(hero);
    if (footer) footerObs.observe(footer);

    return () => { heroObs.disconnect(); footerObs.disconnect(); };
  }, []);

  const ticketHref    = nextEvent?.ticketUrl ?? whatsOnHref;
  const ticketExternal = ticketHref.startsWith("http");
  const ticketLabel   = nextEvent ? "Get tickets" : "What's On";

  return (
    <div
      aria-hidden={!visible}
      className={[
        "fixed bottom-0 left-0 right-0 z-40 md:hidden",
        "flex items-stretch",
        "border-t border-white/10 bg-black",
        "transition-transform duration-300 ease-out motion-reduce:transition-none",
        visible ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
      style={{ height: "60px" }}
    >
      {/* Primary — Get Tickets */}
      <Link
        href={ticketHref}
        target={ticketExternal ? "_blank" : undefined}
        rel={ticketExternal ? "noopener noreferrer" : undefined}
        tabIndex={visible ? 0 : -1}
        className="group venue-cta-ripple relative flex-1 flex items-center justify-center gap-1.5 overflow-hidden bg-white text-black text-[14px] font-bold tracking-[0.04em] uppercase transition-colors duration-200 active:bg-white/90"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out pointer-events-none motion-reduce:hidden"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.06) 50%, transparent 100%)" }}
        />
        <span className="relative z-10">{ticketLabel}</span>
        {nextEvent && (
          <span className="relative z-10 text-black/50 text-[12px] font-medium normal-case tracking-normal truncate max-w-[120px]">
            · {nextEvent.date}
          </span>
        )}
      </Link>

      {/* Divider */}
      <div className="w-px bg-white/10 shrink-0" />

      {/* Secondary — Call */}
      <a
        href={`tel:${BRAND.phone}`}
        tabIndex={visible ? 0 : -1}
        aria-label={`Call ${BRAND.phoneDisplay}`}
        className="venue-cta-ripple relative flex-none flex items-center justify-center gap-1.5 text-white/80 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors duration-200"
        style={{ padding: "0 20px" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/>
        </svg>
        <span className="text-[13px] font-semibold">{BRAND.phoneDisplay}</span>
      </a>
    </div>
  );
}
