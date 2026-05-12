import Link from "next/link";
import { KeyRound, LayoutGrid, RadioTower, Route, Users } from "lucide-react";

import type { Locale, DashboardDictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { LocaleSwitcher } from "@/components/locale-switcher";

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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <header className="bg-surface border-b border-outline-variant sticky top-0 z-50">
        <div className="flex items-center justify-between w-full px-gutter py-sm max-w-container-max mx-auto">
          <div className="flex items-center gap-lg">
            <span className="text-label-md font-bold tracking-tighter text-primary uppercase">
              OpenTruck
            </span>
            <nav className="hidden md:flex items-center gap-md">
              {items.map((item) => {
                const active = currentPath === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-label-md font-label-md transition-colors duration-200",
                      active
                        ? "text-primary border-b-2 border-primary pb-1"
                        : "text-on-surface-variant hover:text-primary",
                    )}
                  >
                    {dictionary.nav[item.key]}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-md">
            <div className="relative hidden sm:block">
              <span
                className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline text-sm select-none pointer-events-none"
                style={{ fontSize: "16px" }}
              >
                search
              </span>
              <input
                className="bg-surface border border-outline-variant text-label-md font-label-md rounded-lg px-sm py-xs pl-7 focus:outline-none focus:border-primary focus:ring-0 w-48 transition-colors placeholder:text-on-surface-variant"
                placeholder="Search..."
                type="text"
              />
            </div>
            <ThemeToggle />
            <UserMenu />
            <LocaleSwitcher locale={locale} currentPath={currentPath} />
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-container-max mx-auto w-full">
        {/* Side Navigation */}
        <aside className="hidden md:flex flex-col w-56 border-r border-outline-variant pt-lg bg-background shrink-0">
          <nav className="flex flex-col gap-xs px-gutter">
            {items.map((item) => {
              const Icon = navigationIcons[item.key];
              const active = currentPath === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-sm px-md py-sm text-label-md font-label-md transition-colors",
                    active
                      ? "bg-surface-container text-primary border-l-2 border-primary"
                      : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low border-l-2 border-transparent",
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {dictionary.nav[item.key]}
                </Link>
              );
            })}
          </nav>

          {/* Backend Status */}
          <div className="mt-auto px-gutter pb-lg pt-lg border-t border-outline-variant mx-gutter">
            <div className="flex items-center justify-between mb-sm">
              <span className="text-code-sm text-on-surface-variant">
                {dictionary.backendLabel}
              </span>
              <Badge variant={backendReachable ? "success" : "warning"}>
                {backendReachable
                  ? dictionary.backendOnline
                  : dictionary.backendOffline}
              </Badge>
            </div>
            <p className="text-code-sm text-on-surface-variant truncate">{backendUrl}</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-lg px-gutter flex flex-col gap-lg">
          {children}
        </main>
      </div>
    </div>
  );
}
