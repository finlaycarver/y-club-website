"use client";

import { useEffect, useRef, useState } from "react";

interface NetworkConnection {
  saveData?: boolean;
}

interface Props {
  /** Optional looped video URL. When omitted only the cursor light renders. */
  videoSrc?: string;
  /** Poster image to show before the video is ready. */
  posterSrc?: string;
  /** Page title used in the native share sheet. */
  shareTitle?: string;
  /** Short description for the share sheet. */
  shareText?: string;
}

/**
 * Client-side extras that sit inside the hero section of VenueLayout.
 *
 * 1. Looped venue video overlay — opt-in per venue via videoSrc. Same
 *    upgrade gate as HeroSection: desktop only, motion-allowed, no save-data.
 *    Fades in once the video can play.
 *
 * 2. Cursor-reactive radial light source — pointer-fine desktop only.
 *    CSS variables drive the gradient centre so updates stay compositor-friendly.
 *
 * Kept separate from VenueLayout (server component) so the layout page
 * retains SSG without importing client APIs.
 */
export function VenueHeroExtras({ videoSrc, posterSrc, shareTitle, shareText }: Props) {
  const containerRef   = useRef<HTMLDivElement>(null);
  const videoRef       = useRef<HTMLVideoElement>(null);
  const cursorLightRef = useRef<HTMLDivElement>(null);

  const [videoMode,  setVideoMode]  = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [canShare,   setCanShare]   = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  // ── Video upgrade gate ──────────────────────────────────────────────
  useEffect(() => {
    if (!videoSrc) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    const conn = (navigator as Navigator & { connection?: NetworkConnection }).connection;
    if (conn?.saveData) return;
    setVideoMode(true);
  }, [videoSrc]);

  // ── Video fade-in once playable ─────────────────────────────────────
  useEffect(() => {
    if (!videoMode) return;
    const v = videoRef.current;
    if (!v) return;
    function onCanPlay() { setVideoReady(true); }
    v.addEventListener("canplay", onCanPlay);
    if (v.readyState >= 3) setVideoReady(true);
    return () => v.removeEventListener("canplay", onCanPlay);
  }, [videoMode]);

  // ── Cursor reactive radial light ───────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const container = containerRef.current;
    const light     = cursorLightRef.current;
    if (!container || !light) return;

    let ticking = false;

    const onMove = (e: MouseEvent) => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width)  * 100;
        const y = ((e.clientY - rect.top)  / rect.height) * 100;
        light.style.setProperty("--mx", `${x}%`);
        light.style.setProperty("--my", `${y}%`);
        light.style.opacity = "1";
        ticking = false;
      });
      ticking = true;
    };

    const onLeave = () => { light.style.opacity = "0"; };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    /* Wrapper fills the parent section via absolute inset.
       Share button uses pointer-events-auto to remain tappable. */
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>

      {/* Native share — top-right corner, mobile only, shows if API available */}
      {canShare && (
        <button
          onClick={async () => {
            try {
              await navigator.share({
                title: shareTitle ?? "Y — Guildford's Late-Night Quarter",
                text:  shareText  ?? "Three venues. One night.",
                url:   window.location.href,
              });
            } catch { /* User cancelled */ }
          }}
          aria-label="Share this venue"
          className="md:hidden pointer-events-auto absolute top-24 right-6 inline-flex items-center justify-center hover:opacity-100 transition-opacity duration-200"
          style={{
            width: "44px",
            height: "44px",
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "50%",
            opacity: 0.75,
            cursor: "pointer",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      )}

      {/* Looped video overlay */}
      {videoMode && videoSrc && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: videoReady ? 1 : 0,
            transition: "opacity 600ms ease-out",
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Cursor-reactive radial light — compositor-only via CSS variables */}
      <div
        ref={cursorLightRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          transition: "opacity 300ms",
          background: "radial-gradient(circle 380px at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.09) 0%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
