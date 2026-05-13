"use client"

import { useState, useEffect } from "react"
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
}

const events: EventItem[] = [
  { title: "Live DJ Set", venue: "Y", date: "Fri 29 May", imageUrl: "/images/13.webp", href: "#" },
  { title: "Saturday Sessions", venue: "Y", date: "Sat 16 May", imageUrl: "/images/9.webp", href: "#" },
  { title: "Bass Drop Friday", venue: "Y", date: "Fri 22 May", imageUrl: "/images/nadine-180.jpg", href: "#" },
  { title: "Student Night", venue: "Y", date: "Wed 27 May", imageUrl: "/images/img-1917.jpg", href: "#" },
  { title: "Summer Garden Party", venue: "Y", date: "Sat 13 Jun", imageUrl: "/images/441900351_371148019313956_2396615588718096493_n-2-copy.webp", href: "#" },
]

// Per-breakpoint carousel geometry — precomputed to keep CSS values clean
const LAYOUT: Record<number, { tileWidth: string; transformUnit: string }> = {
  1: { tileWidth: "100%",                  transformUnit: "(100% + 12px)" },
  3: { tileWidth: "calc(33.333% - 8px)",   transformUnit: "(33.333% + 4px)" },
  4: { tileWidth: "calc(25% - 9px)",       transformUnit: "(25% + 3px)" },
}

function getVisibleCount(): number {
  if (typeof window === "undefined") return 4
  if (window.innerWidth < 768) return 1
  if (window.innerWidth < 1024) return 3
  return 4
}

function EventTile({ event, tileWidth }: { event: EventItem; tileWidth: string }) {
  return (
    <Link
      href={event.href}
      className="group relative block flex-shrink-0"
      style={{ width: tileWidth }}
    >
      {/* Image — zoom on hover */}
      <div
        className="relative mb-4 overflow-hidden"
        style={{ height: "363px", backgroundColor: "rgb(136,136,136)" }}
      >
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
      </div>


      {/* Event title — lifts on hover */}
      <p
        className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 motion-reduce:transition-none"
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
        }}
      >
        {event.title}
      </p>

      {/* Date */}
      <p style={{
        fontSize: "28px",
        fontWeight: 500,
        lineHeight: "33.6px",
        letterSpacing: "0.28px",
        color: "#FAFAFA",
      }}>
        {event.date}
      </p>
    </Link>
  )
}

export function WhatsonSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(4)

  useEffect(() => {
    function update() { setVisibleCount(getVisibleCount()) }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const maxIndex = Math.max(0, events.length - visibleCount)
  const clampedIndex = Math.min(activeIndex, maxIndex)
  const dotCount = Math.max(1, events.length - visibleCount + 1)

  const { tileWidth, transformUnit } = LAYOUT[visibleCount] ?? LAYOUT[4]

  function handlePrev() {
    setActiveIndex((prev) => Math.max(0, prev - 1))
  }

  function handleNext() {
    setActiveIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  return (
    <section
      id="whats-on"
      className="px-6 md:px-12 lg:px-20 xl:px-36 relative overflow-hidden"
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
      <div style={{ width: "100%" }}>

        <div style={{ position: "relative", width: "100%", marginBottom: "48px" }}>
          {/* Kicker */}
          <p style={{
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.14em",
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
              margin: "0 0 16px",
            }}
          >
            The Line-up
          </h2>

          {/* "See all events" — below heading on mobile, absolute bottom-right on desktop */}
          <div className="md:absolute md:right-0 md:bottom-0 mt-0 md:mt-0">
            <Link
              href="#whats-on"
              className="group inline-flex items-center gap-1.5 relative pb-px after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-white after:origin-left after:scale-x-100 hover:after:scale-x-0 after:transition-transform after:duration-300 after:ease-out motion-reduce:after:transition-none"
              style={{ fontSize: "18px", fontWeight: 600, color: "white", textDecoration: "none" }}
            >
              See all events
              <ChevronRightIcon
                className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none"
                style={{ color: "white" }}
              />
            </Link>
          </div>
        </div>

        <div style={{ width: "100%" }}>
          <div style={{ overflow: "hidden", width: "100%" }}>
            <div
              style={{
                display: "flex",
                gap: "12px",
                transition: "transform 0.4s ease",
                transform: `translateX(calc(-${clampedIndex} * ${transformUnit}))`,
              }}
            >
              {events.map((event) => (
                <EventTile key={event.title} event={event} tileWidth={tileWidth} />
              ))}
            </div>
          </div>

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
              disabled={activeIndex === 0}
              className="flex items-center justify-center bg-transparent border-0 transition-opacity duration-200 hover:opacity-100"
              style={{ opacity: activeIndex === 0 ? 0.25 : 0.7, cursor: activeIndex === 0 ? "not-allowed" : "pointer" }}
              aria-label="Previous event"
            >
              <ChevronLeftIcon style={{ width: "24px", height: "24px", color: "white" }} />
            </button>

            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              {Array.from({ length: dotCount }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
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
              disabled={activeIndex >= maxIndex}
              className="flex items-center justify-center bg-transparent border-0 transition-opacity duration-200 hover:opacity-100"
              style={{ opacity: activeIndex >= maxIndex ? 0.25 : 0.7, cursor: activeIndex >= maxIndex ? "not-allowed" : "pointer" }}
              aria-label="Next event"
            >
              <ChevronRightIcon style={{ width: "24px", height: "24px", color: "white" }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
