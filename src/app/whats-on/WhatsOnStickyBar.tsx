"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { EventItem } from "@/data/events";

interface Props {
  /** The next upcoming event — drives the sticky pill copy and ticket link. */
  event: EventItem;
}

/**
 * Desktop-only sticky "Get Tickets" pill.
 *
 * Appears in the bottom-right corner once the hero scrolls out of view.
 * Disappears when the newsletter section enters view.
 *
 * Hidden on mobile — MobileCtaBar handles the mobile conversion layer.
 * Hidden under prefers-reduced-motion (no slide-in transition — pill still
 * shows but without animation).
 */
export function WhatsOnStickyBar({ event }: Props) {
  const [visible, setVisible] = useState(false);
  const heroRef   = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    heroRef.current   = document.querySelector<HTMLDivElement>("main > section:first-child");
    footerRef.current = document.querySelector<HTMLElement>("footer");

    let heroGone    = false;
    let footerClose = false;

    function update() { setVisible(heroGone && !footerClose); }

    const heroObs = new IntersectionObserver(
      ([e]) => { heroGone = !(e?.isIntersecting ?? true); update(); },
      { threshold: 0 }
    );
    const footerObs = new IntersectionObserver(
      ([e]) => { footerClose = e?.isIntersecting ?? false; update(); },
      { threshold: 0.05 }
    );

    if (heroRef.current)   heroObs.observe(heroRef.current);
    if (footerRef.current) footerObs.observe(footerRef.current);

    return () => { heroObs.disconnect(); footerObs.disconnect(); };
  }, []);

  const isExternal = !event.ticketUrl.startsWith("/");

  return (
    /* Hidden on mobile (MobileCtaBar handles mobile). Animate in from bottom. */
    <div
      aria-hidden={!visible}
      className={[
        "hidden md:flex",
        "fixed bottom-6 right-6 z-30",
        "items-center gap-3",
        "bg-black border border-white/15",
        "px-5 py-3",
        "shadow-[0_8px_40px_rgba(0,0,0,0.6)]",
        "transition-all duration-300 ease-out motion-reduce:transition-none",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none",
      ].join(" ")}
    >
      {/* Next event label */}
      <div className="flex flex-col gap-0.5">
        <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
          Next up
        </span>
        <span style={{ fontSize: "14px", fontWeight: 600, color: "#FAFAFA", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {event.title}
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.1)" }} aria-hidden="true" />

      {/* CTA */}
      <Link
        href={event.ticketUrl}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        tabIndex={visible ? 0 : -1}
        className="group relative overflow-hidden inline-flex items-center gap-1.5 bg-white text-black text-[13px] font-bold tracking-[0.04em] uppercase transition-colors duration-200 active:bg-white/90 px-4"
        style={{ height: "36px" }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out pointer-events-none motion-reduce:hidden"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.07) 50%, transparent 100%)" }}
        />
        <span className="relative z-10">Get tickets</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10" aria-hidden="true">
          <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
        </svg>
      </Link>
    </div>
  );
}
