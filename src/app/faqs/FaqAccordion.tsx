"use client";

import { useId, useState } from "react";
import { FAQS, type FaqItem } from "@/data/faqs";

function FaqRow({ faq, index, idPrefix }: { faq: FaqItem; index: number; idPrefix: string }) {
  const [open, setOpen] = useState(index === 0);
  const panelId = `${idPrefix}-panel-${index}`;
  const buttonId = `${idPrefix}-button-${index}`;

  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left flex items-start justify-between gap-6 hover:opacity-80 transition-opacity duration-200 motion-reduce:transition-none cursor-pointer"
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
        Animated panel — CSS-grid trick: animating grid-template-rows
        between 0fr and 1fr smoothly tweens the panel's intrinsic
        content height. Avoids the abrupt `hidden` toggle and means
        the first-row-open default no longer "jumps" on close.
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
 * Generic FAQ accordion. Defaults to the sitewide FAQ list; pass `items`
 * to render a page-specific subset (e.g. members FAQs on /members).
 *
 * If any item has a `category`, the accordion renders grouped sections
 * with category headers. Otherwise it renders a flat list — keeps the
 * existing /members behaviour unchanged.
 *
 * Each instance gets a unique `idPrefix` from `useId()` so multiple
 * accordions on the same page have collision-free ARIA references.
 */
export function FaqAccordion({ items = FAQS }: { items?: ReadonlyArray<FaqItem> }) {
  const idPrefix = useId();
  const hasCategories = items.some((item) => item.category);

  if (!hasCategories) {
    return (
      <>
        {items.map((faq, i) => (
          <FaqRow key={faq.question} faq={faq} index={i} idPrefix={idPrefix} />
        ))}
      </>
    );
  }

  /* Group preserving first-encounter order — so the data file controls
     the visual order without forcing alphabetisation. */
  const groups: { category: string; items: FaqItem[] }[] = [];
  for (const item of items) {
    const key = item.category ?? "More";
    let group = groups.find((g) => g.category === key);
    if (!group) {
      group = { category: key, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  }

  let flatIndex = 0;
  return (
    <>
      {groups.map((group) => (
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
          {group.items.map((faq) => {
            const itemIndex = flatIndex++;
            return (
              <FaqRow key={faq.question} faq={faq} index={itemIndex} idPrefix={idPrefix} />
            );
          })}
        </div>
      ))}
    </>
  );
}
