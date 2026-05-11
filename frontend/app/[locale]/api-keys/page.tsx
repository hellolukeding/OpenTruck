import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { CreateApiKeyForm } from "@/components/create-api-key-form";
import { ResourceStatusBadge, ResourceTableCard } from "@/components/resource-table-card";
import { getAdminOverview } from "@/lib/admin-api";
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
      currentPath={`/${typedLocale}/api-keys`}
      dictionary={dictionary}
      backendReachable={overview.backendReachable}
      backendUrl={overview.backendUrl}
    >
      <CreateApiKeyForm
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
        tenants={overview.tenants}
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
            value: overview.apiKeys.length,
            note: dictionary.resources.apiKeys.summary.countNote,
          },
          {
            label: dictionary.resources.apiKeys.summary.active,
            value: overview.apiKeys.filter((key) => key.status === "active").length,
            note: dictionary.resources.apiKeys.summary.activeNote,
          },
          {
            label: dictionary.resources.apiKeys.summary.recent,
            value: overview.apiKeys.filter((key) => key.last_used_at !== null).length,
            note: dictionary.resources.apiKeys.summary.recentNote,
          },
        ]}
        items={overview.apiKeys}
        columns={[
          {
            key: "name",
            label: dictionary.labels.name,
            render: (apiKey) => <span className="font-medium text-black">{apiKey.name}</span>,
          },
          {
            key: "tenant",
            label: dictionary.labels.tenant,
            render: (apiKey) => apiKey.tenant_id,
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
        ]}
      />
    </AdminShell>
  );
}
