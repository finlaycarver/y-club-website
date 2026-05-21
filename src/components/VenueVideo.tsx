"use client";

import { useEffect, useRef } from "react";

interface VenueVideoProps {
  src: string;
  posterSrc?: string;
  caption?: string;
  kicker?: string;
}

/**
 * Full-bleed autoplay-muted-loop video section, intended to sit between
 * an editorial content section and a photo grid on a venue page.
 *
 * Plays only when the user has scrolled it into view (Intersection
 * Observer), then pauses when it leaves — protects mobile data
 * and respects prefers-reduced-motion.
 */
export function VenueVideo({ src, posterSrc, caption, kicker }: VenueVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // Respect reduced motion — don't autoplay
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.removeAttribute("autoplay");
      el.pause();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.play().catch(() => { /* autoplay block — silent fail */ });
          } else {
            el.pause();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="relative bg-black overflow-hidden"
      style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="relative w-full" style={{ aspectRatio: "16/9", maxHeight: "85vh" }}>
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={src}
          poster={posterSrc}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={caption ?? "Venue footage"}
        />

        {/* Subtle vignette to keep text legible if we ever overlay it */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.55) 100%)" }}
        />

        {/* Bottom-left caption */}
        {(kicker || caption) && (
          <div className="absolute left-6 md:left-16 bottom-8 md:bottom-12 text-white pointer-events-none">
            {kicker && (
              <p style={{
                fontSize: "12px", fontWeight: 500, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: "8px",
              }}>
                {kicker}
              </p>
            )}
            {caption && (
              <p className="text-[22px] md:text-[32px]" style={{
                fontWeight: 700, color: "#FAFAFA", lineHeight: 1.15, letterSpacing: "-0.01em",
                maxWidth: "520px",
              }}>
                {caption}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
