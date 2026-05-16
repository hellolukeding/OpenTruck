import { notFound } from "next/navigation";

import { AdminOverview } from "@/components/admin-overview";
import { AdminShell } from "@/components/admin-shell";
import { getDashboardOverview } from "@/lib/admin-console-api";
import { getAdminOverview } from "@/lib/admin-api";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

export default async function LocalePage({
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
  const [overview, dashboard] = await Promise.all([
    getAdminOverview(),
    getDashboardOverview().catch(() => ({
      tenant_count: 0,
      active_api_keys: 0,
      active_upstream_accounts: 0,
      published_models: 0,
      total_balance: "0",
      recent_failed_requests: 0,
      metrics: [],
      usage_trend: [],
      notices: [],
    })),
  ]);

  return (
    <AdminShell
      locale={typedLocale}
      currentPath={`/${typedLocale}`}
      dictionary={dictionary}
      backendReachable={overview.backendReachable}
      backendUrl={overview.backendUrl}
    >
      <AdminOverview {...overview} dashboard={dashboard} dictionary={dictionary} />
    </AdminShell>
  );
}
