import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { ApiKeyRowActions } from "@/components/api-key-row-actions";
import { CreateApiKeyForm } from "@/components/create-api-key-form";
import { PaginationControls } from "@/components/pagination-controls";
import { ResourceFilters } from "@/components/resource-filters";
import { ResourceStatusBadge, ResourceTableCard } from "@/components/resource-table-card";
import { getAdminOverview, getApiKeysPage, getTenantsPage } from "@/lib/admin-api";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

function formatDate(value: string | null, fallback: string): string {
  if (!value) return fallback;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function ApiKeysPage({
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
  const tenantOptions = await getTenantsPage({ page: 1, pageSize: 100, sortBy: "name", sortOrder: "asc" });
  const page = Number(query.page ?? "1");
  const status = query.status?.trim() || undefined;
  const search = query.search?.trim() || undefined;
  const apiKeyPage = await getApiKeysPage({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 10,
    status,
    search,
    sortBy: "created_at",
    sortOrder: "desc",
  });
  const tenantMap = new Map(tenantOptions.items.map((tenant) => [tenant.id, tenant.name]));

  return (
    <AdminShell
      locale={typedLocale}
      currentPath={`/${typedLocale}/api-keys`}
      dictionary={dictionary}
      backendReachable={overview.backendReachable}
      backendUrl={overview.backendUrl}
    >
      <CreateApiKeyForm
        locale={typedLocale}
        form={dictionary.forms.apiKeys}
        common={dictionary.forms.common}
        labels={{
          tenant: dictionary.labels.tenant,
          status: dictionary.labels.status,
          name: dictionary.labels.name,
          rawKey: dictionary.labels.rawKey,
          scope: dictionary.labels.scope,
        }}
        statusLabels={dictionary.status}
        tenants={tenantOptions.items}
      />
      <ResourceFilters
        locale={typedLocale}
        path={`/${typedLocale}/api-keys`}
        search={search}
        status={status}
        statusOptions={[
          { value: "active", label: dictionary.status.active },
          { value: "disabled", label: dictionary.status.disabled },
        ]}
      />
      <ResourceTableCard
        eyebrow={dictionary.resources.apiKeys.eyebrow}
        title={dictionary.resources.apiKeys.title}
        description={dictionary.resources.apiKeys.description}
        emptyLabel={dictionary.resources.apiKeys.empty}
        noteTitle={dictionary.resources.apiKeys.noteTitle}
        noteBody={dictionary.resources.apiKeys.noteBody}
        summary={[
          {
            label: dictionary.resources.apiKeys.summary.count,
            value: apiKeyPage.pagination.total,
            note: dictionary.resources.apiKeys.summary.countNote,
          },
          {
            label: dictionary.resources.apiKeys.summary.active,
            value: apiKeyPage.items.filter((key) => key.status === "active").length,
            note: dictionary.resources.apiKeys.summary.activeNote,
          },
          {
            label: dictionary.resources.apiKeys.summary.recent,
            value: apiKeyPage.items.filter((key) => key.last_used_at !== null).length,
            note: dictionary.resources.apiKeys.summary.recentNote,
          },
        ]}
        items={apiKeyPage.items}
        columns={[
          {
            key: "name",
            label: dictionary.labels.name,
            render: (apiKey) => <span className="font-medium text-black">{apiKey.name}</span>,
          },
          {
            key: "tenant",
            label: dictionary.labels.tenant,
            render: (apiKey) => tenantMap.get(apiKey.tenant_id) ?? apiKey.tenant_id,
          },
          {
            key: "status",
            label: dictionary.labels.status,
            render: (apiKey) => <ResourceStatusBadge status={apiKey.status} />,
          },
          {
            key: "fingerprint",
            label: dictionary.labels.fingerprint,
            render: (apiKey) => (
              <span className="mono text-xs text-neutral-500">
                {apiKey.key_hash.slice(0, 16)}...
              </span>
            ),
          },
          {
            key: "lastUsed",
            label: dictionary.labels.lastUsed,
            render: (apiKey) =>
              formatDate(apiKey.last_used_at, dictionary.labels.never),
          },
          {
            key: "actions",
            label: "",
            render: (apiKey) => <ApiKeyRowActions locale={typedLocale} apiKey={apiKey} />,
          },
        ]}
      />
      <PaginationControls
        locale={typedLocale}
        path={`/${typedLocale}/api-keys`}
        pagination={apiKeyPage.pagination}
        query={{ search, status }}
      />
    </AdminShell>
  );
}
