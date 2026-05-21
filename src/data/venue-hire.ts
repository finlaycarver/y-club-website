/**
 * Single source of truth for the /venue-hire page content arrays:
 *   - SPACES   : the three hireable venue cards
 *   - EVENT_TYPES_FORM : options for the form's "Event type" select
 *   - EVENT_TYPES_STRIP: chips shown in the "We host" strip above the form
 *
 * Keep prose copy here so future content tweaks don't require a
 * component edit. Plain text only — never HTML entities.
 */

export interface HireSpace {
  name: string;
  capacity: string;
  imageUrl: string;
  features: ReadonlyArray<string>;
  bestFor: string;
}

export const SPACES: ReadonlyArray<HireSpace> = [
  {
    name: "Y Club",
    capacity: "Up to 500",
    imageUrl: "/images/12.webp",
    features: [
      "Two rooms · Two dance floors",
      "Two bars · DJ booth",
      "State-of-the-art sound & lighting",
      "Smoke machines",
    ],
    bestFor: "Birthdays, big nights, corporate parties",
  },
  {
    name: "Y Terrace",
    capacity: "Up to 500",
    imageUrl: "/images/club-y-image-4.webp",
    features: [
      "Four bars · VIP roof terrace",
      "Two DJ booths · Large dance floor",
      "Outdoor and covered space",
      "Summer-only operation",
    ],
    bestFor: "Summer parties, day events, corporate days",
  },
  {
    name: "Y Bar & Lounge",
    capacity: "Intimate",
    imageUrl: "/images/nadine-195.jpg",
    features: [
      "Cocktail bar · Lounge seating",
      "Curated music · Atmospheric lighting",
      "Suitable for pre-drinks & private hire",
      "Bottle service available",
    ],
    bestFor: "Pre-drinks, intimate celebrations, networking",
  },
];

/** Options for the form's "Event type" select. */
export const EVENT_TYPES_FORM: ReadonlyArray<string> = [
  "Birthday party",
  "Corporate event",
  "Christmas / NYE",
  "Live performance",
  "Promoter booking",
  "Wedding reception",
  "Award show / Gala",
  "Other",
];

/** Pill chips for the "We host" strip — broader and more colloquial than the form list. */
export const EVENT_TYPES_STRIP: ReadonlyArray<string> = [
  "Birthdays", "Graduations", "Corporate nights", "Christmas parties",
  "NYE", "Live performances", "Award shows", "Fashion shows",
  "Galas", "Promotional events", "Sports screenings", "Halloween",
];
