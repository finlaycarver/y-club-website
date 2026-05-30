"use client";

import { useEffect, useState } from "react";

/**
 * Native share button for the venue hire thank-you page.
 * Lets the user forward the enquiry confirmation to a teammate or group.
 * Only renders when navigator.share is available (iOS / Chrome Android).
 */
export function ShareButton() {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setCanShare(typeof navigator !== "undefined" && !!navigator.share);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  if (!canShare) return null;

  async function handleShare() {
    try {
      await navigator.share({
        title: "Venue hire at Y — Guildford",
        text: "I've submitted a venue hire enquiry at Y Guildford. We should be hearing back within 48 hours.",
        url: "https://yguildford.com/venue-hire",
      });
    } catch { /* User cancelled */ }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="group inline-flex items-center justify-center gap-2 border border-white/30 px-6 text-[15px] font-medium text-white/70 hover:border-white hover:text-white transition-all duration-200 w-full md:w-auto"
      style={{ height: "52px" }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
      Share with your team
    </button>
  );
}
