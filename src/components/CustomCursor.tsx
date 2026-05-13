"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only activate on pointer: fine (mouse) devices
    if (!window.matchMedia("(pointer: fine)").matches) return;
    // Respect reduced motion — skip the lagged ring animation
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let ringX = 0, ringY = 0;
    let mouseX = 0, mouseY = 0;
    let animId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
      }
      // In reduced-motion mode, ring snaps to cursor too
      if (reduceMotion && ringRef.current) {
        ringRef.current.style.transform = `translate(${mouseX - 16}px, ${mouseY - 16}px)`;
      }
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`;
      }
      animId = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", () => setVisible(false));
    document.addEventListener("mouseenter", () => setVisible(true));

    if (!reduceMotion) animId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Dot — snaps to cursor instantly */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position:     "fixed",
          top:          0,
          left:         0,
          width:        "6px",
          height:       "6px",
          borderRadius: "50%",
          background:   "white",
          pointerEvents:"none",
          zIndex:       99999,
          mixBlendMode: "difference",
          willChange:   "transform",
          opacity:      visible ? 1 : 0,
          transition:   "opacity 0.2s ease",
        }}
      />
      {/* Ring — spring-lagged, follows cursor */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position:     "fixed",
          top:          0,
          left:         0,
          width:        "32px",
          height:       "32px",
          borderRadius: "50%",
          border:       "1px solid rgba(255,255,255,0.6)",
          pointerEvents:"none",
          zIndex:       99999,
          mixBlendMode: "difference",
          willChange:   "transform",
          opacity:      visible ? 1 : 0,
          transition:   "opacity 0.2s ease",
        }}
      />
    </>
  );
}
