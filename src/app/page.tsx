import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/HeroSection";
import { WhatsonSection } from "@/components/WhatsonSection";
import { VideoSection } from "@/components/VideoSection";
import { DiscoverSection } from "@/components/DiscoverSection";
import { LargeSignpostsSection } from "@/components/LargeSignpostsSection";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileCtaBar } from "@/components/MobileCtaBar";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <WhatsonSection />
        <VideoSection />
        <DiscoverSection />
        <LargeSignpostsSection />
      </main>
      <SiteFooter />
      {/* Sticky mobile CTA — appears after hero scrolls out of view,
          disappears when footer comes into view. md:hidden. */}
      <MobileCtaBar />
    </>
  );
}
