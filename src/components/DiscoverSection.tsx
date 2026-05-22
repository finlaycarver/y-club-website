"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowUpRight, X } from "lucide-react"

interface Signpost {
  title: string
  subtitle?: string
  imageUrl: string
  href: string
  wide?: boolean
  imagePosition?: string
  /** Preload the image (above-the-fold tiles on first paint). */
  priority?: boolean
}

const signposts: Signpost[] = [
  // Row 1 — wide left. First-row tiles preload to improve LCP.
  { title: "Y Club",            subtitle: "Late nights, big floors",          imageUrl: "/images/club-y-image-5.webp",    href: "/venues/y-club",    wide: true, priority: true },
  { title: "Y Terrace",         subtitle: "Outdoor terrace under the stars",  imageUrl: "/images/10.webp",                href: "/venues/y-terrace",             priority: true },
  { title: "The Line-up",       subtitle: "Every Friday and Saturday",        imageUrl: "/images/club-y-image-6.webp",    href: "/whats-on",                     priority: true },
  // Row 2 — wide middle
  { title: "Birthdays",         subtitle: "Tables, hosts & bottle service",   imageUrl: "/images/img-0961.jpeg",          href: "/venue-hire" },
  { title: "Venue Hire",        subtitle: "Up to 1,500 capacity",             imageUrl: "/images/nadine-195.jpg",         href: "/venue-hire",       wide: true },
  { title: "Student Nights",    subtitle: "Midweek with Surrey Uni",          imageUrl: "/images/img-0841.jpeg",          href: "/whats-on" },
  // Row 3 — wide right
  { title: "Bottle Service",    subtitle: "Premium tables in the club",       imageUrl: "/images/tempimage0cgvsr.jpg",    href: "/venue-hire" },
  // [CONFIRM] swap to evening sports / indoor crowd image when Y delivers assets
  { title: "Sports Screening",  subtitle: "Big games on the big screen",      imageUrl: "/images/tempimagetpo0ye5.webp",  href: "/whats-on" },
  { title: "Christmas Parties", subtitle: "Book your festive night",          imageUrl: "/images/img-1907.jpg",           href: "/venue-hire",       wide: true, imagePosition: "right center" },
]

// ── SignpostCard ────────────────────────────────────────────────────
function SignpostCard({
  title,
  subtitle,
  imageUrl,
  href,
  wide,
  imagePosition,
  priority,
  index,
  onMobileTap,
}: Signpost & { index: number; onMobileTap: () => void }) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const rafRef  = useRef<number | null>(null)

  // 3D card tilt — wide tiles only, pointer-fine (desktop) only, no reduced-motion.
  // pointer:fine already excludes touch; no separate mobile guard needed.
  useEffect(() => {
    const card = cardRef.current
    if (!card || !wide) return
    if (!window.matchMedia("(pointer: fine)").matches) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const onMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect()
        const dx   = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2)
        const dy   = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2)
        card.style.transition = "transform 0.08s ease-out"
        card.style.transform  = `perspective(1200px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`
      })
    }

    const onLeave = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      card.style.transition = "transform 0.5s ease-out"
      card.style.transform  = "perspective(1200px) rotateX(0deg) rotateY(0deg)"
    }

    card.addEventListener("mousemove", onMove)
    card.addEventListener("mouseleave", onLeave)
    return () => {
      card.removeEventListener("mousemove", onMove)
      card.removeEventListener("mouseleave", onLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [wide])

  // Wide tiles get a larger title at desktop to mirror tile-size hierarchy.
  // 42px wide vs 28px regular gives clear visual weight separation.
  const titleSizeClass = wide ? "text-[28px] lg:text-[42px]" : "text-[28px]"
  const numeral = String(index + 1).padStart(2, "0")

  function handleClick(e: React.MouseEvent) {
    // On touch/coarse devices: intercept the tap and open the bottom sheet.
    // Desktop pointer-fine users navigate normally via the href.
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      e.preventDefault()
      onMobileTap()
    }
  }

  return (
    <a
      ref={cardRef}
      href={href}
      onClick={handleClick}
      className={`discover-tile group relative block overflow-hidden cursor-pointer${wide ? " lg:col-span-2" : ""}`}
      style={{
        textDecoration: "none",
        // hint compositor for GPU layer on tilt-capable tiles
        willChange: wide ? "transform" : undefined,
      } as React.CSSProperties}
    >
      {/* Background image */}
      <Image
        fill
        priority={priority}
        src={imageUrl}
        alt={title}
        style={{ objectFit: "cover", objectPosition: imagePosition ?? "center" }}
        className="transition-transform duration-500 ease-out group-hover:scale-105"
        sizes={
          wide
            ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        }
      />

      {/* Gradient overlay — stronger bottom-up for title legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(transparent 40%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.8) 100%)",
          zIndex: 1,
        }}
      />

      {/* Hover darkening layer */}
      <div
        className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500"
        style={{ zIndex: 1 }}
      />

      {/* Editorial numeral counter — top-left */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "14px",
          left: "16px",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.28)",
          zIndex: 3,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {numeral}
      </span>

      {/* Text overlay — lifts on hover */}
      <div
        className="transition-transform duration-300 ease-out group-hover:-translate-y-1 motion-reduce:transition-none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px",
          zIndex: 2,
        }}
      >
        <h3
          className={titleSizeClass}
          style={{
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "white",
            margin: 0,
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            style={{
              fontSize: "16px",
              fontWeight: 450,
              lineHeight: "24px",
              letterSpacing: "0.48px",
              color: "rgba(255,255,255,0.75)",
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Arrow affordance — 28px on mobile for easier tap target, 24px on desktop */}
      <div
        className="absolute text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
        style={{ bottom: "16px", right: "16px", zIndex: 3 }}
      >
        <ArrowUpRight size={28} className="md:hidden" aria-hidden="true" />
        <ArrowUpRight size={24} className="hidden md:block" aria-hidden="true" />
      </div>
    </a>
  )
}

// ── DiscoverSection ─────────────────────────────────────────────────
export function DiscoverSection() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [activeSheet, setActiveSheet] = useState<Signpost | null>(null)

  // Body scroll lock while bottom sheet is open
  useEffect(() => {
    document.body.style.overflow = activeSheet ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [activeSheet])

  // Stagger entrance — IntersectionObserver adds .discover-visible to the
  // grid when it enters the viewport. CSS nth-child delays then cascade
  // the tile animations 80ms apart.
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          grid.classList.add("discover-visible")
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(grid)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      className="px-4 md:px-24"
      style={{
        paddingTop: "48px",
        paddingBottom: "48px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#080808",
      }}
    >
      <div style={{ width: "100%" }}>
        {/* Kicker — letter-spacing widened for stronger all-caps rhythm */}
        <p style={{
          fontSize: "13px",
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(8,8,8,0.45)",
          margin: "0 0 14px",
        }}>
          Inside Y
        </p>

        <h2
          className="text-[36px] md:text-[67px]"
          style={{
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "0.67px",
            color: "#080808",
            margin: "0 0 32px",
          }}
        >
          Discover Y
        </h2>

        {/* Grid on desktop / horizontal scroll carousel on mobile.
            discover-carousel-mobile (globals.css) overrides display:grid
            with display:flex + scroll-snap-type:x mandatory on <768px. */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 discover-grid discover-carousel-mobile"
          style={{ columnGap: "20px", rowGap: "30px" }}
        >
          {signposts.map((signpost, i) => (
            <SignpostCard
              key={signpost.title}
              {...signpost}
              index={i}
              onMobileTap={() => setActiveSheet(signpost)}
            />
          ))}
        </div>
      </div>

      {/* ── Mobile bottom sheet ──────────────────────────────────────── */}
      {/* Tap backdrop to dismiss. md:hidden — never shown on desktop. */}
      {activeSheet && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setActiveSheet(null)}
          style={{ background: "rgba(0,0,0,0.65)" }}
        >
          <div
            className="absolute bottom-0 left-0 right-0"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0c0c0c",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              padding: "20px 24px 48px",
            }}
          >
            {/* Drag handle */}
            <div
              aria-hidden="true"
              className="mx-auto mb-5 h-1 w-10 rounded-full"
              style={{ background: "rgba(255,255,255,0.18)" }}
            />

            {/* Close button */}
            <button
              type="button"
              aria-label="Close"
              onClick={() => setActiveSheet(null)}
              className="absolute top-4 right-4 flex items-center justify-center"
              style={{
                width: "36px",
                height: "36px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "50%",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>

            {/* Content */}
            <p style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "8px",
            }}>
              Discover
            </p>
            <h3 style={{
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#FAFAFA",
              margin: "0 0 6px",
            }}>
              {activeSheet.title}
            </h3>
            {activeSheet.subtitle && (
              <p style={{
                fontSize: "15px",
                color: "rgba(255,255,255,0.5)",
                marginBottom: "24px",
                lineHeight: "1.5",
              }}>
                {activeSheet.subtitle}
              </p>
            )}

            {/* Navigation CTA */}
            <a
              href={activeSheet.href}
              className="flex items-center justify-center gap-2 w-full transition-opacity duration-150 active:opacity-75"
              style={{
                padding: "16px 24px",
                background: "#FAFAFA",
                color: "#080808",
                fontWeight: 700,
                fontSize: "14px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Explore {activeSheet.title}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </section>
  )
}
