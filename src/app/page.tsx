import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MagicCursorWrapper from "@/components/ui/effects/MagicCursorWrapper";
import {
  EcosystemSection,
  ExperienceSection,
  FinalCtaSection,
  HeroSection,
  MarketingFilmsSection,
  PlatformSurfaceSection,
  PricingSection,
  TrustSection,
} from "@/components/home/LandingSections";

function SectionSkeleton({ height = "h-96" }: { height?: string }) {
  return (
    <div className={`${height} w-full animate-pulse px-6`} aria-hidden="true">
      <div className="mx-auto max-w-7xl rounded-[34px] bg-white/[0.02]" style={{ height: "100%" }} />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] font-sans text-white">
      <Navbar />

      <main>
        <HeroSection />

        <Suspense fallback={<SectionSkeleton height="h-[680px]" />}>
          <EcosystemSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[480px]" />}>
          <PlatformSurfaceSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[560px]" />}>
          <MarketingFilmsSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[520px]" />}>
          <ExperienceSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
          <PricingSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[400px]" />}>
          <TrustSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[320px]" />}>
          <FinalCtaSection />
        </Suspense>
      </main>

      <Footer />
      <MagicCursorWrapper />
    </div>
  );
}
