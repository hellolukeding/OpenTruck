import { auth } from "@/auth";
import { SignInDialogTrigger } from "@/components/sign-in-dialog-trigger";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { LandingHero } from "@/components/landing-hero";
import { LandingStats } from "@/components/landing-stats";
import { LandingModels } from "@/components/landing-models";
import { LandingFeatures } from "@/components/landing-features";
import { LandingCta } from "@/components/landing-cta";
import { PublicFooter } from "@/components/public-footer";
import Link from "next/link";
import { headers } from "next/headers";
import { getAuthUiConfig } from "@/lib/auth-providers";
import { isSupportedLocale, type Locale } from "@/lib/i18n";

export default async function LandingPage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const session = await auth();
  const requestHeaders = await headers();
  const authUiConfig = getAuthUiConfig(
    requestHeaders.get("x-forwarded-host") || requestHeaders.get("host"),
  );
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const requestedLocale = resolvedSearchParams?.lang;
  const locale: Locale =
    requestedLocale && isSupportedLocale(requestedLocale) ? requestedLocale : "en";
  const consoleHref = `/${locale}`;
  const showSignInDialog = !session;

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-50 glass-nav border-b border-outline-variant/30 shadow-sm">
        <div className="flex items-center justify-between h-16 px-gutter max-w-container-max mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-display text-headline-md font-bold text-on-surface">
              OpenTruck
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {(["Models", "API Docs", "Pricing"] as const).map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase().replace(" ", "-")}`}
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors py-5"
                >
                  {label}
                </a>
              ))}
              {showSignInDialog ? (
                <SignInDialogTrigger callbackUrl={consoleHref} authUiConfig={authUiConfig}>
                  <button
                    type="button"
                    className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors py-5"
                  >
                    Console
                  </button>
                </SignInDialogTrigger>
              ) : (
                <Link
                  href={consoleHref}
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors py-5"
                >
                  Console
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <LocaleSwitcher
              locale={locale}
              localizedHrefs={{ en: "/", "zh-CN": "/?lang=zh-CN" }}
            />
            <ThemeToggle />
            {showSignInDialog ? (
              <SignInDialogTrigger callbackUrl={consoleHref} authUiConfig={authUiConfig}>
                <button
                  type="button"
                  className="bg-primary text-on-primary text-label-md font-label-md px-4 py-2 rounded-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  Console
                </button>
              </SignInDialogTrigger>
            ) : (
              <Link
                href={consoleHref}
                className="bg-primary text-on-primary text-label-md font-label-md px-4 py-2 rounded-lg hover:brightness-110 active:scale-95 transition-all"
              >
                Console
              </Link>
            )}
            <UserMenu />
          </div>
        </div>
      </header>

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
