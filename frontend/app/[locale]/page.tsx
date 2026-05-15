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

  const [overview, dashboard] = await Promise.all([
    getAdminOverview(),
    getDashboardOverview(),
  ]);
  const typedLocale = locale as Locale;
  const dictionary = getDictionary(typedLocale);

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
