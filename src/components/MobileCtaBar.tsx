"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";

/**
 * Sticky mobile-only CTA bar.
 *
 * Appears once the hero scrolls out of view and disappears again when
 * the footer comes into view. This preserves the hero's primary CTA
 * role while ensuring conversion paths are always reachable through
 * the deep sections of the page.
 *
 * Hidden at md+ breakpoint — desktop has the persistent nav.
 * Slides up from below the fold; respects prefers-reduced-motion.
 */
export function MobileCtaBar() {
  const [visible, setVisible] = useState(false);
  const heroSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Observe the element the hero section renders after, and the footer.
    // Using query selectors so this component doesn't need to be wired
    // into HeroSection or SiteFooter via props.
    const hero = document.querySelector<HTMLElement>("[data-hero-sentinel]");
    const footer = document.querySelector<HTMLElement>("footer");

    let heroGone = false;
    let footerVisible = false;

    function update() {
      setVisible(heroGone && !footerVisible);
    }

    const heroObs = new IntersectionObserver(
      ([entry]) => {
        heroGone = !(entry?.isIntersecting ?? true);
        update();
      },
      { threshold: 0 }
    );

    const footerObs = new IntersectionObserver(
      ([entry]) => {
        footerVisible = entry?.isIntersecting ?? false;
        update();
      },
      { threshold: 0.1 }
    );

    if (hero) heroObs.observe(hero);
    if (footer) footerObs.observe(footer);

    return () => {
      heroObs.disconnect();
      footerObs.disconnect();
    };
  }, []);

  return (
    <>
      {/* Sentinel — placed at the bottom of HeroSection via data attribute.
          We query it by [data-hero-sentinel] so no prop threading is needed. */}
      <div ref={heroSentinelRef} />

      {/* Bar — md:hidden keeps this strictly mobile.
          translate-y animates in/out; motion-reduce skips the animation. */}
      <div
        aria-hidden={!visible}
        className={[
          "fixed bottom-0 left-0 right-0 z-30 md:hidden",
          "flex items-stretch",
          "border-t border-white/10 bg-black",
          "transition-transform duration-300 ease-out motion-reduce:transition-none",
          visible ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
        style={{ height: "60px" }}
      >
        {/* Grain overlay — matches the rest of the page texture system */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />

        {/* Primary CTA — What's On */}
        <Link
          href="/whats-on"
          tabIndex={visible ? 0 : -1}
          className="group relative flex-1 flex items-center justify-center gap-1.5 overflow-hidden bg-white text-black text-[14px] font-bold tracking-[0.04em] uppercase transition-colors duration-200 active:bg-white/90"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out pointer-events-none motion-reduce:hidden"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.06) 50%, transparent 100%)" }}
          />
          <span className="relative z-10">What&apos;s On</span>
          <ChevronRightIcon className="relative z-10 size-3.5" />
        </Link>

        {/* Divider */}
        <div className="w-px bg-white/10 shrink-0" />

        {/* Secondary CTA — Hire the Venue */}
        <Link
          href="/venue-hire"
          tabIndex={visible ? 0 : -1}
          className="group relative flex-1 flex items-center justify-center gap-1.5 overflow-hidden text-white/85 text-[14px] font-bold tracking-[0.04em] uppercase hover:text-white hover:bg-white/5 transition-colors duration-200 active:bg-white/10"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out pointer-events-none motion-reduce:hidden"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)" }}
          />
          <span className="relative z-10">Hire the Venue</span>
          <ChevronRightIcon className="relative z-10 size-3.5" />
        </Link>
      </div>
    </>
  );
}
