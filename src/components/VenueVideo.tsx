"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

interface VenueVideoProps {
  src: string;
  posterSrc?: string;
  caption?: string;
  kicker?: string;
  /**
   * Set true when the source video has a burned-in timestamp overlay.
   * Applies a CSS scale + crop transform so the timestamp (typically
   * top-right corner) is clipped by the container's overflow:hidden.
   */
  cropTimestamp?: boolean;
  /**
   * HTMLVideoElement.playbackRate override. Default: 1.
   * 0.7 gives raw event footage a cinematic slow-motion feel.
   */
  playbackRate?: number;
  /**
   * Opacity of the full-frame dark overlay div (0–1).
   * Useful for muting the raw documentary look on outdoor footage.
   * Default: 0 (no full-frame overlay — the vignette gradient still shows).
   */
  overlayOpacity?: number;
}

/**
 * Full-bleed autoplay-muted-loop video section.
 *
 * Plays when the section enters the viewport (IntersectionObserver),
 * pauses when it leaves. Manual play/pause toggle (bottom-right).
 */
export function VenueVideo({
  src,
  posterSrc,
  caption,
  kicker,
  cropTimestamp,
  playbackRate,
  overlayOpacity,
}: VenueVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const manualPauseRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);

  function togglePlayPause() {
    const v = videoRef.current;
    if (!v) return;
    if (manualPauseRef.current) {
      manualPauseRef.current = false;
      v.play().catch(() => { /* autoplay block */ });
      setIsPaused(false);
    } else {
      manualPauseRef.current = true;
      v.pause();
      setIsPaused(true);
    }
  }

  // Intersection-based autoplay — respects manual pause override
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.removeAttribute("autoplay");
      el.pause();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !manualPauseRef.current) {
            el.play().catch(() => { /* autoplay block */ });
          } else if (!entry.isIntersecting) {
            el.pause();
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Apply playbackRate once the video element is ready
  useEffect(() => {
    if (!playbackRate || playbackRate === 1) return;
    const el = videoRef.current;
    if (!el) return;
    function apply() { el!.playbackRate = playbackRate!; }
    // Apply immediately if already have metadata; otherwise wait for it
    if (el.readyState >= 1) {
      apply();
    } else {
      el.addEventListener("loadedmetadata", apply, { once: true });
    }
  }, [playbackRate]);

  // CSS transform values for timestamp crop.
  // scale(1.15) from 55% vertical origin pushes the top-right corner
  // ~7–8% upward, clipped by the container's overflow:hidden.
  const videoTransform = cropTimestamp
    ? { transform: "scale(1.15)", transformOrigin: "center 55%" }
    : {};

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
          style={videoTransform}
        />

        {/* Optional full-frame muting overlay (overlayOpacity) */}
        {!!overlayOpacity && overlayOpacity > 0 && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ background: `rgba(0,0,0,${overlayOpacity})` }}
          />
        )}

        {/* Vignette scrim */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Frosted-glass caption pill — bottom-left */}
        {(kicker || caption) && (
          <div
            className="absolute pointer-events-none"
            style={{ left: "24px", bottom: "32px" }}
          >
            <div
              style={{
                display: "inline-block",
                background: "rgba(0,0,0,0.42)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.14)",
                padding: "12px 20px",
              }}
            >
              {kicker && (
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.6)",
                    marginBottom: caption ? "6px" : 0,
                  }}
                >
                  {kicker}
                </p>
              )}
              {caption && (
                <p
                  className="text-[20px] md:text-[28px]"
                  style={{
                    fontWeight: 700,
                    color: "#FAFAFA",
                    lineHeight: 1.15,
                    letterSpacing: "-0.01em",
                    maxWidth: "480px",
                  }}
                >
                  {caption}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Play/pause toggle — bottom-right */}
        <button
          type="button"
          aria-label={isPaused ? "Play video" : "Pause video"}
          onClick={togglePlayPause}
          className="absolute flex items-center justify-center hover:opacity-100 transition-opacity duration-200 motion-reduce:transition-none"
          style={{
            bottom: "24px",
            right: "24px",
            width: "44px",
            height: "44px",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 0,
            cursor: "pointer",
            color: "#FAFAFA",
            opacity: 0.75,
            zIndex: 2,
          }}
        >
          {isPaused
            ? <Play  size={18} strokeWidth={2} aria-hidden="true" />
            : <Pause size={18} strokeWidth={2} aria-hidden="true" />
          }
        </button>
      </div>
    </section>
  );
}
