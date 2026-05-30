/**
 * Site-wide configuration. Single source of truth for canonical URL,
 * brand metadata and contact details. Used by metadata, sitemap, robots,
 * and structured-data helpers.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://club-y.vercel.app";

export const SITE_NAME = "Y";
export const SITE_FULL_NAME = "Y — Guildford's Late-Night Quarter";
export const SITE_DESCRIPTION =
  "Three venues in the heart of Guildford. Y Club, Y Terrace, and Y Bar & Lounge — all a short walk apart.";

export const BRAND = {
  phone: "+441483342027",
  phoneDisplay: "01483 342027",
  email: "barmanager@dreamoyster.com",
  jobsEmail: "ybar@dreamoyster.com",
  instagram: "https://instagram.com/yclubguildford",
  facebook: "https://facebook.com/guildford.y.bar",
  tiktok: "https://tiktok.com/@y.nightclub0",
  /** Brand-level opening hours summary. Shown in the footer Contact block.
   *  Per-venue hours live on their respective venue pages. */
  hoursDisplay: "Wed–Sat, 8pm onwards",
} as const;

/**
 * UK company registration line. Both env vars are optional — when
 * either is absent the footer block doesn't render, so layout stays
 * clean until real numbers are configured in Vercel env.
 */
export const COMPANY = {
  legalName: process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME ?? "",
  registrationNumber: process.env.NEXT_PUBLIC_COMPANY_NUMBER ?? "",
  vatNumber: process.env.NEXT_PUBLIC_VAT_NUMBER ?? "",
} as const;

export const VENUES = {
  yClub: {
    name: "Y Club",
    streetAddress: "Cornerhouse, Onslow Street",
    locality: "Guildford",
    postalCode: "GU1 4SQ",
    region: "Surrey",
    country: "GB",
    geo: { latitude: 51.2367, longitude: -0.5704 }, // approximate
  },
  yTerrace: {
    name: "Y Terrace",
    streetAddress: "2–4 The Quadrant, Bridge Street",
    locality: "Guildford",
    postalCode: "GU1 4SG",
    region: "Surrey",
    country: "GB",
    geo: { latitude: 51.2356, longitude: -0.5734 }, // approximate
  },
  yBarLounge: {
    name: "Y Bar & Lounge",
    streetAddress: "", // [CONFIRM] — Michelle still to confirm
    locality: "Guildford",
    postalCode: "",
    region: "Surrey",
    country: "GB",
  },
} as const;

/** Builds an absolute URL for canonical/OG metadata. */
export function absoluteUrl(path = "/"): string {
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalised}`;
}
