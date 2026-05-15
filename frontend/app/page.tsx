import dynamic from "next/dynamic";
import { PublicNav } from "@/components/public-nav";
import { LandingHero } from "@/components/landing-hero";
import { PublicFooter } from "@/components/public-footer";

// 动态导入折叠下方的组件以优化首屏加载
const LandingStats = dynamic(() => import("@/components/landing-stats").then(mod => ({ default: mod.LandingStats })), { ssr: true });
const LandingModels = dynamic(() => import("@/components/landing-models").then(mod => ({ default: mod.LandingModels })), { ssr: true });
const LandingFeatures = dynamic(() => import("@/components/landing-features").then(mod => ({ default: mod.LandingFeatures })), { ssr: true });
const LandingCta = dynamic(() => import("@/components/landing-cta").then(mod => ({ default: mod.LandingCta })), { ssr: true });

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
