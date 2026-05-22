import type { Metadata } from "next";
import { VenueHireClient } from "./VenueHireClient";

export const metadata: Metadata = {
  title: "Venue Hire — Birthdays, Corporate, Christmas Parties",
  description:
    "Hire Y Club, Y Terrace or Y Bar & Lounge for your event. Up to 1,500 capacity combined. Birthdays, corporate, NYE, Christmas, sport screenings.",
  alternates: { canonical: "/venue-hire" },
  openGraph: {
    title: "Hire Y — Birthdays, Corporate, Christmas Parties",
    description:
      "Three venues. One enquiry. We'll handle the rest.",
    url: "/venue-hire",
    images: [{ url: "/images/nadine-195.jpg", width: 1200, height: 630 }],
  },
};

export default function VenueHirePage() {
  return <VenueHireClient />;
}
