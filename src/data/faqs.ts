/**
 * Source of truth for FAQ content. Used by both the on-page accordion
 * and the FAQPage JSON-LD schema. Answers may contain inline HTML —
 * the schema helper strips tags before emitting structured data.
 */

/** FAQ category used to group questions on the /faqs page. Optional —
 *  pages that don't need grouping (like /members) can leave it unset. */
export type FaqCategory = "On the door" | "In venue" | "Work with us";

export interface FaqItem {
  question: string;
  answer: string;
  category?: FaqCategory;
}

export const FAQS: ReadonlyArray<FaqItem> = [
  {
    category: "On the door",
    question: "Admissions",
    answer:
      "Entry to the club is for over-18s only. Bring valid photo ID. Bag searches may take place on entry and refusal to be searched means refusal of entry. Management reserves the right to refuse entry at their discretion. We operate a no re-admission policy except in genuine emergencies. <strong>Zero tolerance on drug use or dealing</strong> — anyone caught will be detained and reported to the police.",
  },
  {
    category: "On the door",
    question: "Safety",
    answer:
      "Our security team conducts thorough searches and is on hand to help anyone who feels unwell. We have zero tolerance for non-consensual behaviour or drink tampering — incidents will be reported to police and offenders banned. Uniformed and plain-clothed security monitor every space in person and on CCTV.",
  },
  {
    category: "On the door",
    question: "Dress code",
    answer:
      "Smart-casual. No tracksuits. No hoodies. No sportswear. Dress to dance.",
  },
  {
    category: "In venue",
    question: "Smoking and vaping",
    answer:
      "All outdoor spaces are designated smoking areas. Smoking or vaping inside will result in ejection without refund.",
  },
  {
    category: "In venue",
    question: "Cloakroom",
    answer:
      "The cloakroom is for convenience, not secure storage — high-value items are at your own risk. Keep your ticket safe. Uncollected items become lost property after the event and are retained for 14 days minimum. Maximum liability for any lost item is £40 and only with evidence of value.",
  },
  {
    category: "In venue",
    question: "Lost property",
    answer:
      "Email <a class='underline' href='mailto:barmanager@dreamoyster.com?subject=Lost%20Property'>barmanager@dreamoyster.com</a> with \"Lost Property\" as the subject. Items are kept for one month maximum. Valuables may be retained longer. IDs and passports are securely destroyed after four weeks if unclaimed.",
  },
  {
    category: "Work with us",
    question: "Jobs at Y",
    answer:
      "We&rsquo;re always hiring. Send your CV to <a class='underline' href='mailto:ybar@dreamoyster.com?subject=Job%20application'>ybar@dreamoyster.com</a> or pop in during open hours and ask for a manager. See our <a class='underline' href='/about#careers'>careers section</a> for current openings.",
  },
];

/**
 * Members-specific FAQ shown at the bottom of /members. Kept separate
 * from the general FAQ above so each surface stays focused.
 */
export const MEMBERS_FAQS: ReadonlyArray<FaqItem> = [
  {
    question: "Does membership cost anything?",
    answer:
      "Nothing. Y Membership is free forever — no joining fee, no subscription, no hidden charges. We may launch a paid VIP tier in the future, but the free tier you sign up to today stays free.",
  },
  {
    question: "When will I hear from you after signing up?",
    answer:
      "You'll get a welcome email within a few minutes with your member details. After that, expect occasional emails — event drops, members-only offers, early ticket releases. Nothing spammy.",
  },
  {
    question: "How do I redeem free drinks and perks?",
    answer:
      "Show your welcome email or member confirmation at the bar — we'll do the rest. Free drink offers rotate monthly across all three venues and run while stocks last.",
  },
  {
    question: "Can I sign up in venue instead?",
    answer:
      "Yes — scan the members QR code at any of the three bars and you're in. Same perks, same speed.",
  },
  {
    question: "Can I cancel or unsubscribe?",
    answer:
      "Any time. Every email has an unsubscribe link, or just reply asking us to remove you. We'll close your member record within 7 days.",
  },
];
