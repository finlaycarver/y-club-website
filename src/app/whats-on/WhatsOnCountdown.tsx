"use client";

import { useEffect, useState } from "react";
import type { EventItem } from "@/data/events";

interface Props {
  event: EventItem;
}

/**
 * Live countdown strip rendered below the What's On hero H1.
 *
 * Ticks every 60 seconds on the client. Under prefers-reduced-motion
 * the interval is skipped and the value is static (no live update).
 *
 * Returns null until hydrated to prevent SSR/client mismatch.
 */
function getCountdownText(isoDate: string): string {
  const now = new Date();
  const target = new Date(`${isoDate}T20:00:00`); // assume 8 pm doors
  const ms = target.getTime() - now.getTime();

  if (ms <= 0) return "Tonight";

  const totalMins = Math.floor(ms / 60_000);
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;

  if (hours >= 48) {
    const days = Math.floor(hours / 24);
    const rem = hours % 24;
    return rem > 0 ? `${days}d ${rem}h` : `${days}d`;
  }
  if (hours >= 24) return "Tomorrow";
  return `${hours}h ${mins.toString().padStart(2, "0")}m`;
}

export function WhatsOnCountdown({ event }: Props) {
  const [countdown, setCountdown] = useState<string | null>(null);

  useEffect(() => {
    function tick() {
      setCountdown(getCountdownText(event.isoDate));
    }
    tick(); // set on mount (avoids SSR mismatch via useState(null) guard)

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [event.isoDate]);

  if (!countdown) return null;

  return (
    <p
      className="flex flex-wrap items-center gap-x-2 gap-y-1"
      style={{
        marginTop: "20px",
        fontSize: "14px",
        fontWeight: 500,
        color: "rgba(255,255,255,0.55)",
      }}
    >
      <span
        style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
        }}
      >
        Next up
      </span>

      <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.2)" }}>·</span>

      <span style={{ color: "#FAFAFA", fontWeight: 600 }}>
        {event.title}
      </span>

      <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.2)" }}>·</span>

      <span>{event.date}</span>

      <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.2)" }}>·</span>

      {/* Countdown badge */}
      <span
        style={{
          color: "#FAFAFA",
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.04em",
          background: "rgba(255,255,255,0.08)",
          padding: "3px 9px",
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        {countdown}
      </span>
    </p>
  );
}
