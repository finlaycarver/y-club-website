import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { VenueVideo } from "@/components/VenueVideo";
import { ChevronRightIcon } from "@/components/icons";
import { GRAIN_SVG } from "@/lib/grain";

/**
 * Shared layout for venue detail pages (Y Club, Y Terrace, Y Bar & Lounge).
 *
 * Each venue page passes a single `config` object describing its hero,
 * overview, specs, video, photos, address treatment, and hire CTA.
 *
 * The two address variants accommodate venues with a public street
 * address ("street") vs venues routing visitors via the contact page
 * ("contact") — used for Y Bar & Lounge until Michelle confirms the
 * street address.
 */

interface SpecItem {
  label: string;
  value: string;
}

interface PhotoItem {
  src: string;
  alt: string;
}

type AddressVariant =
  | {
      variant: "street";
      kicker: string;
      title: ReactNode;
      postalLine: string;
      directionsUrl: string;
    }
  | {
      variant: "contact";
      kicker: string;
      title: ReactNode;
      body: string;
      contactHref: string;
    };

export interface VenueLayoutConfig {
  hero: {
    imageSrc: string;
    imageAlt: string;
    kicker: string;
    /** ReactNode so venues can use <br/> in the headline (e.g. "Y Bar / & Lounge"). */
    title: ReactNode;
    subhead: string;
    primaryCta?: { href: string; label: string };
    secondaryCta?: { href: string; label: string };
  };
  overview: {
    kicker: string;
    heading: string;
    paragraphs: ReadonlyArray<string>;
  };
  specs: ReadonlyArray<SpecItem>;
  /**
   * Visual weight of the spec values:
   * - "numeric" — 44px display (default when all values look like short numbers/Fri+Sat).
   * - "text"    — 28px weight (when values are words: "Bar", "Lounge", etc.).
   */
  specsStyle: "numeric" | "text";
  video: {
    src: string;
    posterSrc: string;
    kicker: string;
    caption: string;
  };
  photos: ReadonlyArray<PhotoItem>;
  /**
   * - "feature" (default for 6 photos): 3-col grid, first photo spans 2 rows.
   * - "split"  : 2-col grid, first photo spans 2 rows (used for 4 photos).
   * - "row"    : 3-col grid, all uniform (used for 3 photos).
   */
  photoLayout: "feature" | "split" | "row";
  address: AddressVariant;
  hire: {
    kicker?: string;
    heading: string;
    body: string;
  };
}

const ENTRY_RULES: ReadonlyArray<string> = [
  "Over 18s only — valid ID required",
  "No tracksuits, hoodies, or sportswear",
  "Smart-casual dress code enforced",
  "Bag searches on entry",
  "Zero tolerance on drugs",
];

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

export function VenueLayout({ config }: { config: VenueLayoutConfig }) {
  const primaryCta = config.hero.primaryCta ?? { href: "/whats-on",   label: "See What's On" };
  const secondaryCta = config.hero.secondaryCta ?? { href: "/venue-hire", label: "Hire the Venue" };

  return (
    <main id="main-content">

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section
        className="relative bg-black overflow-hidden"
        style={{ minHeight: "100svh" }}
      >
        <Image
          src={config.hero.imageSrc}
          alt={config.hero.imageAlt}
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.9) 100%)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0.03, backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
        />

        <div className="absolute left-6 md:left-16 text-white" style={{ bottom: "80px" }}>
          <p style={{
            fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "18px",
          }}>
            {config.hero.kicker}
          </p>
          <h1
            className="text-[52px] md:text-[90px]"
            style={{ fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em", marginBottom: "24px" }}
          >
            {config.hero.title}
          </h1>
          <p
            className="text-[18px] md:text-[22px]"
            style={{
              fontWeight: 400, color: "rgba(255,255,255,0.75)",
              marginBottom: "36px", maxWidth: "520px", lineHeight: 1.4,
            }}
          >
            {config.hero.subhead}
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <Link
              href={primaryCta.href}
              className="group inline-flex items-center justify-center gap-2 border border-white px-6 text-[17px] font-bold hover:-translate-y-0.5 transition-transform duration-200 motion-reduce:transition-none bg-white text-black w-full md:w-auto"
              style={{ height: "50px" }}
            >
              {primaryCta.label}
              <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
            </Link>
            <Link
              href={secondaryCta.href}
              className="group inline-flex items-center justify-center gap-2 border border-white/60 px-6 text-[17px] font-bold text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200 motion-reduce:transition-none w-full md:w-auto"
              style={{ height: "50px" }}
            >
              {secondaryCta.label}
              <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── OVERVIEW + SPECS ───────────────────────────────────────── */}
      <section
        id="overview"
        className="bg-black text-white scroll-mt-20"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20"
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 24px" }}
        >
          <div>
            <p style={{
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "20px",
            }}>
              {config.overview.kicker}
            </p>
            <h2
              className="text-[36px] md:text-[50px]"
              style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: "24px" }}
            >
              {config.overview.heading}
            </h2>
            {config.overview.paragraphs.map((paragraph, i) => (
              <p
                key={i}
                style={{
                  fontSize: "18px",
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: "1.75",
                  marginBottom: i === config.overview.paragraphs.length - 1 ? 0 : "16px",
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div
            className="grid grid-cols-2"
            style={{ border: "1px solid rgba(255,255,255,0.1)", alignSelf: "start" }}
          >
            {config.specs.map(({ label, value }) => (
              <div
                key={label}
                style={{
                  padding: "28px 24px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  borderRight: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p style={{
                  fontSize: config.specsStyle === "numeric" ? "44px" : "28px",
                  fontWeight: 700,
                  lineHeight: config.specsStyle === "numeric" ? 1 : 1.2,
                  color: "#FAFAFA",
                  marginBottom: "8px",
                }}>
                  {value}
                </p>
                <p style={{
                  fontSize: "12px", fontWeight: 500, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.4)",
                }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VENUE LOOP ─────────────────────────────────────────────── */}
      <div id="video" className="scroll-mt-20">
        <VenueVideo
          src={config.video.src}
          posterSrc={config.video.posterSrc}
          kicker={config.video.kicker}
          caption={config.video.caption}
        />
      </div>

      {/* ── PHOTO GRID ─────────────────────────────────────────────── */}
      <div id="photos" className="scroll-mt-20">
        <PhotoGrid photos={config.photos} layout={config.photoLayout} />
      </div>

      {/* ── ADDRESS + ENTRY ────────────────────────────────────────── */}
      <section
        id="address"
        className="bg-black text-white scroll-mt-20"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "80px 24px" }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <AddressBlock address={config.address} />

          <div>
            <p style={{
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "20px",
            }}>
              Entry
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {ENTRY_RULES.map((rule) => (
                <li
                  key={rule}
                  style={{
                    fontSize: "17px",
                    color: "rgba(255,255,255,0.6)",
                    padding: "14px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    lineHeight: "1.5",
                  }}
                >
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── HIRE CTA ───────────────────────────────────────────────── */}
      <section id="hire" className="bg-white text-black scroll-mt-20" style={{ padding: "80px 24px" }}>
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <div>
            <p style={{
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "16px",
            }}>
              {config.hire.kicker ?? "Private Hire"}
            </p>
            <h2
              className="text-[36px] md:text-[50px]"
              style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em" }}
            >
              {config.hire.heading}
            </h2>
            <p style={{
              fontSize: "18px", color: "rgba(0,0,0,0.55)",
              marginTop: "16px", maxWidth: "460px", lineHeight: "1.65",
            }}>
              {config.hire.body}
            </p>
          </div>
          <Link
            href="/venue-hire"
            className="group inline-flex items-center justify-center gap-2 border border-black px-8 text-[17px] font-bold text-black hover:bg-black hover:text-white transition-colors duration-200 motion-reduce:transition-none shrink-0"
            style={{ height: "54px" }}
          >
            Enquire About Hire
            <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
          </Link>
        </div>
      </section>

    </main>
  );
}

// ─── Subcomponents ──────────────────────────────────────────────────

/**
 * Photo grid with three layout modes, picked per venue based on the
 * shape and count of photos available. Visual inconsistency across
 * venues is INTENTIONAL — each venue's grid was tuned to its own asset
 * set rather than forced into a uniform template.
 *
 *  - "feature" — Y Club:    6 photos, 3-col, first photo 1:1 spanning 2 rows
 *  - "split"   — Y Terrace: 4 photos, 2-col, first photo 3:4 spanning 2 rows
 *  - "row"     — Y Bar:     3 photos, uniform 3-col, 3:4 aspect
 */
function PhotoGrid({
  photos,
  layout,
}: {
  photos: ReadonlyArray<PhotoItem>;
  layout: "feature" | "split" | "row";
}) {
  // "row" — uniform 3-col, 3:4 aspect per cell (Y Bar & Lounge)
  if (layout === "row") {
    return (
      <section className="bg-black" style={{ paddingBottom: "2px" }}>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "2px" }}>
          {photos.map((photo) => (
            <div
              key={photo.src}
              className="relative overflow-hidden"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // "split" — 2-col grid with feature photo spanning 2 rows (Y Terrace, 4 photos)
  if (layout === "split") {
    return (
      <section className="bg-black" style={{ paddingBottom: "2px" }}>
        <div className="grid grid-cols-2" style={{ gap: "2px" }}>
          {photos.map((photo, i) => (
            <div
              key={photo.src}
              className={`relative overflow-hidden${i === 0 ? " row-span-2" : ""}`}
              style={{ aspectRatio: i === 0 ? "3/4" : "4/3" }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                style={{ objectFit: "cover" }}
                sizes="50vw"
                className="hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // "feature" — 3-col grid with feature photo spanning 2 rows (Y Club, 6 photos)
  return (
    <section className="bg-black" style={{ paddingBottom: "2px" }}>
      <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: "2px" }}>
        {photos.map((photo, i) => (
          <div
            key={photo.src}
            className={`relative overflow-hidden${i === 0 ? " col-span-2 md:col-span-1 row-span-2" : ""}`}
            style={{ aspectRatio: i === 0 ? "1/1" : "4/3" }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 50vw, 33vw"
              className="hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function AddressBlock({ address }: { address: AddressVariant }) {
  return (
    <div>
      <p style={{
        fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
        textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "20px",
      }}>
        {address.kicker}
      </p>
      {/* Promoted from h3 → h2 so each major section starts at the same
          depth (overview h2 / address h2 / hire h2). */}
      <h2 style={{ fontSize: "34px", fontWeight: 700, lineHeight: 1.1, marginBottom: "12px" }}>
        {address.title}
      </h2>

      {address.variant === "street" ? (
        <>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", marginBottom: "36px" }}>
            {address.postalLine}
          </p>
          <a
            href={address.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 border border-white/30 px-6 py-3 text-[15px] font-bold text-white hover:border-white hover:bg-white hover:text-black transition-all duration-200 motion-reduce:transition-none"
          >
            Get Directions
            <ExternalLinkIcon />
            {/* Visually-hidden for screen readers; sighted users see the icon. */}
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </>
      ) : (
        <>
          <p style={{
            fontSize: "18px", color: "rgba(255,255,255,0.55)",
            marginBottom: "36px", lineHeight: 1.55, maxWidth: "400px",
          }}>
            {address.body}
          </p>
          <Link
            href={address.contactHref}
            className="group inline-flex items-center gap-2 border border-white/30 px-6 py-3 text-[15px] font-bold text-white hover:border-white hover:bg-white hover:text-black transition-all duration-200 motion-reduce:transition-none"
          >
            Contact Us
            <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
          </Link>
        </>
      )}
    </div>
  );
}
