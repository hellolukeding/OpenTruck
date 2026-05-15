import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { getSupportTicketDetail, getSupportTicketsPage } from "@/lib/admin-console-api";
import { getAdminOverview } from "@/lib/admin-api";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";
import { PaginationControls } from "@/components/pagination-controls";

// 动态导入工单页面组件
const AdminTicketsPage = dynamic(() => import("@/components/admin-tickets-page").then(mod => ({ default: mod.AdminTicketsPage })), { ssr: true });

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
    ticket_id?: string;
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
  const ticketId = query.ticket_id?.trim() || undefined;
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
  const selectedTicketId = ticketId ?? ticketsPage.items[0]?.id;
  const selectedTicket = selectedTicketId
    ? await getSupportTicketDetail(selectedTicketId).catch(() => null)
    : null;
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
        selectedTicket={selectedTicket}
        tenantId={overview.tenants[0]?.id}
        path={path}
        query={{ search, status, priority, ticketId: selectedTicketId }}
      />
      <PaginationControls
        locale={typedLocale}
        path={path}
        pagination={ticketsPage.pagination}
        query={{ search, status, priority, ticket_id: selectedTicketId }}
      />
    </AdminShell>
  );
}
