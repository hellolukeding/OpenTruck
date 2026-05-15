import Link from "next/link";

import type { DashboardDictionary, Locale } from "@/lib/i18n";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { AdminConsoleAccount } from "@/components/admin-console-account";

type AdminConsoleHeaderProps = {
  locale: Locale;
  currentPath: string;
  dictionary: DashboardDictionary;
};

const publicNav = [
  { label: "Models", href: "/models" },
  { label: "API Docs", href: "/api-docs" },
  { label: "Pricing", href: "/pricing" },
];

export function AdminConsoleHeader({
  locale,
  currentPath,
  dictionary,
}: AdminConsoleHeaderProps) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-[2rem] font-bold tracking-[-0.05em] text-on-surface">
            OpenTruck
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {publicNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[0.95rem] text-on-surface-variant transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={`/${locale}`}
              className="border-b-2 border-primary pb-1 text-[0.95rem] font-medium text-primary"
            >
              Console
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 text-on-surface-variant">
          <button
            type="button"
            className="rounded-full p-2 transition-colors hover:bg-surface-container-low hover:text-primary"
            title={dictionary.backendLabel}
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <ThemeToggle />
          <LocaleSwitcher locale={locale} currentPath={currentPath} />
          <AdminConsoleAccount />
        </div>
      </div>
    </header>
  );
}
