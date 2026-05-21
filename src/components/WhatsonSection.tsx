"use client"

import { useState, useRef, useEffect, useSyncExternalStore } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons"
import { GRAIN_SVG } from "@/lib/grain"

interface EventItem {
  title: string
  venue: string
  date: string
  imageUrl: string
  href: string
  /** Highlights the tile with a "Featured" chip — use sparingly. */
  featured?: boolean
  /** Short urgency signal overlaid on the image (e.g. "Selling fast"). */
  urgency?: string
  /** Price indicator shown below the title. */
  price?: string
  /** Extended description — shown on the featured tile at desktop only. */
  description?: string
  /** Ticket count for the scroll-in counter animation — featured tile only. */
  ticketCount?: number
}

/**
 * Home-page carousel content. Visual layout is approved by the client.
 * To swap events, edit this array only.
 */
const events: EventItem[] = [
  {
    title: "Live DJ Set",
    venue: "Y",
    date: "Fri 29 May 2026",
    imageUrl: "/images/13.webp",
    href: "https://www.skiddle.com/",
    featured: true,
    urgency: "Selling fast",
    price: "£8+",
    description: "Non-stop sets across the quarter — deep house, drum & bass, and late-night energy until close.",
    ticketCount: 47,
  },
  { title: "Saturday Sessions",   venue: "Y", date: "Sat 6 Jun 2026",  imageUrl: "/images/9.webp",                                                     href: "https://www.skiddle.com/", price: "Free entry" },
  { title: "Bass Drop Friday",    venue: "Y", date: "Fri 12 Jun 2026", imageUrl: "/images/nadine-180.jpg",                                             href: "https://www.skiddle.com/", price: "£6+" },
  { title: "Student Night",       venue: "Y", date: "Wed 25 Jun 2026", imageUrl: "/images/img-1917.jpg",                                               href: "https://www.skiddle.com/", price: "Free entry" },
  { title: "Summer Garden Party", venue: "Y", date: "Sat 4 Jul 2026",  imageUrl: "/images/441900351_371148019313956_2396615588718096493_n-2-copy.webp", href: "https://www.skiddle.com/", price: "£12+" },
]

// Ticker content — duplicated so the 50% translate loop is seamless
const TICKER_TEXT = `Tonight  ·  ${events[0].title}  ·  Doors 22:00  ·  Y Club  ·  Y Bar & Lounge  ·  Y Terrace  ·  `

// Tile widths per breakpoint.
// At desktop (4 visible), the featured tile spans 2 column slots (50%).
const TILE_WIDTHS: Record<number, { regular: string; featured: string }> = {
  1: { regular: "100%",                  featured: "100%" },
  3: { regular: "calc(33.333% - 8px)",   featured: "calc(33.333% - 8px)" },
  4: { regular: "calc(25% - 9px)",       featured: "calc(50% - 6px)" },
}

// ── Responsive visible-count, via useSyncExternalStore ─────────────
function subscribeToResize(callback: () => void): () => void {
  window.addEventListener("resize", callback)
  return () => window.removeEventListener("resize", callback)
}
function getVisibleCountSnapshot(): number {
  if (window.innerWidth < 768) return 1
  if (window.innerWidth < 1024) return 3
  return 4
}
function getVisibleCountServerSnapshot(): number { return 4 }

// ── EventTile ───────────────────────────────────────────────────────
function EventTile({
  event,
  regularWidth,
  isFeaturedDesktop,
  animatedCount,
}: {
  event: EventItem
  regularWidth: string
  isFeaturedDesktop: boolean
  /** Animated ticket count — only passed to the featured tile at desktop. */
  animatedCount?: number
}) {
  const isExternal = event.href.startsWith("http")
  const tileWidth = isFeaturedDesktop ? TILE_WIDTHS[4].featured : regularWidth

  return (
    <Link
      href={event.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={`${event.title} — ${event.date}${isExternal ? " (opens in new tab)" : ""}`}
      className="whatson-tile group relative block flex-shrink-0 hover:-translate-y-1 transition-transform duration-300 ease-out motion-reduce:transition-none"
      style={{
        width: tileWidth,
        scrollSnapAlign: "start",
      } as React.CSSProperties}
    >
      {/* Image — zoom on hover */}
      <div
        className="relative overflow-hidden"
        style={{
          height: isFeaturedDesktop ? "420px" : "363px",
          backgroundColor: "rgb(136,136,136)",
          marginBottom: isFeaturedDesktop ? "20px" : "12px",
        }}
      >
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform duration-500 ease-in-out group-hover:scale-105"
        />

        {/* Featured chip — top-left */}
        {event.featured && (
          <span
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#080808",
              background: "#FAFAFA",
              padding: "5px 10px",
              zIndex: 1,
            }}
          >
            Featured
          </span>
        )}

        {/* Urgency chip — top-right */}
        {event.urgency && (
          <span
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#FAFAFA",
              background: "rgba(210, 60, 30, 0.88)",
              padding: "5px 10px",
              zIndex: 1,
            }}
          >
            {event.urgency}
          </span>
        )}
      </div>

      {/* Date pill — above title */}
      <p
        style={{
          display: "inline-block",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
          border: "1px solid rgba(255,255,255,0.15)",
          padding: "3px 10px",
          marginBottom: "10px",
        }}
      >
        {event.date}
      </p>

      {/* Title */}
      <p
        style={{
          fontSize: isFeaturedDesktop ? "46px" : "37px",
          fontWeight: 700,
          lineHeight: isFeaturedDesktop ? "52px" : "44.4px",
          letterSpacing: "0.37px",
          color: "#FAFAFA",
          marginBottom: "8px",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {event.title}
      </p>

      {/* Description — featured desktop only */}
      {isFeaturedDesktop && event.description && (
        <p
          style={{
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "24px",
            color: "rgba(255,255,255,0.6)",
            marginBottom: "20px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {event.description}
        </p>
      )}

      {/* Price + Get tickets row */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {event.price && (
          <p style={{ fontSize: "15px", fontWeight: 500, color: "rgba(255,255,255,0.45)" }}>
            {event.price}
          </p>
        )}
        {isFeaturedDesktop && (
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#FAFAFA",
              borderBottom: "1px solid rgba(255,255,255,0.4)",
              paddingBottom: "1px",
            }}
          >
            Get tickets →
          </span>
        )}
      </div>

      {/* Animated ticket counter — featured desktop only, scroll-triggered */}
      {isFeaturedDesktop && animatedCount !== undefined && (
        <p
          style={{
            marginTop: "12px",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.06em",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: "15px",
              color: "rgba(255,255,255,0.75)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {animatedCount}
          </span>
          {" "}tickets remaining
        </p>
      )}
    </Link>
  )
}

export function WhatsonSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [carouselVisible, setCarouselVisible] = useState(false)
  // Animated ticket count for the featured tile — counts up from 0 on scroll-in
  const [animatedCount, setAnimatedCount] = useState(0)
  const visibleCount = useSyncExternalStore(
    subscribeToResize,
    getVisibleCountSnapshot,
    getVisibleCountServerSnapshot,
  )
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // With scroll-snap each tile is a snap point, so maxIndex covers all tiles
  const maxIndex = events.length - 1
  const dotCount = events.length
  const clampedIndex = Math.min(activeIndex, maxIndex)
  const { regular: regularWidth } = TILE_WIDTHS[visibleCount] ?? TILE_WIDTHS[4]

  // Stagger entrance — fires once when section enters viewport
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCarouselVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Ticket counter animation — runs once when section enters viewport.
  // setState is inside a requestAnimationFrame callback (async), not in the
  // effect body directly, so it does not trigger react-hooks/set-state-in-effect.
  useEffect(() => {
    if (!carouselVisible) return
    const target = events.find((e) => e.featured)?.ticketCount ?? 0
    if (!target) return

    // prefers-reduced-motion: skip animation, show final value immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimatedCount(target)
      return
    }

    const DURATION = 1400 // ms — ease-out cubic over ~1.4s
    const startTime = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / DURATION, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // cubic ease-out
      setAnimatedCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [carouselVisible])

  // Programmatic scroll: uses tile's offsetLeft from the scroll container
  // (scroll container has position: relative so it becomes the offsetParent)
  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current
    if (!container) return
    const track = container.firstElementChild as HTMLElement | null
    if (!track) return
    const tile = track.children[index] as HTMLElement | undefined
    if (!tile) return
    container.scrollTo({ left: tile.offsetLeft, behavior: "smooth" })
  }

  // Sync activeIndex from actual scroll position after user drag/swipe
  const handleCarouselScroll = () => {
    if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current)
    scrollDebounceRef.current = setTimeout(() => {
      const container = scrollContainerRef.current
      if (!container) return
      const track = container.firstElementChild as HTMLElement | null
      if (!track) return
      const tiles = Array.from(track.children) as HTMLElement[]
      const scrollLeft = container.scrollLeft

      let closestIndex = 0
      let closestDist = Infinity
      tiles.forEach((tile, i) => {
        const dist = Math.abs(tile.offsetLeft - scrollLeft)
        if (dist < closestDist) { closestDist = dist; closestIndex = i }
      })
      setActiveIndex(Math.min(closestIndex, maxIndex))
    }, 60)
  }

  const handlePrev = () => {
    const newIndex = Math.max(0, clampedIndex - 1)
    setActiveIndex(newIndex)
    scrollToIndex(newIndex)
  }

  const handleNext = () => {
    const newIndex = Math.min(maxIndex, clampedIndex + 1)
    setActiveIndex(newIndex)
    scrollToIndex(newIndex)
  }

  return (
    <section
      ref={sectionRef}
      id="whats-on"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgb(0,0,0)",
        paddingTop: "48px",
        paddingBottom: "48px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#FAFAFA",
      }}
    >
      {/* Grain overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage: GRAIN_SVG,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Live ticker — full section width, above the padded content ── */}
      <div className="whatson-ticker" style={{ width: "100%" }} aria-hidden="true">
        <div className="whatson-ticker-track">
          <span>{TICKER_TEXT}</span>
          <span>{TICKER_TEXT}</span>
        </div>
      </div>

      {/* ── Padded content wrapper ──────────────────────────────────── */}
      <div className="px-6 md:px-12 lg:px-20 xl:px-36" style={{ width: "100%" }}>

        {/* Heading block */}
        <div style={{ position: "relative", width: "100%", marginTop: "32px", marginBottom: "48px" }}>
          <p style={{
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            margin: "0 0 14px",
          }}>
            Coming up
          </p>
          <h2
            className="text-[36px] md:text-[67px]"
            style={{
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "0.67px",
              color: "#FAFAFA",
              margin: 0,
            }}
          >
            The Line-up
          </h2>
        </div>

        {/* ── Scroll-snap carousel ─────────────────────────────────── */}
        <div style={{ width: "100%" }}>
          {/*
            position: relative makes this the offsetParent for tiles,
            so tile.offsetLeft gives the correct scroll target in scrollToIndex.
          */}
          <div
            ref={scrollContainerRef}
            onScroll={handleCarouselScroll}
            className={`whatson-scroll-track${carouselVisible ? " whatson-carousel-visible" : ""}`}
            style={{
              position: "relative",
              overflowX: "auto",
              overflowY: "hidden",
              scrollSnapType: "x mandatory",
              touchAction: "pan-x",
            } as React.CSSProperties}
          >
            <div style={{ display: "flex", gap: "12px" }}>
              {events.map((event) => {
                const isFeaturedDesktop = !!event.featured && visibleCount === 4
                return (
                  <EventTile
                    key={event.title}
                    event={event}
                    regularWidth={regularWidth}
                    isFeaturedDesktop={isFeaturedDesktop}
                    animatedCount={isFeaturedDesktop ? animatedCount : undefined}
                  />
                )
              })}
            </div>
          </div>

          {/* Prev / dots / next */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              marginTop: "32px",
            }}
          >
            <button
              onClick={handlePrev}
              disabled={clampedIndex === 0}
              className="flex items-center justify-center bg-transparent border-0 transition-opacity duration-200 hover:opacity-100"
              style={{ opacity: clampedIndex === 0 ? 0.25 : 0.7, cursor: clampedIndex === 0 ? "not-allowed" : "pointer" }}
              aria-label="Previous event"
            >
              <ChevronLeftIcon style={{ width: "24px", height: "24px", color: "white" }} />
            </button>

            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              {Array.from({ length: dotCount }, (_, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveIndex(i); scrollToIndex(i) }}
                  aria-label={`Go to slide ${i + 1}`}
                  className="transition-all duration-300 border-0 p-0"
                  style={{
                    width:        i === clampedIndex ? "24px" : "6px",
                    height:       "6px",
                    borderRadius: "3px",
                    background:   i === clampedIndex ? "white" : "rgba(255,255,255,0.35)",
                    cursor:       "pointer",
                  }}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={clampedIndex >= maxIndex}
              className="flex items-center justify-center bg-transparent border-0 transition-opacity duration-200 hover:opacity-100"
              style={{ opacity: clampedIndex >= maxIndex ? 0.25 : 0.7, cursor: clampedIndex >= maxIndex ? "not-allowed" : "pointer" }}
              aria-label="Next event"
            >
              <ChevronRightIcon style={{ width: "24px", height: "24px", color: "white" }} />
            </button>
          </div>

          {/* Trust hint + See all events */}
          <div className="flex flex-col items-center" style={{ marginTop: "32px", gap: "10px" }}>
            <p style={{
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.06em",
              color: "rgba(255,255,255,0.3)",
            }}>
              12 events this month
            </p>
            <Link
              href="/whats-on"
              className="group inline-flex items-center gap-1.5 relative pb-px after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-white after:origin-left after:scale-x-100 hover:after:scale-x-0 after:transition-transform after:duration-300 after:ease-out motion-reduce:after:transition-none"
              style={{ fontSize: "18px", fontWeight: 600, color: "white", textDecoration: "none" }}
            >
              See all events
              <ChevronRightIcon
                className="size-4 group-hover:translate-x-1 transition-transform duration-200 motion-reduce:transition-none"
                style={{ color: "white" }}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
