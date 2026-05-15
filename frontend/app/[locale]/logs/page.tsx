import { notFound } from "next/navigation";

import { AdminLogsPage } from "@/components/admin-logs-page";
import { AdminShell } from "@/components/admin-shell";
import { getAdminOverview } from "@/lib/admin-api";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

export default async function LogsPage({
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
      currentPath={`/${typedLocale}/logs`}
      dictionary={dictionary}
      backendReachable={overview.backendReachable}
      backendUrl={overview.backendUrl}
    >
      <AdminLogsPage />
    </AdminShell>
  );
}
