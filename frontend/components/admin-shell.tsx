import Link from "next/link";
import { Globe, KeyRound, LayoutGrid, RadioTower, Route, Users } from "lucide-react";

import type { Locale, DashboardDictionary } from "@/lib/i18n";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type AdminShellProps = {
  locale: Locale;
  currentPath: string;
  dictionary: DashboardDictionary;
  backendReachable: boolean;
  backendUrl: string;
  children: React.ReactNode;
};

const navigationIcons = {
  overview: LayoutGrid,
  tenants: Users,
  nodes: RadioTower,
  apiKeys: KeyRound,
  models: Route,
};

export function AdminShell({
  locale,
  currentPath,
  dictionary,
  backendReachable,
  backendUrl,
  children,
}: AdminShellProps) {
  const items = [
    { key: "overview", href: `/${locale}` },
    { key: "tenants", href: `/${locale}/tenants` },
    { key: "nodes", href: `/${locale}/nodes` },
    { key: "apiKeys", href: `/${locale}/api-keys` },
    { key: "models", href: `/${locale}/models` },
  ] as const;

  return (
    <main className="dashboard-shell">
      <div className="dashboard-grid xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="glass-panel flex flex-col gap-6 p-4 md:p-5">
          <div className="rounded-[1.4rem] border border-black/10 bg-white p-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
              OpenTruck
            </p>
            <h1 className="editorial-title text-4xl leading-none text-black">
              {dictionary.shell.brandTitle}
            </h1>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              {dictionary.shell.brandSummary}
            </p>
          </div>

          <nav className="space-y-2">
            {items.map((item) => {
              const Icon = navigationIcons[item.key];
              const active = currentPath === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-[1.15rem] border px-4 py-3 transition-colors",
                    active
                      ? "border-black bg-black text-white"
                      : "border-black/10 bg-white text-black hover:bg-neutral-100",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {dictionary.nav[item.key]}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mono text-[11px] uppercase tracking-[0.18em]",
                      active ? "text-neutral-300" : "text-neutral-400",
                    )}
                  >
                    {String(items.indexOf(item) + 1).padStart(2, "0")}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="rounded-[1.4rem] border border-black/10 bg-neutral-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                {dictionary.backendLabel}
              </p>
              <Badge variant={backendReachable ? "success" : "warning"}>
                {backendReachable
                  ? dictionary.backendOnline
                  : dictionary.backendOffline}
              </Badge>
            </div>
            <p className="mono text-xs leading-5 text-neutral-500">{backendUrl}</p>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              {dictionary.backendHint}
            </p>
          </div>

          <div className="mt-auto rounded-[1.4rem] border border-black/10 bg-white p-3">
            <div className="mb-3 flex items-center gap-2 text-neutral-500">
              <Globe className="h-4 w-4" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                {dictionary.languageLabel}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_LOCALES.map((item) => (
                <Link key={item} href={currentPath.replace(`/${locale}`, `/${item}`)}>
                  <Button
                    className="w-full"
                    variant={locale === item ? "default" : "outline"}
                    size="sm"
                  >
                    {dictionary.languages[item]}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col gap-6">{children}</section>
      </div>
    </main>
  );
}
