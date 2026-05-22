"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  label: string;
  value: string;
}

/**
 * Parses a string like "3", "6+", or "1,000" into a numeric target + suffix.
 * Returns null for non-numeric values (e.g. "Fri+Sat").
 */
function parseNumericValue(value: string): { num: number; suffix: string } | null {
  const clean = value.replace(/,/g, "");
  const match = clean.match(/^(\d+)(\+?)$/);
  if (!match) return null;
  return { num: parseInt(match[1], 10), suffix: match[2] };
}

function formatNum(n: number, original: string): string {
  // Preserve comma formatting if the original used it (e.g. "1,000")
  return original.includes(",") ? n.toLocaleString() : String(n);
}

/**
 * Animates a number from 0 → `target` using requestAnimationFrame.
 * Fires only when `active` becomes true. Respects prefers-reduced-motion
 * (instant jump to target). Returns the current animated value.
 */
function useCountUp(target: number, duration: number, active: boolean): number {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!active) return;

    // Honour reduced-motion: skip animation, show final value immediately
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setCurrent(target);
      return;
    }

    let startTime: number | null = null;
    let raf: number;

    function step(ts: number) {
      if (startTime === null) startTime = ts;
      const elapsed  = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setCurrent(target);
      }
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return current;
}

/* ── Single stat cell ────────────────────────────────────────────── */
function StatCell({
  label,
  value,
  active,
  delay,
}: {
  label: string;
  value: string;
  active: boolean;
  /** Stagger delay in ms so each cell starts counting slightly after the previous. */
  delay: number;
}) {
  const parsed = parseNumericValue(value);
  // Non-numeric stats (e.g. "Fri+Sat") pass active=false to skip the animation
  const [delayedActive, setDelayedActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => setDelayedActive(true), delay);
    return () => clearTimeout(id);
  }, [active, delay]);

  const count = useCountUp(parsed?.num ?? 0, 1300, delayedActive && !!parsed);

  // Before intersection: show actual value (no flash).
  // Once counting starts: show animated number with suffix.
  const displayValue =
    delayedActive && parsed
      ? `${formatNum(count, value)}${parsed.suffix}`
      : value;

  return (
    <div
      style={{
        padding: "40px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <p
        style={{
          fontSize: "56px",
          fontWeight: 700,
          lineHeight: 1,
          color: "#FAFAFA",
          marginBottom: "10px",
          fontVariantNumeric: "tabular-nums",
          // Prevent layout shift during count-up (numbers can change width)
          minWidth: "2ch",
        }}
      >
        {displayValue}
      </p>
      <p
        style={{
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        {label}
      </p>
    </div>
  );
}

/* ── Stats grid ──────────────────────────────────────────────────── */
export function AboutStatsGrid({
  stats,
}: {
  stats: ReadonlyArray<Stat>;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-2 lg:grid-cols-4"
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {stats.map(({ label, value }, i) => (
        <StatCell
          key={label}
          label={label}
          value={value}
          active={active}
          delay={i * 120}
        />
      ))}
    </div>
  );
}
