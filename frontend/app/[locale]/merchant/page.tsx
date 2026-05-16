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
import { getMerchantPageCopy } from "@/lib/merchant-page-copy";
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
  const copy = getMerchantPageCopy(typedLocale);
  const dashboard = await getMerchantDashboard().catch(() => null);

  return (
    <div className="min-h-screen bg-background font-body-md text-on-background">
      <PublicNav activeId="console" ctaHref={`/${typedLocale}/merchant`} />
      <main className="mx-auto mt-16 max-w-max-width space-y-lg px-margin py-xl">
        <MerchantSubNav locale={typedLocale} copy={copy.subNav} />
        <MerchantHero dashboard={dashboard} locale={typedLocale} copy={copy.hero} />
        <MerchantKeysCard dashboard={dashboard} locale={typedLocale} copy={copy.keys} />
        <MerchantBookmarks dashboard={dashboard} locale={typedLocale} copy={copy.bookmarks} />
        <MerchantModelsTable dashboard={dashboard} locale={typedLocale} copy={copy.models} />
      </main>

      <footer className="mt-xl w-full border-t border-outline-variant/20 bg-surface-container-lowest py-xl">
        <div className="mx-auto grid max-w-max-width grid-cols-2 gap-gutter px-margin md:grid-cols-4">
          <div className="col-span-2">
            <span className="mb-md block font-headline-md text-on-background">OpenTruck</span>
            <p className="text-body-sm text-secondary opacity-80">
              {copy.footer.copyright}
            </p>
          </div>
          <div className="space-y-sm">
            <h4 className="text-body-sm font-bold text-on-surface">{copy.footer.resources}</h4>
            <nav className="flex flex-col gap-xs">
              <a className="text-body-sm text-secondary transition-all hover:text-primary" href="#">
                {copy.footer.documentation}
              </a>
              <a className="text-body-sm text-secondary transition-all hover:text-primary" href="#">
                {copy.footer.changelog}
              </a>
              <a className="text-body-sm text-secondary transition-all hover:text-primary" href="#">
                {copy.footer.status}
              </a>
            </nav>
          </div>
          <div className="space-y-sm">
            <h4 className="text-body-sm font-bold text-on-surface">{copy.footer.company}</h4>
            <nav className="flex flex-col gap-xs">
              <a className="text-body-sm text-secondary transition-all hover:text-primary" href="#">
                {copy.footer.privacy}
              </a>
              <a className="text-body-sm text-secondary transition-all hover:text-primary" href="#">
                {copy.footer.terms}
              </a>
              <a className="text-body-sm text-secondary transition-all hover:text-primary" href="#">
                {copy.footer.community}
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
