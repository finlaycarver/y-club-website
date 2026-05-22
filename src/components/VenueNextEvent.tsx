"use client";

import { useEffect, useState } from "react";
import type { EventItem } from "@/data/events";

interface Props {
  event: EventItem;
}

/**
 * Compact "Next event tonight" ticker rendered below the venue hero subhead.
 *
 * Returns null until hydrated to prevent SSR/client mismatch on the live
 * countdown value. Updates every 60 seconds. Respects prefers-reduced-motion
 * (skips interval — value is computed once on mount and stays static).
 */
function countdown(isoDate: string): string {
  const now    = new Date();
  const target = new Date(`${isoDate}T20:00:00`);
  const ms     = target.getTime() - now.getTime();

  if (ms <= 0) return "On tonight";

  const totalMins = Math.floor(ms / 60_000);
  const hours     = Math.floor(totalMins / 60);
  if (hours >= 48) {
    const days = Math.floor(hours / 24);
    const rem  = hours % 24;
    return rem > 0 ? `${days}d ${rem}h` : `${days}d`;
  }
  if (hours >= 24) return "Tomorrow";
  return `${hours}h ${String(totalMins % 60).padStart(2, "0")}m`;
}

export function VenueNextEvent({ event }: Props) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    function tick() { setLabel(countdown(event.isoDate)); }
    tick();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [event.isoDate]);

  if (!label) return null;

  return (
    <p
      style={{
        marginTop: "20px",
        display: "inline-flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "8px",
        fontSize: "14px",
        fontWeight: 500,
        color: "rgba(255,255,255,0.55)",
      }}
    >
      <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
        Next up
      </span>
      <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
      <a
        href={event.ticketUrl}
        target={event.ticketUrl.startsWith("http") ? "_blank" : undefined}
        rel={event.ticketUrl.startsWith("http") ? "noopener noreferrer" : undefined}
        style={{ color: "#FAFAFA", fontWeight: 600, textDecoration: "none" }}
        className="hover:underline"
      >
        {event.title}
      </a>
      <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
      <span>{event.date}</span>
      <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
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
        {label}
      </span>
    </p>
  );
}
