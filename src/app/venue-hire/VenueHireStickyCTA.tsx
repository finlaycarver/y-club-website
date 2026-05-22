"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/lib/site";

/**
 * Mobile-only sticky bar for the Venue Hire page.
 *
 * Appears once the hero scrolls out of view; disappears when the
 * enquiry form section is visible (user no longer needs the shortcut).
 *
 * z-40 — sits above MobileCtaBar (z-30) so it takes precedence on
 * this specific page.
 */
export function VenueHireStickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero   = document.querySelector<HTMLElement>("main > section:first-child");
    const form   = document.getElementById("enquiry-form");

    let heroGone  = false;
    let formClose = false;

    function update() { setVisible(heroGone && !formClose); }

    const heroObs = new IntersectionObserver(
      ([e]) => { heroGone = !(e?.isIntersecting ?? true); update(); },
      { threshold: 0 }
    );
    const formObs = new IntersectionObserver(
      ([e]) => { formClose = e?.isIntersecting ?? false; update(); },
      { threshold: 0.1 }
    );

    if (hero) heroObs.observe(hero);
    if (form) formObs.observe(form);
    return () => { heroObs.disconnect(); formObs.disconnect(); };
  }, []);

  function scrollToForm() {
    document.getElementById("enquiry-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      aria-hidden={!visible}
      className={[
        "fixed bottom-0 left-0 right-0 z-40 md:hidden",
        "flex items-stretch border-t border-white/10 bg-black",
        "transition-transform duration-300 ease-out motion-reduce:transition-none",
        visible ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
      style={{ height: "60px" }}
    >
      {/* Click-to-call */}
      <a
        href={`tel:${BRAND.phone}`}
        tabIndex={visible ? 0 : -1}
        className="venue-cta-ripple flex-1 flex items-center justify-center gap-2 text-white text-[13px] font-bold tracking-[0.04em] uppercase hover:bg-white/5 transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/>
        </svg>
        {BRAND.phoneDisplay}
      </a>

      <div className="w-px bg-white/10 shrink-0" />

      {/* Enquire now — scrolls to form */}
      <button
        type="button"
        onClick={scrollToForm}
        tabIndex={visible ? 0 : -1}
        className="venue-cta-ripple flex-1 flex items-center justify-center gap-1.5 bg-white text-black text-[13px] font-bold tracking-[0.04em] uppercase transition-colors duration-200 active:bg-white/90"
      >
        Enquire now ↓
      </button>
    </div>
  );
}
