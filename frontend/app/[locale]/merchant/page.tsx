import { notFound } from "next/navigation";

import {
  MerchantBookmarks,
  MerchantHero,
  MerchantKeysCard,
  MerchantModelsTable,
  MerchantSubNav,
} from "@/components/merchant-dashboard";
import { PublicNav } from "@/components/public-nav";
import { getMerchantDashboard } from "@/lib/admin-console-api";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

export default async function MerchantPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  getDictionary(typedLocale);
  const dashboard = await getMerchantDashboard().catch(() => null);

  return (
    <div className="min-h-screen bg-background font-body-md text-on-background">
      <PublicNav activeId="console" ctaHref={`/${typedLocale}/merchant`} />
      <main className="mx-auto mt-16 max-w-max-width space-y-lg px-margin py-xl">
        <MerchantSubNav />
        <MerchantHero dashboard={dashboard} />
        <MerchantKeysCard dashboard={dashboard} />
        <MerchantBookmarks dashboard={dashboard} />
        <MerchantModelsTable dashboard={dashboard} />
      </main>

      <footer className="mt-xl w-full border-t border-outline-variant/20 bg-surface-container-lowest py-xl">
        <div className="mx-auto grid max-w-max-width grid-cols-2 gap-gutter px-margin md:grid-cols-4">
          <div className="col-span-2">
            <span className="mb-md block font-headline-md text-on-background">OpenTruck</span>
            <p className="text-body-sm text-secondary opacity-80">
              &copy; 2024 OpenTruck. High-performance AI infrastructure.
            </p>
          </div>
          <div className="space-y-sm">
            <h4 className="text-body-sm font-bold text-on-surface">Resources</h4>
            <nav className="flex flex-col gap-xs">
              <a className="text-body-sm text-secondary transition-all hover:text-primary" href="#">
                Documentation
              </a>
              <a className="text-body-sm text-secondary transition-all hover:text-primary" href="#">
                Changelog
              </a>
              <a className="text-body-sm text-secondary transition-all hover:text-primary" href="#">
                Status
              </a>
            </nav>
          </div>
          <div className="space-y-sm">
            <h4 className="text-body-sm font-bold text-on-surface">Company</h4>
            <nav className="flex flex-col gap-xs">
              <a className="text-body-sm text-secondary transition-all hover:text-primary" href="#">
                Privacy Policy
              </a>
              <a className="text-body-sm text-secondary transition-all hover:text-primary" href="#">
                Terms of Service
              </a>
              <a className="text-body-sm text-secondary transition-all hover:text-primary" href="#">
                Community
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
