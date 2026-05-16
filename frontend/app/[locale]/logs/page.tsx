import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { getGatewayLogsPage } from "@/lib/admin-console-api";
import { getAdminOverview } from "@/lib/admin-api";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";
import { PaginationControls } from "@/components/pagination-controls";

// 动态导入日志页面组件
const AdminLogsPage = dynamic(() => import("@/components/admin-logs-page").then(mod => ({ default: mod.AdminLogsPage })), { ssr: true });

export default async function LogsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    model?: string;
    requestKind?: string;
    startAt?: string;
    endAt?: string;
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
  const model = query.model?.trim() || undefined;
  const requestKind = query.requestKind?.trim() || undefined;
  const startAt = query.startAt?.trim() || undefined;
  const endAt = query.endAt?.trim() || undefined;
  const logsPage = await getGatewayLogsPage({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 12,
    search,
    status,
    model,
    requestKind,
    startAt,
    endAt,
  }).catch(() => ({
    items: [],
    pagination: {
      total: 0,
      page: 1,
      page_size: 12,
      total_pages: 0,
    },
  }));
  const path = `/${typedLocale}/logs`;

  return (
    <AdminShell
      locale={typedLocale}
      currentPath={`/${typedLocale}/logs`}
      dictionary={dictionary}
      backendReachable={overview.backendReachable}
      backendUrl={overview.backendUrl}
    >
      <AdminLogsPage
        logsPage={logsPage}
        path={path}
        query={{ search, status, model, requestKind, startAt, endAt }}
      />
      <PaginationControls
        locale={typedLocale}
        path={path}
        pagination={logsPage.pagination}
        query={{ search, status, model, requestKind, startAt, endAt }}
      />
    </AdminShell>
  );
}
