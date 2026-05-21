"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronRightIcon } from "@/components/icons";
import { GRAIN_SVG as GRAIN } from "@/lib/grain";

/**
 * Home-page-only venue panels. Pixel-locked to the design the client
 * approved — small caps kicker (venue name with italic editorial Y),
 * prominent tagline H2, body, address, CTA in a specific stack.
 *
 * The /venues index page uses `<VenuePanel>` (a generic layout
 * primitive) which is similar but not identical. Kept separate
 * intentionally so any future tweak to the home page panels can't
 * accidentally drift the venue index — and vice-versa. A future
 * refactor could merge them once both surfaces are stable.
 *
 * Scroll behaviour (desktop only, motion-allowed only):
 *   Each panel pins on enter, then content reveals in staged scrub:
 *     kicker → heading → body → CTA
 *   Image scales 1.0 → 1.08 over the same pin (single-layer parallax).
 *   Mobile + prefers-reduced-motion users get an instant static render.
 */

interface VenuePanel {
  /** Anchor id for in-page deep links (e.g. /#y-club). Must be unique per panel. */
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
  /** Tailwind objectPosition class — gives each panel a distinct crop. */
  imagePosition: string;
  textLeft: boolean;
  light?: boolean;
  /** Days of the week the venue is open. 0=Sun, 5=Fri, 6=Sat.
   *  Drives the live status pill copy. */
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
    openDays: [5, 6], // Fri, Sat — confirmed in heading copy
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
    imagePosition: "object-bottom", // Sky-heavy image — anchor to bottom so the venue stays in frame
    textLeft: false,
    light: false,
    openDays: [4, 5, 6], // [CONFIRM with Michelle] Thu–Sat assumed
  },
  {
    slug: "y-bar-lounge",
    kicker: "Y Bar & Lounge",
    heading: "Where the night starts",
    body: "Cocktails, conversation, and the best warm-up for the night ahead.",
    address: "", // [CONFIRM] address with Michelle
    directionsUrl: "/",
    cta: "Explore Y Bar & Lounge",
    href: "/venues/y-bar-lounge",
    imageUrl: "/images/nadine-195.jpg",
    imageAlt: "Y Bar & Lounge",
    imagePosition: "object-[center_30%]", // Interior bar shot — anchor slightly above centre
    textLeft: true,
    light: false,
    openDays: [3, 4, 5, 6], // [CONFIRM with Michelle] Wed–Sat assumed
  },
];

/* ──────────────────────────────────────────────────────────────────────
   Day-aware status copy for the sticky pill. Computed client-side so
   it's always accurate without breaking SSR.
   ────────────────────────────────────────────────────────────────────── */
function getVenueStatus(now: Date, openDays: ReadonlyArray<number>): string {
  const day = now.getDay();
  if (openDays.includes(day)) return "Open tonight";

  // Find the next open day within the next 7
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

/* ──────────────────────────────────────────────────────────────────────
   Renders "Y Club" with the "Y" in the italic editorial face (birdie),
   matching the hero's "Y." treatment. Falls back gracefully if the
   string doesn't start with "Y".
   ────────────────────────────────────────────────────────────────────── */
function VenueName({ name }: { name: string }) {
  if (!name.startsWith("Y")) return <>{name}</>;
  const rest = name.slice(1);
  return (
    <>
      <span className="hero-word-italic">Y</span>
      {rest}
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   Map pin icon — primary affordance on the address line.
   ────────────────────────────────────────────────────────────────────── */
function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
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

type TextColumnProps = Pick<
  VenuePanel,
  "kicker" | "heading" | "body" | "address" | "directionsUrl" | "cta" | "href" | "light" | "openDays"
>;

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
}: TextColumnProps) {
  const bg        = light ? "bg-white"            : "bg-black";
  const kicCol    = light ? "text-black/70"        : "text-white/70";
  const headCol   = light ? "text-black"           : "text-white";
  const bodyCol   = light ? "text-black/65"        : "text-white/70";
  const addrCol   = light ? "text-black/65"        : "text-white/65";
  const btnBorder = light ? "border-black"         : "border-white";
  const btnText   = light ? "text-black"           : "text-white";
  const btnHover  = light ? "hover:bg-black hover:text-white" : "hover:bg-white hover:text-black";

  // Live status, computed client-side to stay SSR-stable.
  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLiveStatus(getVenueStatus(new Date(), openDays));
  }, [openDays]);

  return (
    /* Mobile: generous padding, auto height. Desktop: centred in full-height column */
    <div className={`${bg} flex flex-col justify-center px-6 py-12 md:px-20 md:h-full relative overflow-hidden`}>
      {/* Grain overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.025, backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
      />

      {/* Venue name — small caps kicker. The "Y" is rendered in the
          italic editorial face to mirror the hero's wordmark treatment. */}
      <p
        className={`panel-kicker relative mb-4 font-medium uppercase ${kicCol}`}
        style={{ fontSize: "13px", letterSpacing: "0.22em" }}
      >
        <VenueName name={kicker} />
      </p>

      {/* Heading (tagline) — the prominent H2 for the panel.
          Sized to dominate the visual hierarchy. */}
      <h2 className={`panel-heading text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight mb-5 relative ${headCol}`}>
        {heading}
      </h2>

      <p className={`panel-body text-base md:text-lg mb-6 relative max-w-[44ch] ${bodyCol}`}>
        {body}
      </p>

      {/* Only render the directions link when we have a real address. */}
      {address ? (
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`panel-address group inline-flex items-center gap-2 text-base md:text-lg mb-8 relative hover:opacity-100 transition-opacity duration-200 motion-reduce:transition-none ${addrCol}`}
        >
          <MapPinIcon className="opacity-70 group-hover:opacity-100 transition-opacity duration-200 shrink-0" />
          <span className="underline-offset-4 group-hover:underline">{address}</span>
        </a>
      ) : (
        // Preserve vertical rhythm when address is unavailable
        <div aria-hidden="true" className="mb-8" />
      )}

      {/* CTA — bordered outline that fills on hover.
          Chevron slides in from -12px on hover (overflow-hidden mask). */}
      <a
        href={href}
        className={`panel-cta group relative inline-flex items-center justify-center gap-2 border px-6 md:px-8 py-3 md:py-4 transition-colors duration-200 motion-reduce:transition-none w-full md:w-auto md:self-start ${btnBorder} ${btnText} ${btnHover}`}
      >
        <span>{cta}</span>
        <span aria-hidden="true" className="relative inline-block w-4 h-4 overflow-hidden">
          <ChevronRightIcon className="absolute inset-0 size-4 transition-transform duration-300 ease-out -translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-100" />
          <ChevronRightIcon className="absolute inset-0 size-4 transition-transform duration-300 ease-out group-hover:translate-x-3 group-hover:opacity-0 motion-reduce:hidden" />
        </span>
      </a>

      {/* Sticky day-aware status pill — bottom-right, frosted glass.
          Hidden on mobile where the panel stacks vertically. */}
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

function ImageColumn({
  imageUrl,
  imageAlt,
  imagePosition,
}: {
  imageUrl: string;
  imageAlt: string;
  imagePosition: string;
}) {
  return (
    /* Mobile: fixed height. Desktop: fills full panel height.
       overflow-hidden contains the parallax scale + hover-wash. */
    <div className="panel-image-wrap group/img relative h-72 md:h-full overflow-hidden">
      <div className="panel-image absolute inset-0 will-change-transform">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className={`${imagePosition}`}
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      {/* Hover-only colour wash — subtle accent tint applied via mix-blend-mode.
          Disabled under prefers-reduced-motion. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 motion-reduce:hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(74,222,128,0.18) 0%, rgba(56,189,248,0.10) 60%, transparent 100%)",
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}

export function LargeSignpostsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  /* Scroll-triggered effects (desktop, motion-allowed only):
       1. Staged content reveal — kicker → heading → body → address → CTA
          plays once when the panel enters viewport (no scrub, no lag).
       2. Image parallax — image scales 1.0 → 1.08 as the panel transitions
          through the viewport (scrub: true).
     Deliberately no pin. Multi-panel pin sequences create spacer gaps
     that flash white between panels — instead, panels scroll naturally
     and the reveal + parallax provide the visual rhythm. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const section = sectionRef.current;
    if (!section) return;

    let cleanup: (() => void) | undefined;

    /* Dynamic import keeps GSAP off the initial JS bundle for users
       who never hit a motion-allowed desktop session. */
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

        // Initial hidden state for the reveal sequence
        const targets = [kicker, heading, body, address, cta].filter(Boolean) as Element[];
        gsap.set(targets, { opacity: 0, y: 22 });

        // ── 1. Staged content reveal ────────────────────────────────
        // Plays once when the panel top reaches 70% down the viewport;
        // reverses on scroll-back so re-entry feels fresh.
        const revealTl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });

        if (kicker)  revealTl.to(kicker,  { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0);
        if (heading) revealTl.to(heading, { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }, 0.10);
        if (body)    revealTl.to(body,    { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0.22);
        if (address) revealTl.to(address, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.34);
        if (cta)     revealTl.to(cta,     { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.44);

        if (revealTl.scrollTrigger) triggers.push(revealTl.scrollTrigger);

        // ── 2. Image parallax ───────────────────────────────────────
        // Smoothly scales the image from 1.0 → 1.08 across the entire
        // window the panel is visible. Compositor-friendly (transform).
        if (image) {
          const parallax = gsap.fromTo(
            image,
            { scale: 1 },
            {
              scale: 1.08,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
          if (parallax.scrollTrigger) triggers.push(parallax.scrollTrigger);
        }
      });

      cleanup = () => {
        triggers.forEach((t) => t.kill());
      };
    })();

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-black">
      {panels.map((panel) => (
        /*
         * Mobile:  flex-col — image always on top, text below
         * Desktop: grid-cols-2 at full screen height (capped at 900px on tall
         *          displays so 4K monitors don't stretch each panel absurdly),
         *          textLeft controls order.
         *
         * bg-black on the panel container is belt-and-braces — guarantees
         * no white background bleeds through during scale/transform animations.
         */
        <div
          key={panel.slug}
          // Explicit slug — used for in-page anchors and stable across href changes
          id={panel.slug}
          className="venue-panel bg-black flex flex-col md:grid md:grid-cols-2 md:h-screen md:max-h-[900px]"
        >
          {panel.textLeft ? (
            <>
              {/* Mobile: image first (order-first), then text */}
              <div className="order-1 md:order-2">
                <ImageColumn imageUrl={panel.imageUrl} imageAlt={panel.imageAlt} imagePosition={panel.imagePosition} />
              </div>
              <div className="order-2 md:order-1">
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
                />
              </div>
            </>
          ) : (
            <>
              {/* Quadrant: image already first in DOM — correct for both mobile and desktop */}
              <ImageColumn imageUrl={panel.imageUrl} imageAlt={panel.imageAlt} imagePosition={panel.imagePosition} />
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
              />
            </>
          )}
        </div>
      ))}
    </section>
  );
}
