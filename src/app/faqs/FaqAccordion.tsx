"use client";

import { useId, useState, useMemo } from "react";
import Link from "next/link";
import { FAQS, type FaqItem } from "@/data/faqs";
import { ChevronRightIcon } from "@/components/icons";

/** Strip HTML tags from an answer string for search matching. */
function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/&\w+;/g, " ");
}

function FaqRow({ faq, index, idPrefix, highlighted }: {
  faq: FaqItem;
  index: number;
  idPrefix: string;
  highlighted?: boolean;
}) {
  const [open, setOpen] = useState(index === 0);
  const panelId  = `${idPrefix}-panel-${index}`;
  const buttonId = `${idPrefix}-button-${index}`;

  return (
    <div
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        background: highlighted ? "rgba(255,255,255,0.03)" : "transparent",
        transition: "background 0.2s ease",
      }}
    >
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="faq-ripple w-full text-left flex items-start justify-between gap-6 hover:opacity-80 transition-opacity duration-200 motion-reduce:transition-none cursor-pointer"
        style={{
          padding: "28px 0",
          color: "#FAFAFA",
          background: "transparent",
          border: "none",
          fontFamily: "inherit",
        }}
      >
        <span className="text-[22px] md:text-[28px]" style={{
          fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em",
        }}>
          {faq.question}
        </span>
        <span
          aria-hidden="true"
          className="shrink-0"
          style={{
            width: "32px", height: "32px",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.25)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            fontSize: "20px",
            lineHeight: 1,
          }}
        >
          +
        </span>
      </button>
      {/*
        CSS-grid height animation: grid-template-rows 0fr → 1fr smoothly
        tweens intrinsic content height. No scroll jump on close.
      */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!open}
        className="motion-reduce:transition-none"
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          maxWidth: "780px",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <p
            className="faq-answer"
            style={{
              fontSize: "17px",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.7,
              paddingBottom: "28px",
            }}
            dangerouslySetInnerHTML={{ __html: faq.answer }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * FAQ accordion with live search filter, category grouping, smart
 * suggestions, and a tap-ripple affordance on items.
 */
export function FaqAccordion({ items = FAQS }: { items?: ReadonlyArray<FaqItem> }) {
  const idPrefix = useId();
  const [query, setQuery] = useState("");
  const hasCategories = items.some((item) => item.category);

  /* Live search — filters by question or answer (tags stripped). */
  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (faq) =>
        faq.question.toLowerCase().includes(q) ||
        stripTags(faq.answer).toLowerCase().includes(q),
    );
  }, [items, query]);

  const showingAll = filtered.length === items.length;

  /* Group preserving first-encounter order. */
  function groupItems(list: ReadonlyArray<FaqItem>) {
    const groups: { category: string; items: FaqItem[] }[] = [];
    for (const item of list) {
      const key = item.category ?? "More";
      let group = groups.find((g) => g.category === key);
      if (!group) {
        group = { category: key, items: [] };
        groups.push(group);
      }
      group.items.push(item);
    }
    return groups;
  }

  return (
    <>
      {/* ── Search field ─────────────────────────────────────────────── */}
      <div style={{ paddingTop: "48px", paddingBottom: "8px", maxWidth: "620px" }}>
        <label htmlFor="faq-search" style={{
          display: "block",
          fontSize: "12px", fontWeight: 500, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "12px",
        }}>
          Search
        </label>
        <div style={{ position: "relative" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16" height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{
              position: "absolute", left: "14px", top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255,255,255,0.35)",
              pointerEvents: "none",
            }}
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            id="faq-search"
            type="search"
            placeholder="E.g. dress code, cloakroom, jobs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search FAQs"
            autoComplete="off"
            style={{
              width: "100%",
              height: "50px",
              paddingLeft: "42px",
              paddingRight: "16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 0,
              color: "#FAFAFA",
              fontFamily: "inherit",
              fontSize: "16px",
              outline: "none",
            }}
            className="focus:border-white/50 transition-[border-color] duration-200"
          />
        </div>
        {/* Live result count when filtering */}
        {query.trim() && (
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "10px" }}>
            {filtered.length === 0
              ? "No matches — try different keywords"
              : `${filtered.length} ${filtered.length === 1 ? "result" : "results"}`}
          </p>
        )}
      </div>

      {/* ── FAQ list ─────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div style={{ paddingTop: "40px", paddingBottom: "40px" }}>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)" }}>
            No FAQs match &ldquo;{query}&rdquo;. Try different keywords or{" "}
            <button
              type="button"
              onClick={() => setQuery("")}
              className="underline underline-offset-4 hover:opacity-100 transition-opacity duration-200"
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", fontFamily: "inherit", fontSize: "inherit" }}
            >
              clear the search
            </button>.
          </p>
        </div>
      ) : !hasCategories || query.trim() ? (
        /* Flat list — used when there are no categories OR when searching
           (searching collapses categories for a simpler result view). */
        filtered.map((faq, i) => (
          <FaqRow
            key={faq.question}
            faq={faq}
            index={i}
            idPrefix={idPrefix}
            highlighted={!!query.trim()}
          />
        ))
      ) : (
        /* Grouped by category */
        groupItems(filtered).map((group, gi) => {
          const baseIndex = groupItems(filtered)
            .slice(0, gi)
            .reduce((acc, g) => acc + g.items.length, 0);
          return (
            <div key={group.category} className="mb-8 md:mb-12">
              <h2
                className="text-[14px] md:text-[15px]"
                style={{
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: "16px",
                  paddingTop: "8px",
                }}
              >
                {group.category}
              </h2>
              {group.items.map((faq, i) => (
                <FaqRow
                  key={faq.question}
                  faq={faq}
                  index={baseIndex + i}
                  idPrefix={idPrefix}
                />
              ))}
            </div>
          );
        })
      )}

      {/* ── Smart suggestions ────────────────────────────────────────── */}
      {showingAll && !query.trim() && (
        <nav
          aria-label="Related pages"
          style={{
            marginTop: "48px",
            paddingTop: "32px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p style={{
            fontSize: "12px", fontWeight: 500, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "16px",
          }}>
            Related
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "/venue-hire",  label: "Venue Hire" },
              { href: "/members",     label: "Membership" },
              { href: "/about",       label: "About Y"    },
              { href: "/whats-on",    label: "What's On"  },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group inline-flex items-center gap-1.5 hover:opacity-100 transition-opacity duration-200 motion-reduce:transition-none"
                style={{
                  fontSize: "14px", fontWeight: 500,
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.15)",
                  padding: "8px 14px",
                }}
              >
                {link.label}
                <ChevronRightIcon className="size-3.5 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
              </Link>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}
