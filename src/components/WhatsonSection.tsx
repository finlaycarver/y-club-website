"use client"

import { useState, useRef, useEffect, useSyncExternalStore } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons"
import { GRAIN_SVG } from "@/lib/grain"
import { EventBottomSheet } from "@/components/EventBottomSheet"
import { upcomingEvents } from "@/data/events"
import type { EventItem as CanonicalEventItem } from "@/data/events"

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
}

function toCarouselEvent(event: CanonicalEventItem): EventItem {
  return {
    title: event.title,
    venue: "Y",
    date: event.date.includes("2026") ? event.date : `${event.date} 2026`,
    imageUrl: event.imageUrl,
    href: event.ticketUrl,
    featured: event.featured,
    urgency: event.soldOut
      ? "Sold out"
      : event.capacityPercent !== undefined && event.capacityPercent >= 80
        ? "Selling fast"
        : undefined,
    description: event.description,
  }
}

const events: EventItem[] = upcomingEvents().slice(0, 5).map(toCarouselEvent)

// Tile widths per breakpoint.
// Mobile (1): 80vw so the leading edge of the next card peeks (~13%) at
//             the right — encourages swipe without hiding the content.
// At desktop (4 visible), the featured tile spans 2 column slots (50%).
const TILE_WIDTHS: Record<number, { regular: string; featured: string }> = {
  1: { regular: "80vw",                  featured: "80vw" },
  3: { regular: "calc(33.333% - 8px)",   featured: "calc(33.333% - 8px)" },
  4: { regular: "calc(25% - 9px)",       featured: "calc(25% - 9px)" },
}

/** Formats a date string to a short uppercase pill label.
 *  "Fri 29 May 2026" → "FRI 29 MAY" */
function formatDateShort(dateStr: string): string {
  const parts = dateStr.toUpperCase().split(" ")
  // ["FRI", "29", "MAY", "2026"] → "FRI 29 MAY"
  return parts.slice(0, 3).join(" ")
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
  onTap,
  priority,
}: {
  event: EventItem
  regularWidth: string
  isFeaturedDesktop: boolean
  /** If provided, tapping the tile opens the bottom sheet instead of navigating. */
  onTap?: () => void
  priority?: boolean
}) {
  const isExternal = event.href.startsWith("http")
  const tileWidth = isFeaturedDesktop ? TILE_WIDTHS[4].featured : regularWidth

  const tileClass = "whatson-tile group relative block flex-shrink-0 hover:-translate-y-1 transition-transform duration-300 ease-out motion-reduce:transition-none"
  const tileStyle = { width: tileWidth, scrollSnapAlign: "start" } as React.CSSProperties

  // Mobile: intercept tap to open bottom sheet
  if (onTap) {
    return (
      <button
        type="button"
        onClick={onTap}
        aria-label={`${event.title} — ${event.date} — tap for details`}
        className={`${tileClass} text-left bg-transparent border-0 p-0 cursor-pointer`}
        style={tileStyle}
      >
      {/* Image — zoom on hover */}
      <div
        className="relative overflow-hidden"
        style={{
          width: "100%",
          height: "363px",
          backgroundColor: "rgb(136,136,136)",
          marginBottom: "12px",
        }}
      >
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 80vw, 25vw"
          priority={priority}
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

      {/* Date pill — short format (FRI 29 MAY) keeps the tile clean at
          mobile widths where the full date string crowds the title. */}
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
        {formatDateShort(event.date)}
      </p>

      {/* Title — min-height locks to 2-line height so single-line titles
          don't make the card shorter than multi-line ones. */}
      <p
        style={{
          fontSize: "37px",
          fontWeight: 700,
          lineHeight: "44.4px",
          letterSpacing: "0.37px",
          color: "#FAFAFA",
          marginBottom: "8px",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          minHeight: "88.8px",
        }}
      >
        {event.title}
      </p>

      {/* Price */}
      {event.price && (
        <p style={{ fontSize: "15px", fontWeight: 500, color: "rgba(255,255,255,0.45)" }}>
          {event.price}
        </p>
      )}

    </button>
    )
  }

  // Desktop: navigate directly
  return (
    <Link
      href={event.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={`${event.title} — ${event.date}${isExternal ? " (opens in new tab)" : ""}`}
      className={tileClass}
      style={tileStyle}
    >
      {/* Image — zoom on hover */}
      <div
        className="relative overflow-hidden"
        style={{
          width: "100%",
          height: "363px",
          backgroundColor: "rgb(136,136,136)",
          marginBottom: "12px",
        }}
      >
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 80vw, 25vw"
          priority={priority}
          style={{ objectFit: "cover" }}
          className="transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        {event.featured && (
          <span style={{ position: "absolute", top: "16px", left: "16px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#080808", background: "#FAFAFA", padding: "5px 10px", zIndex: 1 }}>Featured</span>
        )}
        {event.urgency && (
          <span style={{ position: "absolute", top: "16px", right: "16px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FAFAFA", background: "rgba(210, 60, 30, 0.88)", padding: "5px 10px", zIndex: 1 }}>{event.urgency}</span>
        )}
      </div>
      <p style={{ display: "inline-block", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)", padding: "3px 10px", marginBottom: "10px" }}>
        {formatDateShort(event.date)}
      </p>
      <p style={{ fontSize: "37px", fontWeight: 700, lineHeight: "44.4px", letterSpacing: "0.37px", color: "#FAFAFA", marginBottom: "8px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", minHeight: "88.8px" }}>
        {event.title}
      </p>
      {event.price && <p style={{ fontSize: "15px", fontWeight: 500, color: "rgba(255,255,255,0.45)" }}>{event.price}</p>}
    </Link>
  )
}

export function WhatsonSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [carouselVisible, setCarouselVisible] = useState(false)
  const [sheetEvent, setSheetEvent] = useState<EventItem | null>(null)
  const visibleCount = useSyncExternalStore(
    subscribeToResize,
    getVisibleCountSnapshot,
    getVisibleCountServerSnapshot,
  )
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const programmaticScrollRef = useRef<boolean>(false)

  // With scroll-snap each tile is a snap point, so maxIndex covers all tiles
  const maxIndex = events.length - 1
  // Show only two pagination "bobble" indicators on the home carousel
  const dotCount = 2
  const clampedIndex = Math.min(activeIndex, maxIndex)
  // Map between page (0..dotCount-1) and actual tile index
  const indexForPage = (page: number) => {
    if (maxIndex <= 0) return 0
    if (dotCount <= 1) return 0
    // Special-case 2-dot pagination: 0 -> first tile, 1 -> last tile
    if (dotCount === 2) return page === 0 ? 0 : maxIndex
    return Math.round(page * maxIndex / (dotCount - 1))
  }
  const pageForIndex = (index: number) => {
    if (maxIndex <= 0) return 0
    if (dotCount <= 1) return 0
    // Special-case 2-dot pagination: map first half -> page 0, second half -> page 1
    if (dotCount === 2) return index < Math.ceil(maxIndex / 2) ? 0 : 1
    return Math.round(index * (dotCount - 1) / maxIndex)
  }
  const currentPage = pageForIndex(clampedIndex)
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

  // Programmatic scroll: uses tile's offsetLeft from the scroll container
  // (scroll container has position: relative so it becomes the offsetParent)
  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current
    if (!container) return
    const track = container.firstElementChild as HTMLElement | null
    if (!track) return
    const tile = track.children[index] as HTMLElement | undefined
    if (!tile) return
    // Mark that we're doing a programmatic scroll so the scroll handler
    // doesn't override the target activeIndex while the smooth scroll is
    // in progress (prevents snap-back caused by rounding in the handler).
    programmaticScrollRef.current = true
    container.scrollTo({ left: tile.offsetLeft, behavior: "smooth" })
    // Clear the flag shortly after the smooth scroll should have finished.
    // 500ms is conservative for most machines; the debounce in the scroll
    // handler uses 60ms so this avoids a conflicting update.
    setTimeout(() => { programmaticScrollRef.current = false }, 500)
  }

  // Sync activeIndex from actual scroll position after user drag/swipe
  const handleCarouselScroll = () => {
    if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current)
    scrollDebounceRef.current = setTimeout(() => {
      const container = scrollContainerRef.current
      if (!container) return
      // If we recently initiated a programmatic scroll, ignore this
      // event so we don't overwrite the intentional activeIndex we set.
      if (programmaticScrollRef.current) return
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
    // Move to previous page (mapped to an index) so the pagination bobble updates immediately
    const current = pageForIndex(clampedIndex)
    const targetPage = Math.max(0, current - 1)
    const targetIndex = indexForPage(targetPage)
    setActiveIndex(targetIndex)
    scrollToIndex(targetIndex)
  }

  const handleNext = () => {
    // Move to next page (mapped to an index) so the pagination bobble updates immediately
    const current = pageForIndex(clampedIndex)
    const targetPage = Math.min(dotCount - 1, current + 1)
    const targetIndex = indexForPage(targetPage)
    setActiveIndex(targetIndex)
    scrollToIndex(targetIndex)
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
        {/* On mobile, negative right margin breaks the carousel out of
            the px-6 padded wrapper so tiles can extend to the viewport
            edge — enabling the 13% next-card peek without extra padding. */}
        <div style={{ width: "100%", marginRight: visibleCount === 1 ? "-24px" : undefined }}>
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
            } as React.CSSProperties}
          >
            <div style={{ display: "flex", gap: "12px" }}>
              {events.map((event, i) => {
                const isFeaturedDesktop = !!event.featured && visibleCount === 4
                return (
                  <EventTile
                    key={event.title}
                    event={event}
                    regularWidth={regularWidth}
                    isFeaturedDesktop={isFeaturedDesktop}
                    onTap={visibleCount === 1 ? () => setSheetEvent(event) : undefined}
                    priority={i < 2}
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
            {/* Prev arrow — desktop only. Mobile uses swipe + dots. */}
            <button
              onClick={handlePrev}
              disabled={clampedIndex === 0}
              className="hidden md:flex items-center justify-center bg-transparent border-0 transition-opacity duration-200 hover:opacity-100"
              style={{ opacity: clampedIndex === 0 ? 0.25 : 0.7, cursor: clampedIndex === 0 ? "not-allowed" : "pointer" }}
              aria-label="Previous event"
            >
              <ChevronLeftIcon style={{ width: "24px", height: "24px", color: "white" }} />
            </button>

            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              {Array.from({ length: dotCount }, (_, i) => {
                const targetIndex = indexForPage(i)
                const isActive = i === currentPage
                return (
                  <button
                    key={i}
                    onClick={() => { setActiveIndex(targetIndex); scrollToIndex(targetIndex) }}
                    aria-label={`Go to page ${i + 1}`}
                    className="transition-all duration-300 border-0 p-0"
                    style={{
                      width:        isActive ? "24px" : "6px",
                      height:       "6px",
                      borderRadius: "3px",
                      background:   isActive ? "white" : "rgba(255,255,255,0.35)",
                      cursor:       "pointer",
                    }}
                  />
                )
              })}
            </div>

            {/* Next arrow — desktop only. Mobile uses swipe + dots. */}
            <button
              onClick={handleNext}
              disabled={clampedIndex >= maxIndex}
              className="hidden md:flex items-center justify-center bg-transparent border-0 transition-opacity duration-200 hover:opacity-100"
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
              {events.length === 1 ? "1 upcoming event" : `${events.length} upcoming events`}
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

      {/* Event bottom sheet — mobile only, opens when a tile is tapped */}
      <EventBottomSheet
        event={sheetEvent}
        onClose={() => setSheetEvent(null)}
      />
    </section>
  )
}
