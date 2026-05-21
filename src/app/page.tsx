import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/HeroSection";
import { TrustStrip } from "@/components/TrustStrip";
import { WhatsonSection } from "@/components/WhatsonSection";
import { VideoSection } from "@/components/VideoSection";
import { DiscoverSection } from "@/components/DiscoverSection";
import { LargeSignpostsSection } from "@/components/LargeSignpostsSection";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        {/* Hero owns its own motion (ken-burns + parallax). Below-hero
            sections get a gentle scroll-triggered fade-up so the page
            doesn't read as "everything just appears". */}
        <HeroSection />
        <ScrollReveal>
          <TrustStrip />
        </ScrollReveal>
        <ScrollReveal>
          <WhatsonSection />
        </ScrollReveal>
        <ScrollReveal>
          <VideoSection />
        </ScrollReveal>
        <ScrollReveal>
          <DiscoverSection />
        </ScrollReveal>
        <ScrollReveal>
          <LargeSignpostsSection />
        </ScrollReveal>
      </main>
      <SiteFooter />
    </>
  );
}
