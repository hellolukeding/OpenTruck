import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { ResourceStatusBadge, ResourceTableCard } from "@/components/resource-table-card";
import { getAdminOverview } from "@/lib/admin-api";
import { getDictionary, isSupportedLocale, type Locale } from "@/lib/i18n";

export default async function NodesPage({
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
      currentPath={`/${typedLocale}/nodes`}
      dictionary={dictionary}
      backendReachable={overview.backendReachable}
      backendUrl={overview.backendUrl}
    >
      <ResourceTableCard
        eyebrow={dictionary.resources.nodes.eyebrow}
        title={dictionary.resources.nodes.title}
        description={dictionary.resources.nodes.description}
        emptyLabel={dictionary.resources.nodes.empty}
        noteTitle={dictionary.resources.nodes.noteTitle}
        noteBody={dictionary.resources.nodes.noteBody}
        summary={[
          {
            label: dictionary.resources.nodes.summary.count,
            value: overview.nodes.length,
            note: dictionary.resources.nodes.summary.countNote,
          },
          {
            label: dictionary.resources.nodes.summary.healthy,
            value: overview.nodes.filter((node) => node.health_status === "ok").length,
            note: dictionary.resources.nodes.summary.healthyNote,
          },
          {
            label: dictionary.resources.nodes.summary.capacity,
            value: overview.nodes.reduce((sum, node) => sum + node.max_concurrency, 0),
            note: dictionary.resources.nodes.summary.capacityNote,
          },
        ]}
        items={overview.nodes}
        columns={[
          {
            key: "name",
            label: dictionary.labels.name,
            render: (node) => <span className="font-medium text-black">{node.name}</span>,
          },
          {
            key: "status",
            label: dictionary.labels.status,
            render: (node) => <ResourceStatusBadge status={node.health_status} />,
          },
          {
            key: "region",
            label: dictionary.labels.region,
            render: (node) => node.region,
          },
          {
            key: "weight",
            label: dictionary.labels.weight,
            render: (node) => node.weight,
          },
          {
            key: "concurrency",
            label: dictionary.labels.concurrency,
            render: (node) => node.max_concurrency,
          },
        ]}
      />
    </AdminShell>
  );
}
