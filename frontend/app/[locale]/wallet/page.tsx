import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { getWalletOverview } from "@/lib/admin-console-api";
import { getAdminOverview } from "@/lib/admin-api";
import { getWalletPageCopy } from "@/lib/wallet-page-copy";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

// 动态导入钱包页面组件以减少初始包大小
const AdminWalletPage = dynamic(() => import("@/components/admin-wallet-page").then(mod => ({ default: mod.AdminWalletPage })), { ssr: true });

export default async function WalletPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const dictionary = getDictionary(typedLocale);
  const copy = getWalletPageCopy(typedLocale);
  const overview = await getAdminOverview();
  const wallet = overview.tenants[0]
    ? await getWalletOverview(overview.tenants[0].id).catch(() => null)
    : null;

  return (
    <AdminShell
      locale={typedLocale}
      currentPath={`/${typedLocale}/wallet`}
      dictionary={dictionary}
      backendReachable={overview.backendReachable}
      backendUrl={overview.backendUrl}
    >
      <AdminWalletPage wallet={wallet} locale={typedLocale} copy={copy} />
    </AdminShell>
  );
}
