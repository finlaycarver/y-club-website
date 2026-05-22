"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Phone, Share2 } from "lucide-react";
import { ChevronRightIcon } from "@/components/icons";
import { YLogoMark } from "@/components/YLogoMark";
import { GRAIN_SVG } from "@/lib/grain";

/* ──────────────────────────────────────────────────────────────────────
   H1 word stagger source — wrapping each word in a span lets the
   CSS animation (in globals.css → .hero-word) cascade them in.
   ────────────────────────────────────────────────────────────────────── */
interface HeroWord {
  text: string;
  /** Insert a mobile-only line break before this word. */
  lineBreakBefore?: boolean;
  /** Render in the italic editorial typeface. */
  italic?: boolean;
  /** Render the Y logo mark image before the text content. */
  logoMark?: boolean;
}

const HERO_WORDS: ReadonlyArray<HeroWord> = [
  { text: "Three" },
  { text: "Venues." },
  { text: "One", lineBreakBefore: true },
  // Logo mark replaces the italic Birdie "Y" — period follows inline.
  { text: ".", logoMark: true },
];

/* ──────────────────────────────────────────────────────────────────────
   Day-aware status copy. We don't have confirmed close times so we
   stop short of claiming "until 3am" — instead say which night the
   user can come down. Computed client-side so it's always accurate.
   ────────────────────────────────────────────────────────────────────── */
function getLiveStatus(now: Date): string {
  const day = now.getDay(); // 0 = Sun, 5 = Fri, 6 = Sat
  if (day === 5 || day === 6) return "Open tonight";
  if (day === 4) return "Open tomorrow night";
  return "Open this Friday + Saturday";
}

/* Minimal shape we care about from the Network Information API. */
interface NetworkConnection {
  saveData?: boolean;
}

export function HeroSection() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const primaryCtaRef = useRef<HTMLAnchorElement>(null);
  const cursorLightRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* Live status text is computed on mount so SSR markup is stable.
     Initial render shows the safe forward-looking line. */
  const [liveStatus, setLiveStatus] = useState("Open this Friday + Saturday");

  /* Video upgrade — opt-in only when the device can comfortably play
     it. Default false keeps SSR + mobile + reduced-motion users on the
     static <picture> hero (cheap, no autoplay surprises). */
  const [videoMode, setVideoMode] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [hasShareAPI, setHasShareAPI] = useState(false);

  // ── Parallax scroll ──────────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = parallaxRef.current;
    const hero = heroRef.current;
    if (!el || !hero) return;

    let ticking = false;
    let heroVisible = true;

    const onScroll = () => {
      if (ticking || !heroVisible) return;
      requestAnimationFrame(() => {
        if (el) el.style.transform = `translateY(${window.scrollY * 0.12}px)`;
        ticking = false;
      });
      ticking = true;
    };

    const observer = new IntersectionObserver(
      ([entry]) => { heroVisible = entry?.isIntersecting ?? true; },
      { rootMargin: "200px 0px" }
    );
    observer.observe(hero);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  // ── Day-aware live status (client-side compute) ──────────────────
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLiveStatus(getLiveStatus(new Date()));
  }, []);

  // Video upgrade disabled — static <picture> hero is used instead.
  // The y-club-loop.mp4 quality was not suitable for the home page.
  // Re-enable by restoring the videoMode gate if a high-quality reel
  // becomes available.

  // ── Web Share API availability detect ────────────────────────────
  // navigator.share is a mobile-browser API; checking on mount keeps
  // the share button invisible on browsers that don't support it.
  useEffect(() => {
    setHasShareAPI(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  // ── Native share handler ──────────────────────────────────────────
  const handleShare = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.share) return;
    try {
      await navigator.share({
        title: "Y Bar — Guildford's Late-Night Quarter",
        text: "Three venues. One night. Y Bar, Guildford.",
        url: window.location.href,
      });
    } catch {
      // User cancelled the sheet or API unavailable — silent
    }
  }, []);

  // ── Cursor-reactive radial light source ──────────────────────────
  // Pointer-fine only (skip on touch); CSS variables drive the gradient
  // position so updates stay on the compositor.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hero = heroRef.current;
    const light = cursorLightRef.current;
    if (!hero || !light) return;

    let ticking = false;

    const onMove = (e: MouseEvent) => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        light.style.setProperty("--mx", `${x}%`);
        light.style.setProperty("--my", `${y}%`);
        light.style.opacity = "1";
        ticking = false;
      });
      ticking = true;
    };

    const onLeave = () => { light.style.opacity = "0"; };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // ── Magnetic primary CTA ─────────────────────────────────────────
  // Within 40px of the button centre, the button pulls toward the
  // cursor at 30% strength. Returns to centre with a 200ms ease-out
  // on mouseleave. Pointer-fine only; disabled under reduced motion.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const btn = primaryCtaRef.current;
    if (!btn) return;

    const RADIUS = 40;
    const PULL = 0.3;

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > rect.width / 2 + RADIUS) {
        btn.style.transform = "translate(0, 0)";
        btn.style.transition = "transform 200ms cubic-bezier(0.16, 1, 0.3, 1)";
        return;
      }
      btn.style.transition = "transform 60ms linear";
      btn.style.transform = `translate(${dx * PULL}px, ${dy * PULL}px)`;
    };

    const onLeave = () => {
      btn.style.transition = "transform 200ms cubic-bezier(0.16, 1, 0.3, 1)";
      btn.style.transform = "translate(0, 0)";
    };

    window.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, []);


  return (
    <div ref={heroRef} style={{ minHeight: "100svh" }} className="relative w-full bg-black overflow-hidden" data-hero-sentinel>

      {/* Background: parallax wrapper.
          Layered: <picture> always renders (SSR-safe fallback). On
          capable devices, a <video> overlay fades in on top once it
          can play. Mobile + reduced-motion + save-data stay on the
          still picture — no autoplay surprises, no wasted bytes. */}
      <div ref={parallaxRef} className="absolute left-0 right-0 will-change-transform" style={{ top: "-15%", bottom: "-15%" }}>
        <div className="ken-burns absolute inset-0">
          <picture>
            <img
              src="/images/14.webp"
              alt="Three Venues. One Y."
              fetchPriority="high"
              decoding="async"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </picture>

          {/* Video removed — static <picture> renders instead.
              Restore when a high-quality home reel is available. */}
        </div>
      </div>

      {/* Cursor-reactive radial light — sits above the image, below the
          scrim. CSS variables animated via JS; pointer-fine only. */}
      <div
        ref={cursorLightRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: 0,
          background: "radial-gradient(circle 320px at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.10) 0%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Gradient scrim */}
      <div className="absolute left-0 right-0 bottom-0 pointer-events-none" style={{ top: "30%", background: "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,0.88) 100%)" }} />

      {/* Grain overlay — opacity bumps up slightly at xl viewports so the
          texture stays readable on big displays. */}
      <div
        aria-hidden="true"
        className="hero-grain absolute inset-0 pointer-events-none"
        style={{ backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
      />

      {/* Text block. */}
      <div className="hero-text-block absolute text-white left-6 md:left-16 max-w-[calc(100%-48px)] md:max-w-none">

        {/* Live-status line — day-aware copy + pulsing dot */}
        <p
          className="hero-live"
          style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.78)",
            margin: "0 0 14px",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            aria-hidden="true"
            className="hero-live-dot"
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#4ade80",
              display: "inline-block",
            }}
          />
          {liveStatus}
        </p>

        {/* Kicker — .hero-kicker class lets globals.css tighten
            letter-spacing at 320px to prevent overflow. */}
        <p className="hero-kicker" style={{ fontSize: "14px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", margin: "0 0 18px" }}>
          Guildford&apos;s Late-Night Quarter
        </p>

        {/* H1 — word-by-word pull-up stagger on mount.
            Each <span class="hero-word"> animates in with a 200ms
            cascade (see globals.css). Reduced-motion users get the
            final state instantly. */}
        <h1
          className="text-[46px] md:text-[90px] md:whitespace-nowrap tracking-[0.9px] md:tracking-[-0.018em]"
          style={{ fontWeight: 700, lineHeight: 1, margin: "0 0 24px", color: "white" }}
        >
          {HERO_WORDS.map((word, i) => (
            <span key={i}>
              {word.lineBreakBefore && <br className="md:hidden" />}
              <span
                className={`hero-word${word.italic ? " hero-word-italic" : ""}`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {word.logoMark && (
                  <YLogoMark
                    // Match the heading's current font-size via em units
                    height="0.82em"
                    className="mr-[0.05em]"
                  />
                )}
                {word.text}
              </span>
              {i < HERO_WORDS.length - 1 && !HERO_WORDS[i + 1]?.lineBreakBefore && " "}
              {i < HERO_WORDS.length - 1 && HERO_WORDS[i + 1]?.lineBreakBefore && (
                <span className="hidden md:inline"> </span>
              )}
            </span>
          ))}
        </h1>

        {/* Subhead — 16px on mobile (was 18px) prevents awkward 2-line
            cramped wrap at 375px. 22px on md+ unchanged. */}
        <p
          className="text-[16px] md:text-[22px]"
          style={{ fontWeight: 400, lineHeight: 1.45, letterSpacing: "-0.005em", color: "rgba(255,255,255,0.75)", margin: "0 0 28px", maxWidth: "600px", textWrap: "balance" }}
        >
          Cocktails to start. Terrace to settle. Club to finish.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:items-stretch">
          {/* Primary CTA — magnetic on hover (JS-driven transform). */}
          <a
            ref={primaryCtaRef}
            href="#whats-on"
            className="hero-cta-primary group relative overflow-hidden inline-flex items-center justify-center gap-1.5 border border-white px-8 text-[18px] font-bold leading-6 active:scale-[0.98] w-full md:w-auto md:min-w-[180px]"
            style={{
              height: "58px",
              borderRadius: 0,
              backgroundColor: "rgb(255,255,255)",
              color: "rgb(18,18,18)",
              boxShadow: "0 8px 32px -8px rgba(255,255,255,0.18)",
              willChange: "transform",
            }}
          >
            <span aria-hidden="true" className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out pointer-events-none" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.07) 50%, transparent 100%)" }} />
            <span className="relative z-10">What&apos;s On</span>
            <ChevronRightIcon className="size-4 ml-1 relative z-10 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
          </a>

          {/* Secondary CTA — same sweep shimmer pattern as primary, in white. */}
          <a
            href="/venue-hire"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-1.5 px-6 text-[18px] font-bold leading-6 text-white hover:bg-white/10 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 motion-reduce:transition-none w-full md:w-auto md:min-w-[180px]"
            style={{ height: "50px", borderRadius: 0, backgroundColor: "transparent", border: "1.5px solid rgba(255,255,255,0.7)" }}
          >
            <span aria-hidden="true" className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out pointer-events-none" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)" }} />
            <span className="relative z-10">Hire the Venue</span>
            <ChevronRightIcon className="size-4 ml-1 relative z-10 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
          </a>

          {/* Click-to-call — mobile only. Direct dial from the hero gives
              nightlife visitors the fastest possible path to booking without
              leaving the page. Hidden on md+ where the tel: experience is
              less reliable and the venue-hire page handles enquiries better. */}
          <a
            href="tel:+441483342027"
            className="md:hidden group relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 text-[16px] font-bold leading-6 text-white active:scale-[0.98] transition-all duration-200 motion-reduce:transition-none w-full"
            style={{ height: "50px", borderRadius: 0, backgroundColor: "transparent", border: "1.5px solid rgba(255,255,255,0.5)" }}
          >
            <Phone size={16} aria-hidden="true" />
            <span>Call to book</span>
          </a>
        </div>

        {/* Web Share API — renders only when navigator.share is available
            (typically mobile Chrome, iOS Safari). Lets visitors share the
            venue page via their native share sheet. Zero third-party SDK. */}
        {hasShareAPI && (
          <button
            type="button"
            onClick={handleShare}
            className="md:hidden mt-3 inline-flex items-center gap-2 hover:text-white active:scale-[0.98] transition-all duration-200 motion-reduce:transition-none"
            style={{
              background: "transparent",
              border: "none",
              padding: "4px 0",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.55)",
            }}
          >
            <Share2 size={14} aria-hidden="true" />
            <span>Share this venue</span>
          </button>
        )}
      </div>

    </div>
  );
}
