"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronRightIcon } from "@/components/icons";
import { GRAIN_SVG } from "@/lib/grain";

export function HeroSection() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  // ── Parallax scroll ──────────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = parallaxRef.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        if (el) el.style.transform = `translateY(${window.scrollY * 0.12}px)`;
        ticking = false;
      });
      ticking = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ minHeight: "100svh" }} className="relative w-full bg-black overflow-hidden">

      {/* Background: parallax wrapper */}
      <div ref={parallaxRef} className="absolute left-0 right-0 will-change-transform" style={{ top: "-15%", bottom: "-15%" }}>
        <div className="ken-burns absolute inset-0">
          <Image fill priority src="/images/14.webp" alt="Two Venues. One Y." style={{ objectFit: "cover" }} />
        </div>
      </div>

      {/* Gradient scrim */}
      <div className="absolute left-0 right-0 bottom-0 pointer-events-none" style={{ top: "30%", background: "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,0.88) 100%)" }} />

      {/* Grain overlay */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03, backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }} />

      {/* Text block */}
      <div className="absolute text-white left-6 md:left-16 max-w-[calc(100%-48px)] md:max-w-none" style={{ bottom: "80px" }}>

        <p style={{ fontSize: "14px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", margin: "0 0 18px" }}>
          Guildford&apos;s Late-Night Quarter
        </p>

        <h1
          className="text-[46px] md:text-[90px]"
          style={{ fontWeight: 700, lineHeight: 1, letterSpacing: "0.9px", margin: "0 0 24px", color: "white" }}
        >
          Two Venues.<br /><span className="whitespace-nowrap">One Y.</span>
        </h1>

        <p
          className="text-[18px] md:text-[22px]"
          style={{ fontWeight: 400, lineHeight: 1.4, letterSpacing: "-0.005em", color: "rgba(255,255,255,0.75)", margin: "0 0 36px", maxWidth: "600px" }}
        >
          An indoor dancefloor and an open-air terrace. A short walk apart.
        </p>

        {/* CTAs — full-width stacked on mobile, side-by-side on desktop */}
        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          {/* Primary CTA */}
          <a
            href="#whats-on"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-1.5 border border-white px-6 text-[18px] font-bold leading-6 hover:-translate-y-0.5 active:scale-[0.98] transition-transform duration-200 motion-reduce:transition-none w-full md:w-auto"
            style={{ height: "50px", borderRadius: 0, backgroundColor: "rgb(255,255,255)", color: "rgb(18,18,18)" }}
          >
            <span aria-hidden="true" className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out pointer-events-none" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.07) 50%, transparent 100%)" }} />
            <span className="relative z-10">What&apos;s On</span>
            <ChevronRightIcon className="size-4 ml-1 relative z-10 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
          </a>

          {/* Secondary CTA */}
          <a
            href="#venue-hire"
            className="group inline-flex items-center justify-center gap-1.5 px-6 text-[18px] font-bold leading-6 text-white hover:bg-white/10 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 motion-reduce:transition-none w-full md:w-auto"
            style={{ height: "50px", borderRadius: 0, backgroundColor: "transparent", border: "1.5px solid rgba(255,255,255,0.7)" }}
          >
            Hire the Venue
            <ChevronRightIcon className="size-4 ml-1 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
          </a>
        </div>
      </div>
    </div>
  );
}
