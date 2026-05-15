import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { AdminWalletPage } from "@/components/admin-wallet-page";
import { getAdminOverview } from "@/lib/admin-api";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

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
  const overview = await getAdminOverview();

  return (
    <AdminShell
      locale={typedLocale}
      currentPath={`/${typedLocale}/wallet`}
      dictionary={dictionary}
      backendReachable={overview.backendReachable}
      backendUrl={overview.backendUrl}
    >
      <AdminWalletPage />
    </AdminShell>
  );
}
