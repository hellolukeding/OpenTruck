import Link from "next/link";

import type { DashboardDictionary, Locale } from "@/lib/i18n";

type AdminConsoleSubnavProps = {
  locale: Locale;
  currentPath: string;
  dictionary: DashboardDictionary;
};

const items = [
  { key: "overview", icon: "bolt" },
  { key: "apiKeys", icon: "key" },
  { key: "wallet", icon: "wallet" },
  { key: "announcements", icon: "campaign" },
  { key: "logs", icon: "article" },
  { key: "tickets", icon: "confirmation_number" },
  { key: "upstreamAccounts", icon: "settings_input_component" },
] as const;

export function AdminConsoleSubnav({
  locale,
  currentPath,
  dictionary,
}: AdminConsoleSubnavProps) {
  const hrefs = {
    overview: `/${locale}`,
    apiKeys: `/${locale}/api-keys`,
    wallet: `/${locale}/wallet`,
    announcements: `/${locale}/announcements`,
    logs: `/${locale}/logs`,
    tickets: `/${locale}/tickets`,
    upstreamAccounts: `/${locale}/upstream-accounts`,
  } as const;

  return (
    <div className="flex justify-center">
      <nav className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-outline-variant/30 bg-surface-container px-1 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
        {items.map((item) => {
          const href = hrefs[item.key];
          const active = currentPath === href;
          return (
            <Link
              key={item.key}
              href={href}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.78rem] transition-colors ${
                active
                  ? "bg-primary-container text-on-primary-container dark:bg-primary dark:text-on-primary"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{item.icon}</span>
              <span>{dictionary.nav[item.key]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
