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

const navItems = [
  { label: "首页", href: "/", id: "home" },
  { label: "模型", href: "/models", id: "models" },
  { label: "商家", href: "/merchant", id: "merchant" },
  { label: "排行榜", href: "/zh-CN/leaderboard", id: "leaderboard" },
  { label: "文档", href: "/api-docs", id: "api-docs" },
  { label: "控制台", href: "/zh-CN", id: "console" },
];

export function AdminConsoleHeader({
  locale,
  currentPath,
  dictionary,
}: AdminConsoleHeaderProps) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-13 max-w-[1280px] items-center justify-between px-4">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-[1.5rem] font-bold tracking-[-0.05em] text-on-surface">
            OpenTruck
          </Link>
          <nav className="hidden items-center gap-8 text-[15px] md:flex">
            {navItems.map((item) => {
              const active =
                item.id === "console"
                  ? currentPath.startsWith(`/${locale}`)
                  : item.href === currentPath;
              return (
                <Link
                  key={item.id}
                  href={item.id === "console" ? `/${locale}` : item.href}
                  className={`border-b-2 py-4 transition-colors ${
                    active
                      ? "border-primary text-primary"
                      : "border-transparent text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <button
            type="button"
            className="rounded-full p-1.5 transition-colors hover:bg-surface-container-low hover:text-primary"
            title={dictionary.backendLabel}
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
          </button>
          <ThemeToggle />
          <LocaleSwitcher locale={locale} currentPath={currentPath} />
          <AdminConsoleAccount />
        </div>
      </div>
    </header>
  );
}
