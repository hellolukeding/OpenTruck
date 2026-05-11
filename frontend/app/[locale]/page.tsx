import { notFound } from "next/navigation";

import { AdminDashboard } from "@/components/admin-dashboard";
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

  const overview = await getAdminOverview();

  return (
    <AdminDashboard
      {...overview}
      locale={locale as Locale}
      dictionary={getDictionary(locale as Locale)}
    />
  );
}
