import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/HeroSection";
import { WhatsonSection } from "@/components/WhatsonSection";
import { VideoSection } from "@/components/VideoSection";
import { DiscoverSection } from "@/components/DiscoverSection";
import { LargeSignpostsSection } from "@/components/LargeSignpostsSection";
import { SiteFooter } from "@/components/SiteFooter";

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
    </>
  );
}
