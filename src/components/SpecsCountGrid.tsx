"use client";

import { useEffect, useRef, useState } from "react";

interface SpecItem {
  label: string;
  value: string;
  compact?: boolean;
  /** Optional accent pill rendered below the label (e.g. "Summer only"). */
  accentBadge?: string;
}

interface Props {
  specs: ReadonlyArray<SpecItem>;
  specsStyle: "numeric" | "text" | "highlights";
}

/**
 * Animated specs 2×2 grid. When the grid enters the viewport, numeric
 * values count up from 0. Text values (e.g. "Fri + Sat") display static.
 *
 * Prefers-reduced-motion: skips the animation and shows the final value
 * immediately.
 *
 * Edge-light rim via box-shadow (A4-VX [LOW]).
 */
export function SpecsCountGrid({ specs, specsStyle }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // "highlights" — horizontal pill list; used for venues with no numbers
  // (Y Bar & Lounge) so the specs feel like a curated "highlights" strip
  // rather than a grid that implies numerical data.
  if (specsStyle === "highlights") {
    return (
      <div ref={containerRef} className="flex flex-wrap gap-2 self-start">
        {specs.map((item) => (
          <span
            key={item.value}
            style={{
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.75)",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              padding: "10px 16px",
              whiteSpace: "nowrap",
              // Fade-in stagger driven by active state
              opacity: active ? 1 : 0,
              transform: active ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {item.value}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-2"
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        alignSelf: "start",
        // Edge-light rim — A4-VX [LOW]
        boxShadow: "0 0 32px -8px rgba(255,255,255,0.07), 0 0 0 1px rgba(255,255,255,0.04)",
      }}
    >
      {specs.map((item) => (
        <SpecCell
          key={item.label}
          item={item}
          specsStyle={specsStyle}
          active={active}
        />
      ))}
    </div>
  );
}

function SpecCell({
  item,
  specsStyle,
  active,
}: {
  item: SpecItem;
  specsStyle: "numeric" | "text";
  active: boolean;
}) {
  const numericTarget = parseInt(item.value, 10);
  const isNumeric = !isNaN(numericTarget) && String(numericTarget) === item.value;

  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (!active || !isNumeric) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayCount(numericTarget);
      return;
    }
    const DURATION = 1200;
    const start = performance.now();
    let frameId: number;
    function frame(now: DOMHighResTimeStamp) {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out-cubic
      setDisplayCount(Math.round(eased * numericTarget));
      if (t < 1) frameId = requestAnimationFrame(frame);
    }
    frameId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, [active, isNumeric, numericTarget]);

  const fontSize = item.compact
    ? "28px"
    : specsStyle === "numeric"
    ? "44px"
    : "28px";
  const lineHeight = item.compact
    ? 1.2
    : specsStyle === "numeric"
    ? 1
    : 1.2;

  return (
    <div
      style={{
        padding: "28px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <p
        style={{
          fontSize,
          fontWeight: 700,
          lineHeight,
          color: "#FAFAFA",
          marginBottom: "8px",
          fontVariantNumeric: isNumeric ? "tabular-nums" : undefined,
          transition: "none",
        }}
      >
        {isNumeric && active ? displayCount : item.value}
      </p>
      <p
        style={{
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          marginBottom: item.accentBadge ? "8px" : 0,
        }}
      >
        {item.label}
      </p>
      {item.accentBadge && (
        <span
          style={{
            display: "inline-block",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#080808",
            background: "rgba(255,255,255,0.88)",
            padding: "3px 8px",
          }}
        >
          {item.accentBadge}
        </span>
      )}
    </div>
  );
}
