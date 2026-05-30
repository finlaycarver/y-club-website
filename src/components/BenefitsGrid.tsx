"use client";

import { useEffect, useRef } from "react";
import { Gift, Ticket, Sparkles, Cake, Crown, UserPlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Benefit {
  Icon: LucideIcon;
  title: string;
  body: string;
}

/**
 * Six membership benefits — expanded from the original four so the
 * value proposition feels richer before the signup form.
 */
const BENEFITS: ReadonlyArray<Benefit> = [
  {
    Icon: Gift,
    title: "Free drinks",
    body: "Members-only drink offers, rotating monthly across all three venues.",
  },
  {
    Icon: Ticket,
    title: "Early ticket access",
    body: "First in line for major events. Get tickets before they go on sale to the public.",
  },
  {
    Icon: Sparkles,
    title: "Exclusive offers",
    body: "Promotional discounts, VIP table upgrades, and members-only nights.",
  },
  {
    Icon: Cake,
    title: "Birthday perks",
    body: "Treats on us when you celebrate at Y in your birthday month.",
  },
  {
    Icon: Crown,
    title: "Priority entry",
    body: "Skip the queue on busy nights at all three venues — show your member ID on the door.",
  },
  {
    Icon: UserPlus,
    title: "Bring a +1",
    body: "Selected members-only nights include a plus-one. Share the perks.",
  },
];

// ── Stagger entrance ─────────────────────────────────────────────────────────

function useStaggerEntrance(count: number) {
  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cells = cellRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!cells.length || !gridRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cells.forEach((c) => c.classList.add("benefit-entered"));
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        cells.forEach((cell, i) =>
          setTimeout(() => cell.classList.add("benefit-entered"), i * 90),
        );
        obs.disconnect();
      },
      { threshold: 0.1 },
    );

    obs.observe(gridRef.current);
    return () => obs.disconnect();
  }, [count]);

  return { gridRef, cellRefs };
}

// ── 3D tilt per cell (pointer:fine only) ────────────────────────────────────

function use3DTilt(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      el.style.transform = `perspective(600px) rotateX(${(y - 0.5) * -6}deg) rotateY(${(x - 0.5) * 6}deg) translateZ(4px)`;
      el.style.transition = "transform 80ms linear";
    };

    const onLeave = () => {
      el.style.transform =
        "perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0)";
      el.style.transition = "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref]);
}

// ── BenefitCell ──────────────────────────────────────────────────────────────

function BenefitCell({
  benefit,
  cellRef,
}: {
  benefit: Benefit;
  cellRef: (el: HTMLDivElement | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  use3DTilt(ref);

  return (
    <div
      ref={(el) => {
        // Assign to the local tilt ref AND the stagger array ref
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        cellRef(el);
      }}
      className="benefit-cell py-6 px-5 md:py-10 md:px-8"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <benefit.Icon
        aria-hidden="true"
        size={32}
        strokeWidth={1.5}
        color="#FAFAFA"
        style={{ opacity: 0.9 }}
      />
      <h3
        style={{
          fontSize: "24px",
          fontWeight: 700,
          lineHeight: 1.2,
          color: "#FAFAFA",
          letterSpacing: "-0.01em",
        }}
      >
        {benefit.title}
      </h3>
      <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>
        {benefit.body}
      </p>
    </div>
  );
}

// ── BenefitsGrid ─────────────────────────────────────────────────────────────

/**
 * Animated benefits grid — stagger entrance on scroll, subtle 3D card
 * tilt on hover (pointer:fine devices only). Exported so the Members
 * page can import it as a client island from a server component.
 */
export function BenefitsGrid() {
  const { gridRef, cellRefs } = useStaggerEntrance(BENEFITS.length);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      style={{ border: "1px solid rgba(255,255,255,0.1)" }}
    >
      {BENEFITS.map((benefit, i) => (
        <BenefitCell
          key={benefit.title}
          benefit={benefit}
          cellRef={(el) => {
            cellRefs.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}
