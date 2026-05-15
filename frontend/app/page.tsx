import { PublicNav } from "@/components/public-nav";
import { LandingHero } from "@/components/landing-hero";
import { LandingStats } from "@/components/landing-stats";
import { LandingModels } from "@/components/landing-models";
import { LandingFeatures } from "@/components/landing-features";
import { LandingCta } from "@/components/landing-cta";
import { PublicFooter } from "@/components/public-footer";

export default async function LandingPage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  if (searchParams) {
    await searchParams;
  }

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
      <PublicNav activeId="home" />

      <main className="pt-24 pb-xl flex-grow">
        <LandingHero />
        <LandingStats />
        <LandingModels />
        <LandingFeatures />
        <LandingCta />
      </main>

      <PublicFooter />
    </div>
  );
}
