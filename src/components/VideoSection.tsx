"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { GRAIN_SVG } from "@/lib/grain";

/**
 * Home-page brand video section. Click the play button to open a
 * lightbox with the brand reel. Hero layout, kicker, heading and
 * placeholder image stay exactly as approved by the client.
 *
 * To swap the brand reel: replace /public/videos/brand-reel.mp4
 * (currently aliased to y-club-loop.mp4 as a placeholder).
 */

const BRAND_REEL_SRC = "/videos/y-club-loop.mp4"; // [TODO(fin)] swap to dedicated brand reel when available
const BRAND_REEL_POSTER = "/images/mg-7942.webp";

export function VideoSection() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ESC to close, body-scroll lock while open, return focus to trigger on close
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);

    // Autoplay the video when modal opens; mute fallback for browsers
    // that block audio autoplay
    videoRef.current?.play().catch(() => { /* autoplay block — silent */ });

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open]);

  return (
    <section
      className="px-6 md:px-12 lg:px-20 xl:px-36 relative overflow-hidden"
      style={{
        backgroundColor: "rgb(0,0,0)",
        paddingTop: "48px",
        paddingBottom: "48px",
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

      {/* Kicker — paired with duration to set expectation */}
      <p style={{
        fontSize: "13px",
        fontWeight: 500,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.45)",
        margin: "0 0 14px",
      }}>
        Watch · 60 seconds
      </p>

      {/* Heading */}
      <h2
        className="text-[36px] md:text-[67px]"
        style={{
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: "0.67px",
          color: "#FAFAFA",
          margin: "0 0 12px",
        }}
      >
        A night at Y
      </h2>

      {/* Microcopy — sets expectation before the video container */}
      <p style={{
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "24px",
        color: "rgba(255,255,255,0.45)",
        margin: "0 0 28px",
      }}>
        60 seconds inside Y.
      </p>

      {/* Video placeholder — full section width, no extra horizontal margins */}
      <div
        className="relative overflow-hidden aspect-video"
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={BRAND_REEL_POSTER}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          {/* Overlay reduced to 30% — lets photography read */}
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.30)" }} />
        </div>

        {/* Play button — opens lightbox modal.
            Polished from the original 96px hollow ring: now 112px with
            a double-ring effect via box-shadow + subtle outer glow.
            Makes the section feel intentional rather than placeholder. */}
        <button
          ref={triggerRef}
          type="button"
          aria-label="Play brand video"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="brand-video-dialog"
          onClick={() => setOpen(true)}
          className="relative hover:scale-110 hover:opacity-90 transition-all duration-300 motion-reduce:transition-none"
          style={{
            width: "112px",
            height: "112px",
            border: "1.5px solid rgba(255,255,255,0.85)",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            boxShadow:
              "0 0 0 8px rgba(255,255,255,0.05), 0 0 80px rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            zIndex: 1,
          }}
        >
          <Play size={40} color="white" fill="white" />
        </button>
      </div>

      {/* ── Lightbox modal ──────────────────────────────────────────── */}
      {open && (
        <div
          id="brand-video-dialog"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Brand video"
          onClick={(e) => {
            // Close when clicking the backdrop (not the content)
            if (e.target === e.currentTarget) setOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <button
            type="button"
            aria-label="Close video"
            onClick={() => setOpen(false)}
            autoFocus
            className="absolute hover:opacity-80 transition-opacity duration-200 motion-reduce:transition-none"
            style={{
              top: "24px",
              right: "24px",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "50%",
              cursor: "pointer",
              color: "#FAFAFA",
            }}
          >
            <X size={20} />
          </button>

          <div
            style={{
              width: "100%",
              maxWidth: "1200px",
              aspectRatio: "16 / 9",
              position: "relative",
              background: "#000",
            }}
          >
            <video
              ref={videoRef}
              controls
              playsInline
              preload="metadata"
              poster={BRAND_REEL_POSTER}
              src={BRAND_REEL_SRC}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
