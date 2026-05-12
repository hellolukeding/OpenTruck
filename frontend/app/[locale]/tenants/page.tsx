import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { CreateTenantForm } from "@/components/create-tenant-form";
import { PaginationControls } from "@/components/pagination-controls";
import { ResourceFilters } from "@/components/resource-filters";
import { ResourceStatusBadge, ResourceTableCard } from "@/components/resource-table-card";
import { TenantRowActions } from "@/components/tenant-row-actions";
import { getAdminOverview, getTenantsPage } from "@/lib/admin-api";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

export default async function TenantsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
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
  const status = query.status?.trim() || undefined;
  const search = query.search?.trim() || undefined;
  const tenantPage = await getTenantsPage({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 10,
    status,
    search,
    sortBy: "created_at",
    sortOrder: "desc",
  });
  const visibleBalance = tenantPage.items
    .reduce((sum, tenant) => sum + Number(tenant.quota_balance), 0)
    .toFixed(0);

  return (
    <AdminShell
      locale={typedLocale}
      currentPath={`/${typedLocale}/tenants`}
      dictionary={dictionary}
      backendReachable={overview.backendReachable}
      backendUrl={overview.backendUrl}
    >
      <CreateTenantForm
        form={dictionary.forms.tenants}
        common={dictionary.forms.common}
        labels={{
          name: dictionary.labels.name,
          status: dictionary.labels.status,
          quota: dictionary.labels.quota,
          rpm: dictionary.labels.rpm,
          tpm: dictionary.labels.tpm,
        }}
        statusLabels={dictionary.status}
      />
      <ResourceFilters
        locale={typedLocale}
        path={`/${typedLocale}/tenants`}
        search={search}
        status={status}
        statusOptions={[
          { value: "active", label: dictionary.status.active },
          { value: "disabled", label: dictionary.status.disabled },
        ]}
      />
      <ResourceTableCard
        eyebrow={dictionary.resources.tenants.eyebrow}
        title={dictionary.resources.tenants.title}
        description={dictionary.resources.tenants.description}
        emptyLabel={dictionary.resources.tenants.empty}
        noteTitle={dictionary.resources.tenants.noteTitle}
        noteBody={dictionary.resources.tenants.noteBody}
        summary={[
          {
            label: dictionary.resources.tenants.summary.count,
            value: tenantPage.pagination.total,
            note: dictionary.resources.tenants.summary.countNote,
          },
          {
            label: dictionary.resources.tenants.summary.active,
            value: tenantPage.items.filter((tenant) => tenant.status === "active").length,
            note: dictionary.resources.tenants.summary.activeNote,
          },
          {
            label: dictionary.resources.tenants.summary.balance,
            value: visibleBalance,
            note: dictionary.resources.tenants.summary.balanceNote,
          },
        ]}
        items={tenantPage.items}
        columns={[
          {
            key: "name",
            label: dictionary.labels.name,
            render: (tenant) => <span className="font-medium text-black">{tenant.name}</span>,
          },
          {
            key: "status",
            label: dictionary.labels.status,
            render: (tenant) => <ResourceStatusBadge status={tenant.status} />,
          },
          {
            key: "quota",
            label: dictionary.labels.quota,
            render: (tenant) => tenant.quota_balance,
          },
          {
            key: "rpm",
            label: dictionary.labels.rpm,
            render: (tenant) => tenant.rate_limit_rpm,
          },
          {
            key: "tpm",
            label: dictionary.labels.tpm,
            render: (tenant) => tenant.rate_limit_tpm,
          },
          {
            key: "actions",
            label: "",
            render: (tenant) => <TenantRowActions locale={typedLocale} tenant={tenant} />,
          },
        ]}
      />
      <PaginationControls
        locale={typedLocale}
        path={`/${typedLocale}/tenants`}
        pagination={tenantPage.pagination}
        query={{ search, status }}
      />
    </AdminShell>
  );
}
