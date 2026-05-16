import { notFound } from "next/navigation";

import { AdminAnnouncementsPage } from "@/components/admin-announcements-page";
import { AdminShell } from "@/components/admin-shell";
import { PaginationControls } from "@/components/pagination-controls";
import { getAnnouncementsPage } from "@/lib/admin-console-api";
import { getAnnouncementsPageCopy } from "@/lib/announcements-page-copy";
import { getAdminOverview } from "@/lib/admin-api";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

export default async function AnnouncementsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; status?: string; severity?: string; search?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;

  if (!isSupportedLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const dictionary = getDictionary(typedLocale);
  const copy = getAnnouncementsPageCopy(typedLocale);
  const overview = await getAdminOverview();
  const page = Number(query.page ?? "1");
  const status = query.status?.trim() || undefined;
  const search = query.search?.trim() || undefined;
  const announcementsPage = await getAnnouncementsPage({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 10,
    status,
    search,
  }).catch(() => ({
    items: [],
    pagination: { total: 0, page: 1, page_size: 10, total_pages: 0 },
  }));
  const path = `/${typedLocale}/announcements`;

  return (
    <AdminShell
      locale={typedLocale}
      currentPath={path}
      dictionary={dictionary}
      backendReachable={overview.backendReachable}
      backendUrl={overview.backendUrl}
    >
      <AdminAnnouncementsPage announcementsPage={announcementsPage} copy={copy} locale={typedLocale} />
      <PaginationControls locale={typedLocale} path={path} pagination={announcementsPage.pagination} query={{ status, search }} />
    </AdminShell>
  );
}
