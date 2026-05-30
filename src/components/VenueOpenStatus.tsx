"use client";

/**
 * Displays a day-aware "Open tonight" / "Open Fri" indicator alongside
 * the venue address. Client-only — reading the current date in SSR would
 * produce a stale value.
 *
 * @param openDays  0=Sun, 1=Mon, …, 5=Fri, 6=Sat
 */
export function VenueOpenStatus({ openDays }: { openDays: ReadonlyArray<number> }) {
  const day = new Date().getDay();
  let status = "Open this weekend";

  if (openDays.includes(day)) {
    status = "Open tonight";
  } else {
    for (let i = 1; i <= 7; i += 1) {
      const next = (day + i) % 7;
      if (openDays.includes(next)) {
        const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        status = i === 1 ? "Open tomorrow" : `Open ${names[next]}`;
        break;
      }
    }
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]"
      style={{ color: "rgba(255,255,255,0.6)" }}
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      {status}
    </span>
  );
}
