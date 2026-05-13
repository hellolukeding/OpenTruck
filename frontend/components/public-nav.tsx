"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

type NavLink = {
  label: string;
  href: string;
  id: string;
};

type Props = {
  activeId?: string;
  consoleHref?: string;
  links?: NavLink[];
};

const defaultLinks: NavLink[] = [
  { label: "Models", href: "/models", id: "models" },
  { label: "API Docs", href: "/api-docs", id: "api-docs" },
  { label: "Pricing", href: "/pricing", id: "pricing" },
];

export function PublicNav({ activeId, consoleHref = "/en", links = defaultLinks }: Props) {
  return (
    <header className="fixed top-0 w-full z-50 glass-nav border-b border-outline-variant/30 shadow-sm">
      <div className="flex items-center justify-between h-16 px-gutter max-w-container-max mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display text-headline-md font-bold text-on-surface">
            OpenTruck
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`font-body-md text-body-md transition-colors py-5 ${
                  activeId === link.id
                    ? "text-primary font-bold border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={consoleHref}
              className={`font-body-md text-body-md transition-colors py-5 ${
                activeId === "console"
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Console
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href={consoleHref}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all"
          >
            Console
          </Link>
          <div className="relative">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer p-2 rounded-full hover:bg-surface-container transition-all">
              notifications
            </span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white" />
          </div>
          <div className="w-8 h-8 rounded-full border border-outline-variant bg-primary-container flex items-center justify-center text-on-primary text-label-md font-bold">
            O
          </div>
        </div>
      </div>
    </header>
  );
}
