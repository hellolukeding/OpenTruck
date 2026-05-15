import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { AdminTicketsPage } from "@/components/admin-tickets-page";
import { getSupportTicketsPage } from "@/lib/admin-console-api";
import { getAdminOverview } from "@/lib/admin-api";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";
import { PaginationControls } from "@/components/pagination-controls";

export default async function TicketsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    priority?: string;
  }>;
}) {
  const { locale } = await params;
  const query = await searchParams;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const dictionary = getDictionary(typedLocale);
  const overview = await getAdminOverview();
  const page = Number(query.page ?? "1");
  const search = query.search?.trim() || undefined;
  const status = query.status?.trim() || undefined;
  const priority = query.priority?.trim() || undefined;
  const ticketsPage = await getSupportTicketsPage({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 10,
    search,
    status,
    priority,
  }).catch(() => ({
    items: [],
    pagination: {
      total: 0,
      page: 1,
      page_size: 10,
      total_pages: 0,
    },
  }));
  const path = `/${typedLocale}/tickets`;

  return (
    <AdminShell
      locale={typedLocale}
      currentPath={path}
      dictionary={dictionary}
      backendReachable={overview.backendReachable}
      backendUrl={overview.backendUrl}
    >
      <AdminTicketsPage
        ticketsPage={ticketsPage}
        tenantId={overview.tenants[0]?.id}
        path={path}
        query={{ search, status, priority }}
      />
      <PaginationControls
        locale={typedLocale}
        path={path}
        pagination={ticketsPage.pagination}
        query={{ search, status, priority }}
      />
    </AdminShell>
  );
}
