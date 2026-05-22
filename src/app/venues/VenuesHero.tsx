"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { GRAIN_SVG } from "@/lib/grain";

/**
 * Venues page hero — client component so the parallax scroll effect
 * can use useEffect + scroll listener.
 *
 * Parallax: identical to HeroSection — the image wrapper overflows the
 * section by ±15% and translates at 0.12× scroll speed, creating depth
 * without layout shift. Disabled under prefers-reduced-motion.
 */
export function VenuesHero() {
  const heroRef    = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el   = parallaxRef.current;
    const hero = heroRef.current;
    if (!el || !hero) return;

    let ticking     = false;
    let heroVisible = true;

    const onScroll = () => {
      if (ticking || !heroVisible) return;
      requestAnimationFrame(() => {
        if (el) el.style.transform = `translateY(${window.scrollY * 0.12}px)`;
        ticking = false;
      });
      ticking = true;
    };

    // Stop translating once hero is fully off-screen — saves compositor work
    const obs = new IntersectionObserver(
      ([entry]) => { heroVisible = entry?.isIntersecting ?? true; },
      { rootMargin: "200px 0px" },
    );
    obs.observe(hero);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative bg-black overflow-hidden flex items-end"
      style={{ minHeight: "70svh" }}
    >
      {/* Parallax wrapper — overflows ±15% so the image never reveals
          edges during scroll travel. will-change keeps it on the GPU. */}
      <div
        ref={parallaxRef}
        className="absolute left-0 right-0 will-change-transform"
        style={{ top: "-15%", bottom: "-15%" }}
      >
        <Image
          src="/images/club-y-image-5.webp"
          alt="Y venues, Guildford"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
        />
      </div>

      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.88) 100%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.03, backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
      />

      {/* Editorial venue numerals — top-right, stagger in via hero-word */}
      <div
        aria-hidden="true"
        className="hidden md:flex absolute top-32 right-16 gap-8 items-center"
        style={{ zIndex: 2 }}
      >
        {(["01", "02", "03"] as const).map((n, i) => (
          <span
            key={n}
            className="hero-word"
            style={{
              animationDelay: `${i * 180}ms`,
              fontSize: "72px",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "rgba(255,255,255,0.12)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {n}
          </span>
        ))}
      </div>

      <div className="relative z-10 text-white px-6 md:px-16 pb-16 pt-40 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 mb-8 hover:opacity-100 transition-opacity duration-200 motion-reduce:transition-none"
          style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.45)", textDecoration: "none", letterSpacing: "0.04em" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Y Home
        </Link>

        <p style={{
          fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "16px",
        }}>
          Guildford&apos;s Late-Night Quarter
        </p>

        <h1
          className="text-[46px] md:text-[80px]"
          style={{ fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em" }}
        >
          <span className="hero-word" style={{ animationDelay: "80ms" }}>Three</span>
          {" "}
          <span className="hero-word" style={{ animationDelay: "200ms" }}>doors.</span>
          {" "}
          <span className="hero-word" style={{ animationDelay: "320ms" }}>One</span>
          {" "}
          <span className="hero-word" style={{ animationDelay: "440ms" }}>night.</span>
        </h1>

        <p
          className="text-[18px] md:text-[22px]"
          style={{
            fontWeight: 400, lineHeight: 1.45, letterSpacing: "-0.005em",
            color: "rgba(255,255,255,0.7)", marginTop: "24px", maxWidth: "620px",
          }}
        >
          Three venues, a short walk apart. Each with its own
          personality — cocktails to start, terrace to settle,
          club to finish.
        </p>
      </div>
    </section>
  );
}
