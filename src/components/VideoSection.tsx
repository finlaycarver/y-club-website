"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, X, Maximize2 } from "lucide-react";
import { GRAIN_SVG } from "@/lib/grain";

/**
 * Home-page brand video section.
 *
 * Mobile  — autoplay muted loop driven by IntersectionObserver (data-sensitive:
 *           preload="metadata", plays only when ≥30% visible). Tap → fullscreen.
 *           Respects prefers-reduced-motion (no autoplay if motion is reduced).
 *
 * Desktop — static poster + play button opens a lightbox modal (unchanged).
 *
 * To swap the brand reel: replace /public/videos/brand-reel.mp4
 * (currently aliased to y-club-loop.mp4 as a placeholder).
 */

const BRAND_REEL_SRC    = "/videos/y-club-loop.mp4"; // [TODO(fin)] swap to dedicated brand reel
const BRAND_REEL_POSTER = "/images/mg-7942.webp";

export function VideoSection() {
  // Desktop lightbox state
  const [open, setOpen]         = useState(false);
  const dialogRef               = useRef<HTMLDivElement>(null);
  const triggerRef              = useRef<HTMLButtonElement>(null);
  const desktopVideoRef         = useRef<HTMLVideoElement>(null);

  // Mobile inline video
  const mobileVideoRef          = useRef<HTMLVideoElement>(null);

  // ── Desktop lightbox — ESC close, body-scroll lock, focus return ──
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    desktopVideoRef.current?.play().catch(() => {});

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open]);

  // ── Mobile: IntersectionObserver-gated autoplay ────────────────────
  // Only wires up on mobile viewports; skipped under prefers-reduced-motion.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const video = mobileVideoRef.current;
    if (!video) return;

    // Ensure muted (some browsers strip the attribute during SSR hydration)
    video.muted        = true;
    video.defaultMuted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => { /* autoplay blocked — silent */ });
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // ── Mobile: tap to enter / exit fullscreen ─────────────────────────
  function handleMobileVideoTap() {
    const video = mobileVideoRef.current;
    if (!video) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    } else {
      const el = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
      el.requestFullscreen?.().catch(() => {});
      el.webkitEnterFullscreen?.(); // iOS Safari fallback
    }
  }

  return (
    <section
      id="video-section"
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

      {/* Kicker */}
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

      {/* Microcopy */}
      <p style={{
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "24px",
        color: "rgba(255,255,255,0.45)",
        margin: "0 0 28px",
      }}>
        60 seconds inside Y.
      </p>

      {/* ── MOBILE: inline autoplay muted loop ──────────────────────── */}
      <div className="block md:hidden relative overflow-hidden aspect-video">
        <video
          ref={mobileVideoRef}
          muted
          loop
          playsInline
          preload="metadata"
          poster={BRAND_REEL_POSTER}
          src={BRAND_REEL_SRC}
          onClick={handleMobileVideoTap}
          aria-label="Y club brand video — tap for fullscreen"
          className="w-full h-full object-cover block cursor-pointer"
        />
        {/* Fullscreen hint pill */}
        <button
          type="button"
          onClick={handleMobileVideoTap}
          aria-label="Enter fullscreen"
          className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 pointer-events-auto"
          style={{
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "100px",
            color: "rgba(255,255,255,0.75)",
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            backdropFilter: "blur(6px)",
          }}
        >
          <Maximize2 size={12} aria-hidden="true" />
          Fullscreen
        </button>
      </div>

      {/* ── DESKTOP: static poster + play button → lightbox ─────────── */}
      <div className="hidden md:block">
        <div
          className="relative overflow-hidden aspect-video"
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {/* Background poster */}
          <div className="absolute inset-0">
            <Image
              src={BRAND_REEL_POSTER}
              alt=""
              fill
              sizes="(max-width: 1024px) 90vw, 80vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.30)" }} />
          </div>

          {/* Play button */}
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
              boxShadow: "0 0 0 8px rgba(255,255,255,0.05), 0 0 80px rgba(255,255,255,0.15)",
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
      </div>

      {/* ── Desktop lightbox modal ───────────────────────────────────── */}
      {open && (
        <div
          id="brand-video-dialog"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Brand video"
          onClick={(e) => {
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
              ref={desktopVideoRef}
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
