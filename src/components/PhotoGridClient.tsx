"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface PhotoItem {
  src: string;
  alt: string;
}

interface Props {
  photos: ReadonlyArray<PhotoItem>;
  layout: "feature" | "split" | "row" | "quad";
}

/**
 * Client photo grid with:
 * - Stagger entrance via IntersectionObserver (no Framer Motion)
 * - Caption overlay on hover
 * - Lightbox on click (keyboard-navigable, focus-trapped)
 *
 * Three layout modes, unchanged from the server implementation:
 *   "feature" — Y Club (6 photos, panoramic last row)
 *   "split"   — Y Terrace (4 photos, 2-col feature)
 *   "row"     — Y Bar (3 photos, uniform 3-col)
 */
export function PhotoGridClient({ photos, layout }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const open  = useCallback((i: number) => setSelectedIndex(i), []);
  const close = useCallback(() => setSelectedIndex(null), []);
  const prev  = useCallback(() =>
    setSelectedIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
  [photos.length]);
  const next  = useCallback(() =>
    setSelectedIndex((i) => (i === null ? null : (i + 1) % photos.length)),
  [photos.length]);

  return (
    <>
      {layout === "row"     && <RowGrid     photos={photos} onOpen={open} />}
      {layout === "split"   && <SplitGrid   photos={photos} onOpen={open} />}
      {layout === "feature" && <FeatureGrid photos={photos} onOpen={open} />}
      {layout === "quad"    && <QuadGrid    photos={photos} onOpen={open} />}

      {selectedIndex !== null && (
        <Lightbox
          photos={photos}
          index={selectedIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  );
}

// ── Stagger hook ──────────────────────────────────────────────────────────────

function useStaggerEntrance(count: number) {
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gridRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cells = cellRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cells.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cells.forEach((c) => c.classList.add("photo-cell-entered"));
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        cells.forEach((cell, i) => {
          setTimeout(() => cell.classList.add("photo-cell-entered"), i * 80);
        });
        obs.disconnect();
      },
      { threshold: 0.1 },
    );

    if (gridRef.current) obs.observe(gridRef.current);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return { gridRef, cellRefs };
}

// ── Cell wrapper (stagger + caption overlay + click-to-open) ────────────────

function PhotoCell({
  photo,
  index,
  className,
  style,
  sizes,
  cellRef,
  onOpen,
}: {
  photo: PhotoItem;
  index: number;
  className?: string;
  style?: React.CSSProperties;
  sizes: string;
  cellRef: (el: HTMLDivElement | null) => void;
  onOpen: (i: number) => void;
}) {
  return (
    <div
      ref={cellRef}
      className={`photo-cell-stagger group relative overflow-hidden cursor-zoom-in${className ? ` ${className}` : ""}`}
      style={style}
      onClick={() => onOpen(index)}
      role="button"
      tabIndex={0}
      aria-label={`View ${photo.alt}`}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(index); }}}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        style={{ objectFit: "cover" }}
        sizes={sizes}
        className="transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
      />
      {/* Caption overlay on hover (A4-VX [LOW]) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 motion-reduce:transition-none"
        style={{ background: "linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)" }}
      >
        <p
          style={{
            padding: "12px 14px",
            fontSize: "13px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.4,
          }}
        >
          {photo.alt}
        </p>
      </div>
    </div>
  );
}

// ── Grid layouts ─────────────────────────────────────────────────────────────

function RowGrid({ photos, onOpen }: { photos: ReadonlyArray<PhotoItem>; onOpen: (i: number) => void }) {
  const { gridRef, cellRefs } = useStaggerEntrance(photos.length);
  return (
    <section ref={gridRef as React.RefObject<HTMLElement>} className="bg-black" style={{ paddingBottom: "2px" }}>
      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "2px" }}>
        {photos.map((photo, i) => (
          <PhotoCell
            key={photo.src}
            photo={photo}
            index={i}
            // 4/3 landscape — reduces section height by ~40% vs previous
            // portrait ratio. Y Bar's 3 photos at 470px wide = ~352px tall
            // per cell, not ~590px. Audit: A4-VS [HIGH] section too tall.
            style={{ aspectRatio: "4/3" }}
            sizes="(max-width: 768px) 100vw, 33vw"
            cellRef={(el) => { cellRefs.current[i] = el; }}
            onOpen={onOpen}
          />
        ))}
      </div>
    </section>
  );
}

function SplitGrid({ photos, onOpen }: { photos: ReadonlyArray<PhotoItem>; onOpen: (i: number) => void }) {
  const { gridRef, cellRefs } = useStaggerEntrance(photos.length);
  return (
    <section ref={gridRef as React.RefObject<HTMLElement>} className="bg-black" style={{ paddingBottom: "2px" }}>
      <div className="grid grid-cols-2" style={{ gap: "2px" }}>
        {photos.map((photo, i) => {
          const isFeature   = i === 0;
          // Last photo of a 4-photo split spans both columns (panoramic) —
          // fills the bottom row so no blank cells appear.
          const isPanoramic = i === photos.length - 1 && photos.length === 4;
          return (
            <PhotoCell
              key={photo.src}
              photo={photo}
              index={i}
              className={[
                isFeature   ? "row-span-2" : "",
                isPanoramic ? "col-span-2" : "",
              ].join(" ")}
              style={{
                // 2/3 on feature: consistent with 4/3 side photos.
                // feature (row-span-2) height = 2 × col_w×(3/4) = col_w×(3/2) = col_w/(2/3) ✓
                aspectRatio: isFeature ? "2/3" : isPanoramic ? "21/9" : "4/3",
              }}
              sizes={isPanoramic ? "100vw" : "50vw"}
              cellRef={(el) => { cellRefs.current[i] = el; }}
              onOpen={onOpen}
            />
          );
        })}
      </div>
    </section>
  );
}

function FeatureGrid({ photos, onOpen }: { photos: ReadonlyArray<PhotoItem>; onOpen: (i: number) => void }) {
  const { gridRef, cellRefs } = useStaggerEntrance(photos.length);
  return (
    <section ref={gridRef as React.RefObject<HTMLElement>} className="bg-black" style={{ paddingBottom: "2px" }}>
      <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: "2px" }}>
        {photos.map((photo, i) => {
          const isFeature   = i === 0;
          const isPanoramic = i === photos.length - 1 && photos.length === 6;
          return (
            <PhotoCell
              key={photo.src}
              photo={photo}
              index={i}
              className={[
                isFeature   ? "col-span-1 row-span-2" : "",
                isPanoramic ? "col-span-2 md:col-span-3" : "",
              ].filter(Boolean).join(" ")}
              style={{
                // 2/3 on feature: eliminates the undefined+minHeight height ambiguity.
                // feature (row-span-2) height = col_w/(2/3) = 2 × col_w × 3/4
                // = exactly 2 rows of 4/3 adjacent cells ✓
                aspectRatio: isFeature ? "2/3" : isPanoramic ? "21/9" : "4/3",
              }}
              sizes={
                isPanoramic
                  ? "100vw"
                  : "(max-width: 768px) 50vw, 33vw"
              }
              cellRef={(el) => { cellRefs.current[i] = el; }}
              onOpen={onOpen}
            />
          );
        })}
      </div>
    </section>
  );
}

// ── Quad layout ──────────────────────────────────────────────────────────────
// Clean 2×2 grid — all equal aspect ratio, no row-span.
// Fixes the height mismatch in the old "split" layout (A4-VX [HIGH]).

function QuadGrid({ photos, onOpen }: { photos: ReadonlyArray<PhotoItem>; onOpen: (i: number) => void }) {
  const { gridRef, cellRefs } = useStaggerEntrance(photos.length);
  return (
    <section ref={gridRef as React.RefObject<HTMLElement>} className="bg-black" style={{ paddingBottom: "2px" }}>
      <div className="grid grid-cols-2" style={{ gap: "2px" }}>
        {photos.map((photo, i) => (
          <PhotoCell
            key={photo.src}
            photo={photo}
            index={i}
            style={{ aspectRatio: "4/3" }}
            sizes="50vw"
            cellRef={(el) => { cellRefs.current[i] = el; }}
            onOpen={onOpen}
          />
        ))}
      </div>
    </section>
  );
}

// ── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: ReadonlyArray<PhotoItem>;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Keyboard navigation + body scroll lock
  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape")     { onClose(); return; }
      if (e.key === "ArrowLeft")  { onPrev();  return; }
      if (e.key === "ArrowRight") { onNext();  return; }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onPrev, onNext]);

  const photo = photos[index];
  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.94)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Close */}
      <button
        ref={closeRef}
        type="button"
        aria-label="Close photo"
        onClick={onClose}
        className="absolute flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
        style={{
          top: "20px", right: "20px",
          width: "44px", height: "44px",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.2)",
          cursor: "pointer", color: "#FAFAFA", zIndex: 10,
        }}
      >
        <X size={20} aria-hidden="true" />
      </button>

      {/* Prev */}
      {photos.length > 1 && (
        <button
          type="button"
          aria-label="Previous photo"
          onClick={onPrev}
          className="absolute flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
          style={{
            left: "16px", top: "50%", transform: "translateY(-50%)",
            width: "44px", height: "44px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
            cursor: "pointer", color: "#FAFAFA", zIndex: 10,
          }}
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
      )}

      {/* Image */}
      <div
        className="relative"
        style={{
          width: "min(90vw, 1200px)",
          height: "min(80vh, 800px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="90vw"
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      {/* Caption */}
      <p
        className="absolute text-center"
        style={{
          bottom: "24px", left: "50%", transform: "translateX(-50%)",
          fontSize: "13px", fontWeight: 500,
          color: "rgba(255,255,255,0.5)",
          maxWidth: "600px", lineHeight: 1.5,
        }}
      >
        {photo.alt}
        {photos.length > 1 && (
          <span style={{ color: "rgba(255,255,255,0.3)", marginLeft: "10px" }}>
            {index + 1} / {photos.length}
          </span>
        )}
      </p>

      {/* Next */}
      {photos.length > 1 && (
        <button
          type="button"
          aria-label="Next photo"
          onClick={onNext}
          className="absolute flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
          style={{
            right: "16px", top: "50%", transform: "translateY(-50%)",
            width: "44px", height: "44px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
            cursor: "pointer", color: "#FAFAFA", zIndex: 10,
          }}
        >
          <ChevronRight size={22} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
