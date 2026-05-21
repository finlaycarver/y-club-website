"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Wraps a section in a gentle fade-up that fires once when the section
 * scrolls into view. Respects `prefers-reduced-motion` (renders fully
 * visible immediately) so the motion is a polish layer, never a barrier.
 *
 * Sections below the hero are off-screen on initial paint, so the
 * `opacity: 0` SSR state is invisible to the user. The IntersectionObserver
 * upgrades each section to `opacity: 1` as it enters the viewport.
 *
 * Why not pure CSS view-timeline? Browser support is still patchy
 * (Safari shipped only in 17.4+). IntersectionObserver is universal
 * and the perf cost of one observer per section is negligible.
 */
export interface ScrollRevealProps {
  children: ReactNode;
  /** Optional stagger to give grouped reveals natural rhythm. */
  delayMs?: number;
}

export function ScrollReveal({ children, delayMs = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Reduced motion: fade-up is decorative — skip it entirely.
    // window.matchMedia is client-only, so we can only check after mount.
    // The setState is one-shot, not cascading.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevealed(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.unobserve(el);
        }
      },
      {
        // Fire slightly before the section is fully in view so the
        // animation feels like the section is greeting the scroll
        // rather than catching up to it.
        rootMargin: "0px 0px -80px 0px",
        threshold: 0.05,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
        willChange: revealed ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
