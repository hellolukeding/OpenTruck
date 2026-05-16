import type { Locale } from "@/lib/i18n";
import { upstreamAccountsPageCopyEn } from "@/lib/upstream-accounts-page-copy-en";
import { upstreamAccountsPageCopyZh } from "@/lib/upstream-accounts-page-copy-zh";
import type { UpstreamAccountsPageCopy } from "@/lib/upstream-accounts-page-copy-types";

const copy: Record<Locale, UpstreamAccountsPageCopy> = {
  en: upstreamAccountsPageCopyEn,
  "zh-CN": upstreamAccountsPageCopyZh,
};

export type { UpstreamAccountsPageCopy } from "@/lib/upstream-accounts-page-copy-types";

export function getUpstreamAccountsPageCopy(locale: Locale) {
  return copy[locale];
}
