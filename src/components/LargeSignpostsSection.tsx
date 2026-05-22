"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronRightIcon } from "@/components/icons";
import { YLogoMark } from "@/components/YLogoMark";
import { GRAIN_SVG as GRAIN } from "@/lib/grain";

/**
 * Home-page-only venue panels.
 *
 * Mobile  — Full-bleed image with text overlay at the bottom. Each panel
 *           is h-[100svh] so users see one venue at a time (was ~2 viewports).
 *           Address row hidden (wraps to 2 lines on 375px). CTA always visible
 *           at panel foot (no scroll needed to reach it). Tap-ripple feedback
 *           via .panel-cta-mobile (globals.css). Pagination dots driven by
 *           IntersectionObserver. GSAP parallax skipped (heavy on mobile).
 *
 * Desktop — Unchanged: grid-cols-2, staged GSAP reveal + image parallax.
 */

interface VenuePanel {
  slug: string;
  kicker: string;
  heading: string;
  body: string;
  address: string;
  directionsUrl: string;
  cta: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
  imagePosition: string;
  textLeft: boolean;
  light?: boolean;
  openDays: ReadonlyArray<number>;
}

const panels: VenuePanel[] = [
  {
    slug: "y-club",
    kicker: "Y Club",
    heading: "Where the night goes loud",
    body: "Big floors. Big sound. Open late every Friday and Saturday.",
    address: "Onslow Street, Guildford GU1 4SQ",
    directionsUrl: "https://maps.google.com/?q=Y+Club+Corner+House+Onslow+Street+Guildford",
    cta: "Explore Y Club",
    href: "/venues/y-club",
    imageUrl: "/images/12.webp",
    imageAlt: "Y Club",
    imagePosition: "object-center",
    textLeft: true,
    light: false,
    openDays: [5, 6],
  },
  {
    slug: "y-terrace",
    kicker: "Y Terrace",
    heading: "Open-air. All season",
    body: "Guildford's outdoor terrace. Cocktails, sport on the big screen, late summer evenings.",
    address: "2–4 The Quadrant, Bridge Street, Guildford GU1 4SG",
    directionsUrl: "https://maps.google.com/?q=Y+Guildford+Unit+2-4+The+Quadrant+Bridge+Street+Guildford+GU1+4SG",
    cta: "Explore Y Terrace",
    href: "/venues/y-terrace",
    imageUrl: "/images/club-y-image-4.webp",
    imageAlt: "Y Terrace",
    imagePosition: "object-bottom",
    textLeft: false,
    light: false,
    openDays: [4, 5, 6],
  },
  {
    slug: "y-bar-lounge",
    kicker: "Y Bar & Lounge",
    heading: "Where the night starts",
    body: "Cocktails, conversation, and the best warm-up for the night ahead.",
    address: "",
    directionsUrl: "/",
    cta: "Explore Y Bar & Lounge",
    href: "/venues/y-bar-lounge",
    imageUrl: "/images/nadine-195.jpg",
    imageAlt: "Y Bar & Lounge",
    imagePosition: "object-[center_30%]",
    textLeft: true,
    light: false,
    openDays: [3, 4, 5, 6],
  },
];

/* ── Day-aware status copy ─────────────────────────────────────────── */
function getVenueStatus(now: Date, openDays: ReadonlyArray<number>): string {
  const day = now.getDay();
  if (openDays.includes(day)) return "Open tonight";
  for (let i = 1; i <= 7; i += 1) {
    const next = (day + i) % 7;
    if (openDays.includes(next)) {
      if (i === 1) return "Open tomorrow";
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return `Open ${dayNames[next]}`;
    }
  }
  return "Open this weekend";
}

/* ── Italic "Y" in kicker ──────────────────────────────────────────── */
function VenueName({ name }: { name: string }) {
  if (!name.startsWith("Y")) return <>{name}</>;
  const rest = name.slice(1);
  return (
    <>
      <YLogoMark height="0.75em" className="mr-[0.06em]" />
      {rest}
    </>
  );
}

/* ── Map pin icon — increased from 16→20 for better tap target ────── */
function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/* ── TextColumn ────────────────────────────────────────────────────── */
type TextColumnProps = Pick<
  VenuePanel,
  "kicker" | "heading" | "body" | "address" | "directionsUrl" | "cta" | "href" | "light" | "openDays"
> & {
  /**
   * When true, the column is absolutely positioned over the full-bleed
   * image (mobile layout). Background is transparent, address is hidden
   * (wraps awkwardly at 375px), CTA gets the tap-ripple class.
   */
  mobileOverlay?: boolean;
};

function TextColumn({
  kicker,
  heading,
  body,
  address,
  directionsUrl,
  cta,
  href,
  light,
  openDays,
  mobileOverlay,
}: TextColumnProps) {
  const bg        = mobileOverlay
    ? (light ? "bg-transparent md:bg-white"  : "bg-transparent md:bg-black")
    : (light ? "bg-white"                    : "bg-black");
  const kicCol    = light ? "text-black/70"  : "text-white/70";
  const headCol   = light ? "text-black"     : "text-white";
  const bodyCol   = light ? "text-black/65"  : "text-white/70";
  const addrCol   = light ? "text-black/65"  : "text-white/65";
  const btnBorder = light ? "border-black"   : "border-white";
  const btnText   = light ? "text-black"     : "text-white";
  const btnHover  = light ? "hover:bg-black hover:text-white" : "hover:bg-white hover:text-black";

  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLiveStatus(getVenueStatus(new Date(), openDays));
  }, [openDays]);

  return (
    <div
      className={[
        bg,
        "flex flex-col relative overflow-hidden",
        // Mobile overlay: anchored to bottom, no top padding, safe bottom inset.
        // Desktop: centred in full-height split column.
        mobileOverlay
          ? "justify-end px-6 pb-8 pt-6 md:justify-center md:py-12 md:px-20 md:h-full"
          : "justify-center px-6 py-8 md:py-12 md:px-20 md:h-full",
      ].join(" ")}
    >
      {/* Grain overlay — on mobile overlay, sits on top of the gradient
          scrim below for a consistent texture. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.025, backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
      />

      {/* Kicker */}
      <p
        className={`panel-kicker relative mb-3 md:mb-4 font-medium uppercase ${kicCol}`}
        style={{ fontSize: "13px", letterSpacing: "0.22em" }}
      >
        <VenueName name={kicker} />
      </p>

      {/* Heading — text-3xl on mobile overlay (fits one line at 375px),
          text-4xl→text-6xl on desktop */}
      <h2
        className={[
          "panel-heading font-bold leading-[1.05] tracking-tight mb-4 md:mb-5 relative",
          mobileOverlay ? "text-3xl md:text-4xl md:text-6xl" : "text-4xl md:text-6xl",
          headCol,
        ].join(" ")}
      >
        {heading}
      </h2>

      <p className={`panel-body text-base md:text-lg mb-5 md:mb-6 relative max-w-[44ch] ${bodyCol}`}>
        {body}
      </p>

      {/* Address — hidden on mobile overlay (wraps to 2 lines at 375px and
          adds noise when text is floating over an image). Visible on desktop. */}
      {address ? (
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            "panel-address group items-center gap-2 text-base md:text-lg mb-8 relative",
            "hover:opacity-100 transition-opacity duration-200 motion-reduce:transition-none",
            addrCol,
            mobileOverlay ? "hidden md:inline-flex" : "inline-flex",
          ].join(" ")}
        >
          <MapPinIcon className="opacity-70 group-hover:opacity-100 transition-opacity duration-200 shrink-0" />
          <span className="underline-offset-4 group-hover:underline">{address}</span>
        </a>
      ) : (
        // Preserve rhythm only on desktop where there IS a text column background
        !mobileOverlay && <div aria-hidden="true" className="mb-8" />
      )}

      {/* CTA — panel-cta-mobile triggers the tap ripple (globals.css).
          Full-width on mobile (fills overlay foot), auto-width on desktop. */}
      <a
        href={href}
        className={[
          "panel-cta group relative inline-flex items-center justify-center gap-2 border",
          "px-6 md:px-8 py-3 md:py-4",
          "transition-colors duration-200 motion-reduce:transition-none",
          "w-full md:w-auto md:self-start",
          mobileOverlay ? "panel-cta-mobile" : "",
          btnBorder, btnText, btnHover,
        ].join(" ")}
      >
        <span>{cta}</span>
        <span aria-hidden="true" className="relative inline-block w-4 h-4 overflow-hidden">
          <ChevronRightIcon className="absolute inset-0 size-4 transition-transform duration-300 ease-out -translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100" />
          <ChevronRightIcon className="absolute inset-0 size-4 transition-transform duration-300 ease-out group-hover:translate-x-3 group-hover:opacity-0 motion-reduce:hidden" />
        </span>
      </a>

      {/* Day-aware status pill — desktop only */}
      {liveStatus && (
        <div
          aria-hidden="true"
          className="hidden md:flex absolute bottom-6 right-6 items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-white/8 border border-white/15 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {liveStatus}
        </div>
      )}
    </div>
  );
}

/* ── ImageColumn ───────────────────────────────────────────────────── */
function ImageColumn({
  imageUrl,
  imageAlt,
  imagePosition,
  mobileFullBleed,
}: {
  imageUrl: string;
  imageAlt: string;
  imagePosition: string;
  mobileFullBleed?: boolean;
}) {
  return (
    /* mobileFullBleed: h-full fills the absolute-inset-0 parent (= panel height).
       Default: h-52 mobile stacked image, md:h-full fills the desktop grid column. */
    <div className={`panel-image-wrap group/img relative overflow-hidden ${mobileFullBleed ? "h-full" : "h-52 md:h-full"}`}>
      <div className="panel-image absolute inset-0 will-change-transform">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className={imagePosition}
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      {/* Hover colour wash — desktop only */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 motion-reduce:hidden"
        style={{
          background: "linear-gradient(135deg, rgba(74,222,128,0.18) 0%, rgba(56,189,248,0.10) 60%, transparent 100%)",
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}

/* ── LargeSignpostsSection ─────────────────────────────────────────── */
export function LargeSignpostsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // ── Desktop GSAP: staged reveal + image parallax ─────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const section = sectionRef.current;
    if (!section) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const panelEls = Array.from(section.querySelectorAll<HTMLElement>(".venue-panel"));
      const triggers: Array<{ kill: () => void }> = [];

      panelEls.forEach((panel) => {
        const kicker  = panel.querySelector(".panel-kicker");
        const heading = panel.querySelector(".panel-heading");
        const body    = panel.querySelector(".panel-body");
        const address = panel.querySelector(".panel-address");
        const cta     = panel.querySelector(".panel-cta");
        const image   = panel.querySelector(".panel-image");

        const targets = [kicker, heading, body, address, cta].filter(Boolean) as Element[];
        gsap.set(targets, { opacity: 0, y: 22 });

        const revealTl = gsap.timeline({
          scrollTrigger: { trigger: panel, start: "top 70%", toggleActions: "play none none reverse" },
        });
        if (kicker)  revealTl.to(kicker,  { opacity: 1, y: 0, duration: 0.5,  ease: "power2.out" }, 0);
        if (heading) revealTl.to(heading, { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }, 0.10);
        if (body)    revealTl.to(body,    { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0.22);
        if (address) revealTl.to(address, { opacity: 1, y: 0, duration: 0.5,  ease: "power2.out" }, 0.34);
        if (cta)     revealTl.to(cta,     { opacity: 1, y: 0, duration: 0.5,  ease: "power2.out" }, 0.44);
        if (revealTl.scrollTrigger) triggers.push(revealTl.scrollTrigger);

        if (image) {
          const parallax = gsap.fromTo(
            image,
            { scale: 1 },
            { scale: 1.08, ease: "none", scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true } }
          );
          if (parallax.scrollTrigger) triggers.push(parallax.scrollTrigger);
        }
      });

      cleanup = () => triggers.forEach((t) => t.kill());
    })();

    return () => { cleanup?.(); };
  }, []);

  // ── Mobile: pagination dots via IntersectionObserver ─────────────
  const [activePanelIndex, setActivePanelIndex] = useState(0);
  const [showDots, setShowDots]                 = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 768px)").matches) return;

    const section = sectionRef.current;
    if (!section) return;

    const panelEls = Array.from(section.querySelectorAll<HTMLElement>(".venue-panel"));

    // Show dots when any part of the section is visible
    const sectionObs = new IntersectionObserver(
      ([entry]) => setShowDots(entry.isIntersecting),
      { threshold: 0 },
    );
    sectionObs.observe(section);

    // Track which panel is ≥50% visible
    const panelObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = panelEls.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActivePanelIndex(idx);
          }
        });
      },
      { threshold: 0.5 },
    );
    panelEls.forEach((p) => panelObs.observe(p));

    return () => {
      sectionObs.disconnect();
      panelObs.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-black">
      {panels.map((panel) => (
        /*
         * Mobile:  position:relative, h-[100svh] — image fills the whole panel
         *          via absolute:inset-0 wrapper; gradient scrim over image; text
         *          column absolutely anchored to panel bottom. 1 viewport = 1 venue.
         *
         * Desktop: md:grid-cols-2 at screen height (capped at 900px). Image and
         *          text sit in separate columns; GSAP handles entrance + parallax.
         */
        <div
          key={panel.slug}
          id={panel.slug}
          className="venue-panel relative bg-black overflow-hidden h-[100svh] md:h-screen md:max-h-[900px] md:grid md:grid-cols-2"
        >
          {/* ── Image layer ────────────────────────────────────────── */}
          {/* Mobile: absolute-inset fills the panel. Desktop: grid column. */}
          <div
            className={[
              "absolute inset-0",
              "md:static md:inset-auto",
              panel.textLeft ? "md:order-2" : "md:order-1",
            ].join(" ")}
          >
            <ImageColumn
              imageUrl={panel.imageUrl}
              imageAlt={panel.imageAlt}
              imagePosition={panel.imagePosition}
              mobileFullBleed
            />
          </div>

          {/* ── Gradient scrim — mobile only ──────────────────────── */}
          {/* Gives enough contrast for white text at the panel foot. */}
          <div
            className="absolute inset-0 md:hidden pointer-events-none"
            aria-hidden="true"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 15%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.94) 100%)",
            }}
          />

          {/* ── Text column ────────────────────────────────────────── */}
          {/* Mobile: absolute, anchored to panel bottom (always in view).
              Desktop: static grid column, vertically centred. */}
          <div
            className={[
              "absolute bottom-0 left-0 right-0 z-[2]",
              "md:static md:inset-auto md:z-auto",
              panel.textLeft ? "md:order-1" : "md:order-2",
            ].join(" ")}
          >
            <TextColumn
              kicker={panel.kicker}
              heading={panel.heading}
              body={panel.body}
              address={panel.address}
              directionsUrl={panel.directionsUrl}
              cta={panel.cta}
              href={panel.href}
              light={panel.light}
              openDays={panel.openDays}
              mobileOverlay
            />
          </div>
        </div>
      ))}

      {/* ── Pagination dots (mobile only) ─────────────────────────── */}
      {/* Fixed at bottom-centre. Pill shape when active, dot when idle. */}
      <div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20 md:hidden transition-opacity duration-300 motion-reduce:transition-none"
        style={{ opacity: showDots ? 1 : 0, pointerEvents: "none" }}
        aria-hidden="true"
      >
        {panels.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300 motion-reduce:transition-none"
            style={{
              width:      i === activePanelIndex ? "22px" : "6px",
              height:     "6px",
              background: i === activePanelIndex ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.28)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
