import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { ResourceStatusBadge, ResourceTableCard } from "@/components/resource-table-card";
import { getAdminOverview } from "@/lib/admin-api";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

export default async function TenantsPage({
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
      currentPath={`/${typedLocale}/tenants`}
      dictionary={dictionary}
      backendReachable={overview.backendReachable}
      backendUrl={overview.backendUrl}
    >
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
            value: overview.tenants.length,
            note: dictionary.resources.tenants.summary.countNote,
          },
          {
            label: dictionary.resources.tenants.summary.active,
            value: overview.tenants.filter((tenant) => tenant.status === "active").length,
            note: dictionary.resources.tenants.summary.activeNote,
          },
          {
            label: dictionary.resources.tenants.summary.balance,
            value: overview.tenants
              .reduce((sum, tenant) => sum + Number(tenant.quota_balance), 0)
              .toFixed(0),
            note: dictionary.resources.tenants.summary.balanceNote,
          },
        ]}
        items={overview.tenants}
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
        ]}
      />
    </AdminShell>
  );
}
