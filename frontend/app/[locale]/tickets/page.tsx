import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { AdminTicketsPage } from "@/components/admin-tickets-page";
import { getSupportTicketsPage } from "@/lib/admin-console-api";
import { getAdminOverview } from "@/lib/admin-api";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

export default async function TicketsPage({
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
  const ticketsPage = await getSupportTicketsPage({ pageSize: 10 });

  return (
    <AdminShell
      locale={typedLocale}
      currentPath={`/${typedLocale}/tickets`}
      dictionary={dictionary}
      backendReachable={overview.backendReachable}
      backendUrl={overview.backendUrl}
    >
      <AdminTicketsPage ticketsPage={ticketsPage} />
    </AdminShell>
  );
}
