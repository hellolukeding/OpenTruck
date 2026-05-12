import Link from "next/link";
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";
import { SUPPORTED_LOCALES } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

function MaterialSymbolsLanguage(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 22q-2.05 0-3.875-.788t-3.187-2.15t-2.15-3.187T2 12q0-2.075.788-3.887t2.15-3.175t3.187-2.15T12 2q2.075 0 3.888.788t3.174 2.15t2.15 3.175T22 12q0 2.05-.788 3.875t-2.15 3.188t-3.175 2.15T12 22m0-2.05q.65-.9 1.125-1.875T13.9 16h-3.8q.3 1.1.775 2.075T12 19.95m-2.6-.4q-.45-.825-.787-1.713T8.05 16H5.1q.725 1.25 1.813 2.175T9.4 19.55m5.2 0q1.4-.45 2.488-1.375T18.9 16h-2.95q-.225.95-.562 1.838T14.6 19.55M4.25 14h3.4q-.075-.5-.112-.987T7.5 12t.038-1.012T7.65 10h-3.4q-.125.5-.187.988T4 12t.063 1.013.187.987m5.4 0h4.7q.075-.5.113-.987T14.5 12t-.038-1.012T14.35 10h-4.7q-.075.5-.112.988T9.5 12t.038 1.013.112.987m6.7 0h3.4q.125-.5.188-.987T20 12t-.062-1.012T19.75 10h-3.4q.075.5.113.988T16.5 12t-.038 1.013-.112.987m-.4-6h2.95q-.725-1.25-1.812-2.175T14.6 4.45q.45.825.788 1.713T15.95 8M10.1 8h3.8q-.3-1.1-.775-2.075T12 4.05q-.65.9-1.125 1.875T10.1 8m-5 0h2.95q.225-.95.563-1.838T9.4 4.45Q8 4.9 6.912 5.825T5.1 8"
      />
    </svg>
  );
}

type LocaleSwitcherProps = {
  locale: Locale;
  currentPath?: string;
  localizedHrefs?: Partial<Record<Locale, string>>;
};

function swapLocaleInPath(path: string, currentLocale: Locale, nextLocale: Locale) {
  if (path === `/${currentLocale}`) {
    return `/${nextLocale}`;
  }

  if (path.startsWith(`/${currentLocale}/`)) {
    return `/${nextLocale}${path.slice(currentLocale.length + 1)}`;
  }

  return path;
}

export function LocaleSwitcher({
  locale,
  currentPath,
  localizedHrefs,
}: LocaleSwitcherProps) {
  return (
    <div className="relative group">
      <button className="flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-primary">
        <MaterialSymbolsLanguage className="text-[22px]" />
      </button>
      <div className="absolute right-0 top-full pt-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150">
        <div className="bg-surface-container border border-outline-variant rounded-xl p-1 shadow-sm min-w-[72px]">
          {SUPPORTED_LOCALES.map((item) => {
            const href =
              localizedHrefs?.[item] ??
              (currentPath
                ? swapLocaleInPath(currentPath, locale, item)
                : `/${item}`);
            const active = locale === item;
            return (
              <Link
                key={item}
                href={href}
                className={cn(
                  "flex items-center justify-center gap-sm w-full px-md py-sm text-body-md font-body-md rounded-md transition-colors",
                  active
                    ? "text-primary bg-surface-container-high"
                    : "text-on-surface hover:bg-surface-container-high hover:text-primary",
                )}
              >
                {active && (
                  <span className="material-symbols-outlined text-primary text-[16px]">
                    check
                  </span>
                )}
                {item === "en" ? "EN" : "中"}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
