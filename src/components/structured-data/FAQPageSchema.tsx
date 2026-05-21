import { JsonLd } from "./JsonLd";

interface FaqItem {
  question: string;
  answer: string;
}

/**
 * FAQPage schema — fed by the same data the FAQs accordion renders.
 * Answer strings can contain HTML; Google strips it during validation.
 */
export function FAQPageSchema({ faqs }: { faqs: ReadonlyArray<FaqItem> }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}
