/**
 * Build an RFC-5545 .ics data URL for a single event.
 *
 * Used by the "Add to calendar" button on the events bottom sheet. The
 * data URL contains the entire ICS payload — no backend / hosted file
 * needed. iOS Safari and Android Chrome both honour these.
 *
 * Default times (no per-event time stored on EventItem yet):
 *   - Single-day event: 20:00 → 03:00 next day (matches "8pm onwards")
 *   - Multi-day event (isoEndDate set): 20:00 first day → 23:59 last day
 */

import type { EventItem } from "@/data/events";

const VENUE_FULL_ADDRESS: Record<string, string> = {
  "Y Club":         "Y Club, Cornerhouse, Onslow Street, Guildford GU1 4SQ",
  "Y Terrace":      "Y Terrace, 2–4 The Quadrant, Bridge Street, Guildford GU1 4SG",
  "Y Bar & Lounge": "Y Bar & Lounge, Guildford",
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** "YYYY-MM-DD" + "HH:mm:ss" → "YYYYMMDDTHHMMSS" (floating/local) */
function isoDateTimeToIcs(isoDate: string, time: string): string {
  const [Y, M, D] = isoDate.split("-").map(Number);
  const [h, m, s] = time.split(":").map(Number);
  return `${Y}${pad(M)}${pad(D)}T${pad(h)}${pad(m)}${pad(s)}`;
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function addOneDay(isoDate: string): string {
  const [Y, M, D] = isoDate.split("-").map(Number);
  const d = new Date(Date.UTC(Y, M - 1, D));
  d.setUTCDate(d.getUTCDate() + 1);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

function nowUtcStamp(): string {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function buildEventIcsDataUrl(event: EventItem): string {
  const venueAddress = VENUE_FULL_ADDRESS[event.venue] ?? event.venue;
  const isMultiDay   = !!event.isoEndDate && event.isoEndDate !== event.isoDate;

  const dtStart = isoDateTimeToIcs(event.isoDate, "20:00:00");
  const dtEnd   = isMultiDay && event.isoEndDate
    ? isoDateTimeToIcs(event.isoEndDate, "23:59:00")
    : isoDateTimeToIcs(addOneDay(event.isoDate), "03:00:00");

  // RFC 5545 requires CRLF line endings between properties
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Y Guildford//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.slug}@y-guildford.uk`,
    `DTSTAMP:${nowUtcStamp()}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `LOCATION:${escapeIcsText(venueAddress)}`,
    `URL:${event.ticketUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}
