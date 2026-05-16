import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { CreateUpstreamAccountForm } from "@/components/create-upstream-account-form";
import { PaginationControls } from "@/components/pagination-controls";
import { ResourceStatusBadge, ResourceTableCard } from "@/components/resource-table-card";
import { UpstreamAccountFilters } from "@/components/upstream-account-filters";
import { UpstreamAccountRowActions } from "@/components/upstream-account-row-actions";
import { UpstreamAccountSummary } from "@/components/upstream-account-summary";
import { getAdminOverview, getTenantsPage, getUpstreamAccountsPage, type UpstreamAccount } from "@/lib/admin-api";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";
import { getUpstreamAccountsPageCopy } from "@/lib/upstream-accounts-page-copy";

function fmt(value: string | null, locale: "en" | "zh-CN", fallback: string) {
  if (!value) return fallback;
  return new Intl.DateTimeFormat(locale === "zh-CN" ? "zh-CN" : "en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function ErrorBadge({ code }: { code: string | null }) {
  if (!code) return <span className="text-code-sm text-on-surface-variant">—</span>;
  const isAuthError = code.startsWith("4");
  return (
    <span
      className={`inline-block rounded-md px-2 py-0.5 text-code-sm font-code-sm ${
        isAuthError
          ? "bg-error/10 text-error"
          : "bg-tertiary/10 text-tertiary"
      }`}
    >
      {code}
    </span>
  );
}

function RefreshDot({
  has,
  labels,
}: {
  has: boolean;
  labels: { hasRefreshToken: string; noRefreshToken: string };
}) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${
        has ? "bg-primary" : "bg-on-surface-variant/40"
      }`}
      title={has ? labels.hasRefreshToken : labels.noRefreshToken}
    />
  );
}

export default async function UpstreamAccountsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    tenant_id?: string;
    account_type?: string;
    platform?: string;
    sort_by?: string;
    sort_order?: string;
  }>;
}) {
  const { locale } = await params;
  const query = await searchParams;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const dictionary = getDictionary(typedLocale);
  const copy = getUpstreamAccountsPageCopy(typedLocale);
  const overview = await getAdminOverview();
  const tenantOptions = await getTenantsPage({ page: 1, pageSize: 100, sortBy: "name", sortOrder: "asc" });
  const page = Number(query.page ?? "1");
  const status = query.status?.trim() || undefined;
  const search = query.search?.trim() || undefined;
  const tenantId = query.tenant_id?.trim() || undefined;
  const accountType = query.account_type?.trim() || undefined;
  const platform = query.platform?.trim() || undefined;
  const sortBy = query.sort_by?.trim() || "priority";
  const sortOrder = query.sort_order === "desc" ? "desc" : "asc";
  const upstreamPage = await getUpstreamAccountsPage({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 10,
    status,
    search,
    tenantId,
    accountType,
    platform,
    sortBy,
    sortOrder,
  });
  const tenantMap = new Map(tenantOptions.items.map((tenant) => [tenant.id, tenant.name]));

  return (
    <AdminShell
      locale={typedLocale}
      currentPath={`/${typedLocale}/upstream-accounts`}
      dictionary={dictionary}
      backendReachable={overview.backendReachable}
      backendUrl={overview.backendUrl}
    >
      <CreateUpstreamAccountForm locale={typedLocale} tenants={tenantOptions.items} />
      <UpstreamAccountFilters
        locale={typedLocale}
        path={`/${typedLocale}/upstream-accounts`}
        search={search}
        status={status}
        tenantId={tenantId}
        accountType={accountType}
        platform={platform}
        sortBy={sortBy}
        sortOrder={sortOrder}
        tenants={tenantOptions.items}
      />
      <UpstreamAccountSummary
        accounts={upstreamPage.items}
        total={upstreamPage.pagination.total}
        copy={copy.summary}
        path={`/${typedLocale}/upstream-accounts`}
        query={{
          search,
          status,
          tenant_id: tenantId,
          account_type: accountType,
          platform,
          sort_by: sortBy,
          sort_order: sortOrder,
        }}
        tenantMap={tenantMap}
      />
      <ResourceTableCard
        eyebrow={copy.table.eyebrow}
        title={copy.table.title}
        description={copy.table.description}
        emptyLabel={copy.table.empty}
        noteTitle={copy.table.noteTitle}
        noteBody={copy.table.noteBody}
        summary={[]}
        items={upstreamPage.items}
        columns={[
          {
            key: "name",
            label: dictionary.labels.name,
            render: (account: UpstreamAccount) => (
              <a
                className="font-medium text-primary hover:underline"
                href={`/${typedLocale}/upstream-accounts?search=${encodeURIComponent(account.name)}`}
              >
                {account.name}
              </a>
            ),
          },
          {
            key: "tenant",
            label: copy.table.labels.tenant,
            render: (account: UpstreamAccount) => (
              <a
                className="text-on-surface hover:text-primary hover:underline"
                href={`/${typedLocale}/upstream-accounts?tenant_id=${account.tenant_id}`}
              >
                {tenantMap.get(account.tenant_id) ?? account.tenant_id}
              </a>
            ),
          },
          {
            key: "email",
            label: copy.table.labels.email,
            render: (account: UpstreamAccount) => account.email ?? copy.table.labels.clear,
          },
          {
            key: "status",
            label: copy.table.labels.status,
            render: (account: UpstreamAccount) => <ResourceStatusBadge status={account.status} />,
          },
          {
            key: "failures",
            label: copy.table.labels.failures,
            render: (account: UpstreamAccount) =>
              account.consecutive_failures > 0 ? (
                <span className="text-code-sm font-code-sm text-error">{account.consecutive_failures}</span>
              ) : (
                <span className="text-code-sm text-on-surface-variant">0</span>
              ),
          },
          {
            key: "last_error_code",
            label: copy.table.labels.lastError,
            render: (account: UpstreamAccount) => <ErrorBadge code={account.last_error_code} />,
          },
          {
            key: "priority",
            label: copy.table.labels.priority,
            render: (account: UpstreamAccount) => (
              <span className="text-code-sm font-code-sm">{account.priority}</span>
            ),
          },
          {
            key: "last_used_at",
            label: copy.table.labels.lastUsed,
            render: (account: UpstreamAccount) => fmt(account.last_used_at, typedLocale, copy.table.labels.never),
          },
          {
            key: "cooldown_until",
            label: copy.table.labels.cooldown,
            render: (account: UpstreamAccount) => fmt(account.cooldown_until, typedLocale, copy.table.labels.clear),
          },
          {
            key: "refresh",
            label: copy.table.labels.refresh,
            render: (account: UpstreamAccount) => (
              <RefreshDot has={account.has_refresh_token} labels={copy.table.labels} />
            ),
          },
          {
            key: "actions",
            label: "",
            render: (account: UpstreamAccount) => <UpstreamAccountRowActions locale={typedLocale} account={account} />,
          },
        ]}
      />
      <PaginationControls
        locale={typedLocale}
        path={`/${typedLocale}/upstream-accounts`}
        pagination={upstreamPage.pagination}
        query={{
          search,
          status,
          tenant_id: tenantId,
          account_type: accountType,
          platform,
          sort_by: sortBy,
          sort_order: sortOrder,
        }}
      />
    </AdminShell>
  );
}
